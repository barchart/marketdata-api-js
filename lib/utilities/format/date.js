module.exports = (() => {
	'use strict';

	function leftPad(value) {
		return ('00' + value).substr(-2);
	}

	/**
	 * Formats a {@link Date} instance as a string (using a MM/DD/YY pattern).
	 *
	 * @exported
	 * @function
	 * @memberOf Functions
	 * @param {Date=} date
	 * @param {Boolean=} utc
	 * @returns {String}
	 */
	function formatDate(date, utc) {
		if (!date) {
			return '';
		}

		if (utc) {
			return `${leftPad(date.getUTCMonth() + 1)}/${leftPad(date.getUTCDate())}/${leftPad(date.getUTCFullYear())}`;
		} else {
			return `${leftPad(date.getMonth() + 1)}/${leftPad(date.getDate())}/${leftPad(date.getFullYear())}`;
		}
	}

	return formatDate;
})();