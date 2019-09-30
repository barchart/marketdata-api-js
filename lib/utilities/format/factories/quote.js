const formatQuote = require('./../quote');

module.exports = (() => {
	'use strict';

	/**
	 * Returns a {@link QuoteFormatterFactory~formatQuote} which uses
	 * the configuration supplied to this function as parameters.
	 *
	 * @function
	 * @param {Boolean=} useTwelveHourClock
	 * @param {Boolean=} short
	 * @returns {QuoteFormatterFactory~formatQuote}
	 */
	function buildQuoteFormatter(useTwelveHourClock, short) {
		return (quote) => formatQuote(quote, useTwelveHourClock, short);
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

	return buildQuoteFormatter;
})();