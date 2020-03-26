const is = require('@barchart/common-js/lang/is'),
	object = require('@barchart/common-js/lang/object'),
	timezone = require('@barchart/common-js/lang/timezone'),
	Timezones = require('@barchart/common-js/lang/Timezones');

const CumulativeVolume = require('./CumulativeVolume'),
	Exchange = require('./Exchange'),
	Profile = require('./Profile'),
	Quote = require('./Quote');

const convertDayCodeToNumber = require('./../utilities/convert/dayCodeToNumber'),
	SymbolParser = require('../utilities/parsers/SymbolParser');

const LoggerFactory = require('./../logging/LoggerFactory');

const version = require('./../meta').version;

module.exports = (() => {
	'use strict';

	let instanceCounter = 0;

	function MarketStateInternal(handleProfileRequest, instance) {
		const _logger = LoggerFactory.getLogger('@barchart/marketdata-api-js');

		const _instance = instance;

		let _timezone = timezone.guessTimezone() || null;
		let _offset;

		if (_timezone !== null) {
			_offset = Timezones.parse(_timezone).getUtcOffset(null, true);
		} else {
			_offset = null;
		}

		_logger.log(`MarketState [ ${_instance} ]: Initializing. Version [ ${version} ]. Using timezone [ ${_timezone} ].`);

		const _exchanges = { };

		const _book = { };
		const _quote = { };
		const _cvol = { };
		const _profileCallbacks = { };
		const _profileExtensions = { };

		let _timestamp;

		const _getOrCreateBook = (symbol) => {
			let book = _book[symbol];

			if (!book) {
				book = {
					symbol: symbol,
					bids: [],
					asks: []
				};

				const producerSymbol = SymbolParser.getProducerSymbol(symbol);
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

				const producerSymbol = SymbolParser.getProducerSymbol(symbol);
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
				const producerSymbol = SymbolParser.getProducerSymbol(symbol);
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

		const _getUtcTimestamp = (symbol, timestamp) => {
			let utc;

			if (_offset !== null) {
				const profile = Profile.Profiles[symbol];

				if (profile && profile.exchangeRef && is.number(profile.exchangeRef.offsetDdf)) {
					const offsetLocal = _offset;
					const offsetDdf = profile.exchangeRef.offsetDdf;

					utc = new Date(timestamp.getTime() + offsetLocal - offsetDdf);
				}
			} else {
				utc = null;
			}

			return utc;
		};

		const _processProfileExtension = (profile, extension) => {
			if (extension.expiration) {
				profile.expiration = extension.expiration;
			}

			if (extension.firstNotice) {
				profile.firstNotice = extension.firstNotice;
			}
		};

		const _createProfile = (symbol, name, exchange, unitCode, pointValue, tickIncrement, additional) => {
			const profile = new Profile(symbol, name, exchange, unitCode, pointValue, tickIncrement, _exchanges[exchange] || null, additional);
			const extension = _profileExtensions[symbol];

			if (extension) {
				_processProfileExtension(profile, extension);

				delete _profileExtensions[symbol];
			}

			if (_profileCallbacks.hasOwnProperty(symbol)) {
				_profileCallbacks[symbol].forEach((profileCallback) => {
					profileCallback(profile);
				});

				delete _profileCallbacks[symbol];
			}

			return profile;
		};

		const _getOrCreateProfile = (symbol) => {
			let profile = Profile.Profiles[symbol];

			if (!profile) {
				const producerSymbol = SymbolParser.getProducerSymbol(symbol);
				const producerProfile = Profile.Profiles[producerSymbol];

				if (producerProfile) {
					profile = _createProfile(symbol, producerProfile.name, producerProfile.exchange, producerProfile.unitCode, producerProfile.pointValue, producerProfile.tickIncrement);

					const extension = { };

					if (producerProfile.expiration) {
						extension.expiration = producerProfile.expiration;
					}

					if (producerProfile.firstNotice) {
						extension.firstNotice = producerProfile.firstNotice;
					}

					_processProfileExtension(profile, extension);
				}
			}

			return profile;
		};


		const _processMessage = (message) => {
			const symbol = message.symbol;

			if (message.type === 'TIMESTAMP') {
				_timestamp = message.timestamp;

				return;
			}

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

			if (message.type === 'PROFILE_EXTENSION') {
				if (p) {
					_processProfileExtension(p, message);
				} else {
					_profileExtensions[symbol] = message;
				}

				return;
			}

			if (!p && message.type !== 'REFRESH_QUOTE') {
				_logger.warn(`MarketState [ ${_instance} ]: No profile found for [ ${symbol} ]`);
				_logger.log(message);

				return;
			}

			let q = _getOrCreateQuote(symbol);

			if (!q.day && message.day) {
				q.day = message.day;
				q.dayNum = convertDayCodeToNumber(q.day);
			}

			if (q.day && message.day) {
				const dayNum = convertDayCodeToNumber(message.day);

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
			} else {
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
							if (message.subrecord == '1') {
								q.lastUpdate = message.time;
								q.lastUpdateUtc = _getUtcTimestamp(symbol, message.time);
							}
							break;
					}
					break;
				case 'REFRESH_QUOTE':
					if (!p) {
						p = _createProfile(symbol, message.name, message.exchange, message.unitcode, message.pointValue, message.tickIncrement, (message.additional || null));
					}

					if (!q.profile) {
						q.profile = p;
					}

					q.message = message;
					q.flag = message.flag;
					q.mode = message.mode;

					if (message.lastUpdate) {
						q.lastUpdate = message.lastUpdate;
						q.lastUpdateUtc = _getUtcTimestamp(symbol, message.lastUpdate);
					}

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
						q.timeUtc = _getUtcTimestamp(symbol, message.tradeTime);
					} else if (message.timeStamp) {
						q.time = message.timeStamp;
						q.timeUtc = _getUtcTimestamp(symbol, message.timeStamp);
					}

					if (message.blockTrade)
						q.blockTrade = message.blockTrade;

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
						q.timeUtc = _getUtcTimestamp(symbol, message.time);
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
						q.timeUtc = _getUtcTimestamp(symbol, message.time);
					}

					if (cv && cv.container && message.tradePrice && message.tradeSize) {
						cv.container.incrementVolume(message.tradePrice, message.tradeSize);
					}
					break;
				case 'TRADE_OUT_OF_SEQUENCE':
					if (message.tradeSize) {
						q.volume += message.tradeSize;
					}

					if (message.session === 'Z')
						q.blockTrade = message.tradePrice;

					if (cv && cv.container && message.tradePrice && message.tradeSize) {
						cv.container.incrementVolume(message.tradePrice, message.tradeSize);
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
					_logger.error(`MarketState [ ${_instance} ]: Unhandled Market Message`);
					_logger.error(message);

					break;
			}
		};

		const _processExchangeMetadata = (id, description, timezoneDdf, timezoneExchange) => {
			if (_exchanges.hasOwnProperty(id)) {
				return;
			}

			const exchange = new Exchange(id, description, timezoneDdf, timezoneExchange);

			if (exchange.timezoneDdf === null || exchange.timezoneExchange === null) {
				_logger.warn(`MarketState [ ${_instance} ]: Timezones data for [ ${id} ] is incomplete; DDF timezone is [ ${(exchange.timezoneDdf ? exchange.timezoneDdf : '--')} ], exchange timezone is [ ${(exchange.timezoneExchange ? exchange.timezoneExchange : '--')} ]`);
			}

			const profiles = Profile.Profiles;
			const symbols = object.keys(profiles);

			symbols.forEach((symbol) => {
				const profile = profiles[symbol];

				if (profile.exchange === id) {
					profile.exchangeRef = exchange;
				}
			});

			_exchanges[id] = exchange;
		};

		const _getBook = (symbol) => {
			return _book[symbol];
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
				if (is.fn(callback)) {
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
				promise = new Promise((resolveCallback) => {
					if (!_profileCallbacks.hasOwnProperty(symbol)) {
						_profileCallbacks[symbol] = [ ];
					}

					_profileCallbacks[symbol].push(p => resolveCallback(p));

					if (handleProfileRequest && is.fn(handleProfileRequest)) {
						handleProfileRequest(symbol);
					}
				});
			}

			return promise.then((p) => {
				if (is.fn(callback)) {
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
			processMessage: _processMessage,
			processExchangeMetadata: _processExchangeMetadata
		};
	}

	/**
	 * Repository for current market state. This repository will only contain
	 * data for an instrument after a subscription has been established using
	 * the {@link Connection#on} function.
	 *
	 * Access the singleton instance using the {@link ConnectionBase#getMarketState}
	 * function.
	 *
	 * @public
	 */
	class MarketState {
		constructor(handleProfileRequest) {
			this._internal = MarketStateInternal(handleProfileRequest, ++instanceCounter);
		}

		/**
		 * @public
		 * @param {string} symbol
		 * @param {function=} callback - invoked when the {@link Profile} instance becomes available
		 * @returns {Promise<Profile>} The {@link Profile} instance, as a promise.
		 */
		getProfile(symbol, callback) {
			return this._internal.getProfile(symbol, callback);
		}

		/**
		 * @public
		 * @param {string} symbol
		 * @returns {Quote}
		 */
		getQuote(symbol) {
			return this._internal.getQuote(symbol);
		}

		/**
		 * @public
		 * @param {string} symbol
		 * @returns {Book}
		 */
		getBook(symbol) {
			return this._internal.getBook(symbol);
		}

		/**
		 * @public
		 * @param {string} symbol
		 * @param {function=} callback - invoked when the {@link CumulativeVolume} instance becomes available
		 * @returns {Promise<CumulativeVolume>} The {@link CumulativeVolume} instance, as a promise
		 */
		getCumulativeVolume(symbol, callback) {
			return this._internal.getCumulativeVolume(symbol, callback);
		}

		/**
		 * Returns the time the most recent market data message was received.
		 *
		 * @public
		 * @returns {Date}
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
		processExchangeMetadata(id, description, timezoneDdf, timezoneExchange) {
			return this._internal.processExchangeMetadata(id, description, timezoneDdf, timezoneExchange);
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

		toString() {
			return '[MarketState]';
		}
	}

	return MarketState;
})();