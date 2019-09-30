const formatQuote = require('./../format/quote');

module.exports = (() => {
	'use strict';

	/**
	 * Static utilities for building simplified format functions to represent
	 * the date (or time) of a {@link Quote} instance.
	 *
	 * @public
	 */
	class QuoteFormatterFactory {
		constructor() {

		}

		/**
		 * Returns a {@link QuoteFormatterFactory~formatQuote} which uses
		 * the configuration supplied to this function as parameters.
		 *
		 * @public
		 * @static
		 * @param {Boolean=} useTwelveHourClock
		 * @param {Boolean=} short
		 * @returns {QuoteFormatterFactory~formatQuote}
		 */
		static build(useTwelveHourClock, short) {
			return (quote) => formatQuote(quote, useTwelveHourClock, short);
		}

		toString() {
			return '[QuoteFormatterFactory]';
		}
	}

	/**
	 * Accepts a {@link Quote} instance and returns the appropriate human-readable
	 * date (or time) as a string.
	 *
	 * @public
	 * @callback QuoteFormatterFactory~formatQuote
	 * @param {Quote} value
	 * @returns {String}
	 */

	return QuoteFormatterFactory;
})();