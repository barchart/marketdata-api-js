(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = (() => {
	'use strict';

	const object = {
		/**
   * Given an object, returns an array of "own" properties.
   *
   * @static
   * @param {Object} target - The object to interrogate.
   * @returns {Array<string>}
   */
		keys(target) {
			const keys = [];

			for (let k in target) {
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
		empty(target) {
			let empty = true;

			for (let k in target) {
				if (target.hasOwnProperty(k)) {
					empty = false;

					break;
				}
			}

			return empty;
		}
	};

	return object;
})();

},{}],2:[function(require,module,exports){
module.exports = (() => {
	'use strict';

	/**
  * An interface for writing log messages.
  *
  * @public
  * @interface
  */

	class Logger {
		constructor() {}

		/**
   * Writes a log message.
   *
   * @public
   */
		log() {
			return;
		}

		/**
   * Writes a log message, at "debug" level.
   *
   * @public
   */
		debug() {
			return;
		}

		/**
   * Writes a log message, at "info" level.
   *
   * @public
   */
		info() {
			return;
		}

		/**
   * Writes a log message, at "warn" level.
   *
   * @public
   */
		warn() {
			return;
		}

		/**
   * Writes a log message, at "error" level.
   *
   * @public
   */
		error() {
			return;
		}

		toString() {
			return '[Logger]';
		}
	}

	return Logger;
})();

},{}],3:[function(require,module,exports){
const Logger = require('./Logger'),
      LoggerProvider = require('./LoggerProvider');

module.exports = (() => {
	'use strict';

	let __provider = null;

	/**
  * Static utilities for interacting with the log system.
  *
  * @public
  * @interface
  */
	class LoggerFactory {
		constructor() {}

		/**
   * Configures the library to write log messages to the console.
   *
   * @public
   * @static
   */
		static configureForConsole() {
			LoggerFactory.configure(new ConsoleLoggerProvider());
		}

		/**
   * Configures the mute all log messages.
   *
   * @public
   * @static
   */
		static configureForSilence() {
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
		static configure(provider) {
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
		static getLogger(category) {
			if (__provider === null) {
				LoggerFactory.configureForConsole();
			}

			return __provider.getLogger(category);
		}

		toString() {
			return '[LoggerFactory]';
		}
	}

	let __consoleLogger = null;

	class ConsoleLoggerProvider extends LoggerProvider {
		constructor() {
			super();
		}

		getLogger(category) {
			if (__consoleLogger === null) {
				__consoleLogger = new ConsoleLogger();
			}

			return __consoleLogger;
		}

		toString() {
			return '[ConsoleLoggerProvider]';
		}
	}

	class ConsoleLogger extends Logger {
		constructor() {
			super();
		}

		log() {
			console.log.apply(console, arguments);
		}

		trace() {
			console.trace.apply(console, arguments);
		}

		info() {
			console.info.apply(console, arguments);
		}

		warn() {
			console.warn.apply(console, arguments);
		}

		error() {
			console.error.apply(console, arguments);
		}

		toString() {
			return '[ConsoleLogger]';
		}
	}

	let __emptyLogger = null;

	class EmptyLoggerProvider extends LoggerProvider {
		constructor() {
			super();
		}

		getLogger(category) {
			if (__emptyLogger === null) {
				__emptyLogger = new EmptyLogger();
			}

			return __emptyLogger;
		}

		toString() {
			return '[EmptyLoggerProvider]';
		}
	}

	class EmptyLogger extends Logger {
		constructor() {
			super();
		}

		log() {
			return;
		}

		trace() {
			return;
		}

		info() {
			return;
		}

		warn() {
			return;
		}

		error() {
			return;
		}

		toString() {
			return '[ConsoleLogger]';
		}
	}

	return LoggerFactory;
})();

},{"./Logger":2,"./LoggerProvider":4}],4:[function(require,module,exports){
module.exports = (() => {
	'use strict';

	/**
  * An interface for generating {@link Logger} instances.
  *
  * @public
  * @interface
  */

	class LoggerProvider {
		constructor() {}

		/**
   * Returns an instance of {@link Logger}.
   *
   * @public
   * @param {String} category
   * @returns {Logger}
   */
		getLogger(category) {
			return null;
		}

		toString() {
			return '[LoggerProvider]';
		}
	}

	return LoggerProvider;
})();

},{}],5:[function(require,module,exports){
var _this = this;

const object = require('./../common/lang/object');

const LoggerFactory = require('./../logging/LoggerFactory');

module.exports = (() => {
	'use strict';

	const events = {
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
	class CumulativeVolume {
		constructor(symbol, tickIncrement) {
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
		on(eventType, handler) {
			if (eventType !== 'events') {
				return;
			}

			const i = this._handlers.indexOf(handler);

			if (i < 0) {
				const copy = this._handlers.slice(0);
				copy.push(handler);

				this._handlers = copy;

				this.toArray().forEach(priceLevel => {
					sendPriceVolumeUpdate(this, handler, priceLevel);
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
		off(eventType, handler) {
			if (eventType !== 'events') {
				return;
			}

			const i = this._handlers.indexOf(handler);

			if (!(i < 0)) {
				const copy = this._handlers.slice(0);
				copy.splice(i, 1);

				this._handlers = copy;
			}
		}

		/**
   * @ignore
   */
		getTickIncrement() {
			return this._tickIncrement;
		}

		/**
   * Given a numeric price, returns the volume traded at that price level.
   *
   * @public
   * @param {number} price
   * @returns {number}
   */
		getVolume(price) {
			const priceString = price.toString();
			const priceLevel = this._priceLevels[priceString];

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
		incrementVolume(price, volume) {
			if (this._highPrice && this._lowPrice) {
				if (price > this._highPrice) {
					for (let p = this._highPrice + this._tickIncrement; p < price; p += this._tickIncrement) {
						broadcastPriceVolumeUpdate(this, this._handlers, addPriceVolume(this._priceLevels, p.toString(), p));
					}

					this._highPrice = price;
				} else if (price < this._lowPrice) {
					for (let p = this._lowPrice - this._tickIncrement; p > price; p -= this._tickIncrement) {
						broadcastPriceVolumeUpdate(this, this._handlers, addPriceVolume(this._priceLevels, p.toString(), p));
					}

					this._lowPrice = price;
				}
			} else {
				this._lowPrice = this._highPrice = price;
			}

			let priceString = price.toString();
			let priceLevel = this._priceLevels[priceString];

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
		reset() {
			this._priceLevels = {};
			this._highPrice = null;
			this._lowPrice = null;

			this._handlers.forEach(handler => {
				handler({ container: this, event: events.reset });
			});
		}

		/**
   * Returns an array of all price levels. This is an expensive operation. Observing
   * an ongoing subscription is preferred (see {@link Connection#on}).
   *
   * @return {PriceLevel[]}
   */
		toArray() {
			const array = object.keys(this._priceLevels).map(p => {
				const priceLevel = this._priceLevels[p];

				return {
					price: priceLevel.price,
					volume: priceLevel.volume
				};
			});

			array.sort((a, b) => {
				return a.price - b.price;
			});

			return array;
		}

		dispose() {
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
		static clone(symbol, source) {
			const clone = new CumulativeVolume(symbol, source.getTickIncrement());

			source.toArray().forEach(priceLevel => {
				clone.incrementVolume(priceLevel.price, priceLevel.volume);
			});

			return clone;
		}
	}

	const sendPriceVolumeUpdate = (container, handler, priceLevel) => {
		try {
			handler({
				container: container,
				event: events.update,
				price: priceLevel.price,
				volume: priceLevel.volume
			});
		} catch (e) {
			_this._logger.error('An error was thrown by a cumulative volume observer.', e);
		}
	};

	const broadcastPriceVolumeUpdate = (container, handlers, priceLevel) => {
		handlers.forEach(handler => {
			sendPriceVolumeUpdate(container, handler, priceLevel);
		});
	};

	const addPriceVolume = (priceLevels, priceString, price) => {
		const priceLevel = {
			price: price,
			volume: 0
		};

		priceLevels[priceString] = priceLevel;

		return priceLevel;
	};

	return CumulativeVolume;
})();

},{"./../common/lang/object":1,"./../logging/LoggerFactory":3}],6:[function(require,module,exports){
const parseSymbolType = require('./../util/parseSymbolType'),
      priceFormatter = require('./../util/priceFormatter');

module.exports = (() => {
	'use strict';

	let profiles = {};
	let formatter = priceFormatter('-', true, ',').format;

	/**
  * Describes an instrument.
  *
  * @public
  */
	class Profile {
		constructor(symbol, name, exchange, unitCode, pointValue, tickIncrement, additional) {
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

			const info = parseSymbolType(this.symbol);

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

			if (typeof additional === 'object' && additional !== null) {
				for (let p in additional) {
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
		formatPrice(price) {
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
		static setPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator) {
			formatter = priceFormatter(fractionSeparator, specialFractions, thousandsSeparator).format;
		}

		/**
   * Alias for {@link Profile.setPriceFormatter} function.
   *
   * @deprecated
   * @public
   * @see {@link Profile.setPriceFormatter}
   */
		static PriceFormatter(fractionSeparator, specialFractions, thousandsSeparator) {
			Profile.setPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator);
		}

		/**
   * @protected
   * @ignore
   */
		static get Profiles() {
			return profiles;
		}
	}

	return Profile;
})();

},{"./../util/parseSymbolType":9,"./../util/priceFormatter":10}],7:[function(require,module,exports){
const lodashIsNaN = require('lodash.isnan');

module.exports = (() => {
	'use strict';

	return (value, digits, thousandsSeparator, useParenthesis) => {
		if (value === '' || value === undefined || value === null || lodashIsNaN(value)) {
			return '';
		}

		const applyParenthesis = value < 0 && useParenthesis === true;

		if (applyParenthesis) {
			value = 0 - value;
		}

		let returnRef = value.toFixed(digits);

		if (thousandsSeparator && !(value > -1000 && value < 1000)) {
			const length = returnRef.length;
			const negative = value < 0;

			let found = digits === 0;
			let counter = 0;

			const buffer = [];

			for (let i = length - 1; !(i < 0); i--) {
				if (counter === 3 && !(negative && i === 0)) {
					buffer.unshift(thousandsSeparator);

					counter = 0;
				}

				const character = returnRef.charAt(i);

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
})();

},{"lodash.isnan":23}],8:[function(require,module,exports){
module.exports = (() => {
	'use strict';

	const monthMap = {};
	const numberMap = {};

	function addMonth(code, name, number) {
		monthMap[code] = name;
		numberMap[code] = number;
	}

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
		getCodeToNameMap: () => {
			return monthMap;
		},

		getCodeToNumberMap: () => {
			return numberMap;
		}
	};
})();

},{}],9:[function(require,module,exports){
const symbolParser = require('./symbolParser');

module.exports = (() => {
	'use strict';

	return symbolParser.parseInstrumentType;
})();

},{"./symbolParser":13}],10:[function(require,module,exports){
const lodashIsNaN = require('lodash.isnan');
const decimalFormatter = require('./decimalFormatter');

module.exports = (() => {
	'use strict';

	function frontPad(value, digits) {
		return ['000', Math.floor(value)].join('').substr(-1 * digits);
	}

	return function (fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {
		let format;

		function getWholeNumberAsString(value) {
			const val = Math.floor(value);

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
			format = (value, unitcode) => {
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
			format = (value, unitcode) => {
				if (value === '' || value === undefined || value === null || lodashIsNaN(value)) {
					return '';
				}

				const originalValue = value;
				const absoluteValue = Math.abs(value);

				const negative = value < 0;

				let prefix;
				let suffix;

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
})();

},{"./decimalFormatter":7,"lodash.isnan":23}],11:[function(require,module,exports){
const convertUnitCodeToBaseCode = require('./../utilities/convert/unitCodeToBaseCode');

module.exports = (() => {
	/**
  * Adapted from legacy code: https://github.com/barchart/php-jscharts/blob/372deb9b4d9ee678f32b6f8c4268434249c1b4ac/chart_package/webroot/js/deps/ddfplus/com.ddfplus.js
  */
	return (string, unitCode) => {
		let baseCode = convertUnitCodeToBaseCode(unitCode);
		let is_negative = false;

		// Fix for 10-Yr T-Notes
		if (baseCode === -4 && (string.length === 7 || string.length === 6 && string.charAt(0) !== '1')) {
			baseCode -= 1;
		}

		if (baseCode >= 0) {
			const ival = string * 1;
			return Math.round(ival * Math.pow(10, baseCode)) / Math.pow(10, baseCode);
		} else {
			if (string.match(/^-/)) {
				is_negative = true;
				string = string.slice(1);
			}

			const has_dash = string.match(/-/);
			let divisor = Math.pow(2, Math.abs(baseCode) + 2);
			const fracsize = String(divisor).length;
			const denomstart = string.length - fracsize;
			let numerend = denomstart;
			if (string.substring(numerend - 1, numerend) == '-') numerend--;
			const numerator = string.substring(0, numerend) * 1;
			const denominator = string.substring(denomstart, string.length) * 1;

			if (baseCode === -5) {
				divisor = has_dash ? 320 : 128;
			}

			return (numerator + denominator / divisor) * (is_negative ? -1 : 1);
		}
	};
})();

},{"./../utilities/convert/unitCodeToBaseCode":19}],12:[function(require,module,exports){
module.exports = (() => {
	'use strict';

	return {
		format: symbol => {
			if (symbol !== null && typeof symbol === 'string') {
				return symbol.toUpperCase();
			} else {
				return symbol;
			}
		}
	};
})();

},{}],13:[function(require,module,exports){
module.exports = (() => {
	'use strict';

	const alternateFuturesMonths = {
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

	const futuresMonthNumbers = {
		F: 1,
		G: 2,
		H: 3,
		J: 4,
		K: 5,
		M: 6,
		N: 7,
		Q: 8,
		U: 9,
		V: 10,
		X: 11,
		Z: 12
	};

	const predicates = {};

	predicates.bats = /^(.*)\.BZ$/i;
	predicates.percent = /(\.RT)$/;

	const types = {};

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

	const parsers = [];

	parsers.push(symbol => {
		let definition = null;

		if (types.futures.spread.test(symbol)) {
			definition = {};

			definition.symbol = symbol;
			definition.type = 'future_spread';
		}

		return definition;
	});

	parsers.push(symbol => {
		let definition = null;

		const match = symbol.match(types.futures.concrete);

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

	parsers.push(symbol => {
		let definition = null;

		const match = symbol.match(types.futures.alias);

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

	parsers.push(symbol => {
		let definition = null;

		if (types.forex.test(symbol)) {
			definition = {};

			definition.symbol = symbol;
			definition.type = 'forex';
		}

		return definition;
	});

	parsers.push(symbol => {
		let definition = null;

		if (types.indicies.external.test(symbol)) {
			definition = {};

			definition.symbol = symbol;
			definition.type = 'index';
		}

		return definition;
	});

	parsers.push(symbol => {
		let definition = null;

		if (types.indicies.sector.test(symbol)) {
			definition = {};

			definition.symbol = symbol;
			definition.type = 'sector';
		}

		return definition;
	});

	parsers.push(symbol => {
		let definition = null;

		const match = symbol.match(types.futures.options.short);

		if (match !== null) {
			definition = {};

			const putCallCharacterCode = match[4].charCodeAt(0);
			const putCharacterCode = 80;
			const callCharacterCode = 67;

			let optionType;
			let optionYearDelta;

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

	parsers.push(symbol => {
		let definition = null;

		const match = symbol.match(types.futures.options.long) || symbol.match(types.futures.options.historical);

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

	const converters = [];

	converters.push(symbol => {
		let converted = null;

		if (symbolParser.getIsFuture(symbol) && symbolParser.getIsConcrete(symbol)) {
			converted = symbol.replace(/(.{1,3})([A-Z]{1})([0-9]{3}|[0-9]{1})?([0-9]{1})$/i, '$1$2$4') || null;
		}

		return converted;
	});

	converters.push(symbol => {
		let converted = null;

		if (symbolParser.getIsFutureOption(symbol)) {
			const definition = symbolParser.parseInstrumentType(symbol);

			const putCallCharacter = getPutCallCharacter(definition.option_type);

			if (definition.root.length < 3) {
				const putCallCharacterCode = putCallCharacter.charCodeAt(0);

				converted = `${definition.root}${definition.month}${definition.strike}${String.fromCharCode(putCallCharacterCode + definition.year - getCurrentYear())}`;
			} else {
				converted = `${definition.root}${definition.month}${getYearDigits(definition.year, 1)}|${definition.strike}${putCallCharacter}`;
			}
		}

		return converted;
	});

	converters.push(symbol => {
		return symbol;
	});

	function getCurrentMonth() {
		const now = new Date();

		return now.getMonth() + 1;
	}

	function getCurrentYear() {
		const now = new Date();

		return now.getFullYear();
	}

	function getYearDigits(year, digits) {
		const yearString = year.toString();

		return yearString.substring(yearString.length - digits, yearString.length);
	}

	function getFuturesMonth(monthString) {
		return alternateFuturesMonths[monthString] || monthString;
	}

	function getFuturesYear(yearString) {
		const currentYear = getCurrentYear();

		let year = parseInt(yearString);

		if (year < 10) {
			const bump = year < currentYear % 10 ? 1 : 0;

			year = Math.floor(currentYear / 10) * 10 + year + bump * 10;
		} else if (year < 100) {
			year = Math.floor(currentYear / 100) * 100 + year;

			if (year < currentYear) {
				const alternateYear = year + 100;

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

	const symbolParser = {
		/**
   * Returns a simple instrument definition with the terms that can be
   * gleaned from a symbol. If no specifics can be determined from the
   * symbol, a null value is returned.
   *
   * @public
   * @param {String} symbol
   * @returns {Object|null}
   */
		parseInstrumentType: symbol => {
			if (typeof symbol !== 'string') {
				return null;
			}

			let definition = null;

			for (let i = 0; i < parsers.length && definition === null; i++) {
				const parser = parsers[i];

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
		getProducerSymbol: symbol => {
			if (typeof symbol !== 'string') {
				return null;
			}

			let converted = null;

			for (let i = 0; i < converters.length && converted === null; i++) {
				const converter = converters[i];

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
		getFuturesOptionPipelineFormat: symbol => {
			const definition = symbolParser.parseInstrumentType(symbol);

			let formatted = null;

			if (definition.type === 'future_option') {
				const putCallCharacter = getPutCallCharacter(definition.option_type);

				formatted = `${definition.root}${definition.month}${getYearDigits(definition.year, 1)}|${definition.strike}${putCallCharacter}`;
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
		getIsConcrete: symbol => {
			return typeof symbol === 'string' && !types.futures.alias.test(symbol);
		},

		/**
   * Returns true if the symbol is an alias for another symbol; otherwise false.
   *
   * @public
   * @param {String} symbol
   * @returns {Boolean}
   */
		getIsReference: symbol => {
			return typeof symbol === 'string' && types.futures.alias.test(symbol);
		},

		/**
   * Returns true if the symbol represents futures contract; false otherwise.
   *
   * @public
   * @param {String} symbol
   * @returns {Boolean}
   */
		getIsFuture: symbol => {
			return typeof symbol === 'string' && (types.futures.concrete.test(symbol) || types.futures.alias.test(symbol));
		},

		/**
   * Returns true if the symbol represents futures spread; false otherwise.
   *
   * @public
   * @param {String} symbol
   * @returns {Boolean}
   */
		getIsFutureSpread: symbol => {
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
		getIsFutureOption: symbol => {
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
		getIsForex: symbol => {
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
		getIsIndex: symbol => {
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
		getIsSector: symbol => {
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
		getIsCmdty: symbol => {
			return typeof symbol === 'string' && types.indicies.cmdty.test(symbol);
		},

		/**
   * Returns true if the symbol is listed on the BATS exchange; false otherwise.
   *
   * @public
   * @param {String} symbol
   * @returns {Boolean}
   */
		getIsBats: symbol => {
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
		getIsExpired: symbol => {
			const definition = symbolParser.parseInstrumentType(symbol);

			let returnVal = false;

			if (definition !== null && definition.year && definition.month) {
				const currentYear = getCurrentYear();

				if (definition.year < currentYear) {
					returnVal = true;
				} else if (definition.year === currentYear && futuresMonthNumbers.hasOwnProperty(definition.month)) {
					const currentMonth = getCurrentMonth();
					const futuresMonth = futuresMonthNumbers[definition.month];

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
		displayUsingPercent: symbol => {
			return typeof symbol === 'string' && predicates.percent.test(symbol);
		}
	};

	return symbolParser;
})();

},{}],14:[function(require,module,exports){
module.exports = (() => {
	'use strict';

	function formatTwelveHourTime(t) {
		let hours = t.getHours();
		let period;

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
		let hours = t.getHours();
		let period;

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

	return (useTwelveHourClock, short) => {
		let formatTime;

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

		const formatters = {
			format: q => {
				const t = q.time;

				if (!t) {
					return '';
				} else if (!q.lastPrice || q.flag || q.sessionT) {
					return formatters.formatDate(t);
				} else {
					return formatters.formatTime(t, q.timezone);
				}
			},

			formatTime: (date, timezone) => {
				let returnRef;

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

			formatDate: date => {
				if (date) {
					return leftPad(date.getMonth() + 1) + '/' + leftPad(date.getDate()) + '/' + leftPad(date.getFullYear());
				} else {
					return '';
				}
			}
		};

		return formatters;
	};
})();

},{}],15:[function(require,module,exports){
module.exports = (() => {
	'use strict';

	/**
  * Converts a base code into a unit code.
  *
  * @function
  * @param {Number} baseCode
  * @return {String}
  */

	function baseCodeToUnitCode(baseCode) {
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

	return baseCodeToUnitCode;
})();

},{}],16:[function(require,module,exports){
const dayNumberToDayCode = require('./dayNumberToDayCode');

module.exports = (() => {
	'use strict';

	/**
  * Extracts the day of the month from a {@link Date} instance
  * and returns the day code for the day of the month.
  *
  * @function
  * @param {Date} date
  * @returns {String|null}
  */

	function dateToDayCode(date) {
		if (date === null || date === undefined) {
			return null;
		}

		return dayNumberToDayCode(date.getDate());
	}

	return dateToDayCode;
})();

},{"./dayNumberToDayCode":18}],17:[function(require,module,exports){
module.exports = (() => {
	'use strict';

	/**
  * Converts a day code (e.g. "A" ) to a day number (e.g. 11).
  *
  * @function
  * @param {String} dayCode
  * @returns {Number|null}
  */

	function dayCodeToNumber(dayCode) {
		if (dayCode === null || dayCode === undefined || dayCode === '') {
			return null;
		}

		let d = parseInt(dayCode, 31);

		if (d > 9) {
			d++;
		} else if (d === 0) {
			d = 10;
		}

		return d;
	}

	return dayCodeToNumber;
})();

},{}],18:[function(require,module,exports){
module.exports = (() => {
	'use strict';

	const ASCII_ONE = '1'.charCodeAt(0);
	const ASCII_A = 'A'.charCodeAt(0);

	/**
  * Converts a day number to a single character day code (e.g. 1 is
  * converted to "1" and 10 is converted to "0" and 11 is converted
  * to "A").
  *
  * @function
  * @param {Number} d
  * @returns {String}
  */
	function convertDayNumberToDayCode(d) {
		if (d >= 1 && d <= 9) {
			return String.fromCharCode(ASCII_ONE + d - 1);
		} else if (d == 10) {
			return '0';
		} else {
			return String.fromCharCode(ASCII_A + d - 11);
		}
	}

	return convertDayNumberToDayCode;
})();

},{}],19:[function(require,module,exports){
module.exports = (() => {
	'use strict';

	/**
  * Converts a unit code into a base code.
  *
  * @function
  * @param {String} unitCode
  * @return {Number}
  */

	function unitCodeToBaseCode(unitCode) {
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
	}

	return unitCodeToBaseCode;
})();

},{}],20:[function(require,module,exports){
const xmlDom = require('xmldom');

const parseValue = require('./value'),
      parseTimestamp = require('./timestamp');

module.exports = (() => {
    'use strict';

    /**
     * Utility for parsing XML.
     *
     * @public
     */

    class XmlDomParser {
        constructor() {
            this._xmlDomParser = new xmlDom.DOMParser();
        }

        /**
         * Parses an XML document.
         *
         * @public
         * @param {String} textDocument
         * @returns {Object}
         */
        parse(textDocument) {
            if (typeof textDocument !== 'string') {
                throw new Error('The "textDocument" argument must be a string.');
            }

            return this._xmlDomParser.parseFromString(textDocument, 'text/xml');
        }

        toString() {
            return '[XmlDomParser]';
        }
    }

    /**
     * Parses a DDF message, returning a JavaScript object representing the
     * content of the message.
     *
     * @public
     * @param {String} msg
     * @returns {Object}
     */
    function parseMessage(msg) {
        const message = {
            message: msg,
            type: null
        };

        switch (msg.substr(0, 1)) {
            case '%':
                {
                    let xmlDocument;

                    try {
                        const xmlDomParser = new XmlDomParser();
                        xmlDocument = xmlDomParser.parse(msg.substring(1));
                    } catch (e) {
                        xmlDocument = undefined;
                    }

                    if (xmlDocument) {
                        const node = xmlDocument.firstChild;

                        switch (node.nodeName) {
                            case 'BOOK':
                                {
                                    message.symbol = node.attributes.getNamedItem('symbol').value;
                                    message.unitcode = node.attributes.getNamedItem('basecode').value;
                                    message.askDepth = parseInt(node.attributes.getNamedItem('askcount').value);
                                    message.bidDepth = parseInt(node.attributes.getNamedItem('bidcount').value);
                                    message.asks = [];
                                    message.bids = [];

                                    let ary1, ary2;

                                    if (node.attributes.getNamedItem('askprices') && node.attributes.getNamedItem('asksizes')) {
                                        ary1 = node.attributes.getNamedItem('askprices').value.split(',');
                                        ary2 = node.attributes.getNamedItem('asksizes').value.split(',');

                                        for (let i = 0; i < ary1.length; i++) {
                                            message.asks.push({ "price": parseValue(ary1[i], message.unitcode), "size": parseInt(ary2[i]) });
                                        }
                                    }

                                    if (node.attributes.getNamedItem('bidprices') && node.attributes.getNamedItem('bidsizes')) {
                                        ary1 = node.attributes.getNamedItem('bidprices').value.split(',');
                                        ary2 = node.attributes.getNamedItem('bidsizes').value.split(',');

                                        for (let i = 0; i < ary1.length; i++) {
                                            message.bids.push({ "price": parseValue(ary1[i], message.unitcode), "size": parseInt(ary2[i]) });
                                        }
                                    }

                                    message.type = 'BOOK';
                                    break;
                                }
                            case 'QUOTE':
                                {
                                    for (let i = 0; i < node.attributes.length; i++) {
                                        switch (node.attributes[i].name) {
                                            case 'symbol':
                                                message.symbol = node.attributes[i].value;
                                                break;
                                            case 'name':
                                                message.name = node.attributes[i].value;
                                                break;
                                            case 'exchange':
                                                message.exchange = node.attributes[i].value;
                                                break;
                                            case 'basecode':
                                                message.unitcode = node.attributes[i].value;
                                                break;
                                            case 'pointvalue':
                                                message.pointValue = parseFloat(node.attributes[i].value);
                                                break;
                                            case 'tickincrement':
                                                message.tickIncrement = parseInt(node.attributes[i].value);
                                                break;
                                            case 'flag':
                                                message.flag = node.attributes[i].value;
                                                break;
                                            case 'lastupdate':
                                                {
                                                    const v = node.attributes[i].value;
                                                    message.lastUpdate = new Date(parseInt(v.substr(0, 4)), parseInt(v.substr(4, 2)) - 1, parseInt(v.substr(6, 2)), parseInt(v.substr(8, 2)), parseInt(v.substr(10, 2)), parseInt(v.substr(12, 2)));
                                                    break;
                                                }
                                            case 'bid':
                                                message.bidPrice = parseValue(node.attributes[i].value, message.unitcode);
                                                break;
                                            case 'bidsize':
                                                message.bidSize = parseInt(node.attributes[i].value);
                                                break;
                                            case 'ask':
                                                message.askPrice = parseValue(node.attributes[i].value, message.unitcode);
                                                break;
                                            case 'asksize':
                                                message.askSize = parseInt(node.attributes[i].value);
                                                break;
                                            case 'mode':
                                                message.mode = node.attributes[i].value;
                                                break;
                                        }
                                    }

                                    const sessions = {};

                                    for (let j = 0; j < node.childNodes.length; j++) {
                                        if (node.childNodes[j].nodeName == 'SESSION') {
                                            const s = {};
                                            const attributes = node.childNodes[j].attributes;

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
                                                const v = attributes.getNamedItem('timestamp').value;
                                                s.timeStamp = new Date(parseInt(v.substr(0, 4)), parseInt(v.substr(4, 2)) - 1, parseInt(v.substr(6, 2)), parseInt(v.substr(8, 2)), parseInt(v.substr(10, 2)), parseInt(v.substr(12, 2)));
                                            }
                                            if (attributes.getNamedItem('tradetime')) {
                                                const v = attributes.getNamedItem('tradetime').value;
                                                s.tradeTime = new Date(parseInt(v.substr(0, 4)), parseInt(v.substr(4, 2)) - 1, parseInt(v.substr(6, 2)), parseInt(v.substr(8, 2)), parseInt(v.substr(10, 2)), parseInt(v.substr(12, 2)));
                                            }

                                            if (attributes.getNamedItem('blocktrade')) s.blockTrade = parseValue(attributes.getNamedItem('blocktrade').value, message.unitcode);

                                            if (s.id) sessions[s.id] = s;
                                        }
                                    }

                                    const premarket = typeof sessions.combined.lastPrice === 'undefined';
                                    const postmarket = !premarket && typeof sessions.combined.settlementPrice !== 'undefined';

                                    const session = premarket ? sessions.previous : sessions.combined;

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

                                    if (session.blockTrade) message.blockTrade = session.blockTrade;

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

                                    const p = sessions.previous;

                                    message.previousPreviousPrice = p.previousPrice;
                                    message.previousSettlementPrice = p.settlementPrice;
                                    message.previousOpenPrice = p.openPrice;
                                    message.previousHighPrice = p.highPrice;
                                    message.previousLowPrice = p.lowPrice;
                                    message.previousTimeStamp = p.timeStamp;

                                    if (sessions.combined.day) {
                                        const sessionFormT = 'session_' + sessions.combined.day + '_T';

                                        if (sessions.hasOwnProperty(sessionFormT)) {
                                            const t = sessions[sessionFormT];

                                            const lastPriceT = t.lastPrice;

                                            if (lastPriceT) {
                                                const tradeTimeT = t.tradeTime;
                                                const tradeSizeT = t.tradeSize;

                                                let sessionIsEvening;

                                                if (tradeTimeT) {
                                                    const noon = new Date(tradeTimeT.getFullYear(), tradeTimeT.getMonth(), tradeTimeT.getDate(), 12, 0, 0, 0);

                                                    sessionIsEvening = tradeTimeT.getTime() > noon.getTime();
                                                } else {
                                                    sessionIsEvening = false;
                                                }

                                                message.sessionT = sessionIsEvening;

                                                const sessionIsCurrent = premarket || sessionIsEvening;

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

                                    const dataAttribute = node.attributes.getNamedItem('data');

                                    if (dataAttribute) {
                                        const priceLevelsRaw = dataAttribute.value || '';
                                        const priceLevels = priceLevelsRaw.split(':');

                                        for (let i = 0; i < priceLevels.length; i++) {
                                            const priceLevelRaw = priceLevels[i];
                                            const priceLevelData = priceLevelRaw.split(',');

                                            priceLevels[i] = {
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
                                let pos = msg.indexOf(',', 0);
                                message.symbol = msg.substring(2, pos);
                                message.subrecord = msg.substr(pos + 1, 1);
                                message.unitcode = msg.substr(pos + 3, 1);
                                message.exchange = msg.substr(pos + 4, 1);
                                message.delay = parseInt(msg.substr(pos + 5, 2));
                                switch (message.subrecord) {
                                    case '0':
                                        {
                                            // TO DO: Error Handling / Sanity Check
                                            const pos2 = msg.indexOf(',', pos + 7);
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
                                            const ary = msg.substring(pos + 8).split(',');
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
                                            let pos2 = msg.indexOf(',', pos + 7);
                                            message.tradePrice = parseValue(msg.substring(pos + 7, pos2), message.unitcode);

                                            pos = pos2 + 1;
                                            pos2 = msg.indexOf(',', pos);
                                            message.tradeSize = parseInt(msg.substring(pos, pos2));
                                            pos = pos2 + 1;
                                            message.day = msg.substr(pos, 1);
                                            message.session = msg.substr(pos + 1, 1);
                                            message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
                                            message.type = 'TRADE';
                                            break;
                                        }
                                    case '8':
                                        {
                                            let pos2 = msg.indexOf(',', pos + 7);
                                            message.bidPrice = parseValue(msg.substring(pos + 7, pos2), message.unitcode);
                                            pos = pos2 + 1;
                                            pos2 = msg.indexOf(',', pos);
                                            message.bidSize = parseInt(msg.substring(pos, pos2));
                                            pos = pos2 + 1;
                                            pos2 = msg.indexOf(',', pos);
                                            message.askPrice = parseValue(msg.substring(pos, pos2), message.unitcode);
                                            pos = pos2 + 1;
                                            pos2 = msg.indexOf(',', pos);
                                            message.askSize = parseInt(msg.substring(pos, pos2));
                                            pos = pos2 + 1;
                                            message.day = msg.substr(pos, 1);
                                            message.session = msg.substr(pos + 1, 1);
                                            message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
                                            message.type = 'TOB';
                                            break;
                                        }
                                    case 'Z':
                                        {
                                            let pos2 = msg.indexOf(',', pos + 7);
                                            message.tradePrice = parseValue(msg.substring(pos + 7, pos2), message.unitcode);

                                            pos = pos2 + 1;
                                            pos2 = msg.indexOf(',', pos);
                                            message.tradeSize = parseInt(msg.substring(pos, pos2));
                                            pos = pos2 + 1;
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
                                const pos = msg.indexOf(',', 0);
                                message.symbol = msg.substring(2, pos);
                                message.subrecord = msg.substr(pos + 1, 1);
                                switch (message.subrecord) {
                                    case 'B':
                                        {
                                            message.unitcode = msg.substr(pos + 3, 1);
                                            message.exchange = msg.substr(pos + 4, 1);
                                            message.bidDepth = msg.substr(pos + 5, 1) == 'A' ? 10 : parseInt(msg.substr(pos + 5, 1));
                                            message.askDepth = msg.substr(pos + 6, 1) == 'A' ? 10 : parseInt(msg.substr(pos + 6, 1));
                                            message.bids = [];
                                            message.asks = [];
                                            const ary = msg.substring(pos + 8).split(',');
                                            for (let i = 0; i < ary.length; i++) {
                                                const ary2 = ary[i].split(/[A-Z]/);
                                                const c = ary[i].substr(ary2[0].length, 1);
                                                if (c <= 'J') message.asks.push({ "price": parseValue(ary2[0], message.unitcode), "size": parseInt(ary2[1]) });else message.bids.push({ "price": parseValue(ary2[0], message.unitcode), "size": parseInt(ary2[1]) });
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
    }

    return parseMessage;
})();

},{"./timestamp":21,"./value":22,"xmldom":24}],21:[function(require,module,exports){
module.exports = (() => {
	'use strict';

	/**
  * Parses a DDF timestamp.
  *
  * The resulting {@link Date} instance is meant to be a simple container
  * for year, month, day, hour, minute, and second. The timezone is implied
  * (to be the timezone of the exchange on which the associated instrument
  * trades.
  *
  * In other words, while the resulting {@link Date} instance uses the timezone
  * of the local computer -- this is unintended and should not be relied on.
  * So, regardless of whether your computer's timezone is set to Belize or Japan;
  * a quote for IBM, having a date of September 26 at 13:15 refers to September 26
  * at 13:15 in America/New_York not America/Belize or Asia/Tokyo.
  *
  * @public
  * @param {String} bytes
  * @returns {Date}
  */

	function parseTimestamp(bytes) {
		if (bytes.length !== 9) {
			return null;
		}

		const year = bytes.charCodeAt(0) * 100 + bytes.charCodeAt(1) - 64;
		const month = bytes.charCodeAt(2) - 64 - 1;
		const day = bytes.charCodeAt(3) - 64;
		const hour = bytes.charCodeAt(4) - 64;
		const minute = bytes.charCodeAt(5) - 64;
		const second = bytes.charCodeAt(6) - 64;
		const ms = (0xFF & bytes.charCodeAt(7)) + ((0xFF & bytes.charCodeAt(8)) << 8);

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
	}

	return parseTimestamp;
})();

},{}],22:[function(require,module,exports){
module.exports = (() => {
	'use strict';

	const replaceExpressions = {};

	function getReplaceExpression(thousandsSeparator) {
		if (!replaceExpressions.hasOwnProperty(thousandsSeparator)) {
			replaceExpressions[thousandsSeparator] = new RegExp(thousandsSeparator, 'g');
		}

		return replaceExpressions[thousandsSeparator];
	}

	/**
  * Parses DDF price.
  *
  * @public
  * @param {String} bytes
  * @param {String} unitcode
  * @param {String=} thousandsSeparator
  * @returns {Number}
  */
	function parseValue(str, unitcode, thousandsSeparator) {
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

		const sign = str.substr(0, 1) == '-' ? -1 : 1;

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
	}

	return parseValue;
})();

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{"./dom":25,"./sax":26}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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


},{}],27:[function(require,module,exports){
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

},{"../../../lib/marketState/CumulativeVolume":5}],28:[function(require,module,exports){
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

},{"../../../lib/marketState/Profile":6}],29:[function(require,module,exports){
let decimalFormatter = require('./../../../lib/util/decimalFormatter');

describe('when formatting invalid values', () => {
	it('formats a null value as a zero-length string', () => {
		expect(decimalFormatter(null, 0, ',')).toEqual('');
	});

	it('formats an undefined value as a zero-length string', () => {
		expect(decimalFormatter(undefined, 0, ',')).toEqual('');
	});

	it('formats Number.NaN as a zero-length string', () => {
		expect(decimalFormatter(Number.NaN, 0, ',')).toEqual('');
	});
});

describe('when using the "decimal" formatter with zero decimals and thousands separator', () => {
	it('formats 0 as "0"', () => {
		expect(decimalFormatter(0, 0, ',')).toEqual('0');
	});

	it('formats 0.1 as "0"', () => {
		expect(decimalFormatter(0.1, 0, ',')).toEqual('0');
	});

	it('formats 0.9 as "0"', () => {
		expect(decimalFormatter(0.9, 0, ',')).toEqual('1');
	});

	it('formats 377 as "377"', () => {
		expect(decimalFormatter(377, 0, ',')).toEqual('377');
	});

	it('formats -377 as "-377"', () => {
		expect(decimalFormatter(-377, 0, ',')).toEqual('-377');
	});

	it('formats 377.99 as "378"', () => {
		expect(decimalFormatter(377.99, 0, ',')).toEqual('378');
	});

	it('formats -377.99 as "-378"', () => {
		expect(decimalFormatter(-377.99, 0, ',')).toEqual('-378');
	});

	it('formats 377.49 as "377"', () => {
		expect(decimalFormatter(377.49, 0, ',')).toEqual('377');
	});

	it('formats -377.49 as "-377"', () => {
		expect(decimalFormatter(-377.49, 0, ',')).toEqual('-377');
	});

	it('formats 377377 as "377,377"', () => {
		expect(decimalFormatter(377377, 0, ',')).toEqual('377,377');
	});

	it('formats -377377 as "-377,377"', () => {
		expect(decimalFormatter(-377377, 0, ',')).toEqual('-377,377');
	});

	it('formats 377377.49 as "377,377"', () => {
		expect(decimalFormatter(377377.49, 0, ',')).toEqual('377,377');
	});

	it('formats -377377.49 as "-377,377"', () => {
		expect(decimalFormatter(-377377.49, 0, ',')).toEqual('-377,377');
	});

	it('formats 377377.99 as "377,378"', () => {
		expect(decimalFormatter(377377.99, 0, ',')).toEqual('377,378');
	});

	it('formats -377377.99 as "-377,378"', () => {
		expect(decimalFormatter(-377377.99, 0, ',')).toEqual('-377,378');
	});
});

describe('when using the "decimal" formatter with two decimals and thousands separator', () => {
	it('formats 0 as "0.00"', () => {
		expect(decimalFormatter(0, 2, ',')).toEqual('0.00');
	});

	it('formats 0.001 as "0.00"', () => {
		expect(decimalFormatter(0.001, 2, ',')).toEqual('0.00');
	});

	it('formats 0.009 as "0.01"', () => {
		expect(decimalFormatter(0.009, 2, ',')).toEqual('0.01');
	});

	it('formats 123.45 as "123.45"', () => {
		expect(decimalFormatter(123.45, 2, ',')).toEqual('123.45');
	});

	it('formats -123.45 as "-123.45"', () => {
		expect(decimalFormatter(-123.45, 2, ',')).toEqual('-123.45');
	});

	it('formats 1234.5 as "1234.50"', () => {
		expect(decimalFormatter(1234.5, 2, ',')).toEqual('1,234.50');
	});

	it('formats -1234.5 as "-1234.50"', () => {
		expect(decimalFormatter(-1234.5, 2, ',')).toEqual('-1,234.50');
	});

	it('formats 123456.789 as "123,456.79"', () => {
		expect(decimalFormatter(123456.789, 2, ',')).toEqual('123,456.79');
	});

	it('formats -123456.789 as "-123,456.79"', () => {
		expect(decimalFormatter(-123456.789, 2, ',')).toEqual('-123,456.79');
	});
});

describe('when using the "decimal" formatter with four decimals and thousands separator', () => {
	it('formats 1234.56789 as "1,234.5679"', function () {
		expect(decimalFormatter(1234.56789, 4, ',')).toEqual('1,234.5679');
	});

	it('formats -1234.56789 as "-1,234.5679"', function () {
		expect(decimalFormatter(-1234.56789, 4, ',')).toEqual('-1,234.5679');
	});
});

describe('when using the "decimal" formatter to format negative numbers with a thousands separator', () => {
	it('formats -123.456789 as "-123.45"', function () {
		expect(decimalFormatter(-123.456789, 2, ',')).toEqual('-123.46');
	});

	it('formats -123456.789 as "-123,456.79', function () {
		expect(decimalFormatter(-123456.789, 2, ',')).toEqual('-123,456.79');
	});
});

describe('when using the "decimal" formatter to format with parenthesis and a thousands separator', () => {
	it('formats 123.456789 as "-23.45"', function () {
		expect(decimalFormatter(123.456789, 2, ',', true)).toEqual('123.46');
	});

	it('formats -123.456789 as "-123.45"', function () {
		expect(decimalFormatter(-123.456789, 2, ',', true)).toEqual('(123.46)');
	});

	it('formats 123456.789 as "-123,456.79', function () {
		expect(decimalFormatter(123456.789, 2, ',', true)).toEqual('123,456.79');
	});

	it('formats -123456.789 as "-123,456.79', function () {
		expect(decimalFormatter(-123456.789, 2, ',', true)).toEqual('(123,456.79)');
	});

	it('formats -3770.75, to three decimal places, as "(3,770.750)', function () {
		expect(decimalFormatter(-3770.75, 3, ',', true)).toEqual('(3,770.750)');
	});
});

describe('when using the "decimal" formatter to format with parenthesis and no thousands separator', () => {
	it('formats 123.456789 as "-23.45"', function () {
		expect(decimalFormatter(123.456789, 2, '', true)).toEqual('123.46');
	});

	it('formats -123.456789 as "-123.45"', function () {
		expect(decimalFormatter(-123.456789, 2, '', true)).toEqual('(123.46)');
	});

	it('formats 123456.789 as "-123,456.79', function () {
		expect(decimalFormatter(123456.789, 2, '', true)).toEqual('123456.79');
	});

	it('formats -123456.789 as "-123,456.79', function () {
		expect(decimalFormatter(-123456.789, 2, '', true)).toEqual('(123456.79)');
	});
});

},{"./../../../lib/util/decimalFormatter":7}],30:[function(require,module,exports){
let monthCodes = require('./../../../lib/util/monthCodes');

describe('When looking up a month name by code', () => {
	let map;

	beforeEach(() => {
		map = monthCodes.getCodeToNameMap();
	});

	it('"F" should map to "January"', () => {
		expect(map.F).toEqual("January");
	});

	it('"G" should map to "February"', () => {
		expect(map.G).toEqual("February");
	});

	it('"H" should map to "March"', () => {
		expect(map.H).toEqual("March");
	});

	it('"J" should map to "April"', () => {
		expect(map.J).toEqual("April");
	});

	it('"K" should map to "May"', () => {
		expect(map.K).toEqual("May");
	});

	it('"M" should map to "June"', () => {
		expect(map.M).toEqual("June");
	});

	it('"N" should map to "July"', () => {
		expect(map.N).toEqual("July");
	});

	it('"Q" should map to "August"', () => {
		expect(map.Q).toEqual("August");
	});

	it('"U" should map to "September"', () => {
		expect(map.U).toEqual("September");
	});

	it('"V" should map to "October"', () => {
		expect(map.V).toEqual("October");
	});

	it('"X" should map to "November"', () => {
		expect(map.X).toEqual("November");
	});

	it('"Z" should map to "December"', () => {
		expect(map.Z).toEqual("December");
	});
});

describe('When looking up a month number by code', () => {
	let map;

	beforeEach(() => {
		map = monthCodes.getCodeToNumberMap();
	});

	it('"F" should map to 1', () => {
		expect(map.F).toEqual(1);
	});

	it('"G" should map to 2', () => {
		expect(map.G).toEqual(2);
	});

	it('"H" should map to 3', () => {
		expect(map.H).toEqual(3);
	});

	it('"J" should map to 4', () => {
		expect(map.J).toEqual(4);
	});

	it('"K" should map to 5', () => {
		expect(map.K).toEqual(5);
	});

	it('"M" should map to 6', () => {
		expect(map.M).toEqual(6);
	});

	it('"N" should map to 7', () => {
		expect(map.N).toEqual(7);
	});

	it('"Q" should map to 8', () => {
		expect(map.Q).toEqual(8);
	});

	it('"U" should map to 9', () => {
		expect(map.U).toEqual(9);
	});

	it('"V" should map to 10', () => {
		expect(map.V).toEqual(10);
	});

	it('"X" should map to 11', () => {
		expect(map.X).toEqual(11);
	});

	it('"Z" should map to 12', () => {
		expect(map.Z).toEqual(12);
	});
});

},{"./../../../lib/util/monthCodes":8}],31:[function(require,module,exports){
let PriceFormatter = require('./../../../lib/util/priceFormatter');

describe('When a price formatter is created', () => {
	let priceFormatter;

	describe('with a decimal separator', () => {
		beforeEach(() => {
			priceFormatter = new PriceFormatter('.');
		});

		it('formats 377 (with unit code 2) as "377.000"', () => {
			expect(priceFormatter.format(377, '2')).toEqual('377.000');
		});

		it('formats -377 (with unit code 2) as "-377.000"', () => {
			expect(priceFormatter.format(-377, '2')).toEqual('-377.000');
		});

		it('formats 377.5 (with unit code 2) as "377.500"', () => {
			expect(priceFormatter.format(377.5, '2')).toEqual('377.500');
		});

		it('formats 377.75 (with unit code 2) as "377.750"', () => {
			expect(priceFormatter.format(377.75, '2')).toEqual('377.750');
		});

		it('formats 3770.75 (with unit code 2) as "3770.750"', () => {
			expect(priceFormatter.format(3770.75, '2')).toEqual('3770.750');
		});

		it('formats 37700.75 (with unit code 2) as "37700.750"', () => {
			expect(priceFormatter.format(37700.75, '2')).toEqual('37700.750');
		});

		it('formats 377000.75 (with unit code 2) as "377000.750"', () => {
			expect(priceFormatter.format(377000.75, '2')).toEqual('377000.750');
		});

		it('formats 3770000.75 (with unit code 2) as "3770000.750"', () => {
			expect(priceFormatter.format(3770000.75, '2')).toEqual('3770000.750');
		});

		it('formats 3770000 (with unit code 2) as "3770000.000"', () => {
			expect(priceFormatter.format(3770000, '2')).toEqual('3770000.000');
		});

		it('formats 0 (with unit code 2) as "0.000"', () => {
			expect(priceFormatter.format(0, '2')).toEqual('0.000');
		});

		it('formats undefined (with unit code 2) as zero-length string', () => {
			expect(priceFormatter.format(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', () => {
			expect(priceFormatter.format(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', () => {
			expect(priceFormatter.format(Number.NaN, '2')).toEqual('');
		});

		it('formats 0 (with unit code 8) as "0"', () => {
			expect(priceFormatter.format(0, '8')).toEqual('0');
		});

		it('formats 1000 (with unit code 8) as "1000"', () => {
			expect(priceFormatter.format(1000, '8')).toEqual('1000');
		});
	});

	describe('with a decimal separator, no special fractions, and a thousands separator', () => {
		beforeEach(() => {
			priceFormatter = new PriceFormatter('.', false, ',');
		});

		it('formats 377 (with unit code 2) as "377.000"', () => {
			expect(priceFormatter.format(377, '2')).toEqual('377.000');
		});

		it('formats -377 (with unit code 2) as "-377.000"', () => {
			expect(priceFormatter.format(-377, '2')).toEqual('-377.000');
		});

		it('formats 377.5 (with unit code 2) as "377.500"', () => {
			expect(priceFormatter.format(377.5, '2')).toEqual('377.500');
		});

		it('formats 377.75 (with unit code 2) as "377.750"', () => {
			expect(priceFormatter.format(377.75, '2')).toEqual('377.750');
		});

		it('formats 3770.75 (with unit code 2) as "3,770.750"', () => {
			expect(priceFormatter.format(3770.75, '2')).toEqual('3,770.750');
		});

		it('formats 37700.75 (with unit code 2) as "37,700.750"', () => {
			expect(priceFormatter.format(37700.75, '2')).toEqual('37,700.750');
		});

		it('formats 377000.75 (with unit code 2) as "377,000.750"', () => {
			expect(priceFormatter.format(377000.75, '2')).toEqual('377,000.750');
		});

		it('formats -377000.75 (with unit code 2) as "-377,000.750"', () => {
			expect(priceFormatter.format(-377000.75, '2')).toEqual('-377,000.750');
		});

		it('formats 3770000.75 (with unit code 2) as "3,770,000.750"', () => {
			expect(priceFormatter.format(3770000.75, '2')).toEqual('3,770,000.750');
		});

		it('formats 3770000 (with unit code 2) as "3,770,000.000"', () => {
			expect(priceFormatter.format(3770000, '2')).toEqual('3,770,000.000');
		});

		it('formats 0 (with unit code 2) as "0.000"', () => {
			expect(priceFormatter.format(0, '2')).toEqual('0.000');
		});

		it('formats undefined (with unit code 2) as zero-length string', () => {
			expect(priceFormatter.format(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', () => {
			expect(priceFormatter.format(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', () => {
			expect(priceFormatter.format(Number.NaN, '2')).toEqual('');
		});

		it('formats 0 (with unit code 8) as "0"', () => {
			expect(priceFormatter.format(0, '8')).toEqual('0');
		});

		it('formats 1000 (with unit code 8) as "1,000"', () => {
			expect(priceFormatter.format(1000, '8')).toEqual('1,000');
		});
	});

	describe('with a dash separator and no special fractions', () => {
		beforeEach(() => {
			priceFormatter = new PriceFormatter('-', false);
		});

		it('formats 123 (with unit code 2) as "123-0"', () => {
			expect(priceFormatter.format(123, '2')).toEqual('123-0');
		});

		it('formats -123 (with unit code 2) as "-123-0"', () => {
			expect(priceFormatter.format(-123, '2')).toEqual('-123-0');
		});

		it('formats 123.5 (with unit code 2) as "123-4"', () => {
			expect(priceFormatter.format(123.5, '2')).toEqual('123-4');
		});

		it('formats -123.5 (with unit code 2) as "-123-4"', () => {
			expect(priceFormatter.format(-123.5, '2')).toEqual('-123-4');
		});

		it('formats 0.5 (with unit code 2) as "0-4"', () => {
			expect(priceFormatter.format(0.5, '2')).toEqual('0-4');
		});

		it('formats 0 (with unit code 2) as "0-0"', () => {
			expect(priceFormatter.format(0, '2')).toEqual('0-0');
		});

		it('formats zero-length string (with unit code 2) as zero-length string', () => {
			expect(priceFormatter.format('', '2')).toEqual('');
		});

		it('formats undefined (with unit code 2) as zero-length string', () => {
			expect(priceFormatter.format(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', () => {
			expect(priceFormatter.format(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', () => {
			expect(priceFormatter.format(Number.NaN, '2')).toEqual('');
		});

		it('formats 123 (with unit code A) as "123.00"', () => {
			expect(priceFormatter.format(123, 'A')).toEqual('123.00');
		});

		it('formats 123.5 (with unit code A) as "123.50"', () => {
			expect(priceFormatter.format(123.5, 'A')).toEqual('123.50');
		});

		it('formats 123.555 (with unit code A) as "123.56"', () => {
			expect(priceFormatter.format(123.555, 'A')).toEqual('123.56');
		});
	});

	describe('with a dash separator and special fractions', () => {
		beforeEach(() => {
			priceFormatter = new PriceFormatter('-', true);
		});

		it('formats 123.625 (with unit code 5) as "123-200"', () => {
			expect(priceFormatter.format(123.625, '5')).toEqual('123-200');
		});

		it('formats -123.625 (with unit code 5) as "-123-200"', () => {
			expect(priceFormatter.format(-123.625, '5')).toEqual('-123-200');
		});

		it('formats 123.640625 (with unit code 5) as "123-205"', () => {
			expect(priceFormatter.format(123.640625, '5')).toEqual('123-205');
		});

		it('formats -123.640625 (with unit code 5) as "-123-205"', () => {
			expect(priceFormatter.format(-123.640625, '5')).toEqual('-123-205');
		});

		it('formats 114.5156 (with unit code 6) as "114-165"', () => {
			expect(priceFormatter.format(114.5156, '6')).toEqual('114-165');
		});

		it('formats 114.7891 (with unit code 6) as "114-252"', () => {
			expect(priceFormatter.format(114.7891, '6')).toEqual('114-252');
		});

		it('formats 114.8438 (with unit code 6) as "114-270"', () => {
			expect(priceFormatter.format(114.8438, '6')).toEqual('114-270');
		});

		it('formats 114.75 (with unit code 6) as "114-240"', () => {
			expect(priceFormatter.format(114.75, '6')).toEqual('114-240');
		});

		it('formats 122.7031 (with unit code 5) as "122-225"', () => {
			expect(priceFormatter.format(122.7031, '5')).toEqual('122-225');
		});

		it('formats 0 (with unit code 2) as "0"', function () {
			expect(priceFormatter.format(0, '2')).toEqual('0-0');
		});
	});

	describe('with a tick separator and no special fractions', () => {
		beforeEach(() => {
			priceFormatter = new PriceFormatter('\'', false);
		});

		it('formats 123 (with unit code 2) as "123\'0"', () => {
			expect(priceFormatter.format(123, '2')).toEqual('123\'0');
		});

		it('formats 123.5 (with unit code 2) as "123\'4"', () => {
			expect(priceFormatter.format(123.5, '2')).toEqual('123\'4');
		});

		it('formats -123.5 (with unit code 2) as "-123\'4"', () => {
			expect(priceFormatter.format(-123.5, '2')).toEqual('-123\'4');
		});

		it('formats 0.5 (with unit code 2) as "0\'4"', () => {
			expect(priceFormatter.format(0.5, '2')).toEqual('0\'4');
		});

		it('formats -0.5 (with unit code 2) as "-0\'4"', () => {
			expect(priceFormatter.format(-0.5, '2')).toEqual('-0\'4');
		});

		it('formats 0 (with unit code 2) as "0\'0"', () => {
			expect(priceFormatter.format(0, '2')).toEqual('0\'0');
		});

		it('formats zero-length string (with unit code 2) as zero-length string', () => {
			expect(priceFormatter.format('', '2')).toEqual('');
		});

		it('formats undefined (with unit code 2) as zero-length string', () => {
			expect(priceFormatter.format(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', () => {
			expect(priceFormatter.format(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', () => {
			expect(priceFormatter.format(Number.NaN, '2')).toEqual('');
		});
	});

	describe('with no separator and no special fractions', () => {
		beforeEach(() => {
			priceFormatter = new PriceFormatter('', false);
		});

		it('formats 123 (with unit code 2) as "1230"', () => {
			expect(priceFormatter.format(123, '2')).toEqual('1230');
		});

		it('formats 123.5 (with unit code 2) as "1234"', () => {
			expect(priceFormatter.format(123.5, '2')).toEqual('1234');
		});

		it('formats 0.5 (with unit code 2) as "4"', () => {
			expect(priceFormatter.format(0.5, '2')).toEqual('4');
		});

		it('formats 0 (with unit code 2) as "0"', () => {
			expect(priceFormatter.format(0, '2')).toEqual('0');
		});

		it('formats zero-length string (with unit code 2) as zero-length string', () => {
			expect(priceFormatter.format('', '2')).toEqual('');
		});

		it('formats undefined (with unit code 2) as zero-length string', () => {
			expect(priceFormatter.format(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', () => {
			expect(priceFormatter.format(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', () => {
			expect(priceFormatter.format(Number.NaN, '2')).toEqual('');
		});
	});

	describe('with parenthetical negatives', () => {
		describe('and a decimal separator, no special fractions, and no thousands separator', () => {
			beforeEach(() => {
				priceFormatter = new PriceFormatter('.', false, '', true);
			});

			it('formats 3770.75 (with unit code 2) as "3770.750"', () => {
				expect(priceFormatter.format(3770.75, '2')).toEqual('3770.750');
			});

			it('formats -3770.75 (with unit code 2) as "(3770.750)"', () => {
				expect(priceFormatter.format(-3770.75, '2')).toEqual('(3770.750)');
			});

			it('formats 0 (with unit code 2) as "0.000"', () => {
				expect(priceFormatter.format(0, '2')).toEqual('0.000');
			});
		});

		describe('with a decimal separator, no special fractions, and a thousands separator', () => {
			beforeEach(function () {
				priceFormatter = new PriceFormatter('.', false, ',', true);
			});

			it('formats 3770.75 (with unit code 2) as "3,770.750"', () => {
				expect(priceFormatter.format(3770.75, '2')).toEqual('3,770.750');
			});

			it('formats -3770.75 (with unit code 2) as "(3,770.750)"', () => {
				expect(priceFormatter.format(-3770.75, '2')).toEqual('(3,770.750)');
			});

			it('formats 0 (with unit code 2) as "0.000"', () => {
				expect(priceFormatter.format(0, '2')).toEqual('0.000');
			});
		});

		describe('with a dash separator and no special fractions', () => {
			beforeEach(function () {
				priceFormatter = new PriceFormatter('-', false, '', true);
			});

			it('formats 123 (with unit code 2) as "123-0"', function () {
				expect(priceFormatter.format(123, '2')).toEqual('123-0');
			});

			it('formats -123 (with unit code 2) as "(123-0)"', function () {
				expect(priceFormatter.format(-123, '2')).toEqual('(123-0)');
			});

			it('formats 123.5 (with unit code 2) as "123-4"', function () {
				expect(priceFormatter.format(123.5, '2')).toEqual('123-4');
			});

			it('formats -123.5 (with unit code 2) as "(123-4)"', function () {
				expect(priceFormatter.format(-123.5, '2')).toEqual('(123-4)');
			});

			it('formats 0.5 (with unit code 2) as "0-4"', () => {
				expect(priceFormatter.format(0.5, '2')).toEqual('0-4');
			});

			it('formats -0.5 (with unit code 2) as "(0-4)"', () => {
				expect(priceFormatter.format(-0.5, '2')).toEqual('(0-4)');
			});

			it('formats 0 (with unit code 2) as "0"', function () {
				expect(priceFormatter.format(0, '2')).toEqual('0-0');
			});
		});

		describe('with a dash separator and special fractions', () => {
			beforeEach(() => {
				priceFormatter = new PriceFormatter('-', true, '', true);
			});

			it('formats 123.625 (with unit code 5) as "123-200"', () => {
				expect(priceFormatter.format(123.625, '5')).toEqual('123-200');
			});

			it('formats -123.625 (with unit code 5) as "(123-200)"', () => {
				expect(priceFormatter.format(-123.625, '5')).toEqual('(123-200)');
			});

			it('formats 123.640625 (with unit code 5) as "123-205"', () => {
				expect(priceFormatter.format(123.640625, '5')).toEqual('123-205');
			});

			it('formats -123.640625 (with unit code 5) as "(123-205)"', () => {
				expect(priceFormatter.format(-123.640625, '5')).toEqual('(123-205)');
			});
		});

		describe('with a tick separator and no special fractions', () => {
			beforeEach(function () {
				priceFormatter = new PriceFormatter('\'', false, '', true);
			});

			it('formats 123.5 (with unit code 2) as "123\'4"', function () {
				expect(priceFormatter.format(123.5, '2')).toEqual('123\'4');
			});

			it('formats -123.5 (with unit code 2) as "(123\'4)"', function () {
				expect(priceFormatter.format(-123.5, '2')).toEqual('(123\'4)');
			});

			it('formats 0.5 (with unit code 2) as "0\'4"', () => {
				expect(priceFormatter.format(0.5, '2')).toEqual('0\'4');
			});

			it('formats -0.5 (with unit code 2) as "(0\'4)"', () => {
				expect(priceFormatter.format(-0.5, '2')).toEqual('(0\'4)');
			});

			it('formats 0 (with unit code 2) as "0\'0"', () => {
				expect(priceFormatter.format(0, '2')).toEqual('0\'0');
			});
		});

		describe('with no separator and no special fractions', () => {
			beforeEach(function () {
				priceFormatter = new PriceFormatter('', false, '', true);
			});

			it('formats 0.5 (with unit code 2) as "4"', function () {
				expect(priceFormatter.format(0.5, '2')).toEqual('4');
			});

			it('formats -0.5 (with unit code 2) as "(4)"', function () {
				expect(priceFormatter.format(-0.5, '2')).toEqual('(4)');
			});

			it('formats 0 (with unit code 2) as "0"', function () {
				expect(priceFormatter.format(0, '2')).toEqual('0');
			});
		});
	});
});

},{"./../../../lib/util/priceFormatter":10}],32:[function(require,module,exports){
let stringToDecimalFormatterSpec = require('./../../../lib/util/stringToDecimalFormatter');

describe('when parsing prices', () => {
	'use strict';

	describe('with a fractional separator', () => {
		it('returns 125.625 (with unit code 2) when parsing "125-5"', () => {
			expect(stringToDecimalFormatterSpec('125-5', '2')).toEqual(125.625);
		});

		it('returns 125.625 (with unit code 5) when parsing "125-240"', () => {
			expect(stringToDecimalFormatterSpec('125-240', '5')).toEqual(125.75);
		});
	});
});

},{"./../../../lib/util/stringToDecimalFormatter":11}],33:[function(require,module,exports){
let symbolFormatter = require('./../../../lib/util/symbolFormatter');

describe('When a lowercase string is formatted as a symbol', () => {
	let originalSymbol;
	let formattedSymbol;

	beforeEach(() => {
		formattedSymbol = symbolFormatter.format(originalSymbol = 'aapl');
	});

	it('The result should only contain uppercase letters', () => {
		expect(formattedSymbol).toEqual('AAPL');
	});
});

describe('When an uppercase string is formatted as a symbol', () => {
	let originalSymbol;
	let formattedSymbol;

	beforeEach(() => {
		formattedSymbol = symbolFormatter.format(originalSymbol = 'AAPL');
	});

	it('The result should only contain uppercase letters', () => {
		expect(formattedSymbol).toEqual('AAPL');
	});
});

describe('When a mixed case string is formatted as a symbol', () => {
	let originalSymbol;
	let formattedSymbol;

	beforeEach(() => {
		formattedSymbol = symbolFormatter.format(originalSymbol = 'aApL');
	});

	it('The result should only contain uppercase letters', () => {
		expect(formattedSymbol).toEqual('AAPL');
	});
});

describe('When a zero-length string is formatted as a symbol', () => {
	let originalSymbol;
	let formattedSymbol;

	beforeEach(() => {
		formattedSymbol = symbolFormatter.format(originalSymbol = '');
	});

	it('The result should be the original, zero-length string', () => {
		expect(formattedSymbol).toEqual(originalSymbol);
	});
});

describe('When a string with numbers is formatted as a symbol', () => {
	let originalSymbol;
	let formattedSymbol;

	beforeEach(() => {
		formattedSymbol = symbolFormatter.format(originalSymbol = 'esm16');
	});

	it('The result should only contain uppercase letters', () => {
		expect(formattedSymbol).toEqual('ESM16');
	});
});

describe('When a number is formatted as a symbol', () => {
	let originalSymbol;
	let formattedSymbol;

	beforeEach(() => {
		formattedSymbol = symbolFormatter.format(originalSymbol = 1);
	});

	it('The result should be a number', () => {
		expect(typeof formattedSymbol).toEqual('number');
	});

	it('The result should the original, unformatted string', () => {
		expect(formattedSymbol).toEqual(originalSymbol);
	});
});

describe('When an undefined value is formatted as a symbol', () => {
	let originalSymbol;
	let formattedSymbol;

	beforeEach(() => {
		formattedSymbol = symbolFormatter.format(originalSymbol = undefined);
	});

	it('The result should be a undefined', () => {
		expect(typeof formattedSymbol).toEqual('undefined');
	});
});

describe('When an null value is formatted', () => {
	let originalSymbol;
	let formattedSymbol;

	beforeEach(() => {
		formattedSymbol = symbolFormatter.format(originalSymbol = null);
	});

	it('The result should be null', () => {
		expect(formattedSymbol).toEqual(null);
	});
});

},{"./../../../lib/util/symbolFormatter":12}],34:[function(require,module,exports){
let symbolParser = require('./../../../lib/util/symbolParser');

describe('When parsing a symbol for instrument type', () => {
	describe('and the symbol is IBM', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = symbolParser.parseInstrumentType('IBM');
		});

		it('the result should be null', () => {
			expect(instrumentType).toBe(null);
		});
	});

	describe('and the symbol is ESZ9', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = symbolParser.parseInstrumentType('ESZ9');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ESZ9"', () => {
			expect(instrumentType.symbol).toEqual('ESZ9');
		});

		it('the "type" should be "future"', () => {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be false', () => {
			expect(instrumentType.dynamic).toEqual(false);
		});

		it('the "root" should be "ES"', () => {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "month" should be "Z"', () => {
			expect(instrumentType.month).toEqual('Z');
		});

		it('the "year" should be 2019', () => {
			expect(instrumentType.year).toEqual(2019);
		});
	});

	describe('and the symbol is ESZ16', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = symbolParser.parseInstrumentType('ESZ16');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ESZ16"', () => {
			expect(instrumentType.symbol).toEqual('ESZ16');
		});

		it('the "type" should be "future"', () => {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be false', () => {
			expect(instrumentType.dynamic).toEqual(false);
		});

		it('the "root" should be "ES"', () => {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "month" should be "Z"', () => {
			expect(instrumentType.month).toEqual('Z');
		});

		it('the "year" should be 2016', () => {
			expect(instrumentType.year).toEqual(2016);
		});
	});

	describe('and the symbol is ESZ2016', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = symbolParser.parseInstrumentType('ESZ2016');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ES2016Z6"', () => {
			expect(instrumentType.symbol).toEqual('ESZ2016');
		});

		it('the "type" should be "future"', () => {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be false', () => {
			expect(instrumentType.dynamic).toEqual(false);
		});

		it('the "root" should be "ES"', () => {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "month" should be "Z"', () => {
			expect(instrumentType.month).toEqual('Z');
		});

		it('the "year" should be 2016', () => {
			expect(instrumentType.year).toEqual(2016);
		});
	});

	describe('and the symbol is ES*0', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = symbolParser.parseInstrumentType('ES*0');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ES*0"', () => {
			expect(instrumentType.symbol).toEqual('ES*0');
		});

		it('the "type" should be "future"', () => {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be true', () => {
			expect(instrumentType.dynamic).toEqual(true);
		});

		it('the "root" should be "ES"', () => {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "dynamicCode" property should be "0"', () => {
			expect(instrumentType.dynamicCode).toEqual('0');
		});
	});

	describe('and the symbol is ES*1', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = symbolParser.parseInstrumentType('ES*1');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ES*1"', () => {
			expect(instrumentType.symbol).toEqual('ES*1');
		});

		it('the "type" should be "future"', () => {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be true', () => {
			expect(instrumentType.dynamic).toEqual(true);
		});

		it('the "root" should be "ES"', () => {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "dynamicCode" property should be "1"', () => {
			expect(instrumentType.dynamicCode).toEqual('1');
		});
	});

	describe('and the symbol is CLF0', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = symbolParser.parseInstrumentType('CLF0');
		});

		it('the "year" should be 2020', () => {
			expect(instrumentType.year).toEqual(2020);
		});
	});

	describe('and the symbol is CLF1 and the year is 2019', () => {
		let instrumentType;

		beforeEach(() => {
			let getFullYear = Date.prototype.getFullYear;

			Date.prototype.getFullYear = () => {
				return 2019;
			};

			instrumentType = symbolParser.parseInstrumentType('CLF1');

			Date.prototype.getFullYear = getFullYear;
		});

		it('the "year" should be 2021', () => {
			expect(instrumentType.year).toEqual(2021);
		});
	});

	describe('and the symbol is CLF9 and the year is 2019', () => {
		let instrumentType;

		beforeEach(() => {
			let getFullYear = Date.prototype.getFullYear;

			Date.prototype.getFullYear = () => {
				return 2019;
			};

			instrumentType = symbolParser.parseInstrumentType('CLF9');

			Date.prototype.getFullYear = getFullYear;
		});

		it('the "year" should be 2019', () => {
			expect(instrumentType.year).toEqual(2019);
		});
	});

	describe('and the symbol is ^EURUSD', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = symbolParser.parseInstrumentType('^EURUSD');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "^EURUSD"', () => {
			expect(instrumentType.symbol).toEqual('^EURUSD');
		});

		it('the "type" should be "forex"', () => {
			expect(instrumentType.type).toEqual('forex');
		});
	});

	describe('and the symbol is $DOWI', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = symbolParser.parseInstrumentType('$DOWI');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "$DOWI"', () => {
			expect(instrumentType.symbol).toEqual('$DOWI');
		});

		it('the "type" should be "index"', () => {
			expect(instrumentType.type).toEqual('index');
		});
	});

	describe('and the symbol is $SG1E', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = symbolParser.parseInstrumentType('$SG1E');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "$SG1E"', () => {
			expect(instrumentType.symbol).toEqual('$SG1E');
		});

		it('the "type" should be "index"', () => {
			expect(instrumentType.type).toEqual('index');
		});
	});

	describe('and the symbol is -001A', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = symbolParser.parseInstrumentType('-001A');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "-001A"', () => {
			expect(instrumentType.symbol).toEqual('-001A');
		});

		it('the "type" should be "sector"', () => {
			expect(instrumentType.type).toEqual('sector');
		});
	});

	describe('and the symbol is ESZ2660Q', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = symbolParser.parseInstrumentType('ESZ2660Q');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ESZ2660Q"', () => {
			expect(instrumentType.symbol).toEqual('ESZ2660Q');
		});

		it('the "type" should be "future_option"', () => {
			expect(instrumentType.type).toEqual('future_option');
		});

		it('the "root" should be "ES"', () => {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "month" should be "Z"', () => {
			expect(instrumentType.month).toEqual('Z');
		});

		it('the "year" should be next year', () => {
			expect(instrumentType.year).toEqual(new Date().getFullYear() + 1);
		});

		it('the "strike" should be 2660', () => {
			expect(instrumentType.strike).toEqual(2660);
		});

		it('the "option_type" should be "put"', () => {
			expect(instrumentType.option_type).toEqual('put');
		});
	});

	describe('and the symbol is ZWH9|470C', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = symbolParser.parseInstrumentType('ZWH9|470C');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ZWH9|470C"', () => {
			expect(instrumentType.symbol).toEqual('ZWH9|470C');
		});

		it('the "type" should be "future_option"', () => {
			expect(instrumentType.type).toEqual('future_option');
		});

		it('the "root" should be "ZW"', () => {
			expect(instrumentType.root).toEqual('ZW');
		});

		it('the "month" should be "H"', () => {
			expect(instrumentType.month).toEqual('H');
		});

		it('the "year" should be 2019', () => {
			expect(instrumentType.year).toEqual(2019);
		});

		it('the "strike" should be 470', () => {
			expect(instrumentType.strike).toEqual(470);
		});

		it('the "option_type" should be "call"', () => {
			expect(instrumentType.option_type).toEqual('call');
		});
	});

	describe('and the symbol is _S_SP_ZCH7_ZCK7', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = symbolParser.parseInstrumentType('_S_SP_ZCH7_ZCK7');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "_S_SP_ZCH7_ZCK7"', () => {
			expect(instrumentType.symbol).toEqual('_S_SP_ZCH7_ZCK7');
		});

		it('the "type" should be "future_spread"', () => {
			expect(instrumentType.type).toEqual('future_spread');
		});
	});
});

describe('When checking to see if a symbol is a future', () => {
	it('the symbol "ESZ6" should return true', () => {
		expect(symbolParser.getIsFuture('ESZ6')).toEqual(true);
	});

	it('the symbol "ESZ16" should return true', () => {
		expect(symbolParser.getIsFuture('ESZ16')).toEqual(true);
	});

	it('the symbol "ESZ2016" should return true', () => {
		expect(symbolParser.getIsFuture('ESZ2016')).toEqual(true);
	});

	it('the symbol "ESZ016" should return false', () => {
		expect(symbolParser.getIsFuture('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return true', () => {
		expect(symbolParser.getIsFuture('O!H7')).toEqual(true);
	});

	it('the symbol "O!H2017" should return true', () => {
		expect(symbolParser.getIsFuture('O!H2017')).toEqual(true);
	});

	it('the symbol "IBM" should return false', () => {
		expect(symbolParser.getIsFuture('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', () => {
		expect(symbolParser.getIsFuture('^EURUSD')).toEqual(false);
	});

	it('the symbol "-001A" should return false', () => {
		expect(symbolParser.getIsFuture('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', () => {
		expect(symbolParser.getIsFuture('$DOWI')).toEqual(false);
	});

	it('the symbol "$SG1E" should return false', () => {
		expect(symbolParser.getIsFuture('$SG1E')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
		expect(symbolParser.getIsFuture('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});

	it('the symbol "ESZ2660Q" should return false', () => {
		expect(symbolParser.getIsFuture('ESZ2660Q')).toEqual(false);
	});

	it('the symbol "ZWH9|470C" should return false', () => {
		expect(symbolParser.getIsFuture('ZWH9|470C')).toEqual(false);
	});

	it('the symbol "BB1F8|12050C" should return false', () => {
		expect(symbolParser.getIsFuture('BB1F8|12050C')).toEqual(false);
	});

	it('the symbol "ZWK18465C" should return false', () => {
		expect(symbolParser.getIsFuture('ZWK18465C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00C" should return false', () => {
		expect(symbolParser.getIsFuture('PLATTS:AAVSV00C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00" should return false', () => {
		expect(symbolParser.getIsFuture('PLATTS:AAVSV00')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(symbolParser.getIsFuture('ZCPAUS.CM')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a "concrete" future', () => {
	it('the symbol "ESZ6" should return true', () => {
		expect(symbolParser.getIsConcrete('ESZ6')).toEqual(true);
	});

	it('the symbol "ESZ16" should return true', () => {
		expect(symbolParser.getIsConcrete('ESZ16')).toEqual(true);
	});

	it('the symbol "ESZ2016" should return true', () => {
		expect(symbolParser.getIsConcrete('ESZ2016')).toEqual(true);
	});

	it('the symbol "ES*0" should return false', () => {
		expect(symbolParser.getIsConcrete('ES*0')).toEqual(false);
	});

	it('the symbol "ES*1" should return false', () => {
		expect(symbolParser.getIsConcrete('ES*1')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a "reference" future', () => {
	it('the symbol "ESZ6" should return false', () => {
		expect(symbolParser.getIsReference('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', () => {
		expect(symbolParser.getIsReference('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', () => {
		expect(symbolParser.getIsReference('ESZ2016')).toEqual(false);
	});

	it('the symbol "ES*0" should return true', () => {
		expect(symbolParser.getIsReference('ES*0')).toEqual(true);
	});

	it('the symbol "ES*1" should return true', () => {
		expect(symbolParser.getIsReference('ES*1')).toEqual(true);
	});
});

describe('When checking to see if a symbol is sector', () => {
	it('the symbol "ESZ6" should return false', () => {
		expect(symbolParser.getIsSector('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', () => {
		expect(symbolParser.getIsSector('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', () => {
		expect(symbolParser.getIsSector('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', () => {
		expect(symbolParser.getIsSector('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', () => {
		expect(symbolParser.getIsSector('O!H7')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', () => {
		expect(symbolParser.getIsSector('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', () => {
		expect(symbolParser.getIsSector('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', () => {
		expect(symbolParser.getIsSector('^EURUSD')).toEqual(false);
	});

	it('the symbol "-001A" should return true', () => {
		expect(symbolParser.getIsSector('-001A')).toEqual(true);
	});

	it('the symbol "$DOWI" should return false', () => {
		expect(symbolParser.getIsSector('$DOWI')).toEqual(false);
	});

	it('the symbol "$S1GE" should return false', () => {
		expect(symbolParser.getIsSector('$S1GE')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
		expect(symbolParser.getIsSector('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});

	it('the symbol "ESZ2660Q" should return false', () => {
		expect(symbolParser.getIsSector('ESZ2660Q')).toEqual(false);
	});

	it('the symbol "ZWH9|470C" should return false', () => {
		expect(symbolParser.getIsSector('ZWH9|470C')).toEqual(false);
	});

	it('the symbol "BB1F8|12050C" should return false', () => {
		expect(symbolParser.getIsSector('BB1F8|12050C')).toEqual(false);
	});

	it('the symbol "ZWK18465C" should return false', () => {
		expect(symbolParser.getIsSector('ZWK18465C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00C" should return false', () => {
		expect(symbolParser.getIsSector('PLATTS:AAVSV00C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00" should return false', () => {
		expect(symbolParser.getIsSector('PLATTS:AAVSV00')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(symbolParser.getIsSector('ZCPAUS.CM')).toEqual(false);
	});
});

describe('When checking to see if a symbol is forex', () => {
	it('the symbol "ESZ6" should return false', () => {
		expect(symbolParser.getIsForex('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', () => {
		expect(symbolParser.getIsForex('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', () => {
		expect(symbolParser.getIsForex('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', () => {
		expect(symbolParser.getIsForex('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', () => {
		expect(symbolParser.getIsForex('O!H7')).toEqual(false);
	});

	it('the symbol "O!H17" should return false', () => {
		expect(symbolParser.getIsForex('O!H17')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', () => {
		expect(symbolParser.getIsForex('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', () => {
		expect(symbolParser.getIsForex('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return true', () => {
		expect(symbolParser.getIsForex('^EURUSD')).toEqual(true);
	});

	it('the symbol "-001A" should return false', () => {
		expect(symbolParser.getIsForex('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', () => {
		expect(symbolParser.getIsForex('$DOWI')).toEqual(false);
	});

	it('the symbol "$S1GE" should return false', () => {
		expect(symbolParser.getIsForex('$S1GE')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
		expect(symbolParser.getIsForex('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});

	it('the symbol "ESZ2660Q" should return false', () => {
		expect(symbolParser.getIsForex('ESZ2660Q')).toEqual(false);
	});

	it('the symbol "ZWH9|470C" should return false', () => {
		expect(symbolParser.getIsForex('ZWH9|470C')).toEqual(false);
	});

	it('the symbol "BB1F8|12050C" should return false', () => {
		expect(symbolParser.getIsForex('BB1F8|12050C')).toEqual(false);
	});

	it('the symbol "ZWK18465C" should return false', () => {
		expect(symbolParser.getIsForex('ZWK18465C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00C" should return false', () => {
		expect(symbolParser.getIsForex('PLATTS:AAVSV00C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00" should return false', () => {
		expect(symbolParser.getIsForex('PLATTS:AAVSV00')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(symbolParser.getIsForex('ZCPAUS.CM')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a future spread', () => {
	it('the symbol "ESZ6" should return false', () => {
		expect(symbolParser.getIsFutureSpread('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', () => {
		expect(symbolParser.getIsFutureSpread('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', () => {
		expect(symbolParser.getIsFutureSpread('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', () => {
		expect(symbolParser.getIsFutureSpread('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', () => {
		expect(symbolParser.getIsFutureSpread('O!H7')).toEqual(false);
	});

	it('the symbol "O!H17" should return false', () => {
		expect(symbolParser.getIsFutureSpread('O!H17')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', () => {
		expect(symbolParser.getIsFutureSpread('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', () => {
		expect(symbolParser.getIsFutureSpread('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', () => {
		expect(symbolParser.getIsFutureSpread('^EURUSD')).toEqual(false);
	});

	it('the symbol "-001A" should return false', () => {
		expect(symbolParser.getIsFutureSpread('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', () => {
		expect(symbolParser.getIsFutureSpread('$DOWI')).toEqual(false);
	});

	it('the symbol "$S1GE" should return false', () => {
		expect(symbolParser.getIsFutureSpread('$S1GE')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return true', () => {
		expect(symbolParser.getIsFutureSpread('_S_SP_ZCH7_ZCK7')).toEqual(true);
	});

	it('the symbol "ESZ2660Q" should return false', () => {
		expect(symbolParser.getIsFutureSpread('ESZ2660Q')).toEqual(false);
	});

	it('the symbol "ZWH9|470C" should return false', () => {
		expect(symbolParser.getIsFutureSpread('ZWH9|470C')).toEqual(false);
	});

	it('the symbol "BB1F8|12050C" should return false', () => {
		expect(symbolParser.getIsFutureSpread('BB1F8|12050C')).toEqual(false);
	});

	it('the symbol "ZWK18465C" should return false', () => {
		expect(symbolParser.getIsFutureSpread('ZWK18465C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00C" should return false', () => {
		expect(symbolParser.getIsFutureSpread('PLATTS:AAVSV00C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00" should return false', () => {
		expect(symbolParser.getIsFutureSpread('PLATTS:AAVSV00')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(symbolParser.getIsFutureSpread('ZCPAUS.CM')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a future option', () => {
	it('the symbol "ESZ6" should return false', () => {
		expect(symbolParser.getIsFutureOption('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', () => {
		expect(symbolParser.getIsFutureOption('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', () => {
		expect(symbolParser.getIsFutureOption('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', () => {
		expect(symbolParser.getIsFutureOption('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', () => {
		expect(symbolParser.getIsFutureOption('O!H7')).toEqual(false);
	});

	it('the symbol "O!H17" should return false', () => {
		expect(symbolParser.getIsFutureOption('O!H17')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', () => {
		expect(symbolParser.getIsFutureOption('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', () => {
		expect(symbolParser.getIsFutureOption('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', () => {
		expect(symbolParser.getIsFutureOption('^EURUSD')).toEqual(false);
	});

	it('the symbol "-001A" should return false', () => {
		expect(symbolParser.getIsFutureOption('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', () => {
		expect(symbolParser.getIsFutureOption('$DOWI')).toEqual(false);
	});

	it('the symbol "$S1GE" should return false', () => {
		expect(symbolParser.getIsFutureOption('$S1GE')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
		expect(symbolParser.getIsFutureOption('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});

	it('the symbol "ESZ2660Q" should return true', () => {
		expect(symbolParser.getIsFutureOption('ESZ2660Q')).toEqual(true);
	});

	it('the symbol "ZWH9|470C" should return true', () => {
		expect(symbolParser.getIsFutureOption('ZWH9|470C')).toEqual(true);
	});

	it('the symbol "BB1F8|12050C" should return true', () => {
		expect(symbolParser.getIsFutureOption('BB1F8|12050C')).toEqual(true);
	});

	it('the symbol "ZWK18465C" should return true', () => {
		expect(symbolParser.getIsFutureOption('ZWK18465C')).toEqual(true);
	});

	it('the symbol "PLATTS:AAVSV00C" should return false', () => {
		expect(symbolParser.getIsFutureOption('PLATTS:AAVSV00C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00" should return false', () => {
		expect(symbolParser.getIsFutureOption('PLATTS:AAVSV00')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(symbolParser.getIsFutureOption('ZCPAUS.CM')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a cmdty index option', () => {
	it('the symbol "ESZ6" should return false', () => {
		expect(symbolParser.getIsCmdty('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', () => {
		expect(symbolParser.getIsCmdty('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', () => {
		expect(symbolParser.getIsCmdty('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', () => {
		expect(symbolParser.getIsCmdty('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', () => {
		expect(symbolParser.getIsCmdty('O!H7')).toEqual(false);
	});

	it('the symbol "O!H17" should return false', () => {
		expect(symbolParser.getIsCmdty('O!H17')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', () => {
		expect(symbolParser.getIsCmdty('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', () => {
		expect(symbolParser.getIsCmdty('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', () => {
		expect(symbolParser.getIsCmdty('^EURUSD')).toEqual(false);
	});

	it('the symbol "-001A" should return false', () => {
		expect(symbolParser.getIsCmdty('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', () => {
		expect(symbolParser.getIsCmdty('$DOWI')).toEqual(false);
	});

	it('the symbol "$S1GE" should return false', () => {
		expect(symbolParser.getIsCmdty('$S1GE')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
		expect(symbolParser.getIsCmdty('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});

	it('the symbol "ESZ2660Q" should return false', () => {
		expect(symbolParser.getIsCmdty('ESZ2660Q')).toEqual(false);
	});

	it('the symbol "ZWH9|470C" should return false', () => {
		expect(symbolParser.getIsCmdty('ZWH9|470C')).toEqual(false);
	});

	it('the symbol "BB1F8|12050C" should return false', () => {
		expect(symbolParser.getIsCmdty('BB1F8|12050C')).toEqual(false);
	});

	it('the symbol "ZWK18465C" should return false', () => {
		expect(symbolParser.getIsCmdty('ZWK18465C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00C" should return false', () => {
		expect(symbolParser.getIsCmdty('PLATTS:AAVSV00C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00" should return false', () => {
		expect(symbolParser.getIsCmdty('PLATTS:AAVSV00')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return true', () => {
		expect(symbolParser.getIsCmdty('ZCPAUS.CM')).toEqual(true);
	});
});

describe('When checking to see if a symbol is a BATS listing', () => {
	it('the symbol "IBM" should return false', () => {
		expect(symbolParser.getIsBats('IBM')).toEqual(false);
	});

	it('the symbol "IBM.BZ" should return true', () => {
		expect(symbolParser.getIsBats('IBM.BZ')).toEqual(true);
	});
});

describe('When checking the display format for the symbol ', () => {
	it('The symbol "HPIUSA.RP" should not be formatted as a percent', () => {
		expect(symbolParser.displayUsingPercent('HPIUSA.RP')).toEqual(false);
	});

	it('The symbol "UERMNTUS.RT" should be formatted as a percent', () => {
		expect(symbolParser.displayUsingPercent('UERMNTUS.RT')).toEqual(true);
	});
});

describe('When getting a producer symbol', () => {
	it('TSLA should map to TSLA', () => {
		expect(symbolParser.getProducerSymbol('TSLA')).toEqual('TSLA');
	});

	it('TSLA.BZ should map to TSLA.BZ', () => {
		expect(symbolParser.getProducerSymbol('TSLA.BZ')).toEqual('TSLA.BZ');
	});

	it('ESZ6 should map to ESZ6', () => {
		expect(symbolParser.getProducerSymbol('ESZ6')).toEqual('ESZ6');
	});

	it('ESZ16 should map to ESZ6', () => {
		expect(symbolParser.getProducerSymbol('ESZ16')).toEqual('ESZ6');
	});

	it('ESZ2016 should map to ESZ6', () => {
		expect(symbolParser.getProducerSymbol('ESZ16')).toEqual('ESZ6');
	});

	it('ES*0 should map to ES*0', () => {
		expect(symbolParser.getProducerSymbol('ES*0')).toEqual('ES*0');
	});

	it('$DOWI should map to $DOWI', () => {
		expect(symbolParser.getProducerSymbol('$DOWI')).toEqual('$DOWI');
	});

	it('^EURUSD should map to ^EURUSD', () => {
		expect(symbolParser.getProducerSymbol('^EURUSD')).toEqual('^EURUSD');
	});

	it('ZWK465C should map to ZWK465C', () => {
		expect(symbolParser.getProducerSymbol('ZWK465C')).toEqual('ZWK465C');
	});

	it('ZWK19465C should map to ZWK465C', () => {
		expect(symbolParser.getProducerSymbol('ZWK19465C')).toEqual('ZWK465C');
	});

	it('ZWK0|465P should map to ZWK465Q', () => {
		expect(symbolParser.getProducerSymbol('ZWK0|465P')).toEqual('ZWK465Q');
	});

	it('BZ6N8|25C should map to BZ6N8|25C', () => {
		expect(symbolParser.getProducerSymbol('BZ6N8|25C')).toEqual('BZ6N8|25C');
	});

	it('BZ6N9|25P should map to BZ6N9|25P', () => {
		expect(symbolParser.getProducerSymbol('BZ6N9|25P')).toEqual('BZ6N9|25P');
	});

	it('BZ6N20|25P should map to BZ6N20|25P', () => {
		expect(symbolParser.getProducerSymbol('BZ6N20|25P')).toEqual('BZ6N0|25P');
	});

	it('PLATTS:AAVSV00 should map to PLATTS:AAVSV00', () => {
		expect(symbolParser.getProducerSymbol('PLATTS:AAVSV00')).toEqual('PLATTS:AAVSV00');
	});
});

},{"./../../../lib/util/symbolParser":13}],35:[function(require,module,exports){
let timeFormatter = require('./../../../lib/util/timeFormatter');

describe('When a time formatter is created (without specifying the clock)', () => {
	let tf;

	beforeEach(() => {
		tf = timeFormatter();
	});

	describe('and a quote is formatted (with no "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "00:00:00"', () => {
				expect(tf.format(quote)).toEqual('00:00:00');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00:00"', () => {
				expect(tf.format(quote)).toEqual('12:00:00');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08:09"', () => {
				expect(tf.format(quote)).toEqual('07:08:09');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "13:08:09"', () => {
				expect(tf.format(quote)).toEqual('13:08:09');
			});
		});

		describe('and the quote time is 1:08:09 PM and timezone is present', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
				quote.timezone = 'CST';
			});

			it('the formatter outputs "13:08:09"', () => {
				expect(tf.format(quote)).toEqual('13:08:09 CST');
			});
		});
	});

	describe('and a quote is formatted (with with a "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456,
				flag: 'p'
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});
	});

	describe('and a quote is formatted (with with no "flag" and a "lastPrice" value and a "sessionT" indicator)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456,
				sessionT: true
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});
	});
});

describe('When a time formatter is created (and a 24-hour clock is specified)', () => {
	let tf;

	beforeEach(() => {
		tf = timeFormatter(false);
	});

	describe('and a quote is formatted (with no "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "00:00:00"', () => {
				expect(tf.format(quote)).toEqual('00:00:00');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00:00"', () => {
				expect(tf.format(quote)).toEqual('12:00:00');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08:09"', () => {
				expect(tf.format(quote)).toEqual('07:08:09');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "13:08:09"', () => {
				expect(tf.format(quote)).toEqual('13:08:09');
			});
		});

		describe('and the quote time is 1:08:09 PM and a timezone is present', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
				quote.timezone = 'EDT';
			});

			it('the formatter outputs "13:08:09"', () => {
				expect(tf.format(quote)).toEqual('13:08:09 EDT');
			});
		});
	});

	describe('and a quote is formatted (with with a "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456,
				flag: 'p'
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});
	});
});

describe('When a time formatter is created (and a "short" 24-hour clock is specified)', () => {
	let tf;

	beforeEach(() => {
		tf = timeFormatter(false, true);
	});

	describe('and a quote is formatted (with no "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "00:00"', () => {
				expect(tf.format(quote)).toEqual('00:00');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00"', () => {
				expect(tf.format(quote)).toEqual('12:00');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08"', () => {
				expect(tf.format(quote)).toEqual('07:08');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "13:08"', () => {
				expect(tf.format(quote)).toEqual('13:08');
			});
		});

		describe('and the quote time is 1:08:09 PM and a timezone is present', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
				quote.timezone = 'EDT';
			});

			it('the formatter outputs "13:08"', () => {
				expect(tf.format(quote)).toEqual('13:08 EDT');
			});
		});
	});

	describe('and a quote is formatted (with with a "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456,
				flag: 'p'
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});
	});
});

describe('When a time formatter is created (and a 12-hour clock is specified)', () => {
	let tf;

	beforeEach(() => {
		tf = timeFormatter(true);
	});

	describe('and a quote is formatted (with no "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "12:00:00 AM"', () => {
				expect(tf.format(quote)).toEqual('12:00:00 AM');
			});
		});

		describe('and the quote time is five after midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 5, 0);
			});

			it('the formatter outputs "12:05:00 AM"', () => {
				expect(tf.format(quote)).toEqual('12:05:00 AM');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00:00 PM"', () => {
				expect(tf.format(quote)).toEqual('12:00:00 PM');
			});
		});

		describe('and the quote time is ten after noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 10, 0);
			});

			it('the formatter outputs "12:10:00 PM"', () => {
				expect(tf.format(quote)).toEqual('12:10:00 PM');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08:09 AM"', () => {
				expect(tf.format(quote)).toEqual('07:08:09 AM');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "01:08:09 PM"', () => {
				expect(tf.format(quote)).toEqual('01:08:09 PM');
			});
		});
	});

	describe('and a quote is formatted (with with a "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456,
				flag: 'p'
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});
	});
});

describe('When a time formatter is created (and a "short" 12-hour clock is specified)', () => {
	let tf;

	beforeEach(() => {
		tf = timeFormatter(true, true);
	});

	describe('and a quote is formatted (with no "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "12:00A"', () => {
				expect(tf.format(quote)).toEqual('12:00A');
			});
		});

		describe('and the quote time is five after midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 5, 0);
			});

			it('the formatter outputs "12:05A"', () => {
				expect(tf.format(quote)).toEqual('12:05A');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00P"', () => {
				expect(tf.format(quote)).toEqual('12:00P');
			});
		});

		describe('and the quote time is ten after noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 10, 0);
			});

			it('the formatter outputs "12:10P"', () => {
				expect(tf.format(quote)).toEqual('12:10P');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08A"', () => {
				expect(tf.format(quote)).toEqual('07:08A');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "01:08P"', () => {
				expect(tf.format(quote)).toEqual('01:08P');
			});
		});
	});

	describe('and a quote is formatted (with with a "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456,
				flag: 'p'
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(tf.format(quote)).toEqual('05/03/16');
			});
		});
	});
});

},{"./../../../lib/util/timeFormatter":14}],36:[function(require,module,exports){
const baseCodeToUnitCode = require('./../../../../lib/utilities/convert/baseCodeToUnitCode');

describe('When converting a baseCode to a unitCode', () => {
	it('-1 should translate to "2"', () => {
		expect(baseCodeToUnitCode(-1)).toEqual('2');
	});

	it('-2 should translate to "3"', () => {
		expect(baseCodeToUnitCode(-2)).toEqual('3');
	});

	it('-3 should translate to "4"', () => {
		expect(baseCodeToUnitCode(-3)).toEqual('4');
	});

	it('-4 should translate to "5"', () => {
		expect(baseCodeToUnitCode(-4)).toEqual('5');
	});

	it('-5 should translate to "6"', () => {
		expect(baseCodeToUnitCode(-5)).toEqual('6');
	});

	it('-6 should translate to "7"', () => {
		expect(baseCodeToUnitCode(-6)).toEqual('7');
	});

	it('0 should translate to "8"', () => {
		expect(baseCodeToUnitCode(0)).toEqual('8');
	});

	it('1 should translate to "9"', () => {
		expect(baseCodeToUnitCode(1)).toEqual('9');
	});

	it('2 should translate to "A"', () => {
		expect(baseCodeToUnitCode(2)).toEqual('A');
	});

	it('3 should translate to "B"', () => {
		expect(baseCodeToUnitCode(3)).toEqual('B');
	});

	it('4 should translate to "C"', () => {
		expect(baseCodeToUnitCode(4)).toEqual('C');
	});

	it('5 should translate to "D"', () => {
		expect(baseCodeToUnitCode(5)).toEqual('D');
	});

	it('6 should translate to "E"', () => {
		expect(baseCodeToUnitCode(6)).toEqual('E');
	});

	it('7 should translate to "F"', () => {
		expect(baseCodeToUnitCode(7)).toEqual('F');
	});

	it('"-1" should translate to 0', () => {
		expect(baseCodeToUnitCode("-1")).toEqual(0);
	});

	it('A null value should translate to 0', () => {
		expect(baseCodeToUnitCode(null)).toEqual(0);
	});

	it('An undefined value should translate to 0', () => {
		expect(baseCodeToUnitCode(undefined)).toEqual(0);
	});
});

},{"./../../../../lib/utilities/convert/baseCodeToUnitCode":15}],37:[function(require,module,exports){
const dateToDayCode = require('./../../../../lib/utilities/convert/dateToDayCode');

describe('When converting a date instance to a day code', () => {
	it('"Jan 1, 2016" should translate to 1', () => {
		expect(dateToDayCode(new Date(2016, 0, 1))).toEqual('1');
	});

	it('"Jan 2, 2016" should translate to 2', () => {
		expect(dateToDayCode(new Date(2016, 0, 2))).toEqual('2');
	});

	it('"Jan 3, 2016" should translate to 3', () => {
		expect(dateToDayCode(new Date(2016, 0, 3))).toEqual('3');
	});

	it('"Jan 4, 2016" should translate to 4', () => {
		expect(dateToDayCode(new Date(2016, 0, 4))).toEqual('4');
	});

	it('"Jan 5, 2016" should translate to 5', () => {
		expect(dateToDayCode(new Date(2016, 0, 5))).toEqual('5');
	});

	it('"Jan 6, 2016" should translate to 6', () => {
		expect(dateToDayCode(new Date(2016, 0, 6))).toEqual('6');
	});

	it('"Jan 7, 2016" should translate to 7', () => {
		expect(dateToDayCode(new Date(2016, 0, 7))).toEqual('7');
	});

	it('"Jan 8, 2016" should translate to 8', () => {
		expect(dateToDayCode(new Date(2016, 0, 8))).toEqual('8');
	});

	it('"Jan 9, 2016" should translate to 9', () => {
		expect(dateToDayCode(new Date(2016, 0, 9))).toEqual('9');
	});

	it('"Jan 10, 2016" should translate to 0', () => {
		expect(dateToDayCode(new Date(2016, 0, 10))).toEqual('0');
	});

	it('"Jan 11, 2016" should translate to A', () => {
		expect(dateToDayCode(new Date(2016, 0, 11))).toEqual('A');
	});

	it('"Jan 12, 2016" should translate to B', () => {
		expect(dateToDayCode(new Date(2016, 0, 12))).toEqual('B');
	});

	it('"Jan 13, 2016" should translate to C', () => {
		expect(dateToDayCode(new Date(2016, 0, 13))).toEqual('C');
	});

	it('"Jan 14, 2016" should translate to D', () => {
		expect(dateToDayCode(new Date(2016, 0, 14))).toEqual('D');
	});

	it('"Jan 15, 2016" should translate to E', () => {
		expect(dateToDayCode(new Date(2016, 0, 15))).toEqual('E');
	});

	it('"Jan 16, 2016" should translate to F', () => {
		expect(dateToDayCode(new Date(2016, 0, 16))).toEqual('F');
	});

	it('"Jan 17, 2016" should translate to G', () => {
		expect(dateToDayCode(new Date(2016, 0, 17))).toEqual('G');
	});

	it('"Jan 18, 2016" should translate to H', () => {
		expect(dateToDayCode(new Date(2016, 0, 18))).toEqual('H');
	});

	it('"Jan 19, 2016" should translate to I', () => {
		expect(dateToDayCode(new Date(2016, 0, 19))).toEqual('I');
	});

	it('"Jan 20, 2016" should translate to J', () => {
		expect(dateToDayCode(new Date(2016, 0, 20))).toEqual('J');
	});

	it('"Jan 21, 2016" should translate to K', () => {
		expect(dateToDayCode(new Date(2016, 0, 21))).toEqual('K');
	});

	it('"Jan 22, 2016" should translate to L', () => {
		expect(dateToDayCode(new Date(2016, 0, 22))).toEqual('L');
	});

	it('"Jan 23, 2016" should translate to M', () => {
		expect(dateToDayCode(new Date(2016, 0, 23))).toEqual('M');
	});

	it('"Jan 24, 2016" should translate to N', () => {
		expect(dateToDayCode(new Date(2016, 0, 24))).toEqual('N');
	});

	it('"Jan 25, 2016" should translate to O', () => {
		expect(dateToDayCode(new Date(2016, 0, 25))).toEqual('O');
	});

	it('"Jan 26, 2016" should translate to P', () => {
		expect(dateToDayCode(new Date(2016, 0, 26))).toEqual('P');
	});

	it('"Jan 27, 2016" should translate to Q', () => {
		expect(dateToDayCode(new Date(2016, 0, 27))).toEqual('Q');
	});

	it('"Jan 28, 2016" should translate to R', () => {
		expect(dateToDayCode(new Date(2016, 0, 28))).toEqual('R');
	});

	it('"Jan 29, 2016" should translate to S', () => {
		expect(dateToDayCode(new Date(2016, 0, 29))).toEqual('S');
	});

	it('"Jan 30, 2016" should translate to T', () => {
		expect(dateToDayCode(new Date(2016, 0, 30))).toEqual('T');
	});

	it('"Jan 31, 2016" should translate to U', () => {
		expect(dateToDayCode(new Date(2016, 0, 31))).toEqual('U');
	});

	it('A null value should translate to a null value', () => {
		expect(dateToDayCode(null)).toEqual(null);
	});

	it('A undefined value should translate to a null value', () => {
		expect(dateToDayCode(null)).toEqual(null);
	});
});

},{"./../../../../lib/utilities/convert/dateToDayCode":16}],38:[function(require,module,exports){
const dayCodeToNumber = require('./../../../../lib/utilities/convert/dayCodeToNumber');

describe('When converting a dayCode to number', () => {
	it('"1" should translate to 1', () => {
		expect(dayCodeToNumber("1")).toEqual(1);
	});

	it('"2" should translate to 2', () => {
		expect(dayCodeToNumber("2")).toEqual(2);
	});

	it('"3" should translate to 3', () => {
		expect(dayCodeToNumber("3")).toEqual(3);
	});

	it('"4" should translate to 4', () => {
		expect(dayCodeToNumber("4")).toEqual(4);
	});

	it('"5" should translate to 5', () => {
		expect(dayCodeToNumber("5")).toEqual(5);
	});

	it('"6" should translate to 6', () => {
		expect(dayCodeToNumber("6")).toEqual(6);
	});

	it('"7" should translate to 7', () => {
		expect(dayCodeToNumber("7")).toEqual(7);
	});

	it('"8" should translate to 8', () => {
		expect(dayCodeToNumber("8")).toEqual(8);
	});

	it('"9" should translate to 9', () => {
		expect(dayCodeToNumber("9")).toEqual(9);
	});

	it('"0" should translate to 10', () => {
		expect(dayCodeToNumber("0")).toEqual(10);
	});

	it('"A" should translate to 11', () => {
		expect(dayCodeToNumber("A")).toEqual(11);
	});

	it('"a" should translate to 11', () => {
		expect(dayCodeToNumber("a")).toEqual(11);
	});

	it('"B" should translate to 12', () => {
		expect(dayCodeToNumber("B")).toEqual(12);
	});

	it('"b" should translate to 12', () => {
		expect(dayCodeToNumber("b")).toEqual(12);
	});

	it('"C" should translate to 13', () => {
		expect(dayCodeToNumber("C")).toEqual(13);
	});

	it('"c" should translate to 13', () => {
		expect(dayCodeToNumber("c")).toEqual(13);
	});

	it('"D" should translate to 14', () => {
		expect(dayCodeToNumber("D")).toEqual(14);
	});

	it('"d" should translate to 14', () => {
		expect(dayCodeToNumber("d")).toEqual(14);
	});

	it('"E" should translate to 15', () => {
		expect(dayCodeToNumber("E")).toEqual(15);
	});

	it('"e" should translate to 15', () => {
		expect(dayCodeToNumber("e")).toEqual(15);
	});

	it('"F" should translate to 16', () => {
		expect(dayCodeToNumber("F")).toEqual(16);
	});

	it('"f" should translate to 16', () => {
		expect(dayCodeToNumber("f")).toEqual(16);
	});

	it('"G" should translate to 17', () => {
		expect(dayCodeToNumber("G")).toEqual(17);
	});

	it('"g" should translate to 17', () => {
		expect(dayCodeToNumber("g")).toEqual(17);
	});

	it('"H" should translate to 18', () => {
		expect(dayCodeToNumber("H")).toEqual(18);
	});

	it('"h" should translate to 18', () => {
		expect(dayCodeToNumber("h")).toEqual(18);
	});

	it('"I" should translate to 19', () => {
		expect(dayCodeToNumber("I")).toEqual(19);
	});

	it('"i" should translate to 19', () => {
		expect(dayCodeToNumber("i")).toEqual(19);
	});

	it('"J" should translate to 20', () => {
		expect(dayCodeToNumber("J")).toEqual(20);
	});

	it('"j" should translate to 20', () => {
		expect(dayCodeToNumber("j")).toEqual(20);
	});

	it('"K" should translate to 21', () => {
		expect(dayCodeToNumber("K")).toEqual(21);
	});

	it('"k" should translate to 21', () => {
		expect(dayCodeToNumber("k")).toEqual(21);
	});

	it('"L" should translate to 22', () => {
		expect(dayCodeToNumber("L")).toEqual(22);
	});

	it('"l" should translate to 22', () => {
		expect(dayCodeToNumber("l")).toEqual(22);
	});

	it('"M" should translate to 23', () => {
		expect(dayCodeToNumber("M")).toEqual(23);
	});

	it('"m" should translate to 23', () => {
		expect(dayCodeToNumber("m")).toEqual(23);
	});

	it('"N" should translate to 24', () => {
		expect(dayCodeToNumber("N")).toEqual(24);
	});

	it('"n" should translate to 24', () => {
		expect(dayCodeToNumber("n")).toEqual(24);
	});

	it('"O" should translate to 25', () => {
		expect(dayCodeToNumber("O")).toEqual(25);
	});

	it('"o" should translate to 25', () => {
		expect(dayCodeToNumber("o")).toEqual(25);
	});

	it('"P" should translate to 26', () => {
		expect(dayCodeToNumber("P")).toEqual(26);
	});

	it('"p" should translate to 26', () => {
		expect(dayCodeToNumber("p")).toEqual(26);
	});

	it('"Q" should translate to 27', () => {
		expect(dayCodeToNumber("Q")).toEqual(27);
	});

	it('"q" should translate to 27', () => {
		expect(dayCodeToNumber("q")).toEqual(27);
	});

	it('"R" should translate to 28', () => {
		expect(dayCodeToNumber("R")).toEqual(28);
	});

	it('"r" should translate to 28', () => {
		expect(dayCodeToNumber("r")).toEqual(28);
	});

	it('"S" should translate to 29', () => {
		expect(dayCodeToNumber("S")).toEqual(29);
	});

	it('"s" should translate to 29', () => {
		expect(dayCodeToNumber("s")).toEqual(29);
	});

	it('"T" should translate to 30', () => {
		expect(dayCodeToNumber("T")).toEqual(30);
	});

	it('"t" should translate to 30', () => {
		expect(dayCodeToNumber("t")).toEqual(30);
	});

	it('"U" should translate to 31', () => {
		expect(dayCodeToNumber("U")).toEqual(31);
	});

	it('"u" should translate to 31', () => {
		expect(dayCodeToNumber("u")).toEqual(31);
	});

	it('A null value should translate to a null value', () => {
		expect(dayCodeToNumber(null)).toEqual(null);
	});

	it('A undefined value should translate to a null value', () => {
		expect(dayCodeToNumber(null)).toEqual(null);
	});

	it('A zero-length string should translate to a null value', () => {
		expect(dayCodeToNumber('')).toEqual(null);
	});
});

},{"./../../../../lib/utilities/convert/dayCodeToNumber":17}],39:[function(require,module,exports){
const dayNumberToDayCode = require('./../../../../lib/utilities/convert/dayNumberToDayCode');

describe('When converting a day number to a dayCode', () => {
	it('1 should translate to "1"', () => {
		expect(dayNumberToDayCode(1)).toEqual("1");
	});

	it('2 should translate to "2"', () => {
		expect(dayNumberToDayCode(2)).toEqual("2");
	});

	it('3 should translate to "3"', () => {
		expect(dayNumberToDayCode(3)).toEqual("3");
	});

	it('4 should translate to "4"', () => {
		expect(dayNumberToDayCode(4)).toEqual("4");
	});

	it('5 should translate to "5"', () => {
		expect(dayNumberToDayCode(5)).toEqual("5");
	});

	it('6 should translate to "6"', () => {
		expect(dayNumberToDayCode(6)).toEqual("6");
	});

	it('7 should translate to "7"', () => {
		expect(dayNumberToDayCode(7)).toEqual("7");
	});

	it('8 should translate to "8"', () => {
		expect(dayNumberToDayCode(8)).toEqual("8");
	});

	it('9 should translate to "9"', () => {
		expect(dayNumberToDayCode(9)).toEqual("9");
	});

	it('0 should translate to "0"', () => {
		expect(dayNumberToDayCode(10)).toEqual("0");
	});

	it('11 should translate to "A"', () => {
		expect(dayNumberToDayCode(11)).toEqual("A");
	});

	it('12 should translate to "B"', () => {
		expect(dayNumberToDayCode(12)).toEqual("B");
	});

	it('13 should translate to "C"', () => {
		expect(dayNumberToDayCode(13)).toEqual("C");
	});

	it('14 should translate to "D"', () => {
		expect(dayNumberToDayCode(14)).toEqual("D");
	});

	it('15 should translate to "E"', () => {
		expect(dayNumberToDayCode(15)).toEqual("E");
	});

	it('16 should translate to "F"', () => {
		expect(dayNumberToDayCode(16)).toEqual("F");
	});

	it('17 should translate to "G"', () => {
		expect(dayNumberToDayCode(17)).toEqual("G");
	});

	it('18 should translate to "H"', () => {
		expect(dayNumberToDayCode(18)).toEqual("H");
	});

	it('19 should translate to "I"', () => {
		expect(dayNumberToDayCode(19)).toEqual("I");
	});

	it('20 should translate to "J"', () => {
		expect(dayNumberToDayCode(20)).toEqual("J");
	});

	it('21 should translate to "K"', () => {
		expect(dayNumberToDayCode(21)).toEqual("K");
	});

	it('22 should translate to "L"', () => {
		expect(dayNumberToDayCode(22)).toEqual("L");
	});

	it('23 should translate to "M"', () => {
		expect(dayNumberToDayCode(23)).toEqual("M");
	});

	it('24 should translate to "N"', () => {
		expect(dayNumberToDayCode(24)).toEqual("N");
	});

	it('25 should translate to "O"', () => {
		expect(dayNumberToDayCode(25)).toEqual("O");
	});

	it('26 should translate to "P"', () => {
		expect(dayNumberToDayCode(26)).toEqual("P");
	});

	it('27 should translate to "Q"', () => {
		expect(dayNumberToDayCode(27)).toEqual("Q");
	});

	it('28 should translate to "R"', () => {
		expect(dayNumberToDayCode(28)).toEqual("R");
	});

	it('29 should translate to "S"', () => {
		expect(dayNumberToDayCode(29)).toEqual("S");
	});

	it('30 should translate to "T"', () => {
		expect(dayNumberToDayCode(30)).toEqual("T");
	});

	it('31 should translate to "U"', () => {
		expect(dayNumberToDayCode(31)).toEqual("U");
	});

	it('A null value should translate to a null value', () => {
		expect(dayNumberToDayCode(null)).toEqual(null);
	});

	it('A undefined value should translate to a null value', () => {
		expect(dayNumberToDayCode(null)).toEqual(null);
	});
});

},{"./../../../../lib/utilities/convert/dayNumberToDayCode":18}],40:[function(require,module,exports){
const unitCodeToBaseCode = require('./../../../../lib/utilities/convert/unitCodeToBaseCode');

describe('When converting a unitCode to a baseCode', () => {
	it('"2" should translate to -1', () => {
		expect(unitCodeToBaseCode("2")).toEqual(-1);
	});

	it('"3" should translate to -2', () => {
		expect(unitCodeToBaseCode("3")).toEqual(-2);
	});

	it('"4" should translate to -3', () => {
		expect(unitCodeToBaseCode("4")).toEqual(-3);
	});

	it('"5" should translate to -4', () => {
		expect(unitCodeToBaseCode("5")).toEqual(-4);
	});

	it('"6" should translate to -5', () => {
		expect(unitCodeToBaseCode("6")).toEqual(-5);
	});

	it('"7" should translate to -6', () => {
		expect(unitCodeToBaseCode("7")).toEqual(-6);
	});

	it('"8" should translate to 0', () => {
		expect(unitCodeToBaseCode("8")).toEqual(0);
	});

	it('"9" should translate to 1', () => {
		expect(unitCodeToBaseCode("9")).toEqual(1);
	});

	it('"A" should translate to 1', () => {
		expect(unitCodeToBaseCode("A")).toEqual(2);
	});

	it('"B" should translate to 3', () => {
		expect(unitCodeToBaseCode("B")).toEqual(3);
	});

	it('"C" should translate to 4', () => {
		expect(unitCodeToBaseCode("C")).toEqual(4);
	});

	it('"D" should translate to 5', () => {
		expect(unitCodeToBaseCode("D")).toEqual(5);
	});

	it('"E" should translate to 6', () => {
		expect(unitCodeToBaseCode("E")).toEqual(6);
	});

	it('"F" should translate to 6', () => {
		expect(unitCodeToBaseCode("F")).toEqual(7);
	});

	it('2 should translate to ', () => {
		expect(unitCodeToBaseCode(2)).toEqual(0);
	});

	it('A null value should translate to 0', () => {
		expect(unitCodeToBaseCode(null)).toEqual(0);
	});

	it('An undefined value should translate to 0', () => {
		expect(unitCodeToBaseCode(undefined)).toEqual(0);
	});
});

},{"./../../../../lib/utilities/convert/unitCodeToBaseCode":19}],41:[function(require,module,exports){
const parseMessage = require('../../../../../lib/utilities/parse/ddf/message');

describe('when parsing an XML refresh message', () => {
	'use strict';

	describe('for an instrument that has settled and has a postmarket (form-T) trade', () => {
		let x;

		beforeEach(() => {
			x = parseMessage(`%<QUOTE symbol="AAPL" name="Apple Inc" exchange="NASDAQ" basecode="A" pointvalue="1.0" tickincrement="1" ddfexchange="Q" flag="s" lastupdate="20160920163525" bid="11345" bidsize="10" ask="11352" asksize="1" mode="I">
					<SESSION day="J" session="R" timestamp="20160920171959" open="11305" high="11412" low="11251" last="11357" previous="11358" settlement="11357" tradesize="1382944" volume="36258067" numtrades="143218" pricevolume="3548806897.06" tradetime="20160920160000" ticks=".." id="combined"/>
					<SESSION day="I" timestamp="20160919000000" open="11519" high="11618" low="11325" last="11358" previous="11492" settlement="11358" volume="47010000" ticks=".." id="previous"/>
					<SESSION day="J" session="R" previous="11358" volume="13198" id="session_J_R"/>
					<SESSION day="J" session="T" timestamp="20160920172007" last="11355" previous="11358" tradesize="500" volume="656171" numtrades="1118" pricevolume="74390050.90" tradetime="20160920172007" ticks="+-" id="session_J_T"/>
					</QUOTE>`);
		});

		it('the "flag" should be "s"', () => {
			expect(x.flag).toEqual('s');
		});

		it('the "session" should not be "T"', () => {
			expect(x.session).toEqual('T');
		});

		it('the "sessionT" should be true', () => {
			expect(x.sessionT).toEqual(true);
		});

		it('the "lastPrice" should be 113.57', () => {
			expect(x.lastPrice).toEqual(113.57);
		});

		it('the "lastPriceT" should be 113.55', () => {
			expect(x.lastPriceT).toEqual(113.55);
		});

		it('the "volume" should come from the "combined" session', () => {
			expect(x.volume).toEqual(36258067);
		});
	});

	describe('for an instrument that is not settled, but has a postmarket (form-T) trade', () => {
		let x;

		beforeEach(() => {
			x = parseMessage(`%<QUOTE symbol="BAC" name="Bank of America Corp" exchange="NYSE" basecode="A" pointvalue="1.0" tickincrement="1" ddfexchange="N" lastupdate="20160920152208" bid="1558" bidsize="20" ask="1559" asksize="1" mode="I">
					<SESSION day="J" session="R" timestamp="20160920160021" open="1574" high="1576" low="1551" last="1560" previous="1559" tradesize="1483737" volume="67399368" numtrades="96903" pricevolume="1041029293.48" tradetime="20160920160021" ticks=".." id="combined"/>
					<SESSION day="I" timestamp="20160919000000" open="1555" high="1578" low="1555" last="1559" previous="1549" settlement="1559" volume="66174800" ticks=".." id="previous"/>
					<SESSION day="J" session="R" previous="1559" volume="1772" id="session_J_R"/>
					<SESSION day="J" session="T" timestamp="20160920160527" last="1559" previous="1559" tradesize="1175" volume="296998" numtrades="356" pricevolume="4652652.89" tradetime="20160920160527" ticks=".." id="session_J_T"/>
					</QUOTE>`);
		});

		it('the "flag" should not be "s"', () => {
			expect(x.flag).not.toEqual('s');
		});

		it('the "session" should not be "T"', () => {
			expect(x.session).not.toEqual('T');
		});

		it('the "sessionT" should be true', () => {
			expect(x.sessionT).toEqual(true);
		});

		it('the "lastPrice" should be 15.60', () => {
			expect(x.lastPrice).toEqual(15.60);
		});

		it('the "lastPriceT" should be 15.59', () => {
			expect(x.lastPriceT).toEqual(15.59);
		});

		it('the "volume" should come from the "combined" session', () => {
			expect(x.volume).toEqual(67399368);
		});
	});

	describe('for an instrument that has settled, but the form-T session is from the morning', () => {
		let x;

		beforeEach(() => {
			x = parseMessage(`%<QUOTE symbol="UDOW" name="Ultrapro DOW 30 Proshares" exchange="AMEX" basecode="A" pointvalue="1.0" tickincrement="1" ddfexchange="A" lastupdate="20170222103439" bid="10994" bidsize="16" ask="10997" asksize="8" mode="I" flag="s">
				<SESSION day="L" session="R" timestamp="20170222111751" open="10933" high="11032" low="10918" last="10993" previous="10993" tradesize="112" volume="87485" numtrades="357" pricevolume="8628142.83" tradetime="20170222111751" ticks="++" id="combined" settlement="10993"/>
				<SESSION day="K" timestamp="20170221000000" open="10921" high="11021" low="10889" last="10993" previous="10798" settlement="10993" volume="387500" ticks=".." id="previous"/>
				<SESSION day="L" session="R" previous="10993" id="session_L_R"/>
				<SESSION day="L" session="T" timestamp="20170222080456" last="10987" previous="10993" tradesize="200" volume="400" numtrades="3" pricevolume="43949.00" tradetime="20170222080456" ticks=".-" id="session_L_T"/>
				</QUOTE>`);
		});

		it('the "flag" should be "s"', () => {
			expect(x.flag).toEqual('s');
		});

		it('the "session" should be "T"', () => {
			expect(x.session).toEqual('T');
		});

		it('the "sessionT" should be false', () => {
			expect(x.sessionT).toEqual(false);
		});

		it('the "lastPrice" should be 109.93 (taken from "combined" session)', () => {
			expect(x.lastPrice).toEqual(109.93);
		});

		it('the "lastPriceT" should not be included', () => {
			expect(x.lastPriceT).not.toBeDefined();
		});

		it('the "tradeTime" should come from the "combined" session', () => {
			expect(x.tradeTime.getTime()).toEqual(new Date(2017, 1, 22, 11, 17, 51).getTime());
		});
	});

	describe('for an instrument that has not opened and has no form-T session', () => {
		let x;

		beforeEach(() => {
			x = parseMessage(`%<QUOTE symbol="BAC" name="Bank of America Corp" exchange="NYSE" basecode="A" pointvalue="1.0" tickincrement="1" ddfexchange="N" lastupdate="20160920152208" bid="1558" bidsize="20" ask="1559" asksize="1" mode="I">
					<SESSION day="J" session="R" timestamp="20160920160021" open="1574" high="1576" low="1551" previous="1559" tradesize="1483737" volume="67399368" numtrades="96903" pricevolume="1041029293.48" tradetime="20160920160021" ticks=".." id="combined"/>
					<SESSION day="I" timestamp="20160919000000" open="1555" high="1578" low="1555" last="1559" previous="1549" settlement="1559" volume="66174800" ticks=".." id="previous"/>
					</QUOTE>`);
		});

		it('the "previousPrice" should come from the "combined" session', () => {
			expect(x.previousPrice).toEqual(15.59);
		});
	});
});

describe('when parsing a DDF message', () => {
	'use strict';

	describe('for a 2,Z message for SIRI, 3@3.94', () => {
		let x;

		beforeEach(() => {
			x = parseMessage('\x012SIRI,Z AQ15394,3,1I');
		});

		it('the "record" should be "2"', () => {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "Z"', () => {
			expect(x.subrecord).toEqual('Z');
		});

		it('the "symbol" should be "SIRI"', () => {
			expect(x.symbol).toEqual('SIRI');
		});

		it('the "type" should be "TRADE_OUT_OF_SEQUENCE"', () => {
			expect(x.type).toEqual('TRADE_OUT_OF_SEQUENCE');
		});

		it('the "tradePrice" should be 3.94', () => {
			expect(x.tradePrice).toEqual(3.94);
		});

		it('the "tradeSize" should be 3', () => {
			expect(x.tradeSize).toEqual(3);
		});
	});

	describe('for a 2,Z message for SIRI, 2998262@3.95', () => {
		let x;

		beforeEach(() => {
			x = parseMessage('\x012SIRI,Z AQ15395,2998262,1W');
		});

		it('the "record" should be "2"', () => {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "Z"', () => {
			expect(x.subrecord).toEqual('Z');
		});

		it('the "symbol" should be "SIRI"', () => {
			expect(x.symbol).toEqual('SIRI');
		});

		it('the "type" should be "TRADE_OUT_OF_SEQUENCE"', () => {
			expect(x.type).toEqual('TRADE_OUT_OF_SEQUENCE');
		});

		it('the "tradePrice" should be 3.95', () => {
			expect(x.tradePrice).toEqual(3.95);
		});

		it('the "tradeSize" should be 2998262', () => {
			expect(x.tradeSize).toEqual(2998262);
		});
	});

	describe('for a 2,0 message for AAPL', () => {
		let x;

		beforeEach(() => {
			x = parseMessage('\x012AAPL,0\x02AQ1510885,D0M \x03\x14PHWQT@\x04$');
		});

		it('the "record" should be "2"', () => {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "0"', () => {
			expect(x.subrecord).toEqual('0');
		});

		it('the "symbol" should be "AAPL"', () => {
			expect(x.symbol).toEqual('AAPL');
		});

		it('the "type" should be "SETTLEMENT"', () => {
			expect(x.type).toEqual('SETTLEMENT');
		});

		it('the "value" should be 108.85', () => {
			expect(x.value).toEqual(108.85);
		});
	});

	describe('for a 2,Z message for TSLA', () => {
		let x;

		beforeEach(() => {
			x = parseMessage('\x012TSLA,Z\x02AQ1521201,3,TI\x03');
		});

		it('the "record" should be "2"', () => {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "Z"', () => {
			expect(x.subrecord).toEqual('Z');
		});

		it('the "symbol" should be "AAPL"', () => {
			expect(x.symbol).toEqual('TSLA');
		});

		it('the "type" should be "TRADE_OUT_OF_SEQUENCE"', () => {
			expect(x.type).toEqual('TRADE_OUT_OF_SEQUENCE');
		});

		it('the "tradePrice" should be "212.01"', () => {
			expect(x.tradePrice).toEqual(212.01);
		});

		it('the "day" should be "T"', () => {
			expect(x.day).toEqual('T');
		});

		it('the "session" should be "I"', () => {
			expect(x.session).toEqual('I');
		});
	});
});

},{"../../../../../lib/utilities/parse/ddf/message":20}],42:[function(require,module,exports){
const parseValue = require('../../../../../lib/utilities/parse/ddf/value');

describe('when parsing prices', () => {
	'use strict';

	describe('with a decimal fraction separator', () => {
		it('returns 0.75 (with unit code 2) when parsing ".75"', () => {
			expect(parseValue('.75', '2')).toEqual(0.75);
		});

		it('returns 377 (with unit code 2) when parsing "377.000"', () => {
			expect(parseValue('377.000', '2')).toEqual(377);
		});

		it('returns 377.5 (with unit code 2) when parsing "377.500"', () => {
			expect(parseValue('377.500', '2')).toEqual(377.5);
		});

		it('returns 377.75 (with unit code 2) when parsing "377.750"', () => {
			expect(parseValue('377.750', '2')).toEqual(377.75);
		});

		it('returns 3770.75 (with unit code 2) when parsing "3770.750"', () => {
			expect(parseValue('3770.750', '2')).toEqual(3770.75);
		});

		it('returns 37700.75 (with unit code 2) when parsing "37700.750"', () => {
			expect(parseValue('37700.750', '2')).toEqual(37700.75);
		});

		it('returns 377000.75 (with unit code 2) when parsing "377000.750"', () => {
			expect(parseValue('377000.750', '2')).toEqual(377000.75);
		});

		it('returns 3770000.75 (with unit code 2) when parsing "3770000.750"', () => {
			expect(parseValue('3770000.750', '2')).toEqual(3770000.75);
		});

		it('returns 3770000 (with unit code 2) when parsing "3770000.000"', () => {
			expect(parseValue('3770000.000', '2')).toEqual(3770000);
		});

		it('returns 0 (with unit code 2) when parsing "0.000"', () => {
			expect(parseValue('0.000', '2')).toEqual(0);
		});

		it('returns undefined (with unit code 2) when parsing zero-length string', () => {
			expect(parseValue('', '2')).toEqual(undefined);
		});

		it('returns 0 (with unit code 8) when parsing "0"', () => {
			expect(parseValue('0', '8')).toEqual(0);
		});

		it('returns 1000 (with unit code 8) when parsing "1000"', () => {
			expect(parseValue('1000', '8')).toEqual(1000);
		});
	});

	describe('with a decimal fraction separator and a comma thousands separator', () => {
		it('returns 0.75 (with unit code 2) when parsing ".75"', () => {
			expect(parseValue('.75', '2', ',')).toEqual(0.75);
		});

		it('returns 3770.75 (with unit code 2) when parsing "3,770.750"', () => {
			expect(parseValue('3,770.750', '2', ',')).toEqual(3770.75);
		});

		it('returns 37700.75 (with unit code 2) when parsing "37,700.750"', () => {
			expect(parseValue('37,700.750', '2', ',')).toEqual(37700.75);
		});

		it('returns 377000.75 (with unit code 2) when parsing "377,000.750"', () => {
			expect(parseValue('377,000.750', '2', ',')).toEqual(377000.75);
		});

		it('returns 3770000.75 (with unit code 2) when parsing "3,770,000.750"', () => {
			expect(parseValue('3,770,000.750', '2', ',')).toEqual(3770000.75);
		});

		it('returns 3770000 (with unit code 2) when parsing "3,770,000.000"', () => {
			expect(parseValue('3,770,000.000', '2', ',')).toEqual(3770000);
		});
	});

	describe('with a dash fraction separator', () => {
		it('returns 123 (with unit code 2) when parsing "123-0"', () => {
			expect(parseValue('123-0', '2')).toEqual(123);
		});

		it('returns 123.5 (with unit code 2) when parsing "123-4"', () => {
			expect(parseValue('123-4', '2')).toEqual(123.5);
		});

		it('returns 0.5 (with unit code 2) when parsing "0-4"', () => {
			expect(parseValue('0-4', '2')).toEqual(0.5);
		});

		it('returns 0 (with unit code 2) when parsing "0-0"', () => {
			expect(parseValue('0-0', '2')).toEqual(0);
		});

		it('returns undefined (with unit code 2) when parsing zero-length string', () => {
			expect(parseValue('', '2')).toEqual(undefined);
		});
	});

	describe('with a tick fraction separator', () => {
		it('returns 123 (with unit code 2) when parsing "123\'0"', () => {
			expect(parseValue('123\'0', '2')).toEqual(123);
		});

		it('returns 123.5 (with unit code 2) when parsing "123\'4"', () => {
			expect(parseValue('123\'4', '2')).toEqual(123.5);
		});

		it('returns 0.5 (with unit code 2) when parsing "0\'4"', () => {
			expect(parseValue('0\'4', '2')).toEqual(0.5);
		});

		it('returns 0 (with unit code 2) when parsing "0\'0"', () => {
			expect(parseValue('0\'0', '2')).toEqual(0);
		});

		it('returns undefined (with unit code 2) when parsing zero-length string', () => {
			expect(parseValue('', '2')).toEqual(undefined);
		});
	});
});

},{"../../../../../lib/utilities/parse/ddf/value":22}]},{},[27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42]);
