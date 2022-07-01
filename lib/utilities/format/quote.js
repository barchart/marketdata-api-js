const is = require('@barchart/common-js/lang/is');

const formatDate = require('./date'),
	formatTime = require('./time');

const Timezone = require('@barchart/common-js/lang/Timezones');

module.exports = (() => {
	'use strict';

	let offsets = {};

	/**
	 * Returns a string-formatted date (or time), based on a {@link Quote} instance's
	 * state. If the market is open, and a trade has occurred, then the formatted time
	 * is returned. Otherwise, the formatted date is returned.
	 *
	 * @exported
	 * @function
	 * @memberOf Functions
	 * @param {Quote} quote
	 * @param {Boolean=} useTwelveHourClock
	 * @param {Boolean=} short
	 * @param {String=} timezone - A name from the tz database (see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) or "EXCHANGE"
	 * @returns {String}
	 */
	function formatQuoteDateTime(quote, useTwelveHourClock, short, timezone) {
		if (!quote || !quote.time) {
			return '';
		}

		let t;
		let utc;

		if (quote.timeUtc && (is.string(timezone) || (quote.profile && quote.profile.exchangeRef && quote.profile.exchangeRef && quote.profile.exchangeRef.timezoneExchange))) {
			utc = true;

			let tz;

			if (is.string(timezone)) {
				tz = timezone;
			} else {
				tz = quote.profile.exchangeRef.timezoneExchange;
			}

			let epoch = quote.timeUtc.getTime();

			if (!offsets.hasOwnProperty(tz)) {
				const offset = {};

				offset.latest = epoch;
				offset.timezone = Timezone.parse(tz);

				if (offset.timezone !== null) {
					offset.milliseconds = offset.timezone.getUtcOffset(null, true);
				} else {
					offset.milliseconds = null;
				}

				offsets[tz] = offset;
			}

			const o = offsets[tz];

			if (o.milliseconds !== null) {
				t = new Date(epoch + o.milliseconds);
			} else {
				t = null;
			}
		} else {
			utc = false;

			t = quote.time;
		}

		if (t === null) {
			return '';
		} else if (!quote.lastPrice || quote.flag || quote.sessionT) {
			return formatDate(t, utc);
		} else {
			return formatTime(t, quote.timezone, useTwelveHourClock, short, utc);
		}
	}

	return formatQuoteDateTime;
})();