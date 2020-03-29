const convertNumberToDayCode = require('./numberToDayCode');

module.exports = (() => {
	'use strict';

	/**
	 * Extracts the day of the month from a {@link Date} instance
	 * and returns the day code for the day of the month.
	 *
	 * @function
	 * @memberOf Functions
	 * @ignore
	 * @param {Date} date
	 * @returns {String|null}
	 */
	function convertDateToDayCode(date) {
		if (date === null || date === undefined) {
			return null;
		}

		return convertNumberToDayCode(date.getDate());
	}

	return convertDateToDayCode;
})();



