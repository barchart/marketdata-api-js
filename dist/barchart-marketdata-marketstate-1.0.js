(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.Barchart||(g.Barchart = {}));g=(g.RealtimeData||(g.RealtimeData = {}));g.MarketState = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ProfileProvider = require('./http/ProfileProvider');

module.exports = function() {
	'use strict';

	return ProfileProvider;
}();
},{"./http/ProfileProvider":3}],2:[function(require,module,exports){
var Class = require('class.extend');

module.exports = function() {
	'use strict';

	return Class.extend({
		init: function() {

		},

		loadProfileData: function(symbols, callback) {
			return this._loadProfileData(symbols, callback);
		},

		_loadProfileData: function(symbols, callback) {
			return null;
		},

		toString: function() {
			return '[ProfileProviderBase]';
		}
	});
}();
},{"class.extend":21}],3:[function(require,module,exports){
var xhr = require('xhr');

var ProfileProviderBase = require('./../../ProfileProviderBase');

module.exports = function() {
    'use strict';

    return ProfileProviderBase.extend({
        init: function() {

        },

        _loadProfileData: function(symbols, callback) {
            var options = {
                url: 'proxies/instruments/?lookup=' + symbols.join(','),
                method: 'GET',
                json: true
            };

            xhr(options, function(error, response, body) {
                var instrumentData;

                if (error || response.statusCode !== 200) {
                    instrumentData = [ ];
                } else {
                    instrumentData = body.instruments;
                }

                callback(instrumentData);
            });
        },

        toString: function() {
            return '[ProfileProvider]';
        }
    });
}();
},{"./../../ProfileProviderBase":2,"xhr":28}],4:[function(require,module,exports){
module.exports = function() {
	'use strict';

	var EVENT_TYPE_UPDATE = 'update';
	var EVENT_TYPE_RESET = 'reset';

	var CumulativeVolume = function(symbol, tickIncrement) {
		this.symbol = symbol;

		var handlers = [ ];

		var priceLevels = { };
		var highPrice = null;
		var lowPrice = null;

		var addPriceVolume = function(priceString, priceValue) {
			return priceLevels[priceString] = {
				price: priceValue,
				volume: 0
			};
		};

		this.on = function(eventType, handler) {
			if (eventType !== 'events') {
				return;
			}

			var i = handlers.indexOf(handler);

			if (i < 0) {
				var copy = handlers.slice(0);

				copy.push(handler);

				handlers = copy;
				
				var priceLevels = this.toArray();
				
				for (var j = 0; j < priceLevels; j++) {
					sendPriceVolumeUpdate(this, handler, priceLevels[j]);
				}
			}
		};

		this.off = function(eventType, handler) {
			if (eventType !== 'events') {
				return;
			}

			var i = handlers.indexOf(handler);

			if (!(i < 0)) {
				var copy = handlers.slice(0);

				copy.splice(i, 1);

				handlers = copy;
			}
		};

		this.getVolume = function(price) {
			var priceString = price.toString();
			var priceLevel = priceLevels[priceString];

			if (priceLevel) {
				return priceLevel.volume;
			} else {
				return 0;
			}
		};

		this.incrementVolume = function(priceValue, volume) {
			if (highPrice && lowPrice) {
				if (priceValue > highPrice) {
					for (var p = highPrice + tickIncrement; p < priceValue; p += tickIncrement) {
						broadcastPriceVolumeUpdate(this, handlers, addPriceVolume(p.toString(), p));
					}

					highPrice = priceValue;
				} else if (priceValue < lowPrice) {
					for (var p = lowPrice - tickIncrement; p > priceValue; p -= tickIncrement) {
						broadcastPriceVolumeUpdate(this, handlers, addPriceVolume(p.toString(), p));
					}

					lowPrice = priceValue;
				}
			} else {
				lowPrice = highPrice = priceValue;
			}

			var priceString = priceValue.toString();
			var priceLevel = priceLevels[priceString];

			if (!priceLevel) {
				priceLevel = addPriceVolume(priceString, priceValue);
			}

			priceLevel.volume += volume;

			broadcastPriceVolumeUpdate(this, handlers, priceLevel);
		};

		this.reset = function() {
			priceLevels = { };
			highPrice = null;
			lowPrice = null;

			for (var i = 0; i < handlers.length; i++) {
				var handler = handlers[i];

				handler({ container: this, event: EVENT_TYPE_RESET });
			}
		};

		this.toArray = function() {
			var array = [ ];

			for (var p in priceLevels) {
				var priceLevel = priceLevels[p];

				array.push({
					price: priceLevel.price,
					volume: priceLevel.volume
				});
			}

			array.sort(function(a, b) {
				return a.price - b.price;
			});

			return array;
		};

		this.dispose = function() {
			priceLevels = { };
			highPrice = null;
			lowPrice = null;

			handlers = [ ];
		};
	};

	var sendPriceVolumeUpdate = function(container, handler, priceLevel) {
		try {
			handler({
				container: container,
				event: EVENT_TYPE_UPDATE,
				price: priceLevel.price,
				volume: priceLevel.volume
			});
		} catch(e) {
			console.error('An error was thrown by a cumulative volume observer.', e);
		}
	};

	var broadcastPriceVolumeUpdate = function(container, handlers, priceLevel) {
		for (var i = 0; i < handlers.length; i++) {
			sendPriceVolumeUpdate(container, handlers[i], priceLevel);
		}
	};

	return CumulativeVolume;
}();
},{}],5:[function(require,module,exports){
var CumulativeVolume = require('./CumulativeVolume');
var Profile = require('./Profile');
var Quote = require('./Quote');

var dayCodeToNumber = require('./../util/convertDayCodeToNumber');
var ProfileProvider = require('./../connection/ProfileProvider');

module.exports = function() {
	'use strict';

	var MarketState = function() {
		var _book = {};
		var _quote = {};
		var _cvol = {};

		var _timestamp;

		var _profileProvider = new ProfileProvider();

		var loadProfiles = function(symbols, callback) {
			var wrappedCallback = function(instrumentData) {
				for (var i = 0; i < instrumentData.length; i++) {
					var instrumentDataItem = instrumentData[i];

					if (instrumentDataItem.status === 200) {
						new Profile(
							instrumentDataItem.lookup,
							instrumentDataItem.symbol_description,
							instrumentDataItem.exchange_channel,
							instrumentDataItem.base_code.toString(), // bug in DDF, sends '0' to '9' as 0 to 9, so a JSON number, not string
							instrumentDataItem.point_value,
							instrumentDataItem.tick_increment
						);
					}
				}

				callback();
			};

			_profileProvider.loadProfileData(symbols, wrappedCallback);
		};

		var _getCreateBook = function(symbol) {
			if (!_book[symbol]) {
				_book[symbol] = {
					symbol : symbol,
					bids : [],
					asks : []
				};
			}
			return _book[symbol];
		};

		var _getCreateCumulativeVolume = function(symbol) {
			if (!_cvol[symbol]) {
				_cvol[symbol] = {
					container: null,
					callbacks: [ ]
				};
			}

			return _cvol[symbol];
		};

		var _getCreateQuote = function(symbol) {
			if (!_quote[symbol]) {
				_quote[symbol] = new Quote();
				_quote[symbol].symbol = symbol;
			}
			return _quote[symbol];
		};


		var _processMessage = function(message) {
			var symbol = message.symbol;

			if (message.type == 'TIMESTAMP') {
				_timestamp = message.timestamp;
				return;
			}

			// Process book messages first, they don't need profiles, etc.
			if (message.type == 'BOOK') {
				var b = _getCreateBook(symbol);
				b.asks = message.asks;
				b.bids = message.bids;
				return;
			}

			if (message.type == 'REFRESH_CUMULATIVE_VOLUME') {
				var cv = _getCreateCumulativeVolume(symbol);

				var container = cv.container;

				if (container) {
					container.reset();
				} else {
					cv.container = container = new CumulativeVolume(symbol, message.tickIncrement);

					var callbacks = cv.callbacks || [ ];

					for (var i = 0; i < callbacks.length; i++) {
						var callback = callbacks[i];

						callback(container);
					}

					cv.callbacks = null;
				}

				var priceLevels = message.priceLevels;

				for (var i = 0; i < priceLevels.length; i++) {
					var priceLevel = priceLevels[i];

					container.incrementVolume(priceLevel.price, priceLevel.volume);
				}

				return;
			}

			var p = Profile.prototype.Profiles[symbol];
			if ((!p) && (message.type != 'REFRESH_QUOTE')) {
				console.warn('No profile found for ' + symbol);
				console.log(message);
				return;
			}

			var q = _getCreateQuote(symbol);

			if ((!q.day) && (message.day)) {
				q.day = message.day;
				q.dayNum = dayCodeToNumber(q.day);
			}

			if ((q.day) && (message.day)) {
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
				var cv = _getCreateCumulativeVolume(symbol);

				if (cv.container) {
					callback(cv.container);
				} else {
					cv.callbacks.push(callback);
				}
			},
			getProfile: function(symbol, callback) {
				var p = Profile.prototype.Profiles[symbol];

				if (!p) {
					loadProfiles([symbol], function() {
						p = Profile.prototype.Profiles[symbol];
						callback(p);
					});
				}
				else
					callback(p);
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
}();
},{"./../connection/ProfileProvider":1,"./../util/convertDayCodeToNumber":9,"./CumulativeVolume":4,"./Profile":6,"./Quote":7}],6:[function(require,module,exports){
var parseSymbolType = require('./../util/parseSymbolType');
var priceFormatter = require('./../util/priceFormatter');

module.exports = function() {
	'use strict';

	var Profile = function(symbol, name, exchange, unitCode, pointValue, tickIncrement) {
		this.symbol = symbol;
		this.name = name;
		this.exchange = exchange;
		this.unitCode = unitCode;
		this.pointValue = pointValue;
		this.tickIncrement = tickIncrement;

		var info = parseSymbolType(this.symbol);

		if (info) {
			if (info.type === 'future') {
				this.root = info.root;
				this.month = info.month;
				this.year = info.year;
			}
		}

		Profile.prototype.Profiles[symbol] = this;
	};

	Profile.prototype.Profiles = { };

	Profile.prototype.PriceFormatter = function(fractionSeparator, specialFractions, thousandsSeparator) {
		var format = priceFormatter(fractionSeparator, specialFractions, thousandsSeparator).format;

		Profile.prototype.formatPrice = function(price) {
			return format(price, this.unitCode);
		};
	};

	Profile.prototype.PriceFormatter('-', true);

	return Profile;
}();
},{"./../util/parseSymbolType":10,"./../util/priceFormatter":11}],7:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return function() {
		this.symbol = null;
		this.message = null;
		this.flag = null;
		this.mode = null;
		this.day = null;
		this.dayNum = 0;
		this.session = null;
		this.lastUpdate = null;
		this.bidPrice = null;
		this.bidSize = null;
		this.askPrice = null;
		this.askSize = null;
		this.lastPrice = null;
		this.tradePrice = null;
		this.tradeSize = null;
		this.numberOfTrades = null;
		this.vwap1 = null; // Exchange Provided
		this.vwap2 = null; // Calculated
		this.settlementPrice = null;
		this.openPrice = null;
		this.highPrice = null;
		this.lowPrice = null;
		this.volume = null;
		this.openInterest = null;
		this.previousPrice = null;
		this.time = null;
		this.ticks = [];
	};
}();
},{}],8:[function(require,module,exports){
var MarketState = require('./MarketState');

module.exports = function() {
	'use strict';

	return MarketState;
}();
},{"./MarketState":5}],9:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return function(dayCode) {
		var d = parseInt(dayCode, 31);

		if (d > 9) {
			d++;
		} else if (d === 0) {
			d = 10;
		}

		return d;
	};
}();
},{}],10:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return function(symbol) {
		if (symbol.substring(0, 3) == '_S_') {
			return {
				'type' : 'future_spread'
			};
		}

		var re1 = /[0-9]$/;

		// If we end in a number, then we are a future

		if (re1.test(symbol)) {
			var re2 = /^(.{1,3})([A-Z])([0-9]{1,4})$/i;
			var ary = re2.exec(symbol);
			var year = parseInt(ary[3]);
			if (year < 10)
				year += 2010;
			else if (year < 100)
				year += 2000;

			return {
				type: 'future',
				symbol: ary[0],
				root: ary[1],
				month: ary[2],
				year: year
			};
		}

		return null;
	};
}();
},{}],11:[function(require,module,exports){
var utilities = require('barchart-marketdata-utilities');

module.exports = function() {
	'use strict';

	return utilities.priceFormatter;
}();
},{"barchart-marketdata-utilities":14}],12:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return {
		unitCodeToBaseCode: function(unitCode) {
			switch (unitCode) {
				case '2':
					return -1;
				case '3':
					return -2;
				case '4':
					return -3;
				case '5':
					return -4;
				case '6':
					return -5;
				case '7':
					return -6;
				case '8':
					return 0;
				case '9':
					return 1;
				case 'A':
					return 2;
				case 'B':
					return 3;
				case 'C':
					return 4;
				case 'D':
					return 5;
				case 'E':
					return 6;
				case 'F':
					return 7;
				default:
					return 0;
			}
		},

		baseCodeToUnitCode: function(baseCode) {
			switch (baseCode) {
				case -1:
					return '2';
				case -2:
					return '3';
				case -3:
					return '4';
				case -4:
					return '5';
				case -5:
					return '6';
				case -6:
					return '7';
				case 0:
					return '8';
				case 1:
					return '9';
				case 2:
					return 'A';
				case 3:
					return 'B';
				case 4:
					return 'C';
				case 5:
					return 'D';
				case 6:
					return 'E';
				case 7:
					return 'F';
				default:
					return 0;
			}
		}
	};
}();
},{}],13:[function(require,module,exports){
var lodashIsNaN = require('lodash.isnan');

module.exports = function() {
	'use strict';

	return function(value, digits, thousandsSeparator) {
		if (value === '' || value === undefined || value === null || lodashIsNaN(value)) {
			return '';
		}

		var returnRef = value.toFixed(digits);

		if (thousandsSeparator && !(value > -1000 && value < 1000)) {
			var length = returnRef.length;
			var negative = value < 0;

			var found = digits === 0;
			var counter = 0;

			var buffer = [];

			for (var i = (length - 1); !(i < 0); i--) {
				if (counter === 3 && !(negative && i === 0)) {
					buffer.unshift(thousandsSeparator);

					counter = 0;
				}

				var character = returnRef.charAt(i);

				buffer.unshift(character);

				if (found) {
					counter = counter + 1;
				} else if (character === '.') {
					found = true;
				}
			}

			returnRef = buffer.join('');
		}

		return returnRef;
	};

	/*
	 // An alternative to consider ... seems about 15% faster ... not to
	 // mention much less lengthy ... but, has a problem with more than
	 // three decimal places ... regular expression needs work ...

	 return function(value, digits, thousandsSeparator) {
	 	if (typeof value === 'number' && (value || value === 0)) {
	 		return value.toFixed(digits).replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator || ',');
	 	} else {
	 		return '';
		}
	 };
	 */
}();
},{"lodash.isnan":25}],14:[function(require,module,exports){
var convert = require('./convert');
var decimalFormatter = require('./decimalFormatter');
var monthCodes = require('./monthCodes');
var priceFormatter = require('./priceFormatter');
var symbolFormatter = require('./symbolFormatter');
var symbolParser = require('./symbolParser');
var priceParser = require('./priceParser');
var timeFormatter = require('./timeFormatter');

module.exports = function() {
	'use strict';

	return {
		convert: convert,
		decimalFormatter: decimalFormatter,
		monthCodes: monthCodes,
		priceFormatter: priceFormatter,
		symbolParser: symbolParser,
		priceParser: priceParser,
		symbolFormatter: symbolFormatter,
		timeFormatter: timeFormatter
	};
}();
},{"./convert":12,"./decimalFormatter":13,"./monthCodes":15,"./priceFormatter":16,"./priceParser":17,"./symbolFormatter":18,"./symbolParser":19,"./timeFormatter":20}],15:[function(require,module,exports){
module.exports = function() {
	'use strict';

	var monthMap = { };
	var numberMap = { };

	var addMonth = function (code, name, number) {
		monthMap[code] = name;
		numberMap[code] = number;
	};

	addMonth("F", "January", 1);
	addMonth("G", "February", 2);
	addMonth("H", "March", 3);
	addMonth("J", "April", 4);
	addMonth("K", "May", 5);
	addMonth("M", "June", 6);
	addMonth("N", "July", 7);
	addMonth("Q", "August", 8);
	addMonth("U", "September", 9);
	addMonth("V", "October", 10);
	addMonth("X", "November", 11);
	addMonth("Z", "December", 12);
	addMonth("Y", "Cash", 0);

	return {
		getCodeToNameMap: function() {
			return monthMap;
		},

		getCodeToNumberMap: function() {
			return numberMap;
		}
	};
}();
},{}],16:[function(require,module,exports){
var lodashIsNaN = require('lodash.isnan');
var decimalFormatter = require('./decimalFormatter');

module.exports = function() {
	'use strict';

	function frontPad(value, digits) {
		return ['000', Math.floor(value)].join('').substr(-1 * digits);
	}

	return function(fractionSeparator, specialFractions, thousandsSeparator) {
		var format;

		function getWholeNumberAsString(value) {
			var val = Math.floor(value);

			if ((val === 0) && (fractionSeparator === ''))
				return '';
			else
				return val;
		}

		function formatDecimal(value, digits) {
			return decimalFormatter(value, digits, thousandsSeparator);
		}

		if (fractionSeparator == '.') { // Decimals
			format = function(value, unitcode) {
				switch (unitcode) {
					case '2':
						return formatDecimal(value, 3);
					case '3':
						return formatDecimal(value, 4);
					case '4':
						return formatDecimal(value, 5);
					case '5':
						return formatDecimal(value, 6);
					case '6':
						return formatDecimal(value, 7);
					case '7':
						return formatDecimal(value, 8);
					case '8':
						return formatDecimal(value, 0);
					case '9':
						return formatDecimal(value, 1);
					case 'A':
						return formatDecimal(value, 2);
					case 'B':
						return formatDecimal(value, 3);
					case 'C':
						return formatDecimal(value, 4);
					case 'D':
						return formatDecimal(value, 5);
					case 'E':
						return formatDecimal(value, 6);
					default:
						if (value === '' || value === undefined || value === null || lodashIsNaN(value))
							return '';
						else
							return value;
				}
			};
		} else {
			format = function(value, unitcode) {
				if (value === '' || value === undefined || value === null || lodashIsNaN(value))
					return '';

				var sign = (value >= 0) ? '' : '-';
				value = Math.abs(value);

				// Well, damn it, sometimes code that is beautiful just doesn't work quite right.
				// return [sign, Math.floor(value), fractionSeparator, frontPad((value - Math.floor(value)) * 8, 1)].join('');
				// will fail when Math.floor(value) is 0 and the fractionSeparator is '', since 0.500 => 04 instead of just 4

				switch (unitcode) {
					case '2':
						return [sign, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * 8, 1)].join('');
					case '3':
						return [sign, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * 16, 2)].join('');
					case '4':
						return [sign, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * 32, 2)].join('');
					case '5':
						return [sign, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * (specialFractions ? 320 : 64), (specialFractions ? 3 : 2))].join('');
					case '6':
						return [sign, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * (specialFractions ? 320 : 128), 3)].join('');
					case '7':
						return [sign, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * (specialFractions ? 320 : 256), 3)].join('');
					case '8':
						return sign + formatDecimal(value, 0);
					case '9':
						return sign + formatDecimal(value, 1);
					case 'A':
						return sign + formatDecimal(value, 2);
					case 'B':
						return sign + formatDecimal(value, 3);
					case 'C':
						return sign + formatDecimal(value, 4);
					case 'D':
						return sign + formatDecimal(value, 5);
					case 'E':
						return sign + formatDecimal(value, 6);
					default:
						return sign + value;
				}
			};
		}

		return {
			format: format
		};
	};
}();
},{"./decimalFormatter":13,"lodash.isnan":25}],17:[function(require,module,exports){
module.exports = function() {
	'use strict';

	var replaceExpressions = { };

	function getReplaceExpression(thousandsSeparator) {
		if (!replaceExpressions.hasOwnProperty(thousandsSeparator)) {
			replaceExpressions[thousandsSeparator] = new RegExp(thousandsSeparator, 'g');
		}

		return replaceExpressions[thousandsSeparator];
	}

	return function(str, unitcode, thousandsSeparator) {
		if (str.length < 1) {
			return undefined;
		} else if (str === '-') {
			return null;
		}

		if (thousandsSeparator) {
			str = str.replace(getReplaceExpression(thousandsSeparator), '');
		}

		if (str.indexOf('.') > 0) {
			return parseFloat(str);
		}

		var sign = (str.substr(0, 1) == '-') ? -1 : 1;

		if (sign === -1) {
			str = str.substr(1);
		}

		switch (unitcode) {
			case '2': // 8ths
				return sign * (((str.length > 1) ? parseInt(str.substr(0, str.length - 1)) : 0) + (parseInt(str.substr(-1)) / 8));
			case '3': // 16ths
				return sign * (((str.length > 2) ? parseInt(str.substr(0, str.length - 2)) : 0) + (parseInt(str.substr(-2)) / 16));
			case '4': // 32ths
				return sign * (((str.length > 2) ? parseInt(str.substr(0, str.length - 2)) : 0) + (parseInt(str.substr(-2)) / 32));
			case '5': // 64ths
				return sign * (((str.length > 2) ? parseInt(str.substr(0, str.length - 2)) : 0) + (parseInt(str.substr(-2)) / 64));
			case '6': // 128ths
				return sign * (((str.length > 3) ? parseInt(str.substr(0, str.length - 3)) : 0) + (parseInt(str.substr(-3)) / 128));
			case '7': // 256ths
				return sign * (((str.length > 3) ? parseInt(str.substr(0, str.length - 3)) : 0) + (parseInt(str.substr(-3)) / 256));
			case '8':
				return sign * parseInt(str);
			case '9':
				return sign * (parseInt(str) / 10);
			case 'A':
				return sign * (parseInt(str) / 100);
			case 'B':
				return sign * (parseInt(str) / 1000);
			case 'C':
				return sign * (parseInt(str) / 10000);
			case 'D':
				return sign * (parseInt(str) / 100000);
			case 'E':
				return sign * (parseInt(str) / 1000000);
			default:
				return sign * parseInt(str);
		}
	};
}();
},{}],18:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return {
		format: function(symbol) {
			var returnRef;

			if (symbol !== null && typeof symbol === 'string') {
				returnRef = symbol.toUpperCase();
			} else {
				returnRef = symbol;
			}

			return returnRef;
 		}
	};
}();
},{}],19:[function(require,module,exports){
module.exports = function() {
	'use strict';

	var percentRegex = /(\.RT)$/;

	return {
		displayUsingPercent: function(symbol) {
			return percentRegex.test(symbol);
		}
	};
}();
},{}],20:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return function(useTwelveHourClock, short) {
		var formatTime;

		if (useTwelveHourClock) {
			if (short) {
				formatTime = formatTwelveHourTimeShort;
			} else {
				formatTime = formatTwelveHourTime;
			}
		} else {
			if (short) {
				formatTime = formatTwentyFourHourTimeShort;
			} else {
				formatTime = formatTwentyFourHourTime;
			}
		}

		var formatters = {
			format: function(q) {
				var t = q.time;

				if (!t) {
					return '';
				} else if (!q.lastPrice || q.flag || q.sessionT) {
					return formatters.formatDate(t);
				} else {
					return formatters.formatTime(t, q.timezone);
				}
			},

			formatTime: function(date, timezone) {
				var returnRef;

				if (date) {
					returnRef = formatTime(date);

					if (timezone) {
						returnRef = returnRef + ' ' + timezone;
					}
				} else {
					returnRef = '';
				}

				return returnRef;
			},

			formatDate: function(date) {
				if (date) {
					return leftPad(date.getMonth() + 1) + '/' + leftPad(date.getDate()) + '/' + leftPad(date.getFullYear());
				} else {
					return '';
				}
			}
		};

		return formatters;
	};

	function formatTwelveHourTime(t) {
		var hours = t.getHours();
		var period;

		if (hours === 0) {
			hours = 12;
			period = 'AM';
		} else if (hours === 12) {
			hours = hours;
			period = 'PM';
		} else if (hours > 12) {
			hours = hours - 12;
			period = 'PM';
		} else {
			hours = hours;
			period = 'AM';
		}

		return leftPad(hours) + ':' + leftPad(t.getMinutes()) + ':' + leftPad(t.getSeconds()) + ' ' + period;
	}

	function formatTwelveHourTimeShort(t) {
		var hours = t.getHours();
		var period;

		if (hours === 0) {
			hours = 12;
			period = 'A';
		} else if (hours === 12) {
			hours = hours;
			period = 'P';
		} else if (hours > 12) {
			hours = hours - 12;
			period = 'P';
		} else {
			hours = hours;
			period = 'A';
		}

		return leftPad(hours) + ':' + leftPad(t.getMinutes()) + period;
	}

	function formatTwentyFourHourTime(t) {
		return leftPad(t.getHours()) + ':' + leftPad(t.getMinutes()) + ':' + leftPad(t.getSeconds());
	}

	function formatTwentyFourHourTimeShort(t) {
		return leftPad(t.getHours()) + ':' + leftPad(t.getMinutes());
	}

	function leftPad(value) {
		return ('00' + value).substr(-2);
	}
}();
},{}],21:[function(require,module,exports){
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };

  //I only added this line
  module.exports = Class;
})();

},{}],22:[function(require,module,exports){
var isFunction = require('is-function')

module.exports = forEach

var toString = Object.prototype.toString
var hasOwnProperty = Object.prototype.hasOwnProperty

function forEach(list, iterator, context) {
    if (!isFunction(iterator)) {
        throw new TypeError('iterator must be a function')
    }

    if (arguments.length < 3) {
        context = this
    }
    
    if (toString.call(list) === '[object Array]')
        forEachArray(list, iterator, context)
    else if (typeof list === 'string')
        forEachString(list, iterator, context)
    else
        forEachObject(list, iterator, context)
}

function forEachArray(array, iterator, context) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            iterator.call(context, array[i], i, array)
        }
    }
}

