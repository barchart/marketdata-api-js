var utilities = require('barchart-marketdata-utilities');

var CumulativeVolume = require('./CumulativeVolume');
var Profile = require('./Profile');
var Quote = require('./Quote');

var dayCodeToNumber = require('./../util/convertDayCodeToNumber');
var ProfileProvider = require('./../connection/ProfileProvider');

module.exports = (() => {
	'use strict';

	function MarketStateInternal() {
		const _book = {};
		const _quote = {};
		const _cvol = {};

		let _timestamp;

		const _profileProvider = new ProfileProvider();

		const loadProfiles = (symbols) => {
			return _profileProvider.loadProfileData(symbols)
				.then((instrumentData) => {
					instrumentData.forEach((instrumentDataItem) => {
						if (instrumentDataItem.status !== 404) {
							new Profile(
								instrumentDataItem.lookup,
								instrumentDataItem.symbol_description,
								instrumentDataItem.exchange_channel,
								instrumentDataItem.base_code.toString(), // bug in DDF, sends '0' to '9' as 0 to 9, so a JSON number, not string
								instrumentDataItem.point_value,
								instrumentDataItem.tick_increment
							);
						}
					});
				});
		};

		const _getOrCreateBook = (symbol) => {
			let book = _book[symbol];

			if (!book) {
				book = {
					symbol: symbol,
					bids: [],
					asks: []
				};

				const producerSymbol = utilities.symbolParser.getProducerSymbol(symbol);
				const producerBook = _book[producerSymbol];

				if (producerBook) {
					book.bids = producerBook.bids.slice(0);
					book.asks = producerBook.asks.slice(0);
				}

				_book[symbol] = book;
			}

			return book;
		};

		const _getOrCreateCumulativeVolume = (symbol) => {
			let cvol = _cvol[symbol];

			if (!cvol) {
				cvol = {
					container: null,
					callbacks: [ ]
				};

				const producerSymbol = utilities.symbolParser.getProducerSymbol(symbol);
				const producerCvol = _cvol[producerSymbol];

				if (producerCvol && producerCvol.container) {
					cvol.container = CumulativeVolume.clone(symbol, producerCvol.container);
				}

				_cvol[symbol] = cvol;
			}

			return cvol;
		};

		const _getOrCreateQuote = (symbol) => {
			let quote = _quote[symbol];

			if (!quote) {
				const producerSymbol = utilities.symbolParser.getProducerSymbol(symbol);
				const producerQuote = _quote[producerSymbol];

				if (producerQuote) {
					quote = Quote.clone(symbol, producerQuote);
				} else {
					quote = new Quote(symbol);
				}

				_quote[symbol] = quote;
			}

			return quote;
		};

		const _getOrCreateProfile = (symbol) => {
			let p = Profile.Profiles[symbol];

			if (!p) {
				const producerSymbol = utilities.symbolParser.getProducerSymbol(symbol);
				const producerProfile = Profile.prototype.Profiles[producerSymbol];

				if (producerProfile) {
					p = new Profile(symbol, producerProfile.name, producerProfile.exchange, producerProfile.unitcode, producerProfile.pointValue, producerProfile.tickIncrement);
				}
			}

			return p;
		};

		var _processMessage = function(message) {
			const symbol = message.symbol;

			if (message.type === 'TIMESTAMP') {
				_timestamp = message.timestamp;
				return;
			}

			// Process book messages first, they don't need profiles, etc.
			if (message.type === 'BOOK') {
				const b = _getOrCreateBook(symbol);

				b.asks = message.asks;
				b.bids = message.bids;

				return;
			}

			if (message.type == 'REFRESH_CUMULATIVE_VOLUME') {
				let cv = _getOrCreateCumulativeVolume(symbol);
				let container = cvol.container;

				if (container) {
					container.reset();
				} else {
					cv.container = container = new CumulativeVolume(symbol, message.tickIncrement);

					const callbacks = cv.callbacks || [ ];

					callbacks.forEach((callback) => {
						callback(container);
					});

					cv.callbacks = null;
				}

				var priceLevels = message.priceLevels;

				message.priceLevels.forEach((priceLevel) => {
					container.incrementVolume(priceLevel.price, priceLevel.volume);
				});

				return;
			}

			let p = _getOrCreateProfile(symbol);

			if ((!p) && (message.type !== 'REFRESH_QUOTE')) {
				console.warn('No profile found for ' + symbol);
				console.log(message);

				return;
			}

			let q = _getOrCreateQuote(symbol);

			if (!q.day && message.day) {
				q.day = message.day;
				q.dayNum = dayCodeToNumber(q.day);
			}

			// resume translation here...

			if (q.day && message.day) {
				var dayNum = dayCodeToNumber(message.day);

				if ((dayNum > q.dayNum) || ((q.dayNum - dayNum) > 5)) {
					// Roll the quote
					q.day = message.day;
					q.dayNum = dayNum;
					q.flag = 'p';
					q.bidPrice = 0.0;
					q.bidSize = undefined;
					q.askPrice = undefined;
					q.askSize = undefined;
					if (q.settlementPrice)
						q.previousPrice = q.settlementPrice;
					else if (q.lastPrice)
						q.previousPrice = q.lastPrice;
					q.lastPrice = undefined;
					q.tradePrice = undefined;
					q.tradeSize = undefined;
					q.numberOfTrades = undefined;
					q.openPrice = undefined;
					q.highPrice = undefined;
					q.lowPrice = undefined;
					q.volume = undefined;
				}
				else if (q.dayNum > dayNum)
					return;
			}
			else {
				return;
			}

			switch (message.type) {
				case 'HIGH': {
					q.highPrice = message.value;
					break;
				}
				case 'LOW': {
					q.lowPrice = message.value;
					break;
				}
				case 'OPEN': {
					q.flag = undefined;
					q.openPrice = message.value;
					q.highPrice = message.value;
					q.lowPrice = message.value;
					q.lastPrice = message.value;

					var cv = _cvol[symbol];

					if (cv && cv.container) {
						cv.container.reset();
					}

					break;
				}
				case 'OPEN_INTEREST': {
					q.openInterest = message.value;
					break;
				}
				case 'REFRESH_DDF': {
					switch (message.subrecord) {
						case '1':
						case '2':
						case '3': {
							q.message = message;
							if (message.openPrice === null)
								q.openPrice = undefined;
							else if (message.openPrice)
								q.openPrice = message.openPrice;

							if (message.highPrice === null)
								q.highPrice = undefined;
							else if (message.highPrice)
								q.highPrice = message.highPrice;

							if (message.lowPrice === null)
								q.lowPrice = undefined;
							else if (message.lowPrice)
								q.lowPrice = message.lowPrice;

							if (message.lastPrice === null)
								q.lastPrice = undefined;
							else if (message.lastPrice)
								q.lastPrice = message.lastPrice;

							if (message.bidPrice === null)
								q.bidPrice = undefined;
							else if (message.bidPrice)
								q.bidPrice = message.bidPrice;

							if (message.askPrice === null)
								q.askPrice = undefined;
							else if (message.askPrice)
								q.askPrice = message.askPrice;

							if (message.previousPrice === null)
								q.previousPrice = undefined;
							else if (message.previousPrice)
								q.previousPrice = message.previousPrice;

							if (message.settlementPrice === null) {
								q.settlementPrice = undefined;
								if (q.flag == 's')
									q.flag = undefined;
							}
							else if (message.settlementPrice)
								q.settlementPrice = message.settlementPrice;

							if (message.volume === null)
								q.volume = undefined;
							else if (message.volume)
								q.volume = message.volume;

							if (message.openInterest === null)
								q.openInterest = undefined;
							else if (message.openInterest)
								q.openInterest = message.openInterest;

							if (message.subsrecord == '1')
								q.lastUpdate = message.time;

							break;
						}
					}
					break;
				}
				case 'REFRESH_QUOTE': {
					p = new Profile(symbol, message.name, message.exchange, message.unitcode, message.pointValue, message.tickIncrement);

					q.message = message;
					q.flag = message.flag;
					q.mode = message.mode;
					q.lastUpdate = message.lastUpdate;
					q.bidPrice = message.bidPrice;
					q.bidSize = message.bidSize;
					q.askPrice = message.askPrice;
					q.askSize = message.askSize;
					q.lastPrice = message.lastPrice;
					q.tradeSize = message.tradeSize;
					q.numberOfTrades = message.numberOfTrades;
					q.previousPrice = message.previousPrice;
					q.settlementPrice = message.settlementPrice;
					q.openPrice = message.openPrice;
					q.highPrice = message.highPrice;
					q.lowPrice = message.lowPrice;
					q.volume = message.volume;
					q.openInterest = message.openInterest;

					if (message.tradeTime)
						q.time = message.tradeTime;
					else if (message.timeStamp)
						q.time = message.timeStamp;
					break;
				}
				case 'SETTLEMENT': {
					q.lastPrice = message.value;
					q.settlement = message.value;
					if (message.element == 'D')
						q.flag = 's';
					break;
				}
				case 'TOB': {
					q.bidPrice = message.bidPrice;
					q.bidSize = message.bidSize;
					q.askPrice = message.askPrice;
					q.askSize = message.askSize;
					if (message.time)
						q.time = message.time;

					break;
				}
				case 'TRADE': {
					q.tradePrice = message.tradePrice;
					q.lastPrice = message.tradePrice;
					if (message.tradeSize) {
						q.tradeSize = message.tradeSize;
						q.volume += message.tradeSize;
					}

					q.ticks.push({price: q.tradePrice, size: q.tradeSize});
					while (q.ticks.length > 50) {
						q.ticks.shift();
					}

					if (!q.numberOfTrades)
						q.numberOfTrades = 0;

					q.numberOfTrades++;

					if (message.time)
						q.time = message.time;

					q.flag = undefined;

					var cv = _cvol[symbol];

					if (cv && cv.container && message.tradePrice && message.tradeSize) {
						cv.container.incrementVolume(q.tradePrice, q.tradeSize);
					}

					// TO DO: Add Time and Sales Tracking
					break;
				}
				case 'TRADE_OUT_OF_SEQUENCE': {
					if (message.tradeSize) {
						q.volume += message.tradeSize;
					}

					var cv = _cvol[symbol];

					if (cv && cv.container && message.tradePrice && message.tradeSize) {
						cv.container.incrementVolume(q.tradePrice, q.tradeSize);
					}

					break;
				}
				case 'VOLUME': {
					q.volume = message.value;
					break;
				}
				case 'VOLUME_YESTERDAY':
					break;
				case 'VWAP':
					q.vwap1 = message.value;
					break;
				default:
					console.error('Unhandled Market Message:');
					console.log(message);
					break;
			}
		};

		return {
			getBook: function(symbol) {
				return _book[symbol];
			},
			getCumulativeVolume: function(symbol, callback) {
				var cv = _getOrCreateCumulativeVolume(symbol);

				if (cv.container) {
					callback(cv.container);
				} else {
					cv.callbacks.push(callback);
				}
			},
			getProfile: function(symbol, callback) {
				let profile = _getOrCreateProfile(symbol);
				let promise;

				if (profile) {
					promise = Promise.resolve(profile);
				} else {
					promise = loadProfiles([symbol])
						.then(() => {
							return Profile.Profiles[symbol];
						});
				}

				promise = promise.then((p) => {
					if (typeof callback === 'function') {
						callback(p);
					}

					return p;
				});
			},
			getQuote: function(symbol) {
				return _quote[symbol];
			},
			getTimestamp: function() {
				return _timestamp;
			},
			processMessage : _processMessage
		};
	};

	MarketState.CumulativeVolume = CumulativeVolume;
	MarketState.Profile = Profile;
    MarketState.Quote = Quote;

    return MarketState;
})();