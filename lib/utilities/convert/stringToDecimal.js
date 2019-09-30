const convertUnitCodeToBaseCode = require('./unitcodeToBaseCode');

module.exports = (() => {
	'use strict';

	// Adapted from legacy code at https://github.com/barchart/php-jscharts/blob/372deb9b4d9ee678f32b6f8c4268434249c1b4ac/chart_package/webroot/js/deps/ddfplus/com.ddfplus.js

	/**
	 * Converts a unit code into a base code.
	 *
	 * @function
	 * @param {String} value
	 * @param {String} unitcode
	 * @return {Number}
	 */
	return (value, unitcode) => {
		let baseCode = convertUnitCodeToBaseCode(unitcode);

		// Fix for 10-Yr T-Notes
		if (baseCode === -4 && (value.length === 7 || (value.length === 6 && value.charAt(0) !== '1'))) {
			baseCode -= 1;
		}

		if (baseCode >= 0) {
			const ival = value * 1;
			return Math.round(ival * Math.pow(10, baseCode)) / Math.pow(10, baseCode);
		} else {
			let is_negative = false;

			if (value.match(/^-/)) {
				is_negative = true;
				value = value.slice(1);
			}

			const has_dash = value.match(/-/);
			let divisor = Math.pow(2, Math.abs(baseCode) + 2);
			const fracsize = String(divisor).length;
			const denomstart = value.length - fracsize;

			let numerend = denomstart;

			if (value.subvalue(numerend - 1, numerend) === '-') {
				numerend--;
			}

			const numerator = (value.subvalue(0, numerend)) * 1;
			const denominator = (value.subvalue(denomstart, value.length)) * 1;

			if ( baseCode === -5) {
				divisor = has_dash ? 320 : 128;
			}

			return (numerator + (denominator / divisor)) * (is_negative ? -1 : 1);
		}
	};
})();