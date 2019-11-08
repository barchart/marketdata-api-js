declare module "@barchart/marketdata-api-js" {
    class Logger {
        /**
         * Writes a log message.
         *
         * @public
         */
        public log(): void;
        /**
         * Writes a log message, at "trace" level.
         *
         * @public
         */
        public trace(): void;
        /**
         * Writes a log message, at "debug" level.
         *
         * @public
         */
        public debug(): void;
        /**
         * Writes a log message, at "info" level.
         *
         * @public
         */
        public info(): void;
        /**
         * Writes a log message, at "warn" level.
         *
         * @public
         */
        public warn(): void;
        /**
         * Writes a log message, at "error" level.
         *
         * @public
         */
        public error(): void;
    }

    class LoggerFactory {
        /**
         * Configures the library to write log messages to the console.
         *
         * @public
         * @static
         */
        public static configureForConsole(): void;
        /**
         * Configures the mute all log messages.
         *
         * @public
         * @static
         */
        public static configureForSilence(): void;
        /**
         * Configures the library to delegate any log messages to a custom
         * implementation of the {@link LoggerProvider} interface.
         *
         * @public
         * @static
         * @param {LoggerProvider} provider
         */
        public static configure(provider: LoggerProvider): void;
        /**
         * Returns an instance of {@link Logger} for a specific category.
         *
         * @public
         * @static
         * @param {String} category
         * @return {Logger}
         */
        public static getLogger(category: string): Logger;
    }

    class LoggerProvider {
        /**
         * Returns an instance of {@link Logger}.
         *
         * @public
         * @param {String} category
         * @returns {Logger}
         */
        public getLogger(category: string): Logger;
    }

    class Connection extends ConnectionBase {
        /**
         * Connects to the given server with username and password.
         *
         * @public
         * @param {string} server
         * @param {string} username
         * @param {string} password
         * @param {WebSocketAdapterFactory=} webSocketAdapterFactory
         */
        public connect(
            server: string,
            username: string,
            password: string,
            webSocketAdapterFactory?: WebSocketAdapterFactory
        ): void;
        /**
         * Forces a disconnect from the server.
         *
         * @public
         */
        public disconnect(): void;
        /**
         * Causes the market state to stop updating. All subscriptions are maintained.
         *
         * @public
         */
        public pause(): void;
        /**
         * Causes the market state to begin updating again (after {@link ConnectionBase#pause} has been called).
         *
         * @public
         */
        public resume(): void;
        /**
         * Initiates a subscription to an {@link Subscription.EventType} and
         * registers the callback for notifications.
         *
         * @public
         * @param {Subscription.EventType} eventType
         * @param {function} callback - notified each time the event occurs
         * @param {String=} symbol - A symbol, if applicable, to the given {@link Subscription.EventType}
         */
        public on(
            eventType: Subscription.EventType,
            callback: (...params: any[]) => any,
            symbol?: string
        ): void;
        /**
         * Stops notification of the callback for the {@link Subscription.EventType}.
         * See {@link ConnectionBase#on}.
         *
         * @public
         * @param {Subscription.EventType} eventType - the {@link Subscription.EventType} which was passed to {@link ConnectionBase#on}
         * @param {function} callback - the callback which was passed to {@link ConnectionBase#on}
         * @param {String=} symbol - A symbol, if applicable, to the given {@link Subscription.EventType}
         */
        public off(
            eventType: Subscription.EventType,
            callback: (...params: any[]) => any,
            symbol?: string
        ): void;
        /**
         * The frequency, in milliseconds, used to poll for changes to {@link Quote}
         * objects. A null value indicates streaming updates (default).
         *
         * @public
         * @returns {number|null}
         */
        public getPollingFrequency(): number | null;
        /**
         * Sets the polling frequency, in milliseconds. A null value indicates
         * streaming market updates (where polling is not used).
         *
         * @public
         * @param {number|null} pollingFrequency
         */
        public setPollingFrequency(pollingFrequency: number | null): void;
        /**
         * Returns the {@link MarketState} singleton, used to access {@link Quote},
         * {@link Profile}, and {@link CumulativeVolume} objects.
         *
         * @returns {MarketState}
         */
        getMarketState(): MarketState;
        /**
         * @public
         * @returns {null|string}
         */
        public getServer(): null | string;
        /**
         * @public
         * @returns {null|string}
         */
        public getPassword(): null | string;
        /**
         * @public
         * @returns {null|string}
         */
        public getUsername(): null | string;
        /**
         * Get an unique identifier for the current instance.
         *
         * @protected
         * @returns {Number}
         */
        protected _getInstance(): number;
    }

    class ConnectionBase {
        /**
         * Connects to the given server with username and password.
         *
         * @public
         * @param {string} server
         * @param {string} username
         * @param {string} password
         * @param {WebSocketAdapterFactory=} webSocketAdapterFactory
         */
        public connect(
            server: string,
            username: string,
            password: string,
            webSocketAdapterFactory?: WebSocketAdapterFactory
        ): void;
        /**
         * Forces a disconnect from the server.
         *
         * @public
         */
        public disconnect(): void;
        /**
         * Causes the market state to stop updating. All subscriptions are maintained.
         *
         * @public
         */
        public pause(): void;
        /**
         * Causes the market state to begin updating again (after {@link ConnectionBase#pause} has been called).
         *
         * @public
         */
        public resume(): void;
        /**
         * Initiates a subscription to an {@link Subscription.EventType} and
         * registers the callback for notifications.
         *
         * @public
         * @param {Subscription.EventType} eventType
         * @param {function} callback - notified each time the event occurs
         * @param {String=} symbol - A symbol, if applicable, to the given {@link Subscription.EventType}
         */
        public on(
            eventType: Subscription.EventType,
            callback: (...params: any[]) => any,
            symbol?: string
        ): void;
        /**
         * Stops notification of the callback for the {@link Subscription.EventType}.
         * See {@link ConnectionBase#on}.
         *
         * @public
         * @param {Subscription.EventType} eventType - the {@link Subscription.EventType} which was passed to {@link ConnectionBase#on}
         * @param {function} callback - the callback which was passed to {@link ConnectionBase#on}
         * @param {String=} symbol - A symbol, if applicable, to the given {@link Subscription.EventType}
         */
        public off(
            eventType: Subscription.EventType,
            callback: (...params: any[]) => any,
            symbol?: string
        ): void;
        /**
         * The frequency, in milliseconds, used to poll for changes to {@link Quote}
         * objects. A null value indicates streaming updates (default).
         *
         * @public
         * @returns {number|null}
         */
        public getPollingFrequency(): number | null;
        /**
         * Sets the polling frequency, in milliseconds. A null value indicates
         * streaming market updates (where polling is not used).
         *
         * @public
         * @param {number|null} pollingFrequency
         */
        public setPollingFrequency(pollingFrequency: number | null): void;
        /**
         * Returns the {@link MarketState} singleton, used to access {@link Quote},
         * {@link Profile}, and {@link CumulativeVolume} objects.
         *
         * @returns {MarketState}
         */
        getMarketState(): MarketState;
        /**
         * @public
         * @returns {null|string}
         */
        public getServer(): null | string;
        /**
         * @public
         * @returns {null|string}
         */
        public getPassword(): null | string;
        /**
         * @public
         * @returns {null|string}
         */
        public getUsername(): null | string;
        /**
         * Get an unique identifier for the current instance.
         *
         * @protected
         * @returns {Number}
         */
        protected _getInstance(): number;
    }

    /**
     * @namespace Subscription
     */
    namespace Subscription {
        /**
         * A data feed type. See {@link ConnectionBase#on}.
         *
         * @public
         * @memberof Subscription
         * @enum {string}
         * @readonly
         */
        const enum EventType {
            MarketDepth = "marketDepth",
            MarketUpdate = "marketUpdate",
            CumulativeVolume = "cumulativeVolume",
            Timestamp = "timestamp",
            Events = "events"
        }
    }

    /**
     * @typedef PriceLevel
     * @inner
     * @type Object
     * @property {number} price
     * @property {number} volume
     */
    type PriceLevel = {
        price: number;
        volume: number;
    };

    class CumulativeVolume {
        /**
         * @property {string} symbol
         */
        symbol: {
            symbol: string;
        };
        /**
         * Given a numeric price, returns the volume traded at that price level.
         *
         * @public
         * @param {number} price
         * @returns {number}
         */
        public getVolume(price: number): number;
        /**
         * Returns an array of all price levels. This is an expensive operation. Observing
         * an ongoing subscription is preferred (see {@link Connection#on}).
         *
         * @return {PriceLevel[]}
         */
        toArray(): PriceLevel[];
    }

    class Exchange {
        /**
         * @property {string} id - the code used to identify the exchange
         */
        id: {
            id: string;
        };
        /**
         * @property {string} name - the name of the exchange
         */
        name: {
            name: string;
        };
        /**
         * @property {string} timezone - the timezone of the exchange (should conform to TZ database name)
         */
        timezone: {
            timezone: string;
        };
    }

    /**
     * @typedef Book
     * @type Object
     * @property {string} symbol
     * @property {Object[]} bids
     * @property {Object[]} asks
     */
    type Book = {
        symbol: string;
        bids: object[];
        asks: object[];
    };

    class MarketState {
        /**
         * @public
         * @param {string} symbol
         * @param {function=} callback - invoked when the {@link Profile} instance becomes available
         * @returns {Promise<Profile>} The {@link Profile} instance, as a promise.
         */
        public getProfile(
            symbol: string,
            callback?: (...params: any[]) => any
        ): Promise<Profile>;
        /**
         * @public
         * @param {string} symbol
         * @returns {Quote}
         */
        public getQuote(symbol: string): Quote;
        /**
         * @public
         * @param {string} symbol
         * @returns {Book}
         */
        public getBook(symbol: string): Book;
        /**
         * @public
         * @param {string} symbol
         * @param {function=} callback - invoked when the {@link CumulativeVolume} instance becomes available
         * @returns {Promise<CumulativeVolume>} The {@link CumulativeVolume} instance, as a promise
         */
        public getCumulativeVolume(
            symbol: string,
            callback?: (...params: any[]) => any
        ): Promise<CumulativeVolume>;
        /**
         * Returns the time the most recent market data message was received.
         *
         * @public
         * @returns {Date}
         */
        public getTimestamp(): Date;
    }

    class Profile {
        /**
         * @property {string} symbol - the symbol of the instrument.
         */
        symbol: {
            symbol: string;
        };
        /**
         * @property {string} name - the name of the instrument.
         */
        name: {
            name: string;
        };
        /**
         * @property {string} exchange - code of the listing exchange.
         */
        exchange: {
            exchange: string;
        };
        /**
         * @property {string} unitCode - code indicating how a prices for the instrument should be formatted.
         */
        unitCode: {
            unitCode: string;
        };
        /**
         * @property {string} pointValue - the change in value for a one point change in price.
         */
        pointValue: {
            pointValue: string;
        };
        /**
         * @property {number} tickIncrement - the minimum price movement.
         */
        tickIncrement: {
            tickIncrement: number;
        };
        /**
         * @property {undefined|string} root - the root symbol, if a future; otherwise undefined.
         */
        root: {
            root: undefined | string;
        };
        /**
         * @property {undefined|string} month - the month code, if a future; otherwise undefined.
         */
        month: {
            month: undefined | string;
        };
        /**
         * @property {undefined|number} year - the expiration year, if a symbol; otherwise undefined.
         */
        year: {
            year: undefined | number;
        };
        /**
         * Given a numeric price, returns a human-readable price.
         *
         * @public
         * @param {number} price
         * @returns {string}
         */
        public formatPrice(price: number): string;
        /**
         * Configures the logic used to format all prices using the {@link Profile#formatPrice} instance function.
         *
         * @public
         * @param {string} fractionSeparator - usually a dash or a period
         * @param {boolean} specialFractions - usually true
         * @param {string=} thousandsSeparator - usually a comma
         */
        public static setPriceFormatter(
            fractionSeparator: string,
            specialFractions: boolean,
            thousandsSeparator?: string
        ): void;
        /**
         * Alias for {@link Profile.setPriceFormatter} function.
         *
         * @deprecated
         * @public
         * @see {@link Profile.setPriceFormatter}
         */
        public static PriceFormatter(): void;
    }

    class Quote {
        constructor(symbol?: string);
        /**
         * @property {string} symbol - the symbol of the quoted instrument.
         */
        symbol: {
            symbol: string;
        };
        /**
         * @property {string} message - last DDF message that caused a mutation to this instance.
         */
        message: {
            message: string;
        };
        /**
         * @property {string} flag - market status, will have one of three values: p, s, or undefined.
         */
        flag: {
            flag: string;
        };
        /**
         * @property {string} day - one character code that indicates day of the month of the current trading session.
         */
        day: {
            day: string;
        };
        /**
         * @property {number} dayNum - day of the month of the current trading session.
         */
        dayNum: {
            dayNum: number;
        };
        /**
         * @property {Date|null} lastUpdate - the most recent refresh. this date instance stores the hours and minutes for the exchange time (without proper timezone adjustment). use caution.
         */
        lastUpdate: {
            lastUpdate: Date | null;
        };
        /**
         * @property {number} bidPrice - top-of-book price on the buy side.
         */
        bidPrice: {
            bidPrice: number;
        };
        /**
         * @property {number} bidSize - top-of-book quantity on the buy side.
         */
        bidSize: {
            bidSize: number;
        };
        /**
         * @property {number} askPrice - top-of-book price on the sell side.
         */
        askPrice: {
            askPrice: number;
        };
        /**
         * @property {number} askSize - top-of-book quantity on the sell side.
         */
        askSize: {
            askSize: number;
        };
        /**
         * @property {number} lastPrice - most recent price (not necessarily a trade).
         */
        lastPrice: {
            lastPrice: number;
        };
        /**
         * @property {number} tradePrice - most recent trade price.
         */
        tradePrice: {
            tradePrice: number;
        };
        /**
         * @property {number} tradeSize - most recent trade quantity.
         */
        tradeSize: {
            tradeSize: number;
        };
        /**
         * @property {number} blockTrade - most recent block trade price.
         */
        blockTrade: {
            blockTrade: number;
        };
        /**
         * @property {number} settlementPrice
         */
        settlementPrice: {
            settlementPrice: number;
        };
        /**
         * @property {number} previousPrice - price from the previous session.
         */
        previousPrice: {
            previousPrice: number;
        };
        /**
         * @property {Profile|null} profile - metadata regarding the quoted instrument.
         */
        profile: {
            profile: Profile | null;
        };
        /**
         * @property {Date|null} time - the most recent trade, quote, or refresh. this date instance stores the hours and minutes for the exchange time (without proper timezone adjustment). use caution.
         */
        time: {
            time: Date | null;
        };
    }

    class WebSocketAdapter { }

    class WebSocketAdapterFactory {
        /**
         * Returns a new {@link WebSocketAdapter} instance.
         *
         * @public
         * @param {String} host
         * @returns {null}
         */
        public build(host: string): null;
    }

    class WebSocketAdapterFactoryForBrowsers extends WebSocketAdapterFactory {
        /**
         * Returns a new {@link WebSocketAdapter} instance.
         *
         * @public
         * @param {String} host
         * @returns {null}
         */
        public build(host: string): null;
    }

    class WebSocketAdapterFactoryForNode extends WebSocketAdapterFactory {
        /**
         * Returns a new {@link WebSocketAdapter} instance.
         *
         * @public
         * @param {String} host
         * @returns {null}
         */
        public build(host: string): null;
    }

    /**
     * Gets a list of names in the tz database (see https://en.wikipedia.org/wiki/Tz_database
     * and https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
     *
     * @public
     * @static
     * @returns {Array<String>}
     */
    function getTimezones(): String[];

    /**
     * Attempts to guess the local timezone.
     *
     * @public
     * @static
     * @returns {String|null}
     */
    function guessTimezone(): string | null;

    class SymbolParser {
        /**
         * Returns a simple instrument definition with the terms that can be
         * gleaned from a symbol. If no specifics can be determined from the
         * symbol, a null value is returned.
         *
         * @public
         * @static
         * @param {String} symbol
         * @returns {Object|null}
         */
        public static parseInstrumentType(symbol: string): any | null;
        /**
         * Translates a symbol into a form suitable for use with JERQ (i.e. the quote "producer").
         *
         * @public
         * @static
         * @param {String} symbol
         * @return {String|null}
         */
        public static getProducerSymbol(symbol: string): string | null;
        /**
         * Attempts to convert database format of futures options to pipeline format
         * (e.g. ZLF320Q -> ZLF9|320C)
         *
         * @public
         * @static
         * @param {String} symbol
         * @returns {String|null}
         */
        public static getFuturesOptionPipelineFormat(symbol: string): string | null;
        /**
         * Returns true if the symbol is not an alias to another symbol; otherwise
         * false.
         *
         * @public
         * @static
         * @param {String} symbol
         * @returns {Boolean}
         */
        public static getIsConcrete(symbol: string): boolean;
        /**
         * Returns true if the symbol is an alias for another symbol; false otherwise.
         *
         * @public
         * @static
         * @param {String} symbol
         * @returns {Boolean}
         */
        public static getIsReference(symbol: string): boolean;
        /**
         * Returns true if the symbol represents futures contract; false otherwise.
         *
         * @public
         * @static
         * @param {String} symbol
         * @returns {Boolean}
         */
        public static getIsFuture(symbol: string): boolean;
        /**
         * Returns true if the symbol represents futures spread; false otherwise.
         *
         * @public
         * @public
         * @param {String} symbol
         * @returns {Boolean}
         */
        public static getIsFutureSpread(symbol: string): boolean;
        /**
         * Returns true if the symbol represents an option on a futures contract; false
         * otherwise.
         *
         * @public
         * @static
         * @param {String} symbol
         * @returns {Boolean}
         */
        public static getIsFutureOption(symbol: string): boolean;
        /**
         * Returns true if the symbol represents a foreign exchange currency pair;
         * false otherwise.
         *
         * @public
         * @static
         * @param {String} symbol
         * @returns {Boolean}
         */
        public static getIsForex(symbol: string): boolean;
        /**
         * Returns true if the symbol represents an external index (e.g. Dow Jones
         * Industrials); false otherwise.
         *
         * @public
         * @static
         * @param {String} symbol
         * @returns {Boolean}
         */
        public static getIsIndex(symbol: string): boolean;
        /**
         * Returns true if the symbol represents an internally-calculated sector
         * index; false otherwise.
         *
         * @public
         * @static
         * @param {String} symbol
         * @returns {Boolean}
         */
        public static getIsSector(symbol: string): boolean;
        /**
         * Returns true if the symbol represents an internally-calculated, cmdty-branded
         * index; false otherwise.
         *
         * @public
         * @static
         * @param {String} symbol
         * @returns {Boolean}
         */
        public static getIsCmdty(symbol: string): boolean;
        /**
         * Returns true if the symbol is listed on the BATS exchange; false otherwise.
         *
         * @public
         * @static
         * @param {String} symbol
         * @returns {Boolean}
         */
        public static getIsBats(symbol: string): boolean;
        /**
         * Returns true if the symbol has an expiration and the symbol appears
         * to be expired (e.g. a future for a past year).
         *
         * @public
         * @static
         * @param {String} symbol
         * @returns {Boolean}
         */
        public static getIsExpired(symbol: string): boolean;
        /**
         * Returns true if prices for the symbol should be represented as a percentage; false
         * otherwise.
         *
         * @public
         * @static
         * @param {String} symbol
         * @returns {Boolean}
         */
        public static displayUsingPercent(symbol: string): boolean;
    }

    /**
     * Exchange metadata
     *
     * @typedef ExchangeMetadata
     * @type {Object}
     * @property {String} id
     * @property {String} description
     * @property {String} timezone
     */
    type ExchangeMetadata = {
        id: string;
        description: string;
        timezone: string;
    };
}
