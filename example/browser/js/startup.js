const version = require('./../../../lib/meta').version;

const Connection = require('./../../../lib/connection/Connection'),
	retrieveConcreteSymbol = require('./../../../lib/connection/snapshots/symbols/retrieveConcrete');

module.exports = (() => {
	'use strict';

	var PageModel = function() {
		var that = this;
		var connection = null;

		that.server = ko.observable('qsws-us-e-02.aws.barchart.com');

		that.username = ko.observable('');
		that.password = ko.observable('');

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

		that.rows = ko.observableArray();
		that.item = ko.observable(null);
		that.profile = ko.observable(null);

		var handleEvents = function(data) {
			if (data.event) {
				var event = data.event;

				if (event === 'login success') {
					that.connecting(false);
					that.connected(true);

					that.showGrid();
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

			var server = that.server();
			var username = that.username();
			var password = that.password();

			if (!server || !username || !password) {
				return;
			}

			that.connecting(true);

			if (connection) {
				connection.off('events', handleEvents);
			}

			connection = new Connection();

			connection.on('events', handleEvents);

			connection.connect(server, username, password);
		};

		that.disconnect = function() {
			if (connection === null) {
				return;
			}

			connection.disconnect();
			connection = null;

			that.rows.removeAll();

			that.connecting(false);
			that.connected(false);
			that.paused(false);

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
			} else if (symbol === '#CMDTY_OLD') {
				symbols = CMDTY_OLD;
			} else if (symbol === '#PLATTS') {
				symbols = PLATTS;
			} else {
				symbols = [ symbol ];
			}

			function execute(s) {
				var model = new RowModel(s);

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

			retrieveConcreteSymbol(symbol)
				.then(function(resolvedSymbol) {
					return connection.getMarketState().getProfile(resolvedSymbol)
						.then(function(profile) {
							if (that.activeTemplate() === 'profile-template') {
								that.showProfile(profile);
							}
						});
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

			that.symbolFocus(true);
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

		that.disconnect();
	};

	var RowModel = function(symbol) {
		var that = this;

		that.symbol = symbol;

		that.quote = ko.observable(null);

		that.priceLevels = ko.observableArray();
		that.priceLevelLast = ko.observable(null);

		that.cumulativeVolumeReady = ko.observable(false);

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
	};

	var PriceLevelModel = function(price, volume) {
		var that = this;

		that.price = ko.observable(price);
		that.volume = ko.observable(volume);
		that.updated = ko.observable(false);
	};

	const SP_500 = [ 'ABT', 'ABBV', 'ACN', 'ATVI', 'AYI', 'ADBE', 'AMD', 'AAP', 'AES', 'AET', 'AMG', 'AFL', 'A', 'APD', 'AKAM', 'ALK', 'ALB', 'ARE', 'ALXN', 'ALGN', 'ALLE', 'AGN', 'ADS', 'LNT', 'ALL', 'GOOGL', 'GOOG', 'MO', 'AMZN', 'AEE', 'AAL', 'AEP', 'AXP', 'AIG', 'AMT', 'AWK', 'AMP', 'ABC', 'AME', 'AMGN', 'APH', 'APC', 'ADI', 'ANDV', 'ANSS', 'ANTM', 'AON', 'AOS', 'APA', 'AIV', 'AAPL', 'AMAT', 'ADM', 'ARNC', 'AJG', 'AIZ', 'T', 'ADSK', 'ADP', 'AZO', 'AVB', 'AVY', 'BHGE', 'BLL', 'BAC', 'BK', 'BCR', 'BAX', 'BBT', 'BDX', 'BRK.B', 'BBY', 'BIIB', 'BLK', 'HRB', 'BA', 'BWA', 'BXP', 'BSX', 'BHF', 'BMY', 'AVGO', 'BF.B', 'CHRW', 'CA', 'COG', 'CDNS', 'CPB', 'COF', 'CAH', 'CBOE', 'KMX', 'CCL', 'CAT', 'CBG', 'CBS', 'CELG', 'CNC', 'CNP', 'CTL', 'CERN', 'CF', 'SCHW', 'CHTR', 'CHK', 'CVX', 'CMG', 'CB', 'CHD', 'CI', 'XEC', 'CINF', 'CTAS', 'CSCO', 'C', 'CFG', 'CTXS', 'CLX', 'CME', 'CMS', 'COH', 'KO', 'CTSH', 'CL', 'CMCSA', 'CMA', 'CAG', 'CXO', 'COP', 'ED', 'STZ', 'COO', 'GLW', 'COST', 'COTY', 'CCI', 'CSRA', 'CSX', 'CMI', 'CVS', 'DHI', 'DHR', 'DRI', 'DVA', 'DE', 'DLPH', 'DAL', 'XRAY', 'DVN', 'DLR', 'DFS', 'DISCA', 'DISCK', 'DISH', 'DG', 'DLTR', 'D', 'DOV', 'DWDP', 'DPS', 'DTE', 'DRE', 'DUK', 'DXC', 'ETFC', 'EMN', 'ETN', 'EBAY', 'ECL', 'EIX', 'EW', 'EA', 'EMR', 'ETR', 'EVHC', 'EOG', 'EQT', 'EFX', 'EQIX', 'EQR', 'ESS', 'EL', 'ES', 'RE', 'EXC', 'EXPE', 'EXPD', 'ESRX', 'EXR', 'XOM', 'FFIV', 'FB', 'FAST', 'FRT', 'FDX', 'FIS', 'FITB', 'FE', 'FISV', 'FLIR', 'FLS', 'FLR', 'FMC', 'FL', 'F', 'FTV', 'FBHS', 'BEN', 'FCX', 'GPS', 'GRMN', 'IT', 'GD', 'GE', 'GGP', 'GIS', 'GM', 'GPC', 'GILD', 'GPN', 'GS', 'GT', 'GWW', 'HAL', 'HBI', 'HOG', 'HRS', 'HIG', 'HAS', 'HCA', 'HCP', 'HP', 'HSIC', 'HSY', 'HES', 'HPE', 'HLT', 'HOLX', 'HD', 'HON', 'HRL', 'HST', 'HPQ', 'HUM', 'HBAN', 'IDXX', 'INFO', 'ITW', 'ILMN', 'IR', 'INTC', 'ICE', 'IBM', 'INCY', 'IP', 'IPG', 'IFF', 'INTU', 'ISRG', 'IVZ', 'IRM', 'JEC', 'JBHT', 'SJM', 'JNJ', 'JCI', 'JPM', 'JNPR', 'KSU', 'K', 'KEY', 'KMB', 'KIM', 'KMI', 'KLAC', 'KSS', 'KHC', 'KR', 'LB', 'LLL', 'LH', 'LRCX', 'LEG', 'LEN', 'LUK', 'LLY', 'LNC', 'LKQ', 'LMT', 'L', 'LOW', 'LYB', 'MTB', 'MAC', 'M', 'MRO', 'MPC', 'MAR', 'MMC', 'MLM', 'MAS', 'MA', 'MAT', 'MKC', 'MCD', 'MCK', 'MDT', 'MRK', 'MET', 'MTD', 'MGM', 'KORS', 'MCHP', 'MU', 'MSFT', 'MAA', 'MHK', 'TAP', 'MDLZ', 'MON', 'MNST', 'MCO', 'MS', 'MOS', 'MSI', 'MYL', 'NDAQ', 'NOV', 'NAVI', 'NTAP', 'NFLX', 'NWL', 'NFX', 'NEM', 'NWSA', 'NWS', 'NEE', 'NLSN', 'NKE', 'NI', 'NBL', 'JWN', 'NSC', 'NTRS', 'NOC', 'NCLH', 'NRG', 'NUE', 'NVDA', 'ORLY', 'OXY', 'OMC', 'OKE', 'ORCL', 'PCAR', 'PKG', 'PH', 'PDCO', 'PAYX', 'PYPL', 'PNR', 'PBCT', 'PEP', 'PKI', 'PRGO', 'PFE', 'PCG', 'PM', 'PSX', 'PNW', 'PXD', 'PNC', 'RL', 'PPG', 'PPL', 'PX', 'PCLN', 'PFG', 'PG', 'PGR', 'PLD', 'PRU', 'PEG', 'PSA', 'PHM', 'PVH', 'QRVO', 'PWR', 'QCOM', 'DGX', 'Q', 'RRC', 'RJF', 'RTN', 'O', 'RHT', 'REG', 'REGN', 'RF', 'RSG', 'RMD', 'RHI', 'ROK', 'COL', 'ROP', 'ROST', 'RCL', 'CRM', 'SBAC', 'SCG', 'SLB', 'SNI', 'STX', 'SEE', 'SRE', 'SHW', 'SIG', 'SPG', 'SWKS', 'SLG', 'SNA', 'SO', 'LUV', 'SPGI', 'SWK', 'SBUX', 'STT', 'SRCL', 'SYK', 'STI', 'SYMC', 'SYF', 'SNPS', 'SYY', 'TROW', 'TGT', 'TEL', 'FTI', 'TXN', 'TXT', 'TMO', 'TIF', 'TWX', 'TJX', 'TMK', 'TSS', 'TSCO', 'TDG', 'TRV', 'TRIP', 'FOXA', 'FOX', 'TSN', 'UDR', 'ULTA', 'USB', 'UA', 'UAA', 'UNP', 'UAL', 'UNH', 'UPS', 'URI', 'UTX', 'UHS', 'UNM', 'VFC', 'VLO', 'VAR', 'VTR', 'VRSN', 'VRSK', 'VZ', 'VRTX', 'VIAB', 'V', 'VNO', 'VMC', 'WMT', 'WBA', 'DIS', 'WM', 'WAT', 'WEC', 'WFC', 'HCN', 'WDC', 'WU', 'WRK', 'WY', 'WHR', 'WMB', 'WLTW', 'WYN', 'WYNN', 'XEL', 'XRX', 'XLNX', 'XL', 'XYL', 'YUM', 'ZBH', 'ZION', 'ZTS' ];
	const C3 = [ 'AL79MRM1.C3', 'BSP9WGQ1.C3', 'RA10BGM1.C3' ];
	const CMDTY = [ 'BC5L09YB.CS', 'EI3E06EI.CS', 'EI3E06EJ.CS', 'USDA-CORN-COND-EXC-AL-2528.CS', 'EURS-BEET-PRICE-SELL-GBR-33877.CS', 'EUJU0Q51.CS' ];
	const C3_OLD = [ 'C3:AL79MRM1', 'C3:BSP9WGQ1', 'C3:RA10BGM1' ];
	const CMDTY_OLD = [ 'BC5L09YB.CM', 'EI3E06EI.CM', 'EI3E06EJ.CM', 'USDA-CORN-COND-EXC-AL-2528.CM', 'EURS-BEET-PRICE-SELL-GBR-33877.CM', 'EUJU0Q51.CM' ];
	const PLATTS = [ 'PLATTS:RD52017', 'PLATTS:RD5MA17', 'PLATTS:RD52018' ];

	$(document).ready(function() {
		var pageModel = new PageModel();

		ko.applyBindings(pageModel, $('body')[0]);
	});
})();