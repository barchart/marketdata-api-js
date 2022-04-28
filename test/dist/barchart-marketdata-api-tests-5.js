(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = (() => {
  'use strict';
  /**
   * An interface for writing log messages. An implementation of this
   * class is returned by {@link LoggerProvider.getLogger}.
   *
   * @public
   * @exported
   * @abstract
   */

  class Logger {
    constructor() {}
    /**
     * Writes a log message.
     *
     * @public
     * @abstract
     * @param {...Schema.Loggable}
     */


    log() {
      return;
    }
    /**
     * Writes a log message at "trace" level.
     *
     * @public
     * @abstract
     * @param {...Schema.Loggable}
     */


    trace() {
      return;
    }
    /**
     * Writes a log message at "debug" level.
     *
     * @public
     * @abstract
     * @param {...Schema.Loggable}
     */


    debug() {
      return;
    }
    /**
     * Writes a log message at "info" level.
     *
     * @public
     * @abstract
     * @param {...Schema.Loggable}
     */


    info() {
      return;
    }
    /**
     * Writes a log message at "warn" level.
     *
     * @public
     * @abstract
     * @param {...Schema.Loggable}
     */


    warn() {
      return;
    }
    /**
     * Writes a log message at "error" level.
     *
     * @public
     * @abstract
     * @param {...Schema.Loggable}
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

},{}],2:[function(require,module,exports){
const Logger = require('./Logger'),
      LoggerProvider = require('./LoggerProvider');

module.exports = (() => {
  'use strict';

  let __provider = null;
  /**
   * Container for static functions which control logging within the SDK.
   *
   * @public
   * @exported
   */

  class LoggerFactory {
    constructor() {}
    /**
     * Configures the SDK to write log messages to the console.
     *
     * @public
     * @static
     */


    static configureForConsole() {
      LoggerFactory.configure(new ConsoleLoggerProvider());
    }
    /**
     * Configures the SDK to mute all log messages.
     *
     * @public
     * @static
     */


    static configureForSilence() {
      LoggerFactory.configure(new EmptyLoggerProvider());
    }
    /**
     * Configures the library to delegate any log messages to a custom
     * implementation of the {@link LoggerProvider} class.
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
     * @returns {Logger}
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
      try {
        console.log.apply(console, arguments);
      } catch (e) {}
    }

    trace() {
      try {
        console.trace.apply(console, arguments);
      } catch (e) {}
    }

    debug() {
      try {
        console.debug.apply(console, arguments);
      } catch (e) {}
    }

    info() {
      try {
        console.info.apply(console, arguments);
      } catch (e) {}
    }

    warn() {
      try {
        console.warn.apply(console, arguments);
      } catch (e) {}
    }

    error() {
      try {
        console.error.apply(console, arguments);
      } catch (e) {}
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

    debug() {
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

},{"./Logger":1,"./LoggerProvider":3}],3:[function(require,module,exports){
module.exports = (() => {
  'use strict';
  /**
   * A contract for generating {@link Logger} instances. For custom logging
   * the SDK consumer should implement this class and pass it to the
   * {@link LoggerFactory.configure} function.
   *
   * @public
   * @exported
   * @abstract
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

},{}],4:[function(require,module,exports){
const object = require('@barchart/common-js/lang//object');

const LoggerFactory = require('./../logging/LoggerFactory');

module.exports = (() => {
  'use strict';

  let __logger = null;
  const events = {
    update: 'update',
    reset: 'reset'
  };
  /**
   * An aggregation of the total volume traded at each price level for a
   * single instrument, mutates as **CumulativeVolume** subscription updates
   * are processed (see {@link Enums.SubscriptionType}).
   *
   * @public
   * @exported
   */

  class CumulativeVolume {
    constructor(symbol, tickIncrement) {
      /**
       * @property {string} symbol - Symbol of the cumulative volume.
       * @public
       * @readonly
       */
      this.symbol = symbol;
      this._tickIncrement = tickIncrement;
      this._handlers = [];
      this._priceLevels = {};
      this._highPrice = null;
      this._lowPrice = null;

      if (__logger === null) {
        __logger = LoggerFactory.getLogger('@barchart/marketdata-api-js');
      }
    }
    /**
     * Registers an event handler for a given event. The following events are
     * supported:
     *
     * update -- when a new price level is added, or an existing price level mutates.
     * reset -- when all price levels are cleared.
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
        handler({
          container: this,
          event: events.reset
        });
      });
    }
    /**
     * Returns an array of all price levels. This is an expensive operation. Observing
     * an ongoing subscription is preferred (see {@link Connection#on}).
     *
     * @returns {Schema.VolumeLevel[]}
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
     * @returns {CumulativeVolume}
     */


    static clone(symbol, source) {
      const clone = new CumulativeVolume(symbol, source.getTickIncrement());
      source.toArray().forEach(priceLevel => {
        clone.incrementVolume(priceLevel.price, priceLevel.volume);
      });
      return clone;
    }

    toString() {
      return `[CumulativeVolume (symbol=${this.symbol})]`;
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
      __logger.error('An error was thrown by a cumulative volume observer.', e);
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

},{"./../logging/LoggerFactory":2,"@barchart/common-js/lang//object":36}],5:[function(require,module,exports){
const SymbolParser = require('./../utilities/parsers/SymbolParser'),
      buildPriceFormatter = require('../utilities/format/factories/price');

const AssetClass = require('./../utilities/data/AssetClass');

const cmdtyViewPriceFormatter = require('./../utilities/format/specialized/cmdtyView');

module.exports = (() => {
  'use strict';

  let profiles = {};
  let formatter = cmdtyViewPriceFormatter;
  /**
   * Describes an instrument (associated with a unique symbol).
   *
   * @public
   * @exported
   */

  class Profile {
    constructor(symbol, name, exchangeId, unitCode, pointValue, tickIncrement, exchange, additional) {
      /**
       * @property {string} symbol - Symbol of the instrument.
       * @public
       * @readonly
       */
      this.symbol = symbol;
      /**
       * @property {string} name - Name of the instrument.
       * @public
       * @readonly
       */

      this.name = name;
      /**
       * @property {string} exchange - Code for the listing exchange.
       * @public
       * @readonly
       */

      this.exchange = exchangeId;
      /**
       * @property {Exchange|null} exchangeRef - The {@link Exchange}.
       * @public
       * @readonly
       */

      this.exchangeRef = exchange || null;
      /**
       * @property {string} unitCode - Code indicating how a prices should be formatted.
       * @public
       * @readonly
       */

      this.unitCode = unitCode;
      /**
       * @property {string} pointValue - The change in value for a one point change in price.
       * @public
       * @readonly
       */

      this.pointValue = pointValue;
      /**
       * @property {number} tickIncrement - The minimum price movement.
       * @public
       * @readonly
       */

      this.tickIncrement = tickIncrement;
      const info = SymbolParser.parseInstrumentType(this.symbol);
      const future = info !== null && info.asset === AssetClass.FUTURE;
      const option = info !== null && info.asset === AssetClass.FUTURE_OPTION;

      if (future || option) {
        /**
         * @property {string|undefined} root - Root symbol (futures and futures options only).
         * @public
         * @readonly
         */
        this.root = info.root;

        if (future) {
          /**
           * @property {string|undefined} month - Month code (futures only).
           * @public
           * @readonly
           */
          this.month = info.month;
          /**
           * @property {number|undefined} year - Expiration year (futures only).
           * @public
           * @readonly
           */

          this.year = info.year;
          /**
           * @property {string|undefined} expiration - Expiration date, formatted as YYYY-MM-DD (futures only).
           * @public
           * @readonly
           */

          this.expiration = null;
          /**
           * @property {string|undefined} firstNotice - First notice date, formatted as YYYY-MM-DD (futures only).
           * @public
           * @readonly
           */

          this.firstNotice = null;
        }
      }
      /**
       * @property {AssetClass|null} asset - The instrument type (a.k.a. asset class). This will only be present when inference based on the instrument symbol is possible.
       * @public
       * @readonly
       */


      this.asset = null;

      if (info && info.asset) {
        this.asset = info.asset;
      }

      if (typeof additional === 'object' && additional !== null) {
        for (let p in additional) {
          this[p] = additional[p];
        }
      }

      profiles[symbol] = this;
    }
    /**
     * Given a price, returns a the human-readable string representation.
     *
     * @public
     * @param {number} price
     * @returns {string}
     */


    formatPrice(price) {
      return formatter(price, this.unitCode, this);
    }
    /**
     * Configures the logic used to format all prices using the {@link Profile#formatPrice} instance function.
     * Alternately, the {@link Profile.setPriceFormatterCustom} function can be used for complete control over
     * price formatting.
     *
     * @public
     * @static
     * @param {string} fractionSeparator - usually a dash or a period
     * @param {boolean} specialFractions - usually true
     * @param {string=} thousandsSeparator - usually a comma
     */


    static setPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator) {
      formatter = buildPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator);
    }
    /**
     * An alternative to {@link Profile.setPriceFormatter} which allows the consumer to specify
     * a function to format prices. Use of this function overrides the rules set using the
     * {link Profile.setPriceFormatter} function.
     *
     * @public
     * @static
     * @param {Callbacks.CustomPriceFormatterCallback} fn - The function to use for price formatting (which replaces the default logic).
     */


    static setPriceFormatterCustom(fn) {
      formatter = fn;
    }
    /**
     * Alias for the {@link Profile.setPriceFormatter} function.
     *
     * @public
     * @static
     * @ignore
     * @deprecated
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

    toString() {
      return `[Profile (symbol=${this.symbol})]`;
    }

  }

  return Profile;
})();

},{"../utilities/format/factories/price":18,"./../utilities/data/AssetClass":13,"./../utilities/format/specialized/cmdtyView":23,"./../utilities/parsers/SymbolParser":30}],6:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');

const UnitCode = require('./../data/UnitCode');

module.exports = (() => {
  'use strict';
  /**
   * Converts a Barchart "base" code into a Barchart "unit" code. If the "base"
   * code provided is invalid, the character '0' will be returned -- which is
   * not a valid unit code.
   *
   * @function
   * @memberOf Functions
   * @ignore
   * @param {Number} baseCode
   * @returns {String}
   */

  function convertBaseCodeToUnitCode(baseCode) {
    if (!is.number(baseCode)) {
      return '0';
    }

    const unitCodeItem = UnitCode.fromBaseCode(baseCode);
    return unitCodeItem === null ? '0' : unitCodeItem.unitCode;
  }

  return convertBaseCodeToUnitCode;
})();

},{"./../data/UnitCode":14,"@barchart/common-js/lang/is":35}],7:[function(require,module,exports){
const convertNumberToDayCode = require('./numberToDayCode');

module.exports = (() => {
  'use strict';
  /**
   * Extracts the day of the month from a {@link Date} instance
   * and returns the day code for the day of the month.
   *
   * @function
   * @memberOf Functions
   * @ignore
   * @param {Date} date
   * @returns {String|null}
   */

  function convertDateToDayCode(date) {
    if (date === null || date === undefined) {
      return null;
    }

    return convertNumberToDayCode(date.getDate());
  }

  return convertDateToDayCode;
})();

},{"./numberToDayCode":11}],8:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');

module.exports = (() => {
  'use strict';
  /**
   * Converts a day code (e.g. "A" ) to a day number (e.g. 11).
   *
   * @function
   * @memberOf Functions
   * @ignore
   * @param {String} dayCode
   * @returns {Number|null}
   */

  function convertDayCodeToNumber(dayCode) {
    if (!is.string(dayCode) || dayCode === '') {
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

  return convertDayCodeToNumber;
})();

},{"@barchart/common-js/lang/is":35}],9:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');

const monthCodes = require('./../data/monthCodes');

module.exports = (() => {
  'use strict';

  const map = monthCodes.getCodeToNameMap();
  /**
   * Converts a futures month code to the month number (e.g. "F" to "January", or "N" to "July").
   *
   * @function
   * @memberOf Functions
   * @ignore
   * @param {String} monthCode
   * @returns {String|null}
   */

  function convertMonthCodeToNumber(monthCode) {
    if (!is.string(monthCode)) {
      return null;
    }

    return map[monthCode] || null;
  }

  return convertMonthCodeToNumber;
})();

},{"./../data/monthCodes":15,"@barchart/common-js/lang/is":35}],10:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');

const monthCodes = require('./../data/monthCodes');

module.exports = (() => {
  'use strict';

  const map = monthCodes.getCodeToNumberMap();
  /**
   * Converts a futures month code to the month number (e.g. "F" to 1, or "N" to 7).
   *
   * @function
   * @memberOf Functions
   * @ignore
   * @param {String} monthCode
   * @returns {Number|null}
   */

  function convertMonthCodeToNumber(monthCode) {
    if (!is.string(monthCode)) {
      return null;
    }

    return map[monthCode] || null;
  }

  return convertMonthCodeToNumber;
})();

},{"./../data/monthCodes":15,"@barchart/common-js/lang/is":35}],11:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');

module.exports = (() => {
  'use strict';

  const ASCII_ONE = '1'.charCodeAt(0);
  const ASCII_A = 'A'.charCodeAt(0);
  /**
   * Converts a day number to a single character day code (e.g. 1 is
   * converted to "1", and 10 is converted to "0", and 11 is converted
   * to "A").
   *
   * @function
   * @memberOf Functions
   * @ignore
   * @param {Number} d
   * @returns {String}
   */

  function convertNumberToDayCode(d) {
    if (!is.integer(d)) {
      return null;
    }

    if (d >= 1 && d <= 9) {
      return String.fromCharCode(ASCII_ONE + d - 1);
    } else if (d === 10) {
      return '0';
    } else {
      return String.fromCharCode(ASCII_A + d - 11);
    }
  }

  return convertNumberToDayCode;
})();

},{"@barchart/common-js/lang/is":35}],12:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');

const UnitCode = require('./../data/UnitCode');

module.exports = (() => {
  'use strict';
  /**
   * Converts a Barchart "unit" code into a Barchart "base" code. If the "unit"
   * code provided is invalid, a base code of zero will be returned.
   *
   * @function
   * @memberOf Functions
   * @ignore
   * @param {String} unitCode
   * @returns {Number}
   */

  function convertUnitCodeToBaseCode(unitCode) {
    if (!is.string(unitCode) || unitCode.length !== 1) {
      return 0;
    }

    const unitCodeItem = UnitCode.parse(unitCode);
    return unitCodeItem === null ? 0 : unitCodeItem.baseCode;
  }

  return convertUnitCodeToBaseCode;
})();

},{"./../data/UnitCode":14,"@barchart/common-js/lang/is":35}],13:[function(require,module,exports){
const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
  'use strict';
  /**
   * An enumeration for instrument types (e.g. stock, future, etc).
   *
   * @public
   * @exported
   * @extends {Enum}
   * @param {String} code
   * @param {String} description
   * @param {Number} id
   */

  class AssetClass extends Enum {
    constructor(code, description, id) {
      super(code, description);
      this._id = id;
    }
    /**
     * A unique numeric identifier assigned by Barchart.
     *
     * @public
     * @returns {Number}
     */


    get id() {
      return this._id;
    }

    toJSON() {
      return this._id;
    }
    /**
     * Converts the string-based identifier into an enumeration item.
     *
     * @public
     * @static
     * @param {String} code
     * @returns {AssetClass|null}
     */


    static parse(code) {
      return Enum.fromCode(UnitCode, code);
    }
    /**
     * Converts the numeric identifier into an enumeration item.
     *
     * @public
     * @static
     * @param {Number} id
     * @returns {AssetClass|null}
     */


    static fromId(id) {
      return Enum.getItems(AssetClass).find(x => x.id === id) || null;
    }
    /**
     * A stock.
     *
     * @public
     * @static
     * @returns {AssetClass}
     */


    static get STOCK() {
      return STOCK;
    }
    /**
     * A stock option.
     *
     * @public
     * @static
     * @returns {AssetClass}
     */


    static get STOCK_OPTION() {
      return STOCK_OPTION;
    }
    /**
     * A future.
     *
     * @public
     * @static
     * @returns {AssetClass}
     */


    static get FUTURE() {
      return FUTURE;
    }
    /**
     * A future option.
     *
     * @public
     * @static
     * @returns {AssetClass}
     */


    static get FUTURE_OPTION() {
      return FUTURE_OPTION;
    }
    /**
     * A foreign exchange instrument.
     *
     * @public
     * @static
     * @returns {AssetClass}
     */


    static get FOREX() {
      return FOREX;
    }

    toString() {
      return `[AssetClass (id=${this.id}, code=${this.code})]`;
    }

  }

  const STOCK = new AssetClass('STK', 'U.S. Equity', 1);
  const STOCK_OPTION = new AssetClass('STKOPT', 'Equity Option', 34);
  const FUTURE = new AssetClass('FUT', 'Future', 2);
  const FUTURE_OPTION = new AssetClass('FUTOPT', 'Future Option', 12);
  const FOREX = new AssetClass('FOREX', 'FOREX', 10);
  return AssetClass;
})();

},{"@barchart/common-js/lang/Enum":31}],14:[function(require,module,exports){
const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
  'use strict'; // 2021/07/14, For a more detailed on the "special" fractional formatting (i.e. CME
  // tick notation), please refer to the detailed unit test suite written for CME
  // notation (see the cmeSpec.js file).

  /**
   * An enumeration that describes different conventions for formatting prices,
   * as decimals or fractions (using tick notation). Each instrument is assigned
   * a unit code. See the {@link Profile.unitCode} property.
   *
   * Barchart uses fourteen distinct unit codes.
   *
   * @public
   * @exported
   * @extends {Enum}
   * @param {String} code
   * @param {Number} baseCode
   * @param {Number} decimalDigits - When formatting a price as a decimal value, the number of decimal places to display.
   * @param {Boolean} supportsFractions - As an alternative to decimal-formatted prices, some instruments support fractional representations.
   * @param {Number=} fractionFactor - The count of discrete prices which a unit can be divided into (e.g. a US dollar can be divided into 100 cents). By default, this is also the implied denominator in fractional notation (e.g. 3.6875 equals 3 and 22/32 — which is represented in fractional notation as "3-22", where the denominator of 32 is implied).
   * @param {Number} fractionDigits - The number of digits of the fraction's numerator to display (e.g. using two digits, the fraction 22/32 is shown as "0-22"; using three digits, the fraction 22.375/32 is shown as "0-223").
   * @param {Number=} fractionFactorSpecial - Special fraction factors refer to the CME tick notation scheme (read more [here](https://www.cmegroup.com/confluence/display/EPICSANDBOX/Fractional+Pricing+-+Tick+and+Decimal+Conversions)). For example, the CME notation for 0.51171875 (in 1/8ths of 1/32nds) is "0-163", where the numerator of "163" means 16 thirty-seconds and 3 eighths of a thirty-second, where the actual fraction is 16.3[75] / 32, which equals 0.51171875.
   * @param {Number=} fractionDigitsSpecial - The number of digits of the fraction's numerator to display, when formatting in CME tick notation. For example, the notation "0-163" (in 1/8ths of 1/32nds) equates to the fraction of 16.375/32. This notation is limited to three digits (163) and omits the trailing two digits (75).
   */

  class UnitCode extends Enum {
    constructor(code, baseCode, decimalDigits, supportsFractions, fractionFactor, fractionDigits, fractionFactorSpecial, fractionDigitsSpecial) {
      super(code, code);
      this._baseCode = baseCode;
      this._decimalDigits = decimalDigits;
      this._supportsFractions = supportsFractions;

      if (supportsFractions) {
        this._fractionFactor = fractionFactor;
        this._fractionDigits = fractionDigits;
        this._fractionFactorSpecial = fractionFactorSpecial || fractionFactor;
        this._fractionDigitsSpecial = fractionDigitsSpecial || fractionDigits;
      } else {
        this._fractionFactor = undefined;
        this._fractionDigits = undefined;
        this._fractionFactorSpecial = undefined;
        this._fractionDigitsSpecial = undefined;
      }
    }
    /**
     * The numeric counterpart of a "unit" code.
     *
     * @public
     * @returns {Number}
     */


    get baseCode() {
      return this._baseCode;
    }
    /**
     * The single character "unit" code.
     *
     * @public
     * @returns {String}
     */


    get unitCode() {
      return this._code;
    }
    /**
     * When formatting in decimal mode, the number of digits to show after the
     * decimal point.
     *
     * @public
     * @returns {Number}
     */


    get decimalDigits() {
      return this._decimalDigits;
    }
    /**
     * Indicates if formatting can use the alternative to decimal notation -- that
     * is, fractional notation.
     *
     * @public
     * @returns {Boolean}
     */


    get supportsFractions() {
      return this._supportsFractions;
    }
    /**
     * The count of discrete prices which a unit can be divided into (e.g. a US dollar can be divided
     * into 100 cents). By default, this is also the implied denominator in fractional notation (e.g. 3.6875
     * equals 3 and 22/32 — which is represented in fractional notation as "3-22", where the denominator of 32
     * is implied).
     *
     * @public
     * @returns {Number|undefined}
     */


    get fractionFactor() {
      return this._fractionFactor;
    }
    /**
     * The number of digits of the fraction's numerator to display (e.g. using two digits, the fraction 22/32 is
     * shown as "0-22"; using three digits, the fraction 22.375/32 is shown as "0-223").
     *
     * @public
     * @returns {Number|undefined}
     */


    get fractionDigits() {
      return this._fractionDigits;
    }
    /**
     * Special fraction factors refer to the CME tick notation scheme (read more [here](https://www.cmegroup.com/confluence/display/EPICSANDBOX/Fractional+Pricing+-+Tick+and+Decimal+Conversions)).
     *
     * @public
     * @returns {Number|undefined}
     */


    get fractionFactorSpecial() {
      return this._fractionFactorSpecial;
    }
    /**
     * Same as {@link UnitCode#fractionDigits} for "special" fractions.
     *
     * @public
     * @returns {Number|undefined}
     */


    get fractionDigitsSpecial() {
      return this._fractionDigitsSpecial;
    }
    /**
     * The number of digits of the fraction's numerator to display, when formatting
     * in CME tick notation. For example, the notation "0-163" (in 1/8ths of 1/32nds) equates
     * to the fraction of 16.375/32. This notation is limited to three digits (163)
     * and omits the trailing two digits (75).
     *
     * @public
     * @param {Boolean=} special
     * @returns {Number|undefined}
     */


    getFractionFactor(special) {
      return special === true ? this._fractionFactorSpecial : this._fractionFactor;
    }
    /**
     * Returns the {@link UnitCode#fractionDigits} or {@link UnitCode#fractionDigitsSpecial} value.
     *
     * @public
     * @param {Boolean=} special
     * @returns {Number|undefined}
     */


    getFractionDigits(special) {
      return special === true ? this._fractionDigitsSpecial : this._fractionDigits;
    }

    toString() {
      return `[UnitCode (code=${this.code})]`;
    }
    /**
     * Converts a unit code character into a {@link UnitCode} enumeration item.
     *
     * @public
     * @static
     * @param {String} code
     * @returns {UnitCode|null}
     */


    static parse(code) {
      return Enum.fromCode(UnitCode, code);
    }
    /**
     * Converts a numeric "base" code into a {@link UnitCode} item.
     *
     * @public
     * @static
     * @param {Number} code
     * @returns {UnitCode|null}
     */


    static fromBaseCode(code) {
      return Enum.getItems(UnitCode).find(x => x.baseCode === code) || null;
    }

  }

  const TWO = new UnitCode('2', -1, 3, true, 8, 1);
  const THREE = new UnitCode('3', -2, 4, true, 16, 2);
  const FOUR = new UnitCode('4', -3, 5, true, 32, 2);
  const FIVE = new UnitCode('5', -4, 6, true, 64, 2, 320, 3);
  const SIX = new UnitCode('6', -5, 7, true, 128, 3, 320, 3);
  const SEVEN = new UnitCode('7', -6, 8, true, 256, 3, 320, 3);
  const EIGHT = new UnitCode('8', 0, 0, false);
  const NINE = new UnitCode('9', 1, 1, false);
  const A = new UnitCode('A', 2, 2, false);
  const B = new UnitCode('B', 3, 3, false);
  const C = new UnitCode('C', 4, 4, false);
  const D = new UnitCode('D', 5, 5, false);
  const E = new UnitCode('E', 6, 6, false);
  const F = new UnitCode('F', 7, 7, false);
  return UnitCode;
})();

},{"@barchart/common-js/lang/Enum":31}],15:[function(require,module,exports){
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
      return Object.assign({}, monthMap);
    },
    getCodeToNumberMap: () => {
      return Object.assign({}, numberMap);
    }
  };
})();

},{}],16:[function(require,module,exports){
module.exports = (() => {
  'use strict';

  function leftPad(value) {
    return ('00' + value).substr(-2);
  }
  /**
   * Formats a {@link Date} instance as a string (using a MM/DD/YY pattern).
   *
   * @exported
   * @function
   * @memberOf Functions
   * @param {Date=} date
   * @param {Boolean=} utc
   * @returns {String}
   */


  function formatDate(date, utc) {
    if (!date) {
      return '';
    }

    if (utc) {
      return `${leftPad(date.getUTCMonth() + 1)}/${leftPad(date.getUTCDate())}/${leftPad(date.getUTCFullYear())}`;
    } else {
      return `${leftPad(date.getMonth() + 1)}/${leftPad(date.getDate())}/${leftPad(date.getFullYear())}`;
    }
  }

  return formatDate;
})();

},{}],17:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');

module.exports = (() => {
  'use strict';
  /**
   * Formats a number as decimal value (with a given number of digits after the decimal place,
   * thousands separator(s), and options for displaying negative values).
   *
   * @exported
   * @function
   * @memberOf Functions
   * @param {Number} value
   * @param {Number} digits
   * @param {String=} thousandsSeparator
   * @param {Boolean=} useParenthesis
   * @returns {String}
   */

  function formatDecimal(value, digits, thousandsSeparator, useParenthesis) {
    if (!is.number(value)) {
      return '';
    }

    if (!is.string(thousandsSeparator) || thousandsSeparator.length > 1) {
      thousandsSeparator = '';
    }

    const applyParenthesis = value < 0 && useParenthesis === true;

    if (applyParenthesis) {
      value = 0 - value;
    }

    let formatted = value.toFixed(digits);

    if (thousandsSeparator && (value < -999 || value > 999)) {
      const length = formatted.length;
      const negative = value < 0;
      let found = digits === 0;
      let counter = 0;
      const buffer = [];

      for (let i = length - 1; !(i < 0); i--) {
        if (counter === 3 && !(negative && i === 0)) {
          buffer.unshift(thousandsSeparator);
          counter = 0;
        }

        const character = formatted.charAt(i);
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

      formatted = buffer.join('');
    } else if (applyParenthesis) {
      formatted = '(' + formatted + ')';
    }

    return formatted;
  }

  return formatDecimal;
})();

},{"@barchart/common-js/lang/is":35}],18:[function(require,module,exports){
const formatPrice = require('./../price');

module.exports = (() => {
  'use strict';
  /**
   * Returns a {@link PriceFormatterFactory~formatPrice} which uses
   * the configuration supplied to this function as parameters.
   *
   * @exported
   * @function
   * @param {String=} fractionSeparator
   * @param {Boolean=} specialFractions
   * @param {String=} thousandsSeparator
   * @param {Boolean=} useParenthesis
   * @returns {PriceFormatterFactory~formatPrice}
   */

  function buildPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {
    return (value, unitCode, profile) => formatPrice(value, unitCode, fractionSeparator, specialFractions, thousandsSeparator, useParenthesis);
  }
  /**
   * Accepts a numeric value and a unit code, and returns a formatted price as a string.
   *
   * @public
   * @callback PriceFormatterFactory~formatPrice
   * @param {Number} value
   * @param {String} unitCode
   * @param {Profile} profile
   * @returns {String}
   */


  return buildPriceFormatter;
})();

},{"./../price":21}],19:[function(require,module,exports){
const formatQuote = require('./../quote');

module.exports = (() => {
  'use strict';
  /**
   * Returns a {@link QuoteFormatterFactory~formatQuote} which uses
   * the configuration supplied to this function as parameters.
   *
   * @exported
   * @function
   * @param {Boolean=} useTwelveHourClock
   * @param {Boolean=} short
   * @param {String=} timezone - A name from the tz database (see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
   * @returns {QuoteFormatterFactory~formatQuote}
   */

  function buildQuoteFormatter(useTwelveHourClock, short, timezone) {
    return quote => formatQuote(quote, useTwelveHourClock, short, timezone);
  }
  /**
   * Accepts a {@link Quote} instance and returns the appropriate human-readable
   * date (or time) as a string.
   *
   * @public
   * @callback QuoteFormatterFactory~formatQuote
   * @param {Quote} quote
   * @returns {String}
   */


  return buildQuoteFormatter;
})();

},{"./../quote":22}],20:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');

module.exports = (() => {
  'use strict';

  function getIntegerPart(value, fractionSeparator) {
    const floor = Math.floor(value);

    if (floor === 0 && fractionSeparator === '') {
      return '';
    } else {
      return floor;
    }
  }

  function getDecimalPart(absoluteValue) {
    return absoluteValue - Math.floor(absoluteValue);
  }

  function frontPad(value, digits) {
    return ['000', Math.floor(value)].join('').substr(-1 * digits);
  }
  /**
   * Formats a value using fractional tick notation.
   *
   * @exported
   * @function
   * @memberOf Functions
   * @param {Number} value - The decimal value to format as a fraction.
   * @param {Number} fractionFactor - The count of discrete prices which a unit can be divided into (e.g. a US dollar can be divided into 100 cents). By default, this is also the implied denominator in fractional notation (e.g. 3.6875 equals 3 and 22/32 — which is represented in fractional notation as "3-22" where the denominator of 32 is implied).
   * @param {Number} fractionDigits - The number of digits of the fraction's numerator to display (e.g. using two digits, the fraction 22/32 is shown as "0-22"; using three digits, the fraction 22.375/32 is shown as "0-223").
   * @param {String=} fractionSeparator - An optional character to insert between the whole and fractional part of the value.
   * @param {Boolean=} useParenthesis - If true, negative values will be wrapped in parenthesis.
   * @returns {String}
   */


  function formatFraction(value, fractionFactor, fractionDigits, fractionSeparator, useParenthesis) {
    if (!is.number(value)) {
      return '';
    }

    if (!is.number(fractionFactor)) {
      return '';
    }

    if (!is.number(fractionDigits)) {
      return '';
    }

    if (!is.string(fractionSeparator) || fractionSeparator.length > 1) {
      fractionSeparator = '.';
    }

    const absoluteValue = Math.abs(value);
    const integerPart = getIntegerPart(absoluteValue, fractionSeparator);
    const decimalPart = getDecimalPart(absoluteValue);
    const denominator = fractionFactor;
    const numerator = decimalPart * denominator;
    const roundedNumerator = Math.floor(parseFloat(numerator.toFixed(1)));
    const formattedNumerator = frontPad(roundedNumerator, fractionDigits);
    let prefix;
    let suffix;

    if (value < 0) {
      useParenthesis = is.boolean(useParenthesis) && useParenthesis;

      if (useParenthesis) {
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

    return [prefix, integerPart, fractionSeparator, formattedNumerator, suffix].join('');
  }

  return formatFraction;
})();

},{"@barchart/common-js/lang/is":35}],21:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');

const formatDecimal = require('./decimal'),
      formatFraction = require('./fraction');

const UnitCode = require('./../data/UnitCode');

module.exports = (() => {
  'use strict';
  /**
   * Converts a numeric price into a human-readable string. One of two modes
   * may be used, depending on the unit code and fraction separator. For example,
   * using unit code "2" the value 9.5432 is formatted as "9.543" in decimal
   * mode and "9-4" in fractional mode.
   *
   * @exported
   * @function
   * @memberOf Functions
   * @param {Number} value
   * @param {String} unitCode
   * @param {String=} fractionSeparator - Can be zero or one character in length. If invalid or omitted, a decimal notation is used. If non-decimal, then fractional notation is used (assuming supported by unit code).
   * @param {Boolean=} specialFractions - If fractional notation is used, indicates if the "special" factor (i.e. denominator) is used to calculate numerator.
   * @param {String=} thousandsSeparator - Can be zero or one character in length. If invalid or omitted, a zero-length string is used.
   * @param {Boolean=} useParenthesis - If true, negative values will be represented with parenthesis (instead of a leading minus sign).
   * @returns {String}
   */

  function formatPrice(value, unitCode, fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {
    if (!is.number(value)) {
      return '';
    }

    const unitCodeItem = UnitCode.parse(unitCode);

    if (unitCodeItem === null) {
      return '';
    }

    if (!is.string(fractionSeparator) || fractionSeparator.length > 1) {
      fractionSeparator = '.';
    }

    specialFractions = is.boolean(specialFractions) && specialFractions;
    useParenthesis = is.boolean(useParenthesis) && useParenthesis;

    if (!unitCodeItem.supportsFractions || fractionSeparator === '.') {
      return formatDecimal(value, unitCodeItem.decimalDigits, thousandsSeparator, useParenthesis);
    } else {
      const fractionFactor = unitCodeItem.getFractionFactor(specialFractions);
      const fractionDigits = unitCodeItem.getFractionDigits(specialFractions);
      return formatFraction(value, fractionFactor, fractionDigits, fractionSeparator, useParenthesis);
    }
  }

  return formatPrice;
})();

},{"./../data/UnitCode":14,"./decimal":17,"./fraction":20,"@barchart/common-js/lang/is":35}],22:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');

const formatDate = require('./date'),
      formatTime = require('./time');

const Timezone = require('@barchart/common-js/lang/Timezones');

module.exports = (() => {
  'use strict';

  let offsets = {};
  /**
   * Returns a string-formatted date (or time), based on a {@link Quote} instance's
   * state. If the market is open, and a trade has occurred, then the formatted time
   * is returned. Otherwise, the formatted date is returned.
   *
   * @exported
   * @function
   * @memberOf Functions
   * @param {Quote} quote
   * @param {Boolean=} useTwelveHourClock
   * @param {Boolean=} short
   * @param {String=} timezone - A name from the tz database (see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) or "EXCHANGE"
   * @returns {String}
   */

  function formatQuoteDateTime(quote, useTwelveHourClock, short, timezone) {
    if (!quote || !quote.time) {
      return '';
    }

    let t;
    let utc;

    if (quote.timeUtc !== null && (is.string(timezone) || quote.profile && quote.profile.exchangeRef && quote.profile.exchangeRef && quote.profile.exchangeRef.timezoneExchange)) {
      utc = true;
      let tz;

      if (is.string(timezone)) {
        tz = timezone;
      } else {
        tz = quote.profile.exchangeRef.timezoneExchange;
      }

      let epoch = quote.timeUtc.getTime();

      if (!offsets.hasOwnProperty(tz)) {
        const offset = {};
        offset.latest = epoch;
        offset.timezone = Timezone.parse(tz);

        if (offset.timezone !== null) {
          offset.milliseconds = offset.timezone.getUtcOffset(null, true);
        } else {
          offset.milliseconds = null;
        }

        offsets[tz] = offset;
      }

      const o = offsets[tz];

      if (o.milliseconds !== null) {
        t = new Date(epoch + o.milliseconds);
      } else {
        t = null;
      }
    } else {
      utc = false;
      t = quote.time;
    }

    if (t === null) {
      return '';
    } else if (!quote.lastPrice || quote.flag || quote.sessionT) {
      return formatDate(t, utc);
    } else {
      return formatTime(t, quote.timezone, useTwelveHourClock, short, utc);
    }
  }

  return formatQuoteDateTime;
})();

},{"./date":16,"./time":25,"@barchart/common-js/lang/Timezones":32,"@barchart/common-js/lang/is":35}],23:[function(require,module,exports){
const AssetClass = require('./../../data/AssetClass');

const formatFraction = require('./../fraction'),
      formatPrice = require('./../price');

module.exports = (() => {
  'use strict';

  const regex = {};
  regex.ZB = /^BB\d$/;
  regex.ZT = /^BT\d$/;
  regex.ZF = /^BF\d$/;
  regex.ZN = /^BN\d$/;
  /**
   * An implementation of {@link Callbacks.CustomPriceFormatterCallback} which can be
   * used with ${@link Profile.setPriceFormatterCustom}. This implementation applies
   * logic specific to the [cmdtyView](https://www.barchart.com/cmdty/trading/cmdtyview)
   * product.
   *
   * @function
   * @ignore
   * @param {Number} value
   * @param {String} unitCode
   * @param {Profile} profile
   * @returns {String}
   */

  function formatForCmdtyView(value, unitCode, profile) {
    if (profile.asset === AssetClass.FUTURE_OPTION) {
      const root = profile.root; // 2021/07/15, BRI. Options for ZB and ZN use unitCode="5" which defines
      // 64 price increments. The default price formatter will output fractions
      // using halves of thirty-seconds (e.g. 0-315). However, the CME specifies
      // formatting with sixty-fourths (e.g. 0-63). These notations are numerically
      // equivalent (i.e. 0-315 equals 0-63); however, customers will expect to see
      // the latter. This logic includes the option "root" symbols for normal, weekly,
      // and wednesday options (for ZB and ZN futures).

      if (root === 'ZB' || root === 'ZN' || regex.ZB.test(root) || regex.ZN.test(root)) {
        return formatFraction(value, 64, 2, '-', false);
      } // 2021/07/15, BRI. Options for ZT and ZF use unitCode="6" which defines
      // 128 price increments. The default price formatter will output fractions
      // using quarters of thirty-seconds (e.g. 0-317). However, the CME specifies
      // formatting with halves of sixty-fourths (e.g. 0-635). These notations are
      // numerically equivalent (i.e. 0-317 equals 0-635); however, customers will
      // expect to see the latter. This logic includes the option "root" symbols for
      // normal, weekly,and wednesday options (for ZT and ZF futures).


      if (root === 'ZT' || root === 'ZF' || regex.ZT.test(root) || regex.ZF.test(root)) {
        return formatFraction(value, 640, 3, '-', false);
      }
    }

    return formatPrice(value, unitCode, '-', true, ',');
  }

  return formatForCmdtyView;
})();

},{"./../../data/AssetClass":13,"./../fraction":20,"./../price":21}],24:[function(require,module,exports){
module.exports = (() => {
  'use strict';
  /**
   * Formats a string (by capitalizing it). If anything other than a string
   * is passed, the argument is returned without modification.
   *
   * @exported
   * @function
   * @memberOf Functions
   * @param {String|*} symbol
   * @returns {String|*}
   */

  function formatSymbol(symbol) {
    if (symbol !== null && typeof symbol === 'string') {
      return symbol.toUpperCase();
    } else {
      return symbol;
    }
  }

  return formatSymbol;
})();

},{}],25:[function(require,module,exports){
module.exports = (() => {
  'use strict';

  function leftPad(value) {
    return ('00' + value).substr(-2);
  }

  function formatTwelveHourTime(t, utc) {
    let hours;
    let minutes;
    let seconds;

    if (utc) {
      hours = t.getUTCHours();
      minutes = t.getUTCMinutes();
      seconds = t.getUTCSeconds();
    } else {
      hours = t.getHours();
      minutes = t.getMinutes();
      seconds = t.getSeconds();
    }

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

    return `${leftPad(hours)}:${leftPad(minutes)}:${leftPad(seconds)} ${period}`;
  }

  function formatTwelveHourTimeShort(t, utc) {
    let hours;
    let minutes;

    if (utc) {
      hours = t.getUTCHours();
      minutes = t.getUTCMinutes();
    } else {
      hours = t.getHours();
      minutes = t.getMinutes();
    }

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

    return `${leftPad(hours)}:${leftPad(minutes)}${period}`;
  }

  function formatTwentyFourHourTime(t, utc) {
    let hours;
    let minutes;
    let seconds;

    if (utc) {
      hours = t.getUTCHours();
      minutes = t.getUTCMinutes();
      seconds = t.getUTCSeconds();
    } else {
      hours = t.getHours();
      minutes = t.getMinutes();
      seconds = t.getSeconds();
    }

    return `${leftPad(hours)}:${leftPad(minutes)}:${leftPad(seconds)}`;
  }

  function formatTwentyFourHourTimeShort(t, utc) {
    let hours;
    let minutes;

    if (utc) {
      hours = t.getUTCHours();
      minutes = t.getUTCMinutes();
    } else {
      hours = t.getHours();
      minutes = t.getMinutes();
    }

    return `${leftPad(hours)}:${leftPad(minutes)}`;
  }
  /**
   * Formats a {@link Date} instance's time component as a string.
   *
   * @exported
   * @function
   * @memberOf Functions
   * @param {Date} date
   * @param {String=} timezone
   * @param {Boolean=} useTwelveHourClock
   * @param {Boolean=} short
   * @param {Boolean=} utc
   * @returns {String}
   */


  function formatTime(date, timezone, useTwelveHourClock, short, utc) {
    if (!date) {
      return '';
    }

    let ft;

    if (useTwelveHourClock) {
      if (short) {
        ft = formatTwelveHourTimeShort;
      } else {
        ft = formatTwelveHourTime;
      }
    } else {
      if (short) {
        ft = formatTwentyFourHourTimeShort;
      } else {
        ft = formatTwentyFourHourTime;
      }
    }

    let formatted = ft(date, utc);

    if (timezone) {
      formatted = `${formatted} ${timezone}`;
    }

    return formatted;
  }

  return formatTime;
})();

},{}],26:[function(require,module,exports){
const xmlDom = require('@xmldom/xmldom');

const parseValue = require('./value'),
      parseTimestamp = require('./timestamp');

module.exports = (() => {
  'use strict';

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
   * @exported
   * @function
   * @param {String} msg
   * @param {Object=} options
   * @returns {Object}
   */


  function parseMessage(msg, options) {
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
                      message.asks.push({
                        "price": parseValue(ary1[i], message.unitcode),
                        "size": parseInt(ary2[i])
                      });
                    }
                  }

                  if (node.attributes.getNamedItem('bidprices') && node.attributes.getNamedItem('bidsizes')) {
                    ary1 = node.attributes.getNamedItem('bidprices').value.split(',');
                    ary2 = node.attributes.getNamedItem('bidsizes').value.split(',');

                    for (let i = 0; i < ary1.length; i++) {
                      message.bids.push({
                        "price": parseValue(ary1[i], message.unitcode),
                        "size": parseInt(ary2[i])
                      });
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
                    if (node.childNodes[j].nodeName === 'SESSION') {
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
                  const session = premarket ? sessions.previous : sessions.combined; // 2021/06/30, This seems wrong. We may be selecting most values
                  // from the "combined" session ... but, the "previousPrice" value
                  // from the "previous" session ... This can give us the same "previousPrice"
                  // and "lastPrice" values (e.g. ZCN1 right after 4:45 PM, when the
                  // snapshots change).

                  if (premarket) {
                    message.previousPrice = sessions.previous.previousPrice;
                  } else if (sessions.combined.previousPrice) {
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
                  if (session.tradeTime) message.tradeTime = session.tradeTime; // 2016/10/29, BRI. We have a problem where we don't "roll" quotes
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
                          if (message.modifier === '1') message.type = 'OPEN_INTEREST';
                          break;

                        case 'D':
                        case 'd':
                          if (message.modifier === '0') message.type = 'SETTLEMENT';
                          break;

                        case 'V':
                          if (message.modifier === '0') message.type = 'VWAP';
                          break;

                        case '0':
                          {
                            if (message.modifier === '0') {
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
                            if (message.modifier === '1') message.type = 'VOLUME_YESTERDAY';else if (message.modifier === '6') message.type = 'VOLUME';
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

                  case '6':
                    {
                      if (msg.substr(1, 1) === '2') {
                        const ary = msg.substring(pos + 8).split(',');
                        message.openPrice = parseValue(ary[0], message.unitcode);
                        message.highPrice = parseValue(ary[1], message.unitcode);
                        message.lowPrice = parseValue(ary[2], message.unitcode);
                        message.lastPrice = parseValue(ary[3], message.unitcode);
                        message.volume = ary[13].length > 0 ? parseInt(ary[13]) : undefined;
                        message.day = ary[14].substr(0, 1);
                        message.session = ary[14].substr(1, 1);
                        message.type = 'OHLC';
                      }

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
                      message.bidDepth = msg.substr(pos + 5, 1) === 'A' ? 10 : parseInt(msg.substr(pos + 5, 1));
                      message.askDepth = msg.substr(pos + 6, 1) === 'A' ? 10 : parseInt(msg.substr(pos + 6, 1));
                      message.bids = [];
                      message.asks = [];
                      const ary = msg.substring(pos + 8).split(',');

                      for (let i = 0; i < ary.length; i++) {
                        const ary2 = ary[i].split(/[A-Z]/);
                        const c = ary[i].substr(ary2[0].length, 1);
                        if (c <= 'J') message.asks.push({
                          "price": parseValue(ary2[0], message.unitcode),
                          "size": parseInt(ary2[1])
                        });else message.bids.push({
                          "price": parseValue(ary2[0], message.unitcode),
                          "size": parseInt(ary2[1])
                        });
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

},{"./timestamp":27,"./value":28,"@xmldom/xmldom":43}],27:[function(require,module,exports){
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
   * @exported
   * @function
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
    const ms = (0xFF & bytes.charCodeAt(7)) + ((0xFF & bytes.charCodeAt(8)) << 8); // 2016/02/17. JERQ is providing us with date and time values that
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

},{}],28:[function(require,module,exports){
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
   * @exported
   * @function
   * @param {String} str
   * @param {String} unitCode
   * @param {String=} thousandsSeparator
   * @returns {Number|undefined|null}
   */


  function parseValue(str, unitCode, thousandsSeparator) {
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

    const sign = str.substr(0, 1) === '-' ? -1 : 1;

    if (sign === -1) {
      str = str.substr(1);
    }

    switch (unitCode) {
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

},{}],29:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is');

const UnitCode = require('./../data/UnitCode');

module.exports = (() => {
  'use strict';

  const regex = {};
  regex.fractions = {};
  regex.fractions.separators = /([0-9]+)([\-'])([0-9]{1,3}$)/;

  function coerce(text) {
    return text * 1;
  }
  /**
   * Converts a string-formatted price into a number. If the value cannot be parsed,
   * the {@link Number.NaN} value is returned.
   *
   * @function
   * @memberOf Functions
   * @exported
   * @param {String|Number} value
   * @param {String} unitCode
   * @param {String=} fractionSeparator - Can be zero or one character in length. If invalid or omitted, the separator will be inferred based on the value being parsed.
   * @param {Boolean=} specialFractions -  If fractional notation is used, indicates if the "special" factor (i.e. denominator) was used to calculate the numerator of the value being parsed.
   * @param {String=} thousandsSeparator - Can be zero or one character in length. If invalid or omitted, the parameter will be ignored.
   * @returns {Number}
   */


  function parsePrice(value, unitCode, fractionSeparator, specialFractions, thousandsSeparator) {
    if (is.number(value)) {
      return value;
    }

    if (!is.string(value) || value.length === 0) {
      return Number.NaN;
    }

    const unitCodeItem = UnitCode.parse(unitCode);

    if (unitCodeItem === null) {
      return Number.NaN;
    }

    let negative;

    if (value.startsWith('(') && value.endsWith(')')) {
      negative = true;
      value = value.slice(1, -1);
    } else if (value.startsWith('-')) {
      negative = true;
      value = value.slice(1);
    } else {
      negative = false;
    }

    if (is.string(fractionSeparator) && fractionSeparator.length < 2) {
      fractionSeparator = fractionSeparator;
    } else if (unitCodeItem.supportsFractions && regex.fractions.separators.test(value)) {
      fractionSeparator = value.match(regex.fractions.separators)[2];
    } else {
      fractionSeparator = '.';
    }

    if (!is.string(thousandsSeparator) || thousandsSeparator.length > 1) {
      thousandsSeparator = '';
    }

    if (thousandsSeparator.length !== 0) {
      const digitGroups = value.split(thousandsSeparator);
      const assumeFractionSeparator = thousandsSeparator === fractionSeparator && digitGroups.length > 1;

      if (assumeFractionSeparator) {
        const fractionGroup = digitGroups.pop();
        digitGroups.push(fractionSeparator);
        digitGroups.push(fractionGroup);
      }

      value = digitGroups.join('');
    }

    let absoluteValue;

    if (unitCodeItem.supportsFractions && fractionSeparator !== '.') {
      specialFractions = is.boolean(specialFractions) && specialFractions;
      const fractionDigits = unitCodeItem.getFractionDigits(specialFractions);
      let integerCharacters;
      let fractionCharacters;

      if (fractionSeparator.length === 1) {
        const characterGroups = value.split(fractionSeparator);
        integerCharacters = characterGroups[0];
        fractionCharacters = characterGroups[1];
      } else {
        integerCharacters = value.substring(0, value.length - fractionDigits - fractionSeparator.length);
        fractionCharacters = value.slice(-fractionDigits);
      }

      if (fractionCharacters.length !== fractionDigits) {
        return Number.NaN;
      }

      if (integerCharacters === '') {
        integerCharacters = '0';
      }

      const integerPart = parseInt(integerCharacters);
      const fractionPart = parseInt(fractionCharacters);

      if (is.nan(integerPart) || is.nan(fractionPart)) {
        return Number.NaN;
      }

      const denominator = unitCodeItem.getFractionFactor(specialFractions);
      absoluteValue = integerPart + fractionPart / denominator;
    } else {
      const roundingFactor = Math.pow(10, unitCodeItem.decimalDigits);
      absoluteValue = Math.round(coerce(value) * roundingFactor) / roundingFactor;
    }

    if (negative) {
      return -absoluteValue;
    } else {
      return absoluteValue;
    }
  }

  return parsePrice;
})();

},{"./../data/UnitCode":14,"@barchart/common-js/lang/is":35}],30:[function(require,module,exports){
const is = require('@barchart/common-js/lang/is'),
      string = require('@barchart/common-js/lang/string');

const AssetClass = require('./../data/AssetClass');

module.exports = (() => {
  'use strict';
  /**
   * Static utilities for parsing symbols.
   *
   * @public
   * @ignore
   */

  class SymbolParser {
    constructor() {}
    /**
     * Returns true when a symbol is not an alias.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsConcrete(symbol) {
      return is.string(symbol) && !this.getIsReference(symbol);
    }
    /**
     * Returns true when a symbol is an alias.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsReference(symbol) {
      return is.string(symbol) && types.futures.alias.test(symbol);
    }
    /**
     * Returns true when a symbol represents futures contract.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsFuture(symbol) {
      return is.string(symbol) && (types.futures.concrete.test(symbol) || types.futures.alias.test(symbol));
    }
    /**
     * Returns true when a symbol represents futures spread.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsFutureSpread(symbol) {
      return is.string(symbol) && types.futures.spread.test(symbol);
    }
    /**
     * Returns true when a symbol represents an option on a futures contract.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsFutureOption(symbol) {
      return is.string(symbol) && (types.futures.options.short.test(symbol) || types.futures.options.long.test(symbol) || types.futures.options.historical.test(symbol));
    }
    /**
     * Returns true when a symbol represents a foreign exchange currency pair. However,
     * this function can return false positives (cyptocurrency symbols can use the same
     * pattern).
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsForex(symbol) {
      return is.string(symbol) && types.forex.test(symbol);
    }
    /**
     * Returns true when a symbol represents a cryptocurrency. However, this function can
     * return false positives (forex symbols can use the same pattern).
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsCrypto(symbol) {
      return is.string(symbol) && types.crypto.test(symbol);
    }
    /**
     * Returns true if the symbol represents an external index (i.e. an index
     * which is not generated by Barchart, e.g. the S&P 500).
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsIndex(symbol) {
      return is.string(symbol) && types.indicies.external.test(symbol);
    }
    /**
     * Returns true if the symbol represents an Barchart sector (i.e. a type
     * of index calculated by Barchart).
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsSector(symbol) {
      return is.string(symbol) && types.indicies.sector.test(symbol);
    }
    /**
     * Returns true if the symbol represents a Canadian mutual fund.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsCanadianFund(symbol) {
      return is.string(symbol) && types.funds.canadian.test(symbol);
    }
    /**
     * Returns true if the symbol represents an instrument which falls under the
     * cmdty brand.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsCmdty(symbol) {
      return is.string(symbol) && (types.cmdty.stats.test(symbol) || types.cmdty.internal.test(symbol) || types.cmdty.external.test(symbol));
    }
    /**
     * Returns true if the symbol represents cmdtyStats symbol.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsCmdtyStats(symbol) {
      return is.string(symbol) && types.cmdty.stats.test(symbol);
    }
    /**
     * Returns true if the symbol is listed on the BATS exchange.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsBats(symbol) {
      return is.string(symbol) && predicates.bats.test(symbol);
    }
    /**
     * Returns true if the symbol represents an option on an equity or index; false
     * otherwise.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsEquityOption(symbol) {
      return is.string(symbol) && types.equities.options.test(symbol);
    }
    /**
     * Returns true if the symbol has an expiration and the symbol appears
     * to be expired (e.g. a future for a past year).
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsExpired(symbol) {
      const definition = SymbolParser.parseInstrumentType(symbol);
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
    }
    /**
     * Returns true if the symbol represents a Commodity3 instrument.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsC3(symbol) {
      return is.string(symbol) && (types.c3.concrete.test(symbol) || types.c3.alias.test(symbol));
    }
    /**
     * Returns true if the symbol represents a Platts instrument.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static getIsPlatts(symbol) {
      return is.string(symbol) && (types.platts.concrete.test(symbol) || types.platts.alias.test(symbol));
    }
    /**
     * Returns true if the symbol represents a pit-traded instrument. The
     * name must also be included.
     *
     * @public
     * @static
     * @param {String} symbol
     * @param {String} name
     * @returns {Boolean}
     */


    static getIsPit(symbol, name) {
      return is.string(symbol) && is.string(name) && predicates.pit.test(name);
    }
    /**
     * Returns a simple instrument definition containing information which
     * can be inferred from the symbol. A null value is returned if nothing
     * can be inferred based solely on the symbol.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Object|null}
     */


    static parseInstrumentType(symbol) {
      if (!is.string(symbol)) {
        return null;
      }

      let definition = null;

      for (let i = 0; i < parsers.length && definition === null; i++) {
        const parser = parsers[i];
        definition = parser(symbol);
      }

      return definition;
    }
    /**
     * In some cases, multiple symbols can be used to refer to the same instrument
     * (e.g. ZCZ1 and ZCZ21 may refer to the same futures contract). That said,
     * internal quote servers may only recognize one of the symbols. So, given
     * a symbol, this function will return the symbol which the internal quote
     * servers will recognize. In other words, the symbol used by the quote "producer"
     * is returned. In most cases, the same symbol is returned.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {String|null}
     */


    static getProducerSymbol(symbol) {
      if (!is.string(symbol)) {
        return null;
      }

      let converted = null;

      for (let i = 0; i < converters.length && converted === null; i++) {
        const converter = converters[i];
        converted = converter(symbol);
      }

      return converted;
    }
    /**
     * Converts a futures option symbol in "database" format to "pipeline" format
     * (e.g. ZLF320Q -> ZLF9|320C).
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {String|null}
     */


    static getFuturesOptionPipelineFormat(symbol) {
      const definition = SymbolParser.parseInstrumentType(symbol);
      let formatted = null;

      if (definition.type === 'future_option') {
        const putCallCharacter = getPutCallCharacter(definition.option_type);
        formatted = `${definition.root}${definition.month}${getYearDigits(definition.year, 1)}|${definition.strike}${putCallCharacter}`;
      }

      return formatted;
    }
    /**
     * Converts an abbreviated futures symbol (with a single digit year) into
     * a futures symbol with a two digit year. If the symbol is not a futures
     * contract, a null value is returned.
     *
     * @static
     * @public
     * @param {String} symbol
     * @returns {String|null}
     */


    static getFuturesExplicitFormat(symbol) {
      let explicit = null;

      if (SymbolParser.getIsFuture(symbol) && SymbolParser.getIsConcrete(symbol)) {
        const parsed = SymbolParser.parseInstrumentType(symbol);
        explicit = `${parsed.root}${parsed.month}${string.padLeft(Math.floor(parsed.year % 100).toString(), 2, '0')}`;
      }

      return explicit;
    }
    /**
     * Returns true if prices for the symbol should be represented as a percentage; false
     * otherwise.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */


    static displayUsingPercent(symbol) {
      return is.string(symbol) && predicates.percent.test(symbol);
    }

    toString() {
      return '[SymbolParser]';
    }

  }

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
  predicates.pit = /\(P(it)?\)/;
  const types = {};
  types.c3 = {};
  types.c3.alias = /^(C3:)(.*)$/i;
  types.c3.concrete = /(\.C3)$/i;
  types.cmdty = {};
  types.cmdty.stats = /(\.CS)$/i;
  types.cmdty.internal = /(\.CM)$/i;
  types.cmdty.external = /(\.CP)$/i;
  types.crypto = /^\^([A-Z]{3})([A-Z]{3,4})$/i;
  types.equities = {};
  types.equities.options = /^([A-Z\$][A-Z\-]{0,}(\.[A-Z]{1})?)([0-9]?)(\.[A-Z]{2})?\|([[0-9]{4})([[0-9]{2})([[0-9]{2})\|([0-9]+\.[0-9]+)[P|W]?(C|P)/i;
  types.forex = /^\^([A-Z]{3})([A-Z]{3})$/i;
  types.funds = {};
  types.funds.canadian = /(.*)(\.CF)$/i;
  types.futures = {};
  types.futures.alias = /^([A-Z][A-Z0-9\$\-!\.]{0,2})(\*{1})([0-9]{1,2})$/i;
  types.futures.concrete = /^([A-Z][A-Z0-9\$\-!\.]{0,2})([A-Z]{1})([0-9]{4}|[0-9]{1,2})$/i;
  types.futures.spread = /^_S_/i;
  types.futures.options = {};
  types.futures.options.historical = /^([A-Z][A-Z0-9\$\-!\.]{0,2})([A-Z])([0-9]{2})([0-9]{1,5})(C|P)$/i;
  types.futures.options.long = /^([A-Z][A-Z0-9\$\-!\.]{0,2})([A-Z])([0-9]{1,4})\|(\-?[0-9]{1,5})(C|P)$/i;
  types.futures.options.short = /^([A-Z][A-Z0-9\$\-!\.]?)([A-Z])([0-9]{1,4})([A-Z])$/i;
  types.indicies = {};
  types.indicies.external = /^\$(.*)$/i;
  types.indicies.sector = /^\-(.*)$/i;
  types.platts = {};
  types.platts.alias = /^(PLATTS:)(.*)$/i;
  types.platts.concrete = /^(.*)(\.PT)$/i;
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
      definition.asset = AssetClass.FUTURE;
      definition.dynamic = false;
      definition.root = match[1];
      definition.month = match[2];
      definition.year = getFuturesYear(match[3], match[2]);
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
      definition.asset = AssetClass.FUTURE;
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
      definition.asset = AssetClass.FOREX;
    }

    return definition;
  });
  parsers.push(symbol => {
    let definition = null;
    const match = symbol.match(types.equities.options);

    if (match !== null) {
      const suffix = typeof match[4] !== 'undefined' ? match[4] : '';
      definition = {};
      definition.symbol = symbol;
      definition.type = 'equity_option';
      definition.asset = AssetClass.STOCK_OPTION;
      definition.option_type = match[9] === 'C' ? 'call' : 'put';
      definition.strike = parseFloat(match[8]);
      definition.root = `${match[1]}${suffix}`;
      definition.month = parseInt(match[6]);
      definition.day = parseInt(match[7]);
      definition.year = parseInt(match[5]);
      definition.adjusted = match[3] !== '';
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
      definition.asset = AssetClass.FUTURE_OPTION;
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
      definition.asset = AssetClass.FUTURE_OPTION;
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

    if (SymbolParser.getIsFuture(symbol) && SymbolParser.getIsConcrete(symbol)) {
      converted = symbol.replace(/(.{1,3})([A-Z]{1})([0-9]{3}|[0-9]{1})?([0-9]{1})$/i, '$1$2$4') || null;
    }

    return converted;
  });
  converters.push(symbol => {
    let converted = null;

    if (SymbolParser.getIsFutureOption(symbol)) {
      const definition = SymbolParser.parseInstrumentType(symbol);
      const putCallCharacter = getPutCallCharacter(definition.option_type);

      if (definition.root.length < 3) {
        const putCallCharacterCode = putCallCharacter.charCodeAt(0); // 2021/01/02, BRI. Per Tom, symbols (for the same instrument) change each year.
        // For calls that expire this year, the letter is "C" ... For calls that expire next
        // year, the letter is "D" ... For calls that expire two years from now, the letter
        // is "E" ... etc ...

        converted = `${definition.root}${definition.month}${definition.strike}${String.fromCharCode(putCallCharacterCode + definition.year - getCurrentYear())}`;
      } else {
        converted = `${definition.root}${definition.month}${getYearDigits(definition.year, 1)}|${definition.strike}${putCallCharacter}`;
      }
    }

    return converted;
  });
  converters.push(symbol => {
    let converted = null;

    if (types.c3.alias.test(symbol)) {
      converted = symbol.replace(types.c3.alias, '$2.C3');
    }

    return converted;
  });
  converters.push(symbol => {
    let converted = null;

    if (types.platts.alias.test(symbol)) {
      converted = symbol.replace(types.platts.alias, '$2.PT');
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

  function getFuturesYear(yearString, monthCode) {
    const currentYear = getCurrentYear();
    let year = parseInt(yearString);

    if (year === 0 && monthCode === 'Y') {
      year = Math.floor(currentYear / 100) * 100 + 100;
    } else if (year < 10 && yearString.length === 1) {
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

  return SymbolParser;
})();

},{"./../data/AssetClass":13,"@barchart/common-js/lang/is":35,"@barchart/common-js/lang/string":37}],31:[function(require,module,exports){
const assert = require('./assert');

module.exports = (() => {
  'use strict';

  const types = new Map();
  /**
   * An enumeration. Must be inherited. Do not instantiate directly.
   * Also, this class uses the ES6 Map, therefore a polyfill must
   * be supplied.
   *
   * @public
   * @interface
   * @param {String} code - The unique code of the enumeration item.
   * @param {String} description - A description of the enumeration item.
   */

  class Enum {
    constructor(code, description) {
      assert.argumentIsRequired(code, 'code', String);
      assert.argumentIsRequired(description, 'description', String);
      this._code = code;
      this._description = description;
      const c = this.constructor;

      if (!types.has(c)) {
        types.set(c, []);
      }

      const existing = Enum.fromCode(c, code);

      if (existing === null) {
        types.get(c).push(this);
      }
    }
    /**
     * The unique code.
     *
     * @public
     * @returns {String}
     */


    get code() {
      return this._code;
    }
    /**
     * The description.
     *
     * @public
     * @returns {String}
     */


    get description() {
      return this._description;
    }
    /**
     * Returns true if the provided {@link Enum} argument is equal
     * to the instance.
     *
     * @public
     * @param {Enum} other
     * @returns {boolean}
     */


    equals(other) {
      return other === this || other instanceof Enum && other.constructor === this.constructor && other.code === this.code;
    }
    /**
     * Returns the JSON representation.
     *
     * @public
     * @returns {String}
     */


    toJSON() {
      return this.code;
    }
    /**
     * Looks up a enumeration item; given the enumeration type and the enumeration
     * item's value. If no matching item can be found, a null value is returned.
     *
     * @public
     * @static
     * @param {Function} type - The enumeration type.
     * @param {String} code - The enumeration item's code.
     * @returns {*|null}
     */


    static fromCode(type, code) {
      return Enum.getItems(type).find(x => x.code === code) || null;
    }
    /**
     * Returns all of the enumeration's items (given an enumeration type).
     *
     * @public
     * @static
     * @param {Function} type - The enumeration to list.
     * @returns {Array}
     */


    static getItems(type) {
      return types.get(type) || [];
    }

    toString() {
      return '[Enum]';
    }

  }

  return Enum;
})();

},{"./assert":34}],32:[function(require,module,exports){
const moment = require('moment-timezone/builds/moment-timezone-with-data-2012-2022');

const Enum = require('./Enum'),
      is = require('./is'),
      timezone = require('./timezone');

module.exports = (() => {
  'use strict';
  /**
   * An enumeration item that lists timezones, according to the common names
   * used in the tz database (see https://en.wikipedia.org/wiki/Tz_database).
   * The full list of names is sourced from moment.js; however, this wikipedia
   * article lists them: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   *
   * @public
   * @param {String} code - The timezone name
   * @extends {Enum}
   */

  class Timezones extends Enum {
    constructor(code) {
      super(code, code);
    }
    /**
     * Attempts to determine if daylight savings time is in effect.
     *
     * @public
     * @param {Number=} timestamp - The moment at which the daylight savings time is checked, otherwise now.
     * @returns {Number}
     */


    getIsDaylightSavingsTime(timestamp) {
      let m;

      if (is.number(timestamp)) {
        m = moment(timestamp);
      } else {
        m = moment();
      }

      return m.tz(this.code).isDST();
    }
    /**
     * Calculates and returns the timezone's offset from UTC.
     *
     * @public
     * @param {Number=} timestamp - The moment at which the offset is calculated, otherwise now.
     * @param {Boolean=} milliseconds - If true, the offset is returned in milliseconds; otherwise minutes.
     * @returns {Number}
     */


    getUtcOffset(timestamp, milliseconds) {
      let timestampToUse;

      if (is.number(timestamp)) {
        timestampToUse = timestamp;
      } else {
        timestampToUse = new Date().getTime();
      }

      let multiplier;

      if (is.boolean(milliseconds) && milliseconds) {
        multiplier = 60 * 1000;
      } else {
        multiplier = 1;
      }

      const offset = moment.tz.zone(this.code).utcOffset(timestampToUse) * multiplier;

      if (offset !== 0) {
        return offset * -1;
      } else {
        return 0;
      }
    }
    /**
     *
     * Given a code, returns the enumeration item.
     *
     * @public
     * @param {String} code
     * @returns {Timezones|null}
     */


    static parse(code) {
      return Enum.fromCode(Timezones, code);
    }
    /**
     * UTC
     *
     * @public
     * @static
     * @returns {Timezones}
     */


    static get UTC() {
      return utc;
    }
    /**
     * America/Chicago
     *
     * @public
     * @static
     * @returns {Timezones}
     */


    static get AMERICA_CHICAGO() {
      return america_chicago;
    }
    /**
     * America/New_York
     *
     * @public
     * @static
     * @returns {Timezones}
     */


    static get AMERICA_NEW_YORK() {
      return america_new_york;
    }

    toString() {
      return `[Timezone (name=${this.code})]`;
    }

  }

  timezone.getTimezones().forEach(name => new Timezones(name));
  const utc = Enum.fromCode(Timezones, 'UTC');
  const america_chicago = Enum.fromCode(Timezones, 'America/Chicago');
  const america_new_york = Enum.fromCode(Timezones, 'America/New_York');
  return Timezones;
})();

},{"./Enum":31,"./is":35,"./timezone":38,"moment-timezone/builds/moment-timezone-with-data-2012-2022":45}],33:[function(require,module,exports){
const assert = require('./assert'),
      is = require('./is');

module.exports = (() => {
  'use strict';
  /**
   * Utilities for working with arrays.
   *
   * @public
   * @module lang/array
   */

  return {
    /**
     * Returns the unique items from an array, where the unique
     * key is determined via a strict equality check.
     *
     * @static
     * @param {Array} a
     * @returns {Array}
     */
    unique(a) {
      assert.argumentIsArray(a, 'a');
      return this.uniqueBy(a, item => item);
    },

    /**
     * Returns the unique items from an array, where the unique
     * key is determined by a delegate.
     *
     * @static
     * @param {Array} a
     * @param {Function} keySelector - A function that returns a unique key for an item.
     * @returns {Array}
     */
    uniqueBy(a, keySelector) {
      assert.argumentIsArray(a, 'a');
      return a.filter((item, index, array) => {
        const key = keySelector(item);
        return array.findIndex(candidate => key === keySelector(candidate)) === index;
      });
    },

    /**
     * Splits array into groups and returns an object (where the properties have
     * arrays). Unlike the indexBy function, there can be many items which share
     * the same key.
     *
     * @static
     * @param {Array} a
     * @param {Function} keySelector - A function that returns a unique key for an item.
     * @returns {Object}
     */
    groupBy(a, keySelector) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsRequired(keySelector, 'keySelector', Function);
      return a.reduce((groups, item) => {
        const key = keySelector(item);

        if (!groups.hasOwnProperty(key)) {
          groups[key] = [];
        }

        groups[key].push(item);
        return groups;
      }, {});
    },

    /**
     * Splits array into groups and returns an array of arrays where the items of each
     * nested array share a common key.
     *
     * @static
     * @param {Array} a
     * @param {Function} keySelector - A function that returns a unique key for an item.
     * @returns {Array}
     */
    batchBy(a, keySelector) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsRequired(keySelector, 'keySelector', Function);
      let currentKey = null;
      let currentBatch = null;
      return a.reduce((batches, item) => {
        const key = keySelector(item);

        if (currentBatch === null || currentKey !== key) {
          currentKey = key;
          currentBatch = [];
          batches.push(currentBatch);
        }

        currentBatch.push(item);
        return batches;
      }, []);
    },

    /**
     * Splits array into groups and returns an object (where the properties are items from the
     * original array). Unlike the groupBy, only one item can have a given key value.
     *
     * @static
     * @param {Array} a
     * @param {Function} keySelector - A function that returns a unique key for an item.
     * @returns {Object}
     */
    indexBy(a, keySelector) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsRequired(keySelector, 'keySelector', Function);
      return a.reduce((map, item) => {
        const key = keySelector(item);

        if (map.hasOwnProperty(key)) {
          throw new Error('Unable to index array. A duplicate key exists.');
        }

        map[key] = item;
        return map;
      }, {});
    },

    /**
     * Returns a new array containing all but the first item.
     *
     * @static
     * @param {Array} a
     * @returns {Array}
     */
    dropLeft(a) {
      assert.argumentIsArray(a, 'a');
      let returnRef = Array.from(a);

      if (returnRef.length !== 0) {
        returnRef.shift();
      }

      return returnRef;
    },

    /**
     * Returns a new array containing all but the last item.
     *
     * @static
     * @param {Array} a
     * @returns {Array}
     */
    dropRight(a) {
      assert.argumentIsArray(a, 'a');
      let returnRef = Array.from(a);

      if (returnRef.length !== 0) {
        returnRef.pop();
      }

      return returnRef;
    },

    /**
     * Returns the first item from an array, or an undefined value, if the
     * array is empty.
     *
     * @static
     * @param {Array} a
     * @returns {*|undefined}
     */
    first(a) {
      assert.argumentIsArray(a, 'a');
      let returnRef;

      if (a.length !== 0) {
        returnRef = a[0];
      } else {
        returnRef = undefined;
      }

      return returnRef;
    },

    /**
     * Returns the last item from an array, or an undefined value, if the
     * array is empty.
     *
     * @static
     * @param {Array} a
     * @returns {*|undefined}
     */
    last(a) {
      assert.argumentIsArray(a, 'a');
      let returnRef;

      if (a.length !== 0) {
        returnRef = a[a.length - 1];
      } else {
        returnRef = undefined;
      }

      return returnRef;
    },

    /**
     * Returns a copy of an array, replacing any item that is itself an array
     * with the item's items.
     *
     * @static
     * @param {Array} a
     * @param {Boolean=} recursive - If true, all nested arrays will be flattened.
     * @returns {Array}
     */
    flatten(a, recursive) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsOptional(recursive, 'recursive', Boolean);
      const empty = [];
      let flat = empty.concat.apply(empty, a);

      if (recursive && flat.some(x => is.array(x))) {
        flat = this.flatten(flat, true);
      }

      return flat;
    },

    /**
     * Breaks an array into smaller arrays, returning an array of arrays.
     *
     * @static
     * @param {Array} a
     * @param {Number} size - The maximum number of items per partition.
     * @param {Array<Array>}
     */
    partition(a, size) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsOptional(size, 'size', Number);
      const copy = a.slice(0);
      const partitions = [];

      while (copy.length !== 0) {
        partitions.push(copy.splice(0, size));
      }

      return partitions;
    },

    /**
     * Set difference operation, returning any item in "a" that is not
     * contained in "b" (using strict equality).
     *
     * @static
     * @param {Array} a
     * @param {Array} b
     * @returns {Array}
     */
    difference(a, b) {
      return this.differenceBy(a, b, item => item);
    },

    /**
     * Set difference operation, returning any item in "a" that is not
     * contained in "b" (where the uniqueness is determined by a delegate).
     *
     * @static
     * @param {Array} a
     * @param {Array} b
     * @param {Function} keySelector - A function that returns a unique key for an item.
     * @returns {Array}
     */
    differenceBy(a, b, keySelector) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsArray(b, 'b');
      assert.argumentIsRequired(keySelector, 'keySelector', Function);
      const returnRef = [];
      a.forEach(candidate => {
        const candidateKey = keySelector(candidate);
        const exclude = b.some(comparison => candidateKey === keySelector(comparison));

        if (!exclude) {
          returnRef.push(candidate);
        }
      });
      return returnRef;
    },

    /**
     * Set symmetric difference operation (using strict equality). In
     * other words, this is the union of the differences between the
     * sets.
     *
     * @static
     * @param {Array} a
     * @param {Array} b
     * @returns {Array}
     */
    differenceSymmetric(a, b) {
      return this.differenceSymmetricBy(a, b, item => item);
    },

    /**
     * Set symmetric difference operation, where the uniqueness is determined by a delegate.
     *
     * @static
     * @param {Array} a
     * @param {Array} b
     * @param {Function} keySelector - A function that returns a unique key for an item.
     * @returns {Array}
     */
    differenceSymmetricBy(a, b, keySelector) {
      return this.unionBy(this.differenceBy(a, b, keySelector), this.differenceBy(b, a, keySelector), keySelector);
    },

    /**
     * Set union operation (using strict equality).
     *
     * @static
     * @param {Array} a
     * @param {Array} b
     * @returns {Array}
     */
    union(a, b) {
      return this.unionBy(a, b, item => item);
    },

    /**
     * Set union operation, where the uniqueness is determined by a delegate.
     *
     * @static
     * @param {Array} a
     * @param {Array} b
     * @param {Function} keySelector - A function that returns a unique key for an item.
     * @returns {Array}
     */
    unionBy(a, b, keySelector) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsArray(b, 'b');
      assert.argumentIsRequired(keySelector, 'keySelector', Function);
      const returnRef = a.slice();
      b.forEach(candidate => {
        const candidateKey = keySelector(candidate);
        const exclude = returnRef.some(comparison => candidateKey === keySelector(comparison));

        if (!exclude) {
          returnRef.push(candidate);
        }
      });
      return returnRef;
    },

    /**
     * Set intersection operation (using strict equality).
     *
     * @static
     * @param {Array} a
     * @param {Array} b
     * @returns {Array}
     */
    intersection(a, b) {
      return this.intersectionBy(a, b, item => item);
    },

    /**
     * Set intersection operation, where the uniqueness is determined by a delegate.
     *
     * @static
     * @param {Array} a
     * @param {Array} b
     * @param {Function} keySelector - A function that returns a unique key for an item.
     * @returns {Array}
     */
    intersectionBy(a, b, keySelector) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsArray(b, 'b');
      const returnRef = [];
      a.forEach(candidate => {
        const candidateKey = keySelector(candidate);
        const include = b.some(comparison => candidateKey === keySelector(comparison));

        if (include) {
          returnRef.push(candidate);
        }
      });
      return returnRef;
    },

    /**
     * Removes the first item from an array which matches a predicate.
     *
     * @static
     * @public
     * @param {Array} a
     * @param {Function} predicate
     * @returns {Boolean}
     */
    remove(a, predicate) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsRequired(predicate, 'predicate', Function);
      const index = a.findIndex(predicate);
      const found = !(index < 0);

      if (found) {
        a.splice(index, 1);
      }

      return found;
    },

    /**
     * Inserts an item into an array using a binary search is used to determine the
     * proper point for insertion and returns the same array.
     *
     * @static
     * @public
     * @param {Array} a
     * @param {*} item
     * @param {Function} comparator
     * @returns {Array}
     */
    insert(a, item, comparator) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsRequired(comparator, 'comparator', Function);

      if (a.length === 0 || !(comparator(item, a[a.length - 1]) < 0)) {
        a.push(item);
      } else if (comparator(item, a[0]) < 0) {
        a.unshift(item);
      } else {
        a.splice(binarySearchForInsert(a, item, comparator, 0, a.length - 1), 0, item);
      }

      return a;
    },

    /**
     * Performs a binary search to locate an item within an array.
     *
     * @param {*[]} a
     * @param {*} key
     * @param {Function} comparator
     * @param {Number=} start
     * @param {Number=} end
     * @returns {*|null}
     */
    binarySearch(a, key, comparator, start, end) {
      assert.argumentIsArray(a, 'a');
      assert.argumentIsRequired(comparator, 'comparator', Function);
      assert.argumentIsOptional(start, 'start', Number);
      assert.argumentIsOptional(end, 'end', Number);

      if (a.length === 0) {
        return null;
      }

      return binarySearchForMatch(a, key, comparator, start || 0, end || a.length - 1);
    }

  };

  function binarySearchForMatch(a, key, comparator, start, end) {
    const size = end - start;
    const midpointIndex = start + Math.floor(size / 2);
    const midpointItem = a[midpointIndex];
    const comparison = comparator(key, midpointItem);

    if (comparison === 0) {
      return midpointItem;
    } else if (size < 2) {
      const finalIndex = a.length - 1;
      const finalItem = a[finalIndex];

      if (end === finalIndex && comparator(key, finalItem) === 0) {
        return finalItem;
      } else {
        return null;
      }
    } else if (comparison > 0) {
      return binarySearchForMatch(a, key, comparator, midpointIndex, end);
    } else {
      return binarySearchForMatch(a, key, comparator, start, midpointIndex);
    }
  }

  function binarySearchForInsert(a, item, comparator, start, end) {
    const size = end - start;
    const midpointIndex = start + Math.floor(size / 2);
    const midpointItem = a[midpointIndex];
    const comparison = comparator(item, midpointItem) > 0;

    if (size < 2) {
      if (comparison > 0) {
        const finalIndex = a.length - 1;

        if (end === finalIndex && comparator(item, a[finalIndex]) > 0) {
          return end + 1;
        } else {
          return end;
        }
      } else {
        return start;
      }
    } else if (comparison > 0) {
      return binarySearchForInsert(a, item, comparator, midpointIndex, end);
    } else {
      return binarySearchForInsert(a, item, comparator, start, midpointIndex);
    }
  }
})();

},{"./assert":34,"./is":35}],34:[function(require,module,exports){
const is = require('./is');

module.exports = (() => {
  'use strict';

  function checkArgumentType(variable, variableName, type, typeDescription, index) {
    if (type === String) {
      if (!is.string(variable)) {
        throwInvalidTypeError(variableName, 'string', index);
      }
    } else if (type === Number) {
      if (!is.number(variable)) {
        throwInvalidTypeError(variableName, 'number', index);
      }
    } else if (type === Function) {
      if (!is.fn(variable)) {
        throwInvalidTypeError(variableName, 'function', index);
      }
    } else if (type === Boolean) {
      if (!is.boolean(variable)) {
        throwInvalidTypeError(variableName, 'boolean', index);
      }
    } else if (type === Date) {
      if (!is.date(variable)) {
        throwInvalidTypeError(variableName, 'date', index);
      }
    } else if (type === Array) {
      if (!is.array(variable)) {
        throwInvalidTypeError(variableName, 'array', index);
      }
    } else if (!(variable instanceof (type || Object))) {
      throwInvalidTypeError(variableName, typeDescription, index);
    }
  }

  function throwInvalidTypeError(variableName, typeDescription, index) {
    let message;

    if (typeof index === 'number') {
      message = `The argument [ ${variableName || 'unspecified'} ], at index [ ${index.toString()} ] must be a [ ${typeDescription || 'unknown'} ]`;
    } else {
      message = `The argument [ ${variableName || 'unspecified'} ] must be a [ ${typeDescription || 'Object'} ]`;
    }

    throw new Error(message);
  }

  function throwCustomValidationError(variableName, predicateDescription) {
    throw new Error(`The argument [ ${variableName || 'unspecified'} ] failed a validation check [ ${predicateDescription || 'No description available'} ]`);
  }
  /**
   * Utilities checking arguments.
   *
   * @public
   * @module lang/assert
   */


  return {
    /**
     * Throws an error if an argument doesn't conform to the desired specification (as
     * determined by a type check).
     *
     * @static
     * @param {*} variable - The value to check.
     * @param {String=} variableName - The name of the value (used for formatting an error message).
     * @param {*=} type - The expected type of the argument.
     * @param {String=} typeDescription - The description of the expected type (used for formatting an error message).
     */
    argumentIsRequired(variable, variableName, type, typeDescription) {
      checkArgumentType(variable, variableName, type, typeDescription);
    },

    /**
     * A relaxed version of the "argumentIsRequired" function that will not throw if
     * the value is undefined or null.
     *
     * @static
     * @param {*} variable - The value to check.
     * @param {String=} variableName - The name of the value (used for formatting an error message).
     * @param {*=} type - The expected type of the argument.
     * @param {String=} typeDescription - The description of the expected type (used for formatting an error message).
     */
    argumentIsOptional(variable, variableName, type, typeDescription, predicate, predicateDescription) {
      if (variable === null || variable === undefined) {
        return;
      }

      checkArgumentType(variable, variableName, type, typeDescription);

      if (is.fn(predicate) && !predicate(variable)) {
        throwCustomValidationError(variableName, predicateDescription);
      }
    },

    argumentIsArray(variable, variableName, itemConstraint, itemConstraintDescription) {
      this.argumentIsRequired(variable, variableName, Array);

      if (itemConstraint) {
        let itemValidator;

        if (typeof itemConstraint === 'function' && itemConstraint !== Function) {
          itemValidator = (value, index) => itemConstraint.prototype !== undefined && value instanceof itemConstraint || itemConstraint(value, `${variableName}[${index}]`);
        } else {
          itemValidator = (value, index) => checkArgumentType(value, variableName, itemConstraint, itemConstraintDescription, index);
        }

        variable.forEach((v, i) => {
          itemValidator(v, i);
        });
      }
    },

    /**
     * Throws an error if an argument doesn't conform to the desired specification
     * (as determined by a predicate).
     *
     * @static
     * @param {*} variable - The value to check.
     * @param {String=} variableName - The name of the value (used for formatting an error message).
     * @param {Function=} predicate - A function used to validate the item (beyond type checking).
     * @param {String=} predicateDescription - A description of the assertion made by the predicate (e.g. "is an integer") that is used for formatting an error message.
     */
    argumentIsValid(variable, variableName, predicate, predicateDescription) {
      if (!predicate(variable)) {
        throwCustomValidationError(variableName, predicateDescription);
      }
    },

    areEqual(a, b, descriptionA, descriptionB) {
      if (a !== b) {
        throw new Error(`The objects must be equal [${descriptionA || a.toString()}] and [${descriptionB || b.toString()}]`);
      }
    },

    areNotEqual(a, b, descriptionA, descriptionB) {
      if (a === b) {
        throw new Error(`The objects cannot be equal [${descriptionA || a.toString()}] and [${descriptionB || b.toString()}]`);
      }
    }

  };
})();

},{"./is":35}],35:[function(require,module,exports){
module.exports = (() => {
  'use strict';
  /**
   * Utilities for interrogating variables (e.g. checking data types).
   *
   * @public
   * @module lang/is
   */

  return {
    /**
     * Returns true if the argument is a number. NaN will return false.
     *
     * @static
     * @public
     * @param {*} candidate {*}
     * @returns {boolean}
     */
    number(candidate) {
      return typeof candidate === 'number' && !isNaN(candidate);
    },

    /**
     * Returns true if the argument is NaN.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    nan(candidate) {
      return typeof candidate === 'number' && isNaN(candidate);
    },

    /**
     * Returns true if the argument is a valid 32-bit integer.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    integer(candidate) {
      return typeof candidate === 'number' && !isNaN(candidate) && (candidate | 0) === candidate;
    },

    /**
     * Returns true if the argument is a valid integer (which can exceed 32 bits); however,
     * the check can fail above the value of Number.MAX_SAFE_INTEGER.
     *
     * @static
     * @public
     * @param {*) candidate
     * @returns {boolean}
     */
    large(candidate) {
      return typeof candidate === 'number' && !isNaN(candidate) && isFinite(candidate) && Math.floor(candidate) === candidate;
    },

    /**
     * Returns true if the argument is a number that is positive.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    positive(candidate) {
      return this.number(candidate) && candidate > 0;
    },

    /**
     * Returns true if the argument is a number that is negative.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    negative(candidate) {
      return this.number(candidate) && candidate < 0;
    },

    /**
     * Returns true if the argument is iterable.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    iterable(candidate) {
      return !this.null(candidate) && !this.undefined(candidate) && this.fn(candidate[Symbol.iterator]);
    },

    /**
     * Returns true if the argument is a string.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    string(candidate) {
      return typeof candidate === 'string';
    },

    /**
     * Returns true if the argument is a JavaScript Date instance.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    date(candidate) {
      return candidate instanceof Date;
    },

    /**
     * Returns true if the argument is a function.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    fn(candidate) {
      return typeof candidate === 'function';
    },

    /**
     * Returns true if the argument is an array.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    array(candidate) {
      return Array.isArray(candidate);
    },

    /**
     * Returns true if the argument is a Boolean value.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    boolean(candidate) {
      return typeof candidate === 'boolean';
    },

    /**
     * Returns true if the argument is an object.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    object(candidate) {
      return typeof candidate === 'object' && candidate !== null;
    },

    /**
     * Returns true if the argument is a null value.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    null(candidate) {
      return candidate === null;
    },

    /**
     * Returns true if the argument is an undefined value.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    undefined(candidate) {
      return candidate === undefined;
    },

    /**
     * Returns true if the argument is a zero-length string.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    zeroLengthString(candidate) {
      return this.string(candidate) && candidate.length === 0;
    },

    /**
     * Given two classes, determines if the "child" class extends
     * the "parent" class (without instantiation).
     *
     * @param {Function} parent
     * @param {Function} child
     * @returns {Boolean}
     */
    extension(parent, child) {
      return this.fn(parent) && this.fn(child) && child.prototype instanceof parent;
    }

  };
})();

},{}],36:[function(require,module,exports){
const array = require('./array'),
      is = require('./is');

module.exports = (() => {
  'use strict';
  /**
   * Utilities for working with objects.
   *
   * @public
   * @module lang/object
   */

  const object = {
    /**
     * Performs "deep" equality check on two objects.
     *
     * Array items are compared, object properties are compared, and
     * "primitive" values are checked using strict equality rules.
     *
     * @static
     * @param {Object} a
     * @param {Object} b
     * @returns {Boolean}
     */
    equals(a, b) {
      let returnVal;

      if (a === b) {
        returnVal = true;
      } else if (is.array(a) && is.array(b)) {
        if (a.length === b.length) {
          returnVal = a.length === 0 || a.every((x, i) => object.equals(x, b[i]));
        } else {
          returnVal = false;
        }
      } else if (is.object(a) && is.object(b)) {
        if (is.fn(a.equals) && is.fn(b.equals)) {
          returnVal = a.equals(b);
        } else {
          const keysA = object.keys(a);
          const keysB = object.keys(b);
          returnVal = array.differenceSymmetric(keysA, keysB).length === 0 && keysA.every(key => {
            const valueA = a[key];
            const valueB = b[key];
            return object.equals(valueA, valueB);
          });
        }
      } else {
        returnVal = false;
      }

      return returnVal;
    },

    /**
     * Performs a "deep" copy.
     *
     * @static
     * @param {Object} source - The object to copy.
     * @param {Function=} canExtract - An optional function which indicates if the "extractor" can be used.
     * @param {Function=} extractor - An optional function which returns a cloned value for a property for assignment to the cloned object.
     * @returns {Object}
     */
    clone(source, canExtract, extractor) {
      let c;

      if (is.fn(canExtract) && canExtract(source)) {
        c = extractor(source);
      } else if (is.date(source)) {
        c = new Date(source.getTime());
      } else if (is.array(source)) {
        c = source.map(sourceItem => {
          return object.clone(sourceItem, canExtract, extractor);
        });
      } else if (is.object(source)) {
        c = object.keys(source).reduce((accumulator, key) => {
          accumulator[key] = object.clone(source[key], canExtract, extractor);
          return accumulator;
        }, {});
      } else {
        c = source;
      }

      return c;
    },

    /**
     * Creates a new object (or array) by performing a deep copy
     * of the properties from each object. If the same property
     * exists on both objects, the property value from the
     * second object ("b") is preferred.
     *
     * @static
     * @param {Object} a
     * @param {Object} b
     * @returns {Object}
     */
    merge(a, b) {
      let m;
      const mergeTarget = is.object(a) && !is.array(a);
      const mergeSource = is.object(b) && !is.array(b);

      if (mergeTarget && mergeSource) {
        const properties = array.unique(object.keys(a).concat(object.keys(b)));
        m = properties.reduce((accumulator, property) => {
          accumulator[property] = object.merge(a[property], b[property]);
          return accumulator;
        }, {});
      } else if (is.undefined(b)) {
        m = object.clone(a);
      } else {
        m = object.clone(b);
      }

      return m;
    },

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

},{"./array":33,"./is":35}],37:[function(require,module,exports){
const assert = require('./assert'),
      is = require('./is');

module.exports = (() => {
  'use strict';

  const regex = {};
  regex.camel = {};
  regex.camel.violations = /\b[A-Z]/g;
  /**
   * Utility functions for strings.
   *
   * @public
   * @module lang/string
   */

  return {
    /**
     * Adjusts a string, replacing the first character of each word with an uppercase
     * character and all subsequent characters in the word with lowercase characters.
     *
     * @public
     * @static
     * @param {String} s
     * @returns {String}
     */
    startCase(s) {
      return s.split(' ').reduce((phrase, word) => {
        if (word.length !== 0) {
          phrase.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
        }

        return phrase;
      }, []).join(' ');
    },

    /**
     * Adjust a string to use camel case, where the first letter of each word is replaced
     * with a lower case character.
     *
     * @public
     * @static
     * @param {String} s
     * @returns {String}
     */
    camelCase(s) {
      assert.argumentIsRequired(s, 's', String);
      return s.replace(regex.camel.violations, m => m.toLocaleLowerCase());
    },

    /**
     * If a string exceeds a desired length, it is truncated and a poor man's
     * ellipsis (i.e. three periods) is appended. Otherwise, the original
     * string is returned.
     *
     * @public
     * @static
     * @param {String} s
     * @param {Number} length
     * @returns {String}
     */
    truncate(s, length) {
      if (is.string(s) && s.length > length) {
        return s.substring(0, length) + ' ...';
      } else {
        return s;
      }
    },

    /**
     * Adds leading characters to a string, until the string length is a desired size.
     *
     * @public
     * @static
     * @param {String} s - The string to pad.
     * @param {Number} length - The desired overall length of the string.
     * @param {String} character - The character to use for padding.
     * @returns {String}
     */
    padLeft(s, length, character) {
      assert.argumentIsRequired(s, 's', String);
      assert.argumentIsRequired(length, 'length', Number);
      assert.argumentIsRequired(character, 'character', String);

      if (character.length !== 1) {
        throw new Error('The "character" argument must be one character in length.');
      }

      return character.repeat(length - s.length) + s;
    },

    /**
     * Performs a simple token replacement on a string; where the tokens
     * are braced numbers (e.g. {0}, {1}, {2}).
     *
     * @public
     * @static
     * @param {String} s - The string to format (e.g. 'my first name is {0} and my last name is {1}')
     * @param {Array<String>} data - The replacement data
     * @returns {String}
     */
    format(s, ...data) {
      assert.argumentIsRequired(s, 's', String);
      return s.replace(/{(\d+)}/g, (match, i) => {
        let replacement;

        if (i < data.length) {
          const item = data[i];

          if (!is.undefined(item) && !is.null(item)) {
            replacement = item.toString();
          } else {
            replacement = match;
          }
        } else {
          replacement = match;
        }

        return replacement;
      });
    }

  };
})();

},{"./assert":34,"./is":35}],38:[function(require,module,exports){
const moment = require('moment-timezone/builds/moment-timezone-with-data-2012-2022'),
      assert = require('./assert');

module.exports = (() => {
  'use strict';
  /**
   * Utilities for working with timezones.
   *
   * @public
   * @module lang/timezone
   */

  return {
    /**
     * Gets a list of names in the tz database (see https://en.wikipedia.org/wiki/Tz_database
     * and https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
     *
     * @public
     * @static
     * @returns {Array<String>}
     */
    getTimezones() {
      return moment.tz.names();
    },

    /**
     * Indicates if a timezone name exists.
     *
     * @public
     * @static
     * @param {String} name - The timezone name to find.
     * @returns {Boolean}
     */
    hasTimezone(name) {
      assert.argumentIsRequired(name, 'name', String);
      return this.getTimezones().some(candidate => {
        return candidate === name;
      });
    },

    /**
     * Attempts to guess the timezone of the current computer.
     *
     * @public
     * @static
     * @returns {String|null}
     */
    guessTimezone() {
      return moment.tz.guess() || null;
    }

  };
})();

},{"./assert":34,"moment-timezone/builds/moment-timezone-with-data-2012-2022":45}],39:[function(require,module,exports){
'use strict'

/**
 * "Shallow freezes" an object to render it immutable.
 * Uses `Object.freeze` if available,
 * otherwise the immutability is only in the type.
 *
 * Is used to create "enum like" objects.
 *
 * @template T
 * @param {T} object the object to freeze
 * @param {Pick<ObjectConstructor, 'freeze'> = Object} oc `Object` by default,
 * 				allows to inject custom object constructor for tests
 * @returns {Readonly<T>}
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 */
function freeze(object, oc) {
	if (oc === undefined) {
		oc = Object
	}
	return oc && typeof oc.freeze === 'function' ? oc.freeze(object) : object
}

/**
 * All mime types that are allowed as input to `DOMParser.parseFromString`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString#Argument02 MDN
 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#domparsersupportedtype WHATWG HTML Spec
 * @see DOMParser.prototype.parseFromString
 */
var MIME_TYPE = freeze({
	/**
	 * `text/html`, the only mime type that triggers treating an XML document as HTML.
	 *
	 * @see DOMParser.SupportedType.isHTML
	 * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
	 * @see https://en.wikipedia.org/wiki/HTML Wikipedia
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
	 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring WHATWG HTML Spec
	 */
	HTML: 'text/html',

	/**
	 * Helper method to check a mime type if it indicates an HTML document
	 *
	 * @param {string} [value]
	 * @returns {boolean}
	 *
	 * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
	 * @see https://en.wikipedia.org/wiki/HTML Wikipedia
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
	 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring 	 */
	isHTML: function (value) {
		return value === MIME_TYPE.HTML
	},

	/**
	 * `application/xml`, the standard mime type for XML documents.
	 *
	 * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType registration
	 * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
	 * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
	 */
	XML_APPLICATION: 'application/xml',

	/**
	 * `text/html`, an alias for `application/xml`.
	 *
	 * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
	 * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
	 * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
	 */
	XML_TEXT: 'text/xml',

	/**
	 * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
	 * but is parsed as an XML document.
	 *
	 * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType registration
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
	 * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
	 */
	XML_XHTML_APPLICATION: 'application/xhtml+xml',

	/**
	 * `image/svg+xml`,
	 *
	 * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
	 * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
	 * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
	 */
	XML_SVG_IMAGE: 'image/svg+xml',
})

/**
 * Namespaces that are used in this code base.
 *
 * @see http://www.w3.org/TR/REC-xml-names
 */
var NAMESPACE = freeze({
	/**
	 * The XHTML namespace.
	 *
	 * @see http://www.w3.org/1999/xhtml
	 */
	HTML: 'http://www.w3.org/1999/xhtml',

	/**
	 * Checks if `uri` equals `NAMESPACE.HTML`.
	 *
	 * @param {string} [uri]
	 *
	 * @see NAMESPACE.HTML
	 */
	isHTML: function (uri) {
		return uri === NAMESPACE.HTML
	},

	/**
	 * The SVG namespace.
	 *
	 * @see http://www.w3.org/2000/svg
	 */
	SVG: 'http://www.w3.org/2000/svg',

	/**
	 * The `xml:` namespace.
	 *
	 * @see http://www.w3.org/XML/1998/namespace
	 */
	XML: 'http://www.w3.org/XML/1998/namespace',

	/**
	 * The `xmlns:` namespace
	 *
	 * @see https://www.w3.org/2000/xmlns/
	 */
	XMLNS: 'http://www.w3.org/2000/xmlns/',
})

exports.freeze = freeze;
exports.MIME_TYPE = MIME_TYPE;
exports.NAMESPACE = NAMESPACE;

},{}],40:[function(require,module,exports){
var conventions = require("./conventions");
var dom = require('./dom')
var entities = require('./entities');
var sax = require('./sax');

var DOMImplementation = dom.DOMImplementation;

var NAMESPACE = conventions.NAMESPACE;

var ParseError = sax.ParseError;
var XMLReader = sax.XMLReader;

/**
 * Normalizes line ending according to https://www.w3.org/TR/xml11/#sec-line-ends:
 *
 * > XML parsed entities are often stored in computer files which,
 * > for editing convenience, are organized into lines.
 * > These lines are typically separated by some combination
 * > of the characters CARRIAGE RETURN (#xD) and LINE FEED (#xA).
 * >
 * > To simplify the tasks of applications, the XML processor must behave
 * > as if it normalized all line breaks in external parsed entities (including the document entity)
 * > on input, before parsing, by translating all of the following to a single #xA character:
 * >
 * > 1. the two-character sequence #xD #xA
 * > 2. the two-character sequence #xD #x85
 * > 3. the single character #x85
 * > 4. the single character #x2028
 * > 5. any #xD character that is not immediately followed by #xA or #x85.
 *
 * @param {string} input
 * @returns {string}
 */
function normalizeLineEndings(input) {
	return input
		.replace(/\r[\n\u0085]/g, '\n')
		.replace(/[\r\u0085\u2028]/g, '\n')
}

/**
 * @typedef Locator
 * @property {number} [columnNumber]
 * @property {number} [lineNumber]
 */

/**
 * @typedef DOMParserOptions
 * @property {DOMHandler} [domBuilder]
 * @property {Function} [errorHandler]
 * @property {(string) => string} [normalizeLineEndings] used to replace line endings before parsing
 * 						defaults to `normalizeLineEndings`
 * @property {Locator} [locator]
 * @property {Record<string, string>} [xmlns]
 *
 * @see normalizeLineEndings
 */

/**
 * The DOMParser interface provides the ability to parse XML or HTML source code
 * from a string into a DOM `Document`.
 *
 * _xmldom is different from the spec in that it allows an `options` parameter,
 * to override the default behavior._
 *
 * @param {DOMParserOptions} [options]
 * @constructor
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-parsing-and-serialization
 */
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
	var isHTML = /\/x?html?$/.test(mimeType);//mimeType.toLowerCase().indexOf('html') > -1;
  	var entityMap = isHTML ? entities.HTML_ENTITIES : entities.XML_ENTITIES;
	if(locator){
		domBuilder.setDocumentLocator(locator)
	}

	sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
	sax.domBuilder = options.domBuilder || domBuilder;
	if(isHTML){
		defaultNSMap[''] = NAMESPACE.HTML;
	}
	defaultNSMap.xml = defaultNSMap.xml || NAMESPACE.XML;
	var normalize = options.normalizeLineEndings || normalizeLineEndings;
	if (source && typeof source === 'string') {
		sax.parse(
			normalize(source),
			defaultNSMap,
			entityMap
		)
	} else {
		sax.errorHandler.error('invalid doc source')
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
					this.doc.doctype = dt;
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
		throw new ParseError(error, this.locator);
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

exports.__DOMHandler = DOMHandler;
exports.normalizeLineEndings = normalizeLineEndings;
exports.DOMParser = DOMParser;

},{"./conventions":39,"./dom":41,"./entities":42,"./sax":44}],41:[function(require,module,exports){
var conventions = require("./conventions");

var NAMESPACE = conventions.NAMESPACE;

/**
 * A prerequisite for `[].filter`, to drop elements that are empty
 * @param {string} input
 * @returns {boolean}
 */
function notEmptyString (input) {
	return input !== ''
}
/**
 * @see https://infra.spec.whatwg.org/#split-on-ascii-whitespace
 * @see https://infra.spec.whatwg.org/#ascii-whitespace
 *
 * @param {string} input
 * @returns {string[]} (can be empty)
 */
function splitOnASCIIWhitespace(input) {
	// U+0009 TAB, U+000A LF, U+000C FF, U+000D CR, U+0020 SPACE
	return input ? input.split(/[\t\n\f\r ]+/).filter(notEmptyString) : []
}

/**
 * Adds element as a key to current if it is not already present.
 *
 * @param {Record<string, boolean | undefined>} current
 * @param {string} element
 * @returns {Record<string, boolean | undefined>}
 */
function orderedSetReducer (current, element) {
	if (!current.hasOwnProperty(element)) {
		current[element] = true;
	}
	return current;
}

/**
 * @see https://infra.spec.whatwg.org/#ordered-set
 * @param {string} input
 * @returns {string[]}
 */
function toOrderedSet(input) {
	if (!input) return [];
	var list = splitOnASCIIWhitespace(input);
	return Object.keys(list.reduce(orderedSetReducer, {}))
}

/**
 * Uses `list.indexOf` to implement something like `Array.prototype.includes`,
 * which we can not rely on being available.
 *
 * @param {any[]} list
 * @returns {function(any): boolean}
 */
function arrayIncludes (list) {
	return function(element) {
		return list && list.indexOf(element) !== -1;
	}
}

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
	if(!(pt instanceof Super)){
		function t(){};
		t.prototype = Super.prototype;
		t = new t();
		copy(pt,t);
		Class.prototype = pt = t;
	}
	if(pt.constructor != Class){
		if(typeof Class != 'function'){
			console.error("unknown Class:"+Class)
		}
		pt.constructor = Class
	}
}

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

/**
 * DOM Level 2
 * Object DOMException
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 */
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
 * Objects implementing the NamedNodeMap interface are used
 * to represent collections of nodes that can be accessed by name.
 * Note that NamedNodeMap does not inherit from NodeList;
 * NamedNodeMaps are not maintained in any particular order.
 * Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index,
 * but this is simply to allow convenient enumeration of the contents of a NamedNodeMap,
 * and does not imply that the DOM specifies an order to these Nodes.
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
 * The DOMImplementation interface represents an object providing methods
 * which are not dependent on any particular document.
 * Such an object is returned by the `Document.implementation` property.
 *
 * __The individual methods describe the differences compared to the specs.__
 *
 * @constructor
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation MDN
 * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490 DOM Level 1 Core (Initial)
 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-102161490 DOM Level 2 Core
 * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-102161490 DOM Level 3 Core
 * @see https://dom.spec.whatwg.org/#domimplementation DOM Living Standard
 */
function DOMImplementation() {
}

DOMImplementation.prototype = {
	/**
	 * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given feature is supported.
	 * The different implementations fairly diverged in what kind of features were reported.
	 * The latest version of the spec settled to force this method to always return true, where the functionality was accurate and in use.
	 *
	 * @deprecated It is deprecated and modern browsers return true in all cases.
	 *
	 * @param {string} feature
	 * @param {string} [version]
	 * @returns {boolean} always true
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
	 * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
	 */
	hasFeature: function(feature, version) {
			return true;
	},
	/**
	 * Creates an XML Document object of the specified type with its document element.
	 *
	 * __It behaves slightly different from the description in the living standard__:
	 * - There is no interface/class `XMLDocument`, it returns a `Document` instance.
	 * - `contentType`, `encoding`, `mode`, `origin`, `url` fields are currently not declared.
	 * - this implementation is not validating names or qualified names
	 *   (when parsing XML strings, the SAX parser takes care of that)
	 *
	 * @param {string|null} namespaceURI
	 * @param {string} qualifiedName
	 * @param {DocumentType=null} doctype
	 * @returns {Document}
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
	 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM Level 2 Core (initial)
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument  DOM Level 2 Core
	 *
	 * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
	 * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
	 * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
	 */
	createDocument: function(namespaceURI,  qualifiedName, doctype){
		var doc = new Document();
		doc.implementation = this;
		doc.childNodes = new NodeList();
		doc.doctype = doctype || null;
		if (doctype){
			doc.appendChild(doctype);
		}
		if (qualifiedName){
			var root = doc.createElementNS(namespaceURI, qualifiedName);
			doc.appendChild(root);
		}
		return doc;
	},
	/**
	 * Returns a doctype, with the given `qualifiedName`, `publicId`, and `systemId`.
	 *
	 * __This behavior is slightly different from the in the specs__:
	 * - this implementation is not validating names or qualified names
	 *   (when parsing XML strings, the SAX parser takes care of that)
	 *
	 * @param {string} qualifiedName
	 * @param {string} [publicId]
	 * @param {string} [systemId]
	 * @returns {DocumentType} which can either be used with `DOMImplementation.createDocument` upon document creation
	 * 				  or can be put into the document via methods like `Node.insertBefore()` or `Node.replaceChild()`
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType MDN
	 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM Level 2 Core
	 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living Standard
	 *
	 * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
	 * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
	 * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
	 */
	createDocumentType: function(qualifiedName, publicId, systemId){
		var node = new DocumentType();
		node.name = qualifiedName;
		node.nodeName = qualifiedName;
		node.publicId = publicId || '';
		node.systemId = systemId || '';

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
	/**
	 * Look up the prefix associated to the given namespace URI, starting from this node.
	 * **The default namespace declarations are ignored by this method.**
	 * See Namespace Prefix Lookup for details on the algorithm used by this method.
	 *
	 * _Note: The implementation seems to be incomplete when compared to the algorithm described in the specs._
	 *
	 * @param {string | null} namespaceURI
	 * @returns {string | null}
	 * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespacePrefix
	 * @see https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespacePrefixAlgo
	 * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
	 * @see https://github.com/xmldom/xmldom/issues/322
	 */
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
	if(ns === NAMESPACE.XMLNS){
		//update namespace
		el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value
	}
}

function _onRemoveAttribute(doc,el,newAttr,remove){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns === NAMESPACE.XMLNS){
		//update namespace
		delete el._nsMap[newAttr.prefix?newAttr.localName:'']
	}
}

/**
 * Updates `el.childNodes`, updating the indexed items and it's `length`.
 * Passing `newChild` means it will be appended.
 * Otherwise it's assumed that an item has been removed,
 * and `el.firstNode` and it's `.nextSibling` are used
 * to walk the current list of child nodes.
 *
 * @param {Document} doc
 * @param {Node} el
 * @param {Node} [newChild]
 * @private
 */
function _onUpdateChild (doc, el, newChild) {
	if(doc && doc._inc){
		doc._inc++;
		//update childNodes
		var cs = el.childNodes;
		if (newChild) {
			cs[cs.length++] = newChild;
		} else {
			var child = el.firstChild;
			var i = 0;
			while (child) {
				cs[i++] = child;
				child = child.nextSibling;
			}
			cs.length = i;
			delete cs[cs.length];
		}
	}
}

/**
 * Removes the connections between `parentNode` and `child`
 * and any existing `child.previousSibling` or `child.nextSibling`.
 *
 * @see https://github.com/xmldom/xmldom/issues/135
 * @see https://github.com/xmldom/xmldom/issues/145
 *
 * @param {Node} parentNode
 * @param {Node} child
 * @returns {Node} the child that was removed.
 * @private
 */
function _removeChild (parentNode, child) {
	var previous = child.previousSibling;
	var next = child.nextSibling;
	if (previous) {
		previous.nextSibling = next;
	} else {
		parentNode.firstChild = next;
	}
	if (next) {
		next.previousSibling = previous;
	} else {
		parentNode.lastChild = previous;
	}
	child.parentNode = null;
	child.previousSibling = null;
	child.nextSibling = null;
	_onUpdateChild(parentNode.ownerDocument, parentNode);
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

/**
 * Appends `newChild` to `parentNode`.
 * If `newChild` is already connected to a `parentNode` it is first removed from it.
 *
 * @see https://github.com/xmldom/xmldom/issues/135
 * @see https://github.com/xmldom/xmldom/issues/145
 * @param {Node} parentNode
 * @param {Node} newChild
 * @returns {Node}
 * @private
 */
function _appendSingleChild (parentNode, newChild) {
	if (newChild.parentNode) {
		newChild.parentNode.removeChild(newChild);
	}
	newChild.parentNode = parentNode;
	newChild.previousSibling = parentNode.lastChild;
	newChild.nextSibling = null;
	if (newChild.previousSibling) {
		newChild.previousSibling.nextSibling = newChild;
	} else {
		parentNode.firstChild = newChild;
	}
	parentNode.lastChild = newChild;
	_onUpdateChild(parentNode.ownerDocument, parentNode, newChild);
	return newChild;
}

Document.prototype = {
	//implementation : null,
	nodeName :  '#document',
	nodeType :  DOCUMENT_NODE,
	/**
	 * The DocumentType node of the document.
	 *
	 * @readonly
	 * @type DocumentType
	 */
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

	/**
	 * The `getElementsByClassName` method of `Document` interface returns an array-like object
	 * of all child elements which have **all** of the given class name(s).
	 *
	 * Returns an empty list if `classeNames` is an empty string or only contains HTML white space characters.
	 *
	 *
	 * Warning: This is a live LiveNodeList.
	 * Changes in the DOM will reflect in the array as the changes occur.
	 * If an element selected by this array no longer qualifies for the selector,
	 * it will automatically be removed. Be aware of this for iteration purposes.
	 *
	 * @param {string} classNames is a string representing the class name(s) to match; multiple class names are separated by (ASCII-)whitespace
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
	 * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
	 */
	getElementsByClassName: function(classNames) {
		var classNamesSet = toOrderedSet(classNames)
		return new LiveNodeList(this, function(base) {
			var ls = [];
			if (classNamesSet.length > 0) {
				_visitNode(base.documentElement, function(node) {
					if(node !== base && node.nodeType === ELEMENT_NODE) {
						var nodeClassNames = node.getAttribute('class')
						// can be null if the attribute does not exist
						if (nodeClassNames) {
							// before splitting and iterating just compare them for the most common case
							var matches = classNames === nodeClassNames;
							if (!matches) {
								var nodeClassNamesSet = toOrderedSet(nodeClassNames)
								matches = classNamesSet.every(arrayIncludes(nodeClassNamesSet))
							}
							if(matches) {
								ls.push(node);
							}
						}
					}
				});
			}
			return ls;
		});
	},

	//document factory method:
	createElement :	function(tagName){
		var node = new Element();
		node.ownerDocument = this;
		node.nodeName = tagName;
		node.tagName = tagName;
		node.localName = tagName;
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
	var refNode = this.nodeType == 9 && this.documentElement || this;
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

function needNamespaceDefine(node, isHTML, visibleNamespaces) {
	var prefix = node.prefix || '';
	var uri = node.namespaceURI;
	// According to [Namespaces in XML 1.0](https://www.w3.org/TR/REC-xml-names/#ns-using) ,
	// and more specifically https://www.w3.org/TR/REC-xml-names/#nsc-NoPrefixUndecl :
	// > In a namespace declaration for a prefix [...], the attribute value MUST NOT be empty.
	// in a similar manner [Namespaces in XML 1.1](https://www.w3.org/TR/xml-names11/#ns-using)
	// and more specifically https://www.w3.org/TR/xml-names11/#nsc-NSDeclared :
	// > [...] Furthermore, the attribute value [...] must not be an empty string.
	// so serializing empty namespace value like xmlns:ds="" would produce an invalid XML document.
	if (!uri) {
		return false;
	}
	if (prefix === "xml" && uri === NAMESPACE.XML || uri === NAMESPACE.XMLNS) {
		return false;
	}
	
	var i = visibleNamespaces.length 
	while (i--) {
		var ns = visibleNamespaces[i];
		// get namespace prefix
		if (ns.prefix === prefix) {
			return ns.namespace !== uri;
		}
	}
	return true;
}
/**
 * Well-formed constraint: No < in Attribute Values
 * > The replacement text of any entity referred to directly or indirectly
 * > in an attribute value must not contain a <.
 * @see https://www.w3.org/TR/xml11/#CleanAttrVals
 * @see https://www.w3.org/TR/xml11/#NT-AttValue
 *
 * Literal whitespace other than space that appear in attribute values
 * are serialized as their entity references, so they will be preserved.
 * (In contrast to whitespace literals in the input which are normalized to spaces)
 * @see https://www.w3.org/TR/xml11/#AVNormalize
 */
function addSerializedAttribute(buf, qualifiedName, value) {
	buf.push(' ', qualifiedName, '="', value.replace(/[<&"\t\n\r]/g, _xmlEncoder), '"')
}

function serializeToString(node,buf,isHTML,nodeFilter,visibleNamespaces){
	if (!visibleNamespaces) {
		visibleNamespaces = [];
	}

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
		var attrs = node.attributes;
		var len = attrs.length;
		var child = node.firstChild;
		var nodeName = node.tagName;
		
		isHTML = NAMESPACE.isHTML(node.namespaceURI) || isHTML

		var prefixedNodeName = nodeName
		if (!isHTML && !node.prefix && node.namespaceURI) {
			var defaultNS
			// lookup current default ns from `xmlns` attribute
			for (var ai = 0; ai < attrs.length; ai++) {
				if (attrs.item(ai).name === 'xmlns') {
					defaultNS = attrs.item(ai).value
					break
				}
			}
			if (!defaultNS) {
				// lookup current default ns in visibleNamespaces
				for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
					var namespace = visibleNamespaces[nsi]
					if (namespace.prefix === '' && namespace.namespace === node.namespaceURI) {
						defaultNS = namespace.namespace
						break
					}
				}
			}
			if (defaultNS !== node.namespaceURI) {
				for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
					var namespace = visibleNamespaces[nsi]
					if (namespace.namespace === node.namespaceURI) {
						if (namespace.prefix) {
							prefixedNodeName = namespace.prefix + ':' + nodeName
						}
						break
					}
				}
			}
		}

		buf.push('<', prefixedNodeName);

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
				addSerializedAttribute(buf, prefix ? 'xmlns:' + prefix : "xmlns", uri);
				visibleNamespaces.push({ prefix: prefix, namespace:uri });
			}
			serializeToString(attr,buf,isHTML,nodeFilter,visibleNamespaces);
		}

		// add namespace for current node		
		if (nodeName === prefixedNodeName && needNamespaceDefine(node, isHTML, visibleNamespaces)) {
			var prefix = node.prefix||'';
			var uri = node.namespaceURI;
			addSerializedAttribute(buf, prefix ? 'xmlns:' + prefix : "xmlns", uri);
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
						serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
					}
					child = child.nextSibling;
				}
			}else
			{
				while(child){
					serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
					child = child.nextSibling;
				}
			}
			buf.push('</',prefixedNodeName,'>');
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
			serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
			child = child.nextSibling;
		}
		return;
	case ATTRIBUTE_NODE:
		return addSerializedAttribute(buf, node.name, node.value);
	case TEXT_NODE:
		/**
		 * The ampersand character (&) and the left angle bracket (<) must not appear in their literal form,
		 * except when used as markup delimiters, or within a comment, a processing instruction, or a CDATA section.
		 * If they are needed elsewhere, they must be escaped using either numeric character references or the strings
		 * `&amp;` and `&lt;` respectively.
		 * The right angle bracket (>) may be represented using the string " &gt; ", and must, for compatibility,
		 * be escaped using either `&gt;` or a character reference when it appears in the string `]]>` in content,
		 * when that string is not marking the end of a CDATA section.
		 *
		 * In the content of elements, character data is any string of characters
		 * which does not contain the start-delimiter of any markup
		 * and does not include the CDATA-section-close delimiter, `]]>`.
		 *
		 * @see https://www.w3.org/TR/xml/#NT-CharData
		 */
		return buf.push(node.data
			.replace(/[<&]/g,_xmlEncoder)
			.replace(/]]>/g, ']]&gt;')
		);
	case CDATA_SECTION_NODE:
		return buf.push( '<![CDATA[',node.data,']]>');
	case COMMENT_NODE:
		return buf.push( "<!--",node.data,"-->");
	case DOCUMENT_TYPE_NODE:
		var pubid = node.publicId;
		var sysid = node.systemId;
		buf.push('<!DOCTYPE ',node.name);
		if(pubid){
			buf.push(' PUBLIC ', pubid);
			if (sysid && sysid!='.') {
				buf.push(' ', sysid);
			}
			buf.push('>');
		}else if(sysid && sysid!='.'){
			buf.push(' SYSTEM ', sysid, '>');
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
	exports.DocumentType = DocumentType;
	exports.DOMException = DOMException;
	exports.DOMImplementation = DOMImplementation;
	exports.Element = Element;
	exports.Node = Node;
	exports.NodeList = NodeList;
	exports.XMLSerializer = XMLSerializer;
//}

},{"./conventions":39}],42:[function(require,module,exports){
var freeze = require('./conventions').freeze;

/**
 * The entities that are predefined in every XML document.
 *
 * @see https://www.w3.org/TR/2006/REC-xml11-20060816/#sec-predefined-ent W3C XML 1.1
 * @see https://www.w3.org/TR/2008/REC-xml-20081126/#sec-predefined-ent W3C XML 1.0
 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Predefined_entities_in_XML Wikipedia
 */
exports.XML_ENTITIES = freeze({amp:'&', apos:"'", gt:'>', lt:'<', quot:'"'})

/**
 * A map of currently 241 entities that are detected in an HTML document.
 * They contain all entries from `XML_ENTITIES`.
 *
 * @see XML_ENTITIES
 * @see DOMParser.parseFromString
 * @see DOMImplementation.prototype.createHTMLDocument
 * @see https://html.spec.whatwg.org/#named-character-references WHATWG HTML(5) Spec
 * @see https://www.w3.org/TR/xml-entity-names/ W3C XML Entity Names
 * @see https://www.w3.org/TR/html4/sgml/entities.html W3C HTML4/SGML
 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Character_entity_references_in_HTML Wikipedia (HTML)
 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Entities_representing_special_characters_in_XHTML Wikpedia (XHTML)
 */
exports.HTML_ENTITIES = freeze({
       lt: '<',
       gt: '>',
       amp: '&',
       quot: '"',
       apos: "'",
       Agrave: "À",
       Aacute: "Á",
       Acirc: "Â",
       Atilde: "Ã",
       Auml: "Ä",
       Aring: "Å",
       AElig: "Æ",
       Ccedil: "Ç",
       Egrave: "È",
       Eacute: "É",
       Ecirc: "Ê",
       Euml: "Ë",
       Igrave: "Ì",
       Iacute: "Í",
       Icirc: "Î",
       Iuml: "Ï",
       ETH: "Ð",
       Ntilde: "Ñ",
       Ograve: "Ò",
       Oacute: "Ó",
       Ocirc: "Ô",
       Otilde: "Õ",
       Ouml: "Ö",
       Oslash: "Ø",
       Ugrave: "Ù",
       Uacute: "Ú",
       Ucirc: "Û",
       Uuml: "Ü",
       Yacute: "Ý",
       THORN: "Þ",
       szlig: "ß",
       agrave: "à",
       aacute: "á",
       acirc: "â",
       atilde: "ã",
       auml: "ä",
       aring: "å",
       aelig: "æ",
       ccedil: "ç",
       egrave: "è",
       eacute: "é",
       ecirc: "ê",
       euml: "ë",
       igrave: "ì",
       iacute: "í",
       icirc: "î",
       iuml: "ï",
       eth: "ð",
       ntilde: "ñ",
       ograve: "ò",
       oacute: "ó",
       ocirc: "ô",
       otilde: "õ",
       ouml: "ö",
       oslash: "ø",
       ugrave: "ù",
       uacute: "ú",
       ucirc: "û",
       uuml: "ü",
       yacute: "ý",
       thorn: "þ",
       yuml: "ÿ",
       nbsp: "\u00a0",
       iexcl: "¡",
       cent: "¢",
       pound: "£",
       curren: "¤",
       yen: "¥",
       brvbar: "¦",
       sect: "§",
       uml: "¨",
       copy: "©",
       ordf: "ª",
       laquo: "«",
       not: "¬",
       shy: "­­",
       reg: "®",
       macr: "¯",
       deg: "°",
       plusmn: "±",
       sup2: "²",
       sup3: "³",
       acute: "´",
       micro: "µ",
       para: "¶",
       middot: "·",
       cedil: "¸",
       sup1: "¹",
       ordm: "º",
       raquo: "»",
       frac14: "¼",
       frac12: "½",
       frac34: "¾",
       iquest: "¿",
       times: "×",
       divide: "÷",
       forall: "∀",
       part: "∂",
       exist: "∃",
       empty: "∅",
       nabla: "∇",
       isin: "∈",
       notin: "∉",
       ni: "∋",
       prod: "∏",
       sum: "∑",
       minus: "−",
       lowast: "∗",
       radic: "√",
       prop: "∝",
       infin: "∞",
       ang: "∠",
       and: "∧",
       or: "∨",
       cap: "∩",
       cup: "∪",
       'int': "∫",
       there4: "∴",
       sim: "∼",
       cong: "≅",
       asymp: "≈",
       ne: "≠",
       equiv: "≡",
       le: "≤",
       ge: "≥",
       sub: "⊂",
       sup: "⊃",
       nsub: "⊄",
       sube: "⊆",
       supe: "⊇",
       oplus: "⊕",
       otimes: "⊗",
       perp: "⊥",
       sdot: "⋅",
       Alpha: "Α",
       Beta: "Β",
       Gamma: "Γ",
       Delta: "Δ",
       Epsilon: "Ε",
       Zeta: "Ζ",
       Eta: "Η",
       Theta: "Θ",
       Iota: "Ι",
       Kappa: "Κ",
       Lambda: "Λ",
       Mu: "Μ",
       Nu: "Ν",
       Xi: "Ξ",
       Omicron: "Ο",
       Pi: "Π",
       Rho: "Ρ",
       Sigma: "Σ",
       Tau: "Τ",
       Upsilon: "Υ",
       Phi: "Φ",
       Chi: "Χ",
       Psi: "Ψ",
       Omega: "Ω",
       alpha: "α",
       beta: "β",
       gamma: "γ",
       delta: "δ",
       epsilon: "ε",
       zeta: "ζ",
       eta: "η",
       theta: "θ",
       iota: "ι",
       kappa: "κ",
       lambda: "λ",
       mu: "μ",
       nu: "ν",
       xi: "ξ",
       omicron: "ο",
       pi: "π",
       rho: "ρ",
       sigmaf: "ς",
       sigma: "σ",
       tau: "τ",
       upsilon: "υ",
       phi: "φ",
       chi: "χ",
       psi: "ψ",
       omega: "ω",
       thetasym: "ϑ",
       upsih: "ϒ",
       piv: "ϖ",
       OElig: "Œ",
       oelig: "œ",
       Scaron: "Š",
       scaron: "š",
       Yuml: "Ÿ",
       fnof: "ƒ",
       circ: "ˆ",
       tilde: "˜",
       ensp: " ",
       emsp: " ",
       thinsp: " ",
       zwnj: "‌",
       zwj: "‍",
       lrm: "‎",
       rlm: "‏",
       ndash: "–",
       mdash: "—",
       lsquo: "‘",
       rsquo: "’",
       sbquo: "‚",
       ldquo: "“",
       rdquo: "”",
       bdquo: "„",
       dagger: "†",
       Dagger: "‡",
       bull: "•",
       hellip: "…",
       permil: "‰",
       prime: "′",
       Prime: "″",
       lsaquo: "‹",
       rsaquo: "›",
       oline: "‾",
       euro: "€",
       trade: "™",
       larr: "←",
       uarr: "↑",
       rarr: "→",
       darr: "↓",
       harr: "↔",
       crarr: "↵",
       lceil: "⌈",
       rceil: "⌉",
       lfloor: "⌊",
       rfloor: "⌋",
       loz: "◊",
       spades: "♠",
       clubs: "♣",
       hearts: "♥",
       diams: "♦"
});

/**
 * @deprecated use `HTML_ENTITIES` instead
 * @see HTML_ENTITIES
 */
exports.entityMap = exports.HTML_ENTITIES

},{"./conventions":39}],43:[function(require,module,exports){
var dom = require('./dom')
exports.DOMImplementation = dom.DOMImplementation
exports.XMLSerializer = dom.XMLSerializer
exports.DOMParser = require('./dom-parser').DOMParser

},{"./dom":41,"./dom-parser":40}],44:[function(require,module,exports){
var NAMESPACE = require("./conventions").NAMESPACE;

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

/**
 * Creates an error that will not be caught by XMLReader aka the SAX parser.
 *
 * @param {string} message
 * @param {any?} locator Optional, can provide details about the location in the source
 * @constructor
 */
function ParseError(message, locator) {
	this.message = message
	this.locator = locator
	if(Error.captureStackTrace) Error.captureStackTrace(this, ParseError);
}
ParseError.prototype = new Error();
ParseError.prototype.name = ParseError.name

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
				var tagName = source.substring(tagStart + 2, end).replace(/[ \t\n\r]+$/g, '');
				var config = parseStack.pop();
				if(end<0){
					
	        		tagName = source.substring(tagStart+2).replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' is not complete:'+config.tagName);
	        		end = tagStart+1+tagName.length;
	        	}else if(tagName.match(/\s</)){
	        		tagName = tagName.replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' maybe not complete');
	        		end = tagStart+1+tagName.length;
				}
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
		            	errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName ); // No known test case
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

				if (NAMESPACE.isHTML(el.uri) && !el.closed) {
					end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder)
				} else {
					end++;
				}
			}
		}catch(e){
			if (e instanceof ParseError) {
				throw e;
			}
			errorHandler.error('element parse error: '+e)
			end = -1;
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

	/**
	 * @param {string} qname
	 * @param {string} value
	 * @param {number} startIndex
	 */
	function addAttribute(qname, value, startIndex) {
		if (el.attributeNames.hasOwnProperty(qname)) {
			errorHandler.fatalError('Attribute ' + qname + ' redefined')
		}
		el.addValue(
			qname,
			// @see https://www.w3.org/TR/xml/#AVNormalize
			// since the xmldom sax parser does not "interpret" DTD the following is not implemented:
			// - recursive replacement of (DTD) entity references
			// - trimming and collapsing multiple spaces into a single one for attributes that are not of type CDATA
			value.replace(/[\t\n\r]/g, ' ').replace(/&#?\w+;/g, entityReplacer),
			startIndex
		)
	}
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
				throw new Error('attribute equal must after attrName'); // No known test case
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
					value = source.slice(start, p);
					addAttribute(attrName, value, start-1);
					s = S_ATTR_END;
				}else{
					//fatalError: no end quot match
					throw new Error('attribute value no end \''+c+'\' match');
				}
			}else if(s == S_ATTR_NOQUOT_VALUE){
				value = source.slice(start, p);
				addAttribute(attrName, value, start);
				errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
				start = p+1;
				s = S_ATTR_END
			}else{
				//fatalError: no equal before
				throw new Error('attribute value must after "="'); // No known test case
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
				throw new Error("attribute invalid close char('/')") // No known test case
			}
			break;
		case ''://end document
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
					errorHandler.warning('attribute "'+value+'" missed quot(")!');
					addAttribute(attrName, value, start)
				}else{
					if(!NAMESPACE.isHTML(currentNSMap['']) || !value.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!')
					}
					addAttribute(value, value, start)
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
					var value = source.slice(start, p);
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					addAttribute(attrName, value, start)
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
					if (!NAMESPACE.isHTML(currentNSMap['']) || !attrName.match(/^(?:disabled|checked|selected)$/i)) {
						errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead2!!')
					}
					addAttribute(attrName, attrName, start);
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
			a.uri = NAMESPACE.XMLNS
			domBuilder.startPrefixMapping(nsPrefix, value) 
		}
	}
	var i = el.length;
	while(i--){
		a = el[i];
		var prefix = a.prefix;
		if(prefix){//no prefix attribute has no namespace
			if(prefix === 'xml'){
				a.uri = NAMESPACE.XML;
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
			var pubid = false;
			var sysid = false;
			if(len>3){
				if(/^public$/i.test(matchs[2][0])){
					pubid = matchs[3][0];
					sysid = len>4 && matchs[4][0];
				}else if(/^system$/i.test(matchs[2][0])){
					sysid = matchs[3][0];
				}
			}
			var lastMatch = matchs[len-1]
			domBuilder.startDTD(name, pubid, sysid);
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

function ElementAttributes(){
	this.attributeNames = {}
}
ElementAttributes.prototype = {
	setTagName:function(tagName){
		if(!tagNamePattern.test(tagName)){
			throw new Error('invalid tagName:'+tagName)
		}
		this.tagName = tagName
	},
	addValue:function(qName, value, offset) {
		if(!tagNamePattern.test(qName)){
			throw new Error('invalid attribute:'+qName)
		}
		this.attributeNames[qName] = this.length;
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
exports.ParseError = ParseError;

},{"./conventions":39}],45:[function(require,module,exports){
//! moment-timezone.js
//! version : 0.5.34
//! Copyright (c) JS Foundation and other contributors
//! license : MIT
//! github.com/moment/moment-timezone

(function (root, factory) {
	"use strict";

	/*global define*/
	if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('moment')); // Node
	} else if (typeof define === 'function' && define.amd) {
		define(['moment'], factory);                 // AMD
	} else {
		factory(root.moment);                        // Browser
	}
}(this, function (moment) {
	"use strict";

	// Resolves es6 module loading issue
	if (moment.version === undefined && moment.default) {
		moment = moment.default;
	}

	// Do not load moment-timezone a second time.
	// if (moment.tz !== undefined) {
	// 	logError('Moment Timezone ' + moment.tz.version + ' was already loaded ' + (moment.tz.dataVersion ? 'with data from ' : 'without any data') + moment.tz.dataVersion);
	// 	return moment;
	// }

	var VERSION = "0.5.34",
		zones = {},
		links = {},
		countries = {},
		names = {},
		guesses = {},
		cachedGuess;

	if (!moment || typeof moment.version !== 'string') {
		logError('Moment Timezone requires Moment.js. See https://momentjs.com/timezone/docs/#/use-it/browser/');
	}

	var momentVersion = moment.version.split('.'),
		major = +momentVersion[0],
		minor = +momentVersion[1];

	// Moment.js version check
	if (major < 2 || (major === 2 && minor < 6)) {
		logError('Moment Timezone requires Moment.js >= 2.6.0. You are using Moment.js ' + moment.version + '. See momentjs.com');
	}

	/************************************
		Unpacking
	************************************/

	function charCodeToInt(charCode) {
		if (charCode > 96) {
			return charCode - 87;
		} else if (charCode > 64) {
			return charCode - 29;
		}
		return charCode - 48;
	}

	function unpackBase60(string) {
		var i = 0,
			parts = string.split('.'),
			whole = parts[0],
			fractional = parts[1] || '',
			multiplier = 1,
			num,
			out = 0,
			sign = 1;

		// handle negative numbers
		if (string.charCodeAt(0) === 45) {
			i = 1;
			sign = -1;
		}

		// handle digits before the decimal
		for (i; i < whole.length; i++) {
			num = charCodeToInt(whole.charCodeAt(i));
			out = 60 * out + num;
		}

		// handle digits after the decimal
		for (i = 0; i < fractional.length; i++) {
			multiplier = multiplier / 60;
			num = charCodeToInt(fractional.charCodeAt(i));
			out += num * multiplier;
		}

		return out * sign;
	}

	function arrayToInt (array) {
		for (var i = 0; i < array.length; i++) {
			array[i] = unpackBase60(array[i]);
		}
	}

	function intToUntil (array, length) {
		for (var i = 0; i < length; i++) {
			array[i] = Math.round((array[i - 1] || 0) + (array[i] * 60000)); // minutes to milliseconds
		}

		array[length - 1] = Infinity;
	}

	function mapIndices (source, indices) {
		var out = [], i;

		for (i = 0; i < indices.length; i++) {
			out[i] = source[indices[i]];
		}

		return out;
	}

	function unpack (string) {
		var data = string.split('|'),
			offsets = data[2].split(' '),
			indices = data[3].split(''),
			untils  = data[4].split(' ');

		arrayToInt(offsets);
		arrayToInt(indices);
		arrayToInt(untils);

		intToUntil(untils, indices.length);

		return {
			name       : data[0],
			abbrs      : mapIndices(data[1].split(' '), indices),
			offsets    : mapIndices(offsets, indices),
			untils     : untils,
			population : data[5] | 0
		};
	}

	/************************************
		Zone object
	************************************/

	function Zone (packedString) {
		if (packedString) {
			this._set(unpack(packedString));
		}
	}

	Zone.prototype = {
		_set : function (unpacked) {
			this.name       = unpacked.name;
			this.abbrs      = unpacked.abbrs;
			this.untils     = unpacked.untils;
			this.offsets    = unpacked.offsets;
			this.population = unpacked.population;
		},

		_index : function (timestamp) {
			var target = +timestamp,
				untils = this.untils,
				i;

			for (i = 0; i < untils.length; i++) {
				if (target < untils[i]) {
					return i;
				}
			}
		},

		countries : function () {
			var zone_name = this.name;
			return Object.keys(countries).filter(function (country_code) {
				return countries[country_code].zones.indexOf(zone_name) !== -1;
			});
		},

		parse : function (timestamp) {
			var target  = +timestamp,
				offsets = this.offsets,
				untils  = this.untils,
				max     = untils.length - 1,
				offset, offsetNext, offsetPrev, i;

			for (i = 0; i < max; i++) {
				offset     = offsets[i];
				offsetNext = offsets[i + 1];
				offsetPrev = offsets[i ? i - 1 : i];

				if (offset < offsetNext && tz.moveAmbiguousForward) {
					offset = offsetNext;
				} else if (offset > offsetPrev && tz.moveInvalidForward) {
					offset = offsetPrev;
				}

				if (target < untils[i] - (offset * 60000)) {
					return offsets[i];
				}
			}

			return offsets[max];
		},

		abbr : function (mom) {
			return this.abbrs[this._index(mom)];
		},

		offset : function (mom) {
			logError("zone.offset has been deprecated in favor of zone.utcOffset");
			return this.offsets[this._index(mom)];
		},

		utcOffset : function (mom) {
			return this.offsets[this._index(mom)];
		}
	};

	/************************************
		Country object
	************************************/

	function Country (country_name, zone_names) {
		this.name = country_name;
		this.zones = zone_names;
	}

	/************************************
		Current Timezone
	************************************/

	function OffsetAt(at) {
		var timeString = at.toTimeString();
		var abbr = timeString.match(/\([a-z ]+\)/i);
		if (abbr && abbr[0]) {
			// 17:56:31 GMT-0600 (CST)
			// 17:56:31 GMT-0600 (Central Standard Time)
			abbr = abbr[0].match(/[A-Z]/g);
			abbr = abbr ? abbr.join('') : undefined;
		} else {
			// 17:56:31 CST
			// 17:56:31 GMT+0800 (台北標準時間)
			abbr = timeString.match(/[A-Z]{3,5}/g);
			abbr = abbr ? abbr[0] : undefined;
		}

		if (abbr === 'GMT') {
			abbr = undefined;
		}

		this.at = +at;
		this.abbr = abbr;
		this.offset = at.getTimezoneOffset();
	}

	function ZoneScore(zone) {
		this.zone = zone;
		this.offsetScore = 0;
		this.abbrScore = 0;
	}

	ZoneScore.prototype.scoreOffsetAt = function (offsetAt) {
		this.offsetScore += Math.abs(this.zone.utcOffset(offsetAt.at) - offsetAt.offset);
		if (this.zone.abbr(offsetAt.at).replace(/[^A-Z]/g, '') !== offsetAt.abbr) {
			this.abbrScore++;
		}
	};

	function findChange(low, high) {
		var mid, diff;

		while ((diff = ((high.at - low.at) / 12e4 | 0) * 6e4)) {
			mid = new OffsetAt(new Date(low.at + diff));
			if (mid.offset === low.offset) {
				low = mid;
			} else {
				high = mid;
			}
		}

		return low;
	}

	function userOffsets() {
		var startYear = new Date().getFullYear() - 2,
			last = new OffsetAt(new Date(startYear, 0, 1)),
			offsets = [last],
			change, next, i;

		for (i = 1; i < 48; i++) {
			next = new OffsetAt(new Date(startYear, i, 1));
			if (next.offset !== last.offset) {
				change = findChange(last, next);
				offsets.push(change);
				offsets.push(new OffsetAt(new Date(change.at + 6e4)));
			}
			last = next;
		}

		for (i = 0; i < 4; i++) {
			offsets.push(new OffsetAt(new Date(startYear + i, 0, 1)));
			offsets.push(new OffsetAt(new Date(startYear + i, 6, 1)));
		}

		return offsets;
	}

	function sortZoneScores (a, b) {
		if (a.offsetScore !== b.offsetScore) {
			return a.offsetScore - b.offsetScore;
		}
		if (a.abbrScore !== b.abbrScore) {
			return a.abbrScore - b.abbrScore;
		}
		if (a.zone.population !== b.zone.population) {
			return b.zone.population - a.zone.population;
		}
		return b.zone.name.localeCompare(a.zone.name);
	}

	function addToGuesses (name, offsets) {
		var i, offset;
		arrayToInt(offsets);
		for (i = 0; i < offsets.length; i++) {
			offset = offsets[i];
			guesses[offset] = guesses[offset] || {};
			guesses[offset][name] = true;
		}
	}

	function guessesForUserOffsets (offsets) {
		var offsetsLength = offsets.length,
			filteredGuesses = {},
			out = [],
			i, j, guessesOffset;

		for (i = 0; i < offsetsLength; i++) {
			guessesOffset = guesses[offsets[i].offset] || {};
			for (j in guessesOffset) {
				if (guessesOffset.hasOwnProperty(j)) {
					filteredGuesses[j] = true;
				}
			}
		}

		for (i in filteredGuesses) {
			if (filteredGuesses.hasOwnProperty(i)) {
				out.push(names[i]);
			}
		}

		return out;
	}

	function rebuildGuess () {

		// use Intl API when available and returning valid time zone
		try {
			var intlName = Intl.DateTimeFormat().resolvedOptions().timeZone;
			if (intlName && intlName.length > 3) {
				var name = names[normalizeName(intlName)];
				if (name) {
					return name;
				}
				logError("Moment Timezone found " + intlName + " from the Intl api, but did not have that data loaded.");
			}
		} catch (e) {
			// Intl unavailable, fall back to manual guessing.
		}

		var offsets = userOffsets(),
			offsetsLength = offsets.length,
			guesses = guessesForUserOffsets(offsets),
			zoneScores = [],
			zoneScore, i, j;

		for (i = 0; i < guesses.length; i++) {
			zoneScore = new ZoneScore(getZone(guesses[i]), offsetsLength);
			for (j = 0; j < offsetsLength; j++) {
				zoneScore.scoreOffsetAt(offsets[j]);
			}
			zoneScores.push(zoneScore);
		}

		zoneScores.sort(sortZoneScores);

		return zoneScores.length > 0 ? zoneScores[0].zone.name : undefined;
	}

	function guess (ignoreCache) {
		if (!cachedGuess || ignoreCache) {
			cachedGuess = rebuildGuess();
		}
		return cachedGuess;
	}

	/************************************
		Global Methods
	************************************/

	function normalizeName (name) {
		return (name || '').toLowerCase().replace(/\//g, '_');
	}

	function addZone (packed) {
		var i, name, split, normalized;

		if (typeof packed === "string") {
			packed = [packed];
		}

		for (i = 0; i < packed.length; i++) {
			split = packed[i].split('|');
			name = split[0];
			normalized = normalizeName(name);
			zones[normalized] = packed[i];
			names[normalized] = name;
			addToGuesses(normalized, split[2].split(' '));
		}
	}

	function getZone (name, caller) {

		name = normalizeName(name);

		var zone = zones[name];
		var link;

		if (zone instanceof Zone) {
			return zone;
		}

		if (typeof zone === 'string') {
			zone = new Zone(zone);
			zones[name] = zone;
			return zone;
		}

		// Pass getZone to prevent recursion more than 1 level deep
		if (links[name] && caller !== getZone && (link = getZone(links[name], getZone))) {
			zone = zones[name] = new Zone();
			zone._set(link);
			zone.name = names[name];
			return zone;
		}

		return null;
	}

	function getNames () {
		var i, out = [];

		for (i in names) {
			if (names.hasOwnProperty(i) && (zones[i] || zones[links[i]]) && names[i]) {
				out.push(names[i]);
			}
		}

		return out.sort();
	}

	function getCountryNames () {
		return Object.keys(countries);
	}

	function addLink (aliases) {
		var i, alias, normal0, normal1;

		if (typeof aliases === "string") {
			aliases = [aliases];
		}

		for (i = 0; i < aliases.length; i++) {
			alias = aliases[i].split('|');

			normal0 = normalizeName(alias[0]);
			normal1 = normalizeName(alias[1]);

			links[normal0] = normal1;
			names[normal0] = alias[0];

			links[normal1] = normal0;
			names[normal1] = alias[1];
		}
	}

	function addCountries (data) {
		var i, country_code, country_zones, split;
		if (!data || !data.length) return;
		for (i = 0; i < data.length; i++) {
			split = data[i].split('|');
			country_code = split[0].toUpperCase();
			country_zones = split[1].split(' ');
			countries[country_code] = new Country(
				country_code,
				country_zones
			);
		}
	}

	function getCountry (name) {
		name = name.toUpperCase();
		return countries[name] || null;
	}

	function zonesForCountry(country, with_offset) {
		country = getCountry(country);

		if (!country) return null;

		var zones = country.zones.sort();

		if (with_offset) {
			return zones.map(function (zone_name) {
				var zone = getZone(zone_name);
				return {
					name: zone_name,
					offset: zone.utcOffset(new Date())
				};
			});
		}

		return zones;
	}

	function loadData (data) {
		addZone(data.zones);
		addLink(data.links);
		addCountries(data.countries);
		tz.dataVersion = data.version;
	}

	function zoneExists (name) {
		if (!zoneExists.didShowError) {
			zoneExists.didShowError = true;
				logError("moment.tz.zoneExists('" + name + "') has been deprecated in favor of !moment.tz.zone('" + name + "')");
		}
		return !!getZone(name);
	}

	function needsOffset (m) {
		var isUnixTimestamp = (m._f === 'X' || m._f === 'x');
		return !!(m._a && (m._tzm === undefined) && !isUnixTimestamp);
	}

	function logError (message) {
		if (typeof console !== 'undefined' && typeof console.error === 'function') {
			console.error(message);
		}
	}

	/************************************
		moment.tz namespace
	************************************/

	function tz (input) {
		var args = Array.prototype.slice.call(arguments, 0, -1),
			name = arguments[arguments.length - 1],
			zone = getZone(name),
			out  = moment.utc.apply(null, args);

		if (zone && !moment.isMoment(input) && needsOffset(out)) {
			out.add(zone.parse(out), 'minutes');
		}

		out.tz(name);

		return out;
	}

	tz.version      = VERSION;
	tz.dataVersion  = '';
	tz._zones       = zones;
	tz._links       = links;
	tz._names       = names;
	tz._countries	= countries;
	tz.add          = addZone;
	tz.link         = addLink;
	tz.load         = loadData;
	tz.zone         = getZone;
	tz.zoneExists   = zoneExists; // deprecated in 0.1.0
	tz.guess        = guess;
	tz.names        = getNames;
	tz.Zone         = Zone;
	tz.unpack       = unpack;
	tz.unpackBase60 = unpackBase60;
	tz.needsOffset  = needsOffset;
	tz.moveInvalidForward   = true;
	tz.moveAmbiguousForward = false;
	tz.countries    = getCountryNames;
	tz.zonesForCountry = zonesForCountry;

	/************************************
		Interface with Moment.js
	************************************/

	var fn = moment.fn;

	moment.tz = tz;

	moment.defaultZone = null;

	moment.updateOffset = function (mom, keepTime) {
		var zone = moment.defaultZone,
			offset;

		if (mom._z === undefined) {
			if (zone && needsOffset(mom) && !mom._isUTC) {
				mom._d = moment.utc(mom._a)._d;
				mom.utc().add(zone.parse(mom), 'minutes');
			}
			mom._z = zone;
		}
		if (mom._z) {
			offset = mom._z.utcOffset(mom);
			if (Math.abs(offset) < 16) {
				offset = offset / 60;
			}
			if (mom.utcOffset !== undefined) {
				var z = mom._z;
				mom.utcOffset(-offset, keepTime);
				mom._z = z;
			} else {
				mom.zone(offset, keepTime);
			}
		}
	};

	fn.tz = function (name, keepTime) {
		if (name) {
			if (typeof name !== 'string') {
				throw new Error('Time zone name must be a string, got ' + name + ' [' + typeof name + ']');
			}
			this._z = getZone(name);
			if (this._z) {
				moment.updateOffset(this, keepTime);
			} else {
				logError("Moment Timezone has no data for " + name + ". See http://momentjs.com/timezone/docs/#/data-loading/.");
			}
			return this;
		}
		if (this._z) { return this._z.name; }
	};

	function abbrWrap (old) {
		return function () {
			if (this._z) { return this._z.abbr(this); }
			return old.call(this);
		};
	}

	function resetZoneWrap (old) {
		return function () {
			this._z = null;
			return old.apply(this, arguments);
		};
	}

	function resetZoneWrap2 (old) {
		return function () {
			if (arguments.length > 0) this._z = null;
			return old.apply(this, arguments);
		};
	}

	fn.zoneName  = abbrWrap(fn.zoneName);
	fn.zoneAbbr  = abbrWrap(fn.zoneAbbr);
	fn.utc       = resetZoneWrap(fn.utc);
	fn.local     = resetZoneWrap(fn.local);
	fn.utcOffset = resetZoneWrap2(fn.utcOffset);

	moment.tz.setDefault = function(name) {
		if (major < 2 || (major === 2 && minor < 9)) {
			logError('Moment Timezone setDefault() requires Moment.js >= 2.9.0. You are using Moment.js ' + moment.version + '.');
		}
		moment.defaultZone = name ? getZone(name) : null;
		return moment;
	};

	// Cloning a moment should include the _z property.
	var momentProperties = moment.momentProperties;
	if (Object.prototype.toString.call(momentProperties) === '[object Array]') {
		// moment 2.8.1+
		momentProperties.push('_z');
		momentProperties.push('_a');
	} else if (momentProperties) {
		// moment 2.7.0
		momentProperties._z = null;
	}

	loadData({
		"version": "2021e",
		"zones": [
			"Africa/Abidjan|GMT|0|0||48e5",
			"Africa/Nairobi|EAT|-30|0||47e5",
			"Africa/Algiers|CET|-10|0||26e5",
			"Africa/Lagos|WAT|-10|0||17e6",
			"Africa/Maputo|CAT|-20|0||26e5",
			"Africa/Cairo|EET EEST|-20 -30|01010|1M2m0 gL0 e10 mn0|15e6",
			"Africa/Casablanca|+00 +01|0 -10|010101010101010101010101010101010101|1H3C0 wM0 co0 go0 1o00 s00 dA0 vc0 11A0 A00 e00 y00 11A0 uM0 e00 Dc0 11A0 s00 e00 IM0 WM0 mo0 gM0 LA0 WM0 jA0 e00 28M0 e00 2600 gM0 2600 e00 2600 gM0|32e5",
			"Europe/Paris|CET CEST|-10 -20|01010101010101010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|11e6",
			"Africa/Johannesburg|SAST|-20|0||84e5",
			"Africa/Juba|EAT CAT|-30 -20|01|24nx0|",
			"Africa/Khartoum|EAT CAT|-30 -20|01|1Usl0|51e5",
			"Africa/Sao_Tome|GMT WAT|0 -10|010|1UQN0 2q00|",
			"Africa/Tripoli|EET CET CEST|-20 -10 -20|0120|1IlA0 TA0 1o00|11e5",
			"Africa/Windhoek|CAT WAT|-20 -10|0101010101010|1GQo0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0|32e4",
			"America/Adak|HST HDT|a0 90|01010101010101010101010|1GIc0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|326",
			"America/Anchorage|AKST AKDT|90 80|01010101010101010101010|1GIb0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|30e4",
			"America/Santo_Domingo|AST|40|0||29e5",
			"America/Araguaina|-03 -02|30 20|010|1IdD0 Lz0|14e4",
			"America/Fortaleza|-03|30|0||34e5",
			"America/Asuncion|-03 -04|30 40|01010101010101010101010|1GTf0 1cN0 17b0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1fB0 19X0 1fB0|28e5",
			"America/Panama|EST|50|0||15e5",
			"America/Mexico_City|CST CDT|60 50|01010101010101010101010|1GQw0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0|20e6",
			"America/Bahia|-02 -03|20 30|01|1GCq0|27e5",
			"America/Managua|CST|60|0||22e5",
			"America/La_Paz|-04|40|0||19e5",
			"America/Lima|-05|50|0||11e6",
			"America/Denver|MST MDT|70 60|01010101010101010101010|1GI90 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|26e5",
			"America/Campo_Grande|-03 -04|30 40|0101010101010101|1GCr0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1HB0 FX0|77e4",
			"America/Cancun|CST CDT EST|60 50 50|01010102|1GQw0 1nX0 14p0 1lb0 14p0 1lb0 Dd0|63e4",
			"America/Caracas|-0430 -04|4u 40|01|1QMT0|29e5",
			"America/Chicago|CST CDT|60 50|01010101010101010101010|1GI80 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|92e5",
			"America/Chihuahua|MST MDT|70 60|01010101010101010101010|1GQx0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0|81e4",
			"America/Phoenix|MST|70|0||42e5",
			"America/Whitehorse|PST PDT MST|80 70 70|0101010101010101012|1GIa0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1z90|23e3",
			"America/New_York|EST EDT|50 40|01010101010101010101010|1GI70 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|21e6",
			"America/Rio_Branco|-04 -05|40 50|01|1KLE0|31e4",
			"America/Los_Angeles|PST PDT|80 70|01010101010101010101010|1GIa0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|15e6",
			"America/Fort_Nelson|PST PDT MST|80 70 70|01010102|1GIa0 1zb0 Op0 1zb0 Op0 1zb0 Op0|39e2",
			"America/Halifax|AST ADT|40 30|01010101010101010101010|1GI60 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|39e4",
			"America/Godthab|-03 -02|30 20|01010101010101010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|17e3",
			"America/Grand_Turk|EST EDT AST|50 40 40|010101021010101010|1GI70 1zb0 Op0 1zb0 Op0 1zb0 Op0 7jA0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|37e2",
			"America/Havana|CST CDT|50 40|01010101010101010101010|1GQt0 1qM0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0|21e5",
			"America/Metlakatla|PST AKST AKDT|80 90 80|01212120121212121|1PAa0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 uM0 jB0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|14e2",
			"America/Miquelon|-03 -02|30 20|01010101010101010101010|1GI50 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|61e2",
			"America/Montevideo|-02 -03|20 30|01010101|1GI40 1o10 11z0 1o10 11z0 1o10 11z0|17e5",
			"America/Noronha|-02|20|0||30e2",
			"America/Port-au-Prince|EST EDT|50 40|010101010101010101010|1GI70 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 3iN0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|23e5",
			"Antarctica/Palmer|-03 -04|30 40|010101010|1H3D0 Op0 1zb0 Rd0 1wn0 Rd0 46n0 Ap0|40",
			"America/Santiago|-03 -04|30 40|010101010101010101010|1H3D0 Op0 1zb0 Rd0 1wn0 Rd0 46n0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1zb0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0|62e5",
			"America/Sao_Paulo|-02 -03|20 30|0101010101010101|1GCq0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1HB0 FX0|20e6",
			"Atlantic/Azores|-01 +00|10 0|01010101010101010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|25e4",
			"America/St_Johns|NST NDT|3u 2u|01010101010101010101010|1GI5u 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0|11e4",
			"Antarctica/Casey|+11 +08|-b0 -80|010101010|1GAF0 blz0 3m10 1o30 14k0 1kr0 12l0 1o01|10",
			"Antarctica/Davis|+05 +07|-50 -70|01|1GAI0|70",
			"Pacific/Port_Moresby|+10|-a0|0||25e4",
			"Australia/Sydney|AEDT AEST|-b0 -a0|01010101010101010101010|1GQg0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0|40e5",
			"Asia/Tashkent|+05|-50|0||23e5",
			"Pacific/Auckland|NZDT NZST|-d0 -c0|01010101010101010101010|1GQe0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00|14e5",
			"Asia/Baghdad|+03|-30|0||66e5",
			"Antarctica/Troll|+00 +02|0 -20|01010101010101010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|40",
			"Asia/Dhaka|+06|-60|0||16e6",
			"Asia/Amman|EET EEST|-20 -30|010101010101010101010|1GPy0 4bX0 Dd0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 LA0 1C00|25e5",
			"Asia/Kamchatka|+12|-c0|0||18e4",
			"Asia/Baku|+04 +05|-40 -50|010101010|1GNA0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00|27e5",
			"Asia/Bangkok|+07|-70|0||15e6",
			"Asia/Barnaul|+07 +06|-70 -60|010|1N7v0 3rd0|",
			"Asia/Beirut|EET EEST|-20 -30|01010101010101010101010|1GNy0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0|22e5",
			"Asia/Kuala_Lumpur|+08|-80|0||71e5",
			"Asia/Kolkata|IST|-5u|0||15e6",
			"Asia/Chita|+10 +08 +09|-a0 -80 -90|012|1N7s0 3re0|33e4",
			"Asia/Ulaanbaatar|+08 +09|-80 -90|01010|1O8G0 1cJ0 1cP0 1cJ0|12e5",
			"Asia/Shanghai|CST|-80|0||23e6",
			"Asia/Colombo|+0530|-5u|0||22e5",
			"Asia/Damascus|EET EEST|-20 -30|01010101010101010101010|1GPy0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0|26e5",
			"Asia/Dili|+09|-90|0||19e4",
			"Asia/Dubai|+04|-40|0||39e5",
			"Asia/Famagusta|EET EEST +03|-20 -30 -30|0101010101201010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 15U0 2Ks0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|",
			"Asia/Gaza|EET EEST|-20 -30|01010101010101010101010|1GPy0 1a00 1fA0 1cL0 1cN0 1nX0 1210 1nA0 1210 1qL0 WN0 1qL0 WN0 1qL0 11c0 1on0 11B0 1o00 11A0 1qo0 Xc0 1qo0|18e5",
			"Asia/Hong_Kong|HKT|-80|0||73e5",
			"Asia/Hovd|+07 +08|-70 -80|01010|1O8H0 1cJ0 1cP0 1cJ0|81e3",
			"Asia/Irkutsk|+09 +08|-90 -80|01|1N7t0|60e4",
			"Europe/Istanbul|EET EEST +03|-20 -30 -30|01010101012|1GNB0 1qM0 11A0 1o00 1200 1nA0 11A0 1tA0 U00 15w0|13e6",
			"Asia/Jakarta|WIB|-70|0||31e6",
			"Asia/Jayapura|WIT|-90|0||26e4",
			"Asia/Jerusalem|IST IDT|-20 -30|01010101010101010101010|1GPA0 1aL0 1eN0 1oL0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0|81e4",
			"Asia/Kabul|+0430|-4u|0||46e5",
			"Asia/Karachi|PKT|-50|0||24e6",
			"Asia/Kathmandu|+0545|-5J|0||12e5",
			"Asia/Yakutsk|+10 +09|-a0 -90|01|1N7s0|28e4",
			"Asia/Krasnoyarsk|+08 +07|-80 -70|01|1N7u0|10e5",
			"Asia/Magadan|+12 +10 +11|-c0 -a0 -b0|012|1N7q0 3Cq0|95e3",
			"Asia/Makassar|WITA|-80|0||15e5",
			"Asia/Manila|PST|-80|0||24e6",
			"Europe/Athens|EET EEST|-20 -30|01010101010101010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|35e5",
			"Asia/Novosibirsk|+07 +06|-70 -60|010|1N7v0 4eN0|15e5",
			"Asia/Omsk|+07 +06|-70 -60|01|1N7v0|12e5",
			"Asia/Pyongyang|KST KST|-90 -8u|010|1P4D0 6BA0|29e5",
			"Asia/Qyzylorda|+06 +05|-60 -50|01|1Xei0|73e4",
			"Asia/Rangoon|+0630|-6u|0||48e5",
			"Asia/Sakhalin|+11 +10|-b0 -a0|010|1N7r0 3rd0|58e4",
			"Asia/Seoul|KST|-90|0||23e6",
			"Asia/Srednekolymsk|+12 +11|-c0 -b0|01|1N7q0|35e2",
			"Asia/Tehran|+0330 +0430|-3u -4u|01010101010101010101010|1GLUu 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0|14e6",
			"Asia/Tokyo|JST|-90|0||38e6",
			"Asia/Tomsk|+07 +06|-70 -60|010|1N7v0 3Qp0|10e5",
			"Asia/Vladivostok|+11 +10|-b0 -a0|01|1N7r0|60e4",
			"Asia/Yekaterinburg|+06 +05|-60 -50|01|1N7w0|14e5",
			"Europe/Lisbon|WET WEST|0 -10|01010101010101010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|27e5",
			"Atlantic/Cape_Verde|-01|10|0||50e4",
			"Australia/Adelaide|ACDT ACST|-au -9u|01010101010101010101010|1GQgu 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0|11e5",
			"Australia/Brisbane|AEST|-a0|0||20e5",
			"Australia/Darwin|ACST|-9u|0||12e4",
			"Australia/Eucla|+0845|-8J|0||368",
			"Australia/Lord_Howe|+11 +1030|-b0 -au|01010101010101010101010|1GQf0 1fAu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1fAu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu|347",
			"Australia/Perth|AWST|-80|0||18e5",
			"Pacific/Easter|-05 -06|50 60|010101010101010101010|1H3D0 Op0 1zb0 Rd0 1wn0 Rd0 46n0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1zb0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0|30e2",
			"Europe/Dublin|GMT IST|0 -10|01010101010101010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|12e5",
			"Etc/GMT-1|+01|-10|0||",
			"Pacific/Guadalcanal|+11|-b0|0||11e4",
			"Pacific/Fakaofo|+13|-d0|0||483",
			"Pacific/Kiritimati|+14|-e0|0||51e2",
			"Etc/GMT-2|+02|-20|0||",
			"Pacific/Tahiti|-10|a0|0||18e4",
			"Pacific/Niue|-11|b0|0||12e2",
			"Etc/GMT+12|-12|c0|0||",
			"Pacific/Galapagos|-06|60|0||25e3",
			"Etc/GMT+7|-07|70|0||",
			"Pacific/Pitcairn|-08|80|0||56",
			"Pacific/Gambier|-09|90|0||125",
			"Etc/UTC|UTC|0|0||",
			"Europe/Ulyanovsk|+04 +03|-40 -30|010|1N7y0 3rd0|13e5",
			"Europe/London|GMT BST|0 -10|01010101010101010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|10e6",
			"Europe/Chisinau|EET EEST|-20 -30|01010101010101010101010|1GNA0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|67e4",
			"Europe/Kaliningrad|+03 EET|-30 -20|01|1N7z0|44e4",
			"Europe/Kirov|+04 +03|-40 -30|01|1N7y0|48e4",
			"Europe/Moscow|MSK MSK|-40 -30|01|1N7y0|16e6",
			"Europe/Saratov|+04 +03|-40 -30|010|1N7y0 5810|",
			"Europe/Simferopol|EET EEST MSK MSK|-20 -30 -40 -30|0101023|1GNB0 1qM0 11A0 1o00 11z0 1nW0|33e4",
			"Europe/Volgograd|+04 +03|-40 -30|0101|1N7y0 9Jd0 5gn0|10e5",
			"Pacific/Honolulu|HST|a0|0||37e4",
			"MET|MET MEST|-10 -20|01010101010101010101010|1GNB0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|",
			"Pacific/Chatham|+1345 +1245|-dJ -cJ|01010101010101010101010|1GQe0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00|600",
			"Pacific/Apia|+14 +13|-e0 -d0|01010101010101010101|1GQe0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0|37e3",
			"Pacific/Bougainville|+10 +11|-a0 -b0|01|1NwE0|18e4",
			"Pacific/Fiji|+13 +12|-d0 -c0|010101010101010101010|1Goe0 1Nc0 Ao0 1Q00 xz0 1SN0 uM0 1SM0 uM0 1VA0 s00 1VA0 s00 1VA0 s00 20o0 pc0 2hc0 bc0 4q00|88e4",
			"Pacific/Guam|ChST|-a0|0||17e4",
			"Pacific/Marquesas|-0930|9u|0||86e2",
			"Pacific/Pago_Pago|SST|b0|0||37e2",
			"Pacific/Norfolk|+1130 +11 +12|-bu -b0 -c0|012121212|1PoCu 9Jcu 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0|25e4",
			"Pacific/Tongatapu|+13 +14|-d0 -e0|010|1S4d0 s00|75e3"
		],
		"links": [
			"Africa/Abidjan|Africa/Accra",
			"Africa/Abidjan|Africa/Bamako",
			"Africa/Abidjan|Africa/Banjul",
			"Africa/Abidjan|Africa/Bissau",
			"Africa/Abidjan|Africa/Conakry",
			"Africa/Abidjan|Africa/Dakar",
			"Africa/Abidjan|Africa/Freetown",
			"Africa/Abidjan|Africa/Lome",
			"Africa/Abidjan|Africa/Monrovia",
			"Africa/Abidjan|Africa/Nouakchott",
			"Africa/Abidjan|Africa/Ouagadougou",
			"Africa/Abidjan|Africa/Timbuktu",
			"Africa/Abidjan|America/Danmarkshavn",
			"Africa/Abidjan|Atlantic/Reykjavik",
			"Africa/Abidjan|Atlantic/St_Helena",
			"Africa/Abidjan|Etc/GMT",
			"Africa/Abidjan|Etc/GMT+0",
			"Africa/Abidjan|Etc/GMT-0",
			"Africa/Abidjan|Etc/GMT0",
			"Africa/Abidjan|Etc/Greenwich",
			"Africa/Abidjan|GMT",
			"Africa/Abidjan|GMT+0",
			"Africa/Abidjan|GMT-0",
			"Africa/Abidjan|GMT0",
			"Africa/Abidjan|Greenwich",
			"Africa/Abidjan|Iceland",
			"Africa/Algiers|Africa/Tunis",
			"Africa/Cairo|Egypt",
			"Africa/Casablanca|Africa/El_Aaiun",
			"Africa/Johannesburg|Africa/Maseru",
			"Africa/Johannesburg|Africa/Mbabane",
			"Africa/Lagos|Africa/Bangui",
			"Africa/Lagos|Africa/Brazzaville",
			"Africa/Lagos|Africa/Douala",
			"Africa/Lagos|Africa/Kinshasa",
			"Africa/Lagos|Africa/Libreville",
			"Africa/Lagos|Africa/Luanda",
			"Africa/Lagos|Africa/Malabo",
			"Africa/Lagos|Africa/Ndjamena",
			"Africa/Lagos|Africa/Niamey",
			"Africa/Lagos|Africa/Porto-Novo",
			"Africa/Maputo|Africa/Blantyre",
			"Africa/Maputo|Africa/Bujumbura",
			"Africa/Maputo|Africa/Gaborone",
			"Africa/Maputo|Africa/Harare",
			"Africa/Maputo|Africa/Kigali",
			"Africa/Maputo|Africa/Lubumbashi",
			"Africa/Maputo|Africa/Lusaka",
			"Africa/Nairobi|Africa/Addis_Ababa",
			"Africa/Nairobi|Africa/Asmara",
			"Africa/Nairobi|Africa/Asmera",
			"Africa/Nairobi|Africa/Dar_es_Salaam",
			"Africa/Nairobi|Africa/Djibouti",
			"Africa/Nairobi|Africa/Kampala",
			"Africa/Nairobi|Africa/Mogadishu",
			"Africa/Nairobi|Indian/Antananarivo",
			"Africa/Nairobi|Indian/Comoro",
			"Africa/Nairobi|Indian/Mayotte",
			"Africa/Tripoli|Libya",
			"America/Adak|America/Atka",
			"America/Adak|US/Aleutian",
			"America/Anchorage|America/Juneau",
			"America/Anchorage|America/Nome",
			"America/Anchorage|America/Sitka",
			"America/Anchorage|America/Yakutat",
			"America/Anchorage|US/Alaska",
			"America/Campo_Grande|America/Cuiaba",
			"America/Chicago|America/Indiana/Knox",
			"America/Chicago|America/Indiana/Tell_City",
			"America/Chicago|America/Knox_IN",
			"America/Chicago|America/Matamoros",
			"America/Chicago|America/Menominee",
			"America/Chicago|America/North_Dakota/Beulah",
			"America/Chicago|America/North_Dakota/Center",
			"America/Chicago|America/North_Dakota/New_Salem",
			"America/Chicago|America/Rainy_River",
			"America/Chicago|America/Rankin_Inlet",
			"America/Chicago|America/Resolute",
			"America/Chicago|America/Winnipeg",
			"America/Chicago|CST6CDT",
			"America/Chicago|Canada/Central",
			"America/Chicago|US/Central",
			"America/Chicago|US/Indiana-Starke",
			"America/Chihuahua|America/Mazatlan",
			"America/Chihuahua|Mexico/BajaSur",
			"America/Denver|America/Boise",
			"America/Denver|America/Cambridge_Bay",
			"America/Denver|America/Edmonton",
			"America/Denver|America/Inuvik",
			"America/Denver|America/Ojinaga",
			"America/Denver|America/Shiprock",
			"America/Denver|America/Yellowknife",
			"America/Denver|Canada/Mountain",
			"America/Denver|MST7MDT",
			"America/Denver|Navajo",
			"America/Denver|US/Mountain",
			"America/Fortaleza|America/Argentina/Buenos_Aires",
			"America/Fortaleza|America/Argentina/Catamarca",
			"America/Fortaleza|America/Argentina/ComodRivadavia",
			"America/Fortaleza|America/Argentina/Cordoba",
			"America/Fortaleza|America/Argentina/Jujuy",
			"America/Fortaleza|America/Argentina/La_Rioja",
			"America/Fortaleza|America/Argentina/Mendoza",
			"America/Fortaleza|America/Argentina/Rio_Gallegos",
			"America/Fortaleza|America/Argentina/Salta",
			"America/Fortaleza|America/Argentina/San_Juan",
			"America/Fortaleza|America/Argentina/San_Luis",
			"America/Fortaleza|America/Argentina/Tucuman",
			"America/Fortaleza|America/Argentina/Ushuaia",
			"America/Fortaleza|America/Belem",
			"America/Fortaleza|America/Buenos_Aires",
			"America/Fortaleza|America/Catamarca",
			"America/Fortaleza|America/Cayenne",
			"America/Fortaleza|America/Cordoba",
			"America/Fortaleza|America/Jujuy",
			"America/Fortaleza|America/Maceio",
			"America/Fortaleza|America/Mendoza",
			"America/Fortaleza|America/Paramaribo",
			"America/Fortaleza|America/Recife",
			"America/Fortaleza|America/Rosario",
			"America/Fortaleza|America/Santarem",
			"America/Fortaleza|Antarctica/Rothera",
			"America/Fortaleza|Atlantic/Stanley",
			"America/Fortaleza|Etc/GMT+3",
			"America/Godthab|America/Nuuk",
			"America/Halifax|America/Glace_Bay",
			"America/Halifax|America/Goose_Bay",
			"America/Halifax|America/Moncton",
			"America/Halifax|America/Thule",
			"America/Halifax|Atlantic/Bermuda",
			"America/Halifax|Canada/Atlantic",
			"America/Havana|Cuba",
			"America/La_Paz|America/Boa_Vista",
			"America/La_Paz|America/Guyana",
			"America/La_Paz|America/Manaus",
			"America/La_Paz|America/Porto_Velho",
			"America/La_Paz|Brazil/West",
			"America/La_Paz|Etc/GMT+4",
			"America/Lima|America/Bogota",
			"America/Lima|America/Guayaquil",
			"America/Lima|Etc/GMT+5",
			"America/Los_Angeles|America/Ensenada",
			"America/Los_Angeles|America/Santa_Isabel",
			"America/Los_Angeles|America/Tijuana",
			"America/Los_Angeles|America/Vancouver",
			"America/Los_Angeles|Canada/Pacific",
			"America/Los_Angeles|Mexico/BajaNorte",
			"America/Los_Angeles|PST8PDT",
			"America/Los_Angeles|US/Pacific",
			"America/Managua|America/Belize",
			"America/Managua|America/Costa_Rica",
			"America/Managua|America/El_Salvador",
			"America/Managua|America/Guatemala",
			"America/Managua|America/Regina",
			"America/Managua|America/Swift_Current",
			"America/Managua|America/Tegucigalpa",
			"America/Managua|Canada/Saskatchewan",
			"America/Mexico_City|America/Bahia_Banderas",
			"America/Mexico_City|America/Merida",
			"America/Mexico_City|America/Monterrey",
			"America/Mexico_City|Mexico/General",
			"America/New_York|America/Detroit",
			"America/New_York|America/Fort_Wayne",
			"America/New_York|America/Indiana/Indianapolis",
			"America/New_York|America/Indiana/Marengo",
			"America/New_York|America/Indiana/Petersburg",
			"America/New_York|America/Indiana/Vevay",
			"America/New_York|America/Indiana/Vincennes",
			"America/New_York|America/Indiana/Winamac",
			"America/New_York|America/Indianapolis",
			"America/New_York|America/Iqaluit",
			"America/New_York|America/Kentucky/Louisville",
			"America/New_York|America/Kentucky/Monticello",
			"America/New_York|America/Louisville",
			"America/New_York|America/Montreal",
			"America/New_York|America/Nassau",
			"America/New_York|America/Nipigon",
			"America/New_York|America/Pangnirtung",
			"America/New_York|America/Thunder_Bay",
			"America/New_York|America/Toronto",
			"America/New_York|Canada/Eastern",
			"America/New_York|EST5EDT",
			"America/New_York|US/East-Indiana",
			"America/New_York|US/Eastern",
			"America/New_York|US/Michigan",
			"America/Noronha|Atlantic/South_Georgia",
			"America/Noronha|Brazil/DeNoronha",
			"America/Noronha|Etc/GMT+2",
			"America/Panama|America/Atikokan",
			"America/Panama|America/Cayman",
			"America/Panama|America/Coral_Harbour",
			"America/Panama|America/Jamaica",
			"America/Panama|EST",
			"America/Panama|Jamaica",
			"America/Phoenix|America/Creston",
			"America/Phoenix|America/Dawson_Creek",
			"America/Phoenix|America/Hermosillo",
			"America/Phoenix|MST",
			"America/Phoenix|US/Arizona",
			"America/Rio_Branco|America/Eirunepe",
			"America/Rio_Branco|America/Porto_Acre",
			"America/Rio_Branco|Brazil/Acre",
			"America/Santiago|Chile/Continental",
			"America/Santo_Domingo|America/Anguilla",
			"America/Santo_Domingo|America/Antigua",
			"America/Santo_Domingo|America/Aruba",
			"America/Santo_Domingo|America/Barbados",
			"America/Santo_Domingo|America/Blanc-Sablon",
			"America/Santo_Domingo|America/Curacao",
			"America/Santo_Domingo|America/Dominica",
			"America/Santo_Domingo|America/Grenada",
			"America/Santo_Domingo|America/Guadeloupe",
			"America/Santo_Domingo|America/Kralendijk",
			"America/Santo_Domingo|America/Lower_Princes",
			"America/Santo_Domingo|America/Marigot",
			"America/Santo_Domingo|America/Martinique",
			"America/Santo_Domingo|America/Montserrat",
			"America/Santo_Domingo|America/Port_of_Spain",
			"America/Santo_Domingo|America/Puerto_Rico",
			"America/Santo_Domingo|America/St_Barthelemy",
			"America/Santo_Domingo|America/St_Kitts",
			"America/Santo_Domingo|America/St_Lucia",
			"America/Santo_Domingo|America/St_Thomas",
			"America/Santo_Domingo|America/St_Vincent",
			"America/Santo_Domingo|America/Tortola",
			"America/Santo_Domingo|America/Virgin",
			"America/Sao_Paulo|Brazil/East",
			"America/St_Johns|Canada/Newfoundland",
			"America/Whitehorse|America/Dawson",
			"America/Whitehorse|Canada/Yukon",
			"Antarctica/Palmer|America/Punta_Arenas",
			"Asia/Baghdad|Antarctica/Syowa",
			"Asia/Baghdad|Asia/Aden",
			"Asia/Baghdad|Asia/Bahrain",
			"Asia/Baghdad|Asia/Kuwait",
			"Asia/Baghdad|Asia/Qatar",
			"Asia/Baghdad|Asia/Riyadh",
			"Asia/Baghdad|Etc/GMT-3",
			"Asia/Baghdad|Europe/Minsk",
			"Asia/Bangkok|Asia/Ho_Chi_Minh",
			"Asia/Bangkok|Asia/Novokuznetsk",
			"Asia/Bangkok|Asia/Phnom_Penh",
			"Asia/Bangkok|Asia/Saigon",
			"Asia/Bangkok|Asia/Vientiane",
			"Asia/Bangkok|Etc/GMT-7",
			"Asia/Bangkok|Indian/Christmas",
			"Asia/Dhaka|Antarctica/Vostok",
			"Asia/Dhaka|Asia/Almaty",
			"Asia/Dhaka|Asia/Bishkek",
			"Asia/Dhaka|Asia/Dacca",
			"Asia/Dhaka|Asia/Kashgar",
			"Asia/Dhaka|Asia/Qostanay",
			"Asia/Dhaka|Asia/Thimbu",
			"Asia/Dhaka|Asia/Thimphu",
			"Asia/Dhaka|Asia/Urumqi",
			"Asia/Dhaka|Etc/GMT-6",
			"Asia/Dhaka|Indian/Chagos",
			"Asia/Dili|Etc/GMT-9",
			"Asia/Dili|Pacific/Palau",
			"Asia/Dubai|Asia/Muscat",
			"Asia/Dubai|Asia/Tbilisi",
			"Asia/Dubai|Asia/Yerevan",
			"Asia/Dubai|Etc/GMT-4",
			"Asia/Dubai|Europe/Samara",
			"Asia/Dubai|Indian/Mahe",
			"Asia/Dubai|Indian/Mauritius",
			"Asia/Dubai|Indian/Reunion",
			"Asia/Gaza|Asia/Hebron",
			"Asia/Hong_Kong|Hongkong",
			"Asia/Jakarta|Asia/Pontianak",
			"Asia/Jerusalem|Asia/Tel_Aviv",
			"Asia/Jerusalem|Israel",
			"Asia/Kamchatka|Asia/Anadyr",
			"Asia/Kamchatka|Etc/GMT-12",
			"Asia/Kamchatka|Kwajalein",
			"Asia/Kamchatka|Pacific/Funafuti",
			"Asia/Kamchatka|Pacific/Kwajalein",
			"Asia/Kamchatka|Pacific/Majuro",
			"Asia/Kamchatka|Pacific/Nauru",
			"Asia/Kamchatka|Pacific/Tarawa",
			"Asia/Kamchatka|Pacific/Wake",
			"Asia/Kamchatka|Pacific/Wallis",
			"Asia/Kathmandu|Asia/Katmandu",
			"Asia/Kolkata|Asia/Calcutta",
			"Asia/Kuala_Lumpur|Asia/Brunei",
			"Asia/Kuala_Lumpur|Asia/Kuching",
			"Asia/Kuala_Lumpur|Asia/Singapore",
			"Asia/Kuala_Lumpur|Etc/GMT-8",
			"Asia/Kuala_Lumpur|Singapore",
			"Asia/Makassar|Asia/Ujung_Pandang",
			"Asia/Rangoon|Asia/Yangon",
			"Asia/Rangoon|Indian/Cocos",
			"Asia/Seoul|ROK",
			"Asia/Shanghai|Asia/Chongqing",
			"Asia/Shanghai|Asia/Chungking",
			"Asia/Shanghai|Asia/Harbin",
			"Asia/Shanghai|Asia/Macao",
			"Asia/Shanghai|Asia/Macau",
			"Asia/Shanghai|Asia/Taipei",
			"Asia/Shanghai|PRC",
			"Asia/Shanghai|ROC",
			"Asia/Tashkent|Antarctica/Mawson",
			"Asia/Tashkent|Asia/Aqtau",
			"Asia/Tashkent|Asia/Aqtobe",
			"Asia/Tashkent|Asia/Ashgabat",
			"Asia/Tashkent|Asia/Ashkhabad",
			"Asia/Tashkent|Asia/Atyrau",
			"Asia/Tashkent|Asia/Dushanbe",
			"Asia/Tashkent|Asia/Oral",
			"Asia/Tashkent|Asia/Samarkand",
			"Asia/Tashkent|Etc/GMT-5",
			"Asia/Tashkent|Indian/Kerguelen",
			"Asia/Tashkent|Indian/Maldives",
			"Asia/Tehran|Iran",
			"Asia/Tokyo|Japan",
			"Asia/Ulaanbaatar|Asia/Choibalsan",
			"Asia/Ulaanbaatar|Asia/Ulan_Bator",
			"Asia/Vladivostok|Asia/Ust-Nera",
			"Asia/Yakutsk|Asia/Khandyga",
			"Atlantic/Azores|America/Scoresbysund",
			"Atlantic/Cape_Verde|Etc/GMT+1",
			"Australia/Adelaide|Australia/Broken_Hill",
			"Australia/Adelaide|Australia/South",
			"Australia/Adelaide|Australia/Yancowinna",
			"Australia/Brisbane|Australia/Lindeman",
			"Australia/Brisbane|Australia/Queensland",
			"Australia/Darwin|Australia/North",
			"Australia/Lord_Howe|Australia/LHI",
			"Australia/Perth|Australia/West",
			"Australia/Sydney|Antarctica/Macquarie",
			"Australia/Sydney|Australia/ACT",
			"Australia/Sydney|Australia/Canberra",
			"Australia/Sydney|Australia/Currie",
			"Australia/Sydney|Australia/Hobart",
			"Australia/Sydney|Australia/Melbourne",
			"Australia/Sydney|Australia/NSW",
			"Australia/Sydney|Australia/Tasmania",
			"Australia/Sydney|Australia/Victoria",
			"Etc/UTC|Etc/UCT",
			"Etc/UTC|Etc/Universal",
			"Etc/UTC|Etc/Zulu",
			"Etc/UTC|UCT",
			"Etc/UTC|UTC",
			"Etc/UTC|Universal",
			"Etc/UTC|Zulu",
			"Europe/Athens|Asia/Nicosia",
			"Europe/Athens|EET",
			"Europe/Athens|Europe/Bucharest",
			"Europe/Athens|Europe/Helsinki",
			"Europe/Athens|Europe/Kiev",
			"Europe/Athens|Europe/Mariehamn",
			"Europe/Athens|Europe/Nicosia",
			"Europe/Athens|Europe/Riga",
			"Europe/Athens|Europe/Sofia",
			"Europe/Athens|Europe/Tallinn",
			"Europe/Athens|Europe/Uzhgorod",
			"Europe/Athens|Europe/Vilnius",
			"Europe/Athens|Europe/Zaporozhye",
			"Europe/Chisinau|Europe/Tiraspol",
			"Europe/Dublin|Eire",
			"Europe/Istanbul|Asia/Istanbul",
			"Europe/Istanbul|Turkey",
			"Europe/Lisbon|Atlantic/Canary",
			"Europe/Lisbon|Atlantic/Faeroe",
			"Europe/Lisbon|Atlantic/Faroe",
			"Europe/Lisbon|Atlantic/Madeira",
			"Europe/Lisbon|Portugal",
			"Europe/Lisbon|WET",
			"Europe/London|Europe/Belfast",
			"Europe/London|Europe/Guernsey",
			"Europe/London|Europe/Isle_of_Man",
			"Europe/London|Europe/Jersey",
			"Europe/London|GB",
			"Europe/London|GB-Eire",
			"Europe/Moscow|W-SU",
			"Europe/Paris|Africa/Ceuta",
			"Europe/Paris|Arctic/Longyearbyen",
			"Europe/Paris|Atlantic/Jan_Mayen",
			"Europe/Paris|CET",
			"Europe/Paris|Europe/Amsterdam",
			"Europe/Paris|Europe/Andorra",
			"Europe/Paris|Europe/Belgrade",
			"Europe/Paris|Europe/Berlin",
			"Europe/Paris|Europe/Bratislava",
			"Europe/Paris|Europe/Brussels",
			"Europe/Paris|Europe/Budapest",
			"Europe/Paris|Europe/Busingen",
			"Europe/Paris|Europe/Copenhagen",
			"Europe/Paris|Europe/Gibraltar",
			"Europe/Paris|Europe/Ljubljana",
			"Europe/Paris|Europe/Luxembourg",
			"Europe/Paris|Europe/Madrid",
			"Europe/Paris|Europe/Malta",
			"Europe/Paris|Europe/Monaco",
			"Europe/Paris|Europe/Oslo",
			"Europe/Paris|Europe/Podgorica",
			"Europe/Paris|Europe/Prague",
			"Europe/Paris|Europe/Rome",
			"Europe/Paris|Europe/San_Marino",
			"Europe/Paris|Europe/Sarajevo",
			"Europe/Paris|Europe/Skopje",
			"Europe/Paris|Europe/Stockholm",
			"Europe/Paris|Europe/Tirane",
			"Europe/Paris|Europe/Vaduz",
			"Europe/Paris|Europe/Vatican",
			"Europe/Paris|Europe/Vienna",
			"Europe/Paris|Europe/Warsaw",
			"Europe/Paris|Europe/Zagreb",
			"Europe/Paris|Europe/Zurich",
			"Europe/Paris|Poland",
			"Europe/Ulyanovsk|Europe/Astrakhan",
			"Pacific/Auckland|Antarctica/McMurdo",
			"Pacific/Auckland|Antarctica/South_Pole",
			"Pacific/Auckland|NZ",
			"Pacific/Chatham|NZ-CHAT",
			"Pacific/Easter|Chile/EasterIsland",
			"Pacific/Fakaofo|Etc/GMT-13",
			"Pacific/Fakaofo|Pacific/Enderbury",
			"Pacific/Fakaofo|Pacific/Kanton",
			"Pacific/Galapagos|Etc/GMT+6",
			"Pacific/Gambier|Etc/GMT+9",
			"Pacific/Guadalcanal|Etc/GMT-11",
			"Pacific/Guadalcanal|Pacific/Efate",
			"Pacific/Guadalcanal|Pacific/Kosrae",
			"Pacific/Guadalcanal|Pacific/Noumea",
			"Pacific/Guadalcanal|Pacific/Pohnpei",
			"Pacific/Guadalcanal|Pacific/Ponape",
			"Pacific/Guam|Pacific/Saipan",
			"Pacific/Honolulu|HST",
			"Pacific/Honolulu|Pacific/Johnston",
			"Pacific/Honolulu|US/Hawaii",
			"Pacific/Kiritimati|Etc/GMT-14",
			"Pacific/Niue|Etc/GMT+11",
			"Pacific/Pago_Pago|Pacific/Midway",
			"Pacific/Pago_Pago|Pacific/Samoa",
			"Pacific/Pago_Pago|US/Samoa",
			"Pacific/Pitcairn|Etc/GMT+8",
			"Pacific/Port_Moresby|Antarctica/DumontDUrville",
			"Pacific/Port_Moresby|Etc/GMT-10",
			"Pacific/Port_Moresby|Pacific/Chuuk",
			"Pacific/Port_Moresby|Pacific/Truk",
			"Pacific/Port_Moresby|Pacific/Yap",
			"Pacific/Tahiti|Etc/GMT+10",
			"Pacific/Tahiti|Pacific/Rarotonga"
		],
		"countries": [
			"AD|Europe/Andorra",
			"AE|Asia/Dubai",
			"AF|Asia/Kabul",
			"AG|America/Port_of_Spain America/Antigua",
			"AI|America/Port_of_Spain America/Anguilla",
			"AL|Europe/Tirane",
			"AM|Asia/Yerevan",
			"AO|Africa/Lagos Africa/Luanda",
			"AQ|Antarctica/Casey Antarctica/Davis Antarctica/DumontDUrville Antarctica/Mawson Antarctica/Palmer Antarctica/Rothera Antarctica/Syowa Antarctica/Troll Antarctica/Vostok Pacific/Auckland Antarctica/McMurdo",
			"AR|America/Argentina/Buenos_Aires America/Argentina/Cordoba America/Argentina/Salta America/Argentina/Jujuy America/Argentina/Tucuman America/Argentina/Catamarca America/Argentina/La_Rioja America/Argentina/San_Juan America/Argentina/Mendoza America/Argentina/San_Luis America/Argentina/Rio_Gallegos America/Argentina/Ushuaia",
			"AS|Pacific/Pago_Pago",
			"AT|Europe/Vienna",
			"AU|Australia/Lord_Howe Antarctica/Macquarie Australia/Hobart Australia/Melbourne Australia/Sydney Australia/Broken_Hill Australia/Brisbane Australia/Lindeman Australia/Adelaide Australia/Darwin Australia/Perth Australia/Eucla",
			"AW|America/Curacao America/Aruba",
			"AX|Europe/Helsinki Europe/Mariehamn",
			"AZ|Asia/Baku",
			"BA|Europe/Belgrade Europe/Sarajevo",
			"BB|America/Barbados",
			"BD|Asia/Dhaka",
			"BE|Europe/Brussels",
			"BF|Africa/Abidjan Africa/Ouagadougou",
			"BG|Europe/Sofia",
			"BH|Asia/Qatar Asia/Bahrain",
			"BI|Africa/Maputo Africa/Bujumbura",
			"BJ|Africa/Lagos Africa/Porto-Novo",
			"BL|America/Port_of_Spain America/St_Barthelemy",
			"BM|Atlantic/Bermuda",
			"BN|Asia/Brunei",
			"BO|America/La_Paz",
			"BQ|America/Curacao America/Kralendijk",
			"BR|America/Noronha America/Belem America/Fortaleza America/Recife America/Araguaina America/Maceio America/Bahia America/Sao_Paulo America/Campo_Grande America/Cuiaba America/Santarem America/Porto_Velho America/Boa_Vista America/Manaus America/Eirunepe America/Rio_Branco",
			"BS|America/Nassau",
			"BT|Asia/Thimphu",
			"BW|Africa/Maputo Africa/Gaborone",
			"BY|Europe/Minsk",
			"BZ|America/Belize",
			"CA|America/St_Johns America/Halifax America/Glace_Bay America/Moncton America/Goose_Bay America/Blanc-Sablon America/Toronto America/Nipigon America/Thunder_Bay America/Iqaluit America/Pangnirtung America/Atikokan America/Winnipeg America/Rainy_River America/Resolute America/Rankin_Inlet America/Regina America/Swift_Current America/Edmonton America/Cambridge_Bay America/Yellowknife America/Inuvik America/Creston America/Dawson_Creek America/Fort_Nelson America/Whitehorse America/Dawson America/Vancouver",
			"CC|Indian/Cocos",
			"CD|Africa/Maputo Africa/Lagos Africa/Kinshasa Africa/Lubumbashi",
			"CF|Africa/Lagos Africa/Bangui",
			"CG|Africa/Lagos Africa/Brazzaville",
			"CH|Europe/Zurich",
			"CI|Africa/Abidjan",
			"CK|Pacific/Rarotonga",
			"CL|America/Santiago America/Punta_Arenas Pacific/Easter",
			"CM|Africa/Lagos Africa/Douala",
			"CN|Asia/Shanghai Asia/Urumqi",
			"CO|America/Bogota",
			"CR|America/Costa_Rica",
			"CU|America/Havana",
			"CV|Atlantic/Cape_Verde",
			"CW|America/Curacao",
			"CX|Indian/Christmas",
			"CY|Asia/Nicosia Asia/Famagusta",
			"CZ|Europe/Prague",
			"DE|Europe/Zurich Europe/Berlin Europe/Busingen",
			"DJ|Africa/Nairobi Africa/Djibouti",
			"DK|Europe/Copenhagen",
			"DM|America/Port_of_Spain America/Dominica",
			"DO|America/Santo_Domingo",
			"DZ|Africa/Algiers",
			"EC|America/Guayaquil Pacific/Galapagos",
			"EE|Europe/Tallinn",
			"EG|Africa/Cairo",
			"EH|Africa/El_Aaiun",
			"ER|Africa/Nairobi Africa/Asmara",
			"ES|Europe/Madrid Africa/Ceuta Atlantic/Canary",
			"ET|Africa/Nairobi Africa/Addis_Ababa",
			"FI|Europe/Helsinki",
			"FJ|Pacific/Fiji",
			"FK|Atlantic/Stanley",
			"FM|Pacific/Chuuk Pacific/Pohnpei Pacific/Kosrae",
			"FO|Atlantic/Faroe",
			"FR|Europe/Paris",
			"GA|Africa/Lagos Africa/Libreville",
			"GB|Europe/London",
			"GD|America/Port_of_Spain America/Grenada",
			"GE|Asia/Tbilisi",
			"GF|America/Cayenne",
			"GG|Europe/London Europe/Guernsey",
			"GH|Africa/Accra",
			"GI|Europe/Gibraltar",
			"GL|America/Nuuk America/Danmarkshavn America/Scoresbysund America/Thule",
			"GM|Africa/Abidjan Africa/Banjul",
			"GN|Africa/Abidjan Africa/Conakry",
			"GP|America/Port_of_Spain America/Guadeloupe",
			"GQ|Africa/Lagos Africa/Malabo",
			"GR|Europe/Athens",
			"GS|Atlantic/South_Georgia",
			"GT|America/Guatemala",
			"GU|Pacific/Guam",
			"GW|Africa/Bissau",
			"GY|America/Guyana",
			"HK|Asia/Hong_Kong",
			"HN|America/Tegucigalpa",
			"HR|Europe/Belgrade Europe/Zagreb",
			"HT|America/Port-au-Prince",
			"HU|Europe/Budapest",
			"ID|Asia/Jakarta Asia/Pontianak Asia/Makassar Asia/Jayapura",
			"IE|Europe/Dublin",
			"IL|Asia/Jerusalem",
			"IM|Europe/London Europe/Isle_of_Man",
			"IN|Asia/Kolkata",
			"IO|Indian/Chagos",
			"IQ|Asia/Baghdad",
			"IR|Asia/Tehran",
			"IS|Atlantic/Reykjavik",
			"IT|Europe/Rome",
			"JE|Europe/London Europe/Jersey",
			"JM|America/Jamaica",
			"JO|Asia/Amman",
			"JP|Asia/Tokyo",
			"KE|Africa/Nairobi",
			"KG|Asia/Bishkek",
			"KH|Asia/Bangkok Asia/Phnom_Penh",
			"KI|Pacific/Tarawa Pacific/Enderbury Pacific/Kiritimati",
			"KM|Africa/Nairobi Indian/Comoro",
			"KN|America/Port_of_Spain America/St_Kitts",
			"KP|Asia/Pyongyang",
			"KR|Asia/Seoul",
			"KW|Asia/Riyadh Asia/Kuwait",
			"KY|America/Panama America/Cayman",
			"KZ|Asia/Almaty Asia/Qyzylorda Asia/Qostanay Asia/Aqtobe Asia/Aqtau Asia/Atyrau Asia/Oral",
			"LA|Asia/Bangkok Asia/Vientiane",
			"LB|Asia/Beirut",
			"LC|America/Port_of_Spain America/St_Lucia",
			"LI|Europe/Zurich Europe/Vaduz",
			"LK|Asia/Colombo",
			"LR|Africa/Monrovia",
			"LS|Africa/Johannesburg Africa/Maseru",
			"LT|Europe/Vilnius",
			"LU|Europe/Luxembourg",
			"LV|Europe/Riga",
			"LY|Africa/Tripoli",
			"MA|Africa/Casablanca",
			"MC|Europe/Monaco",
			"MD|Europe/Chisinau",
			"ME|Europe/Belgrade Europe/Podgorica",
			"MF|America/Port_of_Spain America/Marigot",
			"MG|Africa/Nairobi Indian/Antananarivo",
			"MH|Pacific/Majuro Pacific/Kwajalein",
			"MK|Europe/Belgrade Europe/Skopje",
			"ML|Africa/Abidjan Africa/Bamako",
			"MM|Asia/Yangon",
			"MN|Asia/Ulaanbaatar Asia/Hovd Asia/Choibalsan",
			"MO|Asia/Macau",
			"MP|Pacific/Guam Pacific/Saipan",
			"MQ|America/Martinique",
			"MR|Africa/Abidjan Africa/Nouakchott",
			"MS|America/Port_of_Spain America/Montserrat",
			"MT|Europe/Malta",
			"MU|Indian/Mauritius",
			"MV|Indian/Maldives",
			"MW|Africa/Maputo Africa/Blantyre",
			"MX|America/Mexico_City America/Cancun America/Merida America/Monterrey America/Matamoros America/Mazatlan America/Chihuahua America/Ojinaga America/Hermosillo America/Tijuana America/Bahia_Banderas",
			"MY|Asia/Kuala_Lumpur Asia/Kuching",
			"MZ|Africa/Maputo",
			"NA|Africa/Windhoek",
			"NC|Pacific/Noumea",
			"NE|Africa/Lagos Africa/Niamey",
			"NF|Pacific/Norfolk",
			"NG|Africa/Lagos",
			"NI|America/Managua",
			"NL|Europe/Amsterdam",
			"NO|Europe/Oslo",
			"NP|Asia/Kathmandu",
			"NR|Pacific/Nauru",
			"NU|Pacific/Niue",
			"NZ|Pacific/Auckland Pacific/Chatham",
			"OM|Asia/Dubai Asia/Muscat",
			"PA|America/Panama",
			"PE|America/Lima",
			"PF|Pacific/Tahiti Pacific/Marquesas Pacific/Gambier",
			"PG|Pacific/Port_Moresby Pacific/Bougainville",
			"PH|Asia/Manila",
			"PK|Asia/Karachi",
			"PL|Europe/Warsaw",
			"PM|America/Miquelon",
			"PN|Pacific/Pitcairn",
			"PR|America/Puerto_Rico",
			"PS|Asia/Gaza Asia/Hebron",
			"PT|Europe/Lisbon Atlantic/Madeira Atlantic/Azores",
			"PW|Pacific/Palau",
			"PY|America/Asuncion",
			"QA|Asia/Qatar",
			"RE|Indian/Reunion",
			"RO|Europe/Bucharest",
			"RS|Europe/Belgrade",
			"RU|Europe/Kaliningrad Europe/Moscow Europe/Simferopol Europe/Kirov Europe/Volgograd Europe/Astrakhan Europe/Saratov Europe/Ulyanovsk Europe/Samara Asia/Yekaterinburg Asia/Omsk Asia/Novosibirsk Asia/Barnaul Asia/Tomsk Asia/Novokuznetsk Asia/Krasnoyarsk Asia/Irkutsk Asia/Chita Asia/Yakutsk Asia/Khandyga Asia/Vladivostok Asia/Ust-Nera Asia/Magadan Asia/Sakhalin Asia/Srednekolymsk Asia/Kamchatka Asia/Anadyr",
			"RW|Africa/Maputo Africa/Kigali",
			"SA|Asia/Riyadh",
			"SB|Pacific/Guadalcanal",
			"SC|Indian/Mahe",
			"SD|Africa/Khartoum",
			"SE|Europe/Stockholm",
			"SG|Asia/Singapore",
			"SH|Africa/Abidjan Atlantic/St_Helena",
			"SI|Europe/Belgrade Europe/Ljubljana",
			"SJ|Europe/Oslo Arctic/Longyearbyen",
			"SK|Europe/Prague Europe/Bratislava",
			"SL|Africa/Abidjan Africa/Freetown",
			"SM|Europe/Rome Europe/San_Marino",
			"SN|Africa/Abidjan Africa/Dakar",
			"SO|Africa/Nairobi Africa/Mogadishu",
			"SR|America/Paramaribo",
			"SS|Africa/Juba",
			"ST|Africa/Sao_Tome",
			"SV|America/El_Salvador",
			"SX|America/Curacao America/Lower_Princes",
			"SY|Asia/Damascus",
			"SZ|Africa/Johannesburg Africa/Mbabane",
			"TC|America/Grand_Turk",
			"TD|Africa/Ndjamena",
			"TF|Indian/Reunion Indian/Kerguelen",
			"TG|Africa/Abidjan Africa/Lome",
			"TH|Asia/Bangkok",
			"TJ|Asia/Dushanbe",
			"TK|Pacific/Fakaofo",
			"TL|Asia/Dili",
			"TM|Asia/Ashgabat",
			"TN|Africa/Tunis",
			"TO|Pacific/Tongatapu",
			"TR|Europe/Istanbul",
			"TT|America/Port_of_Spain",
			"TV|Pacific/Funafuti",
			"TW|Asia/Taipei",
			"TZ|Africa/Nairobi Africa/Dar_es_Salaam",
			"UA|Europe/Simferopol Europe/Kiev Europe/Uzhgorod Europe/Zaporozhye",
			"UG|Africa/Nairobi Africa/Kampala",
			"UM|Pacific/Pago_Pago Pacific/Wake Pacific/Honolulu Pacific/Midway",
			"US|America/New_York America/Detroit America/Kentucky/Louisville America/Kentucky/Monticello America/Indiana/Indianapolis America/Indiana/Vincennes America/Indiana/Winamac America/Indiana/Marengo America/Indiana/Petersburg America/Indiana/Vevay America/Chicago America/Indiana/Tell_City America/Indiana/Knox America/Menominee America/North_Dakota/Center America/North_Dakota/New_Salem America/North_Dakota/Beulah America/Denver America/Boise America/Phoenix America/Los_Angeles America/Anchorage America/Juneau America/Sitka America/Metlakatla America/Yakutat America/Nome America/Adak Pacific/Honolulu",
			"UY|America/Montevideo",
			"UZ|Asia/Samarkand Asia/Tashkent",
			"VA|Europe/Rome Europe/Vatican",
			"VC|America/Port_of_Spain America/St_Vincent",
			"VE|America/Caracas",
			"VG|America/Port_of_Spain America/Tortola",
			"VI|America/Port_of_Spain America/St_Thomas",
			"VN|Asia/Bangkok Asia/Ho_Chi_Minh",
			"VU|Pacific/Efate",
			"WF|Pacific/Wallis",
			"WS|Pacific/Apia",
			"YE|Asia/Riyadh Asia/Aden",
			"YT|Africa/Nairobi Indian/Mayotte",
			"ZA|Africa/Johannesburg",
			"ZM|Africa/Maputo Africa/Lusaka",
			"ZW|Africa/Maputo Africa/Harare"
		]
	});


	return moment;
}));

},{"moment":46}],46:[function(require,module,exports){
//! moment.js
//! version : 2.29.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

    var hookCallback;

    function hooks() {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback(callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return (
            input instanceof Array ||
            Object.prototype.toString.call(input) === '[object Array]'
        );
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return (
            input != null &&
            Object.prototype.toString.call(input) === '[object Object]'
        );
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return Object.getOwnPropertyNames(obj).length === 0;
        } else {
            var k;
            for (k in obj) {
                if (hasOwnProp(obj, k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return (
            typeof input === 'number' ||
            Object.prototype.toString.call(input) === '[object Number]'
        );
    }

    function isDate(input) {
        return (
            input instanceof Date ||
            Object.prototype.toString.call(input) === '[object Date]'
        );
    }

    function map(arr, fn) {
        var res = [],
            i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidEra: null,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false,
            parsedDateParts: [],
            era: null,
            meridiem: null,
            rfc2822: false,
            weekdayMismatch: false,
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this),
                len = t.length >>> 0,
                i;

            for (i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m),
                parsedParts = some.call(flags.parsedDateParts, function (i) {
                    return i != null;
                }),
                isNowValid =
                    !isNaN(m._d.getTime()) &&
                    flags.overflow < 0 &&
                    !flags.empty &&
                    !flags.invalidEra &&
                    !flags.invalidMonth &&
                    !flags.invalidWeekday &&
                    !flags.weekdayMismatch &&
                    !flags.nullInput &&
                    !flags.invalidFormat &&
                    !flags.userInvalidated &&
                    (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid =
                    isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            } else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid(flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        } else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = (hooks.momentProperties = []),
        updateInProgress = false;

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i = 0; i < momentProperties.length; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment(obj) {
        return (
            obj instanceof Moment || (obj != null && obj._isAMomentObject != null)
        );
    }

    function warn(msg) {
        if (
            hooks.suppressDeprecationWarnings === false &&
            typeof console !== 'undefined' &&
            console.warn
        ) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [],
                    arg,
                    i,
                    key;
                for (i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (key in arguments[0]) {
                            if (hasOwnProp(arguments[0], key)) {
                                arg += key + ': ' + arguments[0][key] + ', ';
                            }
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(
                    msg +
                        '\nArguments: ' +
                        Array.prototype.slice.call(args).join('') +
                        '\n' +
                        new Error().stack
                );
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return (
            (typeof Function !== 'undefined' && input instanceof Function) ||
            Object.prototype.toString.call(input) === '[object Function]'
        );
    }

    function set(config) {
        var prop, i;
        for (i in config) {
            if (hasOwnProp(config, i)) {
                prop = config[i];
                if (isFunction(prop)) {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                '|' +
                /\d{1,2}/.source
        );
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig),
            prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (
                hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])
            ) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i,
                res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        nextWeek: 'dddd [at] LT',
        lastDay: '[Yesterday at] LT',
        lastWeek: '[Last] dddd [at] LT',
        sameElse: 'L',
    };

    function calendar(key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (
            (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) +
            absNumber
        );
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
        formatFunctions = {},
        formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken(token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(
                    func.apply(this, arguments),
                    token
                );
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens),
            i,
            length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '',
                i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i])
                    ? array[i].call(mom, format)
                    : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] =
            formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(
                localFormattingTokens,
                replaceLongDateFormatTokens
            );
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var defaultLongDateFormat = {
        LTS: 'h:mm:ss A',
        LT: 'h:mm A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY h:mm A',
        LLLL: 'dddd, MMMM D, YYYY h:mm A',
    };

    function longDateFormat(key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper
            .match(formattingTokens)
            .map(function (tok) {
                if (
                    tok === 'MMMM' ||
                    tok === 'MM' ||
                    tok === 'DD' ||
                    tok === 'dddd'
                ) {
                    return tok.slice(1);
                }
                return tok;
            })
            .join('');

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate() {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d',
        defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal(number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        ss: '%d seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        w: 'a week',
        ww: '%d weeks',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years',
    };

    function relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return isFunction(output)
            ? output(number, withoutSuffix, string, isFuture)
            : output.replace(/%d/i, number);
    }

    function pastFuture(diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string'
            ? aliases[units] || aliases[units.toLowerCase()]
            : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [],
            u;
        for (u in unitsObj) {
            if (hasOwnProp(unitsObj, u)) {
                units.push({ unit: u, priority: priorities[u] });
            }
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function absFloor(number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function makeGetSet(unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get(mom, unit) {
        return mom.isValid()
            ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]()
            : NaN;
    }

    function set$1(mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
            if (
                unit === 'FullYear' &&
                isLeapYear(mom.year()) &&
                mom.month() === 1 &&
                mom.date() === 29
            ) {
                value = toInt(value);
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](
                    value,
                    mom.month(),
                    daysInMonth(value, mom.month())
                );
            } else {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
        }
    }

    // MOMENTS

    function stringGet(units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }

    function stringSet(units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units),
                i;
            for (i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    var match1 = /\d/, //       0 - 9
        match2 = /\d\d/, //      00 - 99
        match3 = /\d{3}/, //     000 - 999
        match4 = /\d{4}/, //    0000 - 9999
        match6 = /[+-]?\d{6}/, // -999999 - 999999
        match1to2 = /\d\d?/, //       0 - 99
        match3to4 = /\d\d\d\d?/, //     999 - 9999
        match5to6 = /\d\d\d\d\d\d?/, //   99999 - 999999
        match1to3 = /\d{1,3}/, //       0 - 999
        match1to4 = /\d{1,4}/, //       0 - 9999
        match1to6 = /[+-]?\d{1,6}/, // -999999 - 999999
        matchUnsigned = /\d+/, //       0 - inf
        matchSigned = /[+-]?\d+/, //    -inf - inf
        matchOffset = /Z|[+-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or Z
        matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
        // any word (or two) characters or numbers including two/three word month in arabic.
        // includes scottish gaelic two word and hyphenated months
        matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
        regexes;

    regexes = {};

    function addRegexToken(token, regex, strictRegex) {
        regexes[token] = isFunction(regex)
            ? regex
            : function (isStrict, localeData) {
                  return isStrict && strictRegex ? strictRegex : regex;
              };
    }

    function getParseRegexForToken(token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(
            s
                .replace('\\', '')
                .replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (
                    matched,
                    p1,
                    p2,
                    p3,
                    p4
                ) {
                    return p1 || p2 || p3 || p4;
                })
        );
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken(token, callback) {
        var i,
            func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken(token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,
        WEEK = 7,
        WEEKDAY = 8;

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1
            ? isLeapYear(year)
                ? 29
                : 28
            : 31 - ((modMonth % 7) % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M', match1to2);
    addRegexToken('MM', match1to2, match2);
    addRegexToken('MMM', function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
            '_'
        ),
        defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split(
            '_'
        ),
        MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
        defaultMonthsShortRegex = matchWord,
        defaultMonthsRegex = matchWord;

    function localeMonths(m, format) {
        if (!m) {
            return isArray(this._months)
                ? this._months
                : this._months['standalone'];
        }
        return isArray(this._months)
            ? this._months[m.month()]
            : this._months[
                  (this._months.isFormat || MONTHS_IN_FORMAT).test(format)
                      ? 'format'
                      : 'standalone'
              ][m.month()];
    }

    function localeMonthsShort(m, format) {
        if (!m) {
            return isArray(this._monthsShort)
                ? this._monthsShort
                : this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort)
            ? this._monthsShort[m.month()]
            : this._monthsShort[
                  MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'
              ][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i,
            ii,
            mom,
            llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse(monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp(
                    '^' + this.months(mom, '').replace('.', '') + '$',
                    'i'
                );
                this._shortMonthsParse[i] = new RegExp(
                    '^' + this.monthsShort(mom, '').replace('.', '') + '$',
                    'i'
                );
            }
            if (!strict && !this._monthsParse[i]) {
                regex =
                    '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'MMMM' &&
                this._longMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'MMM' &&
                this._shortMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth(mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth(value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
    }

    function monthsShortRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict
                ? this._monthsShortStrictRegex
                : this._monthsShortRegex;
        }
    }

    function monthsRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict
                ? this._monthsStrictRegex
                : this._monthsRegex;
        }
    }

    function computeMonthsParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._monthsShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? zeroFill(y, 4) : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY', 4], 0, 'year');
    addFormatToken(0, ['YYYYY', 5], 0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y', matchSigned);
    addRegexToken('YY', match1to2, match2);
    addRegexToken('YYYY', match1to4, match4);
    addRegexToken('YYYYY', match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] =
            input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear() {
        return isLeapYear(this.year());
    }

    function createDate(y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date;
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            date = new Date(y + 400, m, d, h, M, s, ms);
            if (isFinite(date.getFullYear())) {
                date.setFullYear(y);
            }
        } else {
            date = new Date(y, m, d, h, M, s, ms);
        }

        return date;
    }

    function createUTCDate(y) {
        var date, args;
        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            args = Array.prototype.slice.call(arguments);
            // preserve leap years using a full 400 year cycle, then reset
            args[0] = y + 400;
            date = new Date(Date.UTC.apply(null, args));
            if (isFinite(date.getUTCFullYear())) {
                date.setUTCFullYear(y);
            }
        } else {
            date = new Date(Date.UTC.apply(null, arguments));
        }

        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear,
            resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear,
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek,
            resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear,
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w', match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W', match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (
        input,
        week,
        config,
        token
    ) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow: 0, // Sunday is the first day of the week.
        doy: 6, // The week that contains Jan 6th is the first week of the year.
    };

    function localeFirstDayOfWeek() {
        return this._week.dow;
    }

    function localeFirstDayOfYear() {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek(input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d', match1to2);
    addRegexToken('e', match1to2);
    addRegexToken('E', match1to2);
    addRegexToken('dd', function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd', function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd', function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES
    function shiftWeekdays(ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
    }

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
            '_'
        ),
        defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        defaultWeekdaysRegex = matchWord,
        defaultWeekdaysShortRegex = matchWord,
        defaultWeekdaysMinRegex = matchWord;

    function localeWeekdays(m, format) {
        var weekdays = isArray(this._weekdays)
            ? this._weekdays
            : this._weekdays[
                  m && m !== true && this._weekdays.isFormat.test(format)
                      ? 'format'
                      : 'standalone'
              ];
        return m === true
            ? shiftWeekdays(weekdays, this._week.dow)
            : m
            ? weekdays[m.day()]
            : weekdays;
    }

    function localeWeekdaysShort(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysShort, this._week.dow)
            : m
            ? this._weekdaysShort[m.day()]
            : this._weekdaysShort;
    }

    function localeWeekdaysMin(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysMin, this._week.dow)
            : m
            ? this._weekdaysMin[m.day()]
            : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i,
            ii,
            mom,
            llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse(weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdays(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._shortWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._minWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
            }
            if (!this._weekdaysParse[i]) {
                regex =
                    '^' +
                    this.weekdays(mom, '') +
                    '|^' +
                    this.weekdaysShort(mom, '') +
                    '|^' +
                    this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'dddd' &&
                this._fullWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'ddd' &&
                this._shortWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'dd' &&
                this._minWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    function weekdaysRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict
                ? this._weekdaysStrictRegex
                : this._weekdaysRegex;
        }
    }

    function weekdaysShortRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict
                ? this._weekdaysShortStrictRegex
                : this._weekdaysShortRegex;
        }
    }

    function weekdaysMinRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict
                ? this._weekdaysMinStrictRegex
                : this._weekdaysMinRegex;
        }
    }

    function computeWeekdaysParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [],
            shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom,
            minp,
            shortp,
            longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = regexEscape(this.weekdaysMin(mom, ''));
            shortp = regexEscape(this.weekdaysShort(mom, ''));
            longp = regexEscape(this.weekdays(mom, ''));
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._weekdaysShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
        this._weekdaysMinStrictRegex = new RegExp(
            '^(' + minPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return (
            '' +
            hFormat.apply(this) +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return (
            '' +
            this.hours() +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    function meridiem(token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(
                this.hours(),
                this.minutes(),
                lowercase
            );
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem(isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a', matchMeridiem);
    addRegexToken('A', matchMeridiem);
    addRegexToken('H', match1to2);
    addRegexToken('h', match1to2);
    addRegexToken('k', match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM(input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return (input + '').toLowerCase().charAt(0) === 'p';
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
        // Setting the hour should keep the time, because the user explicitly
        // specified which hour they want. So trying to maintain the same hour (in
        // a new timezone) makes sense. Adding/subtracting hours does not follow
        // this rule.
        getSetHour = makeGetSet('Hours', true);

    function localeMeridiem(hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse,
    };

    // internal storage for locale config files
    var locales = {},
        localeFamilies = {},
        globalLocale;

    function commonPrefix(arr1, arr2) {
        var i,
            minl = Math.min(arr1.length, arr2.length);
        for (i = 0; i < minl; i += 1) {
            if (arr1[i] !== arr2[i]) {
                return i;
            }
        }
        return minl;
    }

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0,
            j,
            next,
            locale,
            split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (
                    next &&
                    next.length >= j &&
                    commonPrefix(split, next) >= j - 1
                ) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function loadLocale(name) {
        var oldLocale = null,
            aliasedRequire;
        // TODO: Find a better way to register and load all the locales in Node
        if (
            locales[name] === undefined &&
            typeof module !== 'undefined' &&
            module &&
            module.exports
        ) {
            try {
                oldLocale = globalLocale._abbr;
                aliasedRequire = require;
                aliasedRequire('./locale/' + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {
                // mark as not found to avoid repeating expensive file require call causing high CPU
                // when trying to find en-US, en_US, en-us for every format call
                locales[name] = null; // null means not found
            }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale(key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            } else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            } else {
                if (typeof console !== 'undefined' && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn(
                        'Locale ' + key + ' not found. Did you forget to load it?'
                    );
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale(name, config) {
        if (config !== null) {
            var locale,
                parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple(
                    'defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.'
                );
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config,
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale,
                tmpLocale,
                parentConfig = baseConfig;

            if (locales[name] != null && locales[name].parentLocale != null) {
                // Update existing child locale in-place to avoid memory-leaks
                locales[name].set(mergeConfigs(locales[name]._config, config));
            } else {
                // MERGE
                tmpLocale = loadLocale(name);
                if (tmpLocale != null) {
                    parentConfig = tmpLocale._config;
                }
                config = mergeConfigs(parentConfig, config);
                if (tmpLocale == null) {
                    // updateLocale is called for creating a new locale
                    // Set abbr so it will have a name (getters return
                    // undefined otherwise).
                    config.abbr = name;
                }
                locale = new Locale(config);
                locale.parentLocale = locales[name];
                locales[name] = locale;
            }

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                    if (name === getSetGlobalLocale()) {
                        getSetGlobalLocale(name);
                    }
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale(key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow(m) {
        var overflow,
            a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH] < 0 || a[MONTH] > 11
                    ? MONTH
                    : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])
                    ? DATE
                    : a[HOUR] < 0 ||
                      a[HOUR] > 24 ||
                      (a[HOUR] === 24 &&
                          (a[MINUTE] !== 0 ||
                              a[SECOND] !== 0 ||
                              a[MILLISECOND] !== 0))
                    ? HOUR
                    : a[MINUTE] < 0 || a[MINUTE] > 59
                    ? MINUTE
                    : a[SECOND] < 0 || a[SECOND] > 59
                    ? SECOND
                    : a[MILLISECOND] < 0 || a[MILLISECOND] > 999
                    ? MILLISECOND
                    : -1;

            if (
                getParsingFlags(m)._overflowDayOfYear &&
                (overflow < YEAR || overflow > DATE)
            ) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
            ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
            ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
            ['YYYY-DDD', /\d{4}-\d{3}/],
            ['YYYY-MM', /\d{4}-\d\d/, false],
            ['YYYYYYMMDD', /[+-]\d{10}/],
            ['YYYYMMDD', /\d{8}/],
            ['GGGG[W]WWE', /\d{4}W\d{3}/],
            ['GGGG[W]WW', /\d{4}W\d{2}/, false],
            ['YYYYDDD', /\d{7}/],
            ['YYYYMM', /\d{6}/, false],
            ['YYYY', /\d{4}/, false],
        ],
        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
            ['HH:mm:ss', /\d\d:\d\d:\d\d/],
            ['HH:mm', /\d\d:\d\d/],
            ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
            ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
            ['HHmmss', /\d\d\d\d\d\d/],
            ['HHmm', /\d\d\d\d/],
            ['HH', /\d\d/],
        ],
        aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
        // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
        rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
        obsOffsets = {
            UT: 0,
            GMT: 0,
            EDT: -4 * 60,
            EST: -5 * 60,
            CDT: -5 * 60,
            CST: -6 * 60,
            MDT: -6 * 60,
            MST: -7 * 60,
            PDT: -7 * 60,
            PST: -8 * 60,
        };

    // date from iso format
    function configFromISO(config) {
        var i,
            l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime,
            dateFormat,
            timeFormat,
            tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    function extractFromRFC2822Strings(
        yearStr,
        monthStr,
        dayStr,
        hourStr,
        minuteStr,
        secondStr
    ) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10),
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces with a single space
        return s
            .replace(/\([^)]*\)|[\n\t]/g, ' ')
            .replace(/(\s\s+)/g, ' ')
            .replace(/^\s\s*/, '')
            .replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(
                    parsedInput[0],
                    parsedInput[1],
                    parsedInput[2]
                ).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10),
                m = hm % 100,
                h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i)),
            parsedArray;
        if (match) {
            parsedArray = extractFromRFC2822Strings(
                match[4],
                match[3],
                match[2],
                match[5],
                match[6],
                match[7]
            );
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);
        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        if (config._strict) {
            config._isValid = false;
        } else {
            // Final attempt, use Input Fallback
            hooks.createFromInputFallback(config);
        }
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
            'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
            'discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [
                nowValue.getUTCFullYear(),
                nowValue.getUTCMonth(),
                nowValue.getUTCDate(),
            ];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray(config) {
        var i,
            date,
            input = [],
            currentDate,
            expectedWeekday,
            yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (
                config._dayOfYear > daysInYear(yearToUse) ||
                config._dayOfYear === 0
            ) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] =
                config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (
            config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0
        ) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(
            null,
            input
        );
        expectedWeekday = config._useUTC
            ? config._d.getUTCDay()
            : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (
            config._w &&
            typeof config._w.d !== 'undefined' &&
            config._w.d !== expectedWeekday
        ) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(
                w.GG,
                config._a[YEAR],
                weekOfYear(createLocal(), 1, 4).year
            );
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from beginning of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to beginning of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i,
            parsedInput,
            tokens,
            token,
            skipped,
            stringLength = string.length,
            totalParsedInputLength = 0,
            era;

        tokens =
            expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) ||
                [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(
                    string.indexOf(parsedInput) + parsedInput.length
                );
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                } else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            } else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver =
            stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (
            config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0
        ) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(
            config._locale,
            config._a[HOUR],
            config._meridiem
        );

        // handle era
        era = getParsingFlags(config).era;
        if (era !== null) {
            config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
        }

        configFromArray(config);
        checkOverflow(config);
    }

    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,
            scoreToBeat,
            i,
            currentScore,
            validFormatFound,
            bestFormatIsValid = false;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            validFormatFound = false;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (isValid(tempConfig)) {
                validFormatFound = true;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (!bestFormatIsValid) {
                if (
                    scoreToBeat == null ||
                    currentScore < scoreToBeat ||
                    validFormatFound
                ) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                    if (validFormatFound) {
                        bestFormatIsValid = true;
                    }
                }
            } else {
                if (currentScore < scoreToBeat) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                }
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i),
            dayOrDate = i.day === undefined ? i.date : i.day;
        config._a = map(
            [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
            function (obj) {
                return obj && parseInt(obj, 10);
            }
        );

        configFromArray(config);
    }

    function createFromConfig(config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig(config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({ nullInput: true });
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC(input, format, locale, strict, isUTC) {
        var c = {};

        if (format === true || format === false) {
            strict = format;
            format = undefined;
        }

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if (
            (isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)
        ) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
            'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other < this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        ),
        prototypeMax = deprecate(
            'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other > this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +new Date();
    };

    var ordering = [
        'year',
        'quarter',
        'month',
        'week',
        'day',
        'hour',
        'minute',
        'second',
        'millisecond',
    ];

    function isDurationValid(m) {
        var key,
            unitHasDecimal = false,
            i;
        for (key in m) {
            if (
                hasOwnProp(m, key) &&
                !(
                    indexOf.call(ordering, key) !== -1 &&
                    (m[key] == null || !isNaN(m[key]))
                )
            ) {
                return false;
            }
        }

        for (i = 0; i < ordering.length; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds =
            +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days + weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months + quarters * 3 + years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration(obj) {
        return obj instanceof Duration;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if (
                (dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))
            ) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    // FORMATTING

    function offset(token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset(),
                sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return (
                sign +
                zeroFill(~~(offset / 60), 2) +
                separator +
                zeroFill(~~offset % 60, 2)
            );
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z', matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher),
            chunk,
            parts,
            minutes;

        if (matches === null) {
            return null;
        }

        chunk = matches[matches.length - 1] || [];
        parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff =
                (isMoment(input) || isDate(input)
                    ? input.valueOf()
                    : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset(m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset());
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset(input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(
                        this,
                        createDuration(input - offset, 'm'),
                        1,
                        false
                    );
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone(input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset() {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            } else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset(input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime() {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted() {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {},
            other;

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted =
                this.isValid() && compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal() {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset() {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        // and further modified to allow for strings containing both week and day
        isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration(input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months,
            };
        } else if (isNumber(input) || !isNaN(+input)) {
            duration = {};
            if (key) {
                duration[key] = +input;
            } else {
                duration.milliseconds = +input;
            }
        } else if ((match = aspNetRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign, // the millisecond decimal point is included in the match
            };
        } else if ((match = isoRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: parseIso(match[2], sign),
                M: parseIso(match[3], sign),
                w: parseIso(match[4], sign),
                d: parseIso(match[5], sign),
                h: parseIso(match[6], sign),
                m: parseIso(match[7], sign),
                s: parseIso(match[8], sign),
            };
        } else if (duration == null) {
            // checks for null or undefined
            duration = {};
        } else if (
            typeof duration === 'object' &&
            ('from' in duration || 'to' in duration)
        ) {
            diffRes = momentsDifference(
                createLocal(duration.from),
                createLocal(duration.to)
            );

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        if (isDuration(input) && hasOwnProp(input, '_isValid')) {
            ret._isValid = input._isValid;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso(inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {};

        res.months =
            other.month() - base.month() + (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +base.clone().add(res.months, 'M');

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return { milliseconds: 0, months: 0 };
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(
                    name,
                    'moment().' +
                        name +
                        '(period, number) is deprecated. Please use moment().' +
                        name +
                        '(number, period). ' +
                        'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.'
                );
                tmp = val;
                val = period;
                period = tmp;
            }

            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add = createAdder(1, 'add'),
        subtract = createAdder(-1, 'subtract');

    function isString(input) {
        return typeof input === 'string' || input instanceof String;
    }

    // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
    function isMomentInput(input) {
        return (
            isMoment(input) ||
            isDate(input) ||
            isString(input) ||
            isNumber(input) ||
            isNumberOrStringArray(input) ||
            isMomentInputObject(input) ||
            input === null ||
            input === undefined
        );
    }

    function isMomentInputObject(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'years',
                'year',
                'y',
                'months',
                'month',
                'M',
                'days',
                'day',
                'd',
                'dates',
                'date',
                'D',
                'hours',
                'hour',
                'h',
                'minutes',
                'minute',
                'm',
                'seconds',
                'second',
                's',
                'milliseconds',
                'millisecond',
                'ms',
            ],
            i,
            property;

        for (i = 0; i < properties.length; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function isNumberOrStringArray(input) {
        var arrayTest = isArray(input),
            dataTypeTest = false;
        if (arrayTest) {
            dataTypeTest =
                input.filter(function (item) {
                    return !isNumber(item) && isString(input);
                }).length === 0;
        }
        return arrayTest && dataTypeTest;
    }

    function isCalendarSpec(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'sameDay',
                'nextDay',
                'lastDay',
                'nextWeek',
                'lastWeek',
                'sameElse',
            ],
            i,
            property;

        for (i = 0; i < properties.length; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6
            ? 'sameElse'
            : diff < -1
            ? 'lastWeek'
            : diff < 0
            ? 'lastDay'
            : diff < 1
            ? 'sameDay'
            : diff < 2
            ? 'nextDay'
            : diff < 7
            ? 'nextWeek'
            : 'sameElse';
    }

    function calendar$1(time, formats) {
        // Support for single parameter, formats only overload to the calendar function
        if (arguments.length === 1) {
            if (!arguments[0]) {
                time = undefined;
                formats = undefined;
            } else if (isMomentInput(arguments[0])) {
                time = arguments[0];
                formats = undefined;
            } else if (isCalendarSpec(arguments[0])) {
                formats = arguments[0];
                time = undefined;
            }
        }
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse',
            output =
                formats &&
                (isFunction(formats[format])
                    ? formats[format].call(this, now)
                    : formats[format]);

        return this.format(
            output || this.localeData().calendar(format, this, createLocal(now))
        );
    }

    function clone() {
        return new Moment(this);
    }

    function isAfter(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween(from, to, units, inclusivity) {
        var localFrom = isMoment(from) ? from : createLocal(from),
            localTo = isMoment(to) ? to : createLocal(to);
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
            return false;
        }
        inclusivity = inclusivity || '()';
        return (
            (inclusivity[0] === '('
                ? this.isAfter(localFrom, units)
                : !this.isBefore(localFrom, units)) &&
            (inclusivity[1] === ')'
                ? this.isBefore(localTo, units)
                : !this.isAfter(localTo, units))
        );
    }

    function isSame(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return (
                this.clone().startOf(units).valueOf() <= inputMs &&
                inputMs <= this.clone().endOf(units).valueOf()
            );
        }
    }

    function isSameOrAfter(input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }

    function isSameOrBefore(input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }

    function diff(input, units, asFloat) {
        var that, zoneDelta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year':
                output = monthDiff(this, that) / 12;
                break;
            case 'month':
                output = monthDiff(this, that);
                break;
            case 'quarter':
                output = monthDiff(this, that) / 3;
                break;
            case 'second':
                output = (this - that) / 1e3;
                break; // 1000
            case 'minute':
                output = (this - that) / 6e4;
                break; // 1000 * 60
            case 'hour':
                output = (this - that) / 36e5;
                break; // 1000 * 60 * 60
            case 'day':
                output = (this - that - zoneDelta) / 864e5;
                break; // 1000 * 60 * 60 * 24, negate dst
            case 'week':
                output = (this - that - zoneDelta) / 6048e5;
                break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default:
                output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff(a, b) {
        if (a.date() < b.date()) {
            // end-of-month calculations work correct when the start month has more
            // days than the end month.
            return -monthDiff(b, a);
        }
        // difference in months
        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2,
            adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString() {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true,
            m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(
                m,
                utc
                    ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
                    : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ'
            );
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)
                    .toISOString()
                    .replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(
            m,
            utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'
        );
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect() {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment',
            zone = '',
            prefix,
            year,
            datetime,
            suffix;
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        prefix = '[' + func + '("]';
        year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
        datetime = '-MM-DD[T]HH:mm:ss.SSS';
        suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format(inputString) {
        if (!inputString) {
            inputString = this.isUtc()
                ? hooks.defaultFormatUtc
                : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ to: this, from: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow(withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ from: this, to: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow(withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale(key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData() {
        return this._locale;
    }

    var MS_PER_SECOND = 1000,
        MS_PER_MINUTE = 60 * MS_PER_SECOND,
        MS_PER_HOUR = 60 * MS_PER_MINUTE,
        MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

    // actual modulo - handles negative numbers (for dates before 1970):
    function mod$1(dividend, divisor) {
        return ((dividend % divisor) + divisor) % divisor;
    }

    function localStartOfDate(y, m, d) {
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return new Date(y, m, d).valueOf();
        }
    }

    function utcStartOfDate(y, m, d) {
        // Date.UTC remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return Date.UTC(y, m, d);
        }
    }

    function startOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year(), 0, 1);
                break;
            case 'quarter':
                time = startOfDate(
                    this.year(),
                    this.month() - (this.month() % 3),
                    1
                );
                break;
            case 'month':
                time = startOfDate(this.year(), this.month(), 1);
                break;
            case 'week':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - this.weekday()
                );
                break;
            case 'isoWeek':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - (this.isoWeekday() - 1)
                );
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date());
                break;
            case 'hour':
                time = this._d.valueOf();
                time -= mod$1(
                    time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                    MS_PER_HOUR
                );
                break;
            case 'minute':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_MINUTE);
                break;
            case 'second':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_SECOND);
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function endOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year() + 1, 0, 1) - 1;
                break;
            case 'quarter':
                time =
                    startOfDate(
                        this.year(),
                        this.month() - (this.month() % 3) + 3,
                        1
                    ) - 1;
                break;
            case 'month':
                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                break;
            case 'week':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - this.weekday() + 7
                    ) - 1;
                break;
            case 'isoWeek':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - (this.isoWeekday() - 1) + 7
                    ) - 1;
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case 'hour':
                time = this._d.valueOf();
                time +=
                    MS_PER_HOUR -
                    mod$1(
                        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                        MS_PER_HOUR
                    ) -
                    1;
                break;
            case 'minute':
                time = this._d.valueOf();
                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                break;
            case 'second':
                time = this._d.valueOf();
                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function valueOf() {
        return this._d.valueOf() - (this._offset || 0) * 60000;
    }

    function unix() {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate() {
        return new Date(this.valueOf());
    }

    function toArray() {
        var m = this;
        return [
            m.year(),
            m.month(),
            m.date(),
            m.hour(),
            m.minute(),
            m.second(),
            m.millisecond(),
        ];
    }

    function toObject() {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds(),
        };
    }

    function toJSON() {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2() {
        return isValid(this);
    }

    function parsingFlags() {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt() {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict,
        };
    }

    addFormatToken('N', 0, 0, 'eraAbbr');
    addFormatToken('NN', 0, 0, 'eraAbbr');
    addFormatToken('NNN', 0, 0, 'eraAbbr');
    addFormatToken('NNNN', 0, 0, 'eraName');
    addFormatToken('NNNNN', 0, 0, 'eraNarrow');

    addFormatToken('y', ['y', 1], 'yo', 'eraYear');
    addFormatToken('y', ['yy', 2], 0, 'eraYear');
    addFormatToken('y', ['yyy', 3], 0, 'eraYear');
    addFormatToken('y', ['yyyy', 4], 0, 'eraYear');

    addRegexToken('N', matchEraAbbr);
    addRegexToken('NN', matchEraAbbr);
    addRegexToken('NNN', matchEraAbbr);
    addRegexToken('NNNN', matchEraName);
    addRegexToken('NNNNN', matchEraNarrow);

    addParseToken(['N', 'NN', 'NNN', 'NNNN', 'NNNNN'], function (
        input,
        array,
        config,
        token
    ) {
        var era = config._locale.erasParse(input, token, config._strict);
        if (era) {
            getParsingFlags(config).era = era;
        } else {
            getParsingFlags(config).invalidEra = input;
        }
    });

    addRegexToken('y', matchUnsigned);
    addRegexToken('yy', matchUnsigned);
    addRegexToken('yyy', matchUnsigned);
    addRegexToken('yyyy', matchUnsigned);
    addRegexToken('yo', matchEraYearOrdinal);

    addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
    addParseToken(['yo'], function (input, array, config, token) {
        var match;
        if (config._locale._eraYearOrdinalRegex) {
            match = input.match(config._locale._eraYearOrdinalRegex);
        }

        if (config._locale.eraYearOrdinalParse) {
            array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
        } else {
            array[YEAR] = parseInt(input, 10);
        }
    });

    function localeEras(m, format) {
        var i,
            l,
            date,
            eras = this._eras || getLocale('en')._eras;
        for (i = 0, l = eras.length; i < l; ++i) {
            switch (typeof eras[i].since) {
                case 'string':
                    // truncate time
                    date = hooks(eras[i].since).startOf('day');
                    eras[i].since = date.valueOf();
                    break;
            }

            switch (typeof eras[i].until) {
                case 'undefined':
                    eras[i].until = +Infinity;
                    break;
                case 'string':
                    // truncate time
                    date = hooks(eras[i].until).startOf('day').valueOf();
                    eras[i].until = date.valueOf();
                    break;
            }
        }
        return eras;
    }

    function localeErasParse(eraName, format, strict) {
        var i,
            l,
            eras = this.eras(),
            name,
            abbr,
            narrow;
        eraName = eraName.toUpperCase();

        for (i = 0, l = eras.length; i < l; ++i) {
            name = eras[i].name.toUpperCase();
            abbr = eras[i].abbr.toUpperCase();
            narrow = eras[i].narrow.toUpperCase();

            if (strict) {
                switch (format) {
                    case 'N':
                    case 'NN':
                    case 'NNN':
                        if (abbr === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNN':
                        if (name === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNNN':
                        if (narrow === eraName) {
                            return eras[i];
                        }
                        break;
                }
            } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
                return eras[i];
            }
        }
    }

    function localeErasConvertYear(era, year) {
        var dir = era.since <= era.until ? +1 : -1;
        if (year === undefined) {
            return hooks(era.since).year();
        } else {
            return hooks(era.since).year() + (year - era.offset) * dir;
        }
    }

    function getEraName() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].name;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].name;
            }
        }

        return '';
    }

    function getEraNarrow() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].narrow;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].narrow;
            }
        }

        return '';
    }

    function getEraAbbr() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].abbr;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].abbr;
            }
        }

        return '';
    }

    function getEraYear() {
        var i,
            l,
            dir,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            dir = eras[i].since <= eras[i].until ? +1 : -1;

            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (
                (eras[i].since <= val && val <= eras[i].until) ||
                (eras[i].until <= val && val <= eras[i].since)
            ) {
                return (
                    (this.year() - hooks(eras[i].since).year()) * dir +
                    eras[i].offset
                );
            }
        }

        return this.year();
    }

    function erasNameRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNameRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNameRegex : this._erasRegex;
    }

    function erasAbbrRegex(isStrict) {
        if (!hasOwnProp(this, '_erasAbbrRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasAbbrRegex : this._erasRegex;
    }

    function erasNarrowRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNarrowRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNarrowRegex : this._erasRegex;
    }

    function matchEraAbbr(isStrict, locale) {
        return locale.erasAbbrRegex(isStrict);
    }

    function matchEraName(isStrict, locale) {
        return locale.erasNameRegex(isStrict);
    }

    function matchEraNarrow(isStrict, locale) {
        return locale.erasNarrowRegex(isStrict);
    }

    function matchEraYearOrdinal(isStrict, locale) {
        return locale._eraYearOrdinalRegex || matchUnsigned;
    }

    function computeErasParse() {
        var abbrPieces = [],
            namePieces = [],
            narrowPieces = [],
            mixedPieces = [],
            i,
            l,
            eras = this.eras();

        for (i = 0, l = eras.length; i < l; ++i) {
            namePieces.push(regexEscape(eras[i].name));
            abbrPieces.push(regexEscape(eras[i].abbr));
            narrowPieces.push(regexEscape(eras[i].narrow));

            mixedPieces.push(regexEscape(eras[i].name));
            mixedPieces.push(regexEscape(eras[i].abbr));
            mixedPieces.push(regexEscape(eras[i].narrow));
        }

        this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
        this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
        this._erasNarrowRegex = new RegExp(
            '^(' + narrowPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken(token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg', 'weekYear');
    addWeekYearFormatToken('ggggg', 'weekYear');
    addWeekYearFormatToken('GGGG', 'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);

    // PARSING

    addRegexToken('G', matchSigned);
    addRegexToken('g', matchSigned);
    addRegexToken('GG', match1to2, match2);
    addRegexToken('gg', match1to2, match2);
    addRegexToken('GGGG', match1to4, match4);
    addRegexToken('gggg', match1to4, match4);
    addRegexToken('GGGGG', match1to6, match6);
    addRegexToken('ggggg', match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (
        input,
        week,
        config,
        token
    ) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy
        );
    }

    function getSetISOWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.isoWeek(),
            this.isoWeekday(),
            1,
            4
        );
    }

    function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
    }

    function getISOWeeksInISOWeekYear() {
        return weeksInYear(this.isoWeekYear(), 1, 4);
    }

    function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getWeeksInWeekYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter(input) {
        return input == null
            ? Math.ceil((this.month() + 1) / 3)
            : this.month((input - 1) * 3 + (this.month() % 3));
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIORITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D', match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict
            ? locale._dayOfMonthOrdinalParse || locale._ordinalParse
            : locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD', match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear(input) {
        var dayOfYear =
            Math.round(
                (this.clone().startOf('day') - this.clone().startOf('year')) / 864e5
            ) + 1;
        return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m', match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s', match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });

    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S', match1to3, match1);
    addRegexToken('SS', match1to3, match2);
    addRegexToken('SSS', match1to3, match3);

    var token, getSetMillisecond;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }

    getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z', 0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr() {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName() {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add = add;
    proto.calendar = calendar$1;
    proto.clone = clone;
    proto.diff = diff;
    proto.endOf = endOf;
    proto.format = format;
    proto.from = from;
    proto.fromNow = fromNow;
    proto.to = to;
    proto.toNow = toNow;
    proto.get = stringGet;
    proto.invalidAt = invalidAt;
    proto.isAfter = isAfter;
    proto.isBefore = isBefore;
    proto.isBetween = isBetween;
    proto.isSame = isSame;
    proto.isSameOrAfter = isSameOrAfter;
    proto.isSameOrBefore = isSameOrBefore;
    proto.isValid = isValid$2;
    proto.lang = lang;
    proto.locale = locale;
    proto.localeData = localeData;
    proto.max = prototypeMax;
    proto.min = prototypeMin;
    proto.parsingFlags = parsingFlags;
    proto.set = stringSet;
    proto.startOf = startOf;
    proto.subtract = subtract;
    proto.toArray = toArray;
    proto.toObject = toObject;
    proto.toDate = toDate;
    proto.toISOString = toISOString;
    proto.inspect = inspect;
    if (typeof Symbol !== 'undefined' && Symbol.for != null) {
        proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
            return 'Moment<' + this.format() + '>';
        };
    }
    proto.toJSON = toJSON;
    proto.toString = toString;
    proto.unix = unix;
    proto.valueOf = valueOf;
    proto.creationData = creationData;
    proto.eraName = getEraName;
    proto.eraNarrow = getEraNarrow;
    proto.eraAbbr = getEraAbbr;
    proto.eraYear = getEraYear;
    proto.year = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week = proto.weeks = getSetWeek;
    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
    proto.weeksInYear = getWeeksInYear;
    proto.weeksInWeekYear = getWeeksInWeekYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
    proto.date = getSetDayOfMonth;
    proto.day = proto.days = getSetDayOfWeek;
    proto.weekday = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset = getSetOffset;
    proto.utc = setOffsetToUTC;
    proto.local = setOffsetToLocal;
    proto.parseZone = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST = isDaylightSavingTime;
    proto.isLocal = isLocal;
    proto.isUtcOffset = isUtcOffset;
    proto.isUtc = isUtc;
    proto.isUTC = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates = deprecate(
        'dates accessor is deprecated. Use date instead.',
        getSetDayOfMonth
    );
    proto.months = deprecate(
        'months accessor is deprecated. Use month instead',
        getSetMonth
    );
    proto.years = deprecate(
        'years accessor is deprecated. Use year instead',
        getSetYear
    );
    proto.zone = deprecate(
        'moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',
        getSetZone
    );
    proto.isDSTShifted = deprecate(
        'isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
        isDaylightSavingTimeShifted
    );

    function createUnix(input) {
        return createLocal(input * 1000);
    }

    function createInZone() {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat(string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar = calendar;
    proto$1.longDateFormat = longDateFormat;
    proto$1.invalidDate = invalidDate;
    proto$1.ordinal = ordinal;
    proto$1.preparse = preParsePostFormat;
    proto$1.postformat = preParsePostFormat;
    proto$1.relativeTime = relativeTime;
    proto$1.pastFuture = pastFuture;
    proto$1.set = set;
    proto$1.eras = localeEras;
    proto$1.erasParse = localeErasParse;
    proto$1.erasConvertYear = localeErasConvertYear;
    proto$1.erasAbbrRegex = erasAbbrRegex;
    proto$1.erasNameRegex = erasNameRegex;
    proto$1.erasNarrowRegex = erasNarrowRegex;

    proto$1.months = localeMonths;
    proto$1.monthsShort = localeMonthsShort;
    proto$1.monthsParse = localeMonthsParse;
    proto$1.monthsRegex = monthsRegex;
    proto$1.monthsShortRegex = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays = localeWeekdays;
    proto$1.weekdaysMin = localeWeekdaysMin;
    proto$1.weekdaysShort = localeWeekdaysShort;
    proto$1.weekdaysParse = localeWeekdaysParse;

    proto$1.weekdaysRegex = weekdaysRegex;
    proto$1.weekdaysShortRegex = weekdaysShortRegex;
    proto$1.weekdaysMinRegex = weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1(format, index, field, setter) {
        var locale = getLocale(),
            utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl(format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i,
            out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl(localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0,
            i,
            out = [];

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths(format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort(format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        eras: [
            {
                since: '0001-01-01',
                until: +Infinity,
                offset: 1,
                name: 'Anno Domini',
                narrow: 'AD',
                abbr: 'AD',
            },
            {
                since: '0000-12-31',
                until: -Infinity,
                offset: 1,
                name: 'Before Christ',
                narrow: 'BC',
                abbr: 'BC',
            },
        ],
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function (number) {
            var b = number % 10,
                output =
                    toInt((number % 100) / 10) === 1
                        ? 'th'
                        : b === 1
                        ? 'st'
                        : b === 2
                        ? 'nd'
                        : b === 3
                        ? 'rd'
                        : 'th';
            return number + output;
        },
    });

    // Side effect imports

    hooks.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        getSetGlobalLocale
    );
    hooks.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        getLocale
    );

    var mathAbs = Math.abs;

    function abs() {
        var data = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);

        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);

        return this;
    }

    function addSubtract$1(duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1(input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1(input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil(number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble() {
        var milliseconds = this._milliseconds,
            days = this._days,
            months = this._months,
            data = this._data,
            seconds,
            minutes,
            hours,
            years,
            monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (
            !(
                (milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0)
            )
        ) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds = absFloor(milliseconds / 1000);
        data.seconds = seconds % 60;

        minutes = absFloor(seconds / 60);
        data.minutes = minutes % 60;

        hours = absFloor(minutes / 60);
        data.hours = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days = days;
        data.months = months;
        data.years = years;

        return this;
    }

    function daysToMonths(days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return (days * 4800) / 146097;
    }

    function monthsToDays(months) {
        // the reverse of daysToMonths
        return (months * 146097) / 4800;
    }

    function as(units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days,
            months,
            milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'quarter' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            switch (units) {
                case 'month':
                    return months;
                case 'quarter':
                    return months / 3;
                case 'year':
                    return months / 12;
            }
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week':
                    return days / 7 + milliseconds / 6048e5;
                case 'day':
                    return days + milliseconds / 864e5;
                case 'hour':
                    return days * 24 + milliseconds / 36e5;
                case 'minute':
                    return days * 1440 + milliseconds / 6e4;
                case 'second':
                    return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond':
                    return Math.floor(days * 864e5) + milliseconds;
                default:
                    throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1() {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs(alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms'),
        asSeconds = makeAs('s'),
        asMinutes = makeAs('m'),
        asHours = makeAs('h'),
        asDays = makeAs('d'),
        asWeeks = makeAs('w'),
        asMonths = makeAs('M'),
        asQuarters = makeAs('Q'),
        asYears = makeAs('y');

    function clone$1() {
        return createDuration(this);
    }

    function get$2(units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds'),
        seconds = makeGetter('seconds'),
        minutes = makeGetter('minutes'),
        hours = makeGetter('hours'),
        days = makeGetter('days'),
        months = makeGetter('months'),
        years = makeGetter('years');

    function weeks() {
        return absFloor(this.days() / 7);
    }

    var round = Math.round,
        thresholds = {
            ss: 44, // a few seconds to seconds
            s: 45, // seconds to minute
            m: 45, // minutes to hour
            h: 22, // hours to day
            d: 26, // days to month/week
            w: null, // weeks to month
            M: 11, // months to year
        };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
        var duration = createDuration(posNegDuration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('M')),
            weeks = round(duration.as('w')),
            years = round(duration.as('y')),
            a =
                (seconds <= thresholds.ss && ['s', seconds]) ||
                (seconds < thresholds.s && ['ss', seconds]) ||
                (minutes <= 1 && ['m']) ||
                (minutes < thresholds.m && ['mm', minutes]) ||
                (hours <= 1 && ['h']) ||
                (hours < thresholds.h && ['hh', hours]) ||
                (days <= 1 && ['d']) ||
                (days < thresholds.d && ['dd', days]);

        if (thresholds.w != null) {
            a =
                a ||
                (weeks <= 1 && ['w']) ||
                (weeks < thresholds.w && ['ww', weeks]);
        }
        a = a ||
            (months <= 1 && ['M']) ||
            (months < thresholds.M && ['MM', months]) ||
            (years <= 1 && ['y']) || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding(roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof roundingFunction === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold(threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize(argWithSuffix, argThresholds) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var withSuffix = false,
            th = thresholds,
            locale,
            output;

        if (typeof argWithSuffix === 'object') {
            argThresholds = argWithSuffix;
            argWithSuffix = false;
        }
        if (typeof argWithSuffix === 'boolean') {
            withSuffix = argWithSuffix;
        }
        if (typeof argThresholds === 'object') {
            th = Object.assign({}, thresholds, argThresholds);
            if (argThresholds.s != null && argThresholds.ss == null) {
                th.ss = argThresholds.s - 1;
            }
        }

        locale = this.localeData();
        output = relativeTime$1(this, !withSuffix, th, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return (x > 0) - (x < 0) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000,
            days = abs$1(this._days),
            months = abs$1(this._months),
            minutes,
            hours,
            years,
            s,
            total = this.asSeconds(),
            totalSign,
            ymSign,
            daysSign,
            hmsSign;

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes = absFloor(seconds / 60);
        hours = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';

        totalSign = total < 0 ? '-' : '';
        ymSign = sign(this._months) !== sign(total) ? '-' : '';
        daysSign = sign(this._days) !== sign(total) ? '-' : '';
        hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return (
            totalSign +
            'P' +
            (years ? ymSign + years + 'Y' : '') +
            (months ? ymSign + months + 'M' : '') +
            (days ? daysSign + days + 'D' : '') +
            (hours || minutes || seconds ? 'T' : '') +
            (hours ? hmsSign + hours + 'H' : '') +
            (minutes ? hmsSign + minutes + 'M' : '') +
            (seconds ? hmsSign + s + 'S' : '')
        );
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid = isValid$1;
    proto$2.abs = abs;
    proto$2.add = add$1;
    proto$2.subtract = subtract$1;
    proto$2.as = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds = asSeconds;
    proto$2.asMinutes = asMinutes;
    proto$2.asHours = asHours;
    proto$2.asDays = asDays;
    proto$2.asWeeks = asWeeks;
    proto$2.asMonths = asMonths;
    proto$2.asQuarters = asQuarters;
    proto$2.asYears = asYears;
    proto$2.valueOf = valueOf$1;
    proto$2._bubble = bubble;
    proto$2.clone = clone$1;
    proto$2.get = get$2;
    proto$2.milliseconds = milliseconds;
    proto$2.seconds = seconds;
    proto$2.minutes = minutes;
    proto$2.hours = hours;
    proto$2.days = days;
    proto$2.weeks = weeks;
    proto$2.months = months;
    proto$2.years = years;
    proto$2.humanize = humanize;
    proto$2.toISOString = toISOString$1;
    proto$2.toString = toISOString$1;
    proto$2.toJSON = toISOString$1;
    proto$2.locale = locale;
    proto$2.localeData = localeData;

    proto$2.toIsoString = deprecate(
        'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
        toISOString$1
    );
    proto$2.lang = lang;

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    //! moment.js

    hooks.version = '2.29.1';

    setHookCallback(createLocal);

    hooks.fn = proto;
    hooks.min = min;
    hooks.max = max;
    hooks.now = now;
    hooks.utc = createUTC;
    hooks.unix = createUnix;
    hooks.months = listMonths;
    hooks.isDate = isDate;
    hooks.locale = getSetGlobalLocale;
    hooks.invalid = createInvalid;
    hooks.duration = createDuration;
    hooks.isMoment = isMoment;
    hooks.weekdays = listWeekdays;
    hooks.parseZone = createInZone;
    hooks.localeData = getLocale;
    hooks.isDuration = isDuration;
    hooks.monthsShort = listMonthsShort;
    hooks.weekdaysMin = listWeekdaysMin;
    hooks.defineLocale = defineLocale;
    hooks.updateLocale = updateLocale;
    hooks.locales = listLocales;
    hooks.weekdaysShort = listWeekdaysShort;
    hooks.normalizeUnits = normalizeUnits;
    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat = getCalendarFormat;
    hooks.prototype = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
        DATE: 'YYYY-MM-DD', // <input type="date" />
        TIME: 'HH:mm', // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
        WEEK: 'GGGG-[W]WW', // <input type="week" />
        MONTH: 'YYYY-MM', // <input type="month" />
    };

    return hooks;

})));

},{}],47:[function(require,module,exports){
const CumulativeVolume = require('../../../lib/marketState/CumulativeVolume');

describe('When a cumulative volume container is created with a tick increment of 0.25', () => {
  'use strict';

  var cv;
  var symbol;
  var tickIncrement;
  beforeEach(() => {
    cv = new CumulativeVolume(symbol = 'ESZ6', tickIncrement = 0.25);
  });
  it('the symbol should be the same value as assigned during construction', () => {
    expect(cv.symbol).toEqual(symbol);
  });
  it('the price level array should contain zero items', () => {
    expect(cv.toArray().length).toEqual(0);
  });
  describe('and 50 contracts are traded at 2172.50', () => {
    beforeEach(() => {
      cv.incrementVolume(2172.5, 50);
    });
    it('should report zero contracts traded at 2172.25', () => {
      expect(cv.getVolume(2172.25)).toEqual(0);
    });
    it('should report 50 contracts traded at 2172.50', () => {
      expect(cv.getVolume(2172.5)).toEqual(50);
    });
    it('should report zero contracts traded at 2172.75', () => {
      expect(cv.getVolume(2172.75)).toEqual(0);
    });
    describe('and the price level array is retrieved', () => {
      var priceLevels;
      beforeEach(() => {
        priceLevels = cv.toArray();
      });
      it('the price level array should contain one item', () => {
        expect(priceLevels.length).toEqual(1);
      });
      it('the first price level item should be for 50 contracts', () => {
        expect(priceLevels[0].volume).toEqual(50);
      });
      it('the first price level item should be priced at 2172.50', () => {
        expect(priceLevels[0].price).toEqual(2172.5);
      });
    });
    describe('and another 50 contracts are traded at 2172.50', () => {
      beforeEach(() => {
        cv.incrementVolume(2172.5, 50);
      });
      it('should report zero contracts traded at 2172.25', () => {
        expect(cv.getVolume(2172.25)).toEqual(0);
      });
      it('should report 50 contracts traded at 2172.50', () => {
        expect(cv.getVolume(2172.5)).toEqual(100);
      });
      it('should report zero contracts traded at 2172.75', () => {
        expect(cv.getVolume(2172.75)).toEqual(0);
      });
      describe('and the price level array is retrieved', () => {
        var priceLevels;
        beforeEach(() => {
          priceLevels = cv.toArray();
        });
        it('the price level array should contain one item', () => {
          expect(priceLevels.length).toEqual(1);
        });
        it('the first price level item should be for 100 contracts', () => {
          expect(priceLevels[0].volume).toEqual(100);
        });
        it('the first price level item should be priced at 2172.50', () => {
          expect(priceLevels[0].price).toEqual(2172.5);
        });
      });
    });
    describe('and 200 contracts are traded at 2172.25', () => {
      beforeEach(() => {
        cv.incrementVolume(2172.25, 200);
      });
      it('should report 200 contracts traded at 2172.25', () => {
        expect(cv.getVolume(2172.25)).toEqual(200);
      });
      it('should report 50 contracts traded at 2172.50', () => {
        expect(cv.getVolume(2172.5)).toEqual(50);
      });
      it('should report zero contracts traded at 2172.75', () => {
        expect(cv.getVolume(2172.75)).toEqual(0);
      });
      describe('and the price level array is retrieved', () => {
        var priceLevels;
        beforeEach(() => {
          priceLevels = cv.toArray();
        });
        it('the price level array should contain two items', () => {
          expect(priceLevels.length).toEqual(2);
        });
        it('the first price level item should be for 200 contracts', () => {
          expect(priceLevels[0].volume).toEqual(200);
        });
        it('the first price level item should be priced at 2172.25', () => {
          expect(priceLevels[0].price).toEqual(2172.25);
        });
        it('the second price level item should be for 50 contracts', () => {
          expect(priceLevels[1].volume).toEqual(50);
        });
        it('the second price level item should be priced at 2172.50', () => {
          expect(priceLevels[1].price).toEqual(2172.5);
        });
      });
    });
    describe('and 3 contracts are traded at 2173.50', () => {
      beforeEach(() => {
        cv.incrementVolume(2173.50, 3);
      });
      it('should report 50 contracts traded at 2172.50', () => {
        expect(cv.getVolume(2172.5)).toEqual(50);
      });
      it('should report zero contracts traded at 2172.75', () => {
        expect(cv.getVolume(2172.75)).toEqual(0);
      });
      it('should report zero contracts traded at 2173', () => {
        expect(cv.getVolume(2173)).toEqual(0);
      });
      it('should report zero contracts traded at 2173.25', () => {
        expect(cv.getVolume(2173.25)).toEqual(0);
      });
      it('should report 3 contracts traded at 2173.50', () => {
        expect(cv.getVolume(2173.50)).toEqual(3);
      });
      describe('and the price level array is retrieved', () => {
        var priceLevels;
        beforeEach(() => {
          priceLevels = cv.toArray();
        });
        it('the price level array should contain five items', () => {
          expect(priceLevels.length).toEqual(5);
        });
        it('the first price level item should be for 50 contracts', () => {
          expect(priceLevels[0].volume).toEqual(50);
        });
        it('the first price level item should be priced at 2172.50', () => {
          expect(priceLevels[0].price).toEqual(2172.5);
        });
        it('the second price level item should be for zero contracts', () => {
          expect(priceLevels[1].volume).toEqual(0);
        });
        it('the second price level item should be priced at 2172.75', () => {
          expect(priceLevels[1].price).toEqual(2172.75);
        });
        it('the third price level item should be for zero contracts', () => {
          expect(priceLevels[2].volume).toEqual(0);
        });
        it('the third price level item should be priced at 2173.00', () => {
          expect(priceLevels[2].price).toEqual(2173);
        });
        it('the fourth price level item should be for zero contracts', () => {
          expect(priceLevels[3].volume).toEqual(0);
        });
        it('the fourth price level item should be priced at 2173.25', () => {
          expect(priceLevels[3].price).toEqual(2173.25);
        });
        it('the fifth price level item should be for 3 contracts', () => {
          expect(priceLevels[4].volume).toEqual(3);
        });
        it('the fifth price level item should be priced at 2173.50', () => {
          expect(priceLevels[4].price).toEqual(2173.5);
        });
      });
    });
    describe('and 99 contracts are traded at 2172.00', () => {
      beforeEach(() => {
        cv.incrementVolume(2172.00, 99);
      });
      it('should report 99 contracts traded at 2172.00', () => {
        expect(cv.getVolume(2172.00)).toEqual(99);
      });
      it('should report zero contracts traded at 2172.25', () => {
        expect(cv.getVolume(2172.25)).toEqual(0);
      });
      it('should report 50 contracts traded at 2172.50', () => {
        expect(cv.getVolume(2172.50)).toEqual(50);
      });
      describe('and the price level array is retrieved', () => {
        var priceLevels;
        beforeEach(() => {
          priceLevels = cv.toArray();
        });
        it('the price level array should contain three items', () => {
          expect(priceLevels.length).toEqual(3);
        });
        it('the first price level item should be for 99 contracts', () => {
          expect(priceLevels[0].volume).toEqual(99);
        });
        it('the first price level item should be priced at 2172.00', () => {
          expect(priceLevels[0].price).toEqual(2172);
        });
        it('the second price level item should be for zero contracts', () => {
          expect(priceLevels[1].volume).toEqual(0);
        });
        it('the second price level item should be priced at 2172.25', () => {
          expect(priceLevels[1].price).toEqual(2172.25);
        });
        it('the third price level item should be for 50 contracts', () => {
          expect(priceLevels[2].volume).toEqual(50);
        });
        it('the third price level item should be priced at 2172.50', () => {
          expect(priceLevels[2].price).toEqual(2172.50);
        });
      });
    });
    describe('and the container is reset', () => {
      beforeEach(() => {
        cv.reset();
      });
      describe('and the price level array is retrieved', () => {
        var priceLevels;
        beforeEach(() => {
          priceLevels = cv.toArray();
        });
        it('the price level array should contain zero items', () => {
          expect(priceLevels.length).toEqual(0);
        });
      });
    });
  });
  describe('and an observer is added to the container', () => {
    var spyOne;
    beforeEach(() => {
      cv.on('events', spyOne = jasmine.createSpy('spyOne'));
    });
    describe('and 50 contracts are traded at 2172.50', () => {
      beforeEach(function () {
        cv.incrementVolume(2172.5, 50);
      });
      it('the observer should be called once', () => {
        expect(spyOne).toHaveBeenCalledTimes(1);
      });
      it('the arguments should refer to the container', () => {
        expect(spyOne.calls.mostRecent().args[0].container).toBe(cv);
      });
      it('the arguments should specify an event type of "update"', () => {
        expect(spyOne.calls.mostRecent().args[0].event).toEqual('update');
      });
      it('the arguments should specify a price of 2172.5', () => {
        expect(spyOne.calls.mostRecent().args[0].price).toEqual(2172.5);
      });
      it('the arguments should specify a volume of 50', () => {
        expect(spyOne.calls.mostRecent().args[0].volume).toEqual(50);
      });
      describe('and another 50 contracts are traded at 2172.50', () => {
        beforeEach(function () {
          cv.incrementVolume(2172.5, 50);
        });
        it('the observer should be called once more', () => {
          expect(spyOne).toHaveBeenCalledTimes(2);
        });
        it('the arguments should refer to the container', () => {
          expect(spyOne.calls.mostRecent().args[0].container).toBe(cv);
        });
        it('the arguments should specify an event type of "update"', () => {
          expect(spyOne.calls.mostRecent().args[0].event).toEqual('update');
        });
        it('the arguments should specify a price of 2172.5', () => {
          expect(spyOne.calls.mostRecent().args[0].price).toEqual(2172.5);
        });
        it('the arguments should specify a volume of 100', () => {
          expect(spyOne.calls.mostRecent().args[0].volume).toEqual(100);
        });
      });
      describe('and 99 contracts are traded at 2171.75', () => {
        var spyTwo;
        beforeEach(function () {
          cv.incrementVolume(2171.75, 99);
        });
        it('the observer should be called three more times', () => {
          expect(spyOne).toHaveBeenCalledTimes(4);
        });
        it('the arguments (for the first call) should specify a price of 2172.25', () => {
          expect(spyOne.calls.argsFor(1)[0].price).toEqual(2172.25);
        });
        it('the arguments (for the first call) should specify a volume of zero', () => {
          expect(spyOne.calls.argsFor(1)[0].volume).toEqual(0);
        });
        it('the arguments (for the second call) should specify a price of 2172.00', () => {
          expect(spyOne.calls.argsFor(2)[0].price).toEqual(2172);
        });
        it('the arguments (for the second call) should specify a volume of zero', () => {
          expect(spyOne.calls.argsFor(2)[0].volume).toEqual(0);
        });
        it('the arguments (for the third call) should specify a price of 2171.75', () => {
          expect(spyOne.calls.argsFor(3)[0].price).toEqual(2171.75);
        });
        it('the arguments (for the third call) should specify a volume of 99', () => {
          expect(spyOne.calls.argsFor(3)[0].volume).toEqual(99);
        });
      });
      describe('and 555 contracts are traded at 2173.25', () => {
        beforeEach(function () {
          cv.incrementVolume(2173.25, 555);
        });
        it('the observer should be called three more times', () => {
          expect(spyOne).toHaveBeenCalledTimes(4);
        });
        it('the arguments (for the first call) should specify a price of 2172.75', () => {
          expect(spyOne.calls.argsFor(1)[0].price).toEqual(2172.75);
        });
        it('the arguments (for the first call) should specify a volume of zero', () => {
          expect(spyOne.calls.argsFor(1)[0].volume).toEqual(0);
        });
        it('the arguments (for the second call) should specify a price of 2173.00', () => {
          expect(spyOne.calls.argsFor(2)[0].price).toEqual(2173);
        });
        it('the arguments (for the second call) should specify a volume of zero', () => {
          expect(spyOne.calls.argsFor(2)[0].volume).toEqual(0);
        });
        it('the arguments (for the third call) should specify a price of 2173.25', () => {
          expect(spyOne.calls.argsFor(3)[0].price).toEqual(2173.25);
        });
        it('the arguments (for the third call) should specify a volume of 555', () => {
          expect(spyOne.calls.argsFor(3)[0].volume).toEqual(555);
        });
      });
      describe('and the observer is removed from the container', () => {
        beforeEach(function () {
          cv.off('events', spyOne);
        });
        describe('and another 50 contracts are traded at 2172.50', () => {
          beforeEach(function () {
            cv.incrementVolume(2172.5, 50);
          });
          it('the observer should be called once', () => {
            expect(spyOne).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });
});

},{"../../../lib/marketState/CumulativeVolume":4}],48:[function(require,module,exports){
const Profile = require('../../../lib/marketState/Profile');

describe('When a Profile is created (for a symbol with unitCode "2")', () => {
  'use strict';

  var p;
  beforeEach(() => {
    p = new Profile('ZCZ17', 'Corn', 'CME', '2');
  });
  it('formats 123.5 (with unit code 2) as "123-4"', () => {
    expect(p.formatPrice(123.5)).toEqual('123-4');
  });
});
describe('When a Profile is created (an option on a ZB future")', () => {
  'use strict';

  var p;
  beforeEach(() => {
    p = new Profile('ZBM2|1500C', '30-Year T-Bond', 'CBOT', '5', 1000, 1);
  });
  it('formats 0.5 as 0-32 (using sixty-fourths)', () => {
    expect(p.formatPrice(0.5)).toEqual('0-32');
  });
  it('formats 0.984375 as 0-63 (using sixty-fourths)', () => {
    expect(p.formatPrice(0.984375)).toEqual('0-63');
  });
});
describe('When a Profile is created (an option on a ZT future")', () => {
  'use strict';

  var p;
  beforeEach(() => {
    p = new Profile('ZTM2|1060C', '2-Year T-Note', 'CBOT', '6', 2000, 1);
  });
  it('formats 0.5 as 0-320 (using sixty-fourths)', () => {
    expect(p.formatPrice(0.5)).toEqual('0-320');
  });
  it('formats 0.9921875 as 0-635 (using sixty-fourths)', () => {
    expect(p.formatPrice(0.9921875)).toEqual('0-635');
  });
});

},{"../../../lib/marketState/Profile":5}],49:[function(require,module,exports){
const convertBaseCodeToUnitCode = require('./../../../../lib/utilities/convert/baseCodeToUnitCode');

describe('When converting a baseCode to a unitCode', () => {
  it('-1 should translate to "2"', () => {
    expect(convertBaseCodeToUnitCode(-1)).toEqual('2');
  });
  it('-2 should translate to "3"', () => {
    expect(convertBaseCodeToUnitCode(-2)).toEqual('3');
  });
  it('-3 should translate to "4"', () => {
    expect(convertBaseCodeToUnitCode(-3)).toEqual('4');
  });
  it('-4 should translate to "5"', () => {
    expect(convertBaseCodeToUnitCode(-4)).toEqual('5');
  });
  it('-5 should translate to "6"', () => {
    expect(convertBaseCodeToUnitCode(-5)).toEqual('6');
  });
  it('-6 should translate to "7"', () => {
    expect(convertBaseCodeToUnitCode(-6)).toEqual('7');
  });
  it('0 should translate to "8"', () => {
    expect(convertBaseCodeToUnitCode(0)).toEqual('8');
  });
  it('1 should translate to "9"', () => {
    expect(convertBaseCodeToUnitCode(1)).toEqual('9');
  });
  it('2 should translate to "A"', () => {
    expect(convertBaseCodeToUnitCode(2)).toEqual('A');
  });
  it('3 should translate to "B"', () => {
    expect(convertBaseCodeToUnitCode(3)).toEqual('B');
  });
  it('4 should translate to "C"', () => {
    expect(convertBaseCodeToUnitCode(4)).toEqual('C');
  });
  it('5 should translate to "D"', () => {
    expect(convertBaseCodeToUnitCode(5)).toEqual('D');
  });
  it('6 should translate to "E"', () => {
    expect(convertBaseCodeToUnitCode(6)).toEqual('E');
  });
  it('7 should translate to "F"', () => {
    expect(convertBaseCodeToUnitCode(7)).toEqual('F');
  });
  it('"-1" should translate to "0"', () => {
    expect(convertBaseCodeToUnitCode("-1")).toEqual("0");
  });
  it('A null value should translate to "0"', () => {
    expect(convertBaseCodeToUnitCode(null)).toEqual("0");
  });
  it('An undefined value should translate to "0"', () => {
    expect(convertBaseCodeToUnitCode(undefined)).toEqual("0");
  });
});

},{"./../../../../lib/utilities/convert/baseCodeToUnitCode":6}],50:[function(require,module,exports){
const convertDateToDayCode = require('./../../../../lib/utilities/convert/dateToDayCode');

describe('When converting a date instance to a day code', () => {
  it('"Jan 1, 2016" should translate to 1', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 1))).toEqual('1');
  });
  it('"Jan 2, 2016" should translate to 2', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 2))).toEqual('2');
  });
  it('"Jan 3, 2016" should translate to 3', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 3))).toEqual('3');
  });
  it('"Jan 4, 2016" should translate to 4', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 4))).toEqual('4');
  });
  it('"Jan 5, 2016" should translate to 5', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 5))).toEqual('5');
  });
  it('"Jan 6, 2016" should translate to 6', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 6))).toEqual('6');
  });
  it('"Jan 7, 2016" should translate to 7', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 7))).toEqual('7');
  });
  it('"Jan 8, 2016" should translate to 8', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 8))).toEqual('8');
  });
  it('"Jan 9, 2016" should translate to 9', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 9))).toEqual('9');
  });
  it('"Jan 10, 2016" should translate to 0', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 10))).toEqual('0');
  });
  it('"Jan 11, 2016" should translate to A', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 11))).toEqual('A');
  });
  it('"Jan 12, 2016" should translate to B', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 12))).toEqual('B');
  });
  it('"Jan 13, 2016" should translate to C', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 13))).toEqual('C');
  });
  it('"Jan 14, 2016" should translate to D', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 14))).toEqual('D');
  });
  it('"Jan 15, 2016" should translate to E', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 15))).toEqual('E');
  });
  it('"Jan 16, 2016" should translate to F', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 16))).toEqual('F');
  });
  it('"Jan 17, 2016" should translate to G', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 17))).toEqual('G');
  });
  it('"Jan 18, 2016" should translate to H', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 18))).toEqual('H');
  });
  it('"Jan 19, 2016" should translate to I', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 19))).toEqual('I');
  });
  it('"Jan 20, 2016" should translate to J', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 20))).toEqual('J');
  });
  it('"Jan 21, 2016" should translate to K', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 21))).toEqual('K');
  });
  it('"Jan 22, 2016" should translate to L', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 22))).toEqual('L');
  });
  it('"Jan 23, 2016" should translate to M', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 23))).toEqual('M');
  });
  it('"Jan 24, 2016" should translate to N', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 24))).toEqual('N');
  });
  it('"Jan 25, 2016" should translate to O', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 25))).toEqual('O');
  });
  it('"Jan 26, 2016" should translate to P', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 26))).toEqual('P');
  });
  it('"Jan 27, 2016" should translate to Q', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 27))).toEqual('Q');
  });
  it('"Jan 28, 2016" should translate to R', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 28))).toEqual('R');
  });
  it('"Jan 29, 2016" should translate to S', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 29))).toEqual('S');
  });
  it('"Jan 30, 2016" should translate to T', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 30))).toEqual('T');
  });
  it('"Jan 31, 2016" should translate to U', () => {
    expect(convertDateToDayCode(new Date(2016, 0, 31))).toEqual('U');
  });
  it('A null value should translate to a null value', () => {
    expect(convertDateToDayCode(null)).toEqual(null);
  });
  it('A undefined value should translate to a null value', () => {
    expect(convertDateToDayCode(null)).toEqual(null);
  });
});

},{"./../../../../lib/utilities/convert/dateToDayCode":7}],51:[function(require,module,exports){
const convertDayCodeToNumber = require('./../../../../lib/utilities/convert/dayCodeToNumber');

describe('When converting a dayCode to number', () => {
  it('"1" should translate to 1', () => {
    expect(convertDayCodeToNumber("1")).toEqual(1);
  });
  it('"2" should translate to 2', () => {
    expect(convertDayCodeToNumber("2")).toEqual(2);
  });
  it('"3" should translate to 3', () => {
    expect(convertDayCodeToNumber("3")).toEqual(3);
  });
  it('"4" should translate to 4', () => {
    expect(convertDayCodeToNumber("4")).toEqual(4);
  });
  it('"5" should translate to 5', () => {
    expect(convertDayCodeToNumber("5")).toEqual(5);
  });
  it('"6" should translate to 6', () => {
    expect(convertDayCodeToNumber("6")).toEqual(6);
  });
  it('"7" should translate to 7', () => {
    expect(convertDayCodeToNumber("7")).toEqual(7);
  });
  it('"8" should translate to 8', () => {
    expect(convertDayCodeToNumber("8")).toEqual(8);
  });
  it('"9" should translate to 9', () => {
    expect(convertDayCodeToNumber("9")).toEqual(9);
  });
  it('"0" should translate to 10', () => {
    expect(convertDayCodeToNumber("0")).toEqual(10);
  });
  it('"A" should translate to 11', () => {
    expect(convertDayCodeToNumber("A")).toEqual(11);
  });
  it('"a" should translate to 11', () => {
    expect(convertDayCodeToNumber("a")).toEqual(11);
  });
  it('"B" should translate to 12', () => {
    expect(convertDayCodeToNumber("B")).toEqual(12);
  });
  it('"b" should translate to 12', () => {
    expect(convertDayCodeToNumber("b")).toEqual(12);
  });
  it('"C" should translate to 13', () => {
    expect(convertDayCodeToNumber("C")).toEqual(13);
  });
  it('"c" should translate to 13', () => {
    expect(convertDayCodeToNumber("c")).toEqual(13);
  });
  it('"D" should translate to 14', () => {
    expect(convertDayCodeToNumber("D")).toEqual(14);
  });
  it('"d" should translate to 14', () => {
    expect(convertDayCodeToNumber("d")).toEqual(14);
  });
  it('"E" should translate to 15', () => {
    expect(convertDayCodeToNumber("E")).toEqual(15);
  });
  it('"e" should translate to 15', () => {
    expect(convertDayCodeToNumber("e")).toEqual(15);
  });
  it('"F" should translate to 16', () => {
    expect(convertDayCodeToNumber("F")).toEqual(16);
  });
  it('"f" should translate to 16', () => {
    expect(convertDayCodeToNumber("f")).toEqual(16);
  });
  it('"G" should translate to 17', () => {
    expect(convertDayCodeToNumber("G")).toEqual(17);
  });
  it('"g" should translate to 17', () => {
    expect(convertDayCodeToNumber("g")).toEqual(17);
  });
  it('"H" should translate to 18', () => {
    expect(convertDayCodeToNumber("H")).toEqual(18);
  });
  it('"h" should translate to 18', () => {
    expect(convertDayCodeToNumber("h")).toEqual(18);
  });
  it('"I" should translate to 19', () => {
    expect(convertDayCodeToNumber("I")).toEqual(19);
  });
  it('"i" should translate to 19', () => {
    expect(convertDayCodeToNumber("i")).toEqual(19);
  });
  it('"J" should translate to 20', () => {
    expect(convertDayCodeToNumber("J")).toEqual(20);
  });
  it('"j" should translate to 20', () => {
    expect(convertDayCodeToNumber("j")).toEqual(20);
  });
  it('"K" should translate to 21', () => {
    expect(convertDayCodeToNumber("K")).toEqual(21);
  });
  it('"k" should translate to 21', () => {
    expect(convertDayCodeToNumber("k")).toEqual(21);
  });
  it('"L" should translate to 22', () => {
    expect(convertDayCodeToNumber("L")).toEqual(22);
  });
  it('"l" should translate to 22', () => {
    expect(convertDayCodeToNumber("l")).toEqual(22);
  });
  it('"M" should translate to 23', () => {
    expect(convertDayCodeToNumber("M")).toEqual(23);
  });
  it('"m" should translate to 23', () => {
    expect(convertDayCodeToNumber("m")).toEqual(23);
  });
  it('"N" should translate to 24', () => {
    expect(convertDayCodeToNumber("N")).toEqual(24);
  });
  it('"n" should translate to 24', () => {
    expect(convertDayCodeToNumber("n")).toEqual(24);
  });
  it('"O" should translate to 25', () => {
    expect(convertDayCodeToNumber("O")).toEqual(25);
  });
  it('"o" should translate to 25', () => {
    expect(convertDayCodeToNumber("o")).toEqual(25);
  });
  it('"P" should translate to 26', () => {
    expect(convertDayCodeToNumber("P")).toEqual(26);
  });
  it('"p" should translate to 26', () => {
    expect(convertDayCodeToNumber("p")).toEqual(26);
  });
  it('"Q" should translate to 27', () => {
    expect(convertDayCodeToNumber("Q")).toEqual(27);
  });
  it('"q" should translate to 27', () => {
    expect(convertDayCodeToNumber("q")).toEqual(27);
  });
  it('"R" should translate to 28', () => {
    expect(convertDayCodeToNumber("R")).toEqual(28);
  });
  it('"r" should translate to 28', () => {
    expect(convertDayCodeToNumber("r")).toEqual(28);
  });
  it('"S" should translate to 29', () => {
    expect(convertDayCodeToNumber("S")).toEqual(29);
  });
  it('"s" should translate to 29', () => {
    expect(convertDayCodeToNumber("s")).toEqual(29);
  });
  it('"T" should translate to 30', () => {
    expect(convertDayCodeToNumber("T")).toEqual(30);
  });
  it('"t" should translate to 30', () => {
    expect(convertDayCodeToNumber("t")).toEqual(30);
  });
  it('"U" should translate to 31', () => {
    expect(convertDayCodeToNumber("U")).toEqual(31);
  });
  it('"u" should translate to 31', () => {
    expect(convertDayCodeToNumber("u")).toEqual(31);
  });
  it('A null value should translate to a null value', () => {
    expect(convertDayCodeToNumber(null)).toEqual(null);
  });
  it('A undefined value should translate to a null value', () => {
    expect(convertDayCodeToNumber(null)).toEqual(null);
  });
  it('A zero-length string should translate to a null value', () => {
    expect(convertDayCodeToNumber('')).toEqual(null);
  });
});

},{"./../../../../lib/utilities/convert/dayCodeToNumber":8}],52:[function(require,module,exports){
const convertMonthCodeToName = require('./../../../../lib/utilities/convert/monthCodeToName');

describe('When converting a futures month code to a month name', () => {
  it('The character "F" should translate to "January"', () => {
    expect(convertMonthCodeToName('F')).toEqual('January');
  });
  it('The character "N" should translate to "July"', () => {
    expect(convertMonthCodeToName('N')).toEqual('July');
  });
  it('The character "A" should translate to null value', () => {
    expect(convertMonthCodeToName('A')).toBe(null);
  });
});

},{"./../../../../lib/utilities/convert/monthCodeToName":9}],53:[function(require,module,exports){
const convertMonthCodeToNumber = require('./../../../../lib/utilities/convert/monthCodeToNumber');

describe('When converting a futures month code to a month name', () => {
  it('The character "F" should translate to the number 1', () => {
    expect(convertMonthCodeToNumber('F')).toEqual(1);
  });
  it('The character "N" should translate to the number 7', () => {
    expect(convertMonthCodeToNumber('N')).toEqual(7);
  });
  it('The character "A" should translate to null value', () => {
    expect(convertMonthCodeToNumber('A')).toBe(null);
  });
});

},{"./../../../../lib/utilities/convert/monthCodeToNumber":10}],54:[function(require,module,exports){
const convertNumberToDayCode = require('./../../../../lib/utilities/convert/numberToDayCode');

describe('When converting a number to a dayCode', () => {
  it('1 should translate to "1"', () => {
    expect(convertNumberToDayCode(1)).toEqual("1");
  });
  it('2 should translate to "2"', () => {
    expect(convertNumberToDayCode(2)).toEqual("2");
  });
  it('3 should translate to "3"', () => {
    expect(convertNumberToDayCode(3)).toEqual("3");
  });
  it('4 should translate to "4"', () => {
    expect(convertNumberToDayCode(4)).toEqual("4");
  });
  it('5 should translate to "5"', () => {
    expect(convertNumberToDayCode(5)).toEqual("5");
  });
  it('6 should translate to "6"', () => {
    expect(convertNumberToDayCode(6)).toEqual("6");
  });
  it('7 should translate to "7"', () => {
    expect(convertNumberToDayCode(7)).toEqual("7");
  });
  it('8 should translate to "8"', () => {
    expect(convertNumberToDayCode(8)).toEqual("8");
  });
  it('9 should translate to "9"', () => {
    expect(convertNumberToDayCode(9)).toEqual("9");
  });
  it('0 should translate to "0"', () => {
    expect(convertNumberToDayCode(10)).toEqual("0");
  });
  it('11 should translate to "A"', () => {
    expect(convertNumberToDayCode(11)).toEqual("A");
  });
  it('12 should translate to "B"', () => {
    expect(convertNumberToDayCode(12)).toEqual("B");
  });
  it('13 should translate to "C"', () => {
    expect(convertNumberToDayCode(13)).toEqual("C");
  });
  it('14 should translate to "D"', () => {
    expect(convertNumberToDayCode(14)).toEqual("D");
  });
  it('15 should translate to "E"', () => {
    expect(convertNumberToDayCode(15)).toEqual("E");
  });
  it('16 should translate to "F"', () => {
    expect(convertNumberToDayCode(16)).toEqual("F");
  });
  it('17 should translate to "G"', () => {
    expect(convertNumberToDayCode(17)).toEqual("G");
  });
  it('18 should translate to "H"', () => {
    expect(convertNumberToDayCode(18)).toEqual("H");
  });
  it('19 should translate to "I"', () => {
    expect(convertNumberToDayCode(19)).toEqual("I");
  });
  it('20 should translate to "J"', () => {
    expect(convertNumberToDayCode(20)).toEqual("J");
  });
  it('21 should translate to "K"', () => {
    expect(convertNumberToDayCode(21)).toEqual("K");
  });
  it('22 should translate to "L"', () => {
    expect(convertNumberToDayCode(22)).toEqual("L");
  });
  it('23 should translate to "M"', () => {
    expect(convertNumberToDayCode(23)).toEqual("M");
  });
  it('24 should translate to "N"', () => {
    expect(convertNumberToDayCode(24)).toEqual("N");
  });
  it('25 should translate to "O"', () => {
    expect(convertNumberToDayCode(25)).toEqual("O");
  });
  it('26 should translate to "P"', () => {
    expect(convertNumberToDayCode(26)).toEqual("P");
  });
  it('27 should translate to "Q"', () => {
    expect(convertNumberToDayCode(27)).toEqual("Q");
  });
  it('28 should translate to "R"', () => {
    expect(convertNumberToDayCode(28)).toEqual("R");
  });
  it('29 should translate to "S"', () => {
    expect(convertNumberToDayCode(29)).toEqual("S");
  });
  it('30 should translate to "T"', () => {
    expect(convertNumberToDayCode(30)).toEqual("T");
  });
  it('31 should translate to "U"', () => {
    expect(convertNumberToDayCode(31)).toEqual("U");
  });
  it('A null value should translate to a null value', () => {
    expect(convertNumberToDayCode(null)).toEqual(null);
  });
  it('A undefined value should translate to a null value', () => {
    expect(convertNumberToDayCode()).toEqual(null);
  });
});

},{"./../../../../lib/utilities/convert/numberToDayCode":11}],55:[function(require,module,exports){
const convertUnitCodeToBaseCode = require('./../../../../lib/utilities/convert/unitCodeToBaseCode');

describe('When converting a unitCode to a baseCode', () => {
  it('"2" should translate to -1', () => {
    expect(convertUnitCodeToBaseCode("2")).toEqual(-1);
  });
  it('"3" should translate to -2', () => {
    expect(convertUnitCodeToBaseCode("3")).toEqual(-2);
  });
  it('"4" should translate to -3', () => {
    expect(convertUnitCodeToBaseCode("4")).toEqual(-3);
  });
  it('"5" should translate to -4', () => {
    expect(convertUnitCodeToBaseCode("5")).toEqual(-4);
  });
  it('"6" should translate to -5', () => {
    expect(convertUnitCodeToBaseCode("6")).toEqual(-5);
  });
  it('"7" should translate to -6', () => {
    expect(convertUnitCodeToBaseCode("7")).toEqual(-6);
  });
  it('"8" should translate to 0', () => {
    expect(convertUnitCodeToBaseCode("8")).toEqual(0);
  });
  it('"9" should translate to 1', () => {
    expect(convertUnitCodeToBaseCode("9")).toEqual(1);
  });
  it('"A" should translate to 1', () => {
    expect(convertUnitCodeToBaseCode("A")).toEqual(2);
  });
  it('"B" should translate to 3', () => {
    expect(convertUnitCodeToBaseCode("B")).toEqual(3);
  });
  it('"C" should translate to 4', () => {
    expect(convertUnitCodeToBaseCode("C")).toEqual(4);
  });
  it('"D" should translate to 5', () => {
    expect(convertUnitCodeToBaseCode("D")).toEqual(5);
  });
  it('"E" should translate to 6', () => {
    expect(convertUnitCodeToBaseCode("E")).toEqual(6);
  });
  it('"F" should translate to 6', () => {
    expect(convertUnitCodeToBaseCode("F")).toEqual(7);
  });
  it('2 should translate to ', () => {
    expect(convertUnitCodeToBaseCode(2)).toEqual(0);
  });
  it('A null value should translate to 0', () => {
    expect(convertUnitCodeToBaseCode(null)).toEqual(0);
  });
  it('An undefined value should translate to 0', () => {
    expect(convertUnitCodeToBaseCode(undefined)).toEqual(0);
  });
});

},{"./../../../../lib/utilities/convert/unitCodeToBaseCode":12}],56:[function(require,module,exports){
const UnitCode = require('../../../../lib/utilities/data/UnitCode');

describe('When parsing an invalid argument', () => {
  it('should parse "1" as null', () => {
    expect(UnitCode.parse('1')).toEqual(null);
  });
  it('should parse "G" as null', () => {
    expect(UnitCode.parse('G')).toEqual(null);
  });
  it('should parse "a" as null', () => {
    expect(UnitCode.parse('a')).toEqual(null);
  });
  it('should parse the number two as null', () => {
    expect(UnitCode.parse(2)).toEqual(null);
  });
  it('should parse the string "AA" as null', () => {
    expect(UnitCode.parse('AA')).toEqual(null);
  });
  it('should parse null as null', () => {
    expect(UnitCode.parse(null)).toEqual(null);
  });
});
describe('When parsing a valid character as a unit code', () => {
  describe('When parsing "2"', () => {
    let unitCode;
    beforeEach(() => {
      unitCode = UnitCode.parse('2');
    });
    it('should have a code of "2"', () => {
      expect(unitCode.code).toEqual('2');
    });
    it('should have a "unit" code of "2"', () => {
      expect(unitCode.unitCode).toEqual('2');
    });
    it('should have a "base" code of -1', () => {
      expect(unitCode.baseCode).toEqual(-1);
    });
    it('should be the same instance as resolving "base" code -1', () => {
      expect(UnitCode.fromBaseCode(-1)).toBe(unitCode);
    });
    it('should use three decimal places', () => {
      expect(unitCode.decimalDigits).toEqual(3);
    });
    it('does support fraction notation', () => {
      expect(unitCode.supportsFractions).toEqual(true);
    });
    it('the fraction factor should be 8', () => {
      expect(unitCode.fractionFactor).toEqual(8);
    });
    it('the "special" fraction factor should be 8', () => {
      expect(unitCode.fractionFactorSpecial).toEqual(8);
    });
    it('getting the fraction factor should return 8', () => {
      expect(unitCode.getFractionFactor()).toEqual(8);
    });
    it('getting the "special" fraction factor should return 8', () => {
      expect(unitCode.getFractionFactor(true)).toEqual(8);
    });
    it('the fraction digits should be 1', () => {
      expect(unitCode.fractionDigits).toEqual(1);
    });
    it('the "special" fraction digits should be 1', () => {
      expect(unitCode.fractionDigitsSpecial).toEqual(1);
    });
    it('getting the fraction digits should return 1', () => {
      expect(unitCode.getFractionDigits()).toEqual(1);
    });
    it('getting the "special" fraction digits should return 1', () => {
      expect(unitCode.getFractionDigits(true)).toEqual(1);
    });
  });
  describe('When parsing "3"', () => {
    let unitCode;
    beforeEach(() => {
      unitCode = UnitCode.parse('3');
    });
    it('should have a code of "3"', () => {
      expect(unitCode.code).toEqual('3');
    });
    it('should have a "unit" code of "3"', () => {
      expect(unitCode.unitCode).toEqual('3');
    });
    it('should have a "base" code of -2', () => {
      expect(unitCode.baseCode).toEqual(-2);
    });
    it('should be the same instance as resolving "base" code -2', () => {
      expect(UnitCode.fromBaseCode(-2)).toBe(unitCode);
    });
    it('should use four decimal places', () => {
      expect(unitCode.decimalDigits).toEqual(4);
    });
    it('does support fraction notation', () => {
      expect(unitCode.supportsFractions).toEqual(true);
    });
    it('the fraction factor should be 16', () => {
      expect(unitCode.fractionFactor).toEqual(16);
    });
    it('the "special" fraction factor should be 16', () => {
      expect(unitCode.fractionFactorSpecial).toEqual(16);
    });
    it('getting the fraction factor should return 16', () => {
      expect(unitCode.getFractionFactor()).toEqual(16);
    });
    it('getting the "special" fraction factor should return 16', () => {
      expect(unitCode.getFractionFactor(true)).toEqual(16);
    });
    it('the fraction digits should be 2', () => {
      expect(unitCode.fractionDigits).toEqual(2);
    });
    it('the "special" fraction digits should be 2', () => {
      expect(unitCode.fractionDigitsSpecial).toEqual(2);
    });
    it('getting the fraction digits should return 2', () => {
      expect(unitCode.getFractionDigits()).toEqual(2);
    });
    it('getting the "special" fraction digits should return 2', () => {
      expect(unitCode.getFractionDigits(true)).toEqual(2);
    });
  });
  describe('When parsing "4"', () => {
    let unitCode;
    beforeEach(() => {
      unitCode = UnitCode.parse('4');
    });
    it('should have a code of "4"', () => {
      expect(unitCode.code).toEqual('4');
    });
    it('should have a "unit" code of "4"', () => {
      expect(unitCode.unitCode).toEqual('4');
    });
    it('should have a "base" code of -3', () => {
      expect(unitCode.baseCode).toEqual(-3);
    });
    it('should be the same instance as resolving "base" code -3', () => {
      expect(UnitCode.fromBaseCode(-3)).toBe(unitCode);
    });
    it('should use five decimal places', () => {
      expect(unitCode.decimalDigits).toEqual(5);
    });
    it('does support fraction notation', () => {
      expect(unitCode.supportsFractions).toEqual(true);
    });
    it('the fraction factor should be 32', () => {
      expect(unitCode.fractionFactor).toEqual(32);
    });
    it('the "special" fraction factor should be 32', () => {
      expect(unitCode.fractionFactorSpecial).toEqual(32);
    });
    it('getting the fraction factor should return 32', () => {
      expect(unitCode.getFractionFactor()).toEqual(32);
    });
    it('getting the "special" fraction factor should return 32', () => {
      expect(unitCode.getFractionFactor(true)).toEqual(32);
    });
    it('the fraction digits should be 2', () => {
      expect(unitCode.fractionDigits).toEqual(2);
    });
    it('the "special" fraction digits should be 2', () => {
      expect(unitCode.fractionDigitsSpecial).toEqual(2);
    });
    it('getting the fraction digits should return 2', () => {
      expect(unitCode.getFractionDigits()).toEqual(2);
    });
    it('getting the "special" fraction digits should return 2', () => {
      expect(unitCode.getFractionDigits(true)).toEqual(2);
    });
  });
  describe('When parsing "5"', () => {
    let unitCode;
    beforeEach(() => {
      unitCode = UnitCode.parse('5');
    });
    it('should have a code of "5"', () => {
      expect(unitCode.code).toEqual('5');
    });
    it('should have a "unit" code of "5"', () => {
      expect(unitCode.unitCode).toEqual('5');
    });
    it('should have a "base" code of -4', () => {
      expect(unitCode.baseCode).toEqual(-4);
    });
    it('should be the same instance as resolving "base" code -4', () => {
      expect(UnitCode.fromBaseCode(-4)).toBe(unitCode);
    });
    it('should use six decimal places', () => {
      expect(unitCode.decimalDigits).toEqual(6);
    });
    it('does support fraction notation', () => {
      expect(unitCode.supportsFractions).toEqual(true);
    });
    it('the fraction factor should be 64', () => {
      expect(unitCode.fractionFactor).toEqual(64);
    });
    it('the "special" fraction factor should be 320', () => {
      expect(unitCode.fractionFactorSpecial).toEqual(320);
    });
    it('getting the fraction factor should return 64', () => {
      expect(unitCode.getFractionFactor()).toEqual(64);
    });
    it('getting the "special" fraction factor should return 320', () => {
      expect(unitCode.getFractionFactor(true)).toEqual(320);
    });
    it('the fraction digits should be 2', () => {
      expect(unitCode.fractionDigits).toEqual(2);
    });
    it('the "special" fraction digits should be 3', () => {
      expect(unitCode.fractionDigitsSpecial).toEqual(3);
    });
    it('getting the fraction digits should return 2', () => {
      expect(unitCode.getFractionDigits()).toEqual(2);
    });
    it('getting the "special" fraction digits should return 3', () => {
      expect(unitCode.getFractionDigits(true)).toEqual(3);
    });
  });
  describe('When parsing "6"', () => {
    let unitCode;
    beforeEach(() => {
      unitCode = UnitCode.parse('6');
    });
    it('should have a code of "6"', () => {
      expect(unitCode.code).toEqual('6');
    });
    it('should have a "unit" code of "6"', () => {
      expect(unitCode.unitCode).toEqual('6');
    });
    it('should have a "base" code of -5', () => {
      expect(unitCode.baseCode).toEqual(-5);
    });
    it('should be the same instance as resolving "base" code -5', () => {
      expect(UnitCode.fromBaseCode(-5)).toBe(unitCode);
    });
    it('should use seven decimal places', () => {
      expect(unitCode.decimalDigits).toEqual(7);
    });
    it('does support fraction notation', () => {
      expect(unitCode.supportsFractions).toEqual(true);
    });
    it('the fraction factor should be 128', () => {
      expect(unitCode.fractionFactor).toEqual(128);
    });
    it('the "special" fraction factor should be 320', () => {
      expect(unitCode.fractionFactorSpecial).toEqual(320);
    });
    it('getting the fraction factor should return 128', () => {
      expect(unitCode.getFractionFactor()).toEqual(128);
    });
    it('getting the "special" fraction factor should return 320', () => {
      expect(unitCode.getFractionFactor(true)).toEqual(320);
    });
    it('the fraction digits should be 3', () => {
      expect(unitCode.fractionDigits).toEqual(3);
    });
    it('the "special" fraction digits should be 3', () => {
      expect(unitCode.fractionDigitsSpecial).toEqual(3);
    });
    it('getting the fraction digits should return 3', () => {
      expect(unitCode.getFractionDigits()).toEqual(3);
    });
    it('getting the "special" fraction digits should return 3', () => {
      expect(unitCode.getFractionDigits(true)).toEqual(3);
    });
  });
  describe('When parsing "7"', () => {
    let unitCode;
    beforeEach(() => {
      unitCode = UnitCode.parse('7');
    });
    it('should have a code of "7"', () => {
      expect(unitCode.code).toEqual('7');
    });
    it('should have a "unit" code of "7"', () => {
      expect(unitCode.unitCode).toEqual('7');
    });
    it('should have a "base" code of -6', () => {
      expect(unitCode.baseCode).toEqual(-6);
    });
    it('should be the same instance as resolving "base" code -6', () => {
      expect(UnitCode.fromBaseCode(-6)).toBe(unitCode);
    });
    it('should use eight decimal places', () => {
      expect(unitCode.decimalDigits).toEqual(8);
    });
    it('does support fraction notation', () => {
      expect(unitCode.supportsFractions).toEqual(true);
    });
    it('the fraction factor should be 256', () => {
      expect(unitCode.fractionFactor).toEqual(256);
    });
    it('the "special" fraction factor should be 320', () => {
      expect(unitCode.fractionFactorSpecial).toEqual(320);
    });
    it('getting the fraction factor should return 256', () => {
      expect(unitCode.getFractionFactor()).toEqual(256);
    });
    it('getting the "special" fraction factor should return 320', () => {
      expect(unitCode.getFractionFactor(true)).toEqual(320);
    });
    it('the fraction digits should be 3', () => {
      expect(unitCode.fractionDigits).toEqual(3);
    });
    it('the "special" fraction digits should be 3', () => {
      expect(unitCode.fractionDigitsSpecial).toEqual(3);
    });
    it('getting the fraction digits should return 3', () => {
      expect(unitCode.getFractionDigits()).toEqual(3);
    });
    it('getting the "special" fraction digits should return 3', () => {
      expect(unitCode.getFractionDigits(true)).toEqual(3);
    });
  });
  describe('When parsing "8"', () => {
    let unitCode;
    beforeEach(() => {
      unitCode = UnitCode.parse('8');
    });
    it('should have a code of "8"', () => {
      expect(unitCode.code).toEqual('8');
    });
    it('should have a "unit" code of "8"', () => {
      expect(unitCode.unitCode).toEqual('8');
    });
    it('should have a "base" code of 0', () => {
      expect(unitCode.baseCode).toEqual(0);
    });
    it('should be the same instance as resolving "base" code 0', () => {
      expect(UnitCode.fromBaseCode(0)).toBe(unitCode);
    });
    it('should use zero decimal places', () => {
      expect(unitCode.decimalDigits).toEqual(0);
    });
    it('does not support fraction notation', () => {
      expect(unitCode.supportsFractions).toEqual(false);
    });
    it('the fraction factor should be undefined', () => {
      expect(unitCode.fractionFactor).toEqual(undefined);
    });
    it('the "special" fraction factor should be undefined', () => {
      expect(unitCode.fractionFactorSpecial).toEqual(undefined);
    });
    it('getting the fraction factor should return undefined', () => {
      expect(unitCode.getFractionFactor()).toEqual(undefined);
    });
    it('getting the "special" fraction factor should return undefined', () => {
      expect(unitCode.getFractionFactor(true)).toEqual(undefined);
    });
    it('the fraction digits should be undefined', () => {
      expect(unitCode.fractionDigits).toEqual(undefined);
    });
    it('the "special" fraction digits should be undefined', () => {
      expect(unitCode.fractionDigitsSpecial).toEqual(undefined);
    });
    it('getting the fraction digits should return undefined', () => {
      expect(unitCode.getFractionDigits()).toEqual(undefined);
    });
    it('getting the "special" fraction digits should return undefined', () => {
      expect(unitCode.getFractionDigits(true)).toEqual(undefined);
    });
  });
  describe('When parsing "9"', () => {
    let unitCode;
    beforeEach(() => {
      unitCode = UnitCode.parse('9');
    });
    it('should have a code of "9"', () => {
      expect(unitCode.code).toEqual('9');
    });
    it('should have a "unit" code of "9"', () => {
      expect(unitCode.unitCode).toEqual('9');
    });
    it('should have a "base" code of 1', () => {
      expect(unitCode.baseCode).toEqual(1);
    });
    it('should be the same instance as resolving "base" code 1', () => {
      expect(UnitCode.fromBaseCode(1)).toBe(unitCode);
    });
    it('should use one decimal places', () => {
      expect(unitCode.decimalDigits).toEqual(1);
    });
    it('does not support fraction notation', () => {
      expect(unitCode.supportsFractions).toEqual(false);
    });
    it('the fraction factor should be undefined', () => {
      expect(unitCode.fractionFactor).toEqual(undefined);
    });
    it('the "special" fraction factor should be undefined', () => {
      expect(unitCode.fractionFactorSpecial).toEqual(undefined);
    });
    it('getting the fraction factor should return undefined', () => {
      expect(unitCode.getFractionFactor()).toEqual(undefined);
    });
    it('getting the "special" fraction factor should return undefined', () => {
      expect(unitCode.getFractionFactor(true)).toEqual(undefined);
    });
    it('the fraction digits should be undefined', () => {
      expect(unitCode.fractionDigits).toEqual(undefined);
    });
    it('the "special" fraction digits should be undefined', () => {
      expect(unitCode.fractionDigitsSpecial).toEqual(undefined);
    });
    it('getting the fraction digits should return undefined', () => {
      expect(unitCode.getFractionDigits()).toEqual(undefined);
    });
    it('getting the "special" fraction digits should return undefined', () => {
      expect(unitCode.getFractionDigits(true)).toEqual(undefined);
    });
  });
  describe('When parsing "A"', () => {
    let unitCode;
    beforeEach(() => {
      unitCode = UnitCode.parse('A');
    });
    it('should have a code of "A"', () => {
      expect(unitCode.code).toEqual('A');
    });
    it('should have a "unit" code of "A"', () => {
      expect(unitCode.unitCode).toEqual('A');
    });
    it('should have a "base" code of 2', () => {
      expect(unitCode.baseCode).toEqual(2);
    });
    it('should be the same instance as resolving "base" code 2', () => {
      expect(UnitCode.fromBaseCode(2)).toBe(unitCode);
    });
    it('should use two decimal places', () => {
      expect(unitCode.decimalDigits).toEqual(2);
    });
    it('does not support fraction notation', () => {
      expect(unitCode.supportsFractions).toEqual(false);
    });
    it('the fraction factor should be undefined', () => {
      expect(unitCode.fractionFactor).toEqual(undefined);
    });
    it('the "special" fraction factor should be undefined', () => {
      expect(unitCode.fractionFactorSpecial).toEqual(undefined);
    });
    it('getting the fraction factor should return undefined', () => {
      expect(unitCode.getFractionFactor()).toEqual(undefined);
    });
    it('getting the "special" fraction factor should return undefined', () => {
      expect(unitCode.getFractionFactor(true)).toEqual(undefined);
    });
    it('the fraction digits should be undefined', () => {
      expect(unitCode.fractionDigits).toEqual(undefined);
    });
    it('the "special" fraction digits should be undefined', () => {
      expect(unitCode.fractionDigitsSpecial).toEqual(undefined);
    });
    it('getting the fraction digits should return undefined', () => {
      expect(unitCode.getFractionDigits()).toEqual(undefined);
    });
    it('getting the "special" fraction digits should return undefined', () => {
      expect(unitCode.getFractionDigits(true)).toEqual(undefined);
    });
  });
  describe('When parsing "B"', () => {
    let unitCode;
    beforeEach(() => {
      unitCode = UnitCode.parse('B');
    });
    it('should have a code of "B"', () => {
      expect(unitCode.code).toEqual('B');
    });
    it('should have a "unit" code of "B"', () => {
      expect(unitCode.unitCode).toEqual('B');
    });
    it('should have a "base" code of 3', () => {
      expect(unitCode.baseCode).toEqual(3);
    });
    it('should be the same instance as resolving "base" code 3', () => {
      expect(UnitCode.fromBaseCode(3)).toBe(unitCode);
    });
    it('should use three decimal places', () => {
      expect(unitCode.decimalDigits).toEqual(3);
    });
    it('does not support fraction notation', () => {
      expect(unitCode.supportsFractions).toEqual(false);
    });
    it('the fraction factor should be undefined', () => {
      expect(unitCode.fractionFactor).toEqual(undefined);
    });
    it('the "special" fraction factor should be undefined', () => {
      expect(unitCode.fractionFactorSpecial).toEqual(undefined);
    });
    it('getting the fraction factor should return undefined', () => {
      expect(unitCode.getFractionFactor()).toEqual(undefined);
    });
    it('getting the "special" fraction factor should return undefined', () => {
      expect(unitCode.getFractionFactor(true)).toEqual(undefined);
    });
    it('the fraction digits should be undefined', () => {
      expect(unitCode.fractionDigits).toEqual(undefined);
    });
    it('the "special" fraction digits should be undefined', () => {
      expect(unitCode.fractionDigitsSpecial).toEqual(undefined);
    });
    it('getting the fraction digits should return undefined', () => {
      expect(unitCode.getFractionDigits()).toEqual(undefined);
    });
    it('getting the "special" fraction digits should return undefined', () => {
      expect(unitCode.getFractionDigits(true)).toEqual(undefined);
    });
  });
  describe('When parsing "C"', () => {
    let unitCode;
    beforeEach(() => {
      unitCode = UnitCode.parse('C');
    });
    it('should have a code of "C"', () => {
      expect(unitCode.code).toEqual('C');
    });
    it('should have a "unit" code of "C"', () => {
      expect(unitCode.unitCode).toEqual('C');
    });
    it('should have a "base" code of 4', () => {
      expect(unitCode.baseCode).toEqual(4);
    });
    it('should be the same instance as resolving "base" code 4', () => {
      expect(UnitCode.fromBaseCode(4)).toBe(unitCode);
    });
    it('should use four decimal places', () => {
      expect(unitCode.decimalDigits).toEqual(4);
    });
    it('does not support fraction notation', () => {
      expect(unitCode.supportsFractions).toEqual(false);
    });
    it('the fraction factor should be undefined', () => {
      expect(unitCode.fractionFactor).toEqual(undefined);
    });
    it('the "special" fraction factor should be undefined', () => {
      expect(unitCode.fractionFactorSpecial).toEqual(undefined);
    });
    it('getting the fraction factor should return undefined', () => {
      expect(unitCode.getFractionFactor()).toEqual(undefined);
    });
    it('getting the "special" fraction factor should return undefined', () => {
      expect(unitCode.getFractionFactor(true)).toEqual(undefined);
    });
    it('the fraction digits should be undefined', () => {
      expect(unitCode.fractionDigits).toEqual(undefined);
    });
    it('the "special" fraction digits should be undefined', () => {
      expect(unitCode.fractionDigitsSpecial).toEqual(undefined);
    });
    it('getting the fraction digits should return undefined', () => {
      expect(unitCode.getFractionDigits()).toEqual(undefined);
    });
    it('getting the "special" fraction digits should return undefined', () => {
      expect(unitCode.getFractionDigits(true)).toEqual(undefined);
    });
  });
  describe('When parsing "D"', () => {
    let unitCode;
    beforeEach(() => {
      unitCode = UnitCode.parse('D');
    });
    it('should have a code of "D"', () => {
      expect(unitCode.code).toEqual('D');
    });
    it('should have a "unit" code of "D"', () => {
      expect(unitCode.unitCode).toEqual('D');
    });
    it('should have a "base" code of 5', () => {
      expect(unitCode.baseCode).toEqual(5);
    });
    it('should be the same instance as resolving "base" code 5', () => {
      expect(UnitCode.fromBaseCode(5)).toBe(unitCode);
    });
    it('should use five decimal places', () => {
      expect(unitCode.decimalDigits).toEqual(5);
    });
    it('does not support fraction notation', () => {
      expect(unitCode.supportsFractions).toEqual(false);
    });
    it('the fraction factor should be undefined', () => {
      expect(unitCode.fractionFactor).toEqual(undefined);
    });
    it('the "special" fraction factor should be undefined', () => {
      expect(unitCode.fractionFactorSpecial).toEqual(undefined);
    });
    it('getting the fraction factor should return undefined', () => {
      expect(unitCode.getFractionFactor()).toEqual(undefined);
    });
    it('getting the "special" fraction factor should return undefined', () => {
      expect(unitCode.getFractionFactor(true)).toEqual(undefined);
    });
    it('the fraction digits should be undefined', () => {
      expect(unitCode.fractionDigits).toEqual(undefined);
    });
    it('the "special" fraction digits should be undefined', () => {
      expect(unitCode.fractionDigitsSpecial).toEqual(undefined);
    });
    it('getting the fraction digits should return undefined', () => {
      expect(unitCode.getFractionDigits()).toEqual(undefined);
    });
    it('getting the "special" fraction digits should return undefined', () => {
      expect(unitCode.getFractionDigits(true)).toEqual(undefined);
    });
  });
  describe('When parsing "E"', () => {
    let unitCode;
    beforeEach(() => {
      unitCode = UnitCode.parse('E');
    });
    it('should have a code of "E"', () => {
      expect(unitCode.code).toEqual('E');
    });
    it('should have a "unit" code of "E"', () => {
      expect(unitCode.unitCode).toEqual('E');
    });
    it('should have a "base" code of 6', () => {
      expect(unitCode.baseCode).toEqual(6);
    });
    it('should be the same instance as resolving "base" code 6', () => {
      expect(UnitCode.fromBaseCode(6)).toBe(unitCode);
    });
    it('should use six decimal places', () => {
      expect(unitCode.decimalDigits).toEqual(6);
    });
    it('does not support fraction notation', () => {
      expect(unitCode.supportsFractions).toEqual(false);
    });
    it('the fraction factor should be undefined', () => {
      expect(unitCode.fractionFactor).toEqual(undefined);
    });
    it('the "special" fraction factor should be undefined', () => {
      expect(unitCode.fractionFactorSpecial).toEqual(undefined);
    });
    it('getting the fraction factor should return undefined', () => {
      expect(unitCode.getFractionFactor()).toEqual(undefined);
    });
    it('getting the "special" fraction factor should return undefined', () => {
      expect(unitCode.getFractionFactor(true)).toEqual(undefined);
    });
    it('the fraction digits should be undefined', () => {
      expect(unitCode.fractionDigits).toEqual(undefined);
    });
    it('the "special" fraction digits should be undefined', () => {
      expect(unitCode.fractionDigitsSpecial).toEqual(undefined);
    });
    it('getting the fraction digits should return undefined', () => {
      expect(unitCode.getFractionDigits()).toEqual(undefined);
    });
    it('getting the "special" fraction digits should return undefined', () => {
      expect(unitCode.getFractionDigits(true)).toEqual(undefined);
    });
  });
  describe('When parsing "F"', () => {
    let unitCode;
    beforeEach(() => {
      unitCode = UnitCode.parse('F');
    });
    it('should have a code of "F"', () => {
      expect(unitCode.code).toEqual('F');
    });
    it('should have a "unit" code of "F"', () => {
      expect(unitCode.unitCode).toEqual('F');
    });
    it('should have a "base" code of 7', () => {
      expect(unitCode.baseCode).toEqual(7);
    });
    it('should use seven decimal places', () => {
      expect(unitCode.decimalDigits).toEqual(7);
    });
    it('does not support fraction notation', () => {
      expect(unitCode.supportsFractions).toEqual(false);
    });
    it('the fraction factor should be undefined', () => {
      expect(unitCode.fractionFactor).toEqual(undefined);
    });
    it('the "special" fraction factor should be undefined', () => {
      expect(unitCode.fractionFactorSpecial).toEqual(undefined);
    });
    it('getting the fraction factor should return undefined', () => {
      expect(unitCode.getFractionFactor()).toEqual(undefined);
    });
    it('getting the "special" fraction factor should return undefined', () => {
      expect(unitCode.getFractionFactor(true)).toEqual(undefined);
    });
    it('the fraction digits should be undefined', () => {
      expect(unitCode.fractionDigits).toEqual(undefined);
    });
    it('the "special" fraction digits should be undefined', () => {
      expect(unitCode.fractionDigitsSpecial).toEqual(undefined);
    });
    it('getting the fraction digits should return undefined', () => {
      expect(unitCode.getFractionDigits()).toEqual(undefined);
    });
    it('getting the "special" fraction digits should return undefined', () => {
      expect(unitCode.getFractionDigits(true)).toEqual(undefined);
    });
  });
});

},{"../../../../lib/utilities/data/UnitCode":14}],57:[function(require,module,exports){
const monthCodes = require('../../../../lib/utilities/data/monthCodes');

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

},{"../../../../lib/utilities/data/monthCodes":15}],58:[function(require,module,exports){
const string = require('@barchart/common-js/lang/string');

const formatPrice = require('./../../../../lib/utilities/format/price'); // 2021/07/12, BRI. These tests are based on mapping tables (between decimal
// values and expected fractional representations) published by the CME:
//
// https://www.cmegroup.com/confluence/display/EPICSANDBOX/Fractional+Pricing+-+Tick+and+Decimal+Conversions
//
// See maps (with explanations) below ...


describe('when formatting decimals as ticks', () => {
  it('should be formatted correctly (each tick = 1/32, e.g. root=ZB)', () => {
    const rules = THIRTY_SECONDS;
    const code = '4';
    rules.forEach(rule => {
      const decimal = rule[1];
      const expected = `0-${string.padLeft(rule[0].toString(), 2, '0')}`;
      expect(formatPrice(decimal, code, '-', true)).toEqual(expected);
    });
  });
  it('should be formatted correctly (each tick = 1/2 of a 1/32, e.g. root=ZN)', () => {
    const rules = HALVES_OF_THIRTY_SECONDS;
    const code = '5';
    rules.forEach(rule => {
      const decimal = rule[1];
      const expected = `0-${string.padLeft(rule[0].toString(), 3, '0')}`;
      expect(formatPrice(decimal, code, '-', true)).toEqual(expected);
    });
  });
  it('should be formatted correctly (each tick = 1/4 of a 1/32, e.g. root=ZF)', () => {
    const rules = QUARTERS_OF_THIRTY_SECONDS;
    const code = '5';
    rules.forEach(rule => {
      const decimal = rule[1];
      const expected = `0-${string.padLeft(rule[0].toString(), 3, '0')}`;
      expect(formatPrice(decimal, code, '-', true)).toEqual(expected);
    });
  });
  it('should be formatted correctly (each tick = 1/8 of a 1/32, e.g. root=ZT)', () => {
    const rules = EIGHTHS_OF_THIRTY_SECONDS;
    const code = '7';
    rules.forEach(rule => {
      const decimal = rule[1];
      const expected = `0-${string.padLeft(rule[0].toString(), 3, '0')}`;
      expect(formatPrice(decimal, code, '-', true)).toEqual(expected);
    });
  });
});
const THIRTY_SECONDS = [// 1/32nd = 0-01 (numerator shown, denominator implied) = 1/32 = 0.3125,
// 2/32nd = 0-02 (numerator shown, denominator implied) = 2/32 = 0.0625...
[0, 0], [1, 0.03125], [2, 0.0625], [3, 0.09375], [4, 0.125], [5, 0.15625], [6, 0.1875], [7, 0.21875], [8, 0.25], [9, 0.28125], [10, 0.3125], [11, 0.34375], [12, 0.375], [13, 0.40625], [14, 0.4375], [15, 0.46875], [16, 0.5], [17, 0.53125], [18, 0.5625], [19, 0.59375], [20, 0.625], [21, 0.65625], [22, 0.6875], [23, 0.71875], [24, 0.75], [25, 0.78125], [26, 0.8125], [27, 0.84375], [28, 0.875], [29, 0.90625], [30, 0.9375], [31, 0.96875]];
const HALVES_OF_THIRTY_SECONDS = [// 0/32nds + 1/2 of a 32nd = 0.5/32nd = 0-005 (numerator shown without decimal point, denominator implied) = 0.5/32 = 0.015625,
// 1/32nds + 0/2 of a 32nd = 1.0/32nd = 0-010 (numerator shown without decimal point, denominator implied) = 1/32 = 0.32125,
// 1/32nds + 1/2 of a 32nd = 1.5/32nd = 0-015 (numerator shown without decimal point, denominator implied) = 1.5/32 = 0.046875...
[0, 0], [5, 0.015625], [10, 0.03125], [15, 0.046875], [20, 0.0625], [25, 0.078125], [30, 0.09375], [35, 0.109375], [40, 0.125], [45, 0.140625], [50, 0.15625], [55, 0.171875], [60, 0.1875], [65, 0.203125], [70, 0.21875], [75, 0.234375], [80, 0.25], [85, 0.265625], [90, 0.28125], [95, 0.296875], [100, 0.3125], [105, 0.328125], [110, 0.34375], [115, 0.359375], [120, 0.375], [125, 0.390625], [130, 0.40625], [135, 0.421875], [140, 0.4375], [145, 0.453125], [150, 0.46875], [155, 0.484375], [160, 0.5], [165, 0.515625], [170, 0.53125], [175, 0.546875], [180, 0.5625], [185, 0.578125], [190, 0.59375], [195, 0.609375], [200, 0.625], [205, 0.640625], [210, 0.65625], [215, 0.671875], [220, 0.6875], [225, 0.703125], [230, 0.71875], [235, 0.734375], [240, 0.75], [245, 0.765625], [250, 0.78125], [255, 0.796875], [260, 0.8125], [265, 0.828125], [270, 0.84375], [275, 0.859375], [280, 0.875], [285, 0.890625], [290, 0.90625], [295, 0.921875], [300, 0.9375], [305, 0.953125], [310, 0.96875], [315, 0.984375]];
const QUARTERS_OF_THIRTY_SECONDS = [// 0/32nds + 1/4 of a 32nd = 0.25/32nd = 0-002[5] = 0-002 (numerator shown without decimal point and omitting last digit, denominator implied) = 0.25/32 = 0.0078125,
// 0/32nds + 2/4 of a 32nd = 0.50/32nd = 0-005[0] = 0-005 (numerator shown without decimal point and omitting last digit, denominator implied) = 0.50/32 = 0.015625,
// 0/32nds + 3/4 of a 32nd = 0.75/32nd = 0-007[5] = 0-007 (numerator shown without decimal point and omitting last digit, denominator implied) = 0.75/32 = 0.0234375,
// 1/32nds + 0/4 of a 32nd = 1.00/32nd = 0-010[0] = 0-010 (numerator shown without decimal point and omitting last digit, denominator implied) = 1/32 = 0.03125,
// 1/32nds + 1/4 of a 32nd = 1.25/32nd = 0-012[5] = 0-012 (numerator shown without decimal point and omitting last digit, denominator implied) = 1.25/32 = 0.0390625 ...
[0, 0], [2, 0.0078125], [5, 0.015625], [7, 0.0234375], [10, 0.03125], [12, 0.0390625], [15, 0.046875], [17, 0.0546875], [20, 0.0625], [22, 0.0703125], [25, 0.078125], [27, 0.0859375], [30, 0.09375], [32, 0.1015625], [35, 0.109375], [37, 0.1171875], [40, 0.125], [42, 0.1328125], [45, 0.140625], [47, 0.1484375], [50, 0.15625], [52, 0.1640625], [55, 0.171875], [57, 0.1796875], [60, 0.1875], [62, 0.1953125], [65, 0.203125], [67, 0.2109375], [70, 0.21875], [72, 0.2265625], [75, 0.234375], [77, 0.2421875], [80, 0.25], [82, 0.2578125], [85, 0.265625], [87, 0.2734375], [90, 0.28125], [92, 0.2890625], [95, 0.296875], [97, 0.3046875], [100, 0.3125], [102, 0.3203125], [105, 0.328125], [107, 0.3359375], [110, 0.34375], [112, 0.3515625], [115, 0.359375], [117, 0.3671875], [120, 0.375], [122, 0.3828125], [125, 0.390625], [127, 0.3984375], [130, 0.40625], [132, 0.4140625], [135, 0.421875], [137, 0.4296875], [140, 0.4375], [142, 0.4453125], [145, 0.453125], [147, 0.4609375], [150, 0.46875], [152, 0.4765625], [155, 0.484375], [157, 0.4921875], [160, 0.5], [162, 0.5078125], [165, 0.515625], [167, 0.5234375], [170, 0.53125], [172, 0.5390625], [175, 0.546875], [177, 0.5546875], [180, 0.5625], [182, 0.5703125], [185, 0.578125], [187, 0.5859375], [190, 0.59375], [192, 0.6015625], [195, 0.609375], [197, 0.6171875], [200, 0.625], [202, 0.6328125], [205, 0.640625], [207, 0.6484375], [210, 0.65625], [212, 0.6640625], [215, 0.671875], [217, 0.6796875], [220, 0.6875], [222, 0.6953125], [225, 0.703125], [227, 0.7109375], [230, 0.71875], [232, 0.7265625], [235, 0.734375], [237, 0.7421875], [240, 0.75], [242, 0.7578125], [245, 0.765625], [247, 0.7734375], [250, 0.78125], [252, 0.7890625], [255, 0.796875], [257, 0.8046875], [260, 0.8125], [262, 0.8203125], [265, 0.828125], [267, 0.8359375], [270, 0.84375], [272, 0.8515625], [275, 0.859375], [277, 0.8671875], [280, 0.875], [282, 0.8828125], [285, 0.890625], [287, 0.8984375], [290, 0.90625], [292, 0.9140625], [295, 0.921875], [297, 0.9296875], [300, 0.9375], [302, 0.9453125], [305, 0.953125], [307, 0.9609375], [310, 0.96875], [312, 0.9765625], [315, 0.984375], [317, 0.9921875]];
const EIGHTHS_OF_THIRTY_SECONDS = [// 0/32nds + 1/8 of a 32nd = 0.125/32nd = 0-001[25] = 0-001 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.125/32 = 0.00390625,
// 0/32nds + 2/8 of a 32nd = 0.250/32nd = 0-002[50] = 0-002 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.250/32 = 0.0078125,
// 0/32nds + 3/8 of a 32nd = 0.75/32nd = 0-003[75] = 0-003 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.375/32 = 0.01171875,
// 0/32nds + 4/8 of a 32nd = 1.00/32nd = 0-005[00] = 0-005 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.500/32 = 0.015625,
// 0/32nds + 5/8 of a 32nd = 1.25/32nd = 0-006[25] = 0-006 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.625/32 = 0.01953125,
// 0/32nds + 6/8 of a 32nd = 0.25/32nd = 0-007[50] = 0-007 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.750/32 = 0.0234375,
// 0/32nds + 7/8 of a 32nd = 0.50/32nd = 0-008[75] = 0-008 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.875/32 = 0.02734375,
// 0/32nds + 0/8 of a 32nd = 0.75/32nd = 0-010[00] = 0-010 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 1.000/32 = 0.03125,
// 0/32nds + 1/8 of a 32nd = 1.00/32nd = 0-011[25] = 0-011 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 1.125/32 = 0.03515625...
[0, 0], [1, 0.00390625], [2, 0.0078125], [3, 0.01171875], [5, 0.015625], [6, 0.01953125], [7, 0.0234375], [8, 0.02734375], [10, 0.03125], [11, 0.03515625], [12, 0.0390625], [13, 0.04296875], [15, 0.046875], [16, 0.05078125], [17, 0.0546875], [18, 0.05859375], [20, 0.0625], [21, 0.06640625], [22, 0.0703125], [23, 0.07421875], [25, 0.078125], [26, 0.08203125], [27, 0.0859375], [28, 0.08984375], [30, 0.09375], [31, 0.09765625], [32, 0.1015625], [33, 0.10546875], [35, 0.109375], [36, 0.11328125], [37, 0.1171875], [38, 0.12109375], [40, 0.125], [41, 0.12890625], [42, 0.1328125], [43, 0.13671875], [45, 0.140625], [46, 0.14453125], [47, 0.1484375], [48, 0.15234375], [50, 0.15625], [51, 0.16015625], [52, 0.1640625], [53, 0.16796875], [55, 0.171875], [56, 0.17578125], [57, 0.1796875], [58, 0.18359375], [60, 0.1875], [61, 0.19140625], [62, 0.1953125], [63, 0.19921875], [65, 0.203125], [66, 0.20703125], [67, 0.2109375], [68, 0.21484375], [70, 0.21875], [71, 0.22265625], [72, 0.2265625], [73, 0.23046875], [75, 0.234375], [76, 0.23828125], [77, 0.2421875], [78, 0.24609375], [80, 0.25], [81, 0.25390625], [82, 0.2578125], [83, 0.26171875], [85, 0.265625], [86, 0.26953125], [87, 0.2734375], [88, 0.27734375], [90, 0.28125], [91, 0.28515625], [92, 0.2890625], [93, 0.29296875], [95, 0.296875], [96, 0.30078125], [97, 0.3046875], [98, 0.30859375], [100, 0.3125], [101, 0.31640625], [102, 0.3203125], [103, 0.32421875], [105, 0.328125], [106, 0.33203125], [107, 0.3359375], [108, 0.33984375], [110, 0.34375], [111, 0.34765625], [112, 0.3515625], [113, 0.35546875], [115, 0.359375], [116, 0.36328125], [117, 0.3671875], [118, 0.37109375], [120, 0.375], [121, 0.37890625], [122, 0.3828125], [123, 0.38671875], [125, 0.390625], [126, 0.39453125], [127, 0.3984375], [128, 0.40234375], [130, 0.40625], [131, 0.41015625], [132, 0.4140625], [133, 0.41796875], [135, 0.421875], [136, 0.42578125], [137, 0.4296875], [138, 0.43359375], [140, 0.4375], [141, 0.44140625], [142, 0.4453125], [143, 0.44921875], [145, 0.453125], [146, 0.45703125], [147, 0.4609375], [148, 0.46484375], [150, 0.46875], [151, 0.47265625], [152, 0.4765625], [153, 0.48046875], [155, 0.484375], [156, 0.48828125], [157, 0.4921875], [158, 0.49609375], [160, 0.5], [161, 0.50390625], [162, 0.5078125], [163, 0.51171875], [165, 0.515625], [166, 0.51953125], [167, 0.5234375], [168, 0.52734375], [170, 0.53125], [171, 0.53515625], [172, 0.5390625], [173, 0.54296875], [175, 0.546875], [176, 0.55078125], [177, 0.5546875], [178, 0.55859375], [180, 0.5625], [181, 0.56640625], [182, 0.5703125], [183, 0.57421875], [185, 0.578125], [186, 0.58203125], [187, 0.5859375], [188, 0.58984375], [190, 0.59375], [191, 0.59765625], [192, 0.6015625], [193, 0.60546875], [195, 0.609375], [196, 0.61328125], [197, 0.6171875], [198, 0.62109375], [200, 0.625], [201, 0.62890625], [202, 0.6328125], [203, 0.63671875], [205, 0.640625], [206, 0.64453125], [207, 0.6484375], [208, 0.65234375], [210, 0.65625], [211, 0.66015625], [212, 0.6640625], [213, 0.66796875], [215, 0.671875], [216, 0.67578125], [217, 0.6796875], [218, 0.68359375], [220, 0.6875], [221, 0.69140625], [222, 0.6953125], [223, 0.69921875], [225, 0.703125], [226, 0.70703125], [227, 0.7109375], [228, 0.71484375], [230, 0.71875], [231, 0.72265625], [232, 0.7265625], [233, 0.73046875], [235, 0.734375], [236, 0.73828125], [237, 0.7421875], [238, 0.74609375], [240, 0.75], [241, 0.75390625], [242, 0.7578125], [243, 0.76171875], [245, 0.765625], [246, 0.76953125], [247, 0.7734375], [248, 0.77734375], [250, 0.78125], [251, 0.78515625], [252, 0.7890625], [253, 0.79296875], [255, 0.796875], [256, 0.80078125], [257, 0.8046875], [258, 0.80859375], [260, 0.8125], [261, 0.81640625], [262, 0.8203125], [263, 0.82421875], [265, 0.828125], [266, 0.83203125], [267, 0.8359375], [268, 0.83984375], [270, 0.84375], [271, 0.84765625], [272, 0.8515625], [273, 0.85546875], [275, 0.859375], [276, 0.86328125], [277, 0.8671875], [278, 0.87109375], [280, 0.875], [281, 0.87890625], [282, 0.8828125], [283, 0.88671875], [285, 0.890625], [286, 0.89453125], [287, 0.8984375], [288, 0.90234375], [290, 0.90625], [291, 0.91015625], [292, 0.9140625], [293, 0.91796875], [295, 0.921875], [296, 0.92578125], [297, 0.9296875], [298, 0.93359375], [300, 0.9375], [301, 0.94140625], [302, 0.9453125], [303, 0.94921875], [305, 0.953125], [306, 0.95703125], [307, 0.9609375], [308, 0.96484375], [310, 0.96875], [311, 0.97265625], [312, 0.9765625], [313, 0.98046875], [315, 0.984375], [316, 0.98828125], [317, 0.9921875], [318, 0.99609375]];

},{"./../../../../lib/utilities/format/price":21,"@barchart/common-js/lang/string":37}],59:[function(require,module,exports){
const formatDate = require('./../../../../lib/utilities/format/date');

describe('when using the date formatter', () => {
  it('A date set to 2019-09-30 23:59:59 should return "09/30/19"', () => {
    expect(formatDate(new Date(2019, 8, 30, 23, 59, 59))).toEqual('09/30/19');
  });
  it('A date set to 2019-09-30 00:00:00 should return "09/30/19"', () => {
    expect(formatDate(new Date(2019, 8, 30, 0, 0, 0))).toEqual('09/30/19');
  });
});

},{"./../../../../lib/utilities/format/date":16}],60:[function(require,module,exports){
const formatDecimal = require('./../../../../lib/utilities/format/decimal');

describe('when formatting invalid values', () => {
  it('formats a null value as a zero-length string', () => {
    expect(formatDecimal(null, 0, ',')).toEqual('');
  });
  it('formats an undefined value as a zero-length string', () => {
    expect(formatDecimal(undefined, 0, ',')).toEqual('');
  });
  it('formats Number.NaN as a zero-length string', () => {
    expect(formatDecimal(Number.NaN, 0, ',')).toEqual('');
  });
});
describe('when formatting decimal values with zero decimals and thousands separator', () => {
  it('formats 0 as "0"', () => {
    expect(formatDecimal(0, 0, ',')).toEqual('0');
  });
  it('formats 0.1 as "0"', () => {
    expect(formatDecimal(0.1, 0, ',')).toEqual('0');
  });
  it('formats 0.9 as "0"', () => {
    expect(formatDecimal(0.9, 0, ',')).toEqual('1');
  });
  it('formats 377 as "377"', () => {
    expect(formatDecimal(377, 0, ',')).toEqual('377');
  });
  it('formats -377 as "-377"', () => {
    expect(formatDecimal(-377, 0, ',')).toEqual('-377');
  });
  it('formats 377.99 as "378"', () => {
    expect(formatDecimal(377.99, 0, ',')).toEqual('378');
  });
  it('formats -377.99 as "-378"', () => {
    expect(formatDecimal(-377.99, 0, ',')).toEqual('-378');
  });
  it('formats 377.49 as "377"', () => {
    expect(formatDecimal(377.49, 0, ',')).toEqual('377');
  });
  it('formats -377.49 as "-377"', () => {
    expect(formatDecimal(-377.49, 0, ',')).toEqual('-377');
  });
  it('formats 377377 as "377,377"', () => {
    expect(formatDecimal(377377, 0, ',')).toEqual('377,377');
  });
  it('formats -377377 as "-377,377"', () => {
    expect(formatDecimal(-377377, 0, ',')).toEqual('-377,377');
  });
  it('formats 377377.49 as "377,377"', () => {
    expect(formatDecimal(377377.49, 0, ',')).toEqual('377,377');
  });
  it('formats -377377.49 as "-377,377"', () => {
    expect(formatDecimal(-377377.49, 0, ',')).toEqual('-377,377');
  });
  it('formats 377377.99 as "377,378"', () => {
    expect(formatDecimal(377377.99, 0, ',')).toEqual('377,378');
  });
  it('formats -377377.99 as "-377,378"', () => {
    expect(formatDecimal(-377377.99, 0, ',')).toEqual('-377,378');
  });
});
describe('when formatting decimal values with two decimals and thousands separator', () => {
  it('formats 0 as "0.00"', () => {
    expect(formatDecimal(0, 2, ',')).toEqual('0.00');
  });
  it('formats 0.001 as "0.00"', () => {
    expect(formatDecimal(0.001, 2, ',')).toEqual('0.00');
  });
  it('formats 0.009 as "0.01"', () => {
    expect(formatDecimal(0.009, 2, ',')).toEqual('0.01');
  });
  it('formats 123.45 as "123.45"', () => {
    expect(formatDecimal(123.45, 2, ',')).toEqual('123.45');
  });
  it('formats -123.45 as "-123.45"', () => {
    expect(formatDecimal(-123.45, 2, ',')).toEqual('-123.45');
  });
  it('formats 1234.5 as "1234.50"', () => {
    expect(formatDecimal(1234.5, 2, ',')).toEqual('1,234.50');
  });
  it('formats -1234.5 as "-1234.50"', () => {
    expect(formatDecimal(-1234.5, 2, ',')).toEqual('-1,234.50');
  });
  it('formats 123456.789 as "123,456.79"', () => {
    expect(formatDecimal(123456.789, 2, ',')).toEqual('123,456.79');
  });
  it('formats -123456.789 as "-123,456.79"', () => {
    expect(formatDecimal(-123456.789, 2, ',')).toEqual('-123,456.79');
  });
});
describe('when formatting decimal values with four decimals and thousands separator', () => {
  it('formats 1234.56789 as "1,234.5679"', function () {
    expect(formatDecimal(1234.56789, 4, ',')).toEqual('1,234.5679');
  });
  it('formats -1234.56789 as "-1,234.5679"', function () {
    expect(formatDecimal(-1234.56789, 4, ',')).toEqual('-1,234.5679');
  });
});
describe('when formatting decimal values to format negative numbers with a thousands separator', () => {
  it('formats -123.456789 as "-123.45"', function () {
    expect(formatDecimal(-123.456789, 2, ',')).toEqual('-123.46');
  });
  it('formats -123456.789 as "-123,456.79', function () {
    expect(formatDecimal(-123456.789, 2, ',')).toEqual('-123,456.79');
  });
});
describe('when formatting decimal values to format with parenthesis and a thousands separator', () => {
  it('formats 123.456789 as "-23.45"', function () {
    expect(formatDecimal(123.456789, 2, ',', true)).toEqual('123.46');
  });
  it('formats -123.456789 as "-123.45"', function () {
    expect(formatDecimal(-123.456789, 2, ',', true)).toEqual('(123.46)');
  });
  it('formats 123456.789 as "-123,456.79', function () {
    expect(formatDecimal(123456.789, 2, ',', true)).toEqual('123,456.79');
  });
  it('formats -123456.789 as "-123,456.79', function () {
    expect(formatDecimal(-123456.789, 2, ',', true)).toEqual('(123,456.79)');
  });
  it('formats -3770.75, to three decimal places, as "(3,770.750)', function () {
    expect(formatDecimal(-3770.75, 3, ',', true)).toEqual('(3,770.750)');
  });
});
describe('when formatting decimal values to format with parenthesis and no thousands separator', () => {
  it('formats 123.456789 as "-23.45"', function () {
    expect(formatDecimal(123.456789, 2, '', true)).toEqual('123.46');
  });
  it('formats -123.456789 as "-123.45"', function () {
    expect(formatDecimal(-123.456789, 2, '', true)).toEqual('(123.46)');
  });
  it('formats 123456.789 as "-123,456.79', function () {
    expect(formatDecimal(123456.789, 2, '', true)).toEqual('123456.79');
  });
  it('formats -123456.789 as "-123,456.79', function () {
    expect(formatDecimal(-123456.789, 2, '', true)).toEqual('(123456.79)');
  });
});

},{"./../../../../lib/utilities/format/decimal":17}],61:[function(require,module,exports){
const buildPriceFormatter = require('./../../../../../lib/utilities/format/factories/price');

describe('When a price formatter is created', () => {
  let formatPrice;
  describe('with a decimal separator', () => {
    beforeEach(() => {
      formatPrice = buildPriceFormatter('.');
    });
    it('formats 377 (with unit code 2) as "377.000"', () => {
      expect(formatPrice(377, '2')).toEqual('377.000');
    });
    it('formats -377 (with unit code 2) as "-377.000"', () => {
      expect(formatPrice(-377, '2')).toEqual('-377.000');
    });
    it('formats 377.5 (with unit code 2) as "377.500"', () => {
      expect(formatPrice(377.5, '2')).toEqual('377.500');
    });
    it('formats 377.75 (with unit code 2) as "377.750"', () => {
      expect(formatPrice(377.75, '2')).toEqual('377.750');
    });
    it('formats 3770.75 (with unit code 2) as "3770.750"', () => {
      expect(formatPrice(3770.75, '2')).toEqual('3770.750');
    });
    it('formats 37700.75 (with unit code 2) as "37700.750"', () => {
      expect(formatPrice(37700.75, '2')).toEqual('37700.750');
    });
    it('formats 377000.75 (with unit code 2) as "377000.750"', () => {
      expect(formatPrice(377000.75, '2')).toEqual('377000.750');
    });
    it('formats 3770000.75 (with unit code 2) as "3770000.750"', () => {
      expect(formatPrice(3770000.75, '2')).toEqual('3770000.750');
    });
    it('formats 3770000 (with unit code 2) as "3770000.000"', () => {
      expect(formatPrice(3770000, '2')).toEqual('3770000.000');
    });
    it('formats 0 (with unit code 2) as "0.000"', () => {
      expect(formatPrice(0, '2')).toEqual('0.000');
    });
    it('formats undefined (with unit code 2) as zero-length string', () => {
      expect(formatPrice(undefined, '2')).toEqual('');
    });
    it('formats null (with unit code 2) as zero-length string', () => {
      expect(formatPrice(null, '2')).toEqual('');
    });
    it('formats Number.NaN (with unit code 2) as zero-length string', () => {
      expect(formatPrice(Number.NaN, '2')).toEqual('');
    });
    it('formats 0 (with unit code 8) as "0"', () => {
      expect(formatPrice(0, '8')).toEqual('0');
    });
    it('formats 1000 (with unit code 8) as "1000"', () => {
      expect(formatPrice(1000, '8')).toEqual('1000');
    });
  });
  describe('with a decimal separator, no special fractions, and a thousands separator', () => {
    beforeEach(() => {
      formatPrice = buildPriceFormatter('.', false, ',');
    });
    it('formats 377 (with unit code 2) as "377.000"', () => {
      expect(formatPrice(377, '2')).toEqual('377.000');
    });
    it('formats -377 (with unit code 2) as "-377.000"', () => {
      expect(formatPrice(-377, '2')).toEqual('-377.000');
    });
    it('formats 377.5 (with unit code 2) as "377.500"', () => {
      expect(formatPrice(377.5, '2')).toEqual('377.500');
    });
    it('formats 377.75 (with unit code 2) as "377.750"', () => {
      expect(formatPrice(377.75, '2')).toEqual('377.750');
    });
    it('formats 3770.75 (with unit code 2) as "3,770.750"', () => {
      expect(formatPrice(3770.75, '2')).toEqual('3,770.750');
    });
    it('formats 37700.75 (with unit code 2) as "37,700.750"', () => {
      expect(formatPrice(37700.75, '2')).toEqual('37,700.750');
    });
    it('formats 377000.75 (with unit code 2) as "377,000.750"', () => {
      expect(formatPrice(377000.75, '2')).toEqual('377,000.750');
    });
    it('formats -377000.75 (with unit code 2) as "-377,000.750"', () => {
      expect(formatPrice(-377000.75, '2')).toEqual('-377,000.750');
    });
    it('formats 3770000.75 (with unit code 2) as "3,770,000.750"', () => {
      expect(formatPrice(3770000.75, '2')).toEqual('3,770,000.750');
    });
    it('formats 3770000 (with unit code 2) as "3,770,000.000"', () => {
      expect(formatPrice(3770000, '2')).toEqual('3,770,000.000');
    });
    it('formats 0 (with unit code 2) as "0.000"', () => {
      expect(formatPrice(0, '2')).toEqual('0.000');
    });
    it('formats undefined (with unit code 2) as zero-length string', () => {
      expect(formatPrice(undefined, '2')).toEqual('');
    });
    it('formats null (with unit code 2) as zero-length string', () => {
      expect(formatPrice(null, '2')).toEqual('');
    });
    it('formats Number.NaN (with unit code 2) as zero-length string', () => {
      expect(formatPrice(Number.NaN, '2')).toEqual('');
    });
    it('formats 0 (with unit code 8) as "0"', () => {
      expect(formatPrice(0, '8')).toEqual('0');
    });
    it('formats 1000 (with unit code 8) as "1,000"', () => {
      expect(formatPrice(1000, '8')).toEqual('1,000');
    });
  });
  describe('with a dash separator and no special fractions', () => {
    beforeEach(() => {
      formatPrice = buildPriceFormatter('-', false);
    });
    it('formats 123 (with unit code 2) as "123-0"', () => {
      expect(formatPrice(123, '2')).toEqual('123-0');
    });
    it('formats -123 (with unit code 2) as "-123-0"', () => {
      expect(formatPrice(-123, '2')).toEqual('-123-0');
    });
    it('formats 123.5 (with unit code 2) as "123-4"', () => {
      expect(formatPrice(123.5, '2')).toEqual('123-4');
    });
    it('formats -123.5 (with unit code 2) as "-123-4"', () => {
      expect(formatPrice(-123.5, '2')).toEqual('-123-4');
    });
    it('formats 0.5 (with unit code 2) as "0-4"', () => {
      expect(formatPrice(0.5, '2')).toEqual('0-4');
    });
    it('formats 0 (with unit code 2) as "0-0"', () => {
      expect(formatPrice(0, '2')).toEqual('0-0');
    });
    it('formats zero-length string (with unit code 2) as zero-length string', () => {
      expect(formatPrice('', '2')).toEqual('');
    });
    it('formats undefined (with unit code 2) as zero-length string', () => {
      expect(formatPrice(undefined, '2')).toEqual('');
    });
    it('formats null (with unit code 2) as zero-length string', () => {
      expect(formatPrice(null, '2')).toEqual('');
    });
    it('formats Number.NaN (with unit code 2) as zero-length string', () => {
      expect(formatPrice(Number.NaN, '2')).toEqual('');
    });
    it('formats 123 (with unit code A) as "123.00"', () => {
      expect(formatPrice(123, 'A')).toEqual('123.00');
    });
    it('formats 123.5 (with unit code A) as "123.50"', () => {
      expect(formatPrice(123.5, 'A')).toEqual('123.50');
    });
    it('formats 123.555 (with unit code A) as "123.56"', () => {
      expect(formatPrice(123.555, 'A')).toEqual('123.56');
    });
  });
  describe('with a dash separator and special fractions', () => {
    beforeEach(() => {
      formatPrice = buildPriceFormatter('-', true);
    });
    it('formats 123.625 (with unit code 5) as "123-200"', () => {
      expect(formatPrice(123.625, '5')).toEqual('123-200');
    });
    it('formats -123.625 (with unit code 5) as "-123-200"', () => {
      expect(formatPrice(-123.625, '5')).toEqual('-123-200');
    });
    it('formats 123.640625 (with unit code 5) as "123-205"', () => {
      expect(formatPrice(123.640625, '5')).toEqual('123-205');
    });
    it('formats -123.640625 (with unit code 5) as "-123-205"', () => {
      expect(formatPrice(-123.640625, '5')).toEqual('-123-205');
    });
    it('formats 114.5156 (with unit code 6) as "114-165"', () => {
      expect(formatPrice(114.5156, '6')).toEqual('114-165');
    });
    it('formats 114.7891 (with unit code 6) as "114-252"', () => {
      expect(formatPrice(114.7891, '6')).toEqual('114-252');
    });
    it('formats 114.8438 (with unit code 6) as "114-270"', () => {
      expect(formatPrice(114.8438, '6')).toEqual('114-270');
    });
    it('formats 114.75 (with unit code 6) as "114-240"', () => {
      expect(formatPrice(114.75, '6')).toEqual('114-240');
    });
    it('formats 122.7031 (with unit code 5) as "122-225"', () => {
      expect(formatPrice(122.7031, '5')).toEqual('122-225');
    });
    it('formats 0 (with unit code 2) as "0"', function () {
      expect(formatPrice(0, '2')).toEqual('0-0');
    });
  });
  describe('with a tick separator and no special fractions', () => {
    beforeEach(() => {
      formatPrice = buildPriceFormatter('\'', false);
    });
    it('formats 123 (with unit code 2) as "123\'0"', () => {
      expect(formatPrice(123, '2')).toEqual('123\'0');
    });
    it('formats 123.5 (with unit code 2) as "123\'4"', () => {
      expect(formatPrice(123.5, '2')).toEqual('123\'4');
    });
    it('formats -123.5 (with unit code 2) as "-123\'4"', () => {
      expect(formatPrice(-123.5, '2')).toEqual('-123\'4');
    });
    it('formats 0.5 (with unit code 2) as "0\'4"', () => {
      expect(formatPrice(0.5, '2')).toEqual('0\'4');
    });
    it('formats -0.5 (with unit code 2) as "-0\'4"', () => {
      expect(formatPrice(-0.5, '2')).toEqual('-0\'4');
    });
    it('formats 0 (with unit code 2) as "0\'0"', () => {
      expect(formatPrice(0, '2')).toEqual('0\'0');
    });
    it('formats zero-length string (with unit code 2) as zero-length string', () => {
      expect(formatPrice('', '2')).toEqual('');
    });
    it('formats undefined (with unit code 2) as zero-length string', () => {
      expect(formatPrice(undefined, '2')).toEqual('');
    });
    it('formats null (with unit code 2) as zero-length string', () => {
      expect(formatPrice(null, '2')).toEqual('');
    });
    it('formats Number.NaN (with unit code 2) as zero-length string', () => {
      expect(formatPrice(Number.NaN, '2')).toEqual('');
    });
  });
  describe('with no separator and no special fractions', () => {
    beforeEach(() => {
      formatPrice = buildPriceFormatter('', false);
    });
    it('formats 123 (with unit code 2) as "1230"', () => {
      expect(formatPrice(123, '2')).toEqual('1230');
    });
    it('formats 123.5 (with unit code 2) as "1234"', () => {
      expect(formatPrice(123.5, '2')).toEqual('1234');
    });
    it('formats 0.5 (with unit code 2) as "4"', () => {
      expect(formatPrice(0.5, '2')).toEqual('4');
    });
    it('formats 0 (with unit code 2) as "0"', () => {
      expect(formatPrice(0, '2')).toEqual('0');
    });
    it('formats zero-length string (with unit code 2) as zero-length string', () => {
      expect(formatPrice('', '2')).toEqual('');
    });
    it('formats undefined (with unit code 2) as zero-length string', () => {
      expect(formatPrice(undefined, '2')).toEqual('');
    });
    it('formats null (with unit code 2) as zero-length string', () => {
      expect(formatPrice(null, '2')).toEqual('');
    });
    it('formats Number.NaN (with unit code 2) as zero-length string', () => {
      expect(formatPrice(Number.NaN, '2')).toEqual('');
    });
  });
  describe('with parenthetical negatives', () => {
    describe('and a decimal separator, no special fractions, and no thousands separator', () => {
      beforeEach(() => {
        formatPrice = buildPriceFormatter('.', false, '', true);
      });
      it('formats 3770.75 (with unit code 2) as "3770.750"', () => {
        expect(formatPrice(3770.75, '2')).toEqual('3770.750');
      });
      it('formats -3770.75 (with unit code 2) as "(3770.750)"', () => {
        expect(formatPrice(-3770.75, '2')).toEqual('(3770.750)');
      });
      it('formats 0 (with unit code 2) as "0.000"', () => {
        expect(formatPrice(0, '2')).toEqual('0.000');
      });
    });
    describe('with a decimal separator, no special fractions, and a thousands separator', () => {
      beforeEach(function () {
        formatPrice = buildPriceFormatter('.', false, ',', true);
      });
      it('formats 3770.75 (with unit code 2) as "3,770.750"', () => {
        expect(formatPrice(3770.75, '2')).toEqual('3,770.750');
      });
      it('formats -3770.75 (with unit code 2) as "(3,770.750)"', () => {
        expect(formatPrice(-3770.75, '2')).toEqual('(3,770.750)');
      });
      it('formats 0 (with unit code 2) as "0.000"', () => {
        expect(formatPrice(0, '2')).toEqual('0.000');
      });
    });
    describe('with a dash separator and no special fractions', () => {
      beforeEach(function () {
        formatPrice = buildPriceFormatter('-', false, '', true);
      });
      it('formats 123 (with unit code 2) as "123-0"', function () {
        expect(formatPrice(123, '2')).toEqual('123-0');
      });
      it('formats -123 (with unit code 2) as "(123-0)"', function () {
        expect(formatPrice(-123, '2')).toEqual('(123-0)');
      });
      it('formats 123.5 (with unit code 2) as "123-4"', function () {
        expect(formatPrice(123.5, '2')).toEqual('123-4');
      });
      it('formats -123.5 (with unit code 2) as "(123-4)"', function () {
        expect(formatPrice(-123.5, '2')).toEqual('(123-4)');
      });
      it('formats 0.5 (with unit code 2) as "0-4"', () => {
        expect(formatPrice(0.5, '2')).toEqual('0-4');
      });
      it('formats -0.5 (with unit code 2) as "(0-4)"', () => {
        expect(formatPrice(-0.5, '2')).toEqual('(0-4)');
      });
      it('formats 0 (with unit code 2) as "0"', function () {
        expect(formatPrice(0, '2')).toEqual('0-0');
      });
    });
    describe('with a dash separator and special fractions', () => {
      beforeEach(() => {
        formatPrice = buildPriceFormatter('-', true, '', true);
      });
      it('formats 123.625 (with unit code 5) as "123-200"', () => {
        expect(formatPrice(123.625, '5')).toEqual('123-200');
      });
      it('formats -123.625 (with unit code 5) as "(123-200)"', () => {
        expect(formatPrice(-123.625, '5')).toEqual('(123-200)');
      });
      it('formats 123.640625 (with unit code 5) as "123-205"', () => {
        expect(formatPrice(123.640625, '5')).toEqual('123-205');
      });
      it('formats -123.640625 (with unit code 5) as "(123-205)"', () => {
        expect(formatPrice(-123.640625, '5')).toEqual('(123-205)');
      });
    });
    describe('with a tick separator and no special fractions', () => {
      beforeEach(function () {
        formatPrice = buildPriceFormatter('\'', false, '', true);
      });
      it('formats 123.5 (with unit code 2) as "123\'4"', function () {
        expect(formatPrice(123.5, '2')).toEqual('123\'4');
      });
      it('formats -123.5 (with unit code 2) as "(123\'4)"', function () {
        expect(formatPrice(-123.5, '2')).toEqual('(123\'4)');
      });
      it('formats 0.5 (with unit code 2) as "0\'4"', () => {
        expect(formatPrice(0.5, '2')).toEqual('0\'4');
      });
      it('formats -0.5 (with unit code 2) as "(0\'4)"', () => {
        expect(formatPrice(-0.5, '2')).toEqual('(0\'4)');
      });
      it('formats 0 (with unit code 2) as "0\'0"', () => {
        expect(formatPrice(0, '2')).toEqual('0\'0');
      });
    });
    describe('with no separator and no special fractions', () => {
      beforeEach(function () {
        formatPrice = buildPriceFormatter('', false, '', true);
      });
      it('formats 0.5 (with unit code 2) as "4"', function () {
        expect(formatPrice(0.5, '2')).toEqual('4');
      });
      it('formats -0.5 (with unit code 2) as "(4)"', function () {
        expect(formatPrice(-0.5, '2')).toEqual('(4)');
      });
      it('formats 0 (with unit code 2) as "0"', function () {
        expect(formatPrice(0, '2')).toEqual('0');
      });
    });
  });
});

},{"./../../../../../lib/utilities/format/factories/price":18}],62:[function(require,module,exports){
const buildQuoteFormatter = require('./../../../../../lib/utilities/format/factories/quote');

describe('When a time formatter is created (without specifying the clock)', () => {
  let qf;
  beforeEach(() => {
    qf = buildQuoteFormatter();
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
        expect(qf(quote)).toEqual('00:00:00');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "12:00:00"', () => {
        expect(qf(quote)).toEqual('12:00:00');
      });
    });
    describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 7, 8, 9);
      });
      it('the formatter outputs "07:08:09"', () => {
        expect(qf(quote)).toEqual('07:08:09');
      });
    });
    describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 13, 8, 9);
      });
      it('the formatter outputs "13:08:09"', () => {
        expect(qf(quote)).toEqual('13:08:09');
      });
    });
    describe('and the quote time is 1:08:09 PM and timezone is present', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 13, 8, 9);
        quote.timezone = 'CST';
      });
      it('the formatter outputs "13:08:09"', () => {
        expect(qf(quote)).toEqual('13:08:09 CST');
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
        expect(qf(quote)).toEqual('05/03/16');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "05/03/16"', () => {
        expect(qf(quote)).toEqual('05/03/16');
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
        expect(qf(quote)).toEqual('05/03/16');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "05/03/16"', () => {
        expect(qf(quote)).toEqual('05/03/16');
      });
    });
  });
});
describe('When a time formatter is created (and a 24-hour clock is specified)', () => {
  let qf;
  beforeEach(() => {
    qf = buildQuoteFormatter(false);
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
        expect(qf(quote)).toEqual('00:00:00');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "12:00:00"', () => {
        expect(qf(quote)).toEqual('12:00:00');
      });
    });
    describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 7, 8, 9);
      });
      it('the formatter outputs "07:08:09"', () => {
        expect(qf(quote)).toEqual('07:08:09');
      });
    });
    describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 13, 8, 9);
      });
      it('the formatter outputs "13:08:09"', () => {
        expect(qf(quote)).toEqual('13:08:09');
      });
    });
    describe('and the quote time is 1:08:09 PM and a timezone is present', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 13, 8, 9);
        quote.timezone = 'EDT';
      });
      it('the formatter outputs "13:08:09"', () => {
        expect(qf(quote)).toEqual('13:08:09 EDT');
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
        expect(qf(quote)).toEqual('05/03/16');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "05/03/16"', () => {
        expect(qf(quote)).toEqual('05/03/16');
      });
    });
  });
});
describe('When a time formatter is created (and a "short" 24-hour clock is specified)', () => {
  let qf;
  beforeEach(() => {
    qf = buildQuoteFormatter(false, true);
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
        expect(qf(quote)).toEqual('00:00');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "12:00"', () => {
        expect(qf(quote)).toEqual('12:00');
      });
    });
    describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 7, 8, 9);
      });
      it('the formatter outputs "07:08"', () => {
        expect(qf(quote)).toEqual('07:08');
      });
    });
    describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 13, 8, 9);
      });
      it('the formatter outputs "13:08"', () => {
        expect(qf(quote)).toEqual('13:08');
      });
    });
    describe('and the quote time is 1:08:09 PM and a timezone is present', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 13, 8, 9);
        quote.timezone = 'EDT';
      });
      it('the formatter outputs "13:08"', () => {
        expect(qf(quote)).toEqual('13:08 EDT');
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
        expect(qf(quote)).toEqual('05/03/16');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "05/03/16"', () => {
        expect(qf(quote)).toEqual('05/03/16');
      });
    });
  });
});
describe('When a time formatter is created (and a 12-hour clock is specified)', () => {
  let qf;
  beforeEach(() => {
    qf = buildQuoteFormatter(true);
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
        expect(qf(quote)).toEqual('12:00:00 AM');
      });
    });
    describe('and the quote time is five after midnight on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 0, 5, 0);
      });
      it('the formatter outputs "12:05:00 AM"', () => {
        expect(qf(quote)).toEqual('12:05:00 AM');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "12:00:00 PM"', () => {
        expect(qf(quote)).toEqual('12:00:00 PM');
      });
    });
    describe('and the quote time is ten after noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 10, 0);
      });
      it('the formatter outputs "12:10:00 PM"', () => {
        expect(qf(quote)).toEqual('12:10:00 PM');
      });
    });
    describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 7, 8, 9);
      });
      it('the formatter outputs "07:08:09 AM"', () => {
        expect(qf(quote)).toEqual('07:08:09 AM');
      });
    });
    describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 13, 8, 9);
      });
      it('the formatter outputs "01:08:09 PM"', () => {
        expect(qf(quote)).toEqual('01:08:09 PM');
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
        expect(qf(quote)).toEqual('05/03/16');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "05/03/16"', () => {
        expect(qf(quote)).toEqual('05/03/16');
      });
    });
  });
});
describe('When a time formatter is created (and a "short" 12-hour clock is specified)', () => {
  let qf;
  beforeEach(() => {
    qf = buildQuoteFormatter(true, true);
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
        expect(qf(quote)).toEqual('12:00A');
      });
    });
    describe('and the quote time is five after midnight on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 0, 5, 0);
      });
      it('the formatter outputs "12:05A"', () => {
        expect(qf(quote)).toEqual('12:05A');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "12:00P"', () => {
        expect(qf(quote)).toEqual('12:00P');
      });
    });
    describe('and the quote time is ten after noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 10, 0);
      });
      it('the formatter outputs "12:10P"', () => {
        expect(qf(quote)).toEqual('12:10P');
      });
    });
    describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 7, 8, 9);
      });
      it('the formatter outputs "07:08A"', () => {
        expect(qf(quote)).toEqual('07:08A');
      });
    });
    describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 13, 8, 9);
      });
      it('the formatter outputs "01:08P"', () => {
        expect(qf(quote)).toEqual('01:08P');
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
        expect(qf(quote)).toEqual('05/03/16');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "05/03/16"', () => {
        expect(qf(quote)).toEqual('05/03/16');
      });
    });
  });
});

},{"./../../../../../lib/utilities/format/factories/quote":19}],63:[function(require,module,exports){
const formatFraction = require('./../../../../lib/utilities/format/fraction');

describe('when formatting in halves of thirty-seconds', () => {
  it('formats 0.984375 as 0-315', () => {
    expect(formatFraction(0.984375, 320, 3, '-')).toEqual('0-315');
  });
});
describe('when formatting in quarters of thirty-seconds', () => {
  it('formats 0.9921875 as 0-317', () => {
    expect(formatFraction(0.9921875, 320, 3, '-')).toEqual('0-317');
  });
});
describe('when formatting in sixty-fourths', () => {
  it('formats 0.984375 as 0-315', () => {
    expect(formatFraction(0.984375, 64, 2, '-')).toEqual('0-63');
  });
});
describe('when formatting in halves of sixty-fourths', () => {
  it('formats 0.9921875 as 0-317', () => {
    expect(formatFraction(0.9921875, 640, 3, '-')).toEqual('0-635');
  });
});

},{"./../../../../lib/utilities/format/fraction":20}],64:[function(require,module,exports){
const formatPrice = require('./../../../../lib/utilities/format/price');
/*
describe('benchmark', () => {
	it('run a million times', () => {
		console.time('benchmark');

		for (let i = 0; i < 1000000; i++) {
			// const x = formatPrice(0, '2', '.');
			// const x = formatPrice(123.5, '2', '-');
		}

		console.timeEnd('benchmark');
	});
});
*/


describe('when invalid prices are formatted (regardless of other settings)', () => {
  it('formats an undefined value as a zero-length string', () => {
    expect(formatPrice()).toEqual('');
  });
  it('formats a null value as a zero-length string', () => {
    expect(formatPrice(null)).toEqual('');
  });
  it('formats a Number.NaN value as a zero-length string', () => {
    expect(formatPrice(Number.NaN)).toEqual('');
  });
  it('formats a zero-length string as a zero-length string', () => {
    expect(formatPrice('')).toEqual('');
  });
  it('formats the string "bob" as a zero-length string', () => {
    expect(formatPrice('bob')).toEqual('');
  });
  it('formats the string "123" as a zero-length string', () => {
    expect(formatPrice('123')).toEqual('');
  });
  it('formats an empty object as a zero-length string', () => {
    expect(formatPrice({})).toEqual('');
  });
});
describe('when valid prices are formatted', () => {
  describe('with a unit code of "A"', () => {
    describe('with a decimal fraction separator', () => {
      it('formats 0 as "0.00"', () => {
        expect(formatPrice(0, 'A', '.', false)).toEqual('0.00');
      });
      it('formats 123 as "123.00"', () => {
        expect(formatPrice(123, 'A', '.', false)).toEqual('123.00');
      });
      it('formats 123.5 as "123.50"', () => {
        expect(formatPrice(123.5, 'A', '.', false)).toEqual('123.50');
      });
      it('formats 123.555 as "123.56"', () => {
        expect(formatPrice(123.555, 'A', '.', false)).toEqual('123.56');
      });
    });
    describe('with a dash fraction separator', () => {
      it('formats 0 as "0.00"', () => {
        expect(formatPrice(0, 'A', '-', false)).toEqual('0.00');
      });
      it('formats 123 as "123.00"', () => {
        expect(formatPrice(123, 'A', '-', false)).toEqual('123.00');
      });
      it('formats 123.5 as "123.50"', () => {
        expect(formatPrice(123.5, 'A', '-', false)).toEqual('123.50');
      });
      it('formats 123.555 as "123.56"', () => {
        expect(formatPrice(123.555, 'A', '-', false)).toEqual('123.56');
      });
    });
  });
  describe('with a unit code of "2"', () => {
    describe('with default arguments', () => {
      it('formats 0 as "0.000"', () => {
        expect(formatPrice(0, '2')).toEqual('0.000');
      });
      it('formats 377 as "377.000"', () => {
        expect(formatPrice(377, '2')).toEqual('377.000');
      });
    });
    describe('with a dash fraction separator', () => {
      it('formats 123.0 as "123-0"', () => {
        expect(formatPrice(123.0, '2', '-')).toEqual('123-0');
      });
      it('formats 123.5 as "123-4"', () => {
        expect(formatPrice(123.5, '2', '-')).toEqual('123-4');
      });
    });
    describe('with a decimal fraction separator', () => {
      it('formats 0 as "0.000"', () => {
        expect(formatPrice(0, '2', '.')).toEqual('0.000');
      });
      it('formats 9.5432 as "9.543"', () => {
        expect(formatPrice(9.5432, '2', '.')).toEqual('9.543');
      });
      it('formats 377 as "377.000"', () => {
        expect(formatPrice(377, '2', '.')).toEqual('377.000');
      });
      it('formats -377 as "-377.000"', () => {
        expect(formatPrice(-377, '2', '.')).toEqual('-377.000');
      });
      it('formats 377.5 as "377.500"', () => {
        expect(formatPrice(377.5, '2', '.')).toEqual('377.500');
      });
      it('formats 377.75 as "377.750"', () => {
        expect(formatPrice(377.75, '2', '.')).toEqual('377.750');
      });
      it('formats 3770.75 as "3770.750"', () => {
        expect(formatPrice(3770.75, '2', '.')).toEqual('3770.750');
      });
      it('formats 37700.75 as "37700.750"', () => {
        expect(formatPrice(37700.75, '2', '.')).toEqual('37700.750');
      });
      it('formats 377000.75 as "377000.750"', () => {
        expect(formatPrice(377000.75, '2', '.')).toEqual('377000.750');
      });
      it('formats 3770000.75 as "3770000.750"', () => {
        expect(formatPrice(3770000.75, '2', '.')).toEqual('3770000.750');
      });
      it('formats 3770000 as "3770000.000"', () => {
        expect(formatPrice(3770000, '2', '.')).toEqual('3770000.000');
      });
    });
    describe('with a decimal fraction separator and a thousands separator', () => {
      it('formats 0 as "0.000"', () => {
        expect(formatPrice(0, '2', '.', false, ',')).toEqual('0.000');
      });
      it('formats 377 as "377.000"', () => {
        expect(formatPrice(377, '2', '.', false, ',')).toEqual('377.000');
      });
      it('formats -377 as "-377.000"', () => {
        expect(formatPrice(-377, '2', '.', false, ',')).toEqual('-377.000');
      });
      it('formats 377.5 as "377.500"', () => {
        expect(formatPrice(377.5, '2', '.', false, ',')).toEqual('377.500');
      });
      it('formats 377.75 as "377.750"', () => {
        expect(formatPrice(377.75, '2', '.', false, ',')).toEqual('377.750');
      });
      it('formats 3770.75 as "3,770.750"', () => {
        expect(formatPrice(3770.75, '2', '.', false, ',')).toEqual('3,770.750');
      });
      it('formats 37700.75 as "37,700.750"', () => {
        expect(formatPrice(37700.75, '2', '.', false, ',')).toEqual('37,700.750');
      });
      it('formats 377000.75 as "377,000.750"', () => {
        expect(formatPrice(377000.75, '2', '.', false, ',')).toEqual('377,000.750');
      });
      it('formats -377000.75 as "-377,000.750"', () => {
        expect(formatPrice(-377000.75, '2', '.', false, ',')).toEqual('-377,000.750');
      });
      it('formats 3770000.75 as "3,770,000.750"', () => {
        expect(formatPrice(3770000.75, '2', '.', false, ',')).toEqual('3,770,000.750');
      });
      it('formats 3770000 as "3,770,000.000"', () => {
        expect(formatPrice(3770000, '2', '.', false, ',')).toEqual('3,770,000.000');
      });
    });
    describe('with a decimal fraction separator and a thousands separator and parenthetical negatives', () => {
      it('formats 3770.75 as "3,770.750"', () => {
        expect(formatPrice(3770.75, '2', '.', false, ',', true)).toEqual('3,770.750');
      });
      it('formats -3770.75 as "(3,770.750)"', () => {
        expect(formatPrice(-3770.75, '2', '.', false, ',', true)).toEqual('(3,770.750)');
      });
      it('formats 0 as "0.000"', () => {
        expect(formatPrice(0, '2', '.', false, ',', true)).toEqual('0.000');
      });
    });
    describe('with a decimal fraction separator and parenthetical negatives', () => {
      it('formats 3770.75 as "3770.750"', () => {
        expect(formatPrice(3770.75, '2', '.', false, '', true)).toEqual('3770.750');
      });
      it('formats -3770.75 as "(3770.750)"', () => {
        expect(formatPrice(-3770.75, '2', '.', false, '', true)).toEqual('(3770.750)');
      });
      it('formats 0 as "0.000"', () => {
        expect(formatPrice(0, '2', '.', false, '', true)).toEqual('0.000');
      });
    });
    describe('with a dash fraction separator', () => {
      it('formats 9.5432 as "9.543"', () => {
        expect(formatPrice(9.5432, '2', '-')).toEqual('9-4');
      });
      it('formats 123 as "123-0"', () => {
        expect(formatPrice(123, '2', '-')).toEqual('123-0');
      });
      it('formats -123 as "-123-0"', () => {
        expect(formatPrice(-123, '2', '-')).toEqual('-123-0');
      });
      it('formats 123.5 as "123-4"', () => {
        expect(formatPrice(123.5, '2', '-')).toEqual('123-4');
      });
      it('formats -123.5 as "-123-4"', () => {
        expect(formatPrice(-123.5, '2', '-')).toEqual('-123-4');
      });
      it('formats 0.5 as "0-4"', () => {
        expect(formatPrice(0.5, '2', '-')).toEqual('0-4');
      });
      it('formats 0 as "0-0"', () => {
        expect(formatPrice(0, '2', '-')).toEqual('0-0');
      });
    });
    describe('with a dash fraction separator and parenthetical negatives', () => {
      it('formats 123 as "123-0"', () => {
        expect(formatPrice(123, '2', '-', false, '', true)).toEqual('123-0');
      });
      it('formats -123 as "(123-0)"', () => {
        expect(formatPrice(-123, '2', '-', false, '', true)).toEqual('(123-0)');
      });
      it('formats 123.5 as "123-4"', () => {
        expect(formatPrice(123.5, '2', '-', false, '', true)).toEqual('123-4');
      });
      it('formats -123.5 as "(123-4)"', () => {
        expect(formatPrice(-123.5, '2', '-', false, '', true)).toEqual('(123-4)');
      });
      it('formats 0.5 as "0-4"', () => {
        expect(formatPrice(0.5, '2', '-', false, '', true)).toEqual('0-4');
      });
      it('formats -0.5 as "(0-4)"', () => {
        expect(formatPrice(-0.5, '2', '-', false, '', true)).toEqual('(0-4)');
      });
      it('formats 0 as "0"', () => {
        expect(formatPrice(0, '2', '-', false, '', true)).toEqual('0-0');
      });
    });
    describe('with a tick separator', () => {
      it('formats 123 as "123\'0"', () => {
        expect(formatPrice(123, '2', '\'')).toEqual('123\'0');
      });
      it('formats 123.5 as "123\'4"', () => {
        expect(formatPrice(123.5, '2', '\'')).toEqual('123\'4');
      });
      it('formats -123.5 as "-123\'4"', () => {
        expect(formatPrice(-123.5, '2', '\'')).toEqual('-123\'4');
      });
      it('formats 0.5 as "0\'4"', () => {
        expect(formatPrice(0.5, '2', '\'')).toEqual('0\'4');
      });
      it('formats -0.5 as "-0\'4"', () => {
        expect(formatPrice(-0.5, '2', '\'')).toEqual('-0\'4');
      });
      it('formats 0 as "0\'0"', () => {
        expect(formatPrice(0, '2', '\'')).toEqual('0\'0');
      });
    });
    describe('with a tick separator and parenthetical negatives', () => {
      it('formats 123.5 as "123\'4"', () => {
        expect(formatPrice(123.5, '2', '\'', false, '', true)).toEqual('123\'4');
      });
      it('formats -123.5 as "(123\'4)"', () => {
        expect(formatPrice(-123.5, '2', '\'', false, '', true)).toEqual('(123\'4)');
      });
      it('formats 0.5 as "0\'4"', () => {
        expect(formatPrice(0.5, '2', '\'', false, '', true)).toEqual('0\'4');
      });
      it('formats -0.5 as "(0\'4)"', () => {
        expect(formatPrice(-0.5, '2', '\'', false, '', true)).toEqual('(0\'4)');
      });
      it('formats 0 as "0\'0"', () => {
        expect(formatPrice(0, '2', '\'', false, '', true)).toEqual('0\'0');
      });
    });
    describe('with a zero-length separator', () => {
      it('formats 123 as "1230"', () => {
        expect(formatPrice(123, '2', '')).toEqual('1230');
      });
      it('formats 123.5 as "1234"', () => {
        expect(formatPrice(123.5, '2', '')).toEqual('1234');
      });
      it('formats 0.5 as "4"', () => {
        expect(formatPrice(0.5, '2', '')).toEqual('4');
      });
      it('formats 0 as "0"', () => {
        expect(formatPrice(0, '2', '')).toEqual('0');
      });
    });
    describe('with a zero-length separator and parenthetical negatives', () => {
      describe('with no separator and no special fractions', () => {
        it('formats 0.5 as "4"', () => {
          expect(formatPrice(0.5, '2', '', false, '', true)).toEqual('4');
        });
        it('formats -0.5 as "(4)"', () => {
          expect(formatPrice(-0.5, '2', '', false, '', true)).toEqual('(4)');
        });
        it('formats 0 as "0"', () => {
          expect(formatPrice(0, '2', '', false, '', true)).toEqual('0');
        });
      });
    });
  });
  describe('with a unit code of "3"', () => {
    describe('with a dash fraction separator', () => {
      it('formats 123.0 as "123-00"', () => {
        expect(formatPrice(123.0, '3', '-')).toEqual('123-00');
      });
      it('formats 123.5 as "123-4"', () => {
        expect(formatPrice(123.5, '3', '-')).toEqual('123-08');
      });
    });
  });
  describe('with a unit code of "4"', () => {
    describe('with a dash fraction separator', () => {
      it('formats 123.0 as "123-00"', () => {
        expect(formatPrice(123.0, '4', '-')).toEqual('123-00');
      });
      it('formats 123.5 as "123-4"', () => {
        expect(formatPrice(123.5, '4', '-')).toEqual('123-16');
      });
    });
  });
  describe('with a unit code of "5"', () => {
    describe('with a dash fraction separator', () => {
      it('formats 123.0 as "123-00"', () => {
        expect(formatPrice(123.0, '5', '-')).toEqual('123-00');
      });
      it('formats 123.5 as "123-32"', () => {
        expect(formatPrice(123.5, '5', '-')).toEqual('123-32');
      });
    });
    describe('with a dash fraction separator and special fractions', () => {
      it('formats 123.625 as "123-200"', () => {
        expect(formatPrice(123.625, '5', '-', true)).toEqual('123-200');
      });
      it('formats -123.625 as "-123-200"', () => {
        expect(formatPrice(-123.625, '5', '-', true)).toEqual('-123-200');
      });
      it('formats 123.640625 as "123-205"', () => {
        expect(formatPrice(123.640625, '5', '-', true)).toEqual('123-205');
      });
      it('formats -123.640625 as "-123-205"', () => {
        expect(formatPrice(-123.640625, '5', '-', true)).toEqual('-123-205');
      });
      it('formats 122.7031 as "122-225"', () => {
        expect(formatPrice(122.7031, '5', '-', true)).toEqual('122-225');
      });
      it('formats 0 as "0-000"', () => {
        expect(formatPrice(0, '5', '-', true)).toEqual('0-000');
      });
    });
    describe('with a dash fraction separator and special fractions and parenthetical negatives', () => {
      it('formats 123.625 as "123-200"', () => {
        expect(formatPrice(123.625, '5', '-', true, '', true)).toEqual('123-200');
      });
      it('formats -123.625 as "(123-200)"', () => {
        expect(formatPrice(-123.625, '5', '-', true, '', true)).toEqual('(123-200)');
      });
      it('formats 123.640625 as "123-205"', () => {
        expect(formatPrice(123.640625, '5', '-', true, '', true)).toEqual('123-205');
      });
      it('formats -123.640625 as "(123-205)"', () => {
        expect(formatPrice(-123.640625, '5', '-', true, '', true)).toEqual('(123-205)');
      });
    });
  });
  describe('with a unit code of "6"', () => {
    describe('with a dash fraction separator', () => {
      it('formats 123.0 as "123-000"', () => {
        expect(formatPrice(123.0, '6', '-')).toEqual('123-000');
      });
      it('formats 123.5 as "123-064"', () => {
        expect(formatPrice(123.5, '6', '-')).toEqual('123-064');
      });
    });
    describe('with a dash fraction separator and special fractions', () => {
      it('formats 114.5156 as "114-165"', () => {
        expect(formatPrice(114.5156, '6', '-', true)).toEqual('114-165');
      });
      it('formats 114.7891 as "114-252"', () => {
        expect(formatPrice(114.7891, '6', '-', true)).toEqual('114-252');
      });
      it('formats 114.8438 as "114-270"', () => {
        expect(formatPrice(114.8438, '6', '-', true)).toEqual('114-270');
      });
      it('formats 114.75 as "114-240"', () => {
        expect(formatPrice(114.75, '6', '-', true)).toEqual('114-240');
      });
      it('formats 0 as "0-000"', () => {
        expect(formatPrice(0, '6', '-', true)).toEqual('0-000');
      });
    });
  });
  describe('with a unit code of "7"', () => {
    describe('with a dash fraction separator', () => {
      it('formats 123.0 as "123-000"', () => {
        expect(formatPrice(123.0, '7', '-')).toEqual('123-000');
      });
      it('formats 123.5 as "123-128"', () => {
        expect(formatPrice(123.5, '7', '-')).toEqual('123-128');
      });
    });
  });
  describe('with a unit code of "8"', () => {
    describe('with a decimal fraction separator', () => {
      it('formats 0 as "0"', () => {
        expect(formatPrice(0, '8', '.')).toEqual('0');
      });
      it('formats 1000 as "1000"', () => {
        expect(formatPrice(1000, '8', '.')).toEqual('1000');
      });
    });
    describe('with a decimal separator and a thousands separator', () => {
      it('formats 0 as "0"', () => {
        expect(formatPrice(0, '8', '.', false, ',')).toEqual('0');
      });
      it('formats 1000 as "1,000"', () => {
        expect(formatPrice(1000, '8', '.', false, ',')).toEqual('1,000');
      });
    });
  });
  describe('with an invalid unit code', () => {
    it('formats 377 as "" (when unit code is omitted)', () => {
      expect(formatPrice(377)).toEqual('');
    });
    it('formats 377 as "" (when unit code is null)', () => {
      expect(formatPrice(377, null)).toEqual('');
    });
    it('formats 377 as "" (when unit code is numeric)', () => {
      expect(formatPrice(377, 2)).toEqual('');
    });
    it('formats 377 as "" (when unit code has multiple characters are used)', () => {
      expect(formatPrice(377, '999')).toEqual('');
    });
    it('formats 377 as "" (when unit code is a a single character -- but an invalid unit code -- "1")', () => {
      expect(formatPrice(377, '1')).toEqual('');
    });
    it('formats 377 as "" (when unit code is a single character -- but an invalid unit code -- "G")', () => {
      expect(formatPrice(377, 'G')).toEqual('');
    });
    it('formats 377 as "" (when unit code is a single character -- but an invalid unit code -- "a")', () => {
      expect(formatPrice(377, 'a')).toEqual('');
    });
  });
});

},{"./../../../../lib/utilities/format/price":21}],65:[function(require,module,exports){
const formatQuote = require('./../../../../lib/utilities/format/quote');

describe('When a quote formatter is used (without specifying the clock)', () => {
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
        expect(formatQuote(quote)).toEqual('00:00:00');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "12:00:00"', () => {
        expect(formatQuote(quote)).toEqual('12:00:00');
      });
    });
    describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 7, 8, 9);
      });
      it('the formatter outputs "07:08:09"', () => {
        expect(formatQuote(quote)).toEqual('07:08:09');
      });
    });
    describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 13, 8, 9);
      });
      it('the formatter outputs "13:08:09"', () => {
        expect(formatQuote(quote)).toEqual('13:08:09');
      });
    });
    describe('and the quote time is 1:08:09 PM and timezone is present', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 13, 8, 9);
        quote.timezone = 'CST';
      });
      it('the formatter outputs "13:08:09"', () => {
        expect(formatQuote(quote)).toEqual('13:08:09 CST');
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
        expect(formatQuote(quote)).toEqual('05/03/16');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "05/03/16"', () => {
        expect(formatQuote(quote)).toEqual('05/03/16');
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
        expect(formatQuote(quote)).toEqual('05/03/16');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "05/03/16"', () => {
        expect(formatQuote(quote)).toEqual('05/03/16');
      });
    });
  });
});
describe('When a quote formatter is used (and a 24-hour clock is specified)', () => {
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
        expect(formatQuote(quote, false)).toEqual('00:00:00');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "12:00:00"', () => {
        expect(formatQuote(quote, false)).toEqual('12:00:00');
      });
    });
    describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 7, 8, 9);
      });
      it('the formatter outputs "07:08:09"', () => {
        expect(formatQuote(quote, false)).toEqual('07:08:09');
      });
    });
    describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 13, 8, 9);
      });
      it('the formatter outputs "13:08:09"', () => {
        expect(formatQuote(quote, false)).toEqual('13:08:09');
      });
    });
    describe('and the quote time is 1:08:09 PM and a timezone is present', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 13, 8, 9);
        quote.timezone = 'EDT';
      });
      it('the formatter outputs "13:08:09"', () => {
        expect(formatQuote(quote, false)).toEqual('13:08:09 EDT');
      });
    });
  });
  describe('and a quote formatter is used (with with a "flag" and a "lastPrice" value)', () => {
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
        expect(formatQuote(quote, false)).toEqual('05/03/16');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "05/03/16"', () => {
        expect(formatQuote(quote, false)).toEqual('05/03/16');
      });
    });
  });
});
describe('When a time formatter is used (and a "short" 24-hour clock is specified)', () => {
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
        expect(formatQuote(quote, false, true)).toEqual('00:00');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "12:00"', () => {
        expect(formatQuote(quote, false, true)).toEqual('12:00');
      });
    });
    describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 7, 8, 9);
      });
      it('the formatter outputs "07:08"', () => {
        expect(formatQuote(quote, false, true)).toEqual('07:08');
      });
    });
    describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 13, 8, 9);
      });
      it('the formatter outputs "13:08"', () => {
        expect(formatQuote(quote, false, true)).toEqual('13:08');
      });
    });
    describe('and the quote time is 1:08:09 PM and a timezone is present', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 13, 8, 9);
        quote.timezone = 'EDT';
      });
      it('the formatter outputs "13:08"', () => {
        expect(formatQuote(quote, false, true)).toEqual('13:08 EDT');
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
        expect(formatQuote(quote, false, true)).toEqual('05/03/16');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "05/03/16"', () => {
        expect(formatQuote(quote, false, true)).toEqual('05/03/16');
      });
    });
  });
});
describe('When a time formatter is created (and a 12-hour clock is specified)', () => {
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
        expect(formatQuote(quote, true)).toEqual('12:00:00 AM');
      });
    });
    describe('and the quote time is five after midnight on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 0, 5, 0);
      });
      it('the formatter outputs "12:05:00 AM"', () => {
        expect(formatQuote(quote, true)).toEqual('12:05:00 AM');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "12:00:00 PM"', () => {
        expect(formatQuote(quote, true)).toEqual('12:00:00 PM');
      });
    });
    describe('and the quote time is ten after noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 10, 0);
      });
      it('the formatter outputs "12:10:00 PM"', () => {
        expect(formatQuote(quote, true)).toEqual('12:10:00 PM');
      });
    });
    describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 7, 8, 9);
      });
      it('the formatter outputs "07:08:09 AM"', () => {
        expect(formatQuote(quote, true)).toEqual('07:08:09 AM');
      });
    });
    describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 13, 8, 9);
      });
      it('the formatter outputs "01:08:09 PM"', () => {
        expect(formatQuote(quote, true)).toEqual('01:08:09 PM');
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
        expect(formatQuote(quote, true)).toEqual('05/03/16');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "05/03/16"', () => {
        expect(formatQuote(quote, true)).toEqual('05/03/16');
      });
    });
  });
});
describe('When a time formatter is created (and a "short" 12-hour clock is specified)', () => {
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
        expect(formatQuote(quote, true, true)).toEqual('12:00A');
      });
    });
    describe('and the quote time is five after midnight on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 0, 5, 0);
      });
      it('the formatter outputs "12:05A"', () => {
        expect(formatQuote(quote, true, true)).toEqual('12:05A');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "12:00P"', () => {
        expect(formatQuote(quote, true, true)).toEqual('12:00P');
      });
    });
    describe('and the quote time is ten after noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 10, 0);
      });
      it('the formatter outputs "12:10P"', () => {
        expect(formatQuote(quote, true, true)).toEqual('12:10P');
      });
    });
    describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 7, 8, 9);
      });
      it('the formatter outputs "07:08A"', () => {
        expect(formatQuote(quote, true, true)).toEqual('07:08A');
      });
    });
    describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 13, 8, 9);
      });
      it('the formatter outputs "01:08P"', () => {
        expect(formatQuote(quote, true, true)).toEqual('01:08P');
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
        expect(formatQuote(quote, true, true)).toEqual('05/03/16');
      });
    });
    describe('and the quote time is noon on May 3, 2016', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 12, 0, 0);
      });
      it('the formatter outputs "05/03/16"', () => {
        expect(formatQuote(quote, true, true)).toEqual('05/03/16');
      });
    });
  });
});

},{"./../../../../lib/utilities/format/quote":22}],66:[function(require,module,exports){
const cmdtyView = require('./../../../../../lib/utilities/format/specialized/cmdtyView');

const Profile = require('./../../../../../lib/marketState/Profile');

const ZBM2_1500C = new Profile('ZBM2|1500C', '30-Year T-Bond', 'CBOT', '5', 1000, 1);
const ZNM2_1230C = new Profile('ZNM2|1230C', '10-Year T-Note', 'CBOT', '5', 1000, 1);
const ZTM2_1060C = new Profile('ZTM2|1060C', '2-Year T-Note', 'CBOT', '6', 2000, 1);
const ZFM2_1147C = new Profile('ZFM2|1147C', '5-Year T-Note', 'CBOT', '6', 1000, 1);
describe('when formatting prices for a ZB options', () => {
  it('formats 0.5 as 0-32 (using sixty-fourths)', () => {
    expect(cmdtyView(0.5, ZBM2_1500C.unitCode, ZBM2_1500C)).toEqual('0-32');
  });
  it('formats 0.984375 as 0-63 (using sixty-fourths)', () => {
    expect(cmdtyView(0.984375, ZBM2_1500C.unitCode, ZBM2_1500C)).toEqual('0-63');
  });
});
describe('when formatting prices for a ZN option', () => {
  it('formats 0.5 as 0-32 (using sixty-fourths)', () => {
    expect(cmdtyView(0.5, ZNM2_1230C.unitCode, ZNM2_1230C)).toEqual('0-32');
  });
  it('formats 0.984375 as 0-63 (using sixty-fourths)', () => {
    expect(cmdtyView(0.984375, ZNM2_1230C.unitCode, ZNM2_1230C)).toEqual('0-63');
  });
});
describe('when formatting prices for a ZT options', () => {
  it('formats 0.5 as 0-320 (using halves of sixty-fourths)', () => {
    expect(cmdtyView(0.5, ZTM2_1060C.unitCode, ZTM2_1060C)).toEqual('0-320');
  });
  it('formats 0.9921875 as 0-635 (using halves of sixty-fourths)', () => {
    expect(cmdtyView(0.9921875, ZTM2_1060C.unitCode, ZTM2_1060C)).toEqual('0-635');
  });
});
describe('when formatting prices for a ZF options', () => {
  it('formats 0.5 as 0-320 (using halves of sixty-fourths)', () => {
    expect(cmdtyView(0.5, ZFM2_1147C.unitCode, ZFM2_1147C)).toEqual('0-320');
  });
  it('formats 0.9921875 as 0-635 (using halves of sixty-fourths)', () => {
    expect(cmdtyView(0.9921875, ZFM2_1147C.unitCode, ZFM2_1147C)).toEqual('0-635');
  });
});

},{"./../../../../../lib/marketState/Profile":5,"./../../../../../lib/utilities/format/specialized/cmdtyView":23}],67:[function(require,module,exports){
const formatSymbol = require('./../../../../lib/utilities/format/symbol');

describe('When a lowercase string is formatted as a symbol', () => {
  let originalSymbol;
  let formattedSymbol;
  beforeEach(() => {
    formattedSymbol = formatSymbol(originalSymbol = 'aapl');
  });
  it('The result should only contain uppercase letters', () => {
    expect(formattedSymbol).toEqual('AAPL');
  });
});
describe('When an uppercase string is formatted as a symbol', () => {
  let originalSymbol;
  let formattedSymbol;
  beforeEach(() => {
    formattedSymbol = formatSymbol(originalSymbol = 'AAPL');
  });
  it('The result should only contain uppercase letters', () => {
    expect(formattedSymbol).toEqual('AAPL');
  });
});
describe('When a mixed case string is formatted as a symbol', () => {
  let originalSymbol;
  let formattedSymbol;
  beforeEach(() => {
    formattedSymbol = formatSymbol(originalSymbol = 'aApL');
  });
  it('The result should only contain uppercase letters', () => {
    expect(formattedSymbol).toEqual('AAPL');
  });
});
describe('When a zero-length string is formatted as a symbol', () => {
  let originalSymbol;
  let formattedSymbol;
  beforeEach(() => {
    formattedSymbol = formatSymbol(originalSymbol = '');
  });
  it('The result should be the original zero-length string', () => {
    expect(formattedSymbol).toEqual(originalSymbol);
  });
});
describe('When a string with numbers is formatted as a symbol', () => {
  let originalSymbol;
  let formattedSymbol;
  beforeEach(() => {
    formattedSymbol = formatSymbol(originalSymbol = 'esm16');
  });
  it('The result should only contain uppercase letters', () => {
    expect(formattedSymbol).toEqual('ESM16');
  });
});
describe('When a number is formatted as a symbol', () => {
  let originalSymbol;
  let formattedSymbol;
  beforeEach(() => {
    formattedSymbol = formatSymbol(originalSymbol = 1);
  });
  it('The result should be a number', () => {
    expect(typeof formattedSymbol).toEqual('number');
  });
  it('The result should the original number', () => {
    expect(formattedSymbol).toEqual(originalSymbol);
  });
});
describe('When an undefined value is formatted as a symbol', () => {
  let originalSymbol;
  let formattedSymbol;
  beforeEach(() => {
    formattedSymbol = formatSymbol(originalSymbol = undefined);
  });
  it('The result should be a undefined', () => {
    expect(typeof formattedSymbol).toEqual('undefined');
  });
});
describe('When an null value is formatted', () => {
  let originalSymbol;
  let formattedSymbol;
  beforeEach(() => {
    formattedSymbol = formatSymbol(originalSymbol = null);
  });
  it('The result should be null', () => {
    expect(formattedSymbol).toEqual(null);
  });
});

},{"./../../../../lib/utilities/format/symbol":24}],68:[function(require,module,exports){

},{}],69:[function(require,module,exports){
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
    }); // 2021/08/05, BRI. We are now reading from the previous session (instead of the combined session).

    /*
    it('the "previousPrice" should come from the "combined" session', () => {
    	expect(x.previousPrice).toEqual(15.59);
    });
    */

    it('the "previousPrice" should come from the "previous" session', () => {
      expect(x.previousPrice).toEqual(15.49);
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
    it('the "symbol" should be "TSLA"', () => {
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
  describe('for a 2,6 message for $M1LX', () => {
    let x;
    beforeEach(() => {
      x = parseMessage('\x012$M1LX,6\x02AI10,20200,20500,20100,20400,,,,,,,,,,540600,8 \x03');
    });
    it('the "record" should be "2"', () => {
      expect(x.record).toEqual('2');
    });
    it('the "subrecord" should be "6"', () => {
      expect(x.subrecord).toEqual('6');
    });
    it('the "symbol" should be "$M1LX"', () => {
      expect(x.symbol).toEqual('$M1LX');
    });
    it('the "type" should be "OHLC"', () => {
      expect(x.type).toEqual('OHLC');
    });
    it('the "openPrice" should be "202.00"', () => {
      expect(x.openPrice).toEqual(202.00);
    });
    it('the "highPrice" should be "205.00"', () => {
      expect(x.highPrice).toEqual(205.00);
    });
    it('the "lowPrice" should be "201.00"', () => {
      expect(x.lowPrice).toEqual(201.00);
    });
    it('the "lastPrice" should be "204.00"', () => {
      expect(x.lastPrice).toEqual(204.00);
    });
    it('the "volume" should be "540600"', () => {
      expect(x.volume).toEqual(540600);
    });
    it('the "day" should be "8"', () => {
      expect(x.day).toEqual('8');
    });
    it('the "session" should be " "', () => {
      expect(x.session).toEqual(' ');
    });
  });
});

},{"../../../../../lib/utilities/parse/ddf/message":26}],70:[function(require,module,exports){
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

},{"../../../../../lib/utilities/parse/ddf/value":28}],71:[function(require,module,exports){
const parsePrice = require('../../../../lib/utilities/parse/price');

describe('when parsing invalid values', () => {
  'use strict';

  describe('with a unit code of "A"', () => {
    it('parses a zero-length string as Number.NaN', () => {
      expect(parsePrice('', 'A')).toEqual(Number.NaN);
    });
    it('parses a non-numeric string as Number.NaN', () => {
      expect(parsePrice('bob', 'A')).toEqual(Number.NaN);
    });
    it('parses an undefined value as Number.NaN', () => {
      expect(parsePrice(undefined, 'A')).toEqual(Number.NaN);
    });
    it('parses a null value as Number.NaN', () => {
      expect(parsePrice(null, 'A')).toEqual(Number.NaN);
    });
    it('parses "123A456" as Number.NaN', () => {
      expect(parsePrice('123A456', 'A')).toEqual(Number.NaN);
    });
  });
  describe('with a unit code of "2"', () => {
    it('parses a zero-length string as Number.NaN', () => {
      expect(parsePrice('', '2')).toEqual(Number.NaN);
    });
    it('parses a non-numeric string as Number.NaN', () => {
      expect(parsePrice('bob', '2')).toEqual(Number.NaN);
    });
    it('parses an undefined value as Number.NaN', () => {
      expect(parsePrice(undefined, '2')).toEqual(Number.NaN);
    });
    it('parses a null value as Number.NaN', () => {
      expect(parsePrice(null, '2')).toEqual(Number.NaN);
    });
    it('parses "123A456" as Number.NaN', () => {
      expect(parsePrice('123A456', '2')).toEqual(Number.NaN);
    });
  });
});
describe('when valid prices are parsed', () => {
  describe('with a unit code of "A"', () => {
    describe('with a decimal fraction separator', () => {
      it('parses "0.00" as 0', () => {
        expect(parsePrice('0.00', 'A', '.')).toEqual(0);
      });
      it('parses "123.00" as 123', () => {
        expect(parsePrice('123.00', 'A', '.')).toEqual(123);
      });
      it('parses "123.50" as 123.5', () => {
        expect(parsePrice('123.50', 'A', '.')).toEqual(123.50);
      });
      it('parses "123.567" as 123.57', () => {
        expect(parsePrice('123.567', 'A', '.')).toEqual(123.57);
      });
      it('parses "123.561" as 123.56', () => {
        expect(parsePrice('123.561', 'A', '.')).toEqual(123.56);
      });
    });
    describe('with a dash fraction separator', () => {
      it('parses "0.00" as 0', () => {
        expect(parsePrice('0.00', 'A', '-')).toEqual(0);
      });
      it('parses "123.00" as 123', () => {
        expect(parsePrice('123.00', 'A', '-')).toEqual(123);
      });
      it('parses "123.50" as 123.5', () => {
        expect(parsePrice('123.50', 'A', '-')).toEqual(123.50);
      });
      it('parses "123.567" as 123.57', () => {
        expect(parsePrice('123.567', 'A', '-')).toEqual(123.57);
      });
      it('parses "123.561" as 123.56', () => {
        expect(parsePrice('123.561', 'A', '-')).toEqual(123.56);
      });
    });
  });
  describe('with a unit code of "2"', () => {
    describe('with default arguments', () => {
      it('parses "0.000" as 0', () => {
        expect(parsePrice('0.000', '2')).toEqual(0);
      });
      it('parses "377.000" as 377', () => {
        expect(parsePrice('377.000', '2')).toEqual(377);
      });
    });
    describe('with a decimal fraction separator', () => {
      it('parse "0.000" as 0', () => {
        expect(parsePrice('0.000', '2', '.')).toEqual(0);
      });
      it('parses "377.000" as 377', () => {
        expect(parsePrice('377.000', '2', '.')).toEqual(377);
      });
      it('parses "-377.000" as -377', () => {
        expect(parsePrice('-377.000', '2', '.')).toEqual(-377);
      });
      it('parses "377.500" as 377.5', () => {
        expect(parsePrice('377.500', '2', '.')).toEqual(377.5);
      });
      it('parses "377.750" as 377.75', () => {
        expect(parsePrice('377.750', '2', '.')).toEqual(377.75);
      });
      it('parses "3770.750" as 3770.75', () => {
        expect(parsePrice('3770.750', '2', '.')).toEqual(3770.75);
      });
      it('parses "37700.750" as 37700.75', () => {
        expect(parsePrice('37700.750', '2', '.')).toEqual(37700.75);
      });
      it('parses "377000.750" as 377000.75', () => {
        expect(parsePrice('377000.750', '2', '.')).toEqual(377000.75);
      });
      it('parses "3770000.750" as 3770000.75', () => {
        expect(parsePrice('3770000.750', '2', '.')).toEqual(3770000.75);
      });
      it('parses "3770000.000" as 3770000', () => {
        expect(parsePrice('3770000.000', '2', '.')).toEqual(3770000);
      });
    });
    describe('with a decimal fraction separator and a thousands separator', () => {
      it('parses "0.000" as 0', () => {
        expect(parsePrice('0.000', '2', '.', false, ',')).toEqual(0);
      });
      it('parses "377.000" as 377', () => {
        expect(parsePrice('377.000', '2', '.', false, ',')).toEqual(377);
      });
      it('parses "-377.000" as -377', () => {
        expect(parsePrice('-377.000', '2', '.', false, ',')).toEqual(-377);
      });
      it('parses "377.500" as 377.5', () => {
        expect(parsePrice('377.500', '2', '.', false, ',')).toEqual(377.5);
      });
      it('parses "377.750" as 377.75', () => {
        expect(parsePrice('377.750', '2', '.', false, ',')).toEqual(377.75);
      });
      it('parses "3,770.750" as 3770.75', () => {
        expect(parsePrice('3,770.750', '2', '.', false, ',')).toEqual(3770.75);
      });
      it('parses "37,700.750" as 37700.75', () => {
        expect(parsePrice('37,700.750', '2', '.', false, ',')).toEqual(37700.75);
      });
      it('parses "377,000.750" as 377000.75', () => {
        expect(parsePrice('377,000.750', '2', '.', false, ',')).toEqual(377000.75);
      });
      it('parses "-377,000.750" as -377000.75', () => {
        expect(parsePrice('-377,000.750', '2', '.', false, ',')).toEqual(-377000.75);
      });
      it('parses "3,770,000.750" as 3770000.75', () => {
        expect(parsePrice('3,770,000.750', '2', '.', false, ',')).toEqual(3770000.75);
      });
      it('parses "3,770,000.000" as 3770000', () => {
        expect(parsePrice('3,770,000.000', '2', '.', false, ',')).toEqual(3770000);
      });
    });
    describe('with a decimal fraction separator and a thousands separator and parenthetical negatives', () => {
      it('parses "3,770.750" as 3770.75', () => {
        expect(parsePrice('3,770.750', '2', '.', false, ',')).toEqual(3770.75);
      });
      it('parses "(3,770.750)" as -3770.75', () => {
        expect(parsePrice('(3,770.750)', '2', '.', false, ',')).toEqual(-3770.75);
      });
      it('parses "0.000" as 0', () => {
        expect(parsePrice('0.000', '2', '.', false, ',')).toEqual(0);
      });
    });
    describe('with a decimal fraction separator and parenthetical negatives', () => {
      it('parses "3770.750" as 3770.75', () => {
        expect(parsePrice('3770.750', '2', '.', false, '')).toEqual(3770.75);
      });
      it('parses "(3770.750)" -3770.75', () => {
        expect(parsePrice('(3770.750)', '2', '.', false, '')).toEqual(-3770.75);
      });
      it('parses "0.000" as 0', () => {
        expect(parsePrice('0.000', '2', '.', false, '')).toEqual(0);
      });
    });
    describe('with a dash fraction separator', () => {
      it('parses "9.543" as 9.5', () => {
        expect(parsePrice('9-4', '2', '-')).toEqual(9.5);
      });
      it('parses "123-0" as 123', () => {
        expect(parsePrice('123-0', '2', '-')).toEqual(123);
      });
      it('parses "-123-0" as -123', () => {
        expect(parsePrice('-123-0', '2', '-')).toEqual(-123);
      });
      it('parses "123-4" as 123.5', () => {
        expect(parsePrice('123-4', '2', '-')).toEqual(123.5);
      });
      it('parses "-123-4" as -123.5', () => {
        expect(parsePrice('-123-4', '2', '-')).toEqual(-123.5);
      });
      it('parses "0-4" as 0.5', () => {
        expect(parsePrice('0-4', '2', '-')).toEqual(0.5);
      });
      it('parses "0-0" as 0', () => {
        expect(parsePrice('0-0', '2', '-')).toEqual(0);
      });
    });
    describe('with a dash fraction separator and parenthetical negatives', () => {
      it('parses "123-0" as 123', () => {
        expect(parsePrice('123-0', '2', '-', false, '')).toEqual(123);
      });
      it('parses "(123-0)" as -123', () => {
        expect(parsePrice('(123-0)', '2', '-', false, '')).toEqual(-123);
      });
      it('parses "123-4" as 123.5', () => {
        expect(parsePrice('123-4', '2', '-', false, '')).toEqual(123.5);
      });
      it('parses "(123-4)" as -123.5', () => {
        expect(parsePrice('(123-4)', '2', '-', false, '')).toEqual(-123.5);
      });
      it('parses "0-4" as 0.5', () => {
        expect(parsePrice('0-4', '2', '-', false, '')).toEqual(0.5);
      });
      it('parses "(0-4)" -0.5', () => {
        expect(parsePrice('(0-4)', '2', '-', false, '')).toEqual(-0.5);
      });
      it('parses "0" as 0', () => {
        expect(parsePrice('0-0', '2', '-', false, '')).toEqual(0);
      });
    });
    describe('with a tick separator', () => {
      it('parses "123\'0" as 123', () => {
        expect(parsePrice('123\'0', '2', '\'')).toEqual(123);
      });
      it('parses "123\'4" as 123.5', () => {
        expect(parsePrice('123\'4', '2', '\'')).toEqual(123.5);
      });
      it('parses "-123\'4" as -123.5', () => {
        expect(parsePrice('-123\'4', '2', '\'')).toEqual(-123.5);
      });
      it('parses "0\'4" as 0.5', () => {
        expect(parsePrice('0\'4', '2', '\'')).toEqual(0.5);
      });
      it('formats "-0\'4" as -0.5', () => {
        expect(parsePrice('-0\'4', '2', '\'')).toEqual(-0.5);
      });
      it('formats "0\'0" as 0', () => {
        expect(parsePrice('0\'0', '2', '\'')).toEqual(0);
      });
    });
    describe('with a tick separator and parenthetical negatives', () => {
      it('parses "123\'4" as 123.5', () => {
        expect(parsePrice('123\'4', '2', '\'', false, '', true)).toEqual(123.5);
      });
      it('parses "(123\'4)" as -123.5', () => {
        expect(parsePrice('(123\'4)', '2', '\'', false, '', true)).toEqual(-123.5);
      });
      it('parses "0\'4" as 0.5', () => {
        expect(parsePrice('0\'4', '2', '\'', false, '', true)).toEqual(0.5);
      });
      it('parses "(0\'4)" as -0.5', () => {
        expect(parsePrice('(0\'4)', '2', '\'', false, '', true)).toEqual(-0.5);
      });
      it('parses "0\'0" as 0', () => {
        expect(parsePrice('0\'0', '2', '\'', false, '', true)).toEqual(0);
      });
    });
    describe('with a zero-length separator', () => {
      it('parses "1230" as 123', () => {
        expect(parsePrice('1230', '2', '')).toEqual(123);
      });
      it('parses "1234" as 123.5', () => {
        expect(parsePrice('1234', '2', '')).toEqual(123.5);
      });
      it('parses "4" as 0.5', () => {
        expect(parsePrice('4', '2', '')).toEqual(0.5);
      });
      it('parses "0" as 0', () => {
        expect(parsePrice('0', '2', '')).toEqual(0);
      });
    });
    describe('with a zero-length separator and parenthetical negatives', () => {
      describe('with no separator and no special fractions', () => {
        it('parses "4" as 0.5', () => {
          expect(parsePrice('4', '2', '', false, '')).toEqual(0.5);
        });
        it('parses "(4)" as -0.5', () => {
          expect(parsePrice('(4)', '2', '', false, '')).toEqual(-0.5);
        });
        it('parses "0" as 0', () => {
          expect(parsePrice('0', '2', '', false, '')).toEqual(0);
        });
      });
    });
  });
  describe('with a unit code of "5"', () => {
    describe('with a dash fraction separator and special fractions', () => {
      it('parses "123-200" as 123.625', () => {
        expect(parsePrice('123-200', '5', '-', true)).toEqual(123.625);
      });
      it('parses "-123-200" as -123.625', () => {
        expect(parsePrice('-123-200', '5', '-', true)).toEqual(-123.625);
      });
      it('parses "123-205" as 123.640625', () => {
        expect(parsePrice('123-205', '5', '-', true)).toEqual(123.640625);
      });
      it('parses "-123-205" as -123.640625', () => {
        expect(parsePrice('-123-205', '5', '-', true)).toEqual(-123.640625);
      });
      it('parses "122-225" as 122.703125', () => {
        expect(parsePrice('122-225', '5', '-', true)).toEqual(122.703125);
      });
      it('parses "0-000" as 0', () => {
        expect(parsePrice('0-000', '5', '-', true)).toEqual(0);
      });
    });
    describe('with a dash fraction separator and special fractions and parenthetical negatives', () => {
      it('parses "123-200" as 123.625', () => {
        expect(parsePrice('123-200', '5', '-', true, '', true)).toEqual(123.625);
      });
      it('parses "(123-200)" as -123.625', () => {
        expect(parsePrice('(123-200)', '5', '-', true, '', true)).toEqual(-123.625);
      });
      it('parses "123-205" as 123.640625', () => {
        expect(parsePrice('123-205', '5', '-', true, '', true)).toEqual(123.640625);
      });
      it('parses "(123-205)" as -123.640625', () => {
        expect(parsePrice('(123-205)', '5', '-', true, '', true)).toEqual(-123.640625);
      });
    });
  });
  describe('with a unit code of "6"', () => {
    describe('with a dash fraction separator and special fractions', () => {
      it('parses "114-165" as 114.515625 ', () => {
        expect(parsePrice('114-165', '6', '-', true)).toEqual(114.515625);
      });
      it('parses "114-252" as 114.7875', () => {
        expect(parsePrice('114-252', '6', '-', true)).toEqual(114.7875);
      });
      it('parses "114-270" as 114.84375', () => {
        expect(parsePrice('114-270', '6', '-', true)).toEqual(114.84375);
      });
      it('parses "114-240" as 114.75', () => {
        expect(parsePrice('114-240', '6', '-', true)).toEqual(114.75);
      });
      it('parses "0-000" as 0', () => {
        expect(parsePrice('0-000', '6', '-', true)).toEqual(0);
      });
    });
  });
  describe('with a unit code of "8"', () => {
    describe('with a decimal fraction separator', () => {
      it('parses "0" as 0', () => {
        expect(parsePrice('0', '8', '.')).toEqual(0);
      });
      it('parses "1000" as 1000', () => {
        expect(parsePrice('1000', '8', '.')).toEqual(1000);
      });
    });
    describe('with a decimal separator and a thousands separator', () => {
      it('parses "0" as 0', () => {
        expect(parsePrice('0', '8', '.', false, ',')).toEqual(0);
      });
      it('parses "1,000" as 1000', () => {
        expect(parsePrice('1,000', '8', '.', false, ',')).toEqual(1000);
      });
    });
  });
  describe('with ad hoc settings from previous unit tests', () => {
    it('parses "125-5" as 125.625 (with unit code 2)', () => {
      expect(parsePrice('125-5', '2')).toEqual(125.625);
    });
    it('parses "-125-5" as -125.625 (with unit code 2)', () => {
      expect(parsePrice('-125-5', '2')).toEqual(-125.625);
    });
    it('parses "125-240" as 125.75 (with unit code 5, using special fractions)', () => {
      expect(parsePrice('125-240', '5', '-', true)).toEqual(125.75);
    });
    it('parses "-125-240" as -125.75 (with unit code 5, using special fractions)', () => {
      expect(parsePrice('-125-240', '5', '-', true)).toEqual(-125.75);
    });
  });
  describe('with insufficient data to infer correct settings', () => {
    it('parses "125-240" as Number.NaN (with unit code 5 where "special fractions" cannot be inferred)', () => {
      expect(parsePrice('125-240', '5')).toEqual(Number.NaN);
    });
  });
});

},{"../../../../lib/utilities/parse/price":29}],72:[function(require,module,exports){
const SymbolParser = require('../../../../lib/utilities/parsers/SymbolParser');

describe('When parsing a symbol for instrument type', () => {
  describe('and the symbol is IBM', () => {
    let instrumentType;
    beforeEach(() => {
      instrumentType = SymbolParser.parseInstrumentType('IBM');
    });
    it('the result should be null', () => {
      expect(instrumentType).toBe(null);
    });
  });
  describe('and the symbol is ESM08', () => {
    let instrumentType;
    beforeEach(() => {
      instrumentType = SymbolParser.parseInstrumentType('ESM08');
    });
    it('the result should not be null', () => {
      expect(instrumentType).not.toBe(null);
    });
    it('the "symbol" should be "ESM08"', () => {
      expect(instrumentType.symbol).toEqual('ESM08');
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
    it('the "month" should be "M"', () => {
      expect(instrumentType.month).toEqual('M');
    });
    it('the "year" should be 2008', () => {
      expect(instrumentType.year).toEqual(2008);
    });
  });
  describe('and the symbol is ESZ9', () => {
    let instrumentType;
    beforeEach(() => {
      instrumentType = SymbolParser.parseInstrumentType('ESZ9');
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
    it('the "year" should be 2029', () => {
      expect(instrumentType.year).toEqual(2029);
    });
  });
  describe('and the symbol is ESZ16', () => {
    let instrumentType;
    beforeEach(() => {
      instrumentType = SymbolParser.parseInstrumentType('ESZ16');
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
      instrumentType = SymbolParser.parseInstrumentType('ESZ2016');
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
  describe('and the symbol is SPY00', () => {
    let instrumentType;
    beforeEach(() => {
      instrumentType = SymbolParser.parseInstrumentType('SPY00');
    });
    it('the result should not be null', () => {
      expect(instrumentType).not.toBe(null);
    });
    it('the "symbol" should be "SPY00"', () => {
      expect(instrumentType.symbol).toEqual('SPY00');
    });
    it('the "type" should be "future"', () => {
      expect(instrumentType.type).toEqual('future');
    });
    it('the "dynamic" property should be false', () => {
      expect(instrumentType.dynamic).toEqual(false);
    });
    it('the "root" should be "SP"', () => {
      expect(instrumentType.root).toEqual('SP');
    });
    it('the "month" should be "Y"', () => {
      expect(instrumentType.month).toEqual('Y');
    });
    it('the "year" should be 2100', () => {
      expect(instrumentType.year).toEqual(2100);
    });
  });
  describe('and the symbol is ES*0', () => {
    let instrumentType;
    beforeEach(() => {
      instrumentType = SymbolParser.parseInstrumentType('ES*0');
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
      instrumentType = SymbolParser.parseInstrumentType('ES*1');
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
  describe('and the symbol is NG*13', () => {
    let instrumentType;
    beforeEach(() => {
      instrumentType = SymbolParser.parseInstrumentType('NG*13');
    });
    it('the result should not be null', () => {
      expect(instrumentType).not.toBe(null);
    });
    it('the "symbol" should be "NG*13"', () => {
      expect(instrumentType.symbol).toEqual('NG*13');
    });
    it('the "type" should be "future"', () => {
      expect(instrumentType.type).toEqual('future');
    });
    it('the "dynamic" property should be true', () => {
      expect(instrumentType.dynamic).toEqual(true);
    });
    it('the "root" should be "NG"', () => {
      expect(instrumentType.root).toEqual('NG');
    });
    it('the "dynamicCode" property should be "13"', () => {
      expect(instrumentType.dynamicCode).toEqual('13');
    });
  });
  describe('and the symbol is CLF0', () => {
    let instrumentType;
    beforeEach(() => {
      instrumentType = SymbolParser.parseInstrumentType('CLF0');
    });
    it('the "year" should be 2020', () => {
      expect(instrumentType.year).toEqual(2030);
    });
  });
  describe('and the symbol is CLF1 and the year is 2019', () => {
    let instrumentType;
    beforeEach(() => {
      let getFullYear = Date.prototype.getFullYear;

      Date.prototype.getFullYear = () => {
        return 2019;
      };

      instrumentType = SymbolParser.parseInstrumentType('CLF1');
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

      instrumentType = SymbolParser.parseInstrumentType('CLF9');
      Date.prototype.getFullYear = getFullYear;
    });
    it('the "year" should be 2019', () => {
      expect(instrumentType.year).toEqual(2019);
    });
  });
  describe('and the symbol is ^EURUSD', () => {
    let instrumentType;
    beforeEach(() => {
      instrumentType = SymbolParser.parseInstrumentType('^EURUSD');
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
      instrumentType = SymbolParser.parseInstrumentType('$DOWI');
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
      instrumentType = SymbolParser.parseInstrumentType('$SG1E');
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
      instrumentType = SymbolParser.parseInstrumentType('-001A');
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
      instrumentType = SymbolParser.parseInstrumentType('ESZ2660Q');
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
      instrumentType = SymbolParser.parseInstrumentType('ZWH9|470C');
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
    it('the "year" should be 2029', () => {
      expect(instrumentType.year).toEqual(2029);
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
      instrumentType = SymbolParser.parseInstrumentType('_S_SP_ZCH7_ZCK7');
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
  describe('and the symbol is AAPL|20200515|250.00P', () => {
    let instrumentType;
    beforeEach(() => {
      instrumentType = SymbolParser.parseInstrumentType('AAPL|20200515|250.00P');
    });
    it('the result should not be null', () => {
      expect(instrumentType).not.toBe(null);
    });
    it('the "symbol" should be "|20200515|250.00P"', () => {
      expect(instrumentType.symbol).toEqual('AAPL|20200515|250.00P');
    });
    it('the "type" should be "equity_option"', () => {
      expect(instrumentType.type).toEqual('equity_option');
    });
    it('the "root" should be "AAPL"', () => {
      expect(instrumentType.root).toEqual('AAPL');
    });
    it('the "month" should be 5', () => {
      expect(instrumentType.month).toEqual(5);
    });
    it('the "day" should be 15', () => {
      expect(instrumentType.day).toEqual(15);
    });
    it('the "year" should be 2020', () => {
      expect(instrumentType.year).toEqual(2020);
    });
    it('the "strike" should be 250', () => {
      expect(instrumentType.strike).toEqual(250);
    });
    it('the "option_type" should be "put"', () => {
      expect(instrumentType.option_type).toEqual('put');
    });
    it('the "adjusted" flag should be true', () => {
      expect(instrumentType.adjusted).toEqual(false);
    });
  });
  describe('and the symbol is AAPL1|20200515|250.00P', () => {
    let instrumentType;
    beforeEach(() => {
      instrumentType = SymbolParser.parseInstrumentType('AAPL1|20200515|250.00P');
    });
    it('the result should not be null', () => {
      expect(instrumentType).not.toBe(null);
    });
    it('the "symbol" should be "AAPL1|20200515|250.00P"', () => {
      expect(instrumentType.symbol).toEqual('AAPL1|20200515|250.00P');
    });
    it('the "type" should be "equity_option"', () => {
      expect(instrumentType.type).toEqual('equity_option');
    });
    it('the "root" should be "AAPL"', () => {
      expect(instrumentType.root).toEqual('AAPL');
    });
    it('the "month" should be 5', () => {
      expect(instrumentType.month).toEqual(5);
    });
    it('the "day" should be 15', () => {
      expect(instrumentType.day).toEqual(15);
    });
    it('the "year" should be 2020', () => {
      expect(instrumentType.year).toEqual(2020);
    });
    it('the "strike" should be 250', () => {
      expect(instrumentType.strike).toEqual(250);
    });
    it('the "option_type" should be "call"', () => {
      expect(instrumentType.option_type).toEqual('put');
    });
    it('the "adjusted" flag should be true', () => {
      expect(instrumentType.adjusted).toEqual(true);
    });
  });
  describe('and the symbol is HBM.TO|20220121|1.00C', () => {
    let instrumentType;
    beforeEach(() => {
      instrumentType = SymbolParser.parseInstrumentType('HBM.TO|20220121|1.00C');
    });
    it('the result should not be null', () => {
      expect(instrumentType).not.toBe(null);
    });
    it('the "symbol" should be "HBM.TO|20220121|1.00C"', () => {
      expect(instrumentType.symbol).toEqual('HBM.TO|20220121|1.00C');
    });
    it('the "type" should be "equity_option"', () => {
      expect(instrumentType.type).toEqual('equity_option');
    });
    it('the "root" should be "HBM.TO"', () => {
      expect(instrumentType.root).toEqual('HBM.TO');
    });
    it('the "month" should be 1', () => {
      expect(instrumentType.month).toEqual(1);
    });
    it('the "day" should be 21', () => {
      expect(instrumentType.day).toEqual(21);
    });
    it('the "year" should be 2022', () => {
      expect(instrumentType.year).toEqual(2022);
    });
    it('the "strike" should be 1', () => {
      expect(instrumentType.strike).toEqual(1);
    });
    it('the "option_type" should be "call"', () => {
      expect(instrumentType.option_type).toEqual('call');
    });
    it('the "adjusted" flag should be true', () => {
      expect(instrumentType.adjusted).toEqual(false);
    });
  });
  describe('and the symbol is HBM2.TO|20220121|1.00C', () => {
    let instrumentType;
    beforeEach(() => {
      instrumentType = SymbolParser.parseInstrumentType('HBM2.TO|20220121|1.00C');
    });
    it('the result should not be null', () => {
      expect(instrumentType).not.toBe(null);
    });
    it('the "symbol" should be "HBM2.TO|20220121|1.00C"', () => {
      expect(instrumentType.symbol).toEqual('HBM2.TO|20220121|1.00C');
    });
    it('the "type" should be "equity_option"', () => {
      expect(instrumentType.type).toEqual('equity_option');
    });
    it('the "root" should be "HBM.TO"', () => {
      expect(instrumentType.root).toEqual('HBM.TO');
    });
    it('the "month" should be 1', () => {
      expect(instrumentType.month).toEqual(1);
    });
    it('the "day" should be 21', () => {
      expect(instrumentType.day).toEqual(21);
    });
    it('the "year" should be 2022', () => {
      expect(instrumentType.year).toEqual(2022);
    });
    it('the "strike" should be 1', () => {
      expect(instrumentType.strike).toEqual(1);
    });
    it('the "option_type" should be "call"', () => {
      expect(instrumentType.option_type).toEqual('call');
    });
    it('the "adjusted" flag should be true', () => {
      expect(instrumentType.adjusted).toEqual(true);
    });
  });
  describe('and the symbol is BRK.B|20210205|170.00C', () => {
    let instrumentType;
    beforeEach(() => {
      instrumentType = SymbolParser.parseInstrumentType('BRK.B|20210205|170.00C');
    });
    it('the result should not be null', () => {
      expect(instrumentType).not.toBe(null);
    });
    it('the "symbol" should be "BRK.B|20210205|170.00C', () => {
      expect(instrumentType.symbol).toEqual('BRK.B|20210205|170.00C');
    });
    it('the "type" should be "equity_option"', () => {
      expect(instrumentType.type).toEqual('equity_option');
    });
    it('the "root" should be "BRK.B"', () => {
      expect(instrumentType.root).toEqual('BRK.B');
    });
    it('the "month" should be 2', () => {
      expect(instrumentType.month).toEqual(2);
    });
    it('the "day" should be 5', () => {
      expect(instrumentType.day).toEqual(5);
    });
    it('the "year" should be 2021', () => {
      expect(instrumentType.year).toEqual(2021);
    });
    it('the "strike" should be 170', () => {
      expect(instrumentType.strike).toEqual(170);
    });
    it('the "option_type" should be "call"', () => {
      expect(instrumentType.option_type).toEqual('call');
    });
    it('the "adjusted" flag should be true', () => {
      expect(instrumentType.adjusted).toEqual(false);
    });
  });
  describe('and the symbol is BRK.B2|20210205|170.00C', () => {
    let instrumentType;
    beforeEach(() => {
      instrumentType = SymbolParser.parseInstrumentType('BRK.B2|20210205|170.00C');
    });
    it('the result should not be null', () => {
      expect(instrumentType).not.toBe(null);
    });
    it('the "symbol" should be "BRK.B2|20210205|170.00C', () => {
      expect(instrumentType.symbol).toEqual('BRK.B2|20210205|170.00C');
    });
    it('the "type" should be "equity_option"', () => {
      expect(instrumentType.type).toEqual('equity_option');
    });
    it('the "root" should be "BRK.B"', () => {
      expect(instrumentType.root).toEqual('BRK.B');
    });
    it('the "month" should be 2', () => {
      expect(instrumentType.month).toEqual(2);
    });
    it('the "day" should be 5', () => {
      expect(instrumentType.day).toEqual(5);
    });
    it('the "year" should be 2021', () => {
      expect(instrumentType.year).toEqual(2021);
    });
    it('the "strike" should be 170', () => {
      expect(instrumentType.strike).toEqual(170);
    });
    it('the "option_type" should be "call"', () => {
      expect(instrumentType.option_type).toEqual('call');
    });
    it('the "adjusted" flag should be true', () => {
      expect(instrumentType.adjusted).toEqual(true);
    });
  });
  describe('and the symbol is $VIX|20200422|20.00WP', () => {
    let instrumentType;
    beforeEach(() => {
      instrumentType = SymbolParser.parseInstrumentType('$VIX|20200422|20.00WP');
    });
    it('the result should not be null', () => {
      expect(instrumentType).not.toBe(null);
    });
    it('the "symbol" should be "$VIX|20200422|20.00WP"', () => {
      expect(instrumentType.symbol).toEqual('$VIX|20200422|20.00WP');
    });
    it('the "type" should be "equity_option"', () => {
      expect(instrumentType.type).toEqual('equity_option');
    });
    it('the "root" should be "$VIX"', () => {
      expect(instrumentType.root).toEqual('$VIX');
    });
    it('the "month" should be 4', () => {
      expect(instrumentType.month).toEqual(4);
    });
    it('the "day" should be 22', () => {
      expect(instrumentType.day).toEqual(22);
    });
    it('the "year" should be 2020', () => {
      expect(instrumentType.year).toEqual(2020);
    });
    it('the "strike" should be 20', () => {
      expect(instrumentType.strike).toEqual(20);
    });
    it('the "option_type" should be "put"', () => {
      expect(instrumentType.option_type).toEqual('put');
    });
    it('the "adjusted" flag should be false', () => {
      expect(instrumentType.adjusted).toEqual(false);
    });
  });
});
describe('When checking to see if a symbol is a future', () => {
  it('the symbol "ES*1" should return true', () => {
    expect(SymbolParser.getIsFuture('ES*1')).toEqual(true);
  });
  it('the symbol "ESZ6" should return true', () => {
    expect(SymbolParser.getIsFuture('ESZ6')).toEqual(true);
  });
  it('the symbol "ESZ16" should return true', () => {
    expect(SymbolParser.getIsFuture('ESZ16')).toEqual(true);
  });
  it('the symbol "ESZ2016" should return true', () => {
    expect(SymbolParser.getIsFuture('ESZ2016')).toEqual(true);
  });
  it('the symbol "ESZ016" should return false', () => {
    expect(SymbolParser.getIsFuture('ESZ016')).toEqual(false);
  });
  it('the symbol "O!H7" should return true', () => {
    expect(SymbolParser.getIsFuture('O!H7')).toEqual(true);
  });
  it('the symbol "O!H2017" should return true', () => {
    expect(SymbolParser.getIsFuture('O!H2017')).toEqual(true);
  });
  it('the symbol "IBM" should return false', () => {
    expect(SymbolParser.getIsFuture('IBM')).toEqual(false);
  });
  it('the symbol "^EURUSD" should return false', () => {
    expect(SymbolParser.getIsFuture('^EURUSD')).toEqual(false);
  });
  it('the symbol "^BTCUSDT" should return false', () => {
    expect(SymbolParser.getIsFuture('^BTCUSDT')).toEqual(false);
  });
  it('the symbol "-001A" should return false', () => {
    expect(SymbolParser.getIsFuture('-001A')).toEqual(false);
  });
  it('the symbol "$DOWI" should return false', () => {
    expect(SymbolParser.getIsFuture('$DOWI')).toEqual(false);
  });
  it('the symbol "$SG1E" should return false', () => {
    expect(SymbolParser.getIsFuture('$SG1E')).toEqual(false);
  });
  it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
    expect(SymbolParser.getIsFuture('_S_SP_ZCH7_ZCK7')).toEqual(false);
  });
  it('the symbol "ESZ2660Q" should return false', () => {
    expect(SymbolParser.getIsFuture('ESZ2660Q')).toEqual(false);
  });
  it('the symbol "ZWH9|470C" should return false', () => {
    expect(SymbolParser.getIsFuture('ZWH9|470C')).toEqual(false);
  });
  it('the symbol "BB1F8|12050C" should return false', () => {
    expect(SymbolParser.getIsFuture('BB1F8|12050C')).toEqual(false);
  });
  it('the symbol "ZWK18465C" should return false', () => {
    expect(SymbolParser.getIsFuture('ZWK18465C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00C" should return false', () => {
    expect(SymbolParser.getIsFuture('PLATTS:AAVSV00C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00" should return false', () => {
    expect(SymbolParser.getIsFuture('PLATTS:AAVSV00')).toEqual(false);
  });
  it('the symbol "AAVSV00.PT" should return false', () => {
    expect(SymbolParser.getIsFuture('AAVSV00.PT')).toEqual(false);
  });
  it('the symbol "ZCPAUS.CM" should return false', () => {
    expect(SymbolParser.getIsFuture('ZCPAUS.CM')).toEqual(false);
  });
  it('the symbol "SCB001.CP" should return false', () => {
    expect(SymbolParser.getIsFuture('SCB001.CP')).toEqual(false);
  });
  it('the symbol "AE030UBX.CS" should return false', () => {
    expect(SymbolParser.getIsFuture('AE030UBX.CS')).toEqual(false);
  });
  it('the symbol "AAPL|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsFuture('AAPL|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsFuture('AAPL1|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsFuture('HBM.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsFuture('HBM2.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsFuture('BRK.B|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsFuture('BRK.B2|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
    expect(SymbolParser.getIsFuture('$VIX|20200422|20.00WP')).toEqual(false);
  });
  it('the symbol "AL79MRM1.C3" should return false', () => {
    expect(SymbolParser.getIsFuture('AL79MRM1.C3')).toEqual(false);
  });
  it('the symbol "C3:AL79MRM1" should return false', () => {
    expect(SymbolParser.getIsFuture('C3:AL79MRM1')).toEqual(false);
  });
  it('the symbol "VIC400.CF" should return false', () => {
    expect(SymbolParser.getIsFuture('VIC400.CF')).toEqual(false);
  });
});
describe('When checking to see if a symbol is a "concrete" future', () => {
  it('the symbol "ESZ6" should return true', () => {
    expect(SymbolParser.getIsConcrete('ESZ6')).toEqual(true);
  });
  it('the symbol "ESZ16" should return true', () => {
    expect(SymbolParser.getIsConcrete('ESZ16')).toEqual(true);
  });
  it('the symbol "ESZ2016" should return true', () => {
    expect(SymbolParser.getIsConcrete('ESZ2016')).toEqual(true);
  });
  it('the symbol "ES*0" should return false', () => {
    expect(SymbolParser.getIsConcrete('ES*0')).toEqual(false);
  });
  it('the symbol "ES*1" should return false', () => {
    expect(SymbolParser.getIsConcrete('ES*1')).toEqual(false);
  });
  it('the symbol "NG*13" should return false', () => {
    expect(SymbolParser.getIsConcrete('NG*13')).toEqual(false);
  });
});
describe('When checking to see if a symbol is a "reference" future', () => {
  it('the symbol "ESZ6" should return false', () => {
    expect(SymbolParser.getIsReference('ESZ6')).toEqual(false);
  });
  it('the symbol "ESZ16" should return false', () => {
    expect(SymbolParser.getIsReference('ESZ16')).toEqual(false);
  });
  it('the symbol "ESZ2016" should return false', () => {
    expect(SymbolParser.getIsReference('ESZ2016')).toEqual(false);
  });
  it('the symbol "ES*0" should return true', () => {
    expect(SymbolParser.getIsReference('ES*0')).toEqual(true);
  });
  it('the symbol "ES*1" should return true', () => {
    expect(SymbolParser.getIsReference('ES*1')).toEqual(true);
  });
  it('the symbol "NG*13" should return true', () => {
    expect(SymbolParser.getIsReference('NG*13')).toEqual(true);
  });
});
describe('When checking to see if a symbol is sector', () => {
  it('the symbol "ES*1" should return false', () => {
    expect(SymbolParser.getIsSector('ES*1')).toEqual(false);
  });
  it('the symbol "NG*13" should return false', () => {
    expect(SymbolParser.getIsSector('NG*13')).toEqual(false);
  });
  it('the symbol "ESZ6" should return false', () => {
    expect(SymbolParser.getIsSector('ESZ6')).toEqual(false);
  });
  it('the symbol "ESZ16" should return false', () => {
    expect(SymbolParser.getIsSector('ESZ16')).toEqual(false);
  });
  it('the symbol "ESZ2016" should return false', () => {
    expect(SymbolParser.getIsSector('ESZ2016')).toEqual(false);
  });
  it('the symbol "ESZ016" should return false', () => {
    expect(SymbolParser.getIsSector('ESZ016')).toEqual(false);
  });
  it('the symbol "O!H7" should return false', () => {
    expect(SymbolParser.getIsSector('O!H7')).toEqual(false);
  });
  it('the symbol "O!H2017" should return false', () => {
    expect(SymbolParser.getIsSector('O!H2017')).toEqual(false);
  });
  it('the symbol "IBM" should return false', () => {
    expect(SymbolParser.getIsSector('IBM')).toEqual(false);
  });
  it('the symbol "^EURUSD" should return false', () => {
    expect(SymbolParser.getIsSector('^EURUSD')).toEqual(false);
  });
  it('the symbol "^BTCUSDT" should return false', () => {
    expect(SymbolParser.getIsSector('^BTCUSDT')).toEqual(false);
  });
  it('the symbol "-001A" should return true', () => {
    expect(SymbolParser.getIsSector('-001A')).toEqual(true);
  });
  it('the symbol "$DOWI" should return false', () => {
    expect(SymbolParser.getIsSector('$DOWI')).toEqual(false);
  });
  it('the symbol "$S1GE" should return false', () => {
    expect(SymbolParser.getIsSector('$S1GE')).toEqual(false);
  });
  it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
    expect(SymbolParser.getIsSector('_S_SP_ZCH7_ZCK7')).toEqual(false);
  });
  it('the symbol "ESZ2660Q" should return false', () => {
    expect(SymbolParser.getIsSector('ESZ2660Q')).toEqual(false);
  });
  it('the symbol "ZWH9|470C" should return false', () => {
    expect(SymbolParser.getIsSector('ZWH9|470C')).toEqual(false);
  });
  it('the symbol "BB1F8|12050C" should return false', () => {
    expect(SymbolParser.getIsSector('BB1F8|12050C')).toEqual(false);
  });
  it('the symbol "ZWK18465C" should return false', () => {
    expect(SymbolParser.getIsSector('ZWK18465C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00C" should return false', () => {
    expect(SymbolParser.getIsSector('PLATTS:AAVSV00C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00" should return false', () => {
    expect(SymbolParser.getIsSector('PLATTS:AAVSV00')).toEqual(false);
  });
  it('the symbol "AAVSV00.PT" should return false', () => {
    expect(SymbolParser.getIsSector('AAVSV00.PT')).toEqual(false);
  });
  it('the symbol "ZCPAUS.CM" should return false', () => {
    expect(SymbolParser.getIsSector('ZCPAUS.CM')).toEqual(false);
  });
  it('the symbol "SCB001.CP" should return false', () => {
    expect(SymbolParser.getIsSector('SCB001.CP')).toEqual(false);
  });
  it('the symbol "AE030UBX.CS" should return false', () => {
    expect(SymbolParser.getIsSector('AE030UBX.CS')).toEqual(false);
  });
  it('the symbol "AAPL|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsSector('AAPL|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsSector('AAPL1|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsSector('HBM.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsSector('HBM2.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsSector('BRK.B|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsSector('BRK.B2|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
    expect(SymbolParser.getIsSector('$VIX|20200422|20.00WP')).toEqual(false);
  });
  it('the symbol "AL79MRM1.C3" should return false', () => {
    expect(SymbolParser.getIsSector('AL79MRM1.C3')).toEqual(false);
  });
  it('the symbol "C3:AL79MRM1" should return false', () => {
    expect(SymbolParser.getIsSector('C3:AL79MRM1')).toEqual(false);
  });
  it('the symbol "VIC400.CF" should return false', () => {
    expect(SymbolParser.getIsSector('VIC400.CF')).toEqual(false);
  });
});
describe('When checking to see if a symbol is forex', () => {
  it('the symbol "ES*1" should return false', () => {
    expect(SymbolParser.getIsForex('ES*1')).toEqual(false);
  });
  it('the symbol "NG*13" should return false', () => {
    expect(SymbolParser.getIsForex('NG*13')).toEqual(false);
  });
  it('the symbol "ESZ6" should return false', () => {
    expect(SymbolParser.getIsForex('ESZ6')).toEqual(false);
  });
  it('the symbol "ESZ16" should return false', () => {
    expect(SymbolParser.getIsForex('ESZ16')).toEqual(false);
  });
  it('the symbol "ESZ2016" should return false', () => {
    expect(SymbolParser.getIsForex('ESZ2016')).toEqual(false);
  });
  it('the symbol "ESZ016" should return false', () => {
    expect(SymbolParser.getIsForex('ESZ016')).toEqual(false);
  });
  it('the symbol "O!H7" should return false', () => {
    expect(SymbolParser.getIsForex('O!H7')).toEqual(false);
  });
  it('the symbol "O!H17" should return false', () => {
    expect(SymbolParser.getIsForex('O!H17')).toEqual(false);
  });
  it('the symbol "O!H2017" should return false', () => {
    expect(SymbolParser.getIsForex('O!H2017')).toEqual(false);
  });
  it('the symbol "IBM" should return false', () => {
    expect(SymbolParser.getIsForex('IBM')).toEqual(false);
  });
  it('the symbol "^EURUSD" should return true', () => {
    expect(SymbolParser.getIsForex('^EURUSD')).toEqual(true);
  });
  it('the symbol "^BTCUSDT" should return false', () => {
    expect(SymbolParser.getIsForex('^BTCUSDT')).toEqual(false);
  });
  it('the symbol "-001A" should return false', () => {
    expect(SymbolParser.getIsForex('-001A')).toEqual(false);
  });
  it('the symbol "$DOWI" should return false', () => {
    expect(SymbolParser.getIsForex('$DOWI')).toEqual(false);
  });
  it('the symbol "$S1GE" should return false', () => {
    expect(SymbolParser.getIsForex('$S1GE')).toEqual(false);
  });
  it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
    expect(SymbolParser.getIsForex('_S_SP_ZCH7_ZCK7')).toEqual(false);
  });
  it('the symbol "ESZ2660Q" should return false', () => {
    expect(SymbolParser.getIsForex('ESZ2660Q')).toEqual(false);
  });
  it('the symbol "ZWH9|470C" should return false', () => {
    expect(SymbolParser.getIsForex('ZWH9|470C')).toEqual(false);
  });
  it('the symbol "BB1F8|12050C" should return false', () => {
    expect(SymbolParser.getIsForex('BB1F8|12050C')).toEqual(false);
  });
  it('the symbol "ZWK18465C" should return false', () => {
    expect(SymbolParser.getIsForex('ZWK18465C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00C" should return false', () => {
    expect(SymbolParser.getIsForex('PLATTS:AAVSV00C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00" should return false', () => {
    expect(SymbolParser.getIsForex('PLATTS:AAVSV00')).toEqual(false);
  });
  it('the symbol "AAVSV00.PT" should return false', () => {
    expect(SymbolParser.getIsForex('AAVSV00.PT')).toEqual(false);
  });
  it('the symbol "ZCPAUS.CM" should return false', () => {
    expect(SymbolParser.getIsForex('ZCPAUS.CM')).toEqual(false);
  });
  it('the symbol "SCB001.CP" should return false', () => {
    expect(SymbolParser.getIsForex('SCB001.CP')).toEqual(false);
  });
  it('the symbol "AE030UBX.CS" should return false', () => {
    expect(SymbolParser.getIsForex('AE030UBX.CS')).toEqual(false);
  });
  it('the symbol "AAPL|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsForex('AAPL|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsForex('AAPL1|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsForex('HBM.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsForex('HBM2.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsForex('BRK.B|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsForex('BRK.B2|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
    expect(SymbolParser.getIsForex('$VIX|20200422|20.00WP')).toEqual(false);
  });
  it('the symbol "AL79MRM1.C3" should return false', () => {
    expect(SymbolParser.getIsForex('AL79MRM1.C3')).toEqual(false);
  });
  it('the symbol "C3:AL79MRM1" should return false', () => {
    expect(SymbolParser.getIsForex('C3:AL79MRM1')).toEqual(false);
  });
  it('the symbol "VIC400.CF" should return false', () => {
    expect(SymbolParser.getIsForex('VIC400.CF')).toEqual(false);
  });
});
describe('When checking to see if a symbol is crypto', () => {
  it('the symbol "ES*1" should return false', () => {
    expect(SymbolParser.getIsCrypto('ES*1')).toEqual(false);
  });
  it('the symbol "NG*13" should return false', () => {
    expect(SymbolParser.getIsCrypto('NG*13')).toEqual(false);
  });
  it('the symbol "ESZ6" should return false', () => {
    expect(SymbolParser.getIsCrypto('ESZ6')).toEqual(false);
  });
  it('the symbol "ESZ16" should return false', () => {
    expect(SymbolParser.getIsCrypto('ESZ16')).toEqual(false);
  });
  it('the symbol "ESZ2016" should return false', () => {
    expect(SymbolParser.getIsCrypto('ESZ2016')).toEqual(false);
  });
  it('the symbol "ESZ016" should return false', () => {
    expect(SymbolParser.getIsCrypto('ESZ016')).toEqual(false);
  });
  it('the symbol "O!H7" should return false', () => {
    expect(SymbolParser.getIsCrypto('O!H7')).toEqual(false);
  });
  it('the symbol "O!H17" should return false', () => {
    expect(SymbolParser.getIsCrypto('O!H17')).toEqual(false);
  });
  it('the symbol "O!H2017" should return false', () => {
    expect(SymbolParser.getIsCrypto('O!H2017')).toEqual(false);
  });
  it('the symbol "IBM" should return false', () => {
    expect(SymbolParser.getIsCrypto('IBM')).toEqual(false);
  });
  it('the symbol "^EURUSD" should return true', () => {
    expect(SymbolParser.getIsCrypto('^EURUSD')).toEqual(true); // should return false ...
  });
  it('the symbol "^BTCUSDT" should return true', () => {
    expect(SymbolParser.getIsCrypto('^BTCUSDT')).toEqual(true);
  });
  it('the symbol "-001A" should return false', () => {
    expect(SymbolParser.getIsCrypto('-001A')).toEqual(false);
  });
  it('the symbol "$DOWI" should return false', () => {
    expect(SymbolParser.getIsCrypto('$DOWI')).toEqual(false);
  });
  it('the symbol "$S1GE" should return false', () => {
    expect(SymbolParser.getIsCrypto('$S1GE')).toEqual(false);
  });
  it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
    expect(SymbolParser.getIsCrypto('_S_SP_ZCH7_ZCK7')).toEqual(false);
  });
  it('the symbol "ESZ2660Q" should return false', () => {
    expect(SymbolParser.getIsCrypto('ESZ2660Q')).toEqual(false);
  });
  it('the symbol "ZWH9|470C" should return false', () => {
    expect(SymbolParser.getIsCrypto('ZWH9|470C')).toEqual(false);
  });
  it('the symbol "BB1F8|12050C" should return false', () => {
    expect(SymbolParser.getIsCrypto('BB1F8|12050C')).toEqual(false);
  });
  it('the symbol "ZWK18465C" should return false', () => {
    expect(SymbolParser.getIsCrypto('ZWK18465C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00C" should return false', () => {
    expect(SymbolParser.getIsCrypto('PLATTS:AAVSV00C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00" should return false', () => {
    expect(SymbolParser.getIsCrypto('PLATTS:AAVSV00')).toEqual(false);
  });
  it('the symbol "AAVSV00.PT" should return false', () => {
    expect(SymbolParser.getIsCrypto('AAVSV00.PT')).toEqual(false);
  });
  it('the symbol "ZCPAUS.CM" should return false', () => {
    expect(SymbolParser.getIsCrypto('ZCPAUS.CM')).toEqual(false);
  });
  it('the symbol "SCB001.CP" should return false', () => {
    expect(SymbolParser.getIsCrypto('SCB001.CP')).toEqual(false);
  });
  it('the symbol "AE030UBX.CS" should return false', () => {
    expect(SymbolParser.getIsCrypto('AE030UBX.CS')).toEqual(false);
  });
  it('the symbol "AAPL|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsCrypto('AAPL|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsCrypto('AAPL1|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsCrypto('HBM.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsCrypto('HBM2.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsCrypto('BRK.B|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsCrypto('BRK.B2|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
    expect(SymbolParser.getIsCrypto('$VIX|20200422|20.00WP')).toEqual(false);
  });
  it('the symbol "AL79MRM1.C3" should return false', () => {
    expect(SymbolParser.getIsCrypto('AL79MRM1.C3')).toEqual(false);
  });
  it('the symbol "C3:AL79MRM1" should return false', () => {
    expect(SymbolParser.getIsCrypto('C3:AL79MRM1')).toEqual(false);
  });
  it('the symbol "VIC400.CF" should return false', () => {
    expect(SymbolParser.getIsCrypto('VIC400.CF')).toEqual(false);
  });
});
describe('When checking to see if a symbol is a future spread', () => {
  it('the symbol "ES*1" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('ES*1')).toEqual(false);
  });
  it('the symbol "NG*13" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('NG*13')).toEqual(false);
  });
  it('the symbol "ESZ6" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('ESZ6')).toEqual(false);
  });
  it('the symbol "ESZ16" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('ESZ16')).toEqual(false);
  });
  it('the symbol "ESZ2016" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('ESZ2016')).toEqual(false);
  });
  it('the symbol "ESZ016" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('ESZ016')).toEqual(false);
  });
  it('the symbol "O!H7" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('O!H7')).toEqual(false);
  });
  it('the symbol "O!H17" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('O!H17')).toEqual(false);
  });
  it('the symbol "O!H2017" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('O!H2017')).toEqual(false);
  });
  it('the symbol "IBM" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('IBM')).toEqual(false);
  });
  it('the symbol "^EURUSD" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('^EURUSD')).toEqual(false);
  });
  it('the symbol "^BTCUSDT" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('^BTCUSDT')).toEqual(false);
  });
  it('the symbol "-001A" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('-001A')).toEqual(false);
  });
  it('the symbol "$DOWI" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('$DOWI')).toEqual(false);
  });
  it('the symbol "$S1GE" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('$S1GE')).toEqual(false);
  });
  it('the symbol "_S_SP_ZCH7_ZCK7" should return true', () => {
    expect(SymbolParser.getIsFutureSpread('_S_SP_ZCH7_ZCK7')).toEqual(true);
  });
  it('the symbol "ESZ2660Q" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('ESZ2660Q')).toEqual(false);
  });
  it('the symbol "ZWH9|470C" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('ZWH9|470C')).toEqual(false);
  });
  it('the symbol "BB1F8|12050C" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('BB1F8|12050C')).toEqual(false);
  });
  it('the symbol "ZWK18465C" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('ZWK18465C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00C" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('PLATTS:AAVSV00C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('PLATTS:AAVSV00')).toEqual(false);
  });
  it('the symbol "AAVSV00.PT" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('AAVSV00.PT')).toEqual(false);
  });
  it('the symbol "ZCPAUS.CM" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('ZCPAUS.CM')).toEqual(false);
  });
  it('the symbol "SCB001.CP" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('SCB001.CP')).toEqual(false);
  });
  it('the symbol "AE030UBX.CS" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('AE030UBX.CS')).toEqual(false);
  });
  it('the symbol "AAPL|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('AAPL|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('AAPL1|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('HBM.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('HBM2.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('BRK.B|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('BRK.B2|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('$VIX|20200422|20.00WP')).toEqual(false);
  });
  it('the symbol "AL79MRM1.C3" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('AL79MRM1.C3')).toEqual(false);
  });
  it('the symbol "C3:AL79MRM1" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('C3:AL79MRM1')).toEqual(false);
  });
  it('the symbol "VIC400.CF" should return false', () => {
    expect(SymbolParser.getIsFutureSpread('VIC400.CF')).toEqual(false);
  });
});
describe('When checking to see if a symbol is a future option', () => {
  it('the symbol "ES*1" should return false', () => {
    expect(SymbolParser.getIsFutureOption('ES*1')).toEqual(false);
  });
  it('the symbol "NG*13" should return false', () => {
    expect(SymbolParser.getIsFutureOption('NG*13')).toEqual(false);
  });
  it('the symbol "ESZ6" should return false', () => {
    expect(SymbolParser.getIsFutureOption('ESZ6')).toEqual(false);
  });
  it('the symbol "ESZ16" should return false', () => {
    expect(SymbolParser.getIsFutureOption('ESZ16')).toEqual(false);
  });
  it('the symbol "ESZ2016" should return false', () => {
    expect(SymbolParser.getIsFutureOption('ESZ2016')).toEqual(false);
  });
  it('the symbol "ESZ016" should return false', () => {
    expect(SymbolParser.getIsFutureOption('ESZ016')).toEqual(false);
  });
  it('the symbol "O!H7" should return false', () => {
    expect(SymbolParser.getIsFutureOption('O!H7')).toEqual(false);
  });
  it('the symbol "O!H17" should return false', () => {
    expect(SymbolParser.getIsFutureOption('O!H17')).toEqual(false);
  });
  it('the symbol "O!H2017" should return false', () => {
    expect(SymbolParser.getIsFutureOption('O!H2017')).toEqual(false);
  });
  it('the symbol "IBM" should return false', () => {
    expect(SymbolParser.getIsFutureOption('IBM')).toEqual(false);
  });
  it('the symbol "^EURUSD" should return false', () => {
    expect(SymbolParser.getIsFutureOption('^EURUSD')).toEqual(false);
  });
  it('the symbol "^BTCUSDT" should return false', () => {
    expect(SymbolParser.getIsFutureOption('^BTCUSDT')).toEqual(false);
  });
  it('the symbol "-001A" should return false', () => {
    expect(SymbolParser.getIsFutureOption('-001A')).toEqual(false);
  });
  it('the symbol "$DOWI" should return false', () => {
    expect(SymbolParser.getIsFutureOption('$DOWI')).toEqual(false);
  });
  it('the symbol "$S1GE" should return false', () => {
    expect(SymbolParser.getIsFutureOption('$S1GE')).toEqual(false);
  });
  it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
    expect(SymbolParser.getIsFutureOption('_S_SP_ZCH7_ZCK7')).toEqual(false);
  });
  it('the symbol "ESZ2660Q" should return true', () => {
    expect(SymbolParser.getIsFutureOption('ESZ2660Q')).toEqual(true);
  });
  it('the symbol "ZWH9|470C" should return true', () => {
    expect(SymbolParser.getIsFutureOption('ZWH9|470C')).toEqual(true);
  });
  it('the symbol "BB1F8|12050C" should return true', () => {
    expect(SymbolParser.getIsFutureOption('BB1F8|12050C')).toEqual(true);
  });
  it('the symbol "ZWK18465C" should return true', () => {
    expect(SymbolParser.getIsFutureOption('ZWK18465C')).toEqual(true);
  });
  it('the symbol "PLATTS:AAVSV00C" should return false', () => {
    expect(SymbolParser.getIsFutureOption('PLATTS:AAVSV00C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00" should return false', () => {
    expect(SymbolParser.getIsFutureOption('PLATTS:AAVSV00')).toEqual(false);
  });
  it('the symbol "AAVSV00.PT" should return false', () => {
    expect(SymbolParser.getIsFutureOption('AAVSV00.PT')).toEqual(false);
  });
  it('the symbol "ZCPAUS.CM" should return false', () => {
    expect(SymbolParser.getIsFutureOption('ZCPAUS.CM')).toEqual(false);
  });
  it('the symbol "SCB001.CP" should return false', () => {
    expect(SymbolParser.getIsFutureOption('SCB001.CP')).toEqual(false);
  });
  it('the symbol "AE030UBX.CS" should return false', () => {
    expect(SymbolParser.getIsFutureOption('AE030UBX.CS')).toEqual(false);
  });
  it('the symbol "AAPL|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsFutureOption('AAPL|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsFutureOption('AAPL1|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsFutureOption('HBM.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsFutureOption('HBM2.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsFutureOption('BRK.B|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsFutureOption('BRK.B2|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
    expect(SymbolParser.getIsFutureOption('$VIX|20200422|20.00WP')).toEqual(false);
  });
  it('the symbol "AL79MRM1.C3" should return false', () => {
    expect(SymbolParser.getIsFutureOption('AL79MRM1.C3')).toEqual(false);
  });
  it('the symbol "C3:AL79MRM1" should return false', () => {
    expect(SymbolParser.getIsFutureOption('C3:AL79MRM1')).toEqual(false);
  });
  it('the symbol "VIC400.CF" should return false', () => {
    expect(SymbolParser.getIsFutureOption('VIC400.CF')).toEqual(false);
  });
});
describe('When checking to see if a symbol is a cmdty-branded instrument', () => {
  it('the symbol "ES*1" should return false', () => {
    expect(SymbolParser.getIsCmdty('ES*1')).toEqual(false);
  });
  it('the symbol "NG*13" should return false', () => {
    expect(SymbolParser.getIsCmdty('NG*13')).toEqual(false);
  });
  it('the symbol "ESZ6" should return false', () => {
    expect(SymbolParser.getIsCmdty('ESZ6')).toEqual(false);
  });
  it('the symbol "ESZ16" should return false', () => {
    expect(SymbolParser.getIsCmdty('ESZ16')).toEqual(false);
  });
  it('the symbol "ESZ2016" should return false', () => {
    expect(SymbolParser.getIsCmdty('ESZ2016')).toEqual(false);
  });
  it('the symbol "ESZ016" should return false', () => {
    expect(SymbolParser.getIsCmdty('ESZ016')).toEqual(false);
  });
  it('the symbol "O!H7" should return false', () => {
    expect(SymbolParser.getIsCmdty('O!H7')).toEqual(false);
  });
  it('the symbol "O!H17" should return false', () => {
    expect(SymbolParser.getIsCmdty('O!H17')).toEqual(false);
  });
  it('the symbol "O!H2017" should return false', () => {
    expect(SymbolParser.getIsCmdty('O!H2017')).toEqual(false);
  });
  it('the symbol "IBM" should return false', () => {
    expect(SymbolParser.getIsCmdty('IBM')).toEqual(false);
  });
  it('the symbol "^EURUSD" should return false', () => {
    expect(SymbolParser.getIsCmdty('^EURUSD')).toEqual(false);
  });
  it('the symbol "^BTCUSDT" should return false', () => {
    expect(SymbolParser.getIsCmdty('^BTCUSDT')).toEqual(false);
  });
  it('the symbol "-001A" should return false', () => {
    expect(SymbolParser.getIsCmdty('-001A')).toEqual(false);
  });
  it('the symbol "$DOWI" should return false', () => {
    expect(SymbolParser.getIsCmdty('$DOWI')).toEqual(false);
  });
  it('the symbol "$S1GE" should return false', () => {
    expect(SymbolParser.getIsCmdty('$S1GE')).toEqual(false);
  });
  it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
    expect(SymbolParser.getIsCmdty('_S_SP_ZCH7_ZCK7')).toEqual(false);
  });
  it('the symbol "ESZ2660Q" should return false', () => {
    expect(SymbolParser.getIsCmdty('ESZ2660Q')).toEqual(false);
  });
  it('the symbol "ZWH9|470C" should return false', () => {
    expect(SymbolParser.getIsCmdty('ZWH9|470C')).toEqual(false);
  });
  it('the symbol "BB1F8|12050C" should return false', () => {
    expect(SymbolParser.getIsCmdty('BB1F8|12050C')).toEqual(false);
  });
  it('the symbol "ZWK18465C" should return false', () => {
    expect(SymbolParser.getIsCmdty('ZWK18465C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00C" should return false', () => {
    expect(SymbolParser.getIsCmdty('PLATTS:AAVSV00C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00" should return false', () => {
    expect(SymbolParser.getIsCmdty('PLATTS:AAVSV00')).toEqual(false);
  });
  it('the symbol "AAVSV00.PT" should return false', () => {
    expect(SymbolParser.getIsCmdty('AAVSV00.PT')).toEqual(false);
  });
  it('the symbol "ZCPAUS.CM" should return true', () => {
    expect(SymbolParser.getIsCmdty('ZCPAUS.CM')).toEqual(true);
  });
  it('the symbol "SCB001.CP" should return true', () => {
    expect(SymbolParser.getIsCmdty('SCB001.CP')).toEqual(true);
  });
  it('the symbol "AE030UBX.CS" should return true', () => {
    expect(SymbolParser.getIsCmdty('AE030UBX.CS')).toEqual(true);
  });
  it('the symbol "AAPL|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsCmdty('AAPL|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsCmdty('AAPL1|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsCmdty('HBM.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsCmdty('HBM2.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsCmdty('BRK.B|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsCmdty('BRK.B2|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
    expect(SymbolParser.getIsCmdty('$VIX|20200422|20.00WP')).toEqual(false);
  });
  it('the symbol "AL79MRM1.C3" should return false', () => {
    expect(SymbolParser.getIsCmdty('AL79MRM1.C3')).toEqual(false);
  });
  it('the symbol "C3:AL79MRM1" should return false', () => {
    expect(SymbolParser.getIsCmdty('C3:AL79MRM1')).toEqual(false);
  });
  it('the symbol "VIC400.CF" should return false', () => {
    expect(SymbolParser.getIsCmdty('VIC400.CF')).toEqual(false);
  });
});
describe('When checking to see if a symbol is a cmdtyStats instrument', () => {
  it('the symbol "ES*1" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('ES*1')).toEqual(false);
  });
  it('the symbol "NG*13" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('NG*13')).toEqual(false);
  });
  it('the symbol "ESZ6" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('ESZ6')).toEqual(false);
  });
  it('the symbol "ESZ16" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('ESZ16')).toEqual(false);
  });
  it('the symbol "ESZ2016" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('ESZ2016')).toEqual(false);
  });
  it('the symbol "ESZ016" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('ESZ016')).toEqual(false);
  });
  it('the symbol "O!H7" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('O!H7')).toEqual(false);
  });
  it('the symbol "O!H17" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('O!H17')).toEqual(false);
  });
  it('the symbol "O!H2017" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('O!H2017')).toEqual(false);
  });
  it('the symbol "IBM" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('IBM')).toEqual(false);
  });
  it('the symbol "^EURUSD" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('^EURUSD')).toEqual(false);
  });
  it('the symbol "^BTCUSDT" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('^BTCUSDT')).toEqual(false);
  });
  it('the symbol "-001A" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('-001A')).toEqual(false);
  });
  it('the symbol "$DOWI" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('$DOWI')).toEqual(false);
  });
  it('the symbol "$S1GE" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('$S1GE')).toEqual(false);
  });
  it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('_S_SP_ZCH7_ZCK7')).toEqual(false);
  });
  it('the symbol "ESZ2660Q" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('ESZ2660Q')).toEqual(false);
  });
  it('the symbol "ZWH9|470C" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('ZWH9|470C')).toEqual(false);
  });
  it('the symbol "BB1F8|12050C" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('BB1F8|12050C')).toEqual(false);
  });
  it('the symbol "ZWK18465C" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('ZWK18465C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00C" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('PLATTS:AAVSV00C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('PLATTS:AAVSV00')).toEqual(false);
  });
  it('the symbol "AAVSV00.PT" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('AAVSV00.PT')).toEqual(false);
  });
  it('the symbol "ZCPAUS.CM" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('ZCPAUS.CM')).toEqual(false);
  });
  it('the symbol "SCB001.CP" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('SCB001.CP')).toEqual(false);
  });
  it('the symbol "AE030UBX.CS" should return true', () => {
    expect(SymbolParser.getIsCmdtyStats('AE030UBX.CS')).toEqual(true);
  });
  it('the symbol "AAPL|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('AAPL|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('AAPL1|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('HBM.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('HBM2.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('BRK.B|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('BRK.B2|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('$VIX|20200422|20.00WP')).toEqual(false);
  });
  it('the symbol "AL79MRM1.C3" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('AL79MRM1.C3')).toEqual(false);
  });
  it('the symbol "C3:AL79MRM1" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('C3:AL79MRM1')).toEqual(false);
  });
  it('the symbol "VIC400.CF" should return false', () => {
    expect(SymbolParser.getIsCmdtyStats('VIC400.CF')).toEqual(false);
  });
});
describe('When checking to see if a symbol is a equity option', () => {
  it('the symbol "ES*1" should return false', () => {
    expect(SymbolParser.getIsEquityOption('ES*1')).toEqual(false);
  });
  it('the symbol "NG*13" should return false', () => {
    expect(SymbolParser.getIsEquityOption('NG*13')).toEqual(false);
  });
  it('the symbol "ESZ6" should return false', () => {
    expect(SymbolParser.getIsEquityOption('ESZ6')).toEqual(false);
  });
  it('the symbol "ESZ16" should return false', () => {
    expect(SymbolParser.getIsEquityOption('ESZ16')).toEqual(false);
  });
  it('the symbol "ESZ2016" should return false', () => {
    expect(SymbolParser.getIsEquityOption('ESZ2016')).toEqual(false);
  });
  it('the symbol "ESZ016" should return false', () => {
    expect(SymbolParser.getIsEquityOption('ESZ016')).toEqual(false);
  });
  it('the symbol "O!H7" should return false', () => {
    expect(SymbolParser.getIsEquityOption('O!H7')).toEqual(false);
  });
  it('the symbol "O!H17" should return false', () => {
    expect(SymbolParser.getIsEquityOption('O!H17')).toEqual(false);
  });
  it('the symbol "O!H2017" should return false', () => {
    expect(SymbolParser.getIsEquityOption('O!H2017')).toEqual(false);
  });
  it('the symbol "IBM" should return false', () => {
    expect(SymbolParser.getIsEquityOption('IBM')).toEqual(false);
  });
  it('the symbol "^EURUSD" should return false', () => {
    expect(SymbolParser.getIsEquityOption('^EURUSD')).toEqual(false);
  });
  it('the symbol "^BTCUSDT" should return false', () => {
    expect(SymbolParser.getIsEquityOption('^BTCUSDT')).toEqual(false);
  });
  it('the symbol "-001A" should return false', () => {
    expect(SymbolParser.getIsEquityOption('-001A')).toEqual(false);
  });
  it('the symbol "$DOWI" should return false', () => {
    expect(SymbolParser.getIsEquityOption('$DOWI')).toEqual(false);
  });
  it('the symbol "$S1GE" should return false', () => {
    expect(SymbolParser.getIsEquityOption('$S1GE')).toEqual(false);
  });
  it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
    expect(SymbolParser.getIsEquityOption('_S_SP_ZCH7_ZCK7')).toEqual(false);
  });
  it('the symbol "ESZ2660Q" should return false', () => {
    expect(SymbolParser.getIsEquityOption('ESZ2660Q')).toEqual(false);
  });
  it('the symbol "ZWH9|470C" should return false', () => {
    expect(SymbolParser.getIsEquityOption('ZWH9|470C')).toEqual(false);
  });
  it('the symbol "BB1F8|12050C" should return false', () => {
    expect(SymbolParser.getIsEquityOption('BB1F8|12050C')).toEqual(false);
  });
  it('the symbol "ZWK18465C" should return false', () => {
    expect(SymbolParser.getIsEquityOption('ZWK18465C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00C" should return false', () => {
    expect(SymbolParser.getIsEquityOption('PLATTS:AAVSV00C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00" should return false', () => {
    expect(SymbolParser.getIsEquityOption('PLATTS:AAVSV00')).toEqual(false);
  });
  it('the symbol "AAVSV00.PT" should return false', () => {
    expect(SymbolParser.getIsEquityOption('AAVSV00.PT')).toEqual(false);
  });
  it('the symbol "ZCPAUS.CM" should return false', () => {
    expect(SymbolParser.getIsEquityOption('ZCPAUS.CM')).toEqual(false);
  });
  it('the symbol "SCB001.CP" should return false', () => {
    expect(SymbolParser.getIsEquityOption('SCB001.CP')).toEqual(false);
  });
  it('the symbol "AE030UBX.CS" should return false', () => {
    expect(SymbolParser.getIsEquityOption('AE030UBX.CS')).toEqual(false);
  });
  it('the symbol "AAPL|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsEquityOption('AAPL|20200515|250.00P')).toEqual(true);
  });
  it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsEquityOption('AAPL1|20200515|250.00P')).toEqual(true);
  });
  it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsEquityOption('HBM.TO|20220121|1.00C')).toEqual(true);
  });
  it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsEquityOption('HBM2.TO|20220121|1.00C')).toEqual(true);
  });
  it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsEquityOption('BRK.B|20210205|170.00C')).toEqual(true);
  });
  it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsEquityOption('BRK.B2|20210205|170.00C')).toEqual(true);
  });
  it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
    expect(SymbolParser.getIsEquityOption('$VIX|20200422|20.00WP')).toEqual(true);
  });
  it('the symbol "AL79MRM1.C3" should return false', () => {
    expect(SymbolParser.getIsEquityOption('AL79MRM1.C3')).toEqual(false);
  });
  it('the symbol "C3:AL79MRM1" should return false', () => {
    expect(SymbolParser.getIsEquityOption('C3:AL79MRM1')).toEqual(false);
  });
  it('the symbol "VIC400.CF" should return false', () => {
    expect(SymbolParser.getIsEquityOption('VIC400.CF')).toEqual(false);
  });
});
describe('When checking to see if a symbol is a C3 instrument', () => {
  it('the symbol "ES*1" should return false', () => {
    expect(SymbolParser.getIsC3('ES*1')).toEqual(false);
  });
  it('the symbol "NG*13" should return false', () => {
    expect(SymbolParser.getIsC3('NG*13')).toEqual(false);
  });
  it('the symbol "ESZ6" should return false', () => {
    expect(SymbolParser.getIsC3('ESZ6')).toEqual(false);
  });
  it('the symbol "ESZ16" should return false', () => {
    expect(SymbolParser.getIsC3('ESZ16')).toEqual(false);
  });
  it('the symbol "ESZ2016" should return false', () => {
    expect(SymbolParser.getIsC3('ESZ2016')).toEqual(false);
  });
  it('the symbol "ESZ016" should return false', () => {
    expect(SymbolParser.getIsC3('ESZ016')).toEqual(false);
  });
  it('the symbol "O!H7" should return false', () => {
    expect(SymbolParser.getIsC3('O!H7')).toEqual(false);
  });
  it('the symbol "O!H17" should return false', () => {
    expect(SymbolParser.getIsC3('O!H17')).toEqual(false);
  });
  it('the symbol "O!H2017" should return false', () => {
    expect(SymbolParser.getIsC3('O!H2017')).toEqual(false);
  });
  it('the symbol "IBM" should return false', () => {
    expect(SymbolParser.getIsC3('IBM')).toEqual(false);
  });
  it('the symbol "^EURUSD" should return false', () => {
    expect(SymbolParser.getIsC3('^EURUSD')).toEqual(false);
  });
  it('the symbol "^BTCUSDT" should return false', () => {
    expect(SymbolParser.getIsC3('^BTCUSDT')).toEqual(false);
  });
  it('the symbol "-001A" should return false', () => {
    expect(SymbolParser.getIsC3('-001A')).toEqual(false);
  });
  it('the symbol "$DOWI" should return false', () => {
    expect(SymbolParser.getIsC3('$DOWI')).toEqual(false);
  });
  it('the symbol "$S1GE" should return false', () => {
    expect(SymbolParser.getIsC3('$S1GE')).toEqual(false);
  });
  it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
    expect(SymbolParser.getIsC3('_S_SP_ZCH7_ZCK7')).toEqual(false);
  });
  it('the symbol "ESZ2660Q" should return false', () => {
    expect(SymbolParser.getIsC3('ESZ2660Q')).toEqual(false);
  });
  it('the symbol "ZWH9|470C" should return false', () => {
    expect(SymbolParser.getIsC3('ZWH9|470C')).toEqual(false);
  });
  it('the symbol "BB1F8|12050C" should return false', () => {
    expect(SymbolParser.getIsC3('BB1F8|12050C')).toEqual(false);
  });
  it('the symbol "ZWK18465C" should return false', () => {
    expect(SymbolParser.getIsC3('ZWK18465C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00C" should return false', () => {
    expect(SymbolParser.getIsC3('PLATTS:AAVSV00C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00" should return false', () => {
    expect(SymbolParser.getIsC3('PLATTS:AAVSV00')).toEqual(false);
  });
  it('the symbol "AAVSV00.PT" should return false', () => {
    expect(SymbolParser.getIsC3('AAVSV00.PT')).toEqual(false);
  });
  it('the symbol "ZCPAUS.CM" should return false', () => {
    expect(SymbolParser.getIsC3('ZCPAUS.CM')).toEqual(false);
  });
  it('the symbol "SCB001.CP" should return false', () => {
    expect(SymbolParser.getIsC3('SCB001.CP')).toEqual(false);
  });
  it('the symbol "AE030UBX.CS" should return false', () => {
    expect(SymbolParser.getIsC3('AE030UBX.CS')).toEqual(false);
  });
  it('the symbol "AAPL|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsC3('AAPL|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsC3('AAPL1|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsC3('HBM.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsC3('HBM2.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsC3('BRK.B|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsC3('BRK.B2|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
    expect(SymbolParser.getIsC3('$VIX|20200422|20.00WP')).toEqual(false);
  });
  it('the symbol "AL79MRM1.C3" should return true', () => {
    expect(SymbolParser.getIsC3('AL79MRM1.C3')).toEqual(true);
  });
  it('the symbol "C3:AL79MRM1" should return true', () => {
    expect(SymbolParser.getIsC3('C3:AL79MRM1')).toEqual(true);
  });
  it('the symbol "VIC400.CF" should return false', () => {
    expect(SymbolParser.getIsC3('VIC400.CF')).toEqual(false);
  });
});
describe('When checking to see if a symbol is a Platts instrument', () => {
  it('the symbol "ES*1" should return false', () => {
    expect(SymbolParser.getIsPlatts('ES*1')).toEqual(false);
  });
  it('the symbol "ESZ6" should return false', () => {
    expect(SymbolParser.getIsPlatts('ESZ6')).toEqual(false);
  });
  it('the symbol "ESZ16" should return false', () => {
    expect(SymbolParser.getIsPlatts('ESZ16')).toEqual(false);
  });
  it('the symbol "ESZ2016" should return false', () => {
    expect(SymbolParser.getIsPlatts('ESZ2016')).toEqual(false);
  });
  it('the symbol "ESZ016" should return false', () => {
    expect(SymbolParser.getIsPlatts('ESZ016')).toEqual(false);
  });
  it('the symbol "O!H7" should return false', () => {
    expect(SymbolParser.getIsPlatts('O!H7')).toEqual(false);
  });
  it('the symbol "O!H2017" should return false', () => {
    expect(SymbolParser.getIsPlatts('O!H2017')).toEqual(false);
  });
  it('the symbol "IBM" should return false', () => {
    expect(SymbolParser.getIsPlatts('IBM')).toEqual(false);
  });
  it('the symbol "^EURUSD" should return false', () => {
    expect(SymbolParser.getIsPlatts('^EURUSD')).toEqual(false);
  });
  it('the symbol "^BTCUSDT" should return false', () => {
    expect(SymbolParser.getIsPlatts('^BTCUSDT')).toEqual(false);
  });
  it('the symbol "-001A" should return false', () => {
    expect(SymbolParser.getIsPlatts('-001A')).toEqual(false);
  });
  it('the symbol "$DOWI" should return false', () => {
    expect(SymbolParser.getIsPlatts('$DOWI')).toEqual(false);
  });
  it('the symbol "$SG1E" should return false', () => {
    expect(SymbolParser.getIsPlatts('$SG1E')).toEqual(false);
  });
  it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
    expect(SymbolParser.getIsPlatts('_S_SP_ZCH7_ZCK7')).toEqual(false);
  });
  it('the symbol "ESZ2660Q" should return false', () => {
    expect(SymbolParser.getIsPlatts('ESZ2660Q')).toEqual(false);
  });
  it('the symbol "ZWH9|470C" should return false', () => {
    expect(SymbolParser.getIsPlatts('ZWH9|470C')).toEqual(false);
  });
  it('the symbol "BB1F8|12050C" should return false', () => {
    expect(SymbolParser.getIsPlatts('BB1F8|12050C')).toEqual(false);
  });
  it('the symbol "ZWK18465C" should return false', () => {
    expect(SymbolParser.getIsPlatts('ZWK18465C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00C" should return true', () => {
    expect(SymbolParser.getIsPlatts('PLATTS:AAVSV00C')).toEqual(true);
  });
  it('the symbol "PLATTS:AAVSV00" should return true', () => {
    expect(SymbolParser.getIsPlatts('PLATTS:AAVSV00')).toEqual(true);
  });
  it('the symbol "AAVSV00.PT" should return true', () => {
    expect(SymbolParser.getIsPlatts('AAVSV00.PT')).toEqual(true);
  });
  it('the symbol "ZCPAUS.CM" should return false', () => {
    expect(SymbolParser.getIsPlatts('ZCPAUS.CM')).toEqual(false);
  });
  it('the symbol "SCB001.CP" should return false', () => {
    expect(SymbolParser.getIsPlatts('SCB001.CP')).toEqual(false);
  });
  it('the symbol "AE030UBX.CS" should return false', () => {
    expect(SymbolParser.getIsPlatts('AE030UBX.CS')).toEqual(false);
  });
  it('the symbol "AAPL|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsPlatts('AAPL|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsPlatts('AAPL1|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsPlatts('HBM.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsPlatts('HBM2.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsPlatts('BRK.B|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsPlatts('BRK.B2|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
    expect(SymbolParser.getIsPlatts('$VIX|20200422|20.00WP')).toEqual(false);
  });
  it('the symbol "AL79MRM1.C3" should return false', () => {
    expect(SymbolParser.getIsPlatts('AL79MRM1.C3')).toEqual(false);
  });
  it('the symbol "C3:AL79MRM1" should return false', () => {
    expect(SymbolParser.getIsPlatts('C3:AL79MRM1')).toEqual(false);
  });
  it('the symbol "VIC400.CF" should return false', () => {
    expect(SymbolParser.getIsPlatts('VIC400.CF')).toEqual(false);
  });
});
describe('When checking to see if a symbol is a Canadian mutual fund', () => {
  it('the symbol "ES*1" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('ES*1')).toEqual(false);
  });
  it('the symbol "ESZ6" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('ESZ6')).toEqual(false);
  });
  it('the symbol "ESZ16" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('ESZ16')).toEqual(false);
  });
  it('the symbol "ESZ2016" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('ESZ2016')).toEqual(false);
  });
  it('the symbol "ESZ016" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('ESZ016')).toEqual(false);
  });
  it('the symbol "O!H7" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('O!H7')).toEqual(false);
  });
  it('the symbol "O!H2017" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('O!H2017')).toEqual(false);
  });
  it('the symbol "IBM" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('IBM')).toEqual(false);
  });
  it('the symbol "^EURUSD" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('^EURUSD')).toEqual(false);
  });
  it('the symbol "^BTCUSDT" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('^BTCUSDT')).toEqual(false);
  });
  it('the symbol "-001A" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('-001A')).toEqual(false);
  });
  it('the symbol "$DOWI" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('$DOWI')).toEqual(false);
  });
  it('the symbol "$SG1E" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('$SG1E')).toEqual(false);
  });
  it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('_S_SP_ZCH7_ZCK7')).toEqual(false);
  });
  it('the symbol "ESZ2660Q" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('ESZ2660Q')).toEqual(false);
  });
  it('the symbol "ZWH9|470C" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('ZWH9|470C')).toEqual(false);
  });
  it('the symbol "BB1F8|12050C" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('BB1F8|12050C')).toEqual(false);
  });
  it('the symbol "ZWK18465C" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('ZWK18465C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00C" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('PLATTS:AAVSV00C')).toEqual(false);
  });
  it('the symbol "PLATTS:AAVSV00" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('PLATTS:AAVSV00')).toEqual(false);
  });
  it('the symbol "AAVSV00.PT" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('AAVSV00.PT')).toEqual(false);
  });
  it('the symbol "ZCPAUS.CM" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('ZCPAUS.CM')).toEqual(false);
  });
  it('the symbol "SCB001.CP" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('SCB001.CP')).toEqual(false);
  });
  it('the symbol "AE030UBX.CS" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('AE030UBX.CS')).toEqual(false);
  });
  it('the symbol "AAPL|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsPlatts('AAPL|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('AAPL1|20200515|250.00P')).toEqual(false);
  });
  it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('HBM.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('HBM2.TO|20220121|1.00C')).toEqual(false);
  });
  it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('BRK.B|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('BRK.B2|20210205|170.00C')).toEqual(false);
  });
  it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('$VIX|20200422|20.00WP')).toEqual(false);
  });
  it('the symbol "AL79MRM1.C3" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('AL79MRM1.C3')).toEqual(false);
  });
  it('the symbol "C3:AL79MRM1" should return false', () => {
    expect(SymbolParser.getIsCanadianFund('C3:AL79MRM1')).toEqual(false);
  });
  it('the symbol "VIC400.CF" should return true', () => {
    expect(SymbolParser.getIsCanadianFund('VIC400.CF')).toEqual(true);
  });
});
describe('When checking to see if a symbol is a BATS listing', () => {
  it('the symbol "IBM" should return false', () => {
    expect(SymbolParser.getIsBats('IBM')).toEqual(false);
  });
  it('the symbol "IBM.BZ" should return true', () => {
    expect(SymbolParser.getIsBats('IBM.BZ')).toEqual(true);
  });
});
describe('When checking to see if a symbol is pit-traded', () => {
  it('the symbol "IBM" (with the name "International Business Machines") should return false', () => {
    expect(SymbolParser.getIsPit('IBM', 'International Business Machines')).toEqual(false);
  });
  it('the symbol "ADU08" (with the name "Australian Dollar(P)") should return true', () => {
    expect(SymbolParser.getIsPit('ADU08', 'Australian Dollar(P)')).toEqual(true);
  });
  it('the symbol "BRQ17" (with the name "Brazilian Real (Pit)") should return true', () => {
    expect(SymbolParser.getIsPit('BRQ17', 'Brazilian Real (Pit)')).toEqual(true);
  });
  it('the symbol "CK21" (with the name "Corn (Pit) May 2021") should return true', () => {
    expect(SymbolParser.getIsPit('CK21', 'Corn (Pit) May 2021')).toEqual(true);
  });
});
describe('When checking the display format for the symbol', () => {
  it('The symbol "HPIUSA.RP" should not be formatted as a percent', () => {
    expect(SymbolParser.displayUsingPercent('HPIUSA.RP')).toEqual(false);
  });
  it('The symbol "UERMNTUS.RT" should be formatted as a percent', () => {
    expect(SymbolParser.displayUsingPercent('UERMNTUS.RT')).toEqual(true);
  });
});
describe('When getting a producer symbol', () => {
  describe('When the year is unimportant', () => {
    it('TSLA should map to TSLA', () => {
      expect(SymbolParser.getProducerSymbol('TSLA')).toEqual('TSLA');
    });
    it('TSLA.BZ should map to TSLA.BZ', () => {
      expect(SymbolParser.getProducerSymbol('TSLA.BZ')).toEqual('TSLA.BZ');
    });
    it('ESZ6 should map to ESZ6', () => {
      expect(SymbolParser.getProducerSymbol('ESZ6')).toEqual('ESZ6');
    });
    it('ESZ16 should map to ESZ6', () => {
      expect(SymbolParser.getProducerSymbol('ESZ16')).toEqual('ESZ6');
    });
    it('ESZ2016 should map to ESZ6', () => {
      expect(SymbolParser.getProducerSymbol('ESZ16')).toEqual('ESZ6');
    });
    it('ES*0 should map to ES*0', () => {
      expect(SymbolParser.getProducerSymbol('ES*0')).toEqual('ES*0');
    });
    it('NG*13 should map to NG*13', () => {
      expect(SymbolParser.getProducerSymbol('NG*13')).toEqual('NG*13');
    });
    it('$DOWI should map to $DOWI', () => {
      expect(SymbolParser.getProducerSymbol('$DOWI')).toEqual('$DOWI');
    });
    it('^EURUSD should map to ^EURUSD', () => {
      expect(SymbolParser.getProducerSymbol('^EURUSD')).toEqual('^EURUSD');
    });
    it('^BTCUSDT should map to ^BTCUSDT', () => {
      expect(SymbolParser.getProducerSymbol('^BTCUSDT')).toEqual('^BTCUSDT');
    });
    it('ZWK465C should map to ZWK465C', () => {
      expect(SymbolParser.getProducerSymbol('ZWK465C')).toEqual('ZWK465C');
    });
    it('BZ6N8|25C should map to BZ6N8|25C', () => {
      expect(SymbolParser.getProducerSymbol('BZ6N8|25C')).toEqual('BZ6N8|25C');
    });
    it('BZ6N9|25P should map to BZ6N9|25P', () => {
      expect(SymbolParser.getProducerSymbol('BZ6N9|25P')).toEqual('BZ6N9|25P');
    });
    it('BZ6N20|25P should map to BZ6N20|25P', () => {
      expect(SymbolParser.getProducerSymbol('BZ6N20|25P')).toEqual('BZ6N0|25P');
    });
    it('PLATTS:AAVSV00 should map to AAVSV00.PT', () => {
      expect(SymbolParser.getProducerSymbol('PLATTS:AAVSV00')).toEqual('AAVSV00.PT');
    });
    it('AAVSV00.PT should map to AAVSV00.PT', () => {
      expect(SymbolParser.getProducerSymbol('AAVSV00.PT')).toEqual('AAVSV00.PT');
    });
    it('VIC400.CF should map to VIC400.CF', () => {
      expect(SymbolParser.getProducerSymbol('VIC400.CF')).toEqual('VIC400.CF');
    });
    it('AAPL|20200515|250.00P should map to AAPL|20200515|250.00P', () => {
      expect(SymbolParser.getProducerSymbol('AAPL|20200515|250.00P')).toEqual('AAPL|20200515|250.00P');
    });
  });
  describe('When the year is unspecified', () => {
    describe('When testing ZWK29465C in 2021', () => {
      let producerSymbol;
      beforeEach(() => {
        let getFullYear = Date.prototype.getFullYear;

        Date.prototype.getFullYear = () => {
          return 2021;
        };

        producerSymbol = SymbolParser.getProducerSymbol('ZWK29465C');
        Date.prototype.getFullYear = getFullYear;
      });
      it('ZWK29465C should map to ZWK465K', () => {
        expect(producerSymbol).toEqual('ZWK465K');
      });
    });
    describe('When testing ZWK9|465P in 2021', () => {
      let producerSymbol;
      beforeEach(() => {
        let getFullYear = Date.prototype.getFullYear;

        Date.prototype.getFullYear = () => {
          return 2021;
        };

        producerSymbol = SymbolParser.getProducerSymbol('ZWK9|465P');
        Date.prototype.getFullYear = getFullYear;
      });
      it('ZWK9|465P should map to ZWK465X', () => {
        expect(producerSymbol).toEqual('ZWK465X');
      });
    });
  });
});
describe('When checking to see if a symbol is expired', () => {
  it('TSLA should not be expired', () => {
    expect(SymbolParser.getIsExpired('TSLA')).toEqual(false);
  });
  it('ZC*0 should not be expired', () => {
    expect(SymbolParser.getIsExpired('ZC*0')).toEqual(false);
  });
  it('SPY00 should not be expired', () => {
    expect(SymbolParser.getIsExpired('SPY00')).toEqual(false);
  });
});
describe('When getting an explicit futures symbol', () => {
  it('TSLA should map to a null value', () => {
    expect(SymbolParser.getFuturesExplicitFormat('TSLA')).toEqual(null);
  });
  it('ZC*0 should map to a null value', () => {
    expect(SymbolParser.getFuturesExplicitFormat('ZC*0')).toEqual(null);
  });
  it('ZC*1 should map to a null value', () => {
    expect(SymbolParser.getFuturesExplicitFormat('ZC*1')).toEqual(null);
  });
  it('ZCZ21 should map to ZCZ21', () => {
    expect(SymbolParser.getFuturesExplicitFormat('ZCZ21')).toEqual('ZCZ21');
  });
  it('ZCZ0 should map to ZCZ21', () => {
    expect(SymbolParser.getFuturesExplicitFormat('ZCZ0')).toEqual('ZCZ30');
  });
  it('ZCZ6 should map to ZCZ26', () => {
    expect(SymbolParser.getFuturesExplicitFormat('ZCZ6')).toEqual('ZCZ26');
  });
});

},{"../../../../lib/utilities/parsers/SymbolParser":30}]},{},[47,48,49,50,51,52,53,54,55,57,56,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72]);
