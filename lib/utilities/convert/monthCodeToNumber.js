const is = require('@barchart/common-js/lang/is');

const monthCodes = require('./../data/monthCodes');

module.exports = (() => {
	'use strict';

	const map = monthCodes.getCodeToNumberMap();

	/**
	 * Converts a futures month code to the month number (e.g. "F" to 1, or "N" to 7).
	 *
	 * @function
	 * @memberOf Functions
	 * @ignore
	 * @param {String} monthCode
	 * @returns {Number|null}
	 */
	function convertMonthCodeToNumber(monthCode) {
		if (!is.string(monthCode)) {
			return null;
		}

		return map[monthCode] || null;
	}

	return convertMonthCodeToNumber;
})();



