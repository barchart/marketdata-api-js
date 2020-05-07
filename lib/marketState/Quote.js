module.exports = (() => {
	'use strict';

	/**
	 * Current market conditions for an instrument, mutates as **MarketUpdate**
	 * subscription updates are processed (see {@link Enums.SubscriptionType}).
	 *
	 * @public
	 * @exported
	 */
	class Quote {
		constructor(symbol) {
			/**
			 * @property {string} symbol - Symbol of the quoted instrument.
			 * @public
			 */
			this.symbol = symbol || null;

			/**
			 * @property {string} message - Most recent DDF message to cause a this instance to mutate.
			 * @public
			 */
			this.message = null;

			/**
			 * @property {string|undefined} flag - Market status, will have one of three values: "p", "s", or undefined.
			 * @public
			 */
			this.flag = null;

			/**
			 * @property {string} - One of two values, "I" or "R" -- indicating delayed or realtime data, respectively.
			 * @type {null}
			 */
			this.mode = null;

			/**
			 * @property {string} day - One character code indicating the day of the month of the current trading session.
			 * @public
			 */
			this.day = null;

			/**
			 * @property {number} dayNum - Day of the month of the current trading session.
			 * @public
			 */
			this.dayNum = 0;

			/**
			 * @property {string|null} session
			 * @public
			 */
			this.session = null;

			/**
			 * @property {Date|null} lastUpdate - The most recent refresh date. Caution should be used. This date was created from hours, minutes, and seconds without regard for the current machine's timezone. As such, it is only safe to read time-related values (e.g. ```Date.getHours```, ```Date.getMinutes```, etc). Do not attempt to compare. Do not attempt to convert.
			 * @public
			 */
			this.lastUpdate = null;

			/**
			 * @property {Date|null} lastUpdate - The most recent refresh date.
			 */
			this.lastUpdateUtc = null;

			/**
			 * @property {number} bidPrice - top-of-book price on the buy side.
			 */
			this.bidPrice = null;

			/**
			 * @property {number} bidSize - top-of-book quantity on the buy side.
			 */
			this.bidSize = null;

			/**
			 * @property {number} askPrice - top-of-book price on the sell side.
			 */
			this.askPrice = null;

			/**
			 * @property {number} askSize - top-of-book quantity on the sell side.
			 */
			this.askSize = null;

			/**
			 * @property {number} lastPrice - most recent price (not necessarily a trade).
			 */
			this.lastPrice = null;

			/**
			 * @property {number} tradePrice - most recent trade price.
			 */
			this.tradePrice = null;

			/**
			 * @property {number} tradeSize - most recent trade quantity.
			 */
			this.tradeSize = null;

			this.numberOfTrades = null;
			this.vwap1 = null; // Exchange Provided
			this.vwap2 = null; // Calculated

			/**
			 * @property {number} blockTrade - Most recent block trade price.
			 */
			this.blockTrade = null;

			/**
			 * @property {number} settlementPrice - settlement price for current trading session.
			 */
			this.settlementPrice = null;

			/**
			 * @property {number} previousSettlementPrice - settlement price from previous trading session.
			 */
			this.previousSettlementPrice = null;

			this.openPrice = null;
			this.highPrice = null;
			this.lowPrice = null;
			this.volume = null;
			this.openInterest = null;

			/**
			 * @property {number} previousPrice - last price from the previous trading session.
			 */
			this.previousPrice = null;

			/**
			 * @property {Date|null} time - the most recent trade, quote, or refresh. this date instance stores the hours and minutes for the exchange time (without proper timezone adjustment). use caution.
			 */
			this.time = null;
			this.timeUtc = null;

			/**
			 * @property {Profile|null} profile - metadata regarding the quoted instrument.
			 */
			this.profile = null;

			this.ticks = [];
		}

		static clone(symbol, source) {
			const clone = Object.assign({ }, source);
			clone.symbol = symbol;

			return clone;
		}

		toString() {
			return `[Quote (symbol=${this.symbol})]`;
		}
	}

	return Quote;
})();