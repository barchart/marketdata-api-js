module.exports = (() => {
	'use strict';

	function leftPad(value) {
		return ('00' + value).substr(-2);
	}

	function formatTwelveHourTime(t) {
		let hours = t.getHours();
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

		return `${leftPad(hours)}:${leftPad(t.getMinutes())}:${leftPad(t.getSeconds())} ${period}`;
	}

	function formatTwelveHourTimeShort(t) {
		let hours = t.getHours();
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

		return `${leftPad(hours)}:${leftPad(t.getMinutes())}${period}`;
	}

	function formatTwentyFourHourTime(t) {
		return `${leftPad(t.getHours())}:${leftPad(t.getMinutes())}:${leftPad(t.getSeconds())}`;
	}

	function formatTwentyFourHourTimeShort(t) {
		return `${leftPad(t.getHours())}:${leftPad(t.getMinutes())}`;
	}

	/**
	 * Formats a {@link Date} instance's time component as a string.
	 *
	 * @function
	 * @param {Date} date
	 * @param {String=} timezone
	 * @param {Boolean=} useTwelveHourClock
	 * @param {Boolean=} short
	 * @returns {String}
	 */
	function formatTime(date, timezone, useTwelveHourClock, short) {
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

		let formatted = ft(date);

		if (timezone) {
			formatted = `${formatted} ${timezone}`;
		}

		return formatted;
	}

	return formatTime;
})();