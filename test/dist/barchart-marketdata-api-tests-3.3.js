(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = function () {
	'use strict';

	var object = {
		/**
   * Given an object, returns an array of "own" properties.
   *
   * @static
   * @param {Object} target - The object to interrogate.
   * @returns {Array<string>}
   */
		keys: function keys(target) {
			var keys = [];

			for (var k in target) {
				if (target.hasOwnProperty(k)) {
					keys.push(k);
				}
			}

			return keys;
		},


		/**
   * Given an object, returns a Boolean value, indicating if the
   * object has any "own" properties.
   *
   * @static
   * @param {Object} target - The object to interrogate.
   * @returns {Boolean}
   */
		empty: function empty(target) {
			var empty = true;

			for (var k in target) {
				if (target.hasOwnProperty(k)) {
					empty = false;

					break;
				}
			}

			return empty;
		}
	};

	return object;
}();

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
	'use strict';

	/**
  * An interface for writing log messages.
  *
  * @public
  * @interface
  */

	var Logger = function () {
		function Logger() {
			_classCallCheck(this, Logger);
		}

		/**
   * Writes a log message.
   *
   * @public
   */


		_createClass(Logger, [{
			key: 'log',
			value: function log() {
				return;
			}

			/**
    * Writes a log message, at "debug" level.
    *
    * @public
    */

		}, {
			key: 'debug',
			value: function debug() {
				return;
			}

			/**
    * Writes a log message, at "info" level.
    *
    * @public
    */

		}, {
			key: 'info',
			value: function info() {
				return;
			}

			/**
    * Writes a log message, at "warn" level.
    *
    * @public
    */

		}, {
			key: 'warn',
			value: function warn() {
				return;
			}

			/**
    * Writes a log message, at "error" level.
    *
    * @public
    */

		}, {
			key: 'error',
			value: function error() {
				return;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Logger]';
			}
		}]);

		return Logger;
	}();

	return Logger;
}();

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logger = require('./Logger'),
    LoggerProvider = require('./LoggerProvider');

module.exports = function () {
	'use strict';

	var __provider = null;

	/**
  * Static utilities for interacting with the log system.
  *
  * @public
  * @interface
  */

	var LoggerFactory = function () {
		function LoggerFactory() {
			_classCallCheck(this, LoggerFactory);
		}

		/**
   * Configures the library to write log messages to the console.
   *
   * @public
   * @static
   */


		_createClass(LoggerFactory, [{
			key: 'toString',
			value: function toString() {
				return '[LoggerFactory]';
			}
		}], [{
			key: 'configureForConsole',
			value: function configureForConsole() {
				LoggerFactory.configure(new ConsoleLoggerProvider());
			}

			/**
    * Configures the mute all log messages.
    *
    * @public
    * @static
    */

		}, {
			key: 'configureForSilence',
			value: function configureForSilence() {
				LoggerFactory.configure(new EmptyLoggerProvider());
			}

			/**
    * Configures the library to delegate any log messages to a custom
    * implementation of the {@link LoggerProvider} interface.
    *
    * @public
    * @static
    * @param {LoggerProvider} provider
    */

		}, {
			key: 'configure',
			value: function configure(provider) {
				if (__provider === null && provider instanceof LoggerProvider) {
					__provider = provider;
				}
			}

			/**
    * Returns an instance of {@link Logger} for a specific category.
    *
    * @public
    * @static
    * @param {String} category
    * @return {Logger}
    */

		}, {
			key: 'getLogger',
			value: function getLogger(category) {
				if (__provider === null) {
					LoggerFactory.configureForConsole();
				}

				return __provider.getLogger(category);
			}
		}]);

		return LoggerFactory;
	}();

	var __consoleLogger = null;

	var ConsoleLoggerProvider = function (_LoggerProvider) {
		_inherits(ConsoleLoggerProvider, _LoggerProvider);

		function ConsoleLoggerProvider() {
			_classCallCheck(this, ConsoleLoggerProvider);

			return _possibleConstructorReturn(this, (ConsoleLoggerProvider.__proto__ || Object.getPrototypeOf(ConsoleLoggerProvider)).call(this));
		}

		_createClass(ConsoleLoggerProvider, [{
			key: 'getLogger',
			value: function getLogger(category) {
				if (__consoleLogger === null) {
					__consoleLogger = new ConsoleLogger();
				}

				return __consoleLogger;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[ConsoleLoggerProvider]';
			}
		}]);

		return ConsoleLoggerProvider;
	}(LoggerProvider);

	var ConsoleLogger = function (_Logger) {
		_inherits(ConsoleLogger, _Logger);

		function ConsoleLogger() {
			_classCallCheck(this, ConsoleLogger);

			return _possibleConstructorReturn(this, (ConsoleLogger.__proto__ || Object.getPrototypeOf(ConsoleLogger)).call(this));
		}

		_createClass(ConsoleLogger, [{
			key: 'log',
			value: function log() {
				console.log.apply(console, arguments);
			}
		}, {
			key: 'trace',
			value: function trace() {
				console.trace.apply(console, arguments);
			}
		}, {
			key: 'info',
			value: function info() {
				console.info.apply(console, arguments);
			}
		}, {
			key: 'warn',
			value: function warn() {
				console.warn.apply(console, arguments);
			}
		}, {
			key: 'error',
			value: function error() {
				console.error.apply(console, arguments);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[ConsoleLogger]';
			}
		}]);

		return ConsoleLogger;
	}(Logger);

	var __emptyLogger = null;

	var EmptyLoggerProvider = function (_LoggerProvider2) {
		_inherits(EmptyLoggerProvider, _LoggerProvider2);

		function EmptyLoggerProvider() {
			_classCallCheck(this, EmptyLoggerProvider);

			return _possibleConstructorReturn(this, (EmptyLoggerProvider.__proto__ || Object.getPrototypeOf(EmptyLoggerProvider)).call(this));
		}

		_createClass(EmptyLoggerProvider, [{
			key: 'getLogger',
			value: function getLogger(category) {
				if (__emptyLogger === null) {
					__emptyLogger = new EmptyLogger();
				}

				return __emptyLogger;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[EmptyLoggerProvider]';
			}
		}]);

		return EmptyLoggerProvider;
	}(LoggerProvider);

	var EmptyLogger = function (_Logger2) {
		_inherits(EmptyLogger, _Logger2);

		function EmptyLogger() {
			_classCallCheck(this, EmptyLogger);

			return _possibleConstructorReturn(this, (EmptyLogger.__proto__ || Object.getPrototypeOf(EmptyLogger)).call(this));
		}

		_createClass(EmptyLogger, [{
			key: 'log',
			value: function log() {
				return;
			}
		}, {
			key: 'trace',
			value: function trace() {
				return;
			}
		}, {
			key: 'info',
			value: function info() {
				return;
			}
		}, {
			key: 'warn',
			value: function warn() {
				return;
			}
		}, {
			key: 'error',
			value: function error() {
				return;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[ConsoleLogger]';
			}
		}]);

		return EmptyLogger;
	}(Logger);

	return LoggerFactory;
}();

},{"./Logger":2,"./LoggerProvider":4}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
	'use strict';

	/**
  * An interface for generating {@link Logger} instances.
  *
  * @public
  * @interface
  */

	var LoggerProvider = function () {
		function LoggerProvider() {
			_classCallCheck(this, LoggerProvider);
		}

		/**
   * Returns an instance of {@link Logger}.
   *
   * @public
   * @param {String} category
   * @returns {Logger}
   */


		_createClass(LoggerProvider, [{
			key: 'getLogger',
			value: function getLogger(category) {
				return null;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[LoggerProvider]';
			}
		}]);

		return LoggerProvider;
	}();

	return LoggerProvider;
}();

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var object = require('./../common/lang/object');

var LoggerFactory = require('./../logging/LoggerFactory');

module.exports = function () {
	'use strict';

	var events = {
		update: 'update',
		reset: 'reset'
	};

	/**
  * @typedef PriceLevel
  * @inner
  * @type Object
  * @property {number} price
  * @property {number} volume
  */

	/**
  * An aggregation of the total volume traded at each price level for a
  * single instrument.
  *
  * @public
  */

	var CumulativeVolume = function () {
		function CumulativeVolume(symbol, tickIncrement) {
			_classCallCheck(this, CumulativeVolume);

			/**
    * @property {string} symbol
    */
			this.symbol = symbol;

			this._tickIncrement = tickIncrement;

			this._handlers = [];

			this._priceLevels = {};
			this._highPrice = null;
			this._lowPrice = null;

			this._logger = LoggerFactory.getLogger('@barchart/marketdata-api-js');
		}

		/**
   * <p>Registers an event handler for a given event.</p>
   * <p>The following events are supported:
   * <ul>
   *   <li>update -- when a new price level is added, or an existing price level mutates.</li>
   *   <li>reset -- when all price levels are cleared.</li>
   * </ul>
   * </p>
   *
   * @ignore
   * @param {string} eventType
   * @param {function} handler - callback notified each time the event occurs
   */


		_createClass(CumulativeVolume, [{
			key: 'on',
			value: function on(eventType, handler) {
				var _this = this;

				if (eventType !== 'events') {
					return;
				}

				var i = this._handlers.indexOf(handler);

				if (i < 0) {
					var copy = this._handlers.slice(0);
					copy.push(handler);

					this._handlers = copy;

					this.toArray().forEach(function (priceLevel) {
						sendPriceVolumeUpdate(_this, handler, priceLevel);
					});
				}
			}

			/**
    * Unregisters an event handler for a given event. See {@link CumulativeVolume#on}.
    *
    * @ignore
    * @param {string} eventType - the event which was passed to {@link CumulativeVolume#on}
    * @param {function} handler - the callback which was passed to {@link CumulativeVolume#on}
    */

		}, {
			key: 'off',
			value: function off(eventType, handler) {
				if (eventType !== 'events') {
					return;
				}

				var i = this._handlers.indexOf(handler);

				if (!(i < 0)) {
					var copy = this._handlers.slice(0);
					copy.splice(i, 1);

					this._handlers = copy;
				}
			}

			/**
    * @ignore
    */

		}, {
			key: 'getTickIncrement',
			value: function getTickIncrement() {
				return this._tickIncrement;
			}

			/**
    * Given a numeric price, returns the volume traded at that price level.
    *
    * @public
    * @param {number} price
    * @returns {number}
    */

		}, {
			key: 'getVolume',
			value: function getVolume(price) {
				var priceString = price.toString();
				var priceLevel = this._priceLevels[priceString];

				if (priceLevel) {
					return priceLevel.volume;
				} else {
					return 0;
				}
			}

			/**
    * Increments the volume at a given price level. Used primarily
    * when a trade occurs.
    *
    * @ignore
    * @param {number} price
    * @param {number} volume - amount to add to existing cumulative volume
    */

		}, {
			key: 'incrementVolume',
			value: function incrementVolume(price, volume) {
				if (this._highPrice && this._lowPrice) {
					if (price > this._highPrice) {
						for (var p = this._highPrice + this._tickIncrement; p < price; p += this._tickIncrement) {
							broadcastPriceVolumeUpdate(this, this._handlers, addPriceVolume(this._priceLevels, p.toString(), p));
						}

						this._highPrice = price;
					} else if (price < this._lowPrice) {
						for (var _p = this._lowPrice - this._tickIncrement; _p > price; _p -= this._tickIncrement) {
							broadcastPriceVolumeUpdate(this, this._handlers, addPriceVolume(this._priceLevels, _p.toString(), _p));
						}

						this._lowPrice = price;
					}
				} else {
					this._lowPrice = this._highPrice = price;
				}

				var priceString = price.toString();
				var priceLevel = this._priceLevels[priceString];

				if (!priceLevel) {
					priceLevel = addPriceVolume(this._priceLevels, priceString, price);
				}

				priceLevel.volume += volume;

				broadcastPriceVolumeUpdate(this, this._handlers, priceLevel);
			}

			/**
    * Clears the data structure. Used primarily when a "reset" message
    * is received.
    *
    * @ignore
    */

		}, {
			key: 'reset',
			value: function reset() {
				var _this2 = this;

				this._priceLevels = {};
				this._highPrice = null;
				this._lowPrice = null;

				this._handlers.forEach(function (handler) {
					handler({ container: _this2, event: events.reset });
				});
			}

			/**
    * Returns an array of all price levels. This is an expensive operation. Observing
    * an ongoing subscription is preferred (see {@link Connection#on}).
    *
    * @return {PriceLevel[]}
    */

		}, {
			key: 'toArray',
			value: function toArray() {
				var _this3 = this;

				var array = object.keys(this._priceLevels).map(function (p) {
					var priceLevel = _this3._priceLevels[p];

					return {
						price: priceLevel.price,
						volume: priceLevel.volume
					};
				});

				array.sort(function (a, b) {
					return a.price - b.price;
				});

				return array;
			}
		}, {
			key: 'dispose',
			value: function dispose() {
				this._priceLevels = {};
				this._highPrice = null;
				this._lowPrice = null;

				this._handlers = [];
			}

			/**
    * Copies the price levels from one {@link CumulativeVolume} instance to
    * a newly {@link CumulativeVolume} created instance.
    *
    * @ignore
    * @param {string} symbol - The symbol to assign to the cloned instance.
    * @param {CumulativeVolume} source - The instance to copy.
    * @return {CumulativeVolume}
    */

		}], [{
			key: 'clone',
			value: function clone(symbol, source) {
				var clone = new CumulativeVolume(symbol, source.getTickIncrement());

				source.toArray().forEach(function (priceLevel) {
					clone.incrementVolume(priceLevel.price, priceLevel.volume);
				});

				return clone;
			}
		}]);

		return CumulativeVolume;
	}();

	var sendPriceVolumeUpdate = function sendPriceVolumeUpdate(container, handler, priceLevel) {
		try {
			handler({
				container: container,
				event: events.update,
				price: priceLevel.price,
				volume: priceLevel.volume
			});
		} catch (e) {
			undefined._logger.error('An error was thrown by a cumulative volume observer.', e);
		}
	};

	var broadcastPriceVolumeUpdate = function broadcastPriceVolumeUpdate(container, handlers, priceLevel) {
		handlers.forEach(function (handler) {
			sendPriceVolumeUpdate(container, handler, priceLevel);
		});
	};

	var addPriceVolume = function addPriceVolume(priceLevels, priceString, price) {
		var priceLevel = {
			price: price,
			volume: 0
		};

		priceLevels[priceString] = priceLevel;

		return priceLevel;
	};

	return CumulativeVolume;
}();

},{"./../common/lang/object":1,"./../logging/LoggerFactory":3}],6:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var parseSymbolType = require('./../util/parseSymbolType'),
    priceFormatter = require('./../util/priceFormatter');

module.exports = function () {
	'use strict';

	var profiles = {};
	var formatter = priceFormatter('-', true, ',').format;

	/**
  * Describes an instrument.
  *
  * @public
  */

	var Profile = function () {
		function Profile(symbol, name, exchange, unitCode, pointValue, tickIncrement, additional) {
			_classCallCheck(this, Profile);

			/**
    * @property {string} symbol - the instrument's symbol
    */
			this.symbol = symbol;

			/**
    * @property {string} name - the instrument's name
    */
			this.name = name;

			/**
    * @property {string} exchange - the code for the listing exchange
    */
			this.exchange = exchange;

			/**
    * @property {string} unitCode - code used to describe how a price should be formatted
    */
			this.unitCode = unitCode;

			/**
    * @property {string} pointValue - the change in dollar value for a one point change in price
    */
			this.pointValue = pointValue;

			/**
    * @property {number} tickIncrement - the minimum price movement
    */
			this.tickIncrement = tickIncrement;

			var info = parseSymbolType(this.symbol);

			if (info) {
				if (info.type === 'future') {
					/**
      * @property {undefined|string} root - he root symbol, if a future; otherwise undefined
      */
					this.root = info.root;

					/**
      * @property {undefined|string} month - the month code, if a future; otherwise undefined
      */
					this.month = info.month;

					/**
      * @property {undefined|number} year - the expiration year, if a symbol; otherwise undefined
      */
					this.year = info.year;
				}
			}

			if ((typeof additional === 'undefined' ? 'undefined' : _typeof(additional)) === 'object' && additional !== null) {
				for (var p in additional) {
					this[p] = additional[p];
				}
			}

			profiles[symbol] = this;
		}

		/**
   * Given a numeric price, returns a human-readable price.
   *
   * @public
   * @param {number} price
   * @returns {string}
   */


		_createClass(Profile, [{
			key: 'formatPrice',
			value: function formatPrice(price) {
				return formatter(price, this.unitCode);
			}

			/**
    * Configures the logic used to format all prices using the {@link Profile#formatPrice} instance function.
    *
    * @public
    * @param {string} fractionSeparator - usually a dash or a period
    * @param {boolean} specialFractions - usually true
    * @param {string=} thousandsSeparator - usually a comma
    */

		}], [{
			key: 'setPriceFormatter',
			value: function setPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator) {
				formatter = priceFormatter(fractionSeparator, specialFractions, thousandsSeparator).format;
			}

			/**
    * Alias for {@link Profile.setPriceFormatter} function.
    *
    * @deprecated
    * @public
    * @see {@link Profile.setPriceFormatter}
    */

		}, {
			key: 'PriceFormatter',
			value: function PriceFormatter(fractionSeparator, specialFractions, thousandsSeparator) {
				Profile.setPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator);
			}

			/**
    * @protected
    * @ignore
    */

		}, {
			key: 'Profiles',
			get: function get() {
				return profiles;
			}
		}]);

		return Profile;
	}();

	return Profile;
}();

},{"./../util/parseSymbolType":7,"./../util/priceFormatter":8}],7:[function(require,module,exports){
'use strict';

var utilities = require('@barchart/marketdata-utilities-js');

module.exports = function () {
	'use strict';

	return utilities.symbolParser.parseInstrumentType;
}();

},{"@barchart/marketdata-utilities-js":12}],8:[function(require,module,exports){
'use strict';

var utilities = require('@barchart/marketdata-utilities-js');

module.exports = function () {
	'use strict';

	return utilities.priceFormatter;
}();

},{"@barchart/marketdata-utilities-js":12}],9:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var xmlDom = require('xmldom');

module.exports = function () {
    'use strict';

    var XmlDomParser = function () {
        function XmlDomParser() {
            _classCallCheck(this, XmlDomParser);

            this._xmlDomParser = new xmlDom.DOMParser();
        }

        _createClass(XmlDomParser, [{
            key: 'parse',
            value: function parse(textDocument) {
                if (typeof textDocument !== 'string') {
                    throw new Error('The "textDocument" argument must be a string.');
                }

                return this._xmlDomParser.parseFromString(textDocument, 'text/xml');
            }
        }, {
            key: 'toString',
            value: function toString() {
                return '[XmlDomParser]';
            }
        }]);

        return XmlDomParser;
    }();

    return XmlDomParser;
}();

},{"xmldom":23}],10:[function(require,module,exports){
'use strict';

module.exports = function () {
	'use strict';

	function convertDayNumberToDayCode(d) {
		if (d >= 1 && d <= 9) {
			return String.fromCharCode("1".charCodeAt(0) + d - 1);
		} else if (d == 10) {
			return '0';
		} else {
			return String.fromCharCode("A".charCodeAt(0) + d - 11);
		}
	}

	return {
		/**
   * Converts a unit code into a base code.
   *
   * @public
   * @param {String} baseCode
   * @return {Number}
   */
		unitCodeToBaseCode: function unitCodeToBaseCode(unitCode) {
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

		/**
   * Converts a base code into a unit code.
   *
   * @public
   * @param {Number} baseCode
   * @return {String}
   */
		baseCodeToUnitCode: function baseCodeToUnitCode(baseCode) {
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
		},

		/**
   * Converts a date instance to a day code.
   *
   * @public
   * @param {Date} date
   * @returns {String|null}
   */
		dateToDayCode: function dateToDayCode(date) {
			if (date === null || date === undefined) {
				return null;
			}

			return convertDayNumberToDayCode(date.getDate());
		},

		/**
   * Converts a day code (e.g. "A" ) to a day number (e.g. 11).
   *
   * @public
   * @param {String} dayCode
   * @returns {Number|null}
   */
		dayCodeToNumber: function dayCodeToNumber(dayCode) {
			if (dayCode === null || dayCode === undefined || dayCode === '') {
				return null;
			}

			var d = parseInt(dayCode, 31);

			if (d > 9) {
				d++;
			} else if (d === 0) {
				d = 10;
			}

			return d;
		},

		/**
   * Converts a day number (e.g. the 11th of the month) in o a day code (e.g. 'A').
   *
   * @public
   * @param {Number=} dayNumber
   * @returns {Number|null}
   */
		numberToDayCode: function numberToDayCode(dayNumber) {
			if (dayNumber === null || dayNumber === undefined) {
				return null;
			}

			return convertDayNumberToDayCode(dayNumber);
		}
	};
}();

},{}],11:[function(require,module,exports){
'use strict';

var lodashIsNaN = require('lodash.isnan');

module.exports = function () {
	'use strict';

	return function (value, digits, thousandsSeparator, useParenthesis) {
		if (value === '' || value === undefined || value === null || lodashIsNaN(value)) {
			return '';
		}

		var applyParenthesis = value < 0 && useParenthesis === true;

		if (applyParenthesis) {
			value = 0 - value;
		}

		var returnRef = value.toFixed(digits);

		if (thousandsSeparator && !(value > -1000 && value < 1000)) {
			var length = returnRef.length;
			var negative = value < 0;

			var found = digits === 0;
			var counter = 0;

			var buffer = [];

			for (var i = length - 1; !(i < 0); i--) {
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

			if (applyParenthesis) {
				buffer.unshift('(');
				buffer.push(')');
			}

			returnRef = buffer.join('');
		} else if (applyParenthesis) {
			returnRef = '(' + returnRef + ')';
		}

		return returnRef;
	};
}();

},{"lodash.isnan":22}],12:[function(require,module,exports){
'use strict';

var convert = require('./convert'),
    decimalFormatter = require('./decimalFormatter'),
    messageParser = require('./messageParser'),
    monthCodes = require('./monthCodes'),
    priceFormatter = require('./priceFormatter'),
    symbolFormatter = require('./symbolFormatter'),
    symbolParser = require('./symbolParser'),
    priceParser = require('./priceParser'),
    stringToDecimalFormatter = require('./stringToDecimalFormatter'),
    timeFormatter = require('./timeFormatter'),
    timestampParser = require('./timestampParser');

module.exports = function () {
	'use strict';

	return {
		convert: convert,
		decimalFormatter: decimalFormatter,
		monthCodes: monthCodes,
		messageParser: messageParser,
		priceFormatter: priceFormatter,
		symbolParser: symbolParser,
		priceParser: priceParser,
		stringToDecimalFormatter: stringToDecimalFormatter,
		symbolFormatter: symbolFormatter,
		timeFormatter: timeFormatter,
		timestampParser: timestampParser
	};
}();

},{"./convert":10,"./decimalFormatter":11,"./messageParser":13,"./monthCodes":14,"./priceFormatter":15,"./priceParser":16,"./stringToDecimalFormatter":17,"./symbolFormatter":18,"./symbolParser":19,"./timeFormatter":20,"./timestampParser":21}],13:[function(require,module,exports){
'use strict';

var parseValue = require('./priceParser'),
    parseTimestamp = require('./timestampParser'),
    XmlDomParser = require('./common/xml/XmlDomParser');

module.exports = function () {
	'use strict';

	return function (msg) {
		var message = {
			message: msg,
			type: null
		};

		switch (msg.substr(0, 1)) {
			case '%':
				{
					// Jerq Refresh Messages
					var xmlDocument = void 0;

					try {
						var xmlDomParser = new XmlDomParser();
						xmlDocument = xmlDomParser.parse(msg.substring(1));
					} catch (e) {
						xmlDocument = undefined;
					}

					if (xmlDocument) {
						var node = xmlDocument.firstChild;

						switch (node.nodeName) {
							case 'BOOK':
								{
									message.symbol = node.attributes.getNamedItem('symbol').value;
									message.unitcode = node.attributes.getNamedItem('basecode').value;
									message.askDepth = parseInt(node.attributes.getNamedItem('bidcount').value);
									message.bidDepth = parseInt(node.attributes.getNamedItem('bidcount').value);
									message.asks = [];
									message.bids = [];

									var ary1 = void 0,
									    ary2 = void 0;

									if (node.attributes.getNamedItem('askprices') && node.attributes.getNamedItem('asksizes')) {
										ary1 = node.attributes.getNamedItem('askprices').value.split(',');
										ary2 = node.attributes.getNamedItem('asksizes').value.split(',');

										for (var i = 0; i < ary1.length; i++) {
											message.asks.push({ "price": parseValue(ary1[i], message.unitcode), "size": parseInt(ary2[i]) });
										}
									}

									if (node.attributes.getNamedItem('bidprices') && node.attributes.getNamedItem('bidsizes')) {
										ary1 = node.attributes.getNamedItem('bidprices').value.split(',');
										ary2 = node.attributes.getNamedItem('bidsizes').value.split(',');

										for (var _i = 0; _i < ary1.length; _i++) {
											message.bids.push({ "price": parseValue(ary1[_i], message.unitcode), "size": parseInt(ary2[_i]) });
										}
									}

									message.type = 'BOOK';
									break;
								}
							case 'QUOTE':
								{
									for (var _i2 = 0; _i2 < node.attributes.length; _i2++) {
										switch (node.attributes[_i2].name) {
											case 'symbol':
												message.symbol = node.attributes[_i2].value;
												break;
											case 'name':
												message.name = node.attributes[_i2].value;
												break;
											case 'exchange':
												message.exchange = node.attributes[_i2].value;
												break;
											case 'basecode':
												message.unitcode = node.attributes[_i2].value;
												break;
											case 'pointvalue':
												message.pointValue = parseFloat(node.attributes[_i2].value);
												break;
											case 'tickincrement':
												message.tickIncrement = parseInt(node.attributes[_i2].value);
												break;
											case 'flag':
												message.flag = node.attributes[_i2].value;
												break;
											case 'lastupdate':
												{
													var v = node.attributes[_i2].value;
													message.lastUpdate = new Date(parseInt(v.substr(0, 4)), parseInt(v.substr(4, 2)) - 1, parseInt(v.substr(6, 2)), parseInt(v.substr(8, 2)), parseInt(v.substr(10, 2)), parseInt(v.substr(12, 2)));
													break;
												}
											case 'bid':
												message.bidPrice = parseValue(node.attributes[_i2].value, message.unitcode);
												break;
											case 'bidsize':
												message.bidSize = parseInt(node.attributes[_i2].value);
												break;
											case 'ask':
												message.askPrice = parseValue(node.attributes[_i2].value, message.unitcode);
												break;
											case 'asksize':
												message.askSize = parseInt(node.attributes[_i2].value);
												break;
											case 'mode':
												message.mode = node.attributes[_i2].value;
												break;
										}
									}

									var sessions = {};

									for (var j = 0; j < node.childNodes.length; j++) {
										if (node.childNodes[j].nodeName == 'SESSION') {
											var s = {};
											var attributes = node.childNodes[j].attributes;

											if (attributes.getNamedItem('id')) s.id = attributes.getNamedItem('id').value;
											if (attributes.getNamedItem('day')) s.day = attributes.getNamedItem('day').value;
											if (attributes.getNamedItem('last')) s.lastPrice = parseValue(attributes.getNamedItem('last').value, message.unitcode);
											if (attributes.getNamedItem('previous')) s.previousPrice = parseValue(attributes.getNamedItem('previous').value, message.unitcode);
											if (attributes.getNamedItem('open')) s.openPrice = parseValue(attributes.getNamedItem('open').value, message.unitcode);
											if (attributes.getNamedItem('high')) s.highPrice = parseValue(attributes.getNamedItem('high').value, message.unitcode);
											if (attributes.getNamedItem('low')) s.lowPrice = parseValue(attributes.getNamedItem('low').value, message.unitcode);
											if (attributes.getNamedItem('tradesize')) s.tradeSize = parseInt(attributes.getNamedItem('tradesize').value);
											if (attributes.getNamedItem('numtrades')) s.numberOfTrades = parseInt(attributes.getNamedItem('numtrades').value);
											if (attributes.getNamedItem('settlement')) s.settlementPrice = parseValue(attributes.getNamedItem('settlement').value, message.unitcode);
											if (attributes.getNamedItem('volume')) s.volume = parseInt(attributes.getNamedItem('volume').value);
											if (attributes.getNamedItem('openinterest')) s.openInterest = parseInt(attributes.getNamedItem('openinterest').value);
											if (attributes.getNamedItem('timestamp')) {
												var _v = attributes.getNamedItem('timestamp').value;
												s.timeStamp = new Date(parseInt(_v.substr(0, 4)), parseInt(_v.substr(4, 2)) - 1, parseInt(_v.substr(6, 2)), parseInt(_v.substr(8, 2)), parseInt(_v.substr(10, 2)), parseInt(_v.substr(12, 2)));
											}
											if (attributes.getNamedItem('tradetime')) {
												var _v2 = attributes.getNamedItem('tradetime').value;
												s.tradeTime = new Date(parseInt(_v2.substr(0, 4)), parseInt(_v2.substr(4, 2)) - 1, parseInt(_v2.substr(6, 2)), parseInt(_v2.substr(8, 2)), parseInt(_v2.substr(10, 2)), parseInt(_v2.substr(12, 2)));
											}

											if (s.id) sessions[s.id] = s;
										}
									}

									var premarket = typeof sessions.combined.lastPrice === 'undefined';
									var postmarket = !premarket && typeof sessions.combined.settlementPrice !== 'undefined';

									var session = premarket ? sessions.previous : sessions.combined;

									if (sessions.combined.previousPrice) {
										message.previousPrice = sessions.combined.previousPrice;
									} else {
										message.previousPrice = sessions.previous.previousPrice;
									}

									if (session.lastPrice) message.lastPrice = session.lastPrice;
									if (session.openPrice) message.openPrice = session.openPrice;
									if (session.highPrice) message.highPrice = session.highPrice;
									if (session.lowPrice) message.lowPrice = session.lowPrice;
									if (session.tradeSize) message.tradeSize = session.tradeSize;
									if (session.numberOfTrades) message.numberOfTrades = session.numberOfTrades;
									if (session.settlementPrice) message.settlementPrice = session.settlementPrice;
									if (session.volume) message.volume = session.volume;
									if (session.openInterest) message.openInterest = session.openInterest;
									if (session.id === 'combined' && sessions.previous.openInterest) message.openInterest = sessions.previous.openInterest;
									if (session.timeStamp) message.timeStamp = session.timeStamp;
									if (session.tradeTime) message.tradeTime = session.tradeTime;

									// 2016/10/29, BRI. We have a problem where we don't "roll" quotes
									// for futures. For example, LEZ16 doesn't "roll" the settlementPrice
									// to the previous price -- so, we did this on the open message (2,0A).
									// Eero has another idea. Perhaps we are setting the "day" improperly
									// here. Perhaps we should base the day off of the actual session
									// (i.e. "session" variable) -- instead of taking it from the "combined"
									// session.

									if (sessions.combined.day) message.day = session.day;
									if (premarket && typeof message.flag === 'undefined') message.flag = 'p';

									var p = sessions.previous;

									message.previousPreviousPrice = p.previousPrice;
									message.previousSettlementPrice = p.settlementPrice;
									message.previousOpenPrice = p.openPrice;
									message.previousHighPrice = p.highPrice;
									message.previousLowPrice = p.lowPrice;
									message.previousTimeStamp = p.timeStamp;

									if (sessions.combined.day) {
										var sessionFormT = 'session_' + sessions.combined.day + '_T';

										if (sessions.hasOwnProperty(sessionFormT)) {
											var t = sessions[sessionFormT];

											var lastPriceT = t.lastPrice;

											if (lastPriceT) {
												var tradeTimeT = t.tradeTime;
												var tradeSizeT = t.tradeSize;

												var sessionIsEvening = void 0;

												if (tradeTimeT) {
													var noon = new Date(tradeTimeT.getFullYear(), tradeTimeT.getMonth(), tradeTimeT.getDate(), 12, 0, 0, 0);

													sessionIsEvening = tradeTimeT.getTime() > noon.getTime();
												} else {
													sessionIsEvening = false;
												}

												message.sessionT = sessionIsEvening;

												var sessionIsCurrent = premarket || sessionIsEvening;

												if (sessionIsCurrent) {
													message.lastPriceT = lastPriceT;
												}

												if (premarket || postmarket) {
													message.session = 'T';

													if (sessionIsCurrent) {
														if (tradeTimeT) {
															message.tradeTime = tradeTimeT;
														}

														if (tradeSizeT) {
															message.tradeSize = tradeSizeT;
														}
													}

													if (premarket) {
														if (t.volume) {
															message.volume = t.volume;
														}

														if (t.previousPrice) {
															message.previousPrice = t.previousPrice;
														}
													}
												}
											}
										}
									}

									message.type = 'REFRESH_QUOTE';
									break;
								}
							case 'CV':
								{
									message.type = 'REFRESH_CUMULATIVE_VOLUME';
									message.symbol = node.attributes.getNamedItem('symbol').value;
									message.unitCode = node.attributes.getNamedItem('basecode').value;
									message.tickIncrement = parseValue(node.attributes.getNamedItem('tickincrement').value, message.unitCode);

									var dataAttribute = node.attributes.getNamedItem('data');

									if (dataAttribute) {
										var priceLevelsRaw = dataAttribute.value || '';
										var priceLevels = priceLevelsRaw.split(':');

										for (var _i3 = 0; _i3 < priceLevels.length; _i3++) {
											var priceLevelRaw = priceLevels[_i3];
											var priceLevelData = priceLevelRaw.split(',');

											priceLevels[_i3] = {
												price: parseValue(priceLevelData[0], message.unitCode),
												volume: parseInt(priceLevelData[1])
											};
										}

										priceLevels.sort(function (a, b) {
											return a.price - b.price;
										});

										message.priceLevels = priceLevels;
									} else {
										message.priceLevels = [];
									}

									break;
								}
							default:
								console.log(msg);
								break;
						}
					}

					break;
				}
			case '\x01':
				{
					// DDF Messages
					switch (msg.substr(1, 1)) {
						case '#':
							{
								// TO DO: Standardize the timezones for Daylight Savings
								message.type = 'TIMESTAMP';
								message.timestamp = new Date(parseInt(msg.substr(2, 4)), parseInt(msg.substr(6, 2)) - 1, parseInt(msg.substr(8, 2)), parseInt(msg.substr(10, 2)), parseInt(msg.substr(12, 2)), parseInt(msg.substr(14, 2)));
								break;
							}
						case 'C':
						case '2':
							{
								message.record = '2';
								var pos = msg.indexOf(',', 0);
								message.symbol = msg.substring(2, pos);
								message.subrecord = msg.substr(pos + 1, 1);
								message.unitcode = msg.substr(pos + 3, 1);
								message.exchange = msg.substr(pos + 4, 1);
								message.delay = parseInt(msg.substr(pos + 5, 2));
								switch (message.subrecord) {
									case '0':
										{
											// TO DO: Error Handling / Sanity Check
											var pos2 = msg.indexOf(',', pos + 7);
											message.value = parseValue(msg.substring(pos + 7, pos2), message.unitcode);
											message.element = msg.substr(pos2 + 1, 1);
											message.modifier = msg.substr(pos2 + 2, 1);

											switch (message.element) {
												case 'A':
													message.type = 'OPEN';
													break;
												case 'C':
													if (message.modifier == '1') message.type = 'OPEN_INTEREST';
													break;
												case 'D':
												case 'd':
													if (message.modifier == '0') message.type = 'SETTLEMENT';
													break;
												case 'V':
													if (message.modifier == '0') message.type = 'VWAP';
													break;
												case '0':
													{
														if (message.modifier == '0') {
															message.tradePrice = message.value;
															message.type = 'TRADE';
														}
														break;
													}
												case '5':
													message.type = 'HIGH';
													break;
												case '6':
													message.type = 'LOW';
													break;
												case '7':
													{
														if (message.modifier == '1') message.type = 'VOLUME_YESTERDAY';else if (message.modifier == '6') message.type = 'VOLUME';
														break;
													}
											}

											message.day = msg.substr(pos2 + 3, 1);
											message.session = msg.substr(pos2 + 4, 1);
											message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
											break;
										}
									case '1':
									case '2':
									case '3':
									case '4':
										{
											var ary = msg.substring(pos + 8).split(',');
											message.openPrice = parseValue(ary[0], message.unitcode);
											message.highPrice = parseValue(ary[1], message.unitcode);
											message.lowPrice = parseValue(ary[2], message.unitcode);
											message.lastPrice = parseValue(ary[3], message.unitcode);
											message.bidPrice = parseValue(ary[4], message.unitcode);
											message.askPrice = parseValue(ary[5], message.unitcode);
											message.previousPrice = parseValue(ary[7], message.unitcode);
											message.settlementPrice = parseValue(ary[10], message.unitcode);
											message.volume = ary[13].length > 0 ? parseInt(ary[13]) : undefined;
											message.openInterest = ary[12].length > 0 ? parseInt(ary[12]) : undefined;
											message.day = ary[14].substr(0, 1);
											message.session = ary[14].substr(1, 1);
											message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
											message.type = 'REFRESH_DDF';
											break;
										}
									case '7':
										{
											var _pos = msg.indexOf(',', pos + 7);
											message.tradePrice = parseValue(msg.substring(pos + 7, _pos), message.unitcode);

											pos = _pos + 1;
											_pos = msg.indexOf(',', pos);
											message.tradeSize = parseInt(msg.substring(pos, _pos));
											pos = _pos + 1;
											message.day = msg.substr(pos, 1);
											message.session = msg.substr(pos + 1, 1);
											message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
											message.type = 'TRADE';
											break;
										}
									case '8':
										{
											var _pos2 = msg.indexOf(',', pos + 7);
											message.bidPrice = parseValue(msg.substring(pos + 7, _pos2), message.unitcode);
											pos = _pos2 + 1;
											_pos2 = msg.indexOf(',', pos);
											message.bidSize = parseInt(msg.substring(pos, _pos2));
											pos = _pos2 + 1;
											_pos2 = msg.indexOf(',', pos);
											message.askPrice = parseValue(msg.substring(pos, _pos2), message.unitcode);
											pos = _pos2 + 1;
											_pos2 = msg.indexOf(',', pos);
											message.askSize = parseInt(msg.substring(pos, _pos2));
											pos = _pos2 + 1;
											message.day = msg.substr(pos, 1);
											message.session = msg.substr(pos + 1, 1);
											message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
											message.type = 'TOB';
											break;
										}
									case 'Z':
										{
											var _pos3 = msg.indexOf(',', pos + 7);
											message.tradePrice = parseValue(msg.substring(pos + 7, _pos3), message.unitcode);

											pos = _pos3 + 1;
											_pos3 = msg.indexOf(',', pos);
											message.tradeSize = parseInt(msg.substring(pos, _pos3));
											pos = _pos3 + 1;
											message.day = msg.substr(pos, 1);
											message.session = msg.substr(pos + 1, 1);
											message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
											message.type = 'TRADE_OUT_OF_SEQUENCE';
											break;
										}
								}
								break;
							}
						case '3':
							{
								var _pos4 = msg.indexOf(',', 0);
								message.symbol = msg.substring(2, _pos4);
								message.subrecord = msg.substr(_pos4 + 1, 1);
								switch (message.subrecord) {
									case 'B':
										{
											message.unitcode = msg.substr(_pos4 + 3, 1);
											message.exchange = msg.substr(_pos4 + 4, 1);
											message.bidDepth = msg.substr(_pos4 + 5, 1) == 'A' ? 10 : parseInt(msg.substr(_pos4 + 5, 1));
											message.askDepth = msg.substr(_pos4 + 6, 1) == 'A' ? 10 : parseInt(msg.substr(_pos4 + 6, 1));
											message.bids = [];
											message.asks = [];
											var _ary = msg.substring(_pos4 + 8).split(',');
											for (var _i4 = 0; _i4 < _ary.length; _i4++) {
												var _ary2 = _ary[_i4].split(/[A-Z]/);
												var c = _ary[_i4].substr(_ary2[0].length, 1);
												if (c <= 'J') message.asks.push({ "price": parseValue(_ary2[0], message.unitcode), "size": parseInt(_ary2[1]) });else message.bids.push({ "price": parseValue(_ary2[0], message.unitcode), "size": parseInt(_ary2[1]) });
											}

											message.type = 'BOOK';
											break;
										}
									default:
										break;
								}

								break;
							}
						default:
							{
								message.type = 'UNKNOWN';
								break;
							}
					}
				}
		}

		return message;
	};
}();

},{"./common/xml/XmlDomParser":9,"./priceParser":16,"./timestampParser":21}],14:[function(require,module,exports){
"use strict";

module.exports = function () {
	'use strict';

	var monthMap = {};
	var numberMap = {};

	var addMonth = function addMonth(code, name, number) {
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
		getCodeToNameMap: function getCodeToNameMap() {
			return monthMap;
		},

		getCodeToNumberMap: function getCodeToNumberMap() {
			return numberMap;
		}
	};
}();

},{}],15:[function(require,module,exports){
'use strict';

var lodashIsNaN = require('lodash.isnan');
var decimalFormatter = require('./decimalFormatter');

module.exports = function () {
	'use strict';

	function frontPad(value, digits) {
		return ['000', Math.floor(value)].join('').substr(-1 * digits);
	}

	return function (fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {
		var format = void 0;

		function getWholeNumberAsString(value) {
			var val = Math.floor(value);

			if (val === 0 && fractionSeparator === '') {
				return '';
			} else {
				return val;
			}
		}

		function formatDecimal(value, digits) {
			return decimalFormatter(value, digits, thousandsSeparator, useParenthesis);
		}

		if (fractionSeparator === '.') {
			format = function format(value, unitcode) {
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
						if (value === '' || value === undefined || value === null || lodashIsNaN(value)) {
							return '';
						} else {
							return value;
						}
				}
			};
		} else {
			format = function format(value, unitcode) {
				if (value === '' || value === undefined || value === null || lodashIsNaN(value)) {
					return '';
				}

				var originalValue = value;
				var absoluteValue = Math.abs(value);

				var negative = value < 0;

				var prefix = void 0;
				var suffix = void 0;

				if (negative) {
					if (useParenthesis === true) {
						prefix = '(';
						suffix = ')';
					} else {
						prefix = '-';
						suffix = '';
					}
				} else {
					prefix = '';
					suffix = '';
				}

				switch (unitcode) {
					case '2':
						return [prefix, getWholeNumberAsString(absoluteValue), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * 8, 1), suffix].join('');
					case '3':
						return [prefix, getWholeNumberAsString(absoluteValue), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * 16, 2), suffix].join('');
					case '4':
						return [prefix, getWholeNumberAsString(absoluteValue), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * 32, 2), suffix].join('');
					case '5':
						return [prefix, getWholeNumberAsString(absoluteValue), fractionSeparator, frontPad(Math.floor(((absoluteValue - Math.floor(absoluteValue)) * (specialFractions ? 320 : 64)).toFixed(1)), specialFractions ? 3 : 2), suffix].join('');
					case '6':
						return [prefix, getWholeNumberAsString(absoluteValue), fractionSeparator, frontPad(Math.floor(((absoluteValue - Math.floor(absoluteValue)) * (specialFractions ? 320 : 128)).toFixed(1)), 3), suffix].join('');
					case '7':
						return [prefix, getWholeNumberAsString(absoluteValue), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * (specialFractions ? 320 : 256), 3), suffix].join('');
					case '8':
						return formatDecimal(originalValue, 0);
					case '9':
						return formatDecimal(originalValue, 1);
					case 'A':
						return formatDecimal(originalValue, 2);
					case 'B':
						return formatDecimal(originalValue, 3);
					case 'C':
						return formatDecimal(originalValue, 4);
					case 'D':
						return formatDecimal(originalValue, 5);
					case 'E':
						return formatDecimal(originalValue, 6);
					default:
						return originalValue;
				}
			};
		}

		return {
			format: format
		};
	};
}();

},{"./decimalFormatter":11,"lodash.isnan":22}],16:[function(require,module,exports){
'use strict';

module.exports = function () {
	'use strict';

	var replaceExpressions = {};

	function getReplaceExpression(thousandsSeparator) {
		if (!replaceExpressions.hasOwnProperty(thousandsSeparator)) {
			replaceExpressions[thousandsSeparator] = new RegExp(thousandsSeparator, 'g');
		}

		return replaceExpressions[thousandsSeparator];
	}

	return function (str, unitcode, thousandsSeparator) {
		if (str.length < 1) {
			return undefined;
		} else if (str === '-') {
			return null;
		}

		if (thousandsSeparator) {
			str = str.replace(getReplaceExpression(thousandsSeparator), '');
		}

		if (!(str.indexOf('.') < 0)) {
			return parseFloat(str);
		}

		var sign = str.substr(0, 1) == '-' ? -1 : 1;

		if (sign === -1) {
			str = str.substr(1);
		}

		switch (unitcode) {
			case '2':
				// 8ths
				return sign * ((str.length > 1 ? parseInt(str.substr(0, str.length - 1)) : 0) + parseInt(str.substr(-1)) / 8);
			case '3':
				// 16ths
				return sign * ((str.length > 2 ? parseInt(str.substr(0, str.length - 2)) : 0) + parseInt(str.substr(-2)) / 16);
			case '4':
				// 32ths
				return sign * ((str.length > 2 ? parseInt(str.substr(0, str.length - 2)) : 0) + parseInt(str.substr(-2)) / 32);
			case '5':
				// 64ths
				return sign * ((str.length > 2 ? parseInt(str.substr(0, str.length - 2)) : 0) + parseInt(str.substr(-2)) / 64);
			case '6':
				// 128ths
				return sign * ((str.length > 3 ? parseInt(str.substr(0, str.length - 3)) : 0) + parseInt(str.substr(-3)) / 128);
			case '7':
				// 256ths
				return sign * ((str.length > 3 ? parseInt(str.substr(0, str.length - 3)) : 0) + parseInt(str.substr(-3)) / 256);
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

},{}],17:[function(require,module,exports){
'use strict';

var Converter = require('./convert');

module.exports = function () {
	/**
  * Adapted from legacy code: https://github.com/barchart/php-jscharts/blob/372deb9b4d9ee678f32b6f8c4268434249c1b4ac/chart_package/webroot/js/deps/ddfplus/com.ddfplus.js
  */
	return function (string, unitCode) {
		var baseCode = Converter.unitCodeToBaseCode(unitCode);
		var is_negative = false;

		// Fix for 10-Yr T-Notes
		if (baseCode === -4 && (string.length === 7 || string.length === 6 && string.charAt(0) !== '1')) {
			baseCode -= 1;
		}

		if (baseCode >= 0) {
			var ival = string * 1;
			return Math.round(ival * Math.pow(10, baseCode)) / Math.pow(10, baseCode);
		} else {
			if (string.match(/^-/)) {
				is_negative = true;
				string = string.slice(1);
			}

			var has_dash = string.match(/-/);
			var divisor = Math.pow(2, Math.abs(baseCode) + 2);
			var fracsize = String(divisor).length;
			var denomstart = string.length - fracsize;
			var numerend = denomstart;
			if (string.substring(numerend - 1, numerend) == '-') numerend--;
			var numerator = string.substring(0, numerend) * 1;
			var denominator = string.substring(denomstart, string.length) * 1;

			if (baseCode === -5) {
				divisor = has_dash ? 320 : 128;
			}

			return (numerator + denominator / divisor) * (is_negative ? -1 : 1);
		}
	};
}();

},{"./convert":10}],18:[function(require,module,exports){
'use strict';

module.exports = function () {
	'use strict';

	return {
		format: function format(symbol) {
			if (symbol !== null && typeof symbol === 'string') {
				return symbol.toUpperCase();
			} else {
				return symbol;
			}
		}
	};
}();

},{}],19:[function(require,module,exports){
'use strict';

module.exports = function () {
	'use strict';

	var alternateFuturesMonths = {
		A: 'F',
		B: 'G',
		C: 'H',
		D: 'J',
		E: 'K',
		I: 'M',
		L: 'N',
		O: 'Q',
		P: 'U',
		R: 'V',
		S: 'X',
		T: 'Z'
	};

	var futuresMonthNumbers = {
		F: 1,
		G: 2,
		H: 3,
		J: 4,
		K: 5,
		M: 6,
		N: 7,
		Q: 8,
		U: 8,
		V: 10,
		X: 11,
		Z: 12
	};

	var predicates = {};

	predicates.bats = /^(.*)\.BZ$/i;
	predicates.percent = /(\.RT)$/;

	var types = {};

	types.forex = /^\^([A-Z]{3})([A-Z]{3})$/i;
	types.futures = {};
	types.futures.spread = /^_S_/i;
	types.futures.concrete = /^([A-Z][A-Z0-9\$\-!\.]{0,2})([A-Z]{1})([0-9]{4}|[0-9]{1,2})$/i;
	types.futures.alias = /^([A-Z][A-Z0-9\$\-!\.]{0,2})(\*{1})([0-9]{1})$/i;
	types.futures.options = {};
	types.futures.options.short = /^([A-Z][A-Z0-9\$\-!\.]?)([A-Z])([0-9]{1,4})([A-Z])$/i;
	types.futures.options.long = /^([A-Z][A-Z0-9\$\-!\.]{0,2})([A-Z])([0-9]{1,4})\|(\-?[0-9]{1,5})(C|P)$/i;
	types.futures.options.historical = /^([A-Z][A-Z0-9\$\-!\.]{0,2})([A-Z])([0-9]{2})([0-9]{1,5})(C|P)$/i;
	types.indicies = {};
	types.indicies.external = /^\$(.*)$/i;
	types.indicies.sector = /^\-(.*)$/i;
	types.indicies.cmdty = /^(.*)\.CM$/i;

	var parsers = [];

	parsers.push(function (symbol) {
		var definition = null;

		if (types.futures.spread.test(symbol)) {
			definition = {};

			definition.symbol = symbol;
			definition.type = 'future_spread';
		}

		return definition;
	});

	parsers.push(function (symbol) {
		var definition = null;

		var match = symbol.match(types.futures.concrete);

		if (match !== null) {
			definition = {};

			definition.symbol = symbol;
			definition.type = 'future';

			definition.dynamic = false;
			definition.root = match[1];
			definition.month = match[2];
			definition.year = getFuturesYear(match[3]);
		}

		return definition;
	});

	parsers.push(function (symbol) {
		var definition = null;

		var match = symbol.match(types.futures.alias);

		if (match !== null) {
			definition = {};

			definition.symbol = symbol;
			definition.type = 'future';

			definition.dynamic = true;
			definition.root = match[1];
			definition.dynamicCode = match[3];
		}

		return definition;
	});

	parsers.push(function (symbol) {
		var definition = null;

		if (types.forex.test(symbol)) {
			definition = {};

			definition.symbol = symbol;
			definition.type = 'forex';
		}

		return definition;
	});

	parsers.push(function (symbol) {
		var definition = null;

		if (types.indicies.external.test(symbol)) {
			definition = {};

			definition.symbol = symbol;
			definition.type = 'index';
		}

		return definition;
	});

	parsers.push(function (symbol) {
		var definition = null;

		if (types.indicies.sector.test(symbol)) {
			definition = {};

			definition.symbol = symbol;
			definition.type = 'sector';
		}

		return definition;
	});

	parsers.push(function (symbol) {
		var definition = null;

		var match = symbol.match(types.futures.options.short);

		if (match !== null) {
			definition = {};

			var putCallCharacterCode = match[4].charCodeAt(0);
			var putCharacterCode = 80;
			var callCharacterCode = 67;

			var optionType = void 0;
			var optionYearDelta = void 0;

			if (putCallCharacterCode < putCharacterCode) {
				optionType = 'call';
				optionYearDelta = putCallCharacterCode - callCharacterCode;
			} else {
				optionType = 'put';
				optionYearDelta = putCallCharacterCode - putCharacterCode;
			}

			definition.symbol = symbol;
			definition.type = 'future_option';

			definition.option_type = optionType;
			definition.strike = parseInt(match[3]);

			definition.root = match[1];
			definition.month = match[2];
			definition.year = getCurrentYear() + optionYearDelta;
		}

		return definition;
	});

	parsers.push(function (symbol) {
		var definition = null;

		var match = symbol.match(types.futures.options.long) || symbol.match(types.futures.options.historical);

		if (match !== null) {
			definition = {};

			definition.symbol = symbol;
			definition.type = 'future_option';

			definition.option_type = match[5] === 'C' ? 'call' : 'put';
			definition.strike = parseInt(match[4]);

			definition.root = match[1];
			definition.month = getFuturesMonth(match[2]);
			definition.year = getFuturesYear(match[3]);
		}

		return definition;
	});

	var converters = [];

	converters.push(function (symbol) {
		var converted = null;

		if (symbolParser.getIsFuture(symbol) && symbolParser.getIsConcrete(symbol)) {
			converted = symbol.replace(/(.{1,3})([A-Z]{1})([0-9]{3}|[0-9]{1})?([0-9]{1})$/i, '$1$2$4') || null;
		}

		return converted;
	});

	converters.push(function (symbol) {
		var converted = null;

		if (symbolParser.getIsFutureOption(symbol)) {
			var definition = symbolParser.parseInstrumentType(symbol);

			var putCallCharacter = getPutCallCharacter(definition.option_type);

			if (definition.root.length < 3) {
				var putCallCharacterCode = putCallCharacter.charCodeAt(0);

				converted = '' + definition.root + definition.month + definition.strike + String.fromCharCode(putCallCharacterCode + definition.year - getCurrentYear());
			} else {
				converted = '' + definition.root + definition.month + getYearDigits(definition.year, 1) + '|' + definition.strike + putCallCharacter;
			}
		}

		return converted;
	});

	converters.push(function (symbol) {
		return symbol;
	});

	function getCurrentMonth() {
		var now = new Date();

		return now.getMonth() + 1;
	}

	function getCurrentYear() {
		var now = new Date();

		return now.getFullYear();
	}

	function getYearDigits(year, digits) {
		var yearString = year.toString();

		return yearString.substring(yearString.length - digits, yearString.length);
	}

	function getFuturesMonthNumber(monthString) {}

	function getFuturesMonth(monthString) {
		return alternateFuturesMonths[monthString] || monthString;
	}

	function getFuturesYear(yearString) {
		var currentYear = getCurrentYear();

		var year = parseInt(yearString);

		if (year < 10) {
			var bump = year < currentYear % 10 ? 1 : 0;

			year = Math.floor(currentYear / 10) * 10 + year + bump * 10;
		} else if (year < 100) {
			year = Math.floor(currentYear / 100) * 100 + year;

			if (year < currentYear) {
				var alternateYear = year + 100;

				if (currentYear - year > alternateYear - currentYear) {
					year = alternateYear;
				}
			}
		}

		return year;
	}

	function getPutCallCharacter(optionType) {
		if (optionType === 'call') {
			return 'C';
		} else if (optionType === 'put') {
			return 'P';
		} else {
			return null;
		}
	}

	var symbolParser = {
		/**
   * Returns a simple instrument definition with the terms that can be
   * gleaned from a symbol. If no specifics can be determined from the
   * symbol, a null value is returned.
   *
   * @public
   * @param {String} symbol
   * @returns {Object|null}
   */
		parseInstrumentType: function parseInstrumentType(symbol) {
			if (typeof symbol !== 'string') {
				return null;
			}

			var definition = null;

			for (var i = 0; i < parsers.length && definition === null; i++) {
				var parser = parsers[i];

				definition = parser(symbol);
			}

			return definition;
		},

		/**
   * Translates a symbol into a form suitable for use with JERQ (i.e. our quote "producer").
   *
   * @public
   * @param {String} symbol
   * @return {String|null}
   */
		getProducerSymbol: function getProducerSymbol(symbol) {
			if (typeof symbol !== 'string') {
				return null;
			}

			var converted = null;

			for (var i = 0; i < converters.length && converted === null; i++) {
				var converter = converters[i];

				converted = converter(symbol);
			}

			return converted;
		},

		/**
   * Attempts to convert database format of futures options to pipeline format
   * (e.g. ZLF320Q -> ZLF9|320C)
   *
   * @public
   * @param {String} symbol
   * @returns {String|null}
   */
		getFuturesOptionPipelineFormat: function getFuturesOptionPipelineFormat(symbol) {
			var definition = symbolParser.parseInstrumentType(symbol);

			var formatted = null;

			if (definition.type === 'future_option') {
				var putCallCharacter = getPutCallCharacter(definition.option_type);

				formatted = '' + definition.root + definition.month + getYearDigits(definition.year, 1) + '|' + definition.strike + putCallCharacter;
			}

			return formatted;
		},

		/**
   * Returns true if the symbol is not an alias to another symbol; otherwise
   * false.
   *
   * @public
   * @param {String} symbol
   * @returns {Boolean}
   */
		getIsConcrete: function getIsConcrete(symbol) {
			return typeof symbol === 'string' && !types.futures.alias.test(symbol);
		},

		/**
   * Returns true if the symbol is an alias for another symbol; otherwise false.
   *
   * @public
   * @param {String} symbol
   * @returns {Boolean}
   */
		getIsReference: function getIsReference(symbol) {
			return typeof symbol === 'string' && types.futures.alias.test(symbol);
		},

		/**
   * Returns true if the symbol represents futures contract; false otherwise.
   *
   * @public
   * @param {String} symbol
   * @returns {Boolean}
   */
		getIsFuture: function getIsFuture(symbol) {
			return typeof symbol === 'string' && (types.futures.concrete.test(symbol) || types.futures.alias.test(symbol));
		},

		/**
   * Returns true if the symbol represents futures spread; false otherwise.
   *
   * @public
   * @param {String} symbol
   * @returns {Boolean}
   */
		getIsFutureSpread: function getIsFutureSpread(symbol) {
			return typeof symbol === 'string' && types.futures.spread.test(symbol);
		},

		/**
   * Returns true if the symbol represents an option on a futures contract; false
   * otherwise.
   *
   * @public
   * @param {String} symbol
   * @returns {Boolean}
   */
		getIsFutureOption: function getIsFutureOption(symbol) {
			return typeof symbol === 'string' && (types.futures.options.short.test(symbol) || types.futures.options.long.test(symbol) || types.futures.options.historical.test(symbol));
		},

		/**
   * Returns true if the symbol represents a foreign exchange currency pair;
   * false otherwise.
   *
   * @public
   * @param {String} symbol
   * @returns {Boolean}
   */
		getIsForex: function getIsForex(symbol) {
			return typeof symbol === 'string' && types.forex.test(symbol);
		},

		/**
   * Returns true if the symbol represents an external index (e.g. Dow Jones
   * Industrials); false otherwise.
   *
   * @public
   * @param {String} symbol
   * @returns {Boolean}
   */
		getIsIndex: function getIsIndex(symbol) {
			return typeof symbol === 'string' && types.indicies.external.test(symbol);
		},

		/**
   * Returns true if the symbol represents an internally-calculated sector
   * index; false otherwise.
   *
   * @public
   * @param {String} symbol
   * @returns {Boolean}
   */
		getIsSector: function getIsSector(symbol) {
			return typeof symbol === 'string' && types.indicies.sector.test(symbol);
		},

		/**
   * Returns true if the symbol represents an internally-calculated, cmdty-branded
   * index; false otherwise.
   *
   * @public
   * @param {String} symbol
   * @returns {Boolean}
   */
		getIsCmdty: function getIsCmdty(symbol) {
			return typeof symbol === 'string' && types.indicies.cmdty.test(symbol);
		},

		/**
   * Returns true if the symbol is listed on the BATS exchange; false otherwise.
   *
   * @public
   * @param {String} symbol
   * @returns {Boolean}
   */
		getIsBats: function getIsBats(symbol) {
			return typeof symbol === 'string' && predicates.bats.test(symbol);
		},

		/**
   * Returns true if the symbol has an expiration and the symbol appears
   * to be expired (e.g. a future for a past year).
   *
   * @public
   * @param {String} symbol
   * @returns {Boolean}
   */
		getIsExpired: function getIsExpired(symbol) {
			var definition = symbolParser.parseInstrumentType(symbol);

			var returnVal = false;

			if (definition !== null && definition.year && definition.month) {
				var currentYear = getCurrentYear();

				if (definition.year < currentYear) {
					returnVal = true;
				} else if (definition.year === currentYear && futuresMonthNumbers.hasOwnProperty(definition.month)) {
					var currentMonth = getCurrentMonth();
					var futuresMonth = futuresMonthNumbers[definition.month];

					if (currentMonth > futuresMonth) {
						returnVal = true;
					}
				}
			}

			return returnVal;
		},

		/**
   * Returns true if prices for the symbol should be represented as a percentage; false
   * otherwise.
   *
   * @public
   * @param {String} symbol
   * @returns {Boolean}
   */
		displayUsingPercent: function displayUsingPercent(symbol) {
			return typeof symbol === 'string' && predicates.percent.test(symbol);
		}
	};

	return symbolParser;
}();

},{}],20:[function(require,module,exports){
'use strict';

module.exports = function () {
	'use strict';

	return function (useTwelveHourClock, short) {
		var _formatTime = void 0;

		if (useTwelveHourClock) {
			if (short) {
				_formatTime = formatTwelveHourTimeShort;
			} else {
				_formatTime = formatTwelveHourTime;
			}
		} else {
			if (short) {
				_formatTime = formatTwentyFourHourTimeShort;
			} else {
				_formatTime = formatTwentyFourHourTime;
			}
		}

		var formatters = {
			format: function format(q) {
				var t = q.time;

				if (!t) {
					return '';
				} else if (!q.lastPrice || q.flag || q.sessionT) {
					return formatters.formatDate(t);
				} else {
					return formatters.formatTime(t, q.timezone);
				}
			},

			formatTime: function formatTime(date, timezone) {
				var returnRef = void 0;

				if (date) {
					returnRef = _formatTime(date);

					if (timezone) {
						returnRef = returnRef + ' ' + timezone;
					}
				} else {
					returnRef = '';
				}

				return returnRef;
			},

			formatDate: function formatDate(date) {
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
		var period = void 0;

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
		var period = void 0;

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
'use strict';

module.exports = function () {
	'use strict';

	return function (bytes) {
		if (bytes.length !== 9) {
			return null;
		}

		var year = bytes.charCodeAt(0) * 100 + bytes.charCodeAt(1) - 64;
		var month = bytes.charCodeAt(2) - 64 - 1;
		var day = bytes.charCodeAt(3) - 64;
		var hour = bytes.charCodeAt(4) - 64;
		var minute = bytes.charCodeAt(5) - 64;
		var second = bytes.charCodeAt(6) - 64;
		var ms = (0xFF & bytes.charCodeAt(7)) + ((0xFF & bytes.charCodeAt(8)) << 8);

		// 2016/02/17. JERQ is providing us with date and time values that
		// are meant to be interpreted in the exchange's local timezone.
		//
		// This is interesting because different time values (e.g. 14:30 and
		// 13:30) can refer to the same moment (e.g. EST for US equities and
		// CST for US futures).
		//
		// Furthermore, when we use the timezone-sensitive Date object, we
		// create a problem. The represents (computer) local time. So, for
		// server applications, it is recommended that we use UTC -- so
		// that the values (hours) are not changed when JSON serialized
		// to ISO-8601 format. Then, the issue is passed along to the
		// consumer (which must ignore the timezone too).

		return new Date(year, month, day, hour, minute, second, ms);
	};
}();

},{}],22:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var numberTag = '[object Number]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

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

},{}],23:[function(require,module,exports){
function DOMParser(options){
	this.options = options ||{locator:{}};
	
}
DOMParser.prototype.parseFromString = function(source,mimeType){
	var options = this.options;
	var sax =  new XMLReader();
	var domBuilder = options.domBuilder || new DOMHandler();//contentHandler and LexicalHandler
	var errorHandler = options.errorHandler;
	var locator = options.locator;
	var defaultNSMap = options.xmlns||{};
	var entityMap = {'lt':'<','gt':'>','amp':'&','quot':'"','apos':"'"}
	if(locator){
		domBuilder.setDocumentLocator(locator)
	}
	
	sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
	sax.domBuilder = options.domBuilder || domBuilder;
	if(/\/x?html?$/.test(mimeType)){
		entityMap.nbsp = '\xa0';
		entityMap.copy = '\xa9';
		defaultNSMap['']= 'http://www.w3.org/1999/xhtml';
	}
	defaultNSMap.xml = defaultNSMap.xml || 'http://www.w3.org/XML/1998/namespace';
	if(source){
		sax.parse(source,defaultNSMap,entityMap);
	}else{
		sax.errorHandler.error("invalid doc source");
	}
	return domBuilder.doc;
}
function buildErrorHandler(errorImpl,domBuilder,locator){
	if(!errorImpl){
		if(domBuilder instanceof DOMHandler){
			return domBuilder;
		}
		errorImpl = domBuilder ;
	}
	var errorHandler = {}
	var isCallback = errorImpl instanceof Function;
	locator = locator||{}
	function build(key){
		var fn = errorImpl[key];
		if(!fn && isCallback){
			fn = errorImpl.length == 2?function(msg){errorImpl(key,msg)}:errorImpl;
		}
		errorHandler[key] = fn && function(msg){
			fn('[xmldom '+key+']\t'+msg+_locator(locator));
		}||function(){};
	}
	build('warning');
	build('error');
	build('fatalError');
	return errorHandler;
}

//console.log('#\n\n\n\n\n\n\n####')
/**
 * +ContentHandler+ErrorHandler
 * +LexicalHandler+EntityResolver2
 * -DeclHandler-DTDHandler 
 * 
 * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
 * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
 * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
 */
function DOMHandler() {
    this.cdata = false;
}
function position(locator,node){
	node.lineNumber = locator.lineNumber;
	node.columnNumber = locator.columnNumber;
}
/**
 * @see org.xml.sax.ContentHandler#startDocument
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
 */ 
DOMHandler.prototype = {
	startDocument : function() {
    	this.doc = new DOMImplementation().createDocument(null, null, null);
    	if (this.locator) {
        	this.doc.documentURI = this.locator.systemId;
    	}
	},
	startElement:function(namespaceURI, localName, qName, attrs) {
		var doc = this.doc;
	    var el = doc.createElementNS(namespaceURI, qName||localName);
	    var len = attrs.length;
	    appendElement(this, el);
	    this.currentElement = el;
	    
		this.locator && position(this.locator,el)
	    for (var i = 0 ; i < len; i++) {
	        var namespaceURI = attrs.getURI(i);
	        var value = attrs.getValue(i);
	        var qName = attrs.getQName(i);
			var attr = doc.createAttributeNS(namespaceURI, qName);
			this.locator &&position(attrs.getLocator(i),attr);
			attr.value = attr.nodeValue = value;
			el.setAttributeNode(attr)
	    }
	},
	endElement:function(namespaceURI, localName, qName) {
		var current = this.currentElement
		var tagName = current.tagName;
		this.currentElement = current.parentNode;
	},
	startPrefixMapping:function(prefix, uri) {
	},
	endPrefixMapping:function(prefix) {
	},
	processingInstruction:function(target, data) {
	    var ins = this.doc.createProcessingInstruction(target, data);
	    this.locator && position(this.locator,ins)
	    appendElement(this, ins);
	},
	ignorableWhitespace:function(ch, start, length) {
	},
	characters:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
		//console.log(chars)
		if(chars){
			if (this.cdata) {
				var charNode = this.doc.createCDATASection(chars);
			} else {
				var charNode = this.doc.createTextNode(chars);
			}
			if(this.currentElement){
				this.currentElement.appendChild(charNode);
			}else if(/^\s*$/.test(chars)){
				this.doc.appendChild(charNode);
				//process xml
			}
			this.locator && position(this.locator,charNode)
		}
	},
	skippedEntity:function(name) {
	},
	endDocument:function() {
		this.doc.normalize();
	},
	setDocumentLocator:function (locator) {
	    if(this.locator = locator){// && !('lineNumber' in locator)){
	    	locator.lineNumber = 0;
	    }
	},
	//LexicalHandler
	comment:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
	    var comm = this.doc.createComment(chars);
	    this.locator && position(this.locator,comm)
	    appendElement(this, comm);
	},
	
	startCDATA:function() {
	    //used in characters() methods
	    this.cdata = true;
	},
	endCDATA:function() {
	    this.cdata = false;
	},
	
	startDTD:function(name, publicId, systemId) {
		var impl = this.doc.implementation;
	    if (impl && impl.createDocumentType) {
	        var dt = impl.createDocumentType(name, publicId, systemId);
	        this.locator && position(this.locator,dt)
	        appendElement(this, dt);
	    }
	},
	/**
	 * @see org.xml.sax.ErrorHandler
	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
	 */
	warning:function(error) {
		console.warn('[xmldom warning]\t'+error,_locator(this.locator));
	},
	error:function(error) {
		console.error('[xmldom error]\t'+error,_locator(this.locator));
	},
	fatalError:function(error) {
		console.error('[xmldom fatalError]\t'+error,_locator(this.locator));
	    throw error;
	}
}
function _locator(l){
	if(l){
		return '\n@'+(l.systemId ||'')+'#[line:'+l.lineNumber+',col:'+l.columnNumber+']'
	}
}
function _toString(chars,start,length){
	if(typeof chars == 'string'){
		return chars.substr(start,length)
	}else{//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
		if(chars.length >= start+length || start){
			return new java.lang.String(chars,start,length)+'';
		}
		return chars;
	}
}

/*
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
 * used method of org.xml.sax.ext.LexicalHandler:
 *  #comment(chars, start, length)
 *  #startCDATA()
 *  #endCDATA()
 *  #startDTD(name, publicId, systemId)
 *
 *
 * IGNORED method of org.xml.sax.ext.LexicalHandler:
 *  #endDTD()
 *  #startEntity(name)
 *  #endEntity(name)
 *
 *
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
 * IGNORED method of org.xml.sax.ext.DeclHandler
 * 	#attributeDecl(eName, aName, type, mode, value)
 *  #elementDecl(name, model)
 *  #externalEntityDecl(name, publicId, systemId)
 *  #internalEntityDecl(name, value)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
 * IGNORED method of org.xml.sax.EntityResolver2
 *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
 *  #resolveEntity(publicId, systemId)
 *  #getExternalSubset(name, baseURI)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
 * IGNORED method of org.xml.sax.DTDHandler
 *  #notationDecl(name, publicId, systemId) {};
 *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
 */
"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g,function(key){
	DOMHandler.prototype[key] = function(){return null}
})

/* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
function appendElement (hander,node) {
    if (!hander.currentElement) {
        hander.doc.appendChild(node);
    } else {
        hander.currentElement.appendChild(node);
    }
}//appendChild and setAttributeNS are preformance key

//if(typeof require == 'function'){
	var XMLReader = require('./sax').XMLReader;
	var DOMImplementation = exports.DOMImplementation = require('./dom').DOMImplementation;
	exports.XMLSerializer = require('./dom').XMLSerializer ;
	exports.DOMParser = DOMParser;
//}

},{"./dom":24,"./sax":25}],24:[function(require,module,exports){
/*
 * DOM Level 2
 * Object DOMException
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 */

function copy(src,dest){
	for(var p in src){
		dest[p] = src[p];
	}
}
/**
^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
 */
function _extends(Class,Super){
	var pt = Class.prototype;
	if(Object.create){
		var ppt = Object.create(Super.prototype)
		pt.__proto__ = ppt;
	}
	if(!(pt instanceof Super)){
		function t(){};
		t.prototype = Super.prototype;
		t = new t();
		copy(pt,t);
		Class.prototype = pt = t;
	}
	if(pt.constructor != Class){
		if(typeof Class != 'function'){
			console.error("unknow Class:"+Class)
		}
		pt.constructor = Class
	}
}
var htmlns = 'http://www.w3.org/1999/xhtml' ;
// Node Types
var NodeType = {}
var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;

// ExceptionCode
var ExceptionCode = {}
var ExceptionMessage = {};
var INDEX_SIZE_ERR              = ExceptionCode.INDEX_SIZE_ERR              = ((ExceptionMessage[1]="Index size error"),1);
var DOMSTRING_SIZE_ERR          = ExceptionCode.DOMSTRING_SIZE_ERR          = ((ExceptionMessage[2]="DOMString size error"),2);
var HIERARCHY_REQUEST_ERR       = ExceptionCode.HIERARCHY_REQUEST_ERR       = ((ExceptionMessage[3]="Hierarchy request error"),3);
var WRONG_DOCUMENT_ERR          = ExceptionCode.WRONG_DOCUMENT_ERR          = ((ExceptionMessage[4]="Wrong document"),4);
var INVALID_CHARACTER_ERR       = ExceptionCode.INVALID_CHARACTER_ERR       = ((ExceptionMessage[5]="Invalid character"),5);
var NO_DATA_ALLOWED_ERR         = ExceptionCode.NO_DATA_ALLOWED_ERR         = ((ExceptionMessage[6]="No data allowed"),6);
var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7]="No modification allowed"),7);
var NOT_FOUND_ERR               = ExceptionCode.NOT_FOUND_ERR               = ((ExceptionMessage[8]="Not found"),8);
var NOT_SUPPORTED_ERR           = ExceptionCode.NOT_SUPPORTED_ERR           = ((ExceptionMessage[9]="Not supported"),9);
var INUSE_ATTRIBUTE_ERR         = ExceptionCode.INUSE_ATTRIBUTE_ERR         = ((ExceptionMessage[10]="Attribute in use"),10);
//level2
var INVALID_STATE_ERR        	= ExceptionCode.INVALID_STATE_ERR        	= ((ExceptionMessage[11]="Invalid state"),11);
var SYNTAX_ERR               	= ExceptionCode.SYNTAX_ERR               	= ((ExceptionMessage[12]="Syntax error"),12);
var INVALID_MODIFICATION_ERR 	= ExceptionCode.INVALID_MODIFICATION_ERR 	= ((ExceptionMessage[13]="Invalid modification"),13);
var NAMESPACE_ERR            	= ExceptionCode.NAMESPACE_ERR           	= ((ExceptionMessage[14]="Invalid namespace"),14);
var INVALID_ACCESS_ERR       	= ExceptionCode.INVALID_ACCESS_ERR      	= ((ExceptionMessage[15]="Invalid access"),15);


function DOMException(code, message) {
	if(message instanceof Error){
		var error = message;
	}else{
		error = this;
		Error.call(this, ExceptionMessage[code]);
		this.message = ExceptionMessage[code];
		if(Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
	}
	error.code = code;
	if(message) this.message = this.message + ": " + message;
	return error;
};
DOMException.prototype = Error.prototype;
copy(ExceptionCode,DOMException)
/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
 * The items in the NodeList are accessible via an integral index, starting from 0.
 */
function NodeList() {
};
NodeList.prototype = {
	/**
	 * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
	 * @standard level1
	 */
	length:0, 
	/**
	 * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
	 * @standard level1
	 * @param index  unsigned long 
	 *   Index into the collection.
	 * @return Node
	 * 	The node at the indexth position in the NodeList, or null if that is not a valid index. 
	 */
	item: function(index) {
		return this[index] || null;
	},
	toString:function(isHTML,nodeFilter){
		for(var buf = [], i = 0;i<this.length;i++){
			serializeToString(this[i],buf,isHTML,nodeFilter);
		}
		return buf.join('');
	}
};
function LiveNodeList(node,refresh){
	this._node = node;
	this._refresh = refresh
	_updateLiveList(this);
}
function _updateLiveList(list){
	var inc = list._node._inc || list._node.ownerDocument._inc;
	if(list._inc != inc){
		var ls = list._refresh(list._node);
		//console.log(ls.length)
		__set__(list,'length',ls.length);
		copy(ls,list);
		list._inc = inc;
	}
}
LiveNodeList.prototype.item = function(i){
	_updateLiveList(this);
	return this[i];
}

_extends(LiveNodeList,NodeList);
/**
 * 
 * Objects implementing the NamedNodeMap interface are used to represent collections of nodes that can be accessed by name. Note that NamedNodeMap does not inherit from NodeList; NamedNodeMaps are not maintained in any particular order. Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index, but this is simply to allow convenient enumeration of the contents of a NamedNodeMap, and does not imply that the DOM specifies an order to these Nodes.
 * NamedNodeMap objects in the DOM are live.
 * used for attributes or DocumentType entities 
 */
function NamedNodeMap() {
};

function _findNodeIndex(list,node){
	var i = list.length;
	while(i--){
		if(list[i] === node){return i}
	}
}

function _addNamedNode(el,list,newAttr,oldAttr){
	if(oldAttr){
		list[_findNodeIndex(list,oldAttr)] = newAttr;
	}else{
		list[list.length++] = newAttr;
	}
	if(el){
		newAttr.ownerElement = el;
		var doc = el.ownerDocument;
		if(doc){
			oldAttr && _onRemoveAttribute(doc,el,oldAttr);
			_onAddAttribute(doc,el,newAttr);
		}
	}
}
function _removeNamedNode(el,list,attr){
	//console.log('remove attr:'+attr)
	var i = _findNodeIndex(list,attr);
	if(i>=0){
		var lastIndex = list.length-1
		while(i<lastIndex){
			list[i] = list[++i]
		}
		list.length = lastIndex;
		if(el){
			var doc = el.ownerDocument;
			if(doc){
				_onRemoveAttribute(doc,el,attr);
				attr.ownerElement = null;
			}
		}
	}else{
		throw DOMException(NOT_FOUND_ERR,new Error(el.tagName+'@'+attr))
	}
}
NamedNodeMap.prototype = {
	length:0,
	item:NodeList.prototype.item,
	getNamedItem: function(key) {
//		if(key.indexOf(':')>0 || key == 'xmlns'){
//			return null;
//		}
		//console.log()
		var i = this.length;
		while(i--){
			var attr = this[i];
			//console.log(attr.nodeName,key)
			if(attr.nodeName == key){
				return attr;
			}
		}
	},
	setNamedItem: function(attr) {
		var el = attr.ownerElement;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		var oldAttr = this.getNamedItem(attr.nodeName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},
	/* returns Node */
	setNamedItemNS: function(attr) {// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
		var el = attr.ownerElement, oldAttr;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		oldAttr = this.getNamedItemNS(attr.namespaceURI,attr.localName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},

	/* returns Node */
	removeNamedItem: function(key) {
		var attr = this.getNamedItem(key);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
		
		
	},// raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
	
	//for level2
	removeNamedItemNS:function(namespaceURI,localName){
		var attr = this.getNamedItemNS(namespaceURI,localName);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
	},
	getNamedItemNS: function(namespaceURI, localName) {
		var i = this.length;
		while(i--){
			var node = this[i];
			if(node.localName == localName && node.namespaceURI == namespaceURI){
				return node;
			}
		}
		return null;
	}
};
/**
 * @see http://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490
 */
function DOMImplementation(/* Object */ features) {
	this._features = {};
	if (features) {
		for (var feature in features) {
			 this._features = features[feature];
		}
	}
};

DOMImplementation.prototype = {
	hasFeature: function(/* string */ feature, /* string */ version) {
		var versions = this._features[feature.toLowerCase()];
		if (versions && (!version || version in versions)) {
			return true;
		} else {
			return false;
		}
	},
	// Introduced in DOM Level 2:
	createDocument:function(namespaceURI,  qualifiedName, doctype){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR,WRONG_DOCUMENT_ERR
		var doc = new Document();
		doc.implementation = this;
		doc.childNodes = new NodeList();
		doc.doctype = doctype;
		if(doctype){
			doc.appendChild(doctype);
		}
		if(qualifiedName){
			var root = doc.createElementNS(namespaceURI,qualifiedName);
			doc.appendChild(root);
		}
		return doc;
	},
	// Introduced in DOM Level 2:
	createDocumentType:function(qualifiedName, publicId, systemId){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR
		var node = new DocumentType();
		node.name = qualifiedName;
		node.nodeName = qualifiedName;
		node.publicId = publicId;
		node.systemId = systemId;
		// Introduced in DOM Level 2:
		//readonly attribute DOMString        internalSubset;
		
		//TODO:..
		//  readonly attribute NamedNodeMap     entities;
		//  readonly attribute NamedNodeMap     notations;
		return node;
	}
};


/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
 */

function Node() {
};

Node.prototype = {
	firstChild : null,
	lastChild : null,
	previousSibling : null,
	nextSibling : null,
	attributes : null,
	parentNode : null,
	childNodes : null,
	ownerDocument : null,
	nodeValue : null,
	namespaceURI : null,
	prefix : null,
	localName : null,
	// Modified in DOM Level 2:
	insertBefore:function(newChild, refChild){//raises 
		return _insertBefore(this,newChild,refChild);
	},
	replaceChild:function(newChild, oldChild){//raises 
		this.insertBefore(newChild,oldChild);
		if(oldChild){
			this.removeChild(oldChild);
		}
	},
	removeChild:function(oldChild){
		return _removeChild(this,oldChild);
	},
	appendChild:function(newChild){
		return this.insertBefore(newChild,null);
	},
	hasChildNodes:function(){
		return this.firstChild != null;
	},
	cloneNode:function(deep){
		return cloneNode(this.ownerDocument||this,this,deep);
	},
	// Modified in DOM Level 2:
	normalize:function(){
		var child = this.firstChild;
		while(child){
			var next = child.nextSibling;
			if(next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE){
				this.removeChild(next);
				child.appendData(next.data);
			}else{
				child.normalize();
				child = next;
			}
		}
	},
  	// Introduced in DOM Level 2:
	isSupported:function(feature, version){
		return this.ownerDocument.implementation.hasFeature(feature,version);
	},
    // Introduced in DOM Level 2:
    hasAttributes:function(){
    	return this.attributes.length>0;
    },
    lookupPrefix:function(namespaceURI){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			for(var n in map){
    				if(map[n] == namespaceURI){
    					return n;
    				}
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    lookupNamespaceURI:function(prefix){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			if(prefix in map){
    				return map[prefix] ;
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    isDefaultNamespace:function(namespaceURI){
    	var prefix = this.lookupPrefix(namespaceURI);
    	return prefix == null;
    }
};


function _xmlEncoder(c){
	return c == '<' && '&lt;' ||
         c == '>' && '&gt;' ||
         c == '&' && '&amp;' ||
         c == '"' && '&quot;' ||
         '&#'+c.charCodeAt()+';'
}


copy(NodeType,Node);
copy(NodeType,Node.prototype);

/**
 * @param callback return true for continue,false for break
 * @return boolean true: break visit;
 */
function _visitNode(node,callback){
	if(callback(node)){
		return true;
	}
	if(node = node.firstChild){
		do{
			if(_visitNode(node,callback)){return true}
        }while(node=node.nextSibling)
    }
}



function Document(){
}
function _onAddAttribute(doc,el,newAttr){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value
	}
}
function _onRemoveAttribute(doc,el,newAttr,remove){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		delete el._nsMap[newAttr.prefix?newAttr.localName:'']
	}
}
function _onUpdateChild(doc,el,newChild){
	if(doc && doc._inc){
		doc._inc++;
		//update childNodes
		var cs = el.childNodes;
		if(newChild){
			cs[cs.length++] = newChild;
		}else{
			//console.log(1)
			var child = el.firstChild;
			var i = 0;
			while(child){
				cs[i++] = child;
				child =child.nextSibling;
			}
			cs.length = i;
		}
	}
}

/**
 * attributes;
 * children;
 * 
 * writeable properties:
 * nodeValue,Attr:value,CharacterData:data
 * prefix
 */
function _removeChild(parentNode,child){
	var previous = child.previousSibling;
	var next = child.nextSibling;
	if(previous){
		previous.nextSibling = next;
	}else{
		parentNode.firstChild = next
	}
	if(next){
		next.previousSibling = previous;
	}else{
		parentNode.lastChild = previous;
	}
	_onUpdateChild(parentNode.ownerDocument,parentNode);
	return child;
}
/**
 * preformance key(refChild == null)
 */
function _insertBefore(parentNode,newChild,nextChild){
	var cp = newChild.parentNode;
	if(cp){
		cp.removeChild(newChild);//remove and update
	}
	if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
		var newFirst = newChild.firstChild;
		if (newFirst == null) {
			return newChild;
		}
		var newLast = newChild.lastChild;
	}else{
		newFirst = newLast = newChild;
	}
	var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;

	newFirst.previousSibling = pre;
	newLast.nextSibling = nextChild;
	
	
	if(pre){
		pre.nextSibling = newFirst;
	}else{
		parentNode.firstChild = newFirst;
	}
	if(nextChild == null){
		parentNode.lastChild = newLast;
	}else{
		nextChild.previousSibling = newLast;
	}
	do{
		newFirst.parentNode = parentNode;
	}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
	_onUpdateChild(parentNode.ownerDocument||parentNode,parentNode);
	//console.log(parentNode.lastChild.nextSibling == null)
	if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
		newChild.firstChild = newChild.lastChild = null;
	}
	return newChild;
}
function _appendSingleChild(parentNode,newChild){
	var cp = newChild.parentNode;
	if(cp){
		var pre = parentNode.lastChild;
		cp.removeChild(newChild);//remove and update
		var pre = parentNode.lastChild;
	}
	var pre = parentNode.lastChild;
	newChild.parentNode = parentNode;
	newChild.previousSibling = pre;
	newChild.nextSibling = null;
	if(pre){
		pre.nextSibling = newChild;
	}else{
		parentNode.firstChild = newChild;
	}
	parentNode.lastChild = newChild;
	_onUpdateChild(parentNode.ownerDocument,parentNode,newChild);
	return newChild;
	//console.log("__aa",parentNode.lastChild.nextSibling == null)
}
Document.prototype = {
	//implementation : null,
	nodeName :  '#document',
	nodeType :  DOCUMENT_NODE,
	doctype :  null,
	documentElement :  null,
	_inc : 1,
	
	insertBefore :  function(newChild, refChild){//raises 
		if(newChild.nodeType == DOCUMENT_FRAGMENT_NODE){
			var child = newChild.firstChild;
			while(child){
				var next = child.nextSibling;
				this.insertBefore(child,refChild);
				child = next;
			}
			return newChild;
		}
		if(this.documentElement == null && newChild.nodeType == ELEMENT_NODE){
			this.documentElement = newChild;
		}
		
		return _insertBefore(this,newChild,refChild),(newChild.ownerDocument = this),newChild;
	},
	removeChild :  function(oldChild){
		if(this.documentElement == oldChild){
			this.documentElement = null;
		}
		return _removeChild(this,oldChild);
	},
	// Introduced in DOM Level 2:
	importNode : function(importedNode,deep){
		return importNode(this,importedNode,deep);
	},
	// Introduced in DOM Level 2:
	getElementById :	function(id){
		var rtv = null;
		_visitNode(this.documentElement,function(node){
			if(node.nodeType == ELEMENT_NODE){
				if(node.getAttribute('id') == id){
					rtv = node;
					return true;
				}
			}
		})
		return rtv;
	},
	
	//document factory method:
	createElement :	function(tagName){
		var node = new Element();
		node.ownerDocument = this;
		node.nodeName = tagName;
		node.tagName = tagName;
		node.childNodes = new NodeList();
		var attrs	= node.attributes = new NamedNodeMap();
		attrs._ownerElement = node;
		return node;
	},
	createDocumentFragment :	function(){
		var node = new DocumentFragment();
		node.ownerDocument = this;
		node.childNodes = new NodeList();
		return node;
	},
	createTextNode :	function(data){
		var node = new Text();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createComment :	function(data){
		var node = new Comment();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createCDATASection :	function(data){
		var node = new CDATASection();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createProcessingInstruction :	function(target,data){
		var node = new ProcessingInstruction();
		node.ownerDocument = this;
		node.tagName = node.target = target;
		node.nodeValue= node.data = data;
		return node;
	},
	createAttribute :	function(name){
		var node = new Attr();
		node.ownerDocument	= this;
		node.name = name;
		node.nodeName	= name;
		node.localName = name;
		node.specified = true;
		return node;
	},
	createEntityReference :	function(name){
		var node = new EntityReference();
		node.ownerDocument	= this;
		node.nodeName	= name;
		return node;
	},
	// Introduced in DOM Level 2:
	createElementNS :	function(namespaceURI,qualifiedName){
		var node = new Element();
		var pl = qualifiedName.split(':');
		var attrs	= node.attributes = new NamedNodeMap();
		node.childNodes = new NodeList();
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.tagName = qualifiedName;
		node.namespaceURI = namespaceURI;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		attrs._ownerElement = node;
		return node;
	},
	// Introduced in DOM Level 2:
	createAttributeNS :	function(namespaceURI,qualifiedName){
		var node = new Attr();
		var pl = qualifiedName.split(':');
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.name = qualifiedName;
		node.namespaceURI = namespaceURI;
		node.specified = true;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		return node;
	}
};
_extends(Document,Node);


function Element() {
	this._nsMap = {};
};
Element.prototype = {
	nodeType : ELEMENT_NODE,
	hasAttribute : function(name){
		return this.getAttributeNode(name)!=null;
	},
	getAttribute : function(name){
		var attr = this.getAttributeNode(name);
		return attr && attr.value || '';
	},
	getAttributeNode : function(name){
		return this.attributes.getNamedItem(name);
	},
	setAttribute : function(name, value){
		var attr = this.ownerDocument.createAttribute(name);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	removeAttribute : function(name){
		var attr = this.getAttributeNode(name)
		attr && this.removeAttributeNode(attr);
	},
	
	//four real opeartion method
	appendChild:function(newChild){
		if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
			return this.insertBefore(newChild,null);
		}else{
			return _appendSingleChild(this,newChild);
		}
	},
	setAttributeNode : function(newAttr){
		return this.attributes.setNamedItem(newAttr);
	},
	setAttributeNodeNS : function(newAttr){
		return this.attributes.setNamedItemNS(newAttr);
	},
	removeAttributeNode : function(oldAttr){
		//console.log(this == oldAttr.ownerElement)
		return this.attributes.removeNamedItem(oldAttr.nodeName);
	},
	//get real attribute name,and remove it by removeAttributeNode
	removeAttributeNS : function(namespaceURI, localName){
		var old = this.getAttributeNodeNS(namespaceURI, localName);
		old && this.removeAttributeNode(old);
	},
	
	hasAttributeNS : function(namespaceURI, localName){
		return this.getAttributeNodeNS(namespaceURI, localName)!=null;
	},
	getAttributeNS : function(namespaceURI, localName){
		var attr = this.getAttributeNodeNS(namespaceURI, localName);
		return attr && attr.value || '';
	},
	setAttributeNS : function(namespaceURI, qualifiedName, value){
		var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	getAttributeNodeNS : function(namespaceURI, localName){
		return this.attributes.getNamedItemNS(namespaceURI, localName);
	},
	
	getElementsByTagName : function(tagName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)){
					ls.push(node);
				}
			});
			return ls;
		});
	},
	getElementsByTagNameNS : function(namespaceURI, localName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)){
					ls.push(node);
				}
			});
			return ls;
			
		});
	}
};
Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;


_extends(Element,Node);
function Attr() {
};
Attr.prototype.nodeType = ATTRIBUTE_NODE;
_extends(Attr,Node);


function CharacterData() {
};
CharacterData.prototype = {
	data : '',
	substringData : function(offset, count) {
		return this.data.substring(offset, offset+count);
	},
	appendData: function(text) {
		text = this.data+text;
		this.nodeValue = this.data = text;
		this.length = text.length;
	},
	insertData: function(offset,text) {
		this.replaceData(offset,0,text);
	
	},
	appendChild:function(newChild){
		throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR])
	},
	deleteData: function(offset, count) {
		this.replaceData(offset,count,"");
	},
	replaceData: function(offset, count, text) {
		var start = this.data.substring(0,offset);
		var end = this.data.substring(offset+count);
		text = start + text + end;
		this.nodeValue = this.data = text;
		this.length = text.length;
	}
}
_extends(CharacterData,Node);
function Text() {
};
Text.prototype = {
	nodeName : "#text",
	nodeType : TEXT_NODE,
	splitText : function(offset) {
		var text = this.data;
		var newText = text.substring(offset);
		text = text.substring(0, offset);
		this.data = this.nodeValue = text;
		this.length = text.length;
		var newNode = this.ownerDocument.createTextNode(newText);
		if(this.parentNode){
			this.parentNode.insertBefore(newNode, this.nextSibling);
		}
		return newNode;
	}
}
_extends(Text,CharacterData);
function Comment() {
};
Comment.prototype = {
	nodeName : "#comment",
	nodeType : COMMENT_NODE
}
_extends(Comment,CharacterData);

function CDATASection() {
};
CDATASection.prototype = {
	nodeName : "#cdata-section",
	nodeType : CDATA_SECTION_NODE
}
_extends(CDATASection,CharacterData);


function DocumentType() {
};
DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
_extends(DocumentType,Node);

function Notation() {
};
Notation.prototype.nodeType = NOTATION_NODE;
_extends(Notation,Node);

function Entity() {
};
Entity.prototype.nodeType = ENTITY_NODE;
_extends(Entity,Node);

function EntityReference() {
};
EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
_extends(EntityReference,Node);

function DocumentFragment() {
};
DocumentFragment.prototype.nodeName =	"#document-fragment";
DocumentFragment.prototype.nodeType =	DOCUMENT_FRAGMENT_NODE;
_extends(DocumentFragment,Node);


function ProcessingInstruction() {
}
ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
_extends(ProcessingInstruction,Node);
function XMLSerializer(){}
XMLSerializer.prototype.serializeToString = function(node,isHtml,nodeFilter){
	return nodeSerializeToString.call(node,isHtml,nodeFilter);
}
Node.prototype.toString = nodeSerializeToString;
function nodeSerializeToString(isHtml,nodeFilter){
	var buf = [];
	var refNode = this.nodeType == 9?this.documentElement:this;
	var prefix = refNode.prefix;
	var uri = refNode.namespaceURI;
	
	if(uri && prefix == null){
		//console.log(prefix)
		var prefix = refNode.lookupPrefix(uri);
		if(prefix == null){
			//isHTML = true;
			var visibleNamespaces=[
			{namespace:uri,prefix:null}
			//{namespace:uri,prefix:''}
			]
		}
	}
	serializeToString(this,buf,isHtml,nodeFilter,visibleNamespaces);
	//console.log('###',this.nodeType,uri,prefix,buf.join(''))
	return buf.join('');
}
function needNamespaceDefine(node,isHTML, visibleNamespaces) {
	var prefix = node.prefix||'';
	var uri = node.namespaceURI;
	if (!prefix && !uri){
		return false;
	}
	if (prefix === "xml" && uri === "http://www.w3.org/XML/1998/namespace" 
		|| uri == 'http://www.w3.org/2000/xmlns/'){
		return false;
	}
	
	var i = visibleNamespaces.length 
	//console.log('@@@@',node.tagName,prefix,uri,visibleNamespaces)
	while (i--) {
		var ns = visibleNamespaces[i];
		// get namespace prefix
		//console.log(node.nodeType,node.tagName,ns.prefix,prefix)
		if (ns.prefix == prefix){
			return ns.namespace != uri;
		}
	}
	//console.log(isHTML,uri,prefix=='')
	//if(isHTML && prefix ==null && uri == 'http://www.w3.org/1999/xhtml'){
	//	return false;
	//}
	//node.flag = '11111'
	//console.error(3,true,node.flag,node.prefix,node.namespaceURI)
	return true;
}
function serializeToString(node,buf,isHTML,nodeFilter,visibleNamespaces){
	if(nodeFilter){
		node = nodeFilter(node);
		if(node){
			if(typeof node == 'string'){
				buf.push(node);
				return;
			}
		}else{
			return;
		}
		//buf.sort.apply(attrs, attributeSorter);
	}
	switch(node.nodeType){
	case ELEMENT_NODE:
		if (!visibleNamespaces) visibleNamespaces = [];
		var startVisibleNamespaces = visibleNamespaces.length;
		var attrs = node.attributes;
		var len = attrs.length;
		var child = node.firstChild;
		var nodeName = node.tagName;
		
		isHTML =  (htmlns === node.namespaceURI) ||isHTML 
		buf.push('<',nodeName);
		
		
		
		for(var i=0;i<len;i++){
			// add namespaces for attributes
			var attr = attrs.item(i);
			if (attr.prefix == 'xmlns') {
				visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
			}else if(attr.nodeName == 'xmlns'){
				visibleNamespaces.push({ prefix: '', namespace: attr.value });
			}
		}
		for(var i=0;i<len;i++){
			var attr = attrs.item(i);
			if (needNamespaceDefine(attr,isHTML, visibleNamespaces)) {
				var prefix = attr.prefix||'';
				var uri = attr.namespaceURI;
				var ns = prefix ? ' xmlns:' + prefix : " xmlns";
				buf.push(ns, '="' , uri , '"');
				visibleNamespaces.push({ prefix: prefix, namespace:uri });
			}
			serializeToString(attr,buf,isHTML,nodeFilter,visibleNamespaces);
		}
		// add namespace for current node		
		if (needNamespaceDefine(node,isHTML, visibleNamespaces)) {
			var prefix = node.prefix||'';
			var uri = node.namespaceURI;
			var ns = prefix ? ' xmlns:' + prefix : " xmlns";
			buf.push(ns, '="' , uri , '"');
			visibleNamespaces.push({ prefix: prefix, namespace:uri });
		}
		
		if(child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)){
			buf.push('>');
			//if is cdata child node
			if(isHTML && /^script$/i.test(nodeName)){
				while(child){
					if(child.data){
						buf.push(child.data);
					}else{
						serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
					}
					child = child.nextSibling;
				}
			}else
			{
				while(child){
					serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
					child = child.nextSibling;
				}
			}
			buf.push('</',nodeName,'>');
		}else{
			buf.push('/>');
		}
		// remove added visible namespaces
		//visibleNamespaces.length = startVisibleNamespaces;
		return;
	case DOCUMENT_NODE:
	case DOCUMENT_FRAGMENT_NODE:
		var child = node.firstChild;
		while(child){
			serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
			child = child.nextSibling;
		}
		return;
	case ATTRIBUTE_NODE:
		return buf.push(' ',node.name,'="',node.value.replace(/[<&"]/g,_xmlEncoder),'"');
	case TEXT_NODE:
		return buf.push(node.data.replace(/[<&]/g,_xmlEncoder));
	case CDATA_SECTION_NODE:
		return buf.push( '<![CDATA[',node.data,']]>');
	case COMMENT_NODE:
		return buf.push( "<!--",node.data,"-->");
	case DOCUMENT_TYPE_NODE:
		var pubid = node.publicId;
		var sysid = node.systemId;
		buf.push('<!DOCTYPE ',node.name);
		if(pubid){
			buf.push(' PUBLIC "',pubid);
			if (sysid && sysid!='.') {
				buf.push( '" "',sysid);
			}
			buf.push('">');
		}else if(sysid && sysid!='.'){
			buf.push(' SYSTEM "',sysid,'">');
		}else{
			var sub = node.internalSubset;
			if(sub){
				buf.push(" [",sub,"]");
			}
			buf.push(">");
		}
		return;
	case PROCESSING_INSTRUCTION_NODE:
		return buf.push( "<?",node.target," ",node.data,"?>");
	case ENTITY_REFERENCE_NODE:
		return buf.push( '&',node.nodeName,';');
	//case ENTITY_NODE:
	//case NOTATION_NODE:
	default:
		buf.push('??',node.nodeName);
	}
}
function importNode(doc,node,deep){
	var node2;
	switch (node.nodeType) {
	case ELEMENT_NODE:
		node2 = node.cloneNode(false);
		node2.ownerDocument = doc;
		//var attrs = node2.attributes;
		//var len = attrs.length;
		//for(var i=0;i<len;i++){
			//node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
		//}
	case DOCUMENT_FRAGMENT_NODE:
		break;
	case ATTRIBUTE_NODE:
		deep = true;
		break;
	//case ENTITY_REFERENCE_NODE:
	//case PROCESSING_INSTRUCTION_NODE:
	////case TEXT_NODE:
	//case CDATA_SECTION_NODE:
	//case COMMENT_NODE:
	//	deep = false;
	//	break;
	//case DOCUMENT_NODE:
	//case DOCUMENT_TYPE_NODE:
	//cannot be imported.
	//case ENTITY_NODE:
	//case NOTATION_NODE：
	//can not hit in level3
	//default:throw e;
	}
	if(!node2){
		node2 = node.cloneNode(false);//false
	}
	node2.ownerDocument = doc;
	node2.parentNode = null;
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(importNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}
//
//var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
//					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
function cloneNode(doc,node,deep){
	var node2 = new node.constructor();
	for(var n in node){
		var v = node[n];
		if(typeof v != 'object' ){
			if(v != node2[n]){
				node2[n] = v;
			}
		}
	}
	if(node.childNodes){
		node2.childNodes = new NodeList();
	}
	node2.ownerDocument = doc;
	switch (node2.nodeType) {
	case ELEMENT_NODE:
		var attrs	= node.attributes;
		var attrs2	= node2.attributes = new NamedNodeMap();
		var len = attrs.length
		attrs2._ownerElement = node2;
		for(var i=0;i<len;i++){
			node2.setAttributeNode(cloneNode(doc,attrs.item(i),true));
		}
		break;;
	case ATTRIBUTE_NODE:
		deep = true;
	}
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(cloneNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}

function __set__(object,key,value){
	object[key] = value
}
//do dynamic
try{
	if(Object.defineProperty){
		Object.defineProperty(LiveNodeList.prototype,'length',{
			get:function(){
				_updateLiveList(this);
				return this.$$length;
			}
		});
		Object.defineProperty(Node.prototype,'textContent',{
			get:function(){
				return getTextContent(this);
			},
			set:function(data){
				switch(this.nodeType){
				case ELEMENT_NODE:
				case DOCUMENT_FRAGMENT_NODE:
					while(this.firstChild){
						this.removeChild(this.firstChild);
					}
					if(data || String(data)){
						this.appendChild(this.ownerDocument.createTextNode(data));
					}
					break;
				default:
					//TODO:
					this.data = data;
					this.value = data;
					this.nodeValue = data;
				}
			}
		})
		
		function getTextContent(node){
			switch(node.nodeType){
			case ELEMENT_NODE:
			case DOCUMENT_FRAGMENT_NODE:
				var buf = [];
				node = node.firstChild;
				while(node){
					if(node.nodeType!==7 && node.nodeType !==8){
						buf.push(getTextContent(node));
					}
					node = node.nextSibling;
				}
				return buf.join('');
			default:
				return node.nodeValue;
			}
		}
		__set__ = function(object,key,value){
			//console.log(value)
			object['$$'+key] = value
		}
	}
}catch(e){//ie8
}

//if(typeof require == 'function'){
	exports.DOMImplementation = DOMImplementation;
	exports.XMLSerializer = XMLSerializer;
//}

},{}],25:[function(require,module,exports){
//[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
//[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
//[5]   	Name	   ::=   	NameStartChar (NameChar)*
var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]///\u10000-\uEFFFF
var nameChar = new RegExp("[\\-\\.0-9"+nameStartChar.source.slice(1,-1)+"\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
var tagNamePattern = new RegExp('^'+nameStartChar.source+nameChar.source+'*(?:\:'+nameStartChar.source+nameChar.source+'*)?$');
//var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
//var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
var S_TAG = 0;//tag name offerring
var S_ATTR = 1;//attr name offerring 
var S_ATTR_SPACE=2;//attr name end and space offer
var S_EQ = 3;//=space?
var S_ATTR_NOQUOT_VALUE = 4;//attr value(no quot value only)
var S_ATTR_END = 5;//attr value end and no space(quot end)
var S_TAG_SPACE = 6;//(attr value end || tag end ) && (space offer)
var S_TAG_CLOSE = 7;//closed el<el />

function XMLReader(){
	
}

XMLReader.prototype = {
	parse:function(source,defaultNSMap,entityMap){
		var domBuilder = this.domBuilder;
		domBuilder.startDocument();
		_copy(defaultNSMap ,defaultNSMap = {})
		parse(source,defaultNSMap,entityMap,
				domBuilder,this.errorHandler);
		domBuilder.endDocument();
	}
}
function parse(source,defaultNSMapCopy,entityMap,domBuilder,errorHandler){
	function fixedFromCharCode(code) {
		// String.prototype.fromCharCode does not supports
		// > 2 bytes unicode chars directly
		if (code > 0xffff) {
			code -= 0x10000;
			var surrogate1 = 0xd800 + (code >> 10)
				, surrogate2 = 0xdc00 + (code & 0x3ff);

			return String.fromCharCode(surrogate1, surrogate2);
		} else {
			return String.fromCharCode(code);
		}
	}
	function entityReplacer(a){
		var k = a.slice(1,-1);
		if(k in entityMap){
			return entityMap[k]; 
		}else if(k.charAt(0) === '#'){
			return fixedFromCharCode(parseInt(k.substr(1).replace('x','0x')))
		}else{
			errorHandler.error('entity not found:'+a);
			return a;
		}
	}
	function appendText(end){//has some bugs
		if(end>start){
			var xt = source.substring(start,end).replace(/&#?\w+;/g,entityReplacer);
			locator&&position(start);
			domBuilder.characters(xt,0,end-start);
			start = end
		}
	}
	function position(p,m){
		while(p>=lineEnd && (m = linePattern.exec(source))){
			lineStart = m.index;
			lineEnd = lineStart + m[0].length;
			locator.lineNumber++;
			//console.log('line++:',locator,startPos,endPos)
		}
		locator.columnNumber = p-lineStart+1;
	}
	var lineStart = 0;
	var lineEnd = 0;
	var linePattern = /.*(?:\r\n?|\n)|.*$/g
	var locator = domBuilder.locator;
	
	var parseStack = [{currentNSMap:defaultNSMapCopy}]
	var closeMap = {};
	var start = 0;
	while(true){
		try{
			var tagStart = source.indexOf('<',start);
			if(tagStart<0){
				if(!source.substr(start).match(/^\s*$/)){
					var doc = domBuilder.doc;
	    			var text = doc.createTextNode(source.substr(start));
	    			doc.appendChild(text);
	    			domBuilder.currentElement = text;
				}
				return;
			}
			if(tagStart>start){
				appendText(tagStart);
			}
			switch(source.charAt(tagStart+1)){
			case '/':
				var end = source.indexOf('>',tagStart+3);
				var tagName = source.substring(tagStart+2,end);
				var config = parseStack.pop();
				if(end<0){
					
	        		tagName = source.substring(tagStart+2).replace(/[\s<].*/,'');
	        		//console.error('#@@@@@@'+tagName)
	        		errorHandler.error("end tag name: "+tagName+' is not complete:'+config.tagName);
	        		end = tagStart+1+tagName.length;
	        	}else if(tagName.match(/\s</)){
	        		tagName = tagName.replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' maybe not complete');
	        		end = tagStart+1+tagName.length;
				}
				//console.error(parseStack.length,parseStack)
				//console.error(config);
				var localNSMap = config.localNSMap;
				var endMatch = config.tagName == tagName;
				var endIgnoreCaseMach = endMatch || config.tagName&&config.tagName.toLowerCase() == tagName.toLowerCase()
		        if(endIgnoreCaseMach){
		        	domBuilder.endElement(config.uri,config.localName,tagName);
					if(localNSMap){
						for(var prefix in localNSMap){
							domBuilder.endPrefixMapping(prefix) ;
						}
					}
					if(!endMatch){
		            	errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName );
					}
		        }else{
		        	parseStack.push(config)
		        }
				
				end++;
				break;
				// end elment
			case '?':// <?...?>
				locator&&position(tagStart);
				end = parseInstruction(source,tagStart,domBuilder);
				break;
			case '!':// <!doctype,<![CDATA,<!--
				locator&&position(tagStart);
				end = parseDCC(source,tagStart,domBuilder,errorHandler);
				break;
			default:
				locator&&position(tagStart);
				var el = new ElementAttributes();
				var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
				//elStartEnd
				var end = parseElementStartPart(source,tagStart,el,currentNSMap,entityReplacer,errorHandler);
				var len = el.length;
				
				
				if(!el.closed && fixSelfClosed(source,end,el.tagName,closeMap)){
					el.closed = true;
					if(!entityMap.nbsp){
						errorHandler.warning('unclosed xml attribute');
					}
				}
				if(locator && len){
					var locator2 = copyLocator(locator,{});
					//try{//attribute position fixed
					for(var i = 0;i<len;i++){
						var a = el[i];
						position(a.offset);
						a.locator = copyLocator(locator,{});
					}
					//}catch(e){console.error('@@@@@'+e)}
					domBuilder.locator = locator2
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
					domBuilder.locator = locator;
				}else{
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
				}
				
				
				
				if(el.uri === 'http://www.w3.org/1999/xhtml' && !el.closed){
					end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder)
				}else{
					end++;
				}
			}
		}catch(e){
			errorHandler.error('element parse error: '+e)
			//errorHandler.error('element parse error: '+e);
			end = -1;
			//throw e;
		}
		if(end>start){
			start = end;
		}else{
			//TODO: 这里有可能sax回退，有位置错误风险
			appendText(Math.max(tagStart,start)+1);
		}
	}
}
function copyLocator(f,t){
	t.lineNumber = f.lineNumber;
	t.columnNumber = f.columnNumber;
	return t;
}

/**
 * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
 */
function parseElementStartPart(source,start,el,currentNSMap,entityReplacer,errorHandler){
	var attrName;
	var value;
	var p = ++start;
	var s = S_TAG;//status
	while(true){
		var c = source.charAt(p);
		switch(c){
		case '=':
			if(s === S_ATTR){//attrName
				attrName = source.slice(start,p);
				s = S_EQ;
			}else if(s === S_ATTR_SPACE){
				s = S_EQ;
			}else{
				//fatalError: equal must after attrName or space after attrName
				throw new Error('attribute equal must after attrName');
			}
			break;
		case '\'':
		case '"':
			if(s === S_EQ || s === S_ATTR //|| s == S_ATTR_SPACE
				){//equal
				if(s === S_ATTR){
					errorHandler.warning('attribute value must after "="')
					attrName = source.slice(start,p)
				}
				start = p+1;
				p = source.indexOf(c,start)
				if(p>0){
					value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					el.add(attrName,value,start-1);
					s = S_ATTR_END;
				}else{
					//fatalError: no end quot match
					throw new Error('attribute value no end \''+c+'\' match');
				}
			}else if(s == S_ATTR_NOQUOT_VALUE){
				value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
				//console.log(attrName,value,start,p)
				el.add(attrName,value,start);
				//console.dir(el)
				errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
				start = p+1;
				s = S_ATTR_END
			}else{
				//fatalError: no equal before
				throw new Error('attribute value must after "="');
			}
			break;
		case '/':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				s =S_TAG_CLOSE;
				el.closed = true;
			case S_ATTR_NOQUOT_VALUE:
			case S_ATTR:
			case S_ATTR_SPACE:
				break;
			//case S_EQ:
			default:
				throw new Error("attribute invalid close char('/')")
			}
			break;
		case ''://end document
			//throw new Error('unexpected end of input')
			errorHandler.error('unexpected end of input');
			if(s == S_TAG){
				el.setTagName(source.slice(start,p));
			}
			return p;
		case '>':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				break;//normal
			case S_ATTR_NOQUOT_VALUE://Compatible state
			case S_ATTR:
				value = source.slice(start,p);
				if(value.slice(-1) === '/'){
					el.closed  = true;
					value = value.slice(0,-1)
				}
			case S_ATTR_SPACE:
				if(s === S_ATTR_SPACE){
					value = attrName;
				}
				if(s == S_ATTR_NOQUOT_VALUE){
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value.replace(/&#?\w+;/g,entityReplacer),start)
				}else{
					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !value.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!')
					}
					el.add(value,value,start)
				}
				break;
			case S_EQ:
				throw new Error('attribute value missed!!');
			}
//			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
			return p;
		/*xml space '\x20' | #x9 | #xD | #xA; */
		case '\u0080':
			c = ' ';
		default:
			if(c<= ' '){//space
				switch(s){
				case S_TAG:
					el.setTagName(source.slice(start,p));//tagName
					s = S_TAG_SPACE;
					break;
				case S_ATTR:
					attrName = source.slice(start,p)
					s = S_ATTR_SPACE;
					break;
				case S_ATTR_NOQUOT_VALUE:
					var value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value,start)
				case S_ATTR_END:
					s = S_TAG_SPACE;
					break;
				//case S_TAG_SPACE:
				//case S_EQ:
				//case S_ATTR_SPACE:
				//	void();break;
				//case S_TAG_CLOSE:
					//ignore warning
				}
			}else{//not space
//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
				switch(s){
				//case S_TAG:void();break;
				//case S_ATTR:void();break;
				//case S_ATTR_NOQUOT_VALUE:void();break;
				case S_ATTR_SPACE:
					var tagName =  el.tagName;
					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !attrName.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead2!!')
					}
					el.add(attrName,attrName,start);
					start = p;
					s = S_ATTR;
					break;
				case S_ATTR_END:
					errorHandler.warning('attribute space is required"'+attrName+'"!!')
				case S_TAG_SPACE:
					s = S_ATTR;
					start = p;
					break;
				case S_EQ:
					s = S_ATTR_NOQUOT_VALUE;
					start = p;
					break;
				case S_TAG_CLOSE:
					throw new Error("elements closed character '/' and '>' must be connected to");
				}
			}
		}//end outer switch
		//console.log('p++',p)
		p++;
	}
}
/**
 * @return true if has new namespace define
 */
function appendElement(el,domBuilder,currentNSMap){
	var tagName = el.tagName;
	var localNSMap = null;
	//var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
	var i = el.length;
	while(i--){
		var a = el[i];
		var qName = a.qName;
		var value = a.value;
		var nsp = qName.indexOf(':');
		if(nsp>0){
			var prefix = a.prefix = qName.slice(0,nsp);
			var localName = qName.slice(nsp+1);
			var nsPrefix = prefix === 'xmlns' && localName
		}else{
			localName = qName;
			prefix = null
			nsPrefix = qName === 'xmlns' && ''
		}
		//can not set prefix,because prefix !== ''
		a.localName = localName ;
		//prefix == null for no ns prefix attribute 
		if(nsPrefix !== false){//hack!!
			if(localNSMap == null){
				localNSMap = {}
				//console.log(currentNSMap,0)
				_copy(currentNSMap,currentNSMap={})
				//console.log(currentNSMap,1)
			}
			currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
			a.uri = 'http://www.w3.org/2000/xmlns/'
			domBuilder.startPrefixMapping(nsPrefix, value) 
		}
	}
	var i = el.length;
	while(i--){
		a = el[i];
		var prefix = a.prefix;
		if(prefix){//no prefix attribute has no namespace
			if(prefix === 'xml'){
				a.uri = 'http://www.w3.org/XML/1998/namespace';
			}if(prefix !== 'xmlns'){
				a.uri = currentNSMap[prefix || '']
				
				//{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
			}
		}
	}
	var nsp = tagName.indexOf(':');
	if(nsp>0){
		prefix = el.prefix = tagName.slice(0,nsp);
		localName = el.localName = tagName.slice(nsp+1);
	}else{
		prefix = null;//important!!
		localName = el.localName = tagName;
	}
	//no prefix element has default namespace
	var ns = el.uri = currentNSMap[prefix || ''];
	domBuilder.startElement(ns,localName,tagName,el);
	//endPrefixMapping and startPrefixMapping have not any help for dom builder
	//localNSMap = null
	if(el.closed){
		domBuilder.endElement(ns,localName,tagName);
		if(localNSMap){
			for(prefix in localNSMap){
				domBuilder.endPrefixMapping(prefix) 
			}
		}
	}else{
		el.currentNSMap = currentNSMap;
		el.localNSMap = localNSMap;
		//parseStack.push(el);
		return true;
	}
}
function parseHtmlSpecialContent(source,elStartEnd,tagName,entityReplacer,domBuilder){
	if(/^(?:script|textarea)$/i.test(tagName)){
		var elEndStart =  source.indexOf('</'+tagName+'>',elStartEnd);
		var text = source.substring(elStartEnd+1,elEndStart);
		if(/[&<]/.test(text)){
			if(/^script$/i.test(tagName)){
				//if(!/\]\]>/.test(text)){
					//lexHandler.startCDATA();
					domBuilder.characters(text,0,text.length);
					//lexHandler.endCDATA();
					return elEndStart;
				//}
			}//}else{//text area
				text = text.replace(/&#?\w+;/g,entityReplacer);
				domBuilder.characters(text,0,text.length);
				return elEndStart;
			//}
			
		}
	}
	return elStartEnd+1;
}
function fixSelfClosed(source,elStartEnd,tagName,closeMap){
	//if(tagName in closeMap){
	var pos = closeMap[tagName];
	if(pos == null){
		//console.log(tagName)
		pos =  source.lastIndexOf('</'+tagName+'>')
		if(pos<elStartEnd){//忘记闭合
			pos = source.lastIndexOf('</'+tagName)
		}
		closeMap[tagName] =pos
	}
	return pos<elStartEnd;
	//} 
}
function _copy(source,target){
	for(var n in source){target[n] = source[n]}
}
function parseDCC(source,start,domBuilder,errorHandler){//sure start with '<!'
	var next= source.charAt(start+2)
	switch(next){
	case '-':
		if(source.charAt(start + 3) === '-'){
			var end = source.indexOf('-->',start+4);
			//append comment source.substring(4,end)//<!--
			if(end>start){
				domBuilder.comment(source,start+4,end-start-4);
				return end+3;
			}else{
				errorHandler.error("Unclosed comment");
				return -1;
			}
		}else{
			//error
			return -1;
		}
	default:
		if(source.substr(start+3,6) == 'CDATA['){
			var end = source.indexOf(']]>',start+9);
			domBuilder.startCDATA();
			domBuilder.characters(source,start+9,end-start-9);
			domBuilder.endCDATA() 
			return end+3;
		}
		//<!DOCTYPE
		//startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId) 
		var matchs = split(source,start);
		var len = matchs.length;
		if(len>1 && /!doctype/i.test(matchs[0][0])){
			var name = matchs[1][0];
			var pubid = len>3 && /^public$/i.test(matchs[2][0]) && matchs[3][0]
			var sysid = len>4 && matchs[4][0];
			var lastMatch = matchs[len-1]
			domBuilder.startDTD(name,pubid && pubid.replace(/^(['"])(.*?)\1$/,'$2'),
					sysid && sysid.replace(/^(['"])(.*?)\1$/,'$2'));
			domBuilder.endDTD();
			
			return lastMatch.index+lastMatch[0].length
		}
	}
	return -1;
}



function parseInstruction(source,start,domBuilder){
	var end = source.indexOf('?>',start);
	if(end){
		var match = source.substring(start,end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
		if(match){
			var len = match[0].length;
			domBuilder.processingInstruction(match[1], match[2]) ;
			return end+2;
		}else{//error
			return -1;
		}
	}
	return -1;
}

/**
 * @param source
 */
function ElementAttributes(source){
	
}
ElementAttributes.prototype = {
	setTagName:function(tagName){
		if(!tagNamePattern.test(tagName)){
			throw new Error('invalid tagName:'+tagName)
		}
		this.tagName = tagName
	},
	add:function(qName,value,offset){
		if(!tagNamePattern.test(qName)){
			throw new Error('invalid attribute:'+qName)
		}
		this[this.length++] = {qName:qName,value:value,offset:offset}
	},
	length:0,
	getLocalName:function(i){return this[i].localName},
	getLocator:function(i){return this[i].locator},
	getQName:function(i){return this[i].qName},
	getURI:function(i){return this[i].uri},
	getValue:function(i){return this[i].value}
//	,getIndex:function(uri, localName)){
//		if(localName){
//			
//		}else{
//			var qName = uri
//		}
//	},
//	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
//	getType:function(uri,localName){}
//	getType:function(i){},
}




function _set_proto_(thiz,parent){
	thiz.__proto__ = parent;
	return thiz;
}
if(!(_set_proto_({},_set_proto_.prototype) instanceof _set_proto_)){
	_set_proto_ = function(thiz,parent){
		function p(){};
		p.prototype = parent;
		p = new p();
		for(parent in thiz){
			p[parent] = thiz[parent];
		}
		return p;
	}
}

function split(source,start){
	var match;
	var buf = [];
	var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
	reg.lastIndex = start;
	reg.exec(source);//skip <
	while(match = reg.exec(source)){
		buf.push(match);
		if(match[1])return buf;
	}
}

exports.XMLReader = XMLReader;


},{}],26:[function(require,module,exports){
'use strict';

var CumulativeVolume = require('../../../lib/marketState/CumulativeVolume');

describe('When a cumulative volume container is created with a tick increment of 0.25', function () {
	'use strict';

	var cv;

	var symbol;
	var tickIncrement;

	beforeEach(function () {
		cv = new CumulativeVolume(symbol = 'ESZ6', tickIncrement = 0.25);
	});

	it('the symbol should be the same value as assigned during construction', function () {
		expect(cv.symbol).toEqual(symbol);
	});

	it('the price level array should contain zero items', function () {
		expect(cv.toArray().length).toEqual(0);
	});

	describe('and 50 contracts are traded at 2172.50', function () {
		beforeEach(function () {
			cv.incrementVolume(2172.5, 50);
		});

		it('should report zero contracts traded at 2172.25', function () {
			expect(cv.getVolume(2172.25)).toEqual(0);
		});

		it('should report 50 contracts traded at 2172.50', function () {
			expect(cv.getVolume(2172.5)).toEqual(50);
		});

		it('should report zero contracts traded at 2172.75', function () {
			expect(cv.getVolume(2172.75)).toEqual(0);
		});

		describe('and the price level array is retrieved', function () {
			var priceLevels;

			beforeEach(function () {
				priceLevels = cv.toArray();
			});

			it('the price level array should contain one item', function () {
				expect(priceLevels.length).toEqual(1);
			});

			it('the first price level item should be for 50 contracts', function () {
				expect(priceLevels[0].volume).toEqual(50);
			});

			it('the first price level item should be priced at 2172.50', function () {
				expect(priceLevels[0].price).toEqual(2172.5);
			});
		});

		describe('and another 50 contracts are traded at 2172.50', function () {
			beforeEach(function () {
				cv.incrementVolume(2172.5, 50);
			});

			it('should report zero contracts traded at 2172.25', function () {
				expect(cv.getVolume(2172.25)).toEqual(0);
			});

			it('should report 50 contracts traded at 2172.50', function () {
				expect(cv.getVolume(2172.5)).toEqual(100);
			});

			it('should report zero contracts traded at 2172.75', function () {
				expect(cv.getVolume(2172.75)).toEqual(0);
			});

			describe('and the price level array is retrieved', function () {
				var priceLevels;

				beforeEach(function () {
					priceLevels = cv.toArray();
				});

				it('the price level array should contain one item', function () {
					expect(priceLevels.length).toEqual(1);
				});

				it('the first price level item should be for 100 contracts', function () {
					expect(priceLevels[0].volume).toEqual(100);
				});

				it('the first price level item should be priced at 2172.50', function () {
					expect(priceLevels[0].price).toEqual(2172.5);
				});
			});
		});

		describe('and 200 contracts are traded at 2172.25', function () {
			beforeEach(function () {
				cv.incrementVolume(2172.25, 200);
			});

			it('should report 200 contracts traded at 2172.25', function () {
				expect(cv.getVolume(2172.25)).toEqual(200);
			});

			it('should report 50 contracts traded at 2172.50', function () {
				expect(cv.getVolume(2172.5)).toEqual(50);
			});

			it('should report zero contracts traded at 2172.75', function () {
				expect(cv.getVolume(2172.75)).toEqual(0);
			});

			describe('and the price level array is retrieved', function () {
				var priceLevels;

				beforeEach(function () {
					priceLevels = cv.toArray();
				});

				it('the price level array should contain two items', function () {
					expect(priceLevels.length).toEqual(2);
				});

				it('the first price level item should be for 200 contracts', function () {
					expect(priceLevels[0].volume).toEqual(200);
				});

				it('the first price level item should be priced at 2172.25', function () {
					expect(priceLevels[0].price).toEqual(2172.25);
				});

				it('the second price level item should be for 50 contracts', function () {
					expect(priceLevels[1].volume).toEqual(50);
				});

				it('the second price level item should be priced at 2172.50', function () {
					expect(priceLevels[1].price).toEqual(2172.5);
				});
			});
		});

		describe('and 3 contracts are traded at 2173.50', function () {
			beforeEach(function () {
				cv.incrementVolume(2173.50, 3);
			});

			it('should report 50 contracts traded at 2172.50', function () {
				expect(cv.getVolume(2172.5)).toEqual(50);
			});

			it('should report zero contracts traded at 2172.75', function () {
				expect(cv.getVolume(2172.75)).toEqual(0);
			});

			it('should report zero contracts traded at 2173', function () {
				expect(cv.getVolume(2173)).toEqual(0);
			});

			it('should report zero contracts traded at 2173.25', function () {
				expect(cv.getVolume(2173.25)).toEqual(0);
			});

			it('should report 3 contracts traded at 2173.50', function () {
				expect(cv.getVolume(2173.50)).toEqual(3);
			});

			describe('and the price level array is retrieved', function () {
				var priceLevels;

				beforeEach(function () {
					priceLevels = cv.toArray();
				});

				it('the price level array should contain five items', function () {
					expect(priceLevels.length).toEqual(5);
				});

				it('the first price level item should be for 50 contracts', function () {
					expect(priceLevels[0].volume).toEqual(50);
				});

				it('the first price level item should be priced at 2172.50', function () {
					expect(priceLevels[0].price).toEqual(2172.5);
				});

				it('the second price level item should be for zero contracts', function () {
					expect(priceLevels[1].volume).toEqual(0);
				});

				it('the second price level item should be priced at 2172.75', function () {
					expect(priceLevels[1].price).toEqual(2172.75);
				});

				it('the third price level item should be for zero contracts', function () {
					expect(priceLevels[2].volume).toEqual(0);
				});

				it('the third price level item should be priced at 2173.00', function () {
					expect(priceLevels[2].price).toEqual(2173);
				});

				it('the fourth price level item should be for zero contracts', function () {
					expect(priceLevels[3].volume).toEqual(0);
				});

				it('the fourth price level item should be priced at 2173.25', function () {
					expect(priceLevels[3].price).toEqual(2173.25);
				});

				it('the fifth price level item should be for 3 contracts', function () {
					expect(priceLevels[4].volume).toEqual(3);
				});

				it('the fifth price level item should be priced at 2173.50', function () {
					expect(priceLevels[4].price).toEqual(2173.5);
				});
			});
		});

		describe('and 99 contracts are traded at 2172.00', function () {
			beforeEach(function () {
				cv.incrementVolume(2172.00, 99);
			});

			it('should report 99 contracts traded at 2172.00', function () {
				expect(cv.getVolume(2172.00)).toEqual(99);
			});

			it('should report zero contracts traded at 2172.25', function () {
				expect(cv.getVolume(2172.25)).toEqual(0);
			});

			it('should report 50 contracts traded at 2172.50', function () {
				expect(cv.getVolume(2172.50)).toEqual(50);
			});

			describe('and the price level array is retrieved', function () {
				var priceLevels;

				beforeEach(function () {
					priceLevels = cv.toArray();
				});

				it('the price level array should contain three items', function () {
					expect(priceLevels.length).toEqual(3);
				});

				it('the first price level item should be for 99 contracts', function () {
					expect(priceLevels[0].volume).toEqual(99);
				});

				it('the first price level item should be priced at 2172.00', function () {
					expect(priceLevels[0].price).toEqual(2172);
				});

				it('the second price level item should be for zero contracts', function () {
					expect(priceLevels[1].volume).toEqual(0);
				});

				it('the second price level item should be priced at 2172.25', function () {
					expect(priceLevels[1].price).toEqual(2172.25);
				});

				it('the third price level item should be for 50 contracts', function () {
					expect(priceLevels[2].volume).toEqual(50);
				});

				it('the third price level item should be priced at 2172.50', function () {
					expect(priceLevels[2].price).toEqual(2172.50);
				});
			});
		});

		describe('and the container is reset', function () {
			beforeEach(function () {
				cv.reset();
			});

			describe('and the price level array is retrieved', function () {
				var priceLevels;

				beforeEach(function () {
					priceLevels = cv.toArray();
				});

				it('the price level array should contain zero items', function () {
					expect(priceLevels.length).toEqual(0);
				});
			});
		});
	});

	describe('and an observer is added to the container', function () {
		var spyOne;

		beforeEach(function () {
			cv.on('events', spyOne = jasmine.createSpy('spyOne'));
		});

		describe('and 50 contracts are traded at 2172.50', function () {
			beforeEach(function () {
				cv.incrementVolume(2172.5, 50);
			});

			it('the observer should be called once', function () {
				expect(spyOne).toHaveBeenCalledTimes(1);
			});

			it('the arguments should refer to the container', function () {
				expect(spyOne.calls.mostRecent().args[0].container).toBe(cv);
			});

			it('the arguments should specify an event type of "update"', function () {
				expect(spyOne.calls.mostRecent().args[0].event).toEqual('update');
			});

			it('the arguments should specify a price of 2172.5', function () {
				expect(spyOne.calls.mostRecent().args[0].price).toEqual(2172.5);
			});

			it('the arguments should specify a volume of 50', function () {
				expect(spyOne.calls.mostRecent().args[0].volume).toEqual(50);
			});

			describe('and another 50 contracts are traded at 2172.50', function () {
				beforeEach(function () {
					cv.incrementVolume(2172.5, 50);
				});

				it('the observer should be called once more', function () {
					expect(spyOne).toHaveBeenCalledTimes(2);
				});

				it('the arguments should refer to the container', function () {
					expect(spyOne.calls.mostRecent().args[0].container).toBe(cv);
				});

				it('the arguments should specify an event type of "update"', function () {
					expect(spyOne.calls.mostRecent().args[0].event).toEqual('update');
				});

				it('the arguments should specify a price of 2172.5', function () {
					expect(spyOne.calls.mostRecent().args[0].price).toEqual(2172.5);
				});

				it('the arguments should specify a volume of 100', function () {
					expect(spyOne.calls.mostRecent().args[0].volume).toEqual(100);
				});
			});

			describe('and 99 contracts are traded at 2171.75', function () {
				var spyTwo;

				beforeEach(function () {
					cv.incrementVolume(2171.75, 99);
				});

				it('the observer should be called three more times', function () {
					expect(spyOne).toHaveBeenCalledTimes(4);
				});

				it('the arguments (for the first call) should specify a price of 2172.25', function () {
					expect(spyOne.calls.argsFor(1)[0].price).toEqual(2172.25);
				});

				it('the arguments (for the first call) should specify a volume of zero', function () {
					expect(spyOne.calls.argsFor(1)[0].volume).toEqual(0);
				});

				it('the arguments (for the second call) should specify a price of 2172.00', function () {
					expect(spyOne.calls.argsFor(2)[0].price).toEqual(2172);
				});

				it('the arguments (for the second call) should specify a volume of zero', function () {
					expect(spyOne.calls.argsFor(2)[0].volume).toEqual(0);
				});

				it('the arguments (for the third call) should specify a price of 2171.75', function () {
					expect(spyOne.calls.argsFor(3)[0].price).toEqual(2171.75);
				});

				it('the arguments (for the third call) should specify a volume of 99', function () {
					expect(spyOne.calls.argsFor(3)[0].volume).toEqual(99);
				});
			});

			describe('and 555 contracts are traded at 2173.25', function () {
				beforeEach(function () {
					cv.incrementVolume(2173.25, 555);
				});

				it('the observer should be called three more times', function () {
					expect(spyOne).toHaveBeenCalledTimes(4);
				});

				it('the arguments (for the first call) should specify a price of 2172.75', function () {
					expect(spyOne.calls.argsFor(1)[0].price).toEqual(2172.75);
				});

				it('the arguments (for the first call) should specify a volume of zero', function () {
					expect(spyOne.calls.argsFor(1)[0].volume).toEqual(0);
				});

				it('the arguments (for the second call) should specify a price of 2173.00', function () {
					expect(spyOne.calls.argsFor(2)[0].price).toEqual(2173);
				});

				it('the arguments (for the second call) should specify a volume of zero', function () {
					expect(spyOne.calls.argsFor(2)[0].volume).toEqual(0);
				});

				it('the arguments (for the third call) should specify a price of 2173.25', function () {
					expect(spyOne.calls.argsFor(3)[0].price).toEqual(2173.25);
				});

				it('the arguments (for the third call) should specify a volume of 555', function () {
					expect(spyOne.calls.argsFor(3)[0].volume).toEqual(555);
				});
			});

			describe('and the observer is removed from the container', function () {
				beforeEach(function () {
					cv.off('events', spyOne);
				});

				describe('and another 50 contracts are traded at 2172.50', function () {
					beforeEach(function () {
						cv.incrementVolume(2172.5, 50);
					});

					it('the observer should be called once', function () {
						expect(spyOne).toHaveBeenCalledTimes(1);
					});
				});
			});
		});
	});
});

},{"../../../lib/marketState/CumulativeVolume":5}],27:[function(require,module,exports){
'use strict';

var Profile = require('../../../lib/marketState/Profile');

describe('When a Profile is created (for a symbol with unitCode "2")', function () {
	'use strict';

	var p;

	beforeEach(function () {
		p = new Profile('ZCZ17', 'Corn', 'CME', '2');
	});

	it('formats 123.5 (with unit code 2) as "123-4"', function () {
		expect(p.formatPrice(123.5)).toEqual('123-4');
	});
});

},{"../../../lib/marketState/Profile":6}]},{},[26,27]);