function forEachString(string, iterator, context) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        iterator.call(context, string.charAt(i), i, string)
    }
}

function forEachObject(object, iterator, context) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            iterator.call(context, object[k], k, object)
        }
    }
}

},{"is-function":24}],23:[function(require,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window;
} else if (typeof global !== "undefined") {
    module.exports = global;
} else if (typeof self !== "undefined"){
    module.exports = self;
} else {
    module.exports = {};
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],24:[function(require,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};

},{}],25:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var numberTag = '[object Number]';

/** Used for built-in method references. */
var objectProto = global.Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is `NaN`.
 *
 * **Note:** This method is not the same as [`isNaN`](https://es5.github.io/#x15.1.2.4)
 * which returns `true` for `undefined` and other non-numeric values.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 * @example
 *
 * _.isNaN(NaN);
 * // => true
 *
 * _.isNaN(new Number(NaN));
 * // => true
 *
 * isNaN(undefined);
 * // => true
 *
 * _.isNaN(undefined);
 * // => false
 */
function isNaN(value) {
  // An `NaN` primitive is the only value that is not equal to itself.
  // Perform the `toStringTag` check first to avoid errors with some ActiveX objects in IE.
  return isNumber(value) && value != +value;
}

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
 * as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */
function isNumber(value) {
  return typeof value == 'number' ||
    (isObjectLike(value) && objectToString.call(value) == numberTag);
}

module.exports = isNaN;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],26:[function(require,module,exports){
var trim = require('trim')
  , forEach = require('for-each')
  , isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  forEach(
      trim(headers).split('\n')
    , function (row) {
        var index = row.indexOf(':')
          , key = trim(row.slice(0, index)).toLowerCase()
          , value = trim(row.slice(index + 1))

        if (typeof(result[key]) === 'undefined') {
          result[key] = value
        } else if (isArray(result[key])) {
          result[key].push(value)
        } else {
          result[key] = [ result[key], value ]
        }
      }
  )

  return result
}
},{"for-each":22,"trim":27}],27:[function(require,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],28:[function(require,module,exports){
"use strict";
var window = require("global/window")
var isFunction = require("is-function")
var parseHeaders = require("parse-headers")
var xtend = require("xtend")

module.exports = createXHR
createXHR.XMLHttpRequest = window.XMLHttpRequest || noop
createXHR.XDomainRequest = "withCredentials" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window.XDomainRequest

forEachArray(["get", "put", "post", "patch", "head", "delete"], function(method) {
    createXHR[method === "delete" ? "del" : method] = function(uri, options, callback) {
        options = initParams(uri, options, callback)
        options.method = method.toUpperCase()
        return _createXHR(options)
    }
})

function forEachArray(array, iterator) {
    for (var i = 0; i < array.length; i++) {
        iterator(array[i])
    }
}

function isEmpty(obj){
    for(var i in obj){
        if(obj.hasOwnProperty(i)) return false
    }
    return true
}

function initParams(uri, options, callback) {
    var params = uri

    if (isFunction(options)) {
        callback = options
        if (typeof uri === "string") {
            params = {uri:uri}
        }
    } else {
        params = xtend(options, {uri: uri})
    }

    params.callback = callback
    return params
}

function createXHR(uri, options, callback) {
    options = initParams(uri, options, callback)
    return _createXHR(options)
}

function _createXHR(options) {
    if(typeof options.callback === "undefined"){
        throw new Error("callback argument missing")
    }

    var called = false
    var callback = function cbOnce(err, response, body){
        if(!called){
            called = true
            options.callback(err, response, body)
        }
    }

    function readystatechange() {
        if (xhr.readyState === 4) {
            loadFunc()
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = undefined

        if (xhr.response) {
            body = xhr.response
        } else {
            body = xhr.responseText || getXml(xhr)
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }

    var failureResponse = {
                body: undefined,
                headers: {},
                statusCode: 0,
                method: method,
                url: uri,
                rawRequest: xhr
            }

    function errorFunc(evt) {
        clearTimeout(timeoutTimer)
        if(!(evt instanceof Error)){
            evt = new Error("" + (evt || "Unknown XMLHttpRequest Error") )
        }
        evt.statusCode = 0
        return callback(evt, failureResponse)
    }

    // will load the data & process the response in a special response object
    function loadFunc() {
        if (aborted) return
        var status
        clearTimeout(timeoutTimer)
        if(options.useXDR && xhr.status===undefined) {
            //IE8 CORS GET successful response doesn't have a status field, but body is fine
            status = 200
        } else {
            status = (xhr.status === 1223 ? 204 : xhr.status)
        }
        var response = failureResponse
        var err = null

        if (status !== 0){
            response = {
                body: getBody(),
                statusCode: status,
                method: method,
                headers: {},
                url: uri,
                rawRequest: xhr
            }
            if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE
                response.headers = parseHeaders(xhr.getAllResponseHeaders())
            }
        } else {
            err = new Error("Internal XMLHttpRequest Error")
        }
        return callback(err, response, response.body)
    }

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new createXHR.XDomainRequest()
        }else{
            xhr = new createXHR.XMLHttpRequest()
        }
    }

    var key
    var aborted
    var uri = xhr.url = options.uri || options.url
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data || null
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var timeoutTimer

    if ("json" in options && options.json !== false) {
        isJson = true
        headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json") //Don't override existing accept header declared by user
        if (method !== "GET" && method !== "HEAD") {
            headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json") //Don't override existing accept header declared by user
            body = JSON.stringify(options.json === true ? body : options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = loadFunc
    xhr.onerror = errorFunc
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    xhr.onabort = function(){
        aborted = true;
    }
    xhr.ontimeout = errorFunc
    xhr.open(method, uri, !sync, options.username, options.password)
    //has to be after open
    if(!sync) {
        xhr.withCredentials = !!options.withCredentials
    }
    // Cannot set timeout with sync request
    // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
    // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
    if (!sync && options.timeout > 0 ) {
        timeoutTimer = setTimeout(function(){
            if (aborted) return
            aborted = true//IE9 may still call readystatechange
            xhr.abort("timeout")
            var e = new Error("XMLHttpRequest timeout")
            e.code = "ETIMEDOUT"
            errorFunc(e)
        }, options.timeout )
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    } else if (options.headers && !isEmpty(options.headers)) {
        throw new Error("Headers cannot be set on an XDomainRequest object")
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }

    if ("beforeSend" in options &&
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    xhr.send(body)

    return xhr


}

function getXml(xhr) {
    if (xhr.responseType === "document") {
        return xhr.responseXML
    }
    var firefoxBugTakenEffect = xhr.status === 204 && xhr.responseXML && xhr.responseXML.documentElement.nodeName === "parsererror"
    if (xhr.responseType === "" && !firefoxBugTakenEffect) {
        return xhr.responseXML
    }

    return null
}

function noop() {}

},{"global/window":23,"is-function":24,"parse-headers":26,"xtend":29}],29:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}]},{},[8])(8)
});