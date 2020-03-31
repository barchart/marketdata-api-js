const convertUnitCodeToBaseCode = require('./unitCodeToBaseCode');

module.exports = (() => {
	'use strict';

	// Adapted from legacy code at https://github.com/barchart/php-jscharts/blob/372deb9b4d9ee678f32b6f8c4268434249c1b4ac/chart_package/webroot/js/deps/ddfplus/com.ddfplus.js

	/**
	 * Converts a string-formatted price into a number.
	 *
	 * @function
	 * @memberOf Functions
	 * @ignore
	 * @exported
	 * @param {String} value
	 * @param {String} unitcode
	 * @returns {Number}
	 */
	function convertStringToDecimal(value, unitcode) {
		let baseCode = convertUnitCodeToBaseCode(unitcode);

		let is_negative = false;

		if (value.match(/^-/)) {
			is_negative = true;

			value = value.slice(1);
		}

		// Fix for 10-Yr T-Notes
		if (baseCode === -4 && (value.length === 7 || (value.length === 6 && value.charAt(0) !== '1'))) {
			baseCode -= 1;
		}

		if (baseCode >= 0) {
			const ival = value * 1;

			return Math.round(ival * Math.pow(10, baseCode)) / Math.pow(10, baseCode);
		} else {
			const has_dash = value.match(/-/);

			let divisor = Math.pow(2, Math.abs(baseCode) + 2);

			const fracsize = String(divisor).length;
			const denomstart = value.length - fracsize;

			let numerend = denomstart;

			if (value.substring(numerend - 1, numerend) === '-') {
				numerend--;
			}

			const numerator = (value.substring(0, numerend)) * 1;
			const denominator = (value.substring(denomstart, value.length)) * 1;

			if (baseCode === -5) {
				divisor = has_dash ? 320 : 128;
			}

			return (numerator + (denominator / divisor)) * (is_negative ? -1 : 1);
		}
	}

	return convertStringToDecimal;
})();