const formatDate = require('./date'),
	formatTime = require('./time');

module.exports = (() => {
	'use strict';

	/**
	 * Returns a string-formatted date (or time), based on a {@link Quote} instance's
	 * state. If the market is open, and a trade has occurred, then the formatted time
	 * is returned. Otherwise, the formatted date is returned.
	 *
	 * @function
	 * @param {Quote} quote
	 * @param {Boolean=} useTwelveHourClock
	 * @param {Boolean=} short
	 * @param {String=} timezone - A name from the tz database (see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
	 * @returns {String}
	 */
	function formatQuoteDateTime(quote, useTwelveHourClock, short, timezone) {
		const t = quote.time;

		if (!t) {
			return '';
		} else if (!quote.lastPrice || quote.flag || quote.sessionT) {
			return formatDate(t);
		} else {
			return formatTime(t, quote.timezone, useTwelveHourClock, short);
		}
	}

	return formatQuoteDateTime;
})();