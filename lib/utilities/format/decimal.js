const is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * Formats a number as decimal value (with a given number of digits after the decimal place,
	 * thousands separator(s), and options for displaying negative values).
	 *
	 * @exported
	 * @function
	 * @memberOf Functions
	 * @param {Number} value
	 * @param {Number} digits
	 * @param {String=} thousandsSeparator
	 * @param {Boolean=} useParenthesis
	 * @returns {String}
	 */
	function formatDecimal(value, digits, thousandsSeparator, useParenthesis) {
		if (!is.number(value)) {
			return '';
		}

		if (!is.string(thousandsSeparator) || thousandsSeparator.length > 1) {
			thousandsSeparator = '';
		}

		const applyParenthesis = value < 0 && useParenthesis === true;

		if (applyParenthesis) {
			value = 0 - value;
		}

		let formatted = value.toFixed(digits);

		if (thousandsSeparator && (value < -999 || value > 999)) {
			const length = formatted.length;
			const negative = value < 0;

			let found = digits === 0;
			let counter = 0;

			const buffer = [];

			for (let i = (length - 1); !(i < 0); i--) {
				if (counter === 3 && !(negative && i === 0)) {
					buffer.unshift(thousandsSeparator);

					counter = 0;
				}

				const character = formatted.charAt(i);

				buffer.unshift(character);

				if (found) {
					counter = counter + 1;
				} else if (character === '.') {
					found = true;
				}
			}

			if (applyParenthesis) {
				buffer.unshift('(');
				buffer.push(')');
			}

			formatted = buffer.join('');
		} else if (applyParenthesis) {
			formatted = '(' + formatted + ')';
		}

		return formatted;
	}

	return formatDecimal;
})();