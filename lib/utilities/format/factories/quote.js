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
		return (quote) => formatQuote(quote, useTwelveHourClock, short, timezone);
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