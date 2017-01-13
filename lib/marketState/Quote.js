module.exports = (() => {
	'use strict';

	class Quote {
		constructor(symbol) {
			this.symbol = symbol || null;
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
		}

		static clone(symbol, source) {
			const clone = Object.assign({ }, source);
			clone.symbol = symbol;

			return clone;
		}
	}

	return Quote;
})();