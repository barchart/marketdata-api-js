(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.Barchart||(g.Barchart = {}));g=(g.RealtimeData||(g.RealtimeData = {}));g.MarketState = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function() {
    'use strict';

    var provider = {
        getInstance: function() {
            var instance = window.$ || window.jQuery || window.jquery;

            if (!instance) {
                throw new Error('jQuery is required for the browser-based version of Barchart utilities.');
            }

            provider.getInstance = function() {
                return instance;
            };

            return instance;
        }
    };

    return provider;
}();
},{}],2:[function(require,module,exports){
var ProfileProvider = require('./http/ProfileProvider');

module.exports = function() {
	'use strict';

	return ProfileProvider;
}();
},{"./http/ProfileProvider":4}],3:[function(require,module,exports){
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
},{"class.extend":12}],4:[function(require,module,exports){
var ProfileProviderBase = require('./../../ProfileProviderBase');

var jQueryProvider = require('./../../../common/jQuery/jQueryProvider');

module.exports = function() {
    'use strict';

    var $ = jQueryProvider.getInstance();

    return ProfileProviderBase.extend({
        init: function() {

        },

        _loadProfileData: function(symbols, callback) {
            $.ajax({
                url: 'proxies/instruments/?lookup=' + symbols.join(','),
            }).done(function(json) {
                var instrumentData = [ ];

                if (json.status === 200) {
                    instrumentData = json.instruments;
                } else {
                    instrumentData = [ ];
                }

                callback(instrumentData);
            });
        },

        toString: function() {
            return '[ProfileProvider]';
        }
    });
}();
},{"./../../../common/jQuery/jQueryProvider":1,"./../../ProfileProviderBase":3}],5:[function(require,module,exports){
var Profile = require('./Profile');
var Quote = require('./Quote');

var dayCodeToNumber = require('./../util/convertDayCodeToNumber');
var ProfileProvider = require('./../connection/ProfileProvider');

module.exports = function() {
	'use strict';

	var MarketState = function() {
		var _MAX_TIMEANDSALES = 10;

		var _book = {};
		var _cvol = {};
		var _quote = {};
		var _timestamp;
		var _timeAndSales = {};

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
					"symbol" : symbol,
					"bids" : [],
					"asks" : []
				};
			}
			return _book[symbol];
		};

		var _getCreateQuote = function(symbol) {
			if (!_quote[symbol]) {
				_quote[symbol] = new Quote();
				_quote[symbol].symbol = symbol;
			}
			return _quote[symbol];
		};

		var _getCreateTimeAndSales = function(symbol) {
			if (!_timeAndSales[symbol]) {
				_timeAndSales[symbol] = {
					"symbol" : symbol
				};
			}
			return _timeAndSales[symbol];
		};

		var _processMessage = function(message) {
			if (message.type == 'TIMESTAMP') {
				_timestamp = message.timestamp;
				return;
			}

			// Process book messages first, they don't need profiles, etc.
			if (message.type == 'BOOK') {
				var b = _getCreateBook(message.symbol);
				b.asks = message.asks;
				b.bids = message.bids;
				return;
			}

			var p = Profile.prototype.Profiles[message.symbol];
			if ((!p) && (message.type != 'REFRESH_QUOTE')) {
				console.warn('No profile found for ' + message.symbol);
				console.log(message);
				return;
			}

			var q = _getCreateQuote(message.symbol);

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
					p = new Profile(message.symbol, message.name, message.exchange, message.unitcode, message.pointValue, message.tickIncrement);

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

					// TO DO: Add Time and Sales Tracking
					break;
				}
				case 'TRADE_OUT_OF_SEQUENCE': {
					q.volume += message.tradeSize;
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
			getCVol: function(symbol) {
				return _cvol[symbol];
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

	MarketState.Profile = Profile;
    MarketState.Quote = Quote;

    return MarketState;
}();
},{"./../connection/ProfileProvider":2,"./../util/convertDayCodeToNumber":9,"./Profile":6,"./Quote":7}],6:[function(require,module,exports){
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

	Profile.prototype.PriceFormatter = function(fractionSeparator, specialFractions) {
		var format = priceFormatter(fractionSeparator, specialFractions).format;

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
		var val1 = dayCode.charCodeAt(0);

		if ((val1 >= ("1").charCodeAt(0)) && (dayCode <= ("9").charCodeAt(0)))
			return (val1 - ("0").charCodeAt(0));
		else if (dayCode == ("0").charCodeAt(0))
			return 10;
		else
			return ((val1 - ("A").charCodeAt(0)) + 11);
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
module.exports = function() {
	'use strict';

	function frontPad(value, digits) {
		return ['000', Math.floor(value)].join('').substr(-1 * digits);
	}

	return function(fractionSeparator, specialFractions) {
		var format;

		function getWholeNumberAsString(value) {
			var val = Math.floor(value);

			if ((val === 0) && (fractionSeparator === ''))
				return '';
            else
			    return val;
		}

		if (fractionSeparator == '.') { // Decimals
			format = function(value, unitcode) {
				if (value === '' || value === undefined)
					return '';

				switch (unitcode) {
					case '2':
						return value.toFixed(3);
					case '3':
						return value.toFixed(4);
					case '4':
						return value.toFixed(5);
					case '5':
						return value.toFixed(6);
					case '6':
						return value.toFixed(7);
					case '7':
						return value.toFixed(8);
					case '8':
						return value.toFixed(0);
					case '9':
						return value.toFixed(1);
					case 'A':
						return value.toFixed(2);
					case 'B':
						return value.toFixed(3);
					case 'C':
						return value.toFixed(4);
					case 'D':
						return value.toFixed(5);
					case 'E':
						return value.toFixed(6);
					default:
						return value;
				}
			};
		}
		else {
			format = function(value, unitcode) {
				if (value === '' || value === undefined)
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
						return sign + value.toFixed(0);
					case '9':
						return sign + value.toFixed(1);
					case 'A':
						return sign + value.toFixed(2);
					case 'B':
						return sign + value.toFixed(3);
					case 'C':
						return sign + value.toFixed(4);
					case 'D':
						return sign + value.toFixed(5);
					case 'E':
						return sign + value.toFixed(6);
					default:
						return sign + value;
				}
			};
		}

		return {
			format : format
		};
	};
}();
},{}],12:[function(require,module,exports){
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

},{}]},{},[8])(8)
});