module.exports = (() => {
	'use strict';

	function leftPad(value) {
		return ('00' + value).substr(-2);
	}

	function formatTwelveHourTime(t, utc) {
		let hours;
		let minutes;
		let seconds;

		if (utc) {
			hours = t.getUTCHours();
			minutes = t.getUTCMinutes();
			seconds = t.getUTCSeconds();
		} else {
			hours = t.getHours();
			minutes = t.getMinutes();
			seconds = t.getSeconds();
		}

		let period;

		if (hours === 0) {
			hours = 12;
			period = 'AM';
		} else if (hours === 12) {
			hours = hours;
			period = 'PM';
		} else if (hours > 12) {
			hours = hours - 12;
			period = 'PM';
		} else {
			hours = hours;
			period = 'AM';
		}

		return `${leftPad(hours)}:${leftPad(minutes)}:${leftPad(seconds)} ${period}`;
	}

	function formatTwelveHourTimeShort(t, utc) {
		let hours;
		let minutes;

		if (utc) {
			hours = t.getUTCHours();
			minutes = t.getUTCMinutes();
		} else {
			hours = t.getHours();
			minutes = t.getMinutes();
		}

		let period;

		if (hours === 0) {
			hours = 12;
			period = 'A';
		} else if (hours === 12) {
			hours = hours;
			period = 'P';
		} else if (hours > 12) {
			hours = hours - 12;
			period = 'P';
		} else {
			hours = hours;
			period = 'A';
		}

		return `${leftPad(hours)}:${leftPad(minutes)}${period}`;
	}

	function formatTwentyFourHourTime(t, utc) {
		let hours;
		let minutes;
		let seconds;

		if (utc) {
			hours = t.getUTCHours();
			minutes = t.getUTCMinutes();
			seconds = t.getUTCSeconds();
		} else {
			hours = t.getHours();
			minutes = t.getMinutes();
			seconds = t.getSeconds();
		}

		return `${leftPad(hours)}:${leftPad(minutes)}:${leftPad(seconds)}`;
	}

	function formatTwentyFourHourTimeShort(t, utc) {
		let hours;
		let minutes;

		if (utc) {
			hours = t.getUTCHours();
			minutes = t.getUTCMinutes();
		} else {
			hours = t.getHours();
			minutes = t.getMinutes();
		}

		return `${leftPad(hours)}:${leftPad(minutes)}`;
	}

	/**
	 * Formats a {@link Date} instance's time component as a string.
	 *
	 * @exported
	 * @function
	 * @memberOf Functions
	 * @param {Date} date
	 * @param {String=} timezone
	 * @param {Boolean=} useTwelveHourClock
	 * @param {Boolean=} short
	 * @param {Boolean=} utc
	 * @returns {String}
	 */
	function formatTime(date, timezone, useTwelveHourClock, short, utc) {
		if (!date) {
			return '';
		}

		let ft;

		if (useTwelveHourClock) {
			if (short) {
				ft = formatTwelveHourTimeShort;
			} else {
				ft = formatTwelveHourTime;
			}
		} else {
			if (short) {
				ft = formatTwentyFourHourTimeShort;
			} else {
				ft = formatTwentyFourHourTime;
			}
		}

		let formatted = ft(date, utc);

		if (timezone) {
			formatted = `${formatted} ${timezone}`;
		}

		return formatted;
	}

	return formatTime;
})();