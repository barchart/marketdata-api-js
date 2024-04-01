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

},{"./../logging/LoggerFactory":2,"@barchart/common-js/lang//object":40}],5:[function(require,module,exports){
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
       * @property {number} tickIncrement - The minimum price movement, expressed as an integer multiple of the number of the possible divisions within one unit. For example, the number of discrete divisions of a dollar is 100. If the tick increment is ten, that means quotes and trades can occur at $0.10, $0.20, $0.30, etc.
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
       * @property {AssetClass|null} asset - The instrument type. This will only be present when inference based on the instrument symbol is possible.
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
     * Given a price, returns the human-readable representation.
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

},{"./../data/UnitCode":14,"@barchart/common-js/lang/is":39}],7:[function(require,module,exports){
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

},{"@barchart/common-js/lang/is":39}],9:[function(require,module,exports){
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

},{"./../data/monthCodes":15,"@barchart/common-js/lang/is":39}],10:[function(require,module,exports){
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

},{"./../data/monthCodes":15,"@barchart/common-js/lang/is":39}],11:[function(require,module,exports){
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

},{"@barchart/common-js/lang/is":39}],12:[function(require,module,exports){
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

},{"./../data/UnitCode":14,"@barchart/common-js/lang/is":39}],13:[function(require,module,exports){
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
      return Enum.fromCode(AssetClass, code);
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

    /**
     * A cmdtyStats instrument.
     *
     * @public
     * @static
     * @returns {AssetClass}
     */
    static get CMDTY_STATS() {
      return CMDTY_STATS;
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
  const CMDTY_STATS = new AssetClass('CMDTY', 'cmdtyStats', 24);
  return AssetClass;
})();

},{"@barchart/common-js/lang/Enum":35}],14:[function(require,module,exports){
const assert = require('@barchart/common-js/lang/assert'),
  Decimal = require('@barchart/common-js/lang/Decimal'),
  is = require('@barchart/common-js/lang/is');
const Enum = require('@barchart/common-js/lang/Enum');
module.exports = (() => {
  'use strict';

  // 2021/07/14, For a more detailed on the "special" fractional formatting (i.e. CME
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

    /**
     * Determines the minimum price fluctuation. In other words, multiples
     * of this value determine the set of valid quote and trade prices
     * for an instrument.
     *
     * @public
     * @param {Number} tickIncrement - Taken from a {@link Profile} instance.
     * @returns {Number}
     */
    getMinimumTick(tickIncrement) {
      assert.argumentIsValid(tickIncrement, 'tickIncrement', is.integer, 'must be an integer');
      const one = new Decimal(1);
      const ten = new Decimal(10);
      let discretePrice;
      if (this.supportsFractions) {
        discretePrice = one.divide(this._fractionFactor);
      } else {
        discretePrice = one.divide(ten.raise(this._decimalDigits));
      }
      const minimumTick = discretePrice.multiply(tickIncrement);
      return minimumTick.toFloat();
    }

    /**
     * Returns the change in value of a position when the instrument's price moves
     * up by the minimum tick.
     *
     * @public
     * @param {Number} tickIncrement - Taken from a {@link Profile} instance.
     * @param {Number} pointValue - Taken from a {@link Profile} instance.
     * @returns {Number}
     */
    getMinimumTickValue(tickIncrement, pointValue) {
      assert.argumentIsValid(tickIncrement, 'tickIncrement', is.integer, 'must be an integer');
      assert.argumentIsValid(pointValue, 'pointValue', is.number, 'must be a number');
      const minimumTick = new Decimal(this.getMinimumTick(tickIncrement));
      const minimumTickValue = minimumTick.multiply(pointValue);
      return minimumTickValue.toFloat();
    }

    /**
     * Rounds a value to the nearest valid tick.
     *
     * @param {Number|Decimal} value - The price to round.
     * @param {Number|Decimal} minimumTick - The minimum tick size (see {@link UnitCode#getMinimumTick})
     * @param {Boolean=} roundToZero - When true, the rounding will always go towards zero.
     * @returns {Number}
     */
    roundToNearestTick(value, minimumTick, roundToZero) {
      assert.argumentIsValid(value, 'value', x => is.number(x) || x instanceof Decimal, 'must be a number primitive or a Decimal instance');
      assert.argumentIsValid(minimumTick, 'minimumTick', x => is.number(x) || x instanceof Decimal, 'must be a number primitive or a Decimal instance');
      assert.argumentIsOptional(roundToZero, 'roundToZero', Boolean);
      let valueToUse;
      if (value instanceof Decimal) {
        valueToUse = value;
      } else {
        valueToUse = new Decimal(value);
      }
      let ticks = valueToUse.divide(minimumTick);
      let remainder = valueToUse.mod(minimumTick);
      if (!remainder.getIsZero()) {
        ticks = ticks.round(0, is.boolean(roundToZero) && roundToZero ? Decimal.ROUNDING_MODE.DOWN : Decimal.ROUNDING_MODE.NORMAL);
      }
      return ticks.multiply(minimumTick).toFloat();
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

},{"@barchart/common-js/lang/Decimal":34,"@barchart/common-js/lang/Enum":35,"@barchart/common-js/lang/assert":38,"@barchart/common-js/lang/is":39}],15:[function(require,module,exports){
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

},{"@barchart/common-js/lang/is":39}],18:[function(require,module,exports){
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

},{"@barchart/common-js/lang/is":39}],21:[function(require,module,exports){
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

},{"./../data/UnitCode":14,"./decimal":17,"./fraction":20,"@barchart/common-js/lang/is":39}],22:[function(require,module,exports){
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
    if (quote.timeUtc && (is.string(timezone) || quote.profile && quote.profile.exchangeRef && quote.profile.exchangeRef && quote.profile.exchangeRef.timezoneExchange)) {
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

},{"./date":16,"./time":25,"@barchart/common-js/lang/Timezones":36,"@barchart/common-js/lang/is":39}],23:[function(require,module,exports){
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
      const root = profile.root;

      // 2021/07/15, BRI. Options for ZB and ZN use unitCode="5" which defines
      // 64 price increments. The default price formatter will output fractions
      // using halves of thirty-seconds (e.g. 0-315). However, the CME specifies
      // formatting with sixty-fourths (e.g. 0-63). These notations are numerically
      // equivalent (i.e. 0-315 equals 0-63); however, customers will expect to see
      // the latter. This logic includes the option "root" symbols for normal, weekly,
      // and wednesday options (for ZB and ZN futures).

      if (root === 'ZB' || root === 'ZN' || regex.ZB.test(root) || regex.ZN.test(root)) {
        return formatFraction(value, 64, 2, '-', false);
      }

      // 2021/07/15, BRI. Options for ZT and ZF use unitCode="6" which defines
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
const parseValue = require('./value'),
  parseTimestamp = require('./timestamp');
module.exports = (() => {
  'use strict';

  /**
   * Parses a DDF message, returning a JavaScript object representing the
   * content of the message.
   *
   * @exported
   * @function
   * @param {String} msg
   * @param {XmlParser} xmlParser
   * @param {Object=} options
   * @returns {Object}
   */
  function parseMessage(msg, xmlParser, options) {
    const message = {
      message: msg,
      type: null
    };
    switch (msg.substr(0, 1)) {
      case '%':
        {
          let xmlDocument;
          try {
            xmlDocument = xmlParser.parse(msg.substring(1));
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
                  const session = premarket ? sessions.previous : sessions.combined;

                  // 2021/06/30, This seems wrong. We may be selecting most values
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
                  message.previousDay = p.day;
                  message.previousLastPrice = p.lastPrice;
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

},{"./timestamp":27,"./value":28}],27:[function(require,module,exports){
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
      case 'F':
        return sign * (parseInt(str) / 10000000);
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

},{"./../data/UnitCode":14,"@barchart/common-js/lang/is":39}],30:[function(require,module,exports){
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
     * Indicates if a symbol represents a "cash" futures contract (a
     * proprietary Barchart concept).
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */
    static getIsCash(symbol) {
      return SymbolParser.getIsFuture(symbol) && types.futures.cash.test(symbol);
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
     * Returns true if the symbol represents a Barchart sector (i.e. a type
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
     * Returns true if the symbol represents a cmdtyStats instrument.
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
     * Returns true if the symbol represents a grain bid instrument.
     *
     * @public
     * @static
     * @param {String} symbol
     * @returns {Boolean}
     */
    static getIsGrainBid(symbol) {
      return is.string(symbol) && types.bids.test(symbol);
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
     * Determine (or guess) the expiration year (for a futures contract), given
     * the string representation of the expiration year and the expiration month
     * code.
     *
     * @static
     * @public
     * @param {String} yearString
     * @param {String} monthCode
     */
    static getFuturesYear(yearString, monthCode) {
      return getFuturesYear(yearString, monthCode);
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
  const distantFuturesMonths = {
    F: 'A',
    G: 'B',
    H: 'C',
    J: 'D',
    K: 'E',
    M: 'I',
    N: 'L',
    Q: 'O',
    U: 'P',
    V: 'R',
    X: 'S',
    Z: 'T'
  };
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
  types.bids = /^([A-Z]{2})([B|P])([A-Z\d]{3,4})-(\d+)-(\d+)(\.CM)$/i;
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
  types.futures.cash = /(.*)(Y00)$/;
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
  parsers.push(symbol => {
    let definition = null;
    const match = symbol.match(types.cmdty.stats);
    if (match !== null) {
      definition = {};
      definition.symbol = symbol;
      definition.type = 'cmdtyStats';
      definition.asset = AssetClass.CMDTY_STATS;
    }
    return definition;
  });
  const converters = [];
  converters.push(symbol => {
    let converted = null;
    if (SymbolParser.getIsFuture(symbol) && SymbolParser.getIsConcrete(symbol)) {
      const matches = symbol.match(types.futures.concrete);
      if (matches !== null) {
        const root = matches[1];
        const month = matches[2];
        const year = getFuturesYear(matches[3], month);
        if (year > getCurrentYear() + 9) {
          const distant = distantFuturesMonths[month];
          if (distant) {
            converted = `${root}${distant}${getYearDigits(year, 1)}`;
          }
        }
      }
    }
    return converted;
  });
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
        const putCallCharacterCode = putCallCharacter.charCodeAt(0);

        // 2021/01/02, BRI. Per Tom, symbols (for the same instrument) change each year.
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
      if (currentYear + 25 < year) {
        year = year - 100;
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

},{"./../data/AssetClass":13,"@barchart/common-js/lang/is":39,"@barchart/common-js/lang/string":41}],31:[function(require,module,exports){
module.exports = (() => {
  'use strict';

  /**
   * The abstract definition for an object that parses XML and
   * outputs a duck-typed XML document. It is unlikely that SDK
   * consumers will need to implement this class.
   *
   * @public
   * @exported
   * @abstract
   */
  class XmlParser {
    constructor() {}

    /**
     * Accepts a string and returns a (duck-typed) XML document.
     *
     * @public
     * @param {String} text
     * @returns {*}
     */
    parse(text) {
      if (typeof text !== 'string') {
        throw new Error('The "text" argument must be a string.');
      }
      return this._parse(text);
    }

    /**
     * @protected
     * @abstract
     * @param {String} text
     * @returns {*}
     */
    _parse(text) {
      return null;
    }
    toString() {
      return '[XmlParser]';
    }
  }
  return XmlParser;
})();

},{}],32:[function(require,module,exports){
module.exports = (() => {
  'use strict';

  /**
   * An abstract definition for an factory that builds {@link XmlParser}
   * instances. It is unlikely that SDK consumers will need to implement
   * this class.
   *
   * @public
   * @exported
   * @abstract
   */
  class XmlParserFactory {
    constructor() {}

    /**
     * Returns a new {@link XmlParser} instance.
     *
     * @public
     * @abstract
     * @returns {XmlParser}
     */
    build() {
      return null;
    }
    toString() {
      return '[XmlParserFactory]';
    }
  }
  return XmlParserFactory;
})();

},{}],33:[function(require,module,exports){
const xmlDom = require('@xmldom/xmldom');
const XmlParser = require('./XmlParser'),
  XmlParserFactory = require('./XmlParserFactory');
module.exports = (() => {
  'use strict';

  /**
   * An implementation of {@link XmlParserFactory} for use by Node.js servers. Pass
   * an instance of this class to the {@link Connection.connect} function when
   * operating in Node.js.
   *
   * @public
   * @extends {XmlParserFactory}
   * @exported
   */
  class XmlParserFactoryForNode extends XmlParserFactory {
    constructor() {
      super();
    }

    /**
     * Returns a new {@link XmlParser} instance suitable for use
     * within a Node.js environment.
     *
     * @public
     * @returns {XmlParser}
     */
    build() {
      return new XmlParserForNode();
    }
    toString() {
      return '[XmlParserFactoryForNode]';
    }
  }

  /**
   * The implementation of a {@link XmlParser} suitable for use in Node.js
   * environments.
   *
   * @private
   * @extends {XmlParser}
   */
  class XmlParserForNode extends XmlParser {
    constructor() {
      super();
      this._parser = new xmlDom.DOMParser();
    }
    _parse(text) {
      return this._parser.parseFromString(text, 'text/xml');
    }
    toString() {
      return '[XmlParserForNode]';
    }
  }
  return XmlParserFactoryForNode;
})();

},{"./XmlParser":31,"./XmlParserFactory":32,"@xmldom/xmldom":47}],34:[function(require,module,exports){
const assert = require('./assert'),
  Enum = require('./Enum'),
  is = require('./is');
const Big = require('big.js');
module.exports = (() => {
  'use strict';

  /**
   * An immutable object that allows for arbitrary-precision calculations.
   *
   * @public
   * @param {Decimal|Number|String} value - The value.
   */
  class Decimal {
    constructor(value) {
      this._big = getBig(value);
    }

    /**
     * Returns a new {@link Decimal} instance that is the sum of the
     * current instance's value and the value supplied.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to add.
     * @returns {Decimal}
     */
    add(other) {
      return new Decimal(this._big.plus(getBig(other)));
    }

    /**
     * Returns a new {@link Decimal} instance with a value that results
     * from the subtraction of the value supplied from the current instance's
     * value.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to subtract.
     * @returns {Decimal}
     */
    subtract(other) {
      return new Decimal(this._big.minus(getBig(other)));
    }

    /**
     * Returns a new {@link Decimal} instance that is the product of the
     * current instance's value and the value supplied.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to add.
     * @returns {Decimal}
     */
    multiply(other) {
      return new Decimal(this._big.times(getBig(other)));
    }

    /**
     * Returns a new {@link Decimal} instance with a value that results
     * from the division of the current instance's value by the value
     * supplied.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to subtract.
     * @returns {Decimal}
     */
    divide(other) {
      return new Decimal(this._big.div(getBig(other)));
    }

    /**
     * Returns a new {@link Decimal} instance with a value that results
     * from raising the current instance to the power of the exponent
     * provided.
     *
     * @public
     * @param {Number} exponent
     * @returns {Decimal}
     */
    raise(exponent) {
      assert.argumentIsRequired(exponent, 'exponent', Number);
      return new Decimal(this._big.pow(exponent));
    }

    /**
     * Returns a new {@link Decimal} with a value resulting from a rounding
     * operation on the current value.
     *
     * @public
     * @param {Number} places - The number of decimal places to retain.
     * @param {RoundingMode=} mode - The strategy to use for rounding.
     * @returns {Decimal}
     */
    round(places, mode) {
      assert.argumentIsRequired(places, 'places', Number);
      assert.argumentIsOptional(mode, 'mode', RoundingMode, 'RoundingMode');
      const modeToUse = mode || RoundingMode.NORMAL;
      return new Decimal(this._big.round(places, modeToUse.value));
    }

    /**
     * Returns a new {@link Decimal} instance with of the remainder when
     * dividing the current instance by the value supplied.
     *
     * @public
     * @param {Decimal|Number|String} other
     * @returns {Decimal}
     */
    mod(other) {
      return new Decimal(this._big.mod(getBig(other)));
    }

    /**
     * Returns a new {@link Decimal} instance having the absolute value of
     * the current instance's value.
     *
     * @public
     * @returns {Decimal}
     */
    absolute() {
      return new Decimal(this._big.abs());
    }

    /**
     * Returns a new {@link Decimal} instance the opposite sign as the
     * current instance's value.
     *
     * @public
     * @returns {Decimal}
     */
    opposite() {
      return this.multiply(-1);
    }

    /**
     * Returns a Boolean value, indicating if the current instance's value is
     * equal to zero (or approximately equal to zero).
     *
     * @public
     * @param {Boolean=} approximate
     * @param {Number=} places
     * @returns {Boolean}
     */
    getIsZero(approximate, places) {
      assert.argumentIsOptional(approximate, 'approximate', Boolean);
      assert.argumentIsOptional(places, 'places', Number);
      return this._big.eq(zero) || is.boolean(approximate) && approximate && this.round(places || Big.DP, RoundingMode.NORMAL).getIsZero();
    }

    /**
     * Returns true if the current instance is positive; otherwise false.
     *
     * @public
     * @returns {Boolean}
     */
    getIsPositive() {
      return this._big.gt(zero);
    }

    /**
     * Returns true if the current instance is negative; otherwise false.
     *
     * @public
     * @returns {Boolean}
     */
    getIsNegative() {
      return this._big.lt(zero);
    }

    /**
     * Returns true if the current instance is greater than the value.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to compare.
     * @returns {Boolean}
     */
    getIsGreaterThan(other) {
      return this._big.gt(getBig(other));
    }

    /**
     * Returns true if the current instance is greater than or equal to the value.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to compare.
     * @returns {Boolean}
     */
    getIsGreaterThanOrEqual(other) {
      return this._big.gte(getBig(other));
    }

    /**
     * Returns true if the current instance is less than the value.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to compare.
     * @returns {Boolean}
     */
    getIsLessThan(other) {
      return this._big.lt(getBig(other));
    }

    /**
     * Returns true if the current instance is less than or equal to the value.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to compare.
     * @returns {Boolean}
     */
    getIsLessThanOrEqual(other) {
      return this._big.lte(getBig(other));
    }

    /**
     * Returns true if the current instance between two other values. The
     * test is inclusive, by default.
     *
     * @public
     * @param {Decimal|Number|String} minimum - The minimum value.
     * @param {Decimal|Number|String} minimum - The maximum value.
     * @param {Boolean=} exclusive - If true, the value cannot equal the minimum or maximum value and still be considered "between" the other values.
     * @returns {Boolean}
     */
    getIsBetween(minimum, maximum, exclusive) {
      assert.argumentIsOptional(exclusive, 'exclusive', Boolean);
      if (is.boolean(exclusive) && exclusive) {
        return this.getIsGreaterThan(minimum) && this.getIsLessThan(maximum);
      } else {
        return this.getIsGreaterThanOrEqual(minimum) && this.getIsLessThanOrEqual(maximum);
      }
    }

    /**
     * Returns true if the current instance is equal to the value.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to compare.
     * @returns {Boolean}
     */
    getIsEqual(other) {
      return this._big.eq(getBig(other));
    }

    /**
     * Returns true is close to another value.
     *
     * @public
     * @param {Decimal|Number|String} other - The value to compare.
     * @param {Number} places - The significant digits.
     * @returns {Boolean}
     */
    getIsApproximate(other, places) {
      if (places === 0) {
        return this.getIsEqual(other);
      }
      const difference = this.subtract(other).absolute();
      const tolerance = Decimal.ONE.divide(new Decimal(10).raise(places));
      return difference.getIsLessThan(tolerance);
    }

    /**
     * Returns true if the current instance is an integer (i.e. has no decimal
     * component).
     *
     * @public
     * @return {Boolean}
     */
    getIsInteger() {
      return this.getIsEqual(this.round(0));
    }

    /**
     * Returns the number of decimal places used.
     *
     * @public
     * @returns {Number}
     */
    getDecimalPlaces() {
      const matches = this.toFixed().match(/-?\d*\.(\d*)/);
      let returnVal;
      if (matches === null) {
        returnVal = 0;
      } else {
        returnVal = matches[1].length;
      }
      return returnVal;
    }

    /**
     * Emits a floating point value that approximates the value of the current
     * instance.
     *
     * @public
     * @param {Number=} places
     * @returns {Number}
     */
    toFloat(places) {
      assert.argumentIsOptional(places, 'places', Number);

      // Accepting places might be a mistake here; perhaps
      // the consumer should be forced to use the round
      // function.

      return parseFloat(this._big.toFixed(places || 16));
    }

    /**
     * Returns a string-based representation of the instance's value.
     *
     * @public
     * @returns {String}
     */
    toFixed() {
      return this._big.toFixed();
    }

    /**
     * Returns a {@link Number} that is approximately equal to the value of
     * this {@link Decimal} instance.
     *
     * @public
     * @returns {String}
     */
    toNumber() {
      return this._big.toNumber();
    }

    /**
     * Returns the JSON representation.
     *
     * @public
     * @returns {String}
     */
    toJSON() {
      return this.toFixed();
    }

    /**
     * Clones a {@link Decimal} instance.
     *
     * @public
     * @static
     * @param {Decimal} value
     * @returns {Decimal}
     */
    static clone(value) {
      assert.argumentIsRequired(value, 'value', Decimal, 'Decimal');
      return new Decimal(value._big);
    }

    /**
     * An alias for the constructor. Creates a new instance. Suitable for
     * use with the value emitted by {@link Decimal#toJSON}.
     *
     * @public
     * @static
     * @param {Decimal|Number|String} value
     * @returns {Decimal}
     */
    static parse(value) {
      return new Decimal(value);
    }

    /**
     * Returns an instance with the value of zero.
     *
     * @public
     * @static
     * @returns {Decimal}
     */
    static get ZERO() {
      return decimalZero;
    }

    /**
     * Returns an instance with the value of one.
     *
     * @public
     * @static
     * @returns {Decimal}
     */
    static get ONE() {
      return decimalOne;
    }

    /**
     * Returns an instance with the value of one.
     *
     * @public
     * @static
     * @returns {Decimal}
     */
    static get NEGATIVE_ONE() {
      return decimalNegativeOne;
    }

    /**
     * Return the {@link RoundingMode} enumeration.
     *
     * @public
     * @static
     * @returns {RoundingMode}
     */
    static get ROUNDING_MODE() {
      return RoundingMode;
    }

    /**
     * Runs {@link Decimal#getIsZero} and returns the result.
     *
     * @public
     * @static
     * @param {Decimal} instance
     * @returns {Boolean}
     */
    static getIsZero(instance) {
      assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');
      return instance.getIsZero();
    }

    /**
     * Runs {@link Decimal#getIsZero} and returns the inverse.
     *
     * @public
     * @static
     * @param {Decimal} instance
     * @returns {Boolean}
     */
    static getIsNotZero(instance) {
      assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');
      return !instance.getIsZero();
    }

    /**
     * Runs {@link Decimal#getIsPositive} and returns the result.
     *
     * @public
     * @static
     * @param {Decimal} instance
     * @returns {Boolean}
     */
    static getIsPositive(instance) {
      assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');
      return instance.getIsPositive();
    }

    /**
     * Checks an instance to see if its negative or zero.
     *
     * @public
     * @static
     * @param {Decimal} instance
     * @returns {Boolean}
     */
    static getIsNotPositive(instance) {
      assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');
      return instance.getIsNegative() || instance.getIsZero();
    }

    /**
     * Runs {@link Decimal#getIsNegative} and returns the result.
     *
     * @public
     * @static
     * @param {Decimal} instance
     * @returns {Boolean}
     */
    static getIsNegative(instance) {
      assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');
      return instance.getIsNegative();
    }

    /**
     * Checks an instance to see if its positive or zero.
     *
     * @public
     * @static
     * @param {Decimal} instance
     * @returns {Boolean}
     */
    static getIsNotNegative(instance) {
      assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');
      return instance.getIsPositive() || instance.getIsZero();
    }

    /**
     * A comparator function for {@link Decimal} instances.
     *
     * @public
     * @static
     * @param {Decimal} a
     * @param {Decimal} b
     * @returns {Number}
     */
    static compareDecimals(a, b) {
      assert.argumentIsRequired(a, 'a', Decimal, 'Decimal');
      assert.argumentIsRequired(b, 'b', Decimal, 'Decimal');
      if (a._big.gt(b._big)) {
        return 1;
      } else if (a._big.lt(b._big)) {
        return -1;
      } else {
        return 0;
      }
    }
    toString() {
      return '[Decimal]';
    }
  }
  const zero = new Big(0);
  const positiveOne = new Big(1);
  const negativeOne = new Big(-1);
  const decimalZero = new Decimal(zero);
  const decimalOne = new Decimal(positiveOne);
  const decimalNegativeOne = new Decimal(negativeOne);
  function getBig(value) {
    if (value instanceof Big) {
      return value;
    } else if (value instanceof Decimal) {
      return value._big;
    } else {
      return new Big(value);
    }
  }

  /**
   * An enumeration of strategies for rounding a {@link Decimal} instance.
   *
   * @public
   * @inner
   * @extends {Enum}
   */
  class RoundingMode extends Enum {
    constructor(value, description) {
      super(value.toString(), description);
      this._value = value;
    }

    /**
     * The code used by the Big.js library.
     *
     * @ignore
     * @returns {Number}
     */
    get value() {
      return this._value;
    }

    /**
     * Rounds away from zero.
     *
     * @public
     * @static
     * @returns {RoundingMode}
     */
    static get UP() {
      return up;
    }

    /**
     * Rounds towards zero.
     *
     * @public
     * @static
     * @returns {RoundingMode}
     */
    static get DOWN() {
      return down;
    }

    /**
     * Rounds towards nearest neighbor. If equidistant, rounds away from zero.
     *
     * @public
     * @static
     * @returns {RoundingMode}
     */
    static get NORMAL() {
      return normal;
    }
    toString() {
      return '[RoundingMode]';
    }
  }
  const up = new RoundingMode(3, 'up');
  const down = new RoundingMode(0, 'down');
  const normal = new RoundingMode(1, 'normal');
  return Decimal;
})();

},{"./Enum":35,"./assert":38,"./is":39,"big.js":49}],35:[function(require,module,exports){
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

},{"./assert":38}],36:[function(require,module,exports){
const assert = require('./assert'),
  Enum = require('./Enum'),
  is = require('./is'),
  timezone = require('./timezone');
const getTimezoneOffsetA = require('date-fns-tz/getTimezoneOffset'),
  getTimezoneOffsetB = require('date-fns-tz/getTimezoneOffset').default;
const getTimezoneOffset = is.fn(getTimezoneOffsetB) ? getTimezoneOffsetB : getTimezoneOffsetA;
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
     * @returns {Boolean}
     */
    getIsDaylightSavingsTime(timestamp) {
      assert.argumentIsOptional(timestamp, 'timestamp', Number);
      const now = new Date();
      let baseline = Date.UTC(now.getFullYear(), 0, 1);
      let candidate;
      if (timestamp) {
        candidate = timestamp;
      } else {
        candidate = now.getTime();
      }
      const baselineOffset = this.getUtcOffset(baseline);
      const candidateOffset = this.getUtcOffset(candidate);
      return baselineOffset !== candidateOffset;
    }

    /**
     * Calculates and returns the offset of a timezone from UTC.
     *
     * @public
     * @param {Number=} timestamp - The moment at which the offset is calculated, otherwise now.
     * @param {Boolean=} milliseconds - If true, the offset is returned in milliseconds; otherwise minutes.
     * @returns {Number}
     */
    getUtcOffset(timestamp, milliseconds) {
      assert.argumentIsOptional(timestamp, 'timestamp', Number);
      assert.argumentIsOptional(milliseconds, milliseconds, Boolean);
      let timestampToUse;
      if (is.number(timestamp)) {
        timestampToUse = timestamp;
      } else {
        timestampToUse = new Date().getTime();
      }
      let divisor;
      if (is.boolean(milliseconds) && milliseconds) {
        divisor = 1;
      } else {
        divisor = 60 * 1000;
      }
      return getTimezoneOffset(this.code, new Date(timestampToUse)) / divisor;
    }

    /**
     *
     * Given a code, returns the enumeration item.
     *
     * @public
     * @static
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

},{"./Enum":35,"./assert":38,"./is":39,"./timezone":42,"date-fns-tz/getTimezoneOffset":53}],37:[function(require,module,exports){
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
     * original array). Unlike the {@link array#groupBy} function, only one item can have a
     * given key value.
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

},{"./assert":38,"./is":39}],38:[function(require,module,exports){
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

},{"./is":39}],39:[function(require,module,exports){
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
     * @param {*} candidate
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

},{}],40:[function(require,module,exports){
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

},{"./array":37,"./is":39}],41:[function(require,module,exports){
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

},{"./assert":38,"./is":39}],42:[function(require,module,exports){
const assert = require('./assert');
module.exports = (() => {
  'use strict';

  /**
   * Utilities for working with timezones.
   *
   * @public
   * @module lang/timezone
   */
  const timezone = {
    /**
     * Gets a list of names in the tz database (see https://en.wikipedia.org/wiki/Tz_database
     * and https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
     *
     * @public
     * @static
     * @returns {String[]}
     */
    getTimezones() {
      return timezoneNames;
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
      let guess;
      try {
        guess = Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch (e) {
        guess = null;
      }
      return guess;
    }
  };
  const timezoneData = [["Africa", "Abidjan", "Accra", "Addis_Ababa", "Algiers", "Asmara", "Asmera", "Bamako", "Bangui", "Banjul", "Bissau", "Blantyre", "Brazzaville", "Bujumbura", "Cairo", "Casablanca", "Ceuta", "Conakry", "Dakar", "Dar_es_Salaam", "Djibouti", "Douala", "El_Aaiun", "Freetown", "Gaborone", "Harare", "Johannesburg", "Juba", "Kampala", "Khartoum", "Kigali", "Kinshasa", "Lagos", "Libreville", "Lome", "Luanda", "Lubumbashi", "Lusaka", "Malabo", "Maputo", "Maseru", "Mbabane", "Mogadishu", "Monrovia", "Nairobi", "Ndjamena", "Niamey", "Nouakchott", "Ouagadougou", "Porto-Novo", "Sao_Tome", "Timbuktu", "Tripoli", "Tunis", "Windhoek"], ["America", "Adak", "Anchorage", "Anguilla", "Antigua", "Araguaina", "Argentina/Buenos_Aires", "Argentina/Catamarca", "Argentina/ComodRivadavia", "Argentina/Cordoba", "Argentina/Jujuy", "Argentina/La_Rioja", "Argentina/Mendoza", "Argentina/Rio_Gallegos", "Argentina/Salta", "Argentina/San_Juan", "Argentina/San_Luis", "Argentina/Tucuman", "Argentina/Ushuaia", "Aruba", "Asuncion", "Atikokan", "Atka", "Bahia", "Bahia_Banderas", "Barbados", "Belem", "Belize", "Blanc-Sablon", "Boa_Vista", "Bogota", "Boise", "Buenos_Aires", "Cambridge_Bay", "Campo_Grande", "Cancun", "Caracas", "Catamarca", "Cayenne", "Cayman", "Chicago", "Chihuahua", "Ciudad_Juarez", "Coral_Harbour", "Cordoba", "Costa_Rica", "Creston", "Cuiaba", "Curacao", "Danmarkshavn", "Dawson", "Dawson_Creek", "Denver", "Detroit", "Dominica", "Edmonton", "Eirunepe", "El_Salvador", "Ensenada", "Fort_Nelson", "Fort_Wayne", "Fortaleza", "Glace_Bay", "Godthab", "Goose_Bay", "Grand_Turk", "Grenada", "Guadeloupe", "Guatemala", "Guayaquil", "Guyana", "Halifax", "Havana", "Hermosillo", "Indiana/Indianapolis", "Indiana/Knox", "Indiana/Marengo", "Indiana/Petersburg", "Indiana/Tell_City", "Indiana/Vevay", "Indiana/Vincennes", "Indiana/Winamac", "Indianapolis", "Inuvik", "Iqaluit", "Jamaica", "Jujuy", "Juneau", "Kentucky/Louisville", "Kentucky/Monticello", "Knox_IN", "Kralendijk", "La_Paz", "Lima", "Los_Angeles", "Louisville", "Lower_Princes", "Maceio", "Managua", "Manaus", "Marigot", "Martinique", "Matamoros", "Mazatlan", "Mendoza", "Menominee", "Merida", "Metlakatla", "Mexico_City", "Miquelon", "Moncton", "Monterrey", "Montevideo", "Montreal", "Montserrat", "Nassau", "New_York", "Nipigon", "Nome", "Noronha", "North_Dakota/Beulah", "North_Dakota/Center", "North_Dakota/New_Salem", "Nuuk", "Ojinaga", "Panama", "Pangnirtung", "Paramaribo", "Phoenix", "Port-au-Prince", "Port_of_Spain", "Porto_Acre", "Porto_Velho", "Puerto_Rico", "Punta_Arenas", "Rainy_River", "Rankin_Inlet", "Recife", "Regina", "Resolute", "Rio_Branco", "Rosario", "Santa_Isabel", "Santarem", "Santiago", "Santo_Domingo", "Sao_Paulo", "Scoresbysund", "Shiprock", "Sitka", "St_Barthelemy", "St_Johns", "St_Kitts", "St_Lucia", "St_Thomas", "St_Vincent", "Swift_Current", "Tegucigalpa", "Thule", "Thunder_Bay", "Tijuana", "Toronto", "Tortola", "Vancouver", "Virgin", "Whitehorse", "Winnipeg", "Yakutat", "Yellowknife"], ["Antarctica", "Casey", "Davis", "DumontDUrville", "Macquarie", "Mawson", "McMurdo", "Palmer", "Rothera", "South_Pole", "Syowa", "Troll", "Vostok"], ["Arctic", "Longyearbyen"], ["Asia", "Aden", "Almaty", "Amman", "Anadyr", "Aqtau", "Aqtobe", "Ashgabat", "Ashkhabad", "Atyrau", "Baghdad", "Bahrain", "Baku", "Bangkok", "Barnaul", "Beirut", "Bishkek", "Brunei", "Calcutta", "Chita", "Choibalsan", "Chongqing", "Chungking", "Colombo", "Dacca", "Damascus", "Dhaka", "Dili", "Dubai", "Dushanbe", "Famagusta", "Gaza", "Harbin", "Hebron", "Ho_Chi_Minh", "Hong_Kong", "Hovd", "Irkutsk", "Istanbul", "Jakarta", "Jayapura", "Jerusalem", "Kabul", "Kamchatka", "Karachi", "Kashgar", "Kathmandu", "Katmandu", "Khandyga", "Kolkata", "Krasnoyarsk", "Kuala_Lumpur", "Kuching", "Kuwait", "Macao", "Macau", "Magadan", "Makassar", "Manila", "Muscat", "Nicosia", "Novokuznetsk", "Novosibirsk", "Omsk", "Oral", "Phnom_Penh", "Pontianak", "Pyongyang", "Qatar", "Qostanay", "Qyzylorda", "Rangoon", "Riyadh", "Saigon", "Sakhalin", "Samarkand", "Seoul", "Shanghai", "Singapore", "Srednekolymsk", "Taipei", "Tashkent", "Tbilisi", "Tehran", "Tel_Aviv", "Thimbu", "Thimphu", "Tokyo", "Tomsk", "Ujung_Pandang", "Ulaanbaatar", "Ulan_Bator", "Urumqi", "Ust-Nera", "Vientiane", "Vladivostok", "Yakutsk", "Yangon", "Yekaterinburg", "Yerevan"], ["Atlantic", "Azores", "Bermuda", "Canary", "Cape_Verde", "Faeroe", "Faroe", "Jan_Mayen", "Madeira", "Reykjavik", "South_Georgia", "St_Helena", "Stanley"], ["Australia", "ACT", "Adelaide", "Brisbane", "Broken_Hill", "Canberra", "Currie", "Darwin", "Eucla", "Hobart", "LHI", "Lindeman", "Lord_Howe", "Melbourne", "NSW", "North", "Perth", "Queensland", "South", "Sydney", "Tasmania", "Victoria", "West", "Yancowinna"], ["Brazil", "Acre", "DeNoronha", "East", "West"], ["Canada", "Atlantic", "Central", "Eastern", "Mountain", "Newfoundland", "Pacific", "Saskatchewan", "Yukon"], ["CET"], ["Chile", "Continental", "EasterIsland"], ["CST6CDT"], ["Cuba"], ["EET"], ["Egypt"], ["Eire"], ["EST"], ["EST5EDT"], ["Etc", "GMT", "GMT+0", "GMT+1", "GMT+10", "GMT+11", "GMT+12", "GMT+2", "GMT+3", "GMT+4", "GMT+5", "GMT+6", "GMT+7", "GMT+8", "GMT+9", "GMT-0", "GMT-1", "GMT-10", "GMT-11", "GMT-12", "GMT-13", "GMT-14", "GMT-2", "GMT-3", "GMT-4", "GMT-5", "GMT-6", "GMT-7", "GMT-8", "GMT-9", "GMT0", "Greenwich", "UCT", "UTC", "Universal", "Zulu"], ["Europe", "Amsterdam", "Andorra", "Astrakhan", "Athens", "Belfast", "Belgrade", "Berlin", "Bratislava", "Brussels", "Bucharest", "Budapest", "Busingen", "Chisinau", "Copenhagen", "Dublin", "Gibraltar", "Guernsey", "Helsinki", "Isle_of_Man", "Istanbul", "Jersey", "Kaliningrad", "Kiev", "Kirov", "Kyiv", "Lisbon", "Ljubljana", "London", "Luxembourg", "Madrid", "Malta", "Mariehamn", "Minsk", "Monaco", "Moscow", "Nicosia", "Oslo", "Paris", "Podgorica", "Prague", "Riga", "Rome", "Samara", "San_Marino", "Sarajevo", "Saratov", "Simferopol", "Skopje", "Sofia", "Stockholm", "Tallinn", "Tirane", "Tiraspol", "Ulyanovsk", "Uzhgorod", "Vaduz", "Vatican", "Vienna", "Vilnius", "Volgograd", "Warsaw", "Zagreb", "Zaporozhye", "Zurich"], ["GB"], ["GB-Eire"], ["GMT"], ["GMT-0"], ["GMT+0"], ["GMT0"], ["Greenwich"], ["Hongkong"], ["HST"], ["Iceland"], ["Indian", "Antananarivo", "Chagos", "Christmas", "Cocos", "Comoro", "Kerguelen", "Mahe", "Maldives", "Mauritius", "Mayotte", "Reunion"], ["Iran"], ["Israel"], ["Jamaica"], ["Japan"], ["Kwajalein"], ["Libya"], ["MET"], ["Mexico", "BajaNorte", "BajaSur", "General"], ["MST"], ["MST7MDT"], ["Navajo"], ["NZ"], ["NZ-CHAT"], ["Pacific", "Apia", "Auckland", "Bougainville", "Chatham", "Chuuk", "Easter", "Efate", "Enderbury", "Fakaofo", "Fiji", "Funafuti", "Galapagos", "Gambier", "Guadalcanal", "Guam", "Honolulu", "Johnston", "Kanton", "Kiritimati", "Kosrae", "Kwajalein", "Majuro", "Marquesas", "Midway", "Nauru", "Niue", "Norfolk", "Noumea", "Pago_Pago", "Palau", "Pitcairn", "Pohnpei", "Ponape", "Port_Moresby", "Rarotonga", "Saipan", "Samoa", "Tahiti", "Tarawa", "Tongatapu", "Truk", "Wake", "Wallis", "Yap"], ["Poland"], ["Portugal"], ["PRC"], ["PST8PDT"], ["ROC"], ["ROK"], ["Singapore"], ["Turkey"], ["UCT"], ["Universal"], ["US", "Alaska", "Aleutian", "Arizona", "Central", "East-Indiana", "Eastern", "Hawaii", "Indiana-Starke", "Michigan", "Mountain", "Pacific", "Samoa"], ["UTC"], ["W-SU"], ["WET"], ["Zulu"]];
  const timezoneNames = timezoneData.reduce((accumulator, a) => {
    if (a.length === 1) {
      accumulator.push(a[0]);
    } else {
      a.forEach((b, i) => {
        if (i === 0) {
          return;
        }
        accumulator.push(`${a[0]}/${b}`);
      });
    }
    return accumulator;
  }, []);
  return timezone;
})();

},{"./assert":38}],43:[function(require,module,exports){
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
 * Since we can not rely on `Object.assign` we provide a simplified version
 * that is sufficient for our needs.
 *
 * @param {Object} target
 * @param {Object | null | undefined} source
 *
 * @returns {Object} target
 * @throws TypeError if target is not an object
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 * @see https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.assign
 */
function assign(target, source) {
	if (target === null || typeof target !== 'object') {
		throw new TypeError('target is not an object')
	}
	for (var key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			target[key] = source[key]
		}
	}
	return target
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

exports.assign = assign;
exports.freeze = freeze;
exports.MIME_TYPE = MIME_TYPE;
exports.NAMESPACE = NAMESPACE;

},{}],44:[function(require,module,exports){
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

},{"./conventions":43,"./dom":45,"./entities":46,"./sax":48}],45:[function(require,module,exports){
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
		if (Object.prototype.hasOwnProperty.call(src, p)) {
			dest[p] = src[p];
		}
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
	},
	/**
	 * @private
	 * @param {function (Node):boolean} predicate
	 * @returns {Node | undefined}
	 */
	find: function (predicate) {
		return Array.prototype.find.call(this, predicate);
	},
	/**
	 * @private
	 * @param {function (Node):boolean} predicate
	 * @returns {Node[]}
	 */
	filter: function (predicate) {
		return Array.prototype.filter.call(this, predicate);
	},
	/**
	 * @private
	 * @param {Node} item
	 * @returns {number}
	 */
	indexOf: function (item) {
		return Array.prototype.indexOf.call(this, item);
	},
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
		throw new DOMException(NOT_FOUND_ERR,new Error(el.tagName+'@'+attr))
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
						if (Object.prototype.hasOwnProperty.call(map, n) && map[n] === namespaceURI) {
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
    			if(Object.prototype.hasOwnProperty.call(map, prefix)){
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
 * Returns `true` if `node` can be a parent for insertion.
 * @param {Node} node
 * @returns {boolean}
 */
function hasValidParentNodeType(node) {
	return (
		node &&
		(node.nodeType === Node.DOCUMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.ELEMENT_NODE)
	);
}

/**
 * Returns `true` if `node` can be inserted according to it's `nodeType`.
 * @param {Node} node
 * @returns {boolean}
 */
function hasInsertableNodeType(node) {
	return (
		node &&
		(isElementNode(node) ||
			isTextNode(node) ||
			isDocTypeNode(node) ||
			node.nodeType === Node.DOCUMENT_FRAGMENT_NODE ||
			node.nodeType === Node.COMMENT_NODE ||
			node.nodeType === Node.PROCESSING_INSTRUCTION_NODE)
	);
}

/**
 * Returns true if `node` is a DOCTYPE node
 * @param {Node} node
 * @returns {boolean}
 */
function isDocTypeNode(node) {
	return node && node.nodeType === Node.DOCUMENT_TYPE_NODE;
}

/**
 * Returns true if the node is an element
 * @param {Node} node
 * @returns {boolean}
 */
function isElementNode(node) {
	return node && node.nodeType === Node.ELEMENT_NODE;
}
/**
 * Returns true if `node` is a text node
 * @param {Node} node
 * @returns {boolean}
 */
function isTextNode(node) {
	return node && node.nodeType === Node.TEXT_NODE;
}

/**
 * Check if en element node can be inserted before `child`, or at the end if child is falsy,
 * according to the presence and position of a doctype node on the same level.
 *
 * @param {Document} doc The document node
 * @param {Node} child the node that would become the nextSibling if the element would be inserted
 * @returns {boolean} `true` if an element can be inserted before child
 * @private
 * https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
 */
function isElementInsertionPossible(doc, child) {
	var parentChildNodes = doc.childNodes || [];
	if (parentChildNodes.find(isElementNode) || isDocTypeNode(child)) {
		return false;
	}
	var docTypeNode = parentChildNodes.find(isDocTypeNode);
	return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
}
/**
 * @private
 * @param {Node} parent the parent node to insert `node` into
 * @param {Node} node the node to insert
 * @param {Node=} child the node that should become the `nextSibling` of `node`
 * @returns {Node}
 * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
 * @throws DOMException if `child` is provided but is not a child of `parent`.
 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
 */
function _insertBefore(parent, node, child) {
	if (!hasValidParentNodeType(parent)) {
		throw new DOMException(HIERARCHY_REQUEST_ERR, 'Unexpected parent node type ' + parent.nodeType);
	}
	if (child && child.parentNode !== parent) {
		throw new DOMException(NOT_FOUND_ERR, 'child not in parent');
	}
	if (
		!hasInsertableNodeType(node) ||
		// the sax parser currently adds top level text nodes, this will be fixed in 0.9.0
		// || (node.nodeType === Node.TEXT_NODE && parent.nodeType === Node.DOCUMENT_NODE)
		(isDocTypeNode(node) && parent.nodeType !== Node.DOCUMENT_NODE)
	) {
		throw new DOMException(
			HIERARCHY_REQUEST_ERR,
			'Unexpected node type ' + node.nodeType + ' for parent node type ' + parent.nodeType
		);
	}
	var parentChildNodes = parent.childNodes || [];
	var nodeChildNodes = node.childNodes || [];
	if (parent.nodeType === Node.DOCUMENT_NODE) {
		if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
			let nodeChildElements = nodeChildNodes.filter(isElementNode);
			if (nodeChildElements.length > 1 || nodeChildNodes.find(isTextNode)) {
				throw new DOMException(HIERARCHY_REQUEST_ERR, 'More than one element or text in fragment');
			}
			if (nodeChildElements.length === 1 && !isElementInsertionPossible(parent, child)) {
				throw new DOMException(HIERARCHY_REQUEST_ERR, 'Element in fragment can not be inserted before doctype');
			}
		}
		if (isElementNode(node)) {
			if (parentChildNodes.find(isElementNode) || !isElementInsertionPossible(parent, child)) {
				throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one element can be added and only after doctype');
			}
		}
		if (isDocTypeNode(node)) {
			if (parentChildNodes.find(isDocTypeNode)) {
				throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one doctype is allowed');
			}
			let parentElementChild = parentChildNodes.find(isElementNode);
			if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
				throw new DOMException(HIERARCHY_REQUEST_ERR, 'Doctype can only be inserted before an element');
			}
			if (!child && parentElementChild) {
				throw new DOMException(HIERARCHY_REQUEST_ERR, 'Doctype can not be appended since element is present');
			}
		}
	}

	var cp = node.parentNode;
	if(cp){
		cp.removeChild(node);//remove and update
	}
	if(node.nodeType === DOCUMENT_FRAGMENT_NODE){
		var newFirst = node.firstChild;
		if (newFirst == null) {
			return node;
		}
		var newLast = node.lastChild;
	}else{
		newFirst = newLast = node;
	}
	var pre = child ? child.previousSibling : parent.lastChild;

	newFirst.previousSibling = pre;
	newLast.nextSibling = child;


	if(pre){
		pre.nextSibling = newFirst;
	}else{
		parent.firstChild = newFirst;
	}
	if(child == null){
		parent.lastChild = newLast;
	}else{
		child.previousSibling = newLast;
	}
	do{
		newFirst.parentNode = parent;
	}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
	_onUpdateChild(parent.ownerDocument||parent, parent);
	//console.log(parent.lastChild.nextSibling == null)
	if (node.nodeType == DOCUMENT_FRAGMENT_NODE) {
		node.firstChild = node.lastChild = null;
	}
	return node;
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
		_insertBefore(this, newChild, refChild);
		newChild.ownerDocument = this;
		if (this.documentElement === null && newChild.nodeType === ELEMENT_NODE) {
			this.documentElement = newChild;
		}

		return newChild;
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
 * @see https://w3c.github.io/DOM-Parsing/#serializing-an-element-s-attributes
 */
function addSerializedAttribute(buf, qualifiedName, value) {
	buf.push(' ', qualifiedName, '="', value.replace(/[<>&"\t\n\r]/g, _xmlEncoder), '"')
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
		 * @see https://w3c.github.io/DOM-Parsing/#xml-serializing-a-text-node
		 */
		return buf.push(node.data
			.replace(/[<&>]/g,_xmlEncoder)
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
	for (var n in node) {
		if (Object.prototype.hasOwnProperty.call(node, n)) {
			var v = node[n];
			if (typeof v != "object") {
				if (v != node2[n]) {
					node2[n] = v;
				}
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

},{"./conventions":43}],46:[function(require,module,exports){
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

},{"./conventions":43}],47:[function(require,module,exports){
var dom = require('./dom')
exports.DOMImplementation = dom.DOMImplementation
exports.XMLSerializer = dom.XMLSerializer
exports.DOMParser = require('./dom-parser').DOMParser

},{"./dom":45,"./dom-parser":44}],48:[function(require,module,exports){
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
		if (Object.hasOwnProperty.call(entityMap, k)) {
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
						for (var prefix in localNSMap) {
							if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
								domBuilder.endPrefixMapping(prefix);
							}
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
			for (prefix in localNSMap) {
				if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
					domBuilder.endPrefixMapping(prefix);
				}
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

function _copy (source, target) {
	for (var n in source) {
		if (Object.prototype.hasOwnProperty.call(source, n)) {
			target[n] = source[n];
		}
	}
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

},{"./conventions":43}],49:[function(require,module,exports){
/*
 *  big.js v6.2.1
 *  A small, fast, easy-to-use library for arbitrary-precision decimal arithmetic.
 *  Copyright (c) 2022 Michael Mclaughlin
 *  https://github.com/MikeMcl/big.js/LICENCE.md
 */
;(function (GLOBAL) {
  'use strict';
  var Big,


/************************************** EDITABLE DEFAULTS *****************************************/


    // The default values below must be integers within the stated ranges.

    /*
     * The maximum number of decimal places (DP) of the results of operations involving division:
     * div and sqrt, and pow with negative exponents.
     */
    DP = 20,            // 0 to MAX_DP

    /*
     * The rounding mode (RM) used when rounding to the above decimal places.
     *
     *  0  Towards zero (i.e. truncate, no rounding).       (ROUND_DOWN)
     *  1  To nearest neighbour. If equidistant, round up.  (ROUND_HALF_UP)
     *  2  To nearest neighbour. If equidistant, to even.   (ROUND_HALF_EVEN)
     *  3  Away from zero.                                  (ROUND_UP)
     */
    RM = 1,             // 0, 1, 2 or 3

    // The maximum value of DP and Big.DP.
    MAX_DP = 1E6,       // 0 to 1000000

    // The maximum magnitude of the exponent argument to the pow method.
    MAX_POWER = 1E6,    // 1 to 1000000

    /*
     * The negative exponent (NE) at and beneath which toString returns exponential notation.
     * (JavaScript numbers: -7)
     * -1000000 is the minimum recommended exponent value of a Big.
     */
    NE = -7,            // 0 to -1000000

    /*
     * The positive exponent (PE) at and above which toString returns exponential notation.
     * (JavaScript numbers: 21)
     * 1000000 is the maximum recommended exponent value of a Big, but this limit is not enforced.
     */
    PE = 21,            // 0 to 1000000

    /*
     * When true, an error will be thrown if a primitive number is passed to the Big constructor,
     * or if valueOf is called, or if toNumber is called on a Big which cannot be converted to a
     * primitive number without a loss of precision.
     */
    STRICT = false,     // true or false


/**************************************************************************************************/


    // Error messages.
    NAME = '[big.js] ',
    INVALID = NAME + 'Invalid ',
    INVALID_DP = INVALID + 'decimal places',
    INVALID_RM = INVALID + 'rounding mode',
    DIV_BY_ZERO = NAME + 'Division by zero',

    // The shared prototype object.
    P = {},
    UNDEFINED = void 0,
    NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;


  /*
   * Create and return a Big constructor.
   */
  function _Big_() {

    /*
     * The Big constructor and exported function.
     * Create and return a new instance of a Big number object.
     *
     * n {number|string|Big} A numeric value.
     */
    function Big(n) {
      var x = this;

      // Enable constructor usage without new.
      if (!(x instanceof Big)) return n === UNDEFINED ? _Big_() : new Big(n);

      // Duplicate.
      if (n instanceof Big) {
        x.s = n.s;
        x.e = n.e;
        x.c = n.c.slice();
      } else {
        if (typeof n !== 'string') {
          if (Big.strict === true && typeof n !== 'bigint') {
            throw TypeError(INVALID + 'value');
          }

          // Minus zero?
          n = n === 0 && 1 / n < 0 ? '-0' : String(n);
        }

        parse(x, n);
      }

      // Retain a reference to this Big constructor.
      // Shadow Big.prototype.constructor which points to Object.
      x.constructor = Big;
    }

    Big.prototype = P;
    Big.DP = DP;
    Big.RM = RM;
    Big.NE = NE;
    Big.PE = PE;
    Big.strict = STRICT;
    Big.roundDown = 0;
    Big.roundHalfUp = 1;
    Big.roundHalfEven = 2;
    Big.roundUp = 3;

    return Big;
  }


  /*
   * Parse the number or string value passed to a Big constructor.
   *
   * x {Big} A Big number instance.
   * n {number|string} A numeric value.
   */
  function parse(x, n) {
    var e, i, nl;

    if (!NUMERIC.test(n)) {
      throw Error(INVALID + 'number');
    }

    // Determine sign.
    x.s = n.charAt(0) == '-' ? (n = n.slice(1), -1) : 1;

    // Decimal point?
    if ((e = n.indexOf('.')) > -1) n = n.replace('.', '');

    // Exponential form?
    if ((i = n.search(/e/i)) > 0) {

      // Determine exponent.
      if (e < 0) e = i;
      e += +n.slice(i + 1);
      n = n.substring(0, i);
    } else if (e < 0) {

      // Integer.
      e = n.length;
    }

    nl = n.length;

    // Determine leading zeros.
    for (i = 0; i < nl && n.charAt(i) == '0';) ++i;

    if (i == nl) {

      // Zero.
      x.c = [x.e = 0];
    } else {

      // Determine trailing zeros.
      for (; nl > 0 && n.charAt(--nl) == '0';);
      x.e = e - i - 1;
      x.c = [];

      // Convert string to array of digits without leading/trailing zeros.
      for (e = 0; i <= nl;) x.c[e++] = +n.charAt(i++);
    }

    return x;
  }


  /*
   * Round Big x to a maximum of sd significant digits using rounding mode rm.
   *
   * x {Big} The Big to round.
   * sd {number} Significant digits: integer, 0 to MAX_DP inclusive.
   * rm {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   * [more] {boolean} Whether the result of division was truncated.
   */
  function round(x, sd, rm, more) {
    var xc = x.c;

    if (rm === UNDEFINED) rm = x.constructor.RM;
    if (rm !== 0 && rm !== 1 && rm !== 2 && rm !== 3) {
      throw Error(INVALID_RM);
    }

    if (sd < 1) {
      more =
        rm === 3 && (more || !!xc[0]) || sd === 0 && (
        rm === 1 && xc[0] >= 5 ||
        rm === 2 && (xc[0] > 5 || xc[0] === 5 && (more || xc[1] !== UNDEFINED))
      );

      xc.length = 1;

      if (more) {

        // 1, 0.1, 0.01, 0.001, 0.0001 etc.
        x.e = x.e - sd + 1;
        xc[0] = 1;
      } else {

        // Zero.
        xc[0] = x.e = 0;
      }
    } else if (sd < xc.length) {

      // xc[sd] is the digit after the digit that may be rounded up.
      more =
        rm === 1 && xc[sd] >= 5 ||
        rm === 2 && (xc[sd] > 5 || xc[sd] === 5 &&
          (more || xc[sd + 1] !== UNDEFINED || xc[sd - 1] & 1)) ||
        rm === 3 && (more || !!xc[0]);

      // Remove any digits after the required precision.
      xc.length = sd;

      // Round up?
      if (more) {

        // Rounding up may mean the previous digit has to be rounded up.
        for (; ++xc[--sd] > 9;) {
          xc[sd] = 0;
          if (sd === 0) {
            ++x.e;
            xc.unshift(1);
            break;
          }
        }
      }

      // Remove trailing zeros.
      for (sd = xc.length; !xc[--sd];) xc.pop();
    }

    return x;
  }


  /*
   * Return a string representing the value of Big x in normal or exponential notation.
   * Handles P.toExponential, P.toFixed, P.toJSON, P.toPrecision, P.toString and P.valueOf.
   */
  function stringify(x, doExponential, isNonzero) {
    var e = x.e,
      s = x.c.join(''),
      n = s.length;

    // Exponential notation?
    if (doExponential) {
      s = s.charAt(0) + (n > 1 ? '.' + s.slice(1) : '') + (e < 0 ? 'e' : 'e+') + e;

    // Normal notation.
    } else if (e < 0) {
      for (; ++e;) s = '0' + s;
      s = '0.' + s;
    } else if (e > 0) {
      if (++e > n) {
        for (e -= n; e--;) s += '0';
      } else if (e < n) {
        s = s.slice(0, e) + '.' + s.slice(e);
      }
    } else if (n > 1) {
      s = s.charAt(0) + '.' + s.slice(1);
    }

    return x.s < 0 && isNonzero ? '-' + s : s;
  }


  // Prototype/instance methods


  /*
   * Return a new Big whose value is the absolute value of this Big.
   */
  P.abs = function () {
    var x = new this.constructor(this);
    x.s = 1;
    return x;
  };


  /*
   * Return 1 if the value of this Big is greater than the value of Big y,
   *       -1 if the value of this Big is less than the value of Big y, or
   *        0 if they have the same value.
   */
  P.cmp = function (y) {
    var isneg,
      x = this,
      xc = x.c,
      yc = (y = new x.constructor(y)).c,
      i = x.s,
      j = y.s,
      k = x.e,
      l = y.e;

    // Either zero?
    if (!xc[0] || !yc[0]) return !xc[0] ? !yc[0] ? 0 : -j : i;

    // Signs differ?
    if (i != j) return i;

    isneg = i < 0;

    // Compare exponents.
    if (k != l) return k > l ^ isneg ? 1 : -1;

    j = (k = xc.length) < (l = yc.length) ? k : l;

    // Compare digit by digit.
    for (i = -1; ++i < j;) {
      if (xc[i] != yc[i]) return xc[i] > yc[i] ^ isneg ? 1 : -1;
    }

    // Compare lengths.
    return k == l ? 0 : k > l ^ isneg ? 1 : -1;
  };


  /*
   * Return a new Big whose value is the value of this Big divided by the value of Big y, rounded,
   * if necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
   */
  P.div = function (y) {
    var x = this,
      Big = x.constructor,
      a = x.c,                  // dividend
      b = (y = new Big(y)).c,   // divisor
      k = x.s == y.s ? 1 : -1,
      dp = Big.DP;

    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }

    // Divisor is zero?
    if (!b[0]) {
      throw Error(DIV_BY_ZERO);
    }

    // Dividend is 0? Return +-0.
    if (!a[0]) {
      y.s = k;
      y.c = [y.e = 0];
      return y;
    }

    var bl, bt, n, cmp, ri,
      bz = b.slice(),
      ai = bl = b.length,
      al = a.length,
      r = a.slice(0, bl),   // remainder
      rl = r.length,
      q = y,                // quotient
      qc = q.c = [],
      qi = 0,
      p = dp + (q.e = x.e - y.e) + 1;    // precision of the result

    q.s = k;
    k = p < 0 ? 0 : p;

    // Create version of divisor with leading zero.
    bz.unshift(0);

    // Add zeros to make remainder as long as divisor.
    for (; rl++ < bl;) r.push(0);

    do {

      // n is how many times the divisor goes into current remainder.
      for (n = 0; n < 10; n++) {

        // Compare divisor and remainder.
        if (bl != (rl = r.length)) {
          cmp = bl > rl ? 1 : -1;
        } else {
          for (ri = -1, cmp = 0; ++ri < bl;) {
            if (b[ri] != r[ri]) {
              cmp = b[ri] > r[ri] ? 1 : -1;
              break;
            }
          }
        }

        // If divisor < remainder, subtract divisor from remainder.
        if (cmp < 0) {

          // Remainder can't be more than 1 digit longer than divisor.
          // Equalise lengths using divisor with extra leading zero?
          for (bt = rl == bl ? b : bz; rl;) {
            if (r[--rl] < bt[rl]) {
              ri = rl;
              for (; ri && !r[--ri];) r[ri] = 9;
              --r[ri];
              r[rl] += 10;
            }
            r[rl] -= bt[rl];
          }

          for (; !r[0];) r.shift();
        } else {
          break;
        }
      }

      // Add the digit n to the result array.
      qc[qi++] = cmp ? n : ++n;

      // Update the remainder.
      if (r[0] && cmp) r[rl] = a[ai] || 0;
      else r = [a[ai]];

    } while ((ai++ < al || r[0] !== UNDEFINED) && k--);

    // Leading zero? Do not remove if result is simply zero (qi == 1).
    if (!qc[0] && qi != 1) {

      // There can't be more than one zero.
      qc.shift();
      q.e--;
      p--;
    }

    // Round?
    if (qi > p) round(q, p, Big.RM, r[0] !== UNDEFINED);

    return q;
  };


  /*
   * Return true if the value of this Big is equal to the value of Big y, otherwise return false.
   */
  P.eq = function (y) {
    return this.cmp(y) === 0;
  };


  /*
   * Return true if the value of this Big is greater than the value of Big y, otherwise return
   * false.
   */
  P.gt = function (y) {
    return this.cmp(y) > 0;
  };


  /*
   * Return true if the value of this Big is greater than or equal to the value of Big y, otherwise
   * return false.
   */
  P.gte = function (y) {
    return this.cmp(y) > -1;
  };


  /*
   * Return true if the value of this Big is less than the value of Big y, otherwise return false.
   */
  P.lt = function (y) {
    return this.cmp(y) < 0;
  };


  /*
   * Return true if the value of this Big is less than or equal to the value of Big y, otherwise
   * return false.
   */
  P.lte = function (y) {
    return this.cmp(y) < 1;
  };


  /*
   * Return a new Big whose value is the value of this Big minus the value of Big y.
   */
  P.minus = P.sub = function (y) {
    var i, j, t, xlty,
      x = this,
      Big = x.constructor,
      a = x.s,
      b = (y = new Big(y)).s;

    // Signs differ?
    if (a != b) {
      y.s = -b;
      return x.plus(y);
    }

    var xc = x.c.slice(),
      xe = x.e,
      yc = y.c,
      ye = y.e;

    // Either zero?
    if (!xc[0] || !yc[0]) {
      if (yc[0]) {
        y.s = -b;
      } else if (xc[0]) {
        y = new Big(x);
      } else {
        y.s = 1;
      }
      return y;
    }

    // Determine which is the bigger number. Prepend zeros to equalise exponents.
    if (a = xe - ye) {

      if (xlty = a < 0) {
        a = -a;
        t = xc;
      } else {
        ye = xe;
        t = yc;
      }

      t.reverse();
      for (b = a; b--;) t.push(0);
      t.reverse();
    } else {

      // Exponents equal. Check digit by digit.
      j = ((xlty = xc.length < yc.length) ? xc : yc).length;

      for (a = b = 0; b < j; b++) {
        if (xc[b] != yc[b]) {
          xlty = xc[b] < yc[b];
          break;
        }
      }
    }

    // x < y? Point xc to the array of the bigger number.
    if (xlty) {
      t = xc;
      xc = yc;
      yc = t;
      y.s = -y.s;
    }

    /*
     * Append zeros to xc if shorter. No need to add zeros to yc if shorter as subtraction only
     * needs to start at yc.length.
     */
    if ((b = (j = yc.length) - (i = xc.length)) > 0) for (; b--;) xc[i++] = 0;

    // Subtract yc from xc.
    for (b = i; j > a;) {
      if (xc[--j] < yc[j]) {
        for (i = j; i && !xc[--i];) xc[i] = 9;
        --xc[i];
        xc[j] += 10;
      }

      xc[j] -= yc[j];
    }

    // Remove trailing zeros.
    for (; xc[--b] === 0;) xc.pop();

    // Remove leading zeros and adjust exponent accordingly.
    for (; xc[0] === 0;) {
      xc.shift();
      --ye;
    }

    if (!xc[0]) {

      // n - n = +0
      y.s = 1;

      // Result must be zero.
      xc = [ye = 0];
    }

    y.c = xc;
    y.e = ye;

    return y;
  };


  /*
   * Return a new Big whose value is the value of this Big modulo the value of Big y.
   */
  P.mod = function (y) {
    var ygtx,
      x = this,
      Big = x.constructor,
      a = x.s,
      b = (y = new Big(y)).s;

    if (!y.c[0]) {
      throw Error(DIV_BY_ZERO);
    }

    x.s = y.s = 1;
    ygtx = y.cmp(x) == 1;
    x.s = a;
    y.s = b;

    if (ygtx) return new Big(x);

    a = Big.DP;
    b = Big.RM;
    Big.DP = Big.RM = 0;
    x = x.div(y);
    Big.DP = a;
    Big.RM = b;

    return this.minus(x.times(y));
  };
  
  
  /*
   * Return a new Big whose value is the value of this Big negated.
   */
  P.neg = function () {
    var x = new this.constructor(this);
    x.s = -x.s;
    return x;
  };


  /*
   * Return a new Big whose value is the value of this Big plus the value of Big y.
   */
  P.plus = P.add = function (y) {
    var e, k, t,
      x = this,
      Big = x.constructor;

    y = new Big(y);

    // Signs differ?
    if (x.s != y.s) {
      y.s = -y.s;
      return x.minus(y);
    }

    var xe = x.e,
      xc = x.c,
      ye = y.e,
      yc = y.c;

    // Either zero?
    if (!xc[0] || !yc[0]) {
      if (!yc[0]) {
        if (xc[0]) {
          y = new Big(x);
        } else {
          y.s = x.s;
        }
      }
      return y;
    }

    xc = xc.slice();

    // Prepend zeros to equalise exponents.
    // Note: reverse faster than unshifts.
    if (e = xe - ye) {
      if (e > 0) {
        ye = xe;
        t = yc;
      } else {
        e = -e;
        t = xc;
      }

      t.reverse();
      for (; e--;) t.push(0);
      t.reverse();
    }

    // Point xc to the longer array.
    if (xc.length - yc.length < 0) {
      t = yc;
      yc = xc;
      xc = t;
    }

    e = yc.length;

    // Only start adding at yc.length - 1 as the further digits of xc can be left as they are.
    for (k = 0; e; xc[e] %= 10) k = (xc[--e] = xc[e] + yc[e] + k) / 10 | 0;

    // No need to check for zero, as +x + +y != 0 && -x + -y != 0

    if (k) {
      xc.unshift(k);
      ++ye;
    }

    // Remove trailing zeros.
    for (e = xc.length; xc[--e] === 0;) xc.pop();

    y.c = xc;
    y.e = ye;

    return y;
  };


  /*
   * Return a Big whose value is the value of this Big raised to the power n.
   * If n is negative, round to a maximum of Big.DP decimal places using rounding
   * mode Big.RM.
   *
   * n {number} Integer, -MAX_POWER to MAX_POWER inclusive.
   */
  P.pow = function (n) {
    var x = this,
      one = new x.constructor('1'),
      y = one,
      isneg = n < 0;

    if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) {
      throw Error(INVALID + 'exponent');
    }

    if (isneg) n = -n;

    for (;;) {
      if (n & 1) y = y.times(x);
      n >>= 1;
      if (!n) break;
      x = x.times(x);
    }

    return isneg ? one.div(y) : y;
  };


  /*
   * Return a new Big whose value is the value of this Big rounded to a maximum precision of sd
   * significant digits using rounding mode rm, or Big.RM if rm is not specified.
   *
   * sd {number} Significant digits: integer, 1 to MAX_DP inclusive.
   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   */
  P.prec = function (sd, rm) {
    if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
      throw Error(INVALID + 'precision');
    }
    return round(new this.constructor(this), sd, rm);
  };


  /*
   * Return a new Big whose value is the value of this Big rounded to a maximum of dp decimal places
   * using rounding mode rm, or Big.RM if rm is not specified.
   * If dp is negative, round to an integer which is a multiple of 10**-dp.
   * If dp is not specified, round to 0 decimal places.
   *
   * dp? {number} Integer, -MAX_DP to MAX_DP inclusive.
   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   */
  P.round = function (dp, rm) {
    if (dp === UNDEFINED) dp = 0;
    else if (dp !== ~~dp || dp < -MAX_DP || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }
    return round(new this.constructor(this), dp + this.e + 1, rm);
  };


  /*
   * Return a new Big whose value is the square root of the value of this Big, rounded, if
   * necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
   */
  P.sqrt = function () {
    var r, c, t,
      x = this,
      Big = x.constructor,
      s = x.s,
      e = x.e,
      half = new Big('0.5');

    // Zero?
    if (!x.c[0]) return new Big(x);

    // Negative?
    if (s < 0) {
      throw Error(NAME + 'No square root');
    }

    // Estimate.
    s = Math.sqrt(x + '');

    // Math.sqrt underflow/overflow?
    // Re-estimate: pass x coefficient to Math.sqrt as integer, then adjust the result exponent.
    if (s === 0 || s === 1 / 0) {
      c = x.c.join('');
      if (!(c.length + e & 1)) c += '0';
      s = Math.sqrt(c);
      e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
      r = new Big((s == 1 / 0 ? '5e' : (s = s.toExponential()).slice(0, s.indexOf('e') + 1)) + e);
    } else {
      r = new Big(s + '');
    }

    e = r.e + (Big.DP += 4);

    // Newton-Raphson iteration.
    do {
      t = r;
      r = half.times(t.plus(x.div(t)));
    } while (t.c.slice(0, e).join('') !== r.c.slice(0, e).join(''));

    return round(r, (Big.DP -= 4) + r.e + 1, Big.RM);
  };


  /*
   * Return a new Big whose value is the value of this Big times the value of Big y.
   */
  P.times = P.mul = function (y) {
    var c,
      x = this,
      Big = x.constructor,
      xc = x.c,
      yc = (y = new Big(y)).c,
      a = xc.length,
      b = yc.length,
      i = x.e,
      j = y.e;

    // Determine sign of result.
    y.s = x.s == y.s ? 1 : -1;

    // Return signed 0 if either 0.
    if (!xc[0] || !yc[0]) {
      y.c = [y.e = 0];
      return y;
    }

    // Initialise exponent of result as x.e + y.e.
    y.e = i + j;

    // If array xc has fewer digits than yc, swap xc and yc, and lengths.
    if (a < b) {
      c = xc;
      xc = yc;
      yc = c;
      j = a;
      a = b;
      b = j;
    }

    // Initialise coefficient array of result with zeros.
    for (c = new Array(j = a + b); j--;) c[j] = 0;

    // Multiply.

    // i is initially xc.length.
    for (i = b; i--;) {
      b = 0;

      // a is yc.length.
      for (j = a + i; j > i;) {

        // Current sum of products at this digit position, plus carry.
        b = c[j] + yc[i] * xc[j - i - 1] + b;
        c[j--] = b % 10;

        // carry
        b = b / 10 | 0;
      }

      c[j] = b;
    }

    // Increment result exponent if there is a final carry, otherwise remove leading zero.
    if (b) ++y.e;
    else c.shift();

    // Remove trailing zeros.
    for (i = c.length; !c[--i];) c.pop();
    y.c = c;

    return y;
  };


  /*
   * Return a string representing the value of this Big in exponential notation rounded to dp fixed
   * decimal places using rounding mode rm, or Big.RM if rm is not specified.
   *
   * dp? {number} Decimal places: integer, 0 to MAX_DP inclusive.
   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   */
  P.toExponential = function (dp, rm) {
    var x = this,
      n = x.c[0];

    if (dp !== UNDEFINED) {
      if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
        throw Error(INVALID_DP);
      }
      x = round(new x.constructor(x), ++dp, rm);
      for (; x.c.length < dp;) x.c.push(0);
    }

    return stringify(x, true, !!n);
  };


  /*
   * Return a string representing the value of this Big in normal notation rounded to dp fixed
   * decimal places using rounding mode rm, or Big.RM if rm is not specified.
   *
   * dp? {number} Decimal places: integer, 0 to MAX_DP inclusive.
   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   *
   * (-0).toFixed(0) is '0', but (-0.1).toFixed(0) is '-0'.
   * (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
   */
  P.toFixed = function (dp, rm) {
    var x = this,
      n = x.c[0];

    if (dp !== UNDEFINED) {
      if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
        throw Error(INVALID_DP);
      }
      x = round(new x.constructor(x), dp + x.e + 1, rm);

      // x.e may have changed if the value is rounded up.
      for (dp = dp + x.e + 1; x.c.length < dp;) x.c.push(0);
    }

    return stringify(x, false, !!n);
  };


  /*
   * Return a string representing the value of this Big.
   * Return exponential notation if this Big has a positive exponent equal to or greater than
   * Big.PE, or a negative exponent equal to or less than Big.NE.
   * Omit the sign for negative zero.
   */
  P.toJSON = P.toString = function () {
    var x = this,
      Big = x.constructor;
    return stringify(x, x.e <= Big.NE || x.e >= Big.PE, !!x.c[0]);
  };


  /*
   * Return the value of this Big as a primitve number.
   */
  P.toNumber = function () {
    var n = Number(stringify(this, true, true));
    if (this.constructor.strict === true && !this.eq(n.toString())) {
      throw Error(NAME + 'Imprecise conversion');
    }
    return n;
  };


  /*
   * Return a string representing the value of this Big rounded to sd significant digits using
   * rounding mode rm, or Big.RM if rm is not specified.
   * Use exponential notation if sd is less than the number of digits necessary to represent
   * the integer part of the value in normal notation.
   *
   * sd {number} Significant digits: integer, 1 to MAX_DP inclusive.
   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
   */
  P.toPrecision = function (sd, rm) {
    var x = this,
      Big = x.constructor,
      n = x.c[0];

    if (sd !== UNDEFINED) {
      if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
        throw Error(INVALID + 'precision');
      }
      x = round(new Big(x), sd, rm);
      for (; x.c.length < sd;) x.c.push(0);
    }

    return stringify(x, sd <= x.e || x.e <= Big.NE || x.e >= Big.PE, !!n);
  };


  /*
   * Return a string representing the value of this Big.
   * Return exponential notation if this Big has a positive exponent equal to or greater than
   * Big.PE, or a negative exponent equal to or less than Big.NE.
   * Include the sign for negative zero.
   */
  P.valueOf = function () {
    var x = this,
      Big = x.constructor;
    if (Big.strict === true) {
      throw Error(NAME + 'valueOf disallowed');
    }
    return stringify(x, x.e <= Big.NE || x.e >= Big.PE, true);
  };


  // Export


  Big = _Big_();

  Big['default'] = Big.Big = Big;

  //AMD.
  if (typeof define === 'function' && define.amd) {
    define(function () { return Big; });

  // Node and other CommonJS-like environments that support module.exports.
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Big;

  //Browser.
  } else {
    GLOBAL.Big = Big;
  }
})(this);

},{}],50:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = newDateUTC;

/**
 * Use instead of `new Date(Date.UTC(...))` to support years below 100 which doesn't work
 * otherwise due to the nature of the
 * [`Date` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#interpretation_of_two-digit_years.
 *
 * For `Date.UTC(...)`, use `newDateUTC(...).getTime()`.
 */
function newDateUTC(fullYear, month, day, hour, minute, second, millisecond) {
  var utcDate = new Date(0);
  utcDate.setUTCFullYear(fullYear, month, day);
  utcDate.setUTCHours(hour, minute, second, millisecond);
  return utcDate;
}

module.exports = exports.default;
},{}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tzParseTimezone;

var _index = _interopRequireDefault(require("../tzTokenizeDate/index.js"));

var _index2 = _interopRequireDefault(require("../newDateUTC/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MILLISECONDS_IN_HOUR = 3600000;
var MILLISECONDS_IN_MINUTE = 60000;
var patterns = {
  timezone: /([Z+-].*)$/,
  timezoneZ: /^(Z)$/,
  timezoneHH: /^([+-]\d{2})$/,
  timezoneHHMM: /^([+-])(\d{2}):?(\d{2})$/
}; // Parse various time zone offset formats to an offset in milliseconds

function tzParseTimezone(timezoneString, date, isUtcDate) {
  var token;
  var absoluteOffset; // Empty string

  if (!timezoneString) {
    return 0;
  } // Z


  token = patterns.timezoneZ.exec(timezoneString);

  if (token) {
    return 0;
  }

  var hours; // ±hh

  token = patterns.timezoneHH.exec(timezoneString);

  if (token) {
    hours = parseInt(token[1], 10);

    if (!validateTimezone(hours)) {
      return NaN;
    }

    return -(hours * MILLISECONDS_IN_HOUR);
  } // ±hh:mm or ±hhmm


  token = patterns.timezoneHHMM.exec(timezoneString);

  if (token) {
    hours = parseInt(token[2], 10);
    var minutes = parseInt(token[3], 10);

    if (!validateTimezone(hours, minutes)) {
      return NaN;
    }

    absoluteOffset = Math.abs(hours) * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE;
    return token[1] === '+' ? -absoluteOffset : absoluteOffset;
  } // IANA time zone


  if (isValidTimezoneIANAString(timezoneString)) {
    date = new Date(date || Date.now());
    var utcDate = isUtcDate ? date : toUtcDate(date);
    var offset = calcOffset(utcDate, timezoneString);
    var fixedOffset = isUtcDate ? offset : fixOffset(date, offset, timezoneString);
    return -fixedOffset;
  }

  return NaN;
}

function toUtcDate(date) {
  return (0, _index2.default)(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
}

function calcOffset(date, timezoneString) {
  var tokens = (0, _index.default)(date, timezoneString); // ms dropped because it's not provided by tzTokenizeDate

  var asUTC = (0, _index2.default)(tokens[0], tokens[1] - 1, tokens[2], tokens[3] % 24, tokens[4], tokens[5], 0).getTime();
  var asTS = date.getTime();
  var over = asTS % 1000;
  asTS -= over >= 0 ? over : 1000 + over;
  return asUTC - asTS;
}

function fixOffset(date, offset, timezoneString) {
  var localTS = date.getTime(); // Our UTC time is just a guess because our offset is just a guess

  var utcGuess = localTS - offset; // Test whether the zone matches the offset for this ts

  var o2 = calcOffset(new Date(utcGuess), timezoneString); // If so, offset didn't change, and we're done

  if (offset === o2) {
    return offset;
  } // If not, change the ts by the difference in the offset


  utcGuess -= o2 - offset; // If that gives us the local time we want, we're done

  var o3 = calcOffset(new Date(utcGuess), timezoneString);

  if (o2 === o3) {
    return o2;
  } // If it's different, we're in a hole time. The offset has changed, but we don't adjust the time


  return Math.max(o2, o3);
}

function validateTimezone(hours, minutes) {
  return -23 <= hours && hours <= 23 && (minutes == null || 0 <= minutes && minutes <= 59);
}

var validIANATimezoneCache = {};

function isValidTimezoneIANAString(timeZoneString) {
  if (validIANATimezoneCache[timeZoneString]) return true;

  try {
    new Intl.DateTimeFormat(undefined, {
      timeZone: timeZoneString
    });
    validIANATimezoneCache[timeZoneString] = true;
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = exports.default;
},{"../newDateUTC/index.js":50,"../tzTokenizeDate/index.js":52}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tzTokenizeDate;

/**
 * Returns the [year, month, day, hour, minute, seconds] tokens of the provided
 * `date` as it will be rendered in the `timeZone`.
 */
function tzTokenizeDate(date, timeZone) {
  var dtf = getDateTimeFormat(timeZone);
  return dtf.formatToParts ? partsOffset(dtf, date) : hackyOffset(dtf, date);
}

var typeToPos = {
  year: 0,
  month: 1,
  day: 2,
  hour: 3,
  minute: 4,
  second: 5
};

function partsOffset(dtf, date) {
  try {
    var formatted = dtf.formatToParts(date);
    var filled = [];

    for (var i = 0; i < formatted.length; i++) {
      var pos = typeToPos[formatted[i].type];

      if (pos >= 0) {
        filled[pos] = parseInt(formatted[i].value, 10);
      }
    }

    return filled;
  } catch (error) {
    if (error instanceof RangeError) {
      return [NaN];
    }

    throw error;
  }
}

function hackyOffset(dtf, date) {
  var formatted = dtf.format(date);
  var parsed = /(\d+)\/(\d+)\/(\d+),? (\d+):(\d+):(\d+)/.exec(formatted); // var [, fMonth, fDay, fYear, fHour, fMinute, fSecond] = parsed
  // return [fYear, fMonth, fDay, fHour, fMinute, fSecond]

  return [parsed[3], parsed[1], parsed[2], parsed[4], parsed[5], parsed[6]];
} // Get a cached Intl.DateTimeFormat instance for the IANA `timeZone`. This can be used
// to get deterministic local date/time output according to the `en-US` locale which
// can be used to extract local time parts as necessary.


var dtfCache = {};

function getDateTimeFormat(timeZone) {
  if (!dtfCache[timeZone]) {
    // New browsers use `hourCycle`, IE and Chrome <73 does not support it and uses `hour12`
    var testDateFormatted = new Intl.DateTimeFormat('en-US', {
      hourCycle: 'h23',
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date('2014-06-25T04:00:00.123Z'));
    var hourCycleSupported = testDateFormatted === '06/25/2014, 00:00:00' || testDateFormatted === '‎06‎/‎25‎/‎2014‎ ‎00‎:‎00‎:‎00';
    dtfCache[timeZone] = hourCycleSupported ? new Intl.DateTimeFormat('en-US', {
      hourCycle: 'h23',
      timeZone: timeZone,
      year: 'numeric',
      month: 'numeric',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) : new Intl.DateTimeFormat('en-US', {
      hour12: false,
      timeZone: timeZone,
      year: 'numeric',
      month: 'numeric',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  return dtfCache[timeZone];
}

module.exports = exports.default;
},{}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getTimezoneOffset;

var _index = _interopRequireDefault(require("../_lib/tzParseTimezone/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @name getTimezoneOffset
 * @category Time Zone Helpers
 * @summary Gets the offset in milliseconds between the time zone and Universal Coordinated Time (UTC)
 *
 * @description
 * Returns the time zone offset from UTC time in milliseconds for IANA time zones as well
 * as other time zone offset string formats.
 *
 * For time zones where daylight savings time is applicable a `Date` should be passed on
 * the second parameter to ensure the offset correctly accounts for DST at that time of
 * year. When omitted, the current date is used.
 *
 * @param {String} timeZone - the time zone of this local time, can be an offset or IANA time zone
 * @param {Date|Number} [date] - the date with values representing the local time
 * @returns {Number} the time zone offset in milliseconds
 *
 * @example
 * const result = getTimezoneOffset('-07:00')
 *   //=> -18000000 (-7 * 60 * 60 * 1000)
 * const result = getTimezoneOffset('Africa/Johannesburg')
 *   //=> 7200000 (2 * 60 * 60 * 1000)
 * const result = getTimezoneOffset('America/New_York', new Date(2016, 0, 1))
 *   //=> -18000000 (-5 * 60 * 60 * 1000)
 * const result = getTimezoneOffset('America/New_York', new Date(2016, 6, 1))
 *   //=> -14400000 (-4 * 60 * 60 * 1000)
 */
function getTimezoneOffset(timeZone, date) {
  return -(0, _index.default)(timeZone, date);
}

module.exports = exports.default;
},{"../_lib/tzParseTimezone/index.js":51}],54:[function(require,module,exports){
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

},{"../../../lib/marketState/CumulativeVolume":4}],55:[function(require,module,exports){
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

},{"../../../lib/marketState/Profile":5}],56:[function(require,module,exports){
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

},{"./../../../../lib/utilities/convert/baseCodeToUnitCode":6}],57:[function(require,module,exports){
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

},{"./../../../../lib/utilities/convert/dateToDayCode":7}],58:[function(require,module,exports){
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

},{"./../../../../lib/utilities/convert/dayCodeToNumber":8}],59:[function(require,module,exports){
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

},{"./../../../../lib/utilities/convert/monthCodeToName":9}],60:[function(require,module,exports){
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

},{"./../../../../lib/utilities/convert/monthCodeToNumber":10}],61:[function(require,module,exports){
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

},{"./../../../../lib/utilities/convert/numberToDayCode":11}],62:[function(require,module,exports){
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

},{"./../../../../lib/utilities/convert/unitCodeToBaseCode":12}],63:[function(require,module,exports){
const AssetClass = require('../../../../lib/utilities/data/AssetClass');
describe('When parsing asset class codes', () => {
  it('"STK" should parse as "AssetClass.STOCK"', () => {
    expect(AssetClass.parse('STK')).toEqual(AssetClass.STOCK);
  });
  it('"STKOPT" should parse as "AssetClass.STOCK_OPTION"', () => {
    expect(AssetClass.parse('STKOPT')).toEqual(AssetClass.STOCK_OPTION);
  });
  it('"FUT" should parse as "AssetClass.FUTURE"', () => {
    expect(AssetClass.parse('FUT')).toEqual(AssetClass.FUTURE);
  });
  it('"FUTOPT" should parse as "AssetClass.FUTURE_OPTION"', () => {
    expect(AssetClass.parse('FUTOPT')).toEqual(AssetClass.FUTURE_OPTION);
  });
  it('"FOREX" should parse as "AssetClass.FOREX"', () => {
    expect(AssetClass.parse('FOREX')).toEqual(AssetClass.FOREX);
  });
  it('"CMDTY" should parse as "AssetClass.CMDTY_STATS"', () => {
    expect(AssetClass.parse('CMDTY')).toEqual(AssetClass.CMDTY_STATS);
  });
});
describe('When retrieving identifier from asset classes', () => {
  it('AssetClass.STOCK.id should return 1', () => {
    expect(AssetClass.STOCK.id).toEqual(1);
  });
  it('AssetClass.STOCK_OPTION.id should return 34', () => {
    expect(AssetClass.STOCK_OPTION.id).toEqual(34);
  });
  it('AssetClass.FUTURE.id should return 2', () => {
    expect(AssetClass.FUTURE.id).toEqual(2);
  });
  it('AssetClass.FUTURE_OPTION.id should return 12', () => {
    expect(AssetClass.FUTURE_OPTION.id).toEqual(12);
  });
  it('AssetClass.FOREX.id should return 10', () => {
    expect(AssetClass.FOREX.id).toEqual(10);
  });
  it('AssetClass.CMDTY_STATS.id should return 24', () => {
    expect(AssetClass.CMDTY_STATS.id).toEqual(24);
  });
});

},{"../../../../lib/utilities/data/AssetClass":13}],64:[function(require,module,exports){
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
describe('When calculating minimum ticks and minimum tick values', () => {
  describe('For unit code "2" and with a tickIncrement of 2 and a pointValue of 50 (e.g. corn)', () => {
    let uc;
    beforeEach(() => {
      uc = UnitCode.parse('2');
    });
    it('The minimum tick should be 0.25', () => {
      expect(uc.getMinimumTick(2)).toEqual(0.25);
    });
    it('The minimum tick value should be 12.50', () => {
      expect(uc.getMinimumTickValue(2, 50)).toEqual(12.5);
    });
  });
  describe('For unit code "A" and with a tickIncrement of 25 and a pointValue of 50 (e.g. e-mini)', () => {
    let uc;
    beforeEach(() => {
      uc = UnitCode.parse('A');
    });
    it('The minimum tick should be 0.25', () => {
      expect(uc.getMinimumTick(25)).toEqual(0.25);
    });
    it('The minimum tick value should be 12.50', () => {
      expect(uc.getMinimumTickValue(25, 50)).toEqual(12.5);
    });
  });
  describe('For unit code "A" and with a tickIncrement of 1 and a pointValue of 1000 (e.g. crude)', () => {
    let uc;
    beforeEach(() => {
      uc = UnitCode.parse('A');
    });
    it('The minimum tick should be 0.01', () => {
      expect(uc.getMinimumTick(1)).toEqual(0.01);
    });
    it('The minimum tick value should be 10', () => {
      expect(uc.getMinimumTickValue(1, 1000)).toEqual(10);
    });
  });
  describe('For unit code "9" and with a tickIncrement of 1 and a pointValue of 100 (e.g. gold)', () => {
    let uc;
    beforeEach(() => {
      uc = UnitCode.parse('9');
    });
    it('The minimum tick should be 0.1', () => {
      expect(uc.getMinimumTick(1)).toEqual(0.1);
    });
    it('The minimum tick value should be 10', () => {
      expect(uc.getMinimumTickValue(1, 100)).toEqual(10);
    });
  });
  describe('For unit code "5" and with a tickIncrement of 1 and a pointValue of 1,000 (e.g. t-notes)', () => {
    let uc;
    beforeEach(() => {
      uc = UnitCode.parse('5');
    });
    it('The minimum tick should be 0.015625', () => {
      expect(uc.getMinimumTick(1)).toEqual(0.015625);
    });
    it('The minimum tick value should be 15.625', () => {
      expect(uc.getMinimumTickValue(1, 1000)).toEqual(15.625);
    });
  });
  describe('For unit code "E" and with a tickIncrement of 10 and a pointValue of 500,000 (e.g. mexican pesos)', () => {
    let uc;
    beforeEach(() => {
      uc = UnitCode.parse('E');
    });
    it('The minimum tick should be 0.015625', () => {
      expect(uc.getMinimumTick(10)).toEqual(0.00001);
    });
    it('The minimum tick value should be 15.625', () => {
      expect(uc.getMinimumTickValue(10, 500000)).toEqual(5);
    });
  });
});
describe('When rounding a value to the nearest tick value', () => {
  describe('For unit code "2" and with a tickIncrement of 2 (e.g. corn)', () => {
    let uc;
    let mt;
    beforeEach(() => {
      uc = UnitCode.parse('2');
      mt = uc.getMinimumTick(2);
    });
    it('A value of 0 should be rounded to 0', () => {
      expect(uc.roundToNearestTick(0, mt)).toEqual(0);
    });
    it('A value of 488.5 should be rounded to 488.5', () => {
      expect(uc.roundToNearestTick(488.5, mt)).toEqual(488.5);
    });
    it('A value of 488.51 should be rounded to 488.5', () => {
      expect(uc.roundToNearestTick(488.51, mt)).toEqual(488.5);
    });
    it('A value of 488.74 should be rounded to 488.75', () => {
      expect(uc.roundToNearestTick(488.74, mt)).toEqual(488.75);
    });
    it('A value of 488.625 should be rounded to 488.75', () => {
      expect(uc.roundToNearestTick(488.625, mt)).toEqual(488.75);
    });
    it('A value of 488.625 should be rounded to 488.5 (when using "roundDown" option)', () => {
      expect(uc.roundToNearestTick(488.625, mt, true)).toEqual(488.5);
    });
  });
  describe('For unit code "A" and with a tickIncrement of 25 (e.g. e-mini)', () => {
    let uc;
    let mt;
    beforeEach(() => {
      uc = UnitCode.parse('A');
      mt = uc.getMinimumTick(25);
    });
    it('A value of 4455.5 should be rounded to 4455.5', () => {
      expect(uc.roundToNearestTick(4455.5, mt)).toEqual(4455.5);
    });
    it('A value of 4455.51 should be rounded to 4455.5', () => {
      expect(uc.roundToNearestTick(4455.51, mt)).toEqual(4455.5);
    });
    it('A value of 4455.74 should be rounded to 4455.75', () => {
      expect(uc.roundToNearestTick(4455.74, mt)).toEqual(4455.75);
    });
    it('A value of 4455.625 should be rounded to 4455.75', () => {
      expect(uc.roundToNearestTick(4455.625, mt)).toEqual(4455.75);
    });
    it('A value of 4455.625 should be rounded to 4455.5 (when using "roundDown" option)', () => {
      expect(uc.roundToNearestTick(4455.625, mt, true)).toEqual(4455.5);
    });
  });
  describe('For unit code "A" and with a tickIncrement of 1 (e.g. crude)', () => {
    let uc;
    let mt;
    beforeEach(() => {
      uc = UnitCode.parse('A');
      mt = uc.getMinimumTick(1);
    });
    it('A value of 87.30 should be rounded to 87.30', () => {
      expect(uc.roundToNearestTick(87.30, mt)).toEqual(87.30);
    });
    it('A value of 87.31 should be rounded to 87.31', () => {
      expect(uc.roundToNearestTick(87.31, mt)).toEqual(87.31);
    });
    it('A value of 87.312 should be rounded to 87.31', () => {
      expect(uc.roundToNearestTick(87.312, mt)).toEqual(87.31);
    });
    it('A value of 87.318 should be rounded to 87.32', () => {
      expect(uc.roundToNearestTick(87.318, mt)).toEqual(87.32);
    });
    it('A value of 87.325 should be rounded to 87.33', () => {
      expect(uc.roundToNearestTick(87.325, mt)).toEqual(87.33);
    });
    it('A value of 87.325 should be rounded to 87.32 (when using "roundDown" option)', () => {
      expect(uc.roundToNearestTick(87.325, mt, true)).toEqual(87.32);
    });
  });
  describe('For unit code "9" and with a tickIncrement of 1 (e.g. gold)', () => {
    let uc;
    let mt;
    beforeEach(() => {
      uc = UnitCode.parse('9');
      mt = uc.getMinimumTick(1);
    });
    it('A value of 1922.5 should be rounded to 1922.5', () => {
      expect(uc.roundToNearestTick(1922.5, mt)).toEqual(1922.5);
    });
    it('A value of 1922.6 should be rounded to 1922.6', () => {
      expect(uc.roundToNearestTick(1922.6, mt)).toEqual(1922.6);
    });
    it('A value of 1922.51 should be rounded to 1922.5', () => {
      expect(uc.roundToNearestTick(1922.51, mt)).toEqual(1922.5);
    });
    it('A value of 1922.59 should be rounded to 1922.6', () => {
      expect(uc.roundToNearestTick(1922.59, mt)).toEqual(1922.6);
    });
    it('A value of 1922.55 should be rounded to 1922.6', () => {
      expect(uc.roundToNearestTick(1922.55, mt)).toEqual(1922.6);
    });
    it('A value of 1922.55 should be rounded to 1922.5 (when using "roundDown" option)', () => {
      expect(uc.roundToNearestTick(1922.55, mt, true)).toEqual(1922.5);
    });
  });
  describe('For unit code "5" and with a tickIncrement of 1 (e.g. t-notes)', () => {
    let uc;
    let mt;
    beforeEach(() => {
      uc = UnitCode.parse('5');
      mt = uc.getMinimumTick(1);
    });
    it('A value of 110.328125 should be rounded to 110.328125', () => {
      expect(uc.roundToNearestTick(110.328125, mt)).toEqual(110.328125);
    });
    it('A value of 110.34375 should be rounded to 110.34375', () => {
      expect(uc.roundToNearestTick(110.34375, mt)).toEqual(110.34375);
    });
    it('A value of 110.328126 should be rounded to 110.328125', () => {
      expect(uc.roundToNearestTick(110.328126, mt)).toEqual(110.328125);
    });
    it('A value of 110.34374 should be rounded to 110.34375', () => {
      expect(uc.roundToNearestTick(110.34374, mt)).toEqual(110.34375);
    });
    it('A value of 110.34374 should be rounded to 110.328125 (when using "roundDown" option)', () => {
      expect(uc.roundToNearestTick(110.34374, mt, true)).toEqual(110.328125);
    });
  });
});

},{"../../../../lib/utilities/data/UnitCode":14}],65:[function(require,module,exports){
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

},{"../../../../lib/utilities/data/monthCodes":15}],66:[function(require,module,exports){
const string = require('@barchart/common-js/lang/string');
const formatPrice = require('./../../../../lib/utilities/format/price');

// 2021/07/12, BRI. These tests are based on mapping tables (between decimal
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
const THIRTY_SECONDS = [
// 1/32nd = 0-01 (numerator shown, denominator implied) = 1/32 = 0.3125,
// 2/32nd = 0-02 (numerator shown, denominator implied) = 2/32 = 0.0625...

[0, 0], [1, 0.03125], [2, 0.0625], [3, 0.09375], [4, 0.125], [5, 0.15625], [6, 0.1875], [7, 0.21875], [8, 0.25], [9, 0.28125], [10, 0.3125], [11, 0.34375], [12, 0.375], [13, 0.40625], [14, 0.4375], [15, 0.46875], [16, 0.5], [17, 0.53125], [18, 0.5625], [19, 0.59375], [20, 0.625], [21, 0.65625], [22, 0.6875], [23, 0.71875], [24, 0.75], [25, 0.78125], [26, 0.8125], [27, 0.84375], [28, 0.875], [29, 0.90625], [30, 0.9375], [31, 0.96875]];
const HALVES_OF_THIRTY_SECONDS = [
// 0/32nds + 1/2 of a 32nd = 0.5/32nd = 0-005 (numerator shown without decimal point, denominator implied) = 0.5/32 = 0.015625,
// 1/32nds + 0/2 of a 32nd = 1.0/32nd = 0-010 (numerator shown without decimal point, denominator implied) = 1/32 = 0.32125,
// 1/32nds + 1/2 of a 32nd = 1.5/32nd = 0-015 (numerator shown without decimal point, denominator implied) = 1.5/32 = 0.046875...

[0, 0], [5, 0.015625], [10, 0.03125], [15, 0.046875], [20, 0.0625], [25, 0.078125], [30, 0.09375], [35, 0.109375], [40, 0.125], [45, 0.140625], [50, 0.15625], [55, 0.171875], [60, 0.1875], [65, 0.203125], [70, 0.21875], [75, 0.234375], [80, 0.25], [85, 0.265625], [90, 0.28125], [95, 0.296875], [100, 0.3125], [105, 0.328125], [110, 0.34375], [115, 0.359375], [120, 0.375], [125, 0.390625], [130, 0.40625], [135, 0.421875], [140, 0.4375], [145, 0.453125], [150, 0.46875], [155, 0.484375], [160, 0.5], [165, 0.515625], [170, 0.53125], [175, 0.546875], [180, 0.5625], [185, 0.578125], [190, 0.59375], [195, 0.609375], [200, 0.625], [205, 0.640625], [210, 0.65625], [215, 0.671875], [220, 0.6875], [225, 0.703125], [230, 0.71875], [235, 0.734375], [240, 0.75], [245, 0.765625], [250, 0.78125], [255, 0.796875], [260, 0.8125], [265, 0.828125], [270, 0.84375], [275, 0.859375], [280, 0.875], [285, 0.890625], [290, 0.90625], [295, 0.921875], [300, 0.9375], [305, 0.953125], [310, 0.96875], [315, 0.984375]];
const QUARTERS_OF_THIRTY_SECONDS = [
// 0/32nds + 1/4 of a 32nd = 0.25/32nd = 0-002[5] = 0-002 (numerator shown without decimal point and omitting last digit, denominator implied) = 0.25/32 = 0.0078125,
// 0/32nds + 2/4 of a 32nd = 0.50/32nd = 0-005[0] = 0-005 (numerator shown without decimal point and omitting last digit, denominator implied) = 0.50/32 = 0.015625,
// 0/32nds + 3/4 of a 32nd = 0.75/32nd = 0-007[5] = 0-007 (numerator shown without decimal point and omitting last digit, denominator implied) = 0.75/32 = 0.0234375,
// 1/32nds + 0/4 of a 32nd = 1.00/32nd = 0-010[0] = 0-010 (numerator shown without decimal point and omitting last digit, denominator implied) = 1/32 = 0.03125,
// 1/32nds + 1/4 of a 32nd = 1.25/32nd = 0-012[5] = 0-012 (numerator shown without decimal point and omitting last digit, denominator implied) = 1.25/32 = 0.0390625 ...

[0, 0], [2, 0.0078125], [5, 0.015625], [7, 0.0234375], [10, 0.03125], [12, 0.0390625], [15, 0.046875], [17, 0.0546875], [20, 0.0625], [22, 0.0703125], [25, 0.078125], [27, 0.0859375], [30, 0.09375], [32, 0.1015625], [35, 0.109375], [37, 0.1171875], [40, 0.125], [42, 0.1328125], [45, 0.140625], [47, 0.1484375], [50, 0.15625], [52, 0.1640625], [55, 0.171875], [57, 0.1796875], [60, 0.1875], [62, 0.1953125], [65, 0.203125], [67, 0.2109375], [70, 0.21875], [72, 0.2265625], [75, 0.234375], [77, 0.2421875], [80, 0.25], [82, 0.2578125], [85, 0.265625], [87, 0.2734375], [90, 0.28125], [92, 0.2890625], [95, 0.296875], [97, 0.3046875], [100, 0.3125], [102, 0.3203125], [105, 0.328125], [107, 0.3359375], [110, 0.34375], [112, 0.3515625], [115, 0.359375], [117, 0.3671875], [120, 0.375], [122, 0.3828125], [125, 0.390625], [127, 0.3984375], [130, 0.40625], [132, 0.4140625], [135, 0.421875], [137, 0.4296875], [140, 0.4375], [142, 0.4453125], [145, 0.453125], [147, 0.4609375], [150, 0.46875], [152, 0.4765625], [155, 0.484375], [157, 0.4921875], [160, 0.5], [162, 0.5078125], [165, 0.515625], [167, 0.5234375], [170, 0.53125], [172, 0.5390625], [175, 0.546875], [177, 0.5546875], [180, 0.5625], [182, 0.5703125], [185, 0.578125], [187, 0.5859375], [190, 0.59375], [192, 0.6015625], [195, 0.609375], [197, 0.6171875], [200, 0.625], [202, 0.6328125], [205, 0.640625], [207, 0.6484375], [210, 0.65625], [212, 0.6640625], [215, 0.671875], [217, 0.6796875], [220, 0.6875], [222, 0.6953125], [225, 0.703125], [227, 0.7109375], [230, 0.71875], [232, 0.7265625], [235, 0.734375], [237, 0.7421875], [240, 0.75], [242, 0.7578125], [245, 0.765625], [247, 0.7734375], [250, 0.78125], [252, 0.7890625], [255, 0.796875], [257, 0.8046875], [260, 0.8125], [262, 0.8203125], [265, 0.828125], [267, 0.8359375], [270, 0.84375], [272, 0.8515625], [275, 0.859375], [277, 0.8671875], [280, 0.875], [282, 0.8828125], [285, 0.890625], [287, 0.8984375], [290, 0.90625], [292, 0.9140625], [295, 0.921875], [297, 0.9296875], [300, 0.9375], [302, 0.9453125], [305, 0.953125], [307, 0.9609375], [310, 0.96875], [312, 0.9765625], [315, 0.984375], [317, 0.9921875]];
const EIGHTHS_OF_THIRTY_SECONDS = [
// 0/32nds + 1/8 of a 32nd = 0.125/32nd = 0-001[25] = 0-001 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.125/32 = 0.00390625,
// 0/32nds + 2/8 of a 32nd = 0.250/32nd = 0-002[50] = 0-002 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.250/32 = 0.0078125,
// 0/32nds + 3/8 of a 32nd = 0.75/32nd = 0-003[75] = 0-003 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.375/32 = 0.01171875,
// 0/32nds + 4/8 of a 32nd = 1.00/32nd = 0-005[00] = 0-005 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.500/32 = 0.015625,
// 0/32nds + 5/8 of a 32nd = 1.25/32nd = 0-006[25] = 0-006 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.625/32 = 0.01953125,
// 0/32nds + 6/8 of a 32nd = 0.25/32nd = 0-007[50] = 0-007 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.750/32 = 0.0234375,
// 0/32nds + 7/8 of a 32nd = 0.50/32nd = 0-008[75] = 0-008 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 0.875/32 = 0.02734375,
// 0/32nds + 0/8 of a 32nd = 0.75/32nd = 0-010[00] = 0-010 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 1.000/32 = 0.03125,
// 0/32nds + 1/8 of a 32nd = 1.00/32nd = 0-011[25] = 0-011 (numerator shown without decimal point and omitting last digit(s), denominator implied) = 1.125/32 = 0.03515625...

[0, 0], [1, 0.00390625], [2, 0.0078125], [3, 0.01171875], [5, 0.015625], [6, 0.01953125], [7, 0.0234375], [8, 0.02734375], [10, 0.03125], [11, 0.03515625], [12, 0.0390625], [13, 0.04296875], [15, 0.046875], [16, 0.05078125], [17, 0.0546875], [18, 0.05859375], [20, 0.0625], [21, 0.06640625], [22, 0.0703125], [23, 0.07421875], [25, 0.078125], [26, 0.08203125], [27, 0.0859375], [28, 0.08984375], [30, 0.09375], [31, 0.09765625], [32, 0.1015625], [33, 0.10546875], [35, 0.109375], [36, 0.11328125], [37, 0.1171875], [38, 0.12109375], [40, 0.125], [41, 0.12890625], [42, 0.1328125], [43, 0.13671875], [45, 0.140625], [46, 0.14453125], [47, 0.1484375], [48, 0.15234375], [50, 0.15625], [51, 0.16015625], [52, 0.1640625], [53, 0.16796875], [55, 0.171875], [56, 0.17578125], [57, 0.1796875], [58, 0.18359375], [60, 0.1875], [61, 0.19140625], [62, 0.1953125], [63, 0.19921875], [65, 0.203125], [66, 0.20703125], [67, 0.2109375], [68, 0.21484375], [70, 0.21875], [71, 0.22265625], [72, 0.2265625], [73, 0.23046875], [75, 0.234375], [76, 0.23828125], [77, 0.2421875], [78, 0.24609375], [80, 0.25], [81, 0.25390625], [82, 0.2578125], [83, 0.26171875], [85, 0.265625], [86, 0.26953125], [87, 0.2734375], [88, 0.27734375], [90, 0.28125], [91, 0.28515625], [92, 0.2890625], [93, 0.29296875], [95, 0.296875], [96, 0.30078125], [97, 0.3046875], [98, 0.30859375], [100, 0.3125], [101, 0.31640625], [102, 0.3203125], [103, 0.32421875], [105, 0.328125], [106, 0.33203125], [107, 0.3359375], [108, 0.33984375], [110, 0.34375], [111, 0.34765625], [112, 0.3515625], [113, 0.35546875], [115, 0.359375], [116, 0.36328125], [117, 0.3671875], [118, 0.37109375], [120, 0.375], [121, 0.37890625], [122, 0.3828125], [123, 0.38671875], [125, 0.390625], [126, 0.39453125], [127, 0.3984375], [128, 0.40234375], [130, 0.40625], [131, 0.41015625], [132, 0.4140625], [133, 0.41796875], [135, 0.421875], [136, 0.42578125], [137, 0.4296875], [138, 0.43359375], [140, 0.4375], [141, 0.44140625], [142, 0.4453125], [143, 0.44921875], [145, 0.453125], [146, 0.45703125], [147, 0.4609375], [148, 0.46484375], [150, 0.46875], [151, 0.47265625], [152, 0.4765625], [153, 0.48046875], [155, 0.484375], [156, 0.48828125], [157, 0.4921875], [158, 0.49609375], [160, 0.5], [161, 0.50390625], [162, 0.5078125], [163, 0.51171875], [165, 0.515625], [166, 0.51953125], [167, 0.5234375], [168, 0.52734375], [170, 0.53125], [171, 0.53515625], [172, 0.5390625], [173, 0.54296875], [175, 0.546875], [176, 0.55078125], [177, 0.5546875], [178, 0.55859375], [180, 0.5625], [181, 0.56640625], [182, 0.5703125], [183, 0.57421875], [185, 0.578125], [186, 0.58203125], [187, 0.5859375], [188, 0.58984375], [190, 0.59375], [191, 0.59765625], [192, 0.6015625], [193, 0.60546875], [195, 0.609375], [196, 0.61328125], [197, 0.6171875], [198, 0.62109375], [200, 0.625], [201, 0.62890625], [202, 0.6328125], [203, 0.63671875], [205, 0.640625], [206, 0.64453125], [207, 0.6484375], [208, 0.65234375], [210, 0.65625], [211, 0.66015625], [212, 0.6640625], [213, 0.66796875], [215, 0.671875], [216, 0.67578125], [217, 0.6796875], [218, 0.68359375], [220, 0.6875], [221, 0.69140625], [222, 0.6953125], [223, 0.69921875], [225, 0.703125], [226, 0.70703125], [227, 0.7109375], [228, 0.71484375], [230, 0.71875], [231, 0.72265625], [232, 0.7265625], [233, 0.73046875], [235, 0.734375], [236, 0.73828125], [237, 0.7421875], [238, 0.74609375], [240, 0.75], [241, 0.75390625], [242, 0.7578125], [243, 0.76171875], [245, 0.765625], [246, 0.76953125], [247, 0.7734375], [248, 0.77734375], [250, 0.78125], [251, 0.78515625], [252, 0.7890625], [253, 0.79296875], [255, 0.796875], [256, 0.80078125], [257, 0.8046875], [258, 0.80859375], [260, 0.8125], [261, 0.81640625], [262, 0.8203125], [263, 0.82421875], [265, 0.828125], [266, 0.83203125], [267, 0.8359375], [268, 0.83984375], [270, 0.84375], [271, 0.84765625], [272, 0.8515625], [273, 0.85546875], [275, 0.859375], [276, 0.86328125], [277, 0.8671875], [278, 0.87109375], [280, 0.875], [281, 0.87890625], [282, 0.8828125], [283, 0.88671875], [285, 0.890625], [286, 0.89453125], [287, 0.8984375], [288, 0.90234375], [290, 0.90625], [291, 0.91015625], [292, 0.9140625], [293, 0.91796875], [295, 0.921875], [296, 0.92578125], [297, 0.9296875], [298, 0.93359375], [300, 0.9375], [301, 0.94140625], [302, 0.9453125], [303, 0.94921875], [305, 0.953125], [306, 0.95703125], [307, 0.9609375], [308, 0.96484375], [310, 0.96875], [311, 0.97265625], [312, 0.9765625], [313, 0.98046875], [315, 0.984375], [316, 0.98828125], [317, 0.9921875], [318, 0.99609375]];

},{"./../../../../lib/utilities/format/price":21,"@barchart/common-js/lang/string":41}],67:[function(require,module,exports){
const formatDate = require('./../../../../lib/utilities/format/date');
describe('when using the date formatter', () => {
  it('A date set to 2019-09-30 23:59:59 should return "09/30/19"', () => {
    expect(formatDate(new Date(2019, 8, 30, 23, 59, 59))).toEqual('09/30/19');
  });
  it('A date set to 2019-09-30 00:00:00 should return "09/30/19"', () => {
    expect(formatDate(new Date(2019, 8, 30, 0, 0, 0))).toEqual('09/30/19');
  });
});

},{"./../../../../lib/utilities/format/date":16}],68:[function(require,module,exports){
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

},{"./../../../../lib/utilities/format/decimal":17}],69:[function(require,module,exports){
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

},{"./../../../../../lib/utilities/format/factories/price":18}],70:[function(require,module,exports){
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

},{"./../../../../../lib/utilities/format/factories/quote":19}],71:[function(require,module,exports){
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

},{"./../../../../lib/utilities/format/fraction":20}],72:[function(require,module,exports){
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
  describe('with a unit code of "F"', () => {
    describe('with a decimal fraction separator', () => {
      it('formats 0 as "0"', () => {
        expect(formatPrice(0, 'F', '.')).toEqual('0.0000000');
      });
      it('formats 0.007312 as "0.0073120"', () => {
        expect(formatPrice(0.007312, 'F', '.')).toEqual('0.0073120');
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

},{"./../../../../lib/utilities/format/price":21}],73:[function(require,module,exports){
const Timezones = require('@barchart/common-js/lang/Timezones');
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
    describe('and the quote time is 1:08:09 PM, the quote timeUtc is undefined, and exchangeRef is present', () => {
      beforeEach(() => {
        quote.time = new Date(2016, 4, 3, 13, 8, 9);
        quote.timeUtc = undefined;
      });
      it('the formatter outputs "13:08:09" (when output timezone is not specified)', () => {
        expect(formatQuote(quote)).toEqual('13:08:09');
      });
      it('the formatter outputs does not throw an error when output timezone is specified', () => {
        expect(() => formatQuote(quote, false, false, "America/New_York")).not.toThrow();
      });
      it('the formatter outputs "13:08:09" (when output timezone is "America/New_York")', () => {
        expect(formatQuote(quote)).toEqual('13:08:09', false, false, "America/New_York");
      });
      it('the formatter outputs "13:08:09" (when output timezone is "America/Denver")', () => {
        expect(formatQuote(quote)).toEqual('13:08:09', false, false, "America/Denver");
      });
    });
    describe('and the quote timeUtc is 2:00:01 AM UTC (and exchangeRef is present)', () => {
      let expected = {};
      beforeEach(() => {
        if (Timezones.parse('America/New_York').getIsDaylightSavingsTime()) {
          expected.chicago = '22:00:01';
        } else {
          expected.chicago = '21:00:01';
        }
        if (Timezones.parse('America/Denver').getIsDaylightSavingsTime()) {
          expected.denver = '20:00:01';
        } else {
          expected.denver = '19:00:01';
        }
        const milliseconds = Date.UTC(2022, 6, 1, 2, 0, 1);
        quote.time = new Date(1, 2, 3, 4, 5, 6); //ignored
        quote.timeUtc = new Date(milliseconds);
      });
      it('the formatter outputs "22:00:01" (when asked to display time in the "America/New_York" timezone)', () => {
        expect(formatQuote(quote, false, false, "America/New_York")).toEqual(expected.chicago);
      });
      it('the formatter outputs "20:00:01" (when asked to display time in the "America/Denver" timezone)', () => {
        expect(formatQuote(quote, false, false, "America/Denver")).toEqual(expected.denver);
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

},{"./../../../../lib/utilities/format/quote":22,"@barchart/common-js/lang/Timezones":36}],74:[function(require,module,exports){
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

},{"./../../../../../lib/marketState/Profile":5,"./../../../../../lib/utilities/format/specialized/cmdtyView":23}],75:[function(require,module,exports){
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

},{"./../../../../lib/utilities/format/symbol":24}],76:[function(require,module,exports){

},{}],77:[function(require,module,exports){
const parseMessage = require('../../../../../lib/utilities/parse/ddf/message');
const XmlParserFactoryForNode = require('./../../../../../lib/utilities/xml/XmlParserFactoryForNode');
function translateCaretControlCharacters(message) {
  return message.replace(/\^A/g, '\x01').replace(/\^B/g, '\x02').replace(/\^C/g, '\x03').replace(/\^D/g, '\x04').replace(/\^T/g, '\x20');
}

/*
describe('when parsing ad hoc DDF messages', () => {
	'use strict';

	let x;

	beforeEach(() => {
		x = parseMessage(translateCaretControlCharacters(`^A2NIO,7^BAN151027,100,KT^C^TVKUD@@^X^@`));
		//x = parseMessage(translateCaretControlCharacters(`^A2NIO,7^BAN151000,100,9@^C^TVKII^@�^B`));
	});

	it('the message should be an object', () => {
		console.log(x);
	});
});
*/

describe('when parsing an XML refresh message', () => {
  'use strict';

  let xmlParser;
  beforeEach(() => {
    const factory = new XmlParserFactoryForNode();
    xmlParser = factory.build();
  });
  describe('for an instrument that has settled and has a postmarket (form-T) trade', () => {
    let x;
    beforeEach(() => {
      x = parseMessage(`%<QUOTE symbol="AAPL" name="Apple Inc" exchange="NASDAQ" basecode="A" pointvalue="1.0" tickincrement="1" ddfexchange="Q" flag="s" lastupdate="20160920163525" bid="11345" bidsize="10" ask="11352" asksize="1" mode="I">
				<SESSION day="J" session="R" timestamp="20160920171959" open="11305" high="11412" low="11251" last="11357" previous="11358" settlement="11357" tradesize="1382944" volume="36258067" numtrades="143218" pricevolume="3548806897.06" tradetime="20160920160000" ticks=".." id="combined"/>
				<SESSION day="I" timestamp="20160919000000" open="11519" high="11618" low="11325" last="11358" previous="11492" settlement="11358" volume="47010000" ticks=".." id="previous"/>
				<SESSION day="J" session="R" previous="11358" volume="13198" id="session_J_R"/>
				<SESSION day="J" session="T" timestamp="20160920172007" last="11355" previous="11358" tradesize="500" volume="656171" numtrades="1118" pricevolume="74390050.90" tradetime="20160920172007" ticks="+-" id="session_J_T"/>
				</QUOTE>`, xmlParser);
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
					</QUOTE>`, xmlParser);
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
				</QUOTE>`, xmlParser);
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
					</QUOTE>`, xmlParser);
    });

    // 2021/08/05, BRI. We are now reading from the previous session (instead of the combined session).

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

},{"../../../../../lib/utilities/parse/ddf/message":26,"./../../../../../lib/utilities/xml/XmlParserFactoryForNode":33}],78:[function(require,module,exports){
const parseValue = require('../../../../../lib/utilities/parse/ddf/value');
describe('when parsing prices', () => {
  'use strict';

  describe('with a decimal fraction separator', () => {
    describe('with unit code "2"', () => {
      it('returns 0.75 when parsing ".75"', () => {
        expect(parseValue('.75', '2')).toEqual(0.75);
      });
      it('returns 377 when parsing "377.000"', () => {
        expect(parseValue('377.000', '2')).toEqual(377);
      });
      it('returns 377.5 when parsing "377.500"', () => {
        expect(parseValue('377.500', '2')).toEqual(377.5);
      });
      it('returns 377.75 when parsing "377.750"', () => {
        expect(parseValue('377.750', '2')).toEqual(377.75);
      });
      it('returns 3770.75 when parsing "3770.750"', () => {
        expect(parseValue('3770.750', '2')).toEqual(3770.75);
      });
      it('returns 37700.75 when parsing "37700.750"', () => {
        expect(parseValue('37700.750', '2')).toEqual(37700.75);
      });
      it('returns 377000.75 when parsing "377000.750"', () => {
        expect(parseValue('377000.750', '2')).toEqual(377000.75);
      });
      it('returns 3770000.75 when parsing "3770000.750"', () => {
        expect(parseValue('3770000.750', '2')).toEqual(3770000.75);
      });
      it('returns 3770000 when parsing "3770000.000"', () => {
        expect(parseValue('3770000.000', '2')).toEqual(3770000);
      });
      it('returns 0 (with when parsing "0.000"', () => {
        expect(parseValue('0.000', '2')).toEqual(0);
      });
      it('returns undefined when parsing zero-length string', () => {
        expect(parseValue('', '2')).toEqual(undefined);
      });
    });
    describe('with unit code "8"', () => {
      it('returns 0 when parsing "0"', () => {
        expect(parseValue('0', '8')).toEqual(0);
      });
      it('returns 1000 when parsing "1000"', () => {
        expect(parseValue('1000', '8')).toEqual(1000);
      });
    });
    describe('with unit code "F"', () => {
      it('returns 0 when parsing "0"', () => {
        expect(parseValue('0', 'F')).toEqual(0);
      });
      it('returns 0.0073120 when parsing "73120"', () => {
        expect(parseValue('73120', 'F')).toEqual(0.0073120);
      });
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

},{"../../../../../lib/utilities/parse/ddf/value":28}],79:[function(require,module,exports){
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

},{"../../../../lib/utilities/parse/price":29}],80:[function(require,module,exports){
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
describe('When parsing a symbol for a futures contract', () => {
  describe('and the year is 2022', () => {
    let getFullYear;
    beforeEach(() => {
      getFullYear = Date.prototype.getFullYear;
      Date.prototype.getFullYear = () => {
        return 2022;
      };
    });
    it('the expiration year of "ZCN19" should parse to 2019', () => {
      expect(SymbolParser.parseInstrumentType('ZCN19').year).toEqual(2019);
    });
    it('the expiration year of "ZCN21" should parse to 2021', () => {
      expect(SymbolParser.parseInstrumentType('ZCN21').year).toEqual(2021);
    });
    it('the expiration year of "ZCN22" should parse to 2022', () => {
      expect(SymbolParser.parseInstrumentType('ZCN22').year).toEqual(2022);
    });
    it('the expiration year of "ZCN32" should parse to 2032', () => {
      expect(SymbolParser.parseInstrumentType('ZCN32').year).toEqual(2032);
    });
    it('the expiration year of "ZCN42" should parse to 2042', () => {
      expect(SymbolParser.parseInstrumentType('ZCN42').year).toEqual(2042);
    });
    it('the expiration year of "ZCN47" should parse to 2047', () => {
      expect(SymbolParser.parseInstrumentType('ZCN47').year).toEqual(2047);
    });
    it('the expiration year of "ZCN48" should parse to 1948', () => {
      expect(SymbolParser.parseInstrumentType('ZCN48').year).toEqual(1948);
    });
    it('the expiration year of "ZCN49" should parse to 1949', () => {
      expect(SymbolParser.parseInstrumentType('ZCN49').year).toEqual(1949);
    });
    it('the expiration year of "ZCN99" should parse to 1999', () => {
      expect(SymbolParser.parseInstrumentType('ZCM99').year).toEqual(1999);
    });
    afterEach(() => {
      Date.prototype.getFullYear = getFullYear;
    });
  });
});
describe('When parsing a symbol for a futures option', () => {
  describe('and the year is 2022', () => {
    let getFullYear;
    beforeEach(() => {
      getFullYear = Date.prototype.getFullYear;
      Date.prototype.getFullYear = () => {
        return 2022;
      };
    });
    it('the expiration year of "ZWK18465C" should parse to 2018', () => {
      expect(SymbolParser.parseInstrumentType('ZWK18465C').year).toEqual(2018);
    });
    it('the expiration year of "ZWK22465C" should parse to 2022', () => {
      expect(SymbolParser.parseInstrumentType('ZWK22465C').year).toEqual(2022);
    });
    it('the expiration year of "ZWK47465C" should parse to 2047', () => {
      expect(SymbolParser.parseInstrumentType('ZWK47465C').year).toEqual(2047);
    });
    it('the expiration year of "ZWK48465C" should parse to 2048', () => {
      expect(SymbolParser.parseInstrumentType('ZWK48465C').year).toEqual(1948);
    });
    afterEach(() => {
      Date.prototype.getFullYear = getFullYear;
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
  it('the symbol "ESY00" should return true', () => {
    expect(SymbolParser.getIsFuture('ESY00')).toEqual(true);
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
describe('When checking to see if a symbol is a "cash" future', () => {
  it('the symbol "ESY00" should return false', () => {
    expect(SymbolParser.getIsCash('ESY00')).toEqual(true);
  });
  it('the symbol "ESZ6" should return false', () => {
    expect(SymbolParser.getIsCash('ESZ6')).toEqual(false);
  });
  it('the symbol "ESZ16" should return false', () => {
    expect(SymbolParser.getIsCash('ESZ16')).toEqual(false);
  });
  it('the symbol "ESZ2016" should return false', () => {
    expect(SymbolParser.getIsCash('ESZ2016')).toEqual(false);
  });
  it('the symbol "ES*0" should return false', () => {
    expect(SymbolParser.getIsCash('ES*0')).toEqual(false);
  });
  it('the symbol "ES*1" should return false', () => {
    expect(SymbolParser.getIsCash('ES*1')).toEqual(false);
  });
  it('the symbol "NG*13" should return false', () => {
    expect(SymbolParser.getIsCash('NG*13')).toEqual(false);
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
describe('When checking to see if a symbol is a futures spread', () => {
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
describe('When checking to see if a symbol is a futures option', () => {
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
describe('When checking to see if a symbol is a grain bids instrument', () => {
  it('the symbol "IBM" should return false', () => {
    expect(SymbolParser.getIsGrainBid('IBM')).toEqual(false);
  });
  it('the symbol "ZCPN22-4574-5387.CM" should return true', () => {
    expect(SymbolParser.getIsGrainBid('ZCPN22-4574-5387.CM')).toEqual(true);
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
  describe('When the year distant (futures expiration in 10 or more years)', () => {
    it('CLG2034 should map to CLB4', () => {
      expect(SymbolParser.getProducerSymbol('CLG2034')).toEqual('CLB4');
    });
    it('CLG34 should map to CLB4', () => {
      expect(SymbolParser.getProducerSymbol('CLG34')).toEqual('CLB4');
    });
    it('CLH35 should map to CLC5', () => {
      expect(SymbolParser.getProducerSymbol('CLH35')).toEqual('CLC5');
    });
    it('CLJ36 should map to CLD6', () => {
      expect(SymbolParser.getProducerSymbol('CLJ36')).toEqual('CLD6');
    });
    it('CLK37 should map to CLE7', () => {
      expect(SymbolParser.getProducerSymbol('CLK37')).toEqual('CLE7');
    });
    it('CLM38 should map to CLI8', () => {
      expect(SymbolParser.getProducerSymbol('CLM38')).toEqual('CLI8');
    });
    it('CLN39 should map to CLL9', () => {
      expect(SymbolParser.getProducerSymbol('CLN39')).toEqual('CLL9');
    });
    it('CLQ40 should map to CLO0', () => {
      expect(SymbolParser.getProducerSymbol('CLQ40')).toEqual('CLO0');
    });
    it('CLU41 should map to CLP1', () => {
      expect(SymbolParser.getProducerSymbol('CLU41')).toEqual('CLP1');
    });
    it('CLV42 should map to CLR2', () => {
      expect(SymbolParser.getProducerSymbol('CLV42')).toEqual('CLR2');
    });
    it('CLX43 should map to CLS3', () => {
      expect(SymbolParser.getProducerSymbol('CLX43')).toEqual('CLS3');
    });
    it('CLZ44 should map to CLT4', () => {
      expect(SymbolParser.getProducerSymbol('CLZ44')).toEqual('CLT4');
    });
  });
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
    describe('When testing ZCN22|800P in 2022', () => {
      let producerSymbol;
      beforeEach(() => {
        let getFullYear = Date.prototype.getFullYear;
        Date.prototype.getFullYear = () => {
          return 2022;
        };
        producerSymbol = SymbolParser.getProducerSymbol('ZCN22|800P');
        Date.prototype.getFullYear = getFullYear;
      });
      it('ZCN22|800P should map to ZCN800P', () => {
        expect(producerSymbol).toEqual('ZCN800P');
      });
    });
    describe('When testing ZCN2|800P in 2022', () => {
      let producerSymbol;
      beforeEach(() => {
        let getFullYear = Date.prototype.getFullYear;
        Date.prototype.getFullYear = () => {
          return 2022;
        };
        producerSymbol = SymbolParser.getProducerSymbol('ZCN2|800P');
        Date.prototype.getFullYear = getFullYear;
      });
      it('ZCN2|800P should map to ZCN800P', () => {
        expect(producerSymbol).toEqual('ZCN800P');
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
describe('When parsing the expiration year for a futures contract', () => {
  describe('and the current year is 2022', () => {
    let getFullYear = null;
    beforeEach(() => {
      getFullYear = Date.prototype.getFullYear;
      Date.prototype.getFullYear = () => {
        return 2022;
      };
    });
    it('The string "2" should resolve to 2022 (in month "Z")', () => {
      expect(SymbolParser.getFuturesYear('2', 'Z')).toEqual(2022);
    });
    it('The string "22" should resolve to 2022 (in month "Z")', () => {
      expect(SymbolParser.getFuturesYear('22', 'Z')).toEqual(2022);
    });
    it('The string "2022" should resolve to 2022 (in month "Z")', () => {
      expect(SymbolParser.getFuturesYear('2022', 'Z')).toEqual(2022);
    });
    it('The string "3" should resolve to 2023 (in month "Z")', () => {
      expect(SymbolParser.getFuturesYear('3', 'Z')).toEqual(2023);
    });
    it('The string "23" should resolve to 2023 (in month "Z")', () => {
      expect(SymbolParser.getFuturesYear('23', 'Z')).toEqual(2023);
    });
    it('The string "2023" should resolve to 2023 (in month "Z")', () => {
      expect(SymbolParser.getFuturesYear('2023', 'Z')).toEqual(2023);
    });
    it('The string "1" should resolve to 2031 (in month "Z")', () => {
      expect(SymbolParser.getFuturesYear('1', 'Z')).toEqual(2031);
    });
    it('The string "21" should resolve to 2021 (in month "Z")', () => {
      expect(SymbolParser.getFuturesYear('21', 'Z')).toEqual(2021);
    });
    it('The string "31" should resolve to 2031 (in month "Z")', () => {
      expect(SymbolParser.getFuturesYear('31', 'Z')).toEqual(2031);
    });
    it('The string "2031" should resolve to 2031 (in month "Z")', () => {
      expect(SymbolParser.getFuturesYear('2031', 'Z')).toEqual(2031);
    });
    it('The string "46" should resolve to 2046 (in month "Z")', () => {
      expect(SymbolParser.getFuturesYear('46', 'Z')).toEqual(2046);
    });
    it('The string "47" should resolve to 2047 (in month "Z")', () => {
      expect(SymbolParser.getFuturesYear('47', 'Z')).toEqual(2047);
    });
    it('The string "48" should resolve to 1948 (in month "Z")', () => {
      expect(SymbolParser.getFuturesYear('48', 'Z')).toEqual(1948);
    });
    it('The string "49" should resolve to 1949 (in month "Z")', () => {
      expect(SymbolParser.getFuturesYear('49', 'Z')).toEqual(1949);
    });
    afterEach(() => {
      Date.prototype.getFullYear = getFullYear;
      getFullYear = null;
    });
  });
});
describe('When converting a futures option symbol to pipeline format', () => {
  describe('When testing ZCZ460C in 2023', () => {
    let pipelineSymbol;
    beforeEach(() => {
      let getFullYear = Date.prototype.getFullYear;
      Date.prototype.getFullYear = () => {
        return 2023;
      };
      pipelineSymbol = SymbolParser.getFuturesOptionPipelineFormat('ZCZ460C');
      Date.prototype.getFullYear = getFullYear;
    });
    it('ZCZ460C should map to ZCZ3|460C', () => {
      expect(pipelineSymbol).toEqual('ZCZ3|460C');
    });
  });
  describe('When testing ZCZ3|460C in 2023', () => {
    let pipelineSymbol;
    beforeEach(() => {
      let getFullYear = Date.prototype.getFullYear;
      Date.prototype.getFullYear = () => {
        return 2023;
      };
      pipelineSymbol = SymbolParser.getFuturesOptionPipelineFormat('ZCZ3|460C');
      Date.prototype.getFullYear = getFullYear;
    });
    it('ZCZ3|460C should map to ZCZ3|460C', () => {
      expect(pipelineSymbol).toEqual('ZCZ3|460C');
    });
  });
  describe('When testing ZCX480C in 2023', () => {
    let pipelineSymbol;
    beforeEach(() => {
      let getFullYear = Date.prototype.getFullYear;
      Date.prototype.getFullYear = () => {
        return 2023;
      };
      pipelineSymbol = SymbolParser.getFuturesOptionPipelineFormat('ZCX480C');
      Date.prototype.getFullYear = getFullYear;
    });
    it('ZCX480C should map to ZCX3|480C', () => {
      expect(pipelineSymbol).toEqual('ZCX3|480C');
    });
  });
  describe('When testing ZCX3|480C in 2023', () => {
    let pipelineSymbol;
    beforeEach(() => {
      let getFullYear = Date.prototype.getFullYear;
      Date.prototype.getFullYear = () => {
        return 2023;
      };
      pipelineSymbol = SymbolParser.getFuturesOptionPipelineFormat('ZCX3|480C');
      Date.prototype.getFullYear = getFullYear;
    });
    it('ZCX3|480C should map to ZCX3|480C', () => {
      expect(pipelineSymbol).toEqual('ZCX3|480C');
    });
  });
  describe('When testing BCDU3|480C in 2023', () => {
    let pipelineSymbol;
    beforeEach(() => {
      let getFullYear = Date.prototype.getFullYear;
      Date.prototype.getFullYear = () => {
        return 2023;
      };
      pipelineSymbol = SymbolParser.getFuturesOptionPipelineFormat('BCDU3|480C');
      Date.prototype.getFullYear = getFullYear;
    });
    it('BCDU3|480C should map to BCDU3|480C', () => {
      expect(pipelineSymbol).toEqual('BCDU3|480C');
    });
  });
});

},{"../../../../lib/utilities/parsers/SymbolParser":30}]},{},[54,55,56,57,58,59,60,61,62,63,65,64,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80]);
