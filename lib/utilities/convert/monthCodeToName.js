const is = require('@barchart/common-js/lang/is');

const monthCodes = require('./../data/monthCodes');

module.exports = (() => {
	'use strict';

	const map = monthCodes.getCodeToNameMap();

	/**
	 * Converts a futures month code to the month number (e.g. "F" to "January", or "N" to "July").
	 *
	 * @function
	 * @memberOf Functions
	 * @ignore
	 * @param {String} monthCode
	 * @returns {String|null}
	 */
	function convertMonthCodeToNumber(monthCode) {
		if (!is.string(monthCode)) {
			return null;
		}

		return map[monthCode] || null;
	}

	return convertMonthCodeToNumber;
})();



