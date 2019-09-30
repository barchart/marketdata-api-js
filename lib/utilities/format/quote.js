const formatDate = require('./date'),
	formatTime = require('./time');

module.exports = (() => {
	'use strict';

	/**
	 * Returns a string-formatted date (or time), based on a {@link Quote} instance's
	 * state. If the market is open, and a trade has occurred, then the formatted time
	 * is returned. Otherwise, the formatted date is returned.
	 *
	 * @public
	 * @param {Quote} quote
	 * @param {Boolean=} useTwelveHourClock
	 * @param {Boolean=} short
	 * @returns {String}
	 */
	function formatQuoteDateTime(quote, useTwelveHourClock, short) {
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