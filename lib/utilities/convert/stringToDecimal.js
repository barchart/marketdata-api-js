const convertUnitCodeToBaseCode = require('./unitCodeToBaseCode');

module.exports = (() => {
	'use strict';

	// Adapted from legacy code at https://github.com/barchart/php-jscharts/blob/372deb9b4d9ee678f32b6f8c4268434249c1b4ac/chart_package/webroot/js/deps/ddfplus/com.ddfplus.js

	/**
	 * Converts a unit code into a base code.
	 *
	 * @function
	 * @param {String} unitCode
	 * @return {Number}
	 */
	return (string, unitCode) => {
		let baseCode = convertUnitCodeToBaseCode(unitCode);

		// Fix for 10-Yr T-Notes
		if (baseCode === -4 && (string.length === 7 || (string.length === 6 && string.charAt(0) !== '1'))) {
			baseCode -= 1;
		}

		if (baseCode >= 0) {
			const ival = string * 1;
			return Math.round(ival * Math.pow(10, baseCode)) / Math.pow(10, baseCode);
		} else {
			let is_negative = false;

			if (string.match(/^-/)) {
				is_negative = true;
				string = string.slice(1);
			}

			const has_dash = string.match(/-/);
			let divisor = Math.pow(2, Math.abs(baseCode) + 2);
			const fracsize = String(divisor).length;
			const denomstart = string.length - fracsize;

			let numerend = denomstart;

			if (string.substring(numerend - 1, numerend) === '-') {
				numerend--;
			}

			const numerator = (string.substring(0, numerend)) * 1;
			const denominator = (string.substring(denomstart, string.length)) * 1;

			if ( baseCode === -5) {
				divisor = has_dash ? 320 : 128;
			}

			return (numerator + (denominator / divisor)) * (is_negative ? -1 : 1);
		}
	};
})();