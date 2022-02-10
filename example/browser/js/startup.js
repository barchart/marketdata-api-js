const version = require('./../../../lib/meta').version;

const Connection = require('./../../../lib/connection/Connection');

const timezones = require('./../../../lib/utilities/data/timezones');

const formatDecimal = require('./../../../lib/utilities/format/decimal'),
	formatPrice = require('./../../../lib/utilities/format/price'),
	formatQuote = require('./../../../lib/utilities/format/quote');

const AssetClass = require('./../../../lib/utilities/data/AssetClass');

const Profile = require('./../../../lib/marketState/Profile');

const formatterForCmdtyView = require('./../../../lib/utilities/format/specialized/cmdtyView');

module.exports = (() => {
	'use strict';

	Profile.setPriceFormatterCustom(formatterForCmdtyView);

	var PageModel = function() {
		var that = this;
		var connection = null;
		var diagnostics = null;

		that.hostname = ko.observable('wsqs-cf.aws.barchart.com');

		var timezoneLocal = timezones.guessTimezone();
		var timezonesList = [ ];

		timezonesList.push('Variable/Exchange_Local');
		timezonesList.push('');

		if (timezoneLocal) {
			timezonesList.push(timezoneLocal);
			timezonesList.push('');
		}

		function addTimezone(t) {
			if (t !== timezoneLocal) {
				timezonesList.push(t);
			}
		}

		addTimezone('America/Chicago');
		addTimezone('America/New_York');
		addTimezone('America/Los_Angeles');
		addTimezone('Europe/London');
		addTimezone('Europe/Paris');
		addTimezone('Europe/Minsk');
		addTimezone('Asia/Tokyo');

		timezonesList.push('');

		that.timezone = ko.observable('Variable/Exchange_Local');
		that.timezones = ko.observableArray(timezonesList.concat(timezones.getTimezones()));

		that.username = ko.observable('');
		that.password = ko.observable('');

		that.replayFile = ko.observable('$M1LX.ddf');
		that.replaySymbols = ko.observable('$M1LX');
		that.replayIndex = ko.observable(0);

		that.symbol = ko.observable('');
		that.symbolFocus = ko.observable(false);

		that.mode = ko.observable('Streaming');

		that.activeTemplate = ko.observable('disconnected-template');

		that.version = ko.observable(version);

		that.connected = ko.observable(false);
		that.connecting = ko.observable(false);
		that.paused = ko.observable(false);

		that.canConnect = ko.computed(function() {
			return !that.connecting() && !that.connected();
		});
		that.canDisconnect = ko.computed(function() {
			return that.connected();
		});
		that.canPause = ko.computed(function() {
			return !that.paused();
		});
		that.canResume = ko.computed(function() {
			return that.paused();
		});
		that.canReset = ko.computed(function() {
			var connected = that.connected();
			var activeTemplate = that.activeTemplate();

			return connected && activeTemplate !== 'grid-template';
		});

		that.diagnosticsIndex = ko.observable(0);

		that.diagnosticsEnabled = ko.computed(function() {
			var hostname = that.hostname();

			return hostname === 'localhost';
		});

		that.rows = ko.observableArray();
		that.item = ko.observable(null);
		that.profile = ko.observable(null);

		var handleEvents = function(data) {
			if (data.event) {
				var event = data.event;

				if (event === 'login success') {
					that.connecting(false);
					that.connected(true);

					if (that.diagnosticsEnabled() && diagnostics === null) {
						that.diagnosticsIndex(0);

						diagnostics = connection.getDiagnosticsController();

						var replayFile = that.replayFile();
						var replaySymbols = that.replaySymbols().toString().split(',');

						var subscriptions = [];

						function bindReplaySymbol(s) {
							var model = new RowModel(s, that.timezone);

							var handleMarketUpdate = function(message) {
								model.quote(connection.getMarketState().getQuote(s));
							};

							model.setMarketUpdateHandler(handleMarketUpdate);

							that.rows.push(model);

							var subscription = {};

							subscription.symbol = s;
							subscription.callback = handleMarketUpdate;

							subscriptions.push(subscription);
						}

						for (var i = 0; i < replaySymbols.length; i++) {
							bindReplaySymbol(replaySymbols[i]);
						}

						diagnostics.initialize(replayFile, subscriptions);
					}

					that.showGrid();
				} else if (event === 'login fail') {
					that.disconnect();
				} else if (event === 'feed paused') {
					that.paused(true);
				} else if (event === 'feed resumed') {
					that.paused(false);
				}

				toastr.info(data.event);
			}
		};

		that.itemDisplay = ko.computed(function() {
			var item = that.item();

			if (item && item.quote()) {
				return JSON.stringify(item.quote(), null, 2);
			} else {
				return null;
			}
		});

		that.profileDisplay = ko.computed(function() {
			var profile = that.profile();

			if (profile) {
				return JSON.stringify(profile, null, 2);
			} else {
				return 'Loading Profile...';
			}
		});

		that.connect = function() {
			that.disconnect();

			var hostname = that.hostname();
			var username = that.username();
			var password = that.password();

			if (!hostname) {
				return;
			}

			var diagnosticsEnabled = that.diagnosticsEnabled();
			var replayFile = that.replayFile();
			var replaySymbols = that.replaySymbols();

			if (diagnosticsEnabled) {
				if (!replayFile || !replaySymbols) {
					return;
				}

				username = 'anonymous';
				password = 'anonymous';

				that.username(username);
				that.password(password);
			} else {
				if (!username || !password) {
					return;
				}
			}

			that.connecting(true);

			if (connection) {
				connection.off('events', handleEvents);
			}

			connection = new Connection();

			connection.setExtendedProfileMode(true);
			connection.setExtendedQuoteMode(true);

			connection.on('events', handleEvents);

			connection.connect(hostname, username, password);
		};

		that.disconnect = function() {
			if (connection === null) {
				return;
			}

			connection.disconnect();

			connection = null;
			diagnostics = null;

			that.rows.removeAll();

			that.connecting(false);
			that.connected(false);
			that.paused(false);

			that.replayIndex(0);

			that.activeTemplate('disconnected-template');
		};

		that.pause = function() {
			connection.pause();
		};

		that.resume = function() {
			connection.resume();
		};

		that.handleLoginKeypress = function(d, e) {
			if (e.keyCode === 13) {
				that.connect();
			}

			return true;
		};

		that.addSymbol = function() {
			var symbol = that.symbol();

			if (!symbol) {
				return;
			}

			var symbols;

			if (symbol === '#SP500') {
				symbols = SP_500.slice(0, 3);
			} else if (symbol === '#C3') {
				symbols = C3;
			} else if (symbol === '#C3_OLD') {
				symbols = C3_OLD;
			} else if (symbol === '#CMDTY') {
				symbols = CMDTY;
			} else if (symbol === '#PLATTS') {
				symbols = PLATTS;
			} else if (symbol === '#BOTH') {
				symbols = BOTH;
			} else if (symbol === '#AG') {
				symbols = AG;
			} else {
				symbols = [ symbol ];
			}

			function execute(s) {
				var model = new RowModel(s, that.timezone);

				var handleMarketUpdate = function(message) {
					model.quote(connection.getMarketState().getQuote(s));
				};

				model.setMarketUpdateHandler(handleMarketUpdate);

				connection.on('marketUpdate', handleMarketUpdate, s);

				that.rows.push(model);
			}

			for (var i = 0; i < symbols.length; i++) {
				execute(symbols[i]);
			}

			that.showGrid();
		};

		that.lookupProfile = function() {
			var symbol = that.symbol();

			if (!symbol) {
				return;
			}

			that.showProfile(null);

			return connection.getMarketState().getProfile(symbol)
				.then(function(profile) {
					if (that.activeTemplate() === 'profile-template') {
						that.showProfile(profile);
					}
				});
		};

		that.removeSymbol = function(model) {
			if (model.getMarketUpdateHandler()) {
				connection.off('marketUpdate', model.getMarketUpdateHandler(), model.symbol);
			}

			if (model.getCumulativeVolumeHandler()) {
				connection.off('cumulativeVolume', model.getCumulativeVolumeHandler(), model.symbol);
			}

			that.rows.remove(model);
		};

		that.handleSymbolKeypress = function(d, e) {
			if (e.keyCode === 13) {
				that.addSymbol();
			}

			return true;
		};

		that.showGrid = function() {
			that.activeTemplate('grid-template');

			that.item(null);
			that.profile(null);

			if (!that.diagnosticsEnabled()) {
				that.symbolFocus(true);
			}
		};

		that.showItemDetail = function(model) {
			that.symbol(model.symbol);

			that.item(model);
			that.profile(null);

			that.activeTemplate('grid-item-details');
		};

		that.showProfile = function(profile) {
			that.item(null);
			that.profile(profile);

			that.activeTemplate('profile-template');
		};

		that.showCumulativeVolume = function(model) {
			that.symbol(model.symbol);

			that.item(model);
			that.profile(null);

			that.activeTemplate('grid-cumulative-volume-template');

			var symbol = model.symbol;
			var priceLevels = model.priceLevels;

			if (!model.getCumulativeVolumeHandler()) {
				connection.getMarketState().getCumulativeVolume(symbol)
					.then(function(cumulativeVolume) {
						var items = cumulativeVolume.toArray();

						for (var i = 0; i < items.length; i++) {
							var item = items[i];

							priceLevels.push(new PriceLevelModel(item.price, item.volume));
						}

						model.cumulativeVolumeReady(true);
					});

				var handleCumulativeVolume = function(message) {
					if (!model.cumulativeVolumeReady()) {
						return;
					}

					if (message.event === 'reset') {
						priceLevels.removeAll();
					} else if (message.event === 'update') {
						var firstPriceLevel = null;

						var priceLevel = ko.utils.arrayFirst(priceLevels(), function(item) {
							if (firstPriceLevel === null) {
								firstPriceLevel = item;
							}

							return message.price === item.price();
						}) || null;

						var existing = priceLevel !== null;

						if (existing) {
							priceLevel.volume(message.volume);
						} else {
							priceLevel = new PriceLevelModel(message.price, message.volume);

							if (priceLevels.length === 0 || firstPriceLevel.price() > message.price()) {
								priceLevels.unshift(priceLevel);
							} else {
								priceLevels.push(priceLevel);
							}
						}

						var last = model.priceLevelLast();

						if (last !== null) {
							last.updated(false);
						}

						priceLevel.updated(true);

						model.priceLevelLast(priceLevel);
					}
				};

				model.setCumulativeVolumeHandler(handleCumulativeVolume);
				connection.on('cumulativeVolume', handleCumulativeVolume, symbol);
			}
		};

		that.setStreamingMode = function() {
			that.mode('Streaming');

			if (connection !== null) {
				connection.setPollingFrequency(null);
			}
		};

		that.setPollingMode = function() {
			that.mode('Polling');

			if (connection !== null) {
				connection.setPollingFrequency(5000);
			}
		};

		that.diagnosticsScroll = function() {
			if (that.diagnosticsEnabled() && diagnostics !== null) {
				var desiredIndex = that.diagnosticsIndex();

				try {
					desiredIndex = parseInt(desiredIndex);
				} catch (e) {
					desiredIndex = null;
				}

				if (desiredIndex !== null) {
					diagnostics.scroll(desiredIndex);
				}
			}
		};

		that.diagnosticsNext = function() {
			if (that.diagnosticsEnabled() && diagnostics !== null) {
				diagnostics.next();

				that.replayIndex(that.replayIndex() + 1);
			}
		};

		that.diagnosticsScroll = function() {
			if (that.diagnosticsEnabled() && diagnostics !== null) {
				const scrollIndex = that.replayIndex() + 100;

				diagnostics.scroll(scrollIndex);

				that.replayIndex(scrollIndex);
			}
		};

		that.handleDiagnosticsScrollKeypress = function(d, e) {
			if (e.keyCode === 13) {
				that.addSymbol();
			}

			return true;
		};

		that.disconnect();
	};

	var RowModel = function(symbol, timezone) {
		var that = this;

		that.symbol = symbol;

		that.quote = ko.observable(null);

		that.priceLevels = ko.observableArray();
		that.priceLevelLast = ko.observable(null);

		that.cumulativeVolumeReady = ko.observable(false);

		that.displayTime = ko.computed(function() {
			var q = that.quote();
			var t = timezone();

			if (t === 'Variable/Exchange_Local') {
				t = null;
			}

			if (q !== null) {
				return formatQuote(q, false, false, t || null);
			} else {
				return '';
			}
		});

		that.priceChange = ko.computed(function() {
			var quote = that.quote();

			if (quote && quote.lastPrice && quote.previousPrice) {
				return Math.round((quote.lastPrice - quote.previousPrice) * 100) / 100;
			} else {
				return '';
			}
		});

		that.handlers = { };

		that.setMarketUpdateHandler = function(handler) {
			that.handlers.marketUpdate = handler;
		};

		that.getMarketUpdateHandler = function() {
			return that.handlers.marketUpdate;
		};

		that.setCumulativeVolumeHandler = function(handler) {
			that.handlers.cumulativeVolume = handler;
		};

		that.getCumulativeVolumeHandler = function() {
			return that.handlers.cumulativeVolume;
		};

		that.formatPrice = function(price) {
			return that.quote().profile.formatPrice(price);

			//return formatPrice(price, that.quote().profile.unitCode, '-', true);
		};

		that.formatInteger = function(value) {
			return formatDecimal(value, 0, ',');
		};

		that.formatPercent = function(value) {
			if (value) {
				return (value * 100).toFixed(2) + '%';
			} else {
				return '--';
			}
		};
	};

	var PriceLevelModel = function(price, volume) {
		var that = this;

		that.price = ko.observable(price);
		that.volume = ko.observable(volume);
		that.updated = ko.observable(false);
	};

	const SP_500 = [ 'ABT', 'ABBV', 'ACN', 'ATVI', 'AYI', 'ADBE', 'AMD', 'AAP', 'AES', 'AET', 'AMG', 'AFL', 'A', 'APD', 'AKAM', 'ALK', 'ALB', 'ARE', 'ALXN', 'ALGN', 'ALLE', 'AGN', 'ADS', 'LNT', 'ALL', 'GOOGL', 'GOOG', 'MO', 'AMZN', 'AEE', 'AAL', 'AEP', 'AXP', 'AIG', 'AMT', 'AWK', 'AMP', 'ABC', 'AME', 'AMGN', 'APH', 'APC', 'ADI', 'ANDV', 'ANSS', 'ANTM', 'AON', 'AOS', 'APA', 'AIV', 'AAPL', 'AMAT', 'ADM', 'ARNC', 'AJG', 'AIZ', 'T', 'ADSK', 'ADP', 'AZO', 'AVB', 'AVY', 'BHGE', 'BLL', 'BAC', 'BK', 'BCR', 'BAX', 'BBT', 'BDX', 'BRK.B', 'BBY', 'BIIB', 'BLK', 'HRB', 'BA', 'BWA', 'BXP', 'BSX', 'BHF', 'BMY', 'AVGO', 'BF.B', 'CHRW', 'CA', 'COG', 'CDNS', 'CPB', 'COF', 'CAH', 'CBOE', 'KMX', 'CCL', 'CAT', 'CBG', 'CBS', 'CELG', 'CNC', 'CNP', 'CTL', 'CERN', 'CF', 'SCHW', 'CHTR', 'CHK', 'CVX', 'CMG', 'CB', 'CHD', 'CI', 'XEC', 'CINF', 'CTAS', 'CSCO', 'C', 'CFG', 'CTXS', 'CLX', 'CME', 'CMS', 'COH', 'KO', 'CTSH', 'CL', 'CMCSA', 'CMA', 'CAG', 'CXO', 'COP', 'ED', 'STZ', 'COO', 'GLW', 'COST', 'COTY', 'CCI', 'CSRA', 'CSX', 'CMI', 'CVS', 'DHI', 'DHR', 'DRI', 'DVA', 'DE', 'DLPH', 'DAL', 'XRAY', 'DVN', 'DLR', 'DFS', 'DISCA', 'DISCK', 'DISH', 'DG', 'DLTR', 'D', 'DOV', 'DWDP', 'DPS', 'DTE', 'DRE', 'DUK', 'DXC', 'ETFC', 'EMN', 'ETN', 'EBAY', 'ECL', 'EIX', 'EW', 'EA', 'EMR', 'ETR', 'EVHC', 'EOG', 'EQT', 'EFX', 'EQIX', 'EQR', 'ESS', 'EL', 'ES', 'RE', 'EXC', 'EXPE', 'EXPD', 'ESRX', 'EXR', 'XOM', 'FFIV', 'FB', 'FAST', 'FRT', 'FDX', 'FIS', 'FITB', 'FE', 'FISV', 'FLIR', 'FLS', 'FLR', 'FMC', 'FL', 'F', 'FTV', 'FBHS', 'BEN', 'FCX', 'GPS', 'GRMN', 'IT', 'GD', 'GE', 'GGP', 'GIS', 'GM', 'GPC', 'GILD', 'GPN', 'GS', 'GT', 'GWW', 'HAL', 'HBI', 'HOG', 'HRS', 'HIG', 'HAS', 'HCA', 'HCP', 'HP', 'HSIC', 'HSY', 'HES', 'HPE', 'HLT', 'HOLX', 'HD', 'HON', 'HRL', 'HST', 'HPQ', 'HUM', 'HBAN', 'IDXX', 'INFO', 'ITW', 'ILMN', 'IR', 'INTC', 'ICE', 'IBM', 'INCY', 'IP', 'IPG', 'IFF', 'INTU', 'ISRG', 'IVZ', 'IRM', 'JEC', 'JBHT', 'SJM', 'JNJ', 'JCI', 'JPM', 'JNPR', 'KSU', 'K', 'KEY', 'KMB', 'KIM', 'KMI', 'KLAC', 'KSS', 'KHC', 'KR', 'LB', 'LLL', 'LH', 'LRCX', 'LEG', 'LEN', 'LUK', 'LLY', 'LNC', 'LKQ', 'LMT', 'L', 'LOW', 'LYB', 'MTB', 'MAC', 'M', 'MRO', 'MPC', 'MAR', 'MMC', 'MLM', 'MAS', 'MA', 'MAT', 'MKC', 'MCD', 'MCK', 'MDT', 'MRK', 'MET', 'MTD', 'MGM', 'KORS', 'MCHP', 'MU', 'MSFT', 'MAA', 'MHK', 'TAP', 'MDLZ', 'MON', 'MNST', 'MCO', 'MS', 'MOS', 'MSI', 'MYL', 'NDAQ', 'NOV', 'NAVI', 'NTAP', 'NFLX', 'NWL', 'NFX', 'NEM', 'NWSA', 'NWS', 'NEE', 'NLSN', 'NKE', 'NI', 'NBL', 'JWN', 'NSC', 'NTRS', 'NOC', 'NCLH', 'NRG', 'NUE', 'NVDA', 'ORLY', 'OXY', 'OMC', 'OKE', 'ORCL', 'PCAR', 'PKG', 'PH', 'PDCO', 'PAYX', 'PYPL', 'PNR', 'PBCT', 'PEP', 'PKI', 'PRGO', 'PFE', 'PCG', 'PM', 'PSX', 'PNW', 'PXD', 'PNC', 'RL', 'PPG', 'PPL', 'PX', 'PCLN', 'PFG', 'PG', 'PGR', 'PLD', 'PRU', 'PEG', 'PSA', 'PHM', 'PVH', 'QRVO', 'PWR', 'QCOM', 'DGX', 'Q', 'RRC', 'RJF', 'RTN', 'O', 'RHT', 'REG', 'REGN', 'RF', 'RSG', 'RMD', 'RHI', 'ROK', 'COL', 'ROP', 'ROST', 'RCL', 'CRM', 'SBAC', 'SCG', 'SLB', 'SNI', 'STX', 'SEE', 'SRE', 'SHW', 'SIG', 'SPG', 'SWKS', 'SLG', 'SNA', 'SO', 'LUV', 'SPGI', 'SWK', 'SBUX', 'STT', 'SRCL', 'SYK', 'STI', 'SYMC', 'SYF', 'SNPS', 'SYY', 'TROW', 'TGT', 'TEL', 'FTI', 'TXN', 'TXT', 'TMO', 'TIF', 'TWX', 'TJX', 'TMK', 'TSS', 'TSCO', 'TDG', 'TRV', 'TRIP', 'FOXA', 'FOX', 'TSN', 'UDR', 'ULTA', 'USB', 'UA', 'UAA', 'UNP', 'UAL', 'UNH', 'UPS', 'URI', 'UTX', 'UHS', 'UNM', 'VFC', 'VLO', 'VAR', 'VTR', 'VRSN', 'VRSK', 'VZ', 'VRTX', 'VIAB', 'V', 'VNO', 'VMC', 'WMT', 'WBA', 'DIS', 'WM', 'WAT', 'WEC', 'WFC', 'HCN', 'WDC', 'WU', 'WRK', 'WY', 'WHR', 'WMB', 'WLTW', 'WYN', 'WYNN', 'XEL', 'XRX', 'XLNX', 'XL', 'XYL', 'YUM', 'ZBH', 'ZION', 'ZTS' ];
	const C3 = [ 'AL79MRM1.C3', 'BSP9WGQ1.C3', 'BUT9USM1.C3', 'RA10BGM1.C3' ];
	const C3_OLD = [ 'C3:AL79MRM1', 'C3:BSP9WGQ1', 'C3:RA10BGM1' ];
	const CMDTY = [ 'SCB001.CP', 'MER001.CP', 'ZCBAUS.CM', 'HOPAW001009.CM', 'AE030UBX.CS' , 'UDZZ303N.CS' ];
	const PLATTS = [ 'PLATTS:AAWAB00', 'AAWAB00.PT', 'PLATTS:AAXVA00', 'AAXVA00.PT', 'PLATTS:CBAAF00', 'CBAAF00.PT' ];
	const AG = [ 'ZCPAIA.CM', 'ZCPAIL.CM', 'ZCPAIN.CM', 'ZCPAKS.CM', 'ZCPAMI.CM'  ];
	const BOTH = [ 'ESZ19', 'ESZ9' ];

	$(document).ready(function() {
		var pageModel = new PageModel();

		ko.applyBindings(pageModel, $('body')[0]);
	});
})();