const is = require('@barchart/common-js/lang/is');

const convertUnitCodeToBaseCode = require('./../convert/unitCodeToBaseCode');

module.exports = (() => {
	'use strict';

	// Adapted from legacy code at https://github.com/barchart/php-jscharts/blob/372deb9b4d9ee678f32b6f8c4268434249c1b4ac/chart_package/webroot/js/deps/ddfplus/com.ddfplus.js

	/**
	 * Converts a string-formatted price into a number.
	 *
	 * @function
	 * @memberOf Functions
	 * @exported
	 * @param {String|Number} value
	 * @param {String=} unitCode - If not specified, a unit code of "8" is assumed.
	 * @param {String=} fractionSeparator - Can be zero or one character in length. If invalid or omitted, a decimal point (i.e. dot) is assumed.
	 * @param {Boolean=} specialFractions
	 * @param {String=} thousandsSeparator - Can be zero or one character in length. If invalid or omitted, a zero-length string is used.
	 * @param {Boolean=} useParenthesis - If true, negative values will be represented with parenthesis (instead of a leading minus sign).
	 * @returns {Number}
	 */
	function parsePrice(value, unitCode, fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {
		if (is.number(value)) {
			return value;
		}

		if (!is.string(value) || value.length === 0) {
			return Number.NaN;
		}

		let baseCode = convertUnitCodeToBaseCode(unitCode);

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

	return parsePrice;
})();