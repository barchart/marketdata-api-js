const is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	const ASCII_ONE = ('1').charCodeAt(0);
	const ASCII_A = ('A').charCodeAt(0);

	/**
	 * Converts a day number to a single character day code (e.g. 1 is
	 * converted to "1", and 10 is converted to "0", and 11 is converted
	 * to "A").
	 *
	 * @function
	 * @memberOf Functions
	 * @ignore
	 * @param {Number} d
	 * @returns {String}
	 */
	function convertNumberToDayCode(d) {
		if (!is.integer(d)) {
			return null;
		}

		if (d >= 1 && d <= 9) {
			return String.fromCharCode(ASCII_ONE + d - 1);
		} else if (d === 10) {
			return '0';
		} else {
			return String.fromCharCode(ASCII_A + d - 11);
		}
	}

	return convertNumberToDayCode;
})();



