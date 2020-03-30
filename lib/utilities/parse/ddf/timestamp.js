module.exports = (() => {
	'use strict';

	/**
	 * Parses a DDF timestamp.
	 *
	 * The resulting {@link Date} instance is meant to be a simple container
	 * for year, month, day, hour, minute, and second. The timezone is implied
	 * (to be the timezone of the exchange on which the associated instrument
	 * trades.
	 *
	 * In other words, while the resulting {@link Date} instance uses the timezone
	 * of the local computer -- this is unintended and should not be relied on.
	 * So, regardless of whether your computer's timezone is set to Belize or Japan;
	 * a quote for IBM, having a date of September 26 at 13:15 refers to September 26
	 * at 13:15 in America/New_York not America/Belize or Asia/Tokyo.
	 *
	 * @exported
	 * @function
	 * @param {String} bytes
	 * @returns {Date}
	 */
	function parseTimestamp(bytes) {
		if (bytes.length !== 9) {
			return null;
		}

		const year = (bytes.charCodeAt(0) * 100) + bytes.charCodeAt(1) - 64;
		const month = bytes.charCodeAt(2) - 64 - 1;
		const day = bytes.charCodeAt(3) - 64;
		const hour = bytes.charCodeAt(4) - 64;
		const minute = bytes.charCodeAt(5) - 64;
		const second = bytes.charCodeAt(6) - 64;
		const ms = (0xFF & bytes.charCodeAt(7)) + ((0xFF & bytes.charCodeAt(8)) << 8);

		// 2016/02/17. JERQ is providing us with date and time values that
		// are meant to be interpreted in the exchange's local timezone.
		//
		// This is interesting because different time values (e.g. 14:30 and
		// 13:30) can refer to the same moment (e.g. EST for US equities and
		// CST for US futures).
		//
		// Furthermore, when we use the timezone-sensitive Date object, we
		// create a problem. The represents (computer) local time. So, for
		// server applications, it is recommended that we use UTC -- so
		// that the values (hours) are not changed when JSON serialized
		// to ISO-8601 format. Then, the issue is passed along to the
		// consumer (which must ignore the timezone too).

		return new Date(year, month, day, hour, minute, second, ms);
	}

	return parseTimestamp;
})();