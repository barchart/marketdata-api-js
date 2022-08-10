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
			 * @readonly
			 */
			this.symbol = symbol || null;

			/**
			 * @property {Profile|null} profile - Metadata regarding the quoted instrument.
			 * @public
			 * @readonly
			 */
			this.profile = null;

			/**
			 * @property {string} refresh - Most recent DDF refresh message which caused this instance to mutate.
			 * @public
			 * @readonly
			 */
			this.refresh = null;

			/**
			 * @property {string} message - Most recent DDF message which caused this instance to mutate.
			 * @public
			 * @readonly
			 */
			this.message = null;

			/**
			 * @property {string|undefined} flag - Market status, will have one of three values: "p", "s", or undefined.
			 * @public
			 * @readonly
			 */
			this.flag = null;

			/**
			 * @property {string} mode - One of two values, "I" or "R" -- indicating delayed or realtime data, respectively.
			 * @public
			 * @readonly
			 */
			this.mode = null;

			/**
			 * @property {string} day - One character code indicating the day of the month of the current trading session.
			 * @public
			 * @readonly
			 */
			this.day = null;

			/**
			 * @property {number} dayNum - Day of the month of the current trading session.
			 * @public
			 * @readonly
			 */
			this.dayNum = 0;

			/**
			 * @property {string|null} session
			 * @public
			 * @readonly
			 */
			this.session = null;

			/**
			 * @property {Date|null} lastUpdate - The most recent refresh date. Caution should be used. This date was created from hours, minutes, and seconds without regard for the client computer's timezone. As such, it is only safe to read time-related values (e.g. ```Date.getHours```, ```Date.getMinutes```, etc). Do not attempt to compare. Do not attempt to convert.
			 * @public
			 * @readonly
			 */
			this.lastUpdate = null;

			/**
			 * @property {Date|null} lastUpdateUtc - A timezone-aware version of {@link Quote#lastUpdate}. This property will only have a value when both (a) the exchange timezone is known; and (b) the client computer's timezone is known.
			 * @public
			 * @readonly
			 */
			this.lastUpdateUtc = null;

			/**
			 * @property {number} bidPrice - The top-of-book price on the buy side.
			 * @public
			 * @readonly
			 */
			this.bidPrice = null;

			/**
			 * @property {number} bidSize - The top-of-book quantity on the buy side.
			 * @public
			 * @readonly
			 */
			this.bidSize = null;

			/**
			 * @property {number} askPrice - The top-of-book price on the sell side.
			 * @public
			 * @readonly
			 */
			this.askPrice = null;

			/**
			 * @property {number} askSize - The top-of-book quantity on the sell side.
			 * @public
			 * @readonly
			 */
			this.askSize = null;

			/**
			 * @property {number} lastPrice - Most recent price (not necessarily a trade).
			 * @public
			 * @readonly
			 */
			this.lastPrice = null;

			/**
			 * @property {number} tradePrice - Most recent trade price.
			 * @public
			 * @readonly
			 */
			this.tradePrice = null;

			/**
			 * @property {number} tradeSize - Most recent trade quantity.
			 * @public
			 * @readonly
			 */
			this.tradeSize = null;

			this.numberOfTrades = null;

			this.vwap1 = null; // Exchange Provided
			this.vwap2 = null; // Calculated

			/**
			 * @property {number} blockTrade - Most recent block trade price.
			 * @public
			 * @readonly
			 */
			this.blockTrade = null;

			/**
			 * @property {number} settlementPrice - Settlement price for current trading session.
			 * @public
			 * @readonly
			 */
			this.settlementPrice = null;

			/**
			 * @property {number} previousSettlementPrice - Settlement price from previous trading session.
			 * @public
			 * @readonly
			 */
			this.previousSettlementPrice = null;

			/**
			 * @property {number|null} openPrice - The opening price for the current trading session.
			 * @public
			 * @readonly
			 */
			this.openPrice = null;

			/**
			 * @property {number|null} highPrice - The highest trade price from the current trading session.
			 * @public
			 * @readonly
			 */
			this.highPrice = null;

			/**
			 * @property {number|null} lowPrice - The lowest trade price from the current trading session.
			 * @public
			 * @readonly
			 */
			this.lowPrice = null;

			/**
			 * @property {number|null} recordHighPrice - The all-time highest trade price from current or previous trading sessions.
			 * @public
			 * @readonly
			 */
			this.recordHighPrice = null;

			/**
			 * @property {number|null} recordLowPrice - The all-time lowest trade price from current or previous trading sessions.
			 * @public
			 * @readonly
			 */
			this.recordLowPrice = null;

			/**
			 * @property {number|null} volume - The quantity traded during the current trading session.
			 * @public
			 * @readonly
			 */
			this.volume = null;

			/**
			 * @property {number|null} openInterest - The outstanding number of active contracts. For some asset classes, this property is not relevant.
			 * @public
			 * @readonly
			 */
			this.openInterest = null;

			/**
			 * @property {number} previousPrice - The last price from the previous trading session.
			 * @public
			 * @readonly
			 */
			this.previousPrice = null;

			/**
			 * @property {Date|null} time - The most recent trade, quote, or refresh time. Caution should be used. This date was created from hours, minutes, and seconds without regard for the client computer's timezone. As such, it is only safe to read time-related values (e.g. ```Date.getHours```, ```Date.getMinutes```, etc). Do not attempt to compare. Do not attempt to convert.
			 * @public
			 * @readonly
			 */
			this.time = null;

			/**
			 * @property {Date|null} timeUtc - A timezone-aware version of {@link Quote#time}. This property will only have a value when both (a) the exchange timezone is known; and (b) the client computer's timezone is known.
			 * @public
			 * @readonly
			 */
			this.timeUtc = null;

			/**
			 * @property {Number|null}
			 * @public
			 * @readonly
			 */
			this.priceChange = null;

			/**
			 * @property {Number|null}
			 * @public
			 * @readonly
			 */
			this.priceChangePercent = null;

			/**
			 * @property {Number|null}
			 * @public
			 * @readonly
			 */
			this.previousPriceChange = null;

			/**
			 * @property {Number|null}
			 * @public
			 * @readonly
			 */
			this.previousPriceChangePercent = null;

			this.days = [];
			this.ticks = [];
		}

		static clone(symbol, source) {
			const clone = Object.assign({}, source);
			clone.symbol = symbol;

			return clone;
		}

		toString() {
			return `[Quote (symbol=${this.symbol})]`;
		}
	}

	return Quote;
})();