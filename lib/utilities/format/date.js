module.exports = (() => {
	'use strict';

	function leftPad(value) {
		return ('00' + value).substr(-2);
	}

	/**
	 * Formats a {@link Date} instance as a string (using a MM/DD/YY pattern).
	 *
	 * @function
	 * @param {Date=} date
	 * @returns {String}
	 */
	function formatDate(date) {
		if (date) {
			return `${leftPad(date.getMonth() + 1)}/${leftPad(date.getDate())}/${leftPad(date.getFullYear())}`;
		} else {
			return '';
		}
	}

	return formatDate;
})();