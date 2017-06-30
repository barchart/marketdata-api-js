const utilities = require('barchart-marketdata-utilities');

const CumulativeVolume = require('./CumulativeVolume'),
	Profile = require('./Profile'),
	Quote = require('./Quote');

const dayCodeToNumber = require('./../util/convertDayCodeToNumber');

module.exports = (() => {
	'use strict';

	function MarketStateInternal() {
		const _book = {};
		const _quote = {};
		const _cvol = {};

		let _timestamp;

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
			let cv = _cvol[symbol];

			if (!cv) {
				cv = {
					container: null,
					callbacks: [ ]
				};

				const producerSymbol = utilities.symbolParser.getProducerSymbol(symbol);
				const producerCvol = _cvol[producerSymbol];

				if (producerCvol && producerCvol.container) {
					cv.container = CumulativeVolume.clone(symbol, producerCvol.container);
				}

				_cvol[symbol] = cv;
			}

			return cv;
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
				const producerProfile = Profile.Profiles[producerSymbol];

				if (producerProfile) {
					p = new Profile(symbol, producerProfile.name, producerProfile.exchange, producerProfile.unitcode, producerProfile.pointValue, producerProfile.tickIncrement);
				}
			}

			return p;
		};

		const _processMessage = (message) => {
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
				let container = cv.container;

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

			if (q.day && message.day) {
				const dayNum = dayCodeToNumber(message.day);

				if (dayNum > q.dayNum || q.dayNum - dayNum > 5) {
					// Roll the quote
					q.day = message.day;
					q.dayNum = dayNum;
					q.flag = 'p';
					q.bidPrice = 0.0;
					q.bidSize = undefined;
					q.askPrice = undefined;
					q.askSize = undefined;
					if (q.settlementPrice) {
						q.previousPrice = q.settlementPrice;
						q.settlementPrice = undefined;
					} else if (q.lastPrice) {
						q.previousPrice = q.lastPrice;
					}
					q.lastPrice = undefined;
					q.tradePrice = undefined;
					q.tradeSize = undefined;
					q.numberOfTrades = undefined;
					q.openPrice = undefined;
					q.highPrice = undefined;
					q.lowPrice = undefined;
					q.volume = undefined;
				} else if (q.dayNum > dayNum) {
					return;
				}
			}
			else {
				return;
			}

			const cv = _cvol[symbol];

			switch (message.type) {
				case 'HIGH':
					q.highPrice = message.value;
					break;
				case 'LOW':
					q.lowPrice = message.value;
					break;
				case 'OPEN':
					q.flag = undefined;
					q.openPrice = message.value;
					q.highPrice = message.value;
					q.lowPrice = message.value;
					q.lastPrice = message.value;

					if (cv && cv.container) {
						cv.container.reset();
					}

					break;
				case 'OPEN_INTEREST':
					q.openInterest = message.value;
					break;
				case 'REFRESH_DDF':
					switch (message.subrecord) {
						case '1':
						case '2':
						case '3':
							q.message = message;
							if (message.openPrice === null) {
								q.openPrice = undefined;
							} else if (message.openPrice) {
								q.openPrice = message.openPrice;
							}
							if (message.highPrice === null) {
								q.highPrice = undefined;
							} else if (message.highPrice) {
								q.highPrice = message.highPrice;
							}
							if (message.lowPrice === null) {
								q.lowPrice = undefined;
							} else if (message.lowPrice) {
								q.lowPrice = message.lowPrice;
							}
							if (message.lastPrice === null) {
								q.lastPrice = undefined;
							} else if (message.lastPrice) {
								q.lastPrice = message.lastPrice;
							}
							if (message.bidPrice === null) {
								q.bidPrice = undefined;
							} else if (message.bidPrice) {
								q.bidPrice = message.bidPrice;
							}
							if (message.askPrice === null) {
								q.askPrice = undefined;
							} else if (message.askPrice) {
								q.askPrice = message.askPrice;
							}
							if (message.previousPrice === null) {
								q.previousPrice = undefined;
							} else if (message.previousPrice) {
								q.previousPrice = message.previousPrice;
							}
							if (message.settlementPrice === null) {
								q.settlementPrice = undefined;
								if (q.flag == 's') {
									q.flag = undefined;
								}
							} else if (message.settlementPrice) {
								q.settlementPrice = message.settlementPrice;
							}
							if (message.volume === null) {
								q.volume = undefined;
							} else if (message.volume) {
								q.volume = message.volume;
							}
							if (message.openInterest === null) {
								q.openInterest = undefined;
							} else if (message.openInterest) {
								q.openInterest = message.openInterest;
							}
							if (message.subsrecord == '1') {
								q.lastUpdate = message.time;
							}
							break;
					}
					break;
				case 'REFRESH_QUOTE':
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
					if (message.tradeTime) {
						q.time = message.tradeTime;
					} else if (message.timeStamp) {
						q.time = message.timeStamp;
					}
					break;
				case 'SETTLEMENT':
					q.lastPrice = message.value;
					q.settlement = message.value;
					if (message.element === 'D') {
						q.flag = 's';
					}
					break;
				case 'TOB':
					q.bidPrice = message.bidPrice;
					q.bidSize = message.bidSize;
					q.askPrice = message.askPrice;
					q.askSize = message.askSize;
					if (message.time) {
						q.time = message.time;
					}
					break;
				case 'TRADE':
					q.flag = undefined;
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

					if (!q.numberOfTrades) {
						q.numberOfTrades = 0;
					}
					q.numberOfTrades++;

					if (message.time) {
						q.time = message.time;
					}

					if (cv && cv.container && message.tradePrice && message.tradeSize) {
						cv.container.incrementVolume(q.tradePrice, q.tradeSize);
					}
					break;
				case 'TRADE_OUT_OF_SEQUENCE':
					if (message.tradeSize) {
						q.volume += message.tradeSize;
					}

					if (cv && cv.container && message.tradePrice && message.tradeSize) {
						cv.container.incrementVolume(q.tradePrice, q.tradeSize);
					}

					break;
				case 'VOLUME':
					q.volume = message.value;
					break;
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

		const _getBook = (symbol) => {
			return 	_book[symbol];
		};

		const _getCumulativeVolume = (symbol, callback) => {
			let cv = _getOrCreateCumulativeVolume(symbol);
			let promise;

			if (cv.container) {
				promise = Promise.resolve(cv.container);
			} else {
				promise = new Promise((resolveCallback) => {
					cv.callbacks.push(resolveCallback);
				});
			}

			return promise.then((cv) => {
				if (typeof callback === 'function') {
					callback(cv);
				}

				return cv;
			});
		};

		const _getProfile = (symbol, callback) => {
			let profile = _getOrCreateProfile(symbol);
			let promise;

			if (profile) {
				promise = Promise.resolve(profile);
			} else {
				promise = Promise.resolve(null);
			}

			return promise.then((p) => {
				if (typeof callback === 'function') {
					callback(p);
				}

				return p;
			});
		};

		const _getQuote = (symbol) => {
			return _quote[symbol];
		};

		const _getTimestamp = () => {
			return _timestamp;
		};

		return {
			getBook: _getBook,
			getCumulativeVolume: _getCumulativeVolume,
			getProfile: _getProfile,
			getQuote: _getQuote,
			getTimestamp: _getTimestamp,
			processMessage : _processMessage
		};
	}

	/**
	 * @typedef Book
	 * @type Object
	 * @property {string} symbol
	 * @property {Object[]} bids
	 * @property {Object[]} asks
	 */

	/**
	 * <p>Repository for current market state. This repository will only contain
	 * data for an instrument after a subscription has been established using
	 * the {@link Connection#on} function.</p>
	 * <p>Access the singleton instance using the {@link ConnectionBase#getMarketState}
	 * function.</p>
	 *
	 * @public
	 */
	class MarketState {
		constructor() {
			this._internal = MarketStateInternal();
		}

		/**
		 * @public
		 * @param {string} symbol
		 * @return {Book}
		 */
		getBook(symbol) {
			return this._internal.getBook(symbol);
		}

		/**
		 * @public
		 * @param {string} symbol
		 * @param {function=} callback - invoked when the {@link CumulativeVolume} instance becomes available
		 * @returns {Promise} The {@link CumulativeVolume} instance, as a promise
		 */
		getCumulativeVolume(symbol, callback) {
			return this._internal.getCumulativeVolume(symbol, callback);
		}

		/**
		 * @public
		 * @param {string} symbol
		 * @param {function=} callback - invoked when the {@link Profile} instance becomes available
		 * @returns {Promise} The {@link Profile} instance, as a promise.
		 */
		getProfile(symbol, callback) {
			return this._internal.getProfile(symbol, callback);
		}

		/**
		 * @public
		 * @param {string} symbol
		 * @return {Quote}
		 */
		getQuote(symbol) {
			return this._internal.getQuote(symbol);
		}

		/**
		 * Returns the time the most recent market data message was received.
		 * @public
		 * @return {Date}
		 */
		getTimestamp() {
			return this._internal.getTimestamp();
		}

		/**
		 * @ignore
		 */
		processMessage(message) {
			return this._internal.processMessage(message);
		}

		/**
		 * @ignore
		 */
		static get CumulativeVolume() {
			return CumulativeVolume;
		}

		/**
		 * @ignore
		 */
		static get Profile() {
			return Profile;
		}

		/**
		 * @ignore
		 */
		static get Quote() {
			return Quote;
		}
	}

    return MarketState;
})();