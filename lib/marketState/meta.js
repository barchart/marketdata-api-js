/**
 * A meta namespace for structural contracts of anonymous objects.
 *
 * @namespace Schema
 */

/**
 * The definition of an anonymous object representing one level within a
 * {@link Schema.Book}.
 *
 * @typedef BookPriceLevel
 * @type Object
 * @memberOf Schema
 * @property {number} price - The price level.
 * @property {number} size - The quantity available at the price level.
 */

/**
 * The definition of an anonymous object representing an aggregate order
 * book. In other words, the total size of all orders (bid or ask) at
 * every price.
 *
 * @typedef Book
 * @type Object
 * @memberOf Schema
 * @property {string} symbol - The symbol.
 * @property {Schema.BookPriceLevel[]} bids - The price levels for buy orders.
 * @property {Schema.BookPriceLevel[]} asks - The price levels for sell orders.
 */