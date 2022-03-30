/**
 * A meta namespace containing structural contracts of anonymous objects.
 *
 * @namespace Schema
 */

/**
 * This object represents an aggregated order book. In other words, the total size
 * of all orders (bid and ask) at every price. Constructed from **MarketDepth**
 * subscription (see {@link Enums.SubscriptionType}).
 *
 * @typedef Book
 * @type Object
 * @memberOf Schema
 * @property {string} symbol - The symbol.
 * @property {Schema.BookLevel[]} bids - The price levels for buy orders.
 * @property {Schema.BookLevel[]} asks - The price levels for sell orders.
 */

/**
 * The definition of one price level within the *bids* or *asks* array of a
 * {@link Schema.Book}.
 *
 * @typedef BookLevel
 * @type Object
 * @memberOf Schema
 * @property {number} price - The price level.
 * @property {number} size - The quantity available at the price level.
 */

/**
 * The definition of one price level within a {@link CumulativeVolume}
 * object.
 *
 * @typedef VolumeLevel
 * @type Object
 * @memberOf Schema
 * @property {number} price - The price level.
 * @property {number} size - The aggregate quantity traded.
 */

/**
 * A meta namespace containing signatures of anonymous functions.
 *
 * @namespace Callbacks
 */

/**
 * The signature of a "custom" function used to format price values.
 *
 * @public
 * @callback CustomPriceFormatterCallback
 * @memberOf Callbacks
 * @param {Number} value
 * @param {String} unitCode
 * @param {Profile} profile
 * @returns {String}
 */