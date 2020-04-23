const is = require('@barchart/common-js/lang/is');

const formatDecimal = require('./decimal');

module.exports = (() => {
	'use strict';

	function frontPad(value, digits) {
		return ['000', Math.floor(value)].join('').substr(-1 * digits);
	}

	function getWholeNumberAsString(value, fractionSeparator) {
		const floor = Math.floor(value);

		if (floor === 0 && fractionSeparator === '') {
			return '';
		} else {
			return floor;
		}
	}

	/**
	 * Formats a number as a string.
	 *
	 * @exported
	 * @function
	 * @memberOf Functions
	 * @param {Number} value
	 * @param {String} unitCode
	 * @param {String=} fractionSeparator - Can be zero or one character in length. If invalid or omitted, a decimal point (i.e. dot) is assumed.
	 * @param {Boolean=} specialFractions
	 * @param {String=} thousandsSeparator - Can be zero or one character in length. If invalid or omitted, a zero-length string is used.
	 * @param {Boolean=} useParenthesis
	 * @returns {String}
	 */
	function formatPrice(value, unitCode, fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {
		if (is.undefined(value) || is.null(value) || is.nan(value) || is.zeroLengthString(value) || !is.number(value)) {
			return '';
		}

		if (!is.string(thousandsSeparator) || thousandsSeparator.length > 1) {
			thousandsSeparator = '';
		}

		if (!is.string(fractionSeparator) || fractionSeparator.length > 1) {
			fractionSeparator = '.';
		}

		specialFractions = is.boolean(specialFractions) && specialFractions;
		useParenthesis = is.boolean(useParenthesis) && useParenthesis;

		if (fractionSeparator === '.') {
			switch (unitCode) {
				case '2':
					return formatDecimal(value, 3, thousandsSeparator, useParenthesis);
				case '3':
					return formatDecimal(value, 4, thousandsSeparator, useParenthesis);
				case '4':
					return formatDecimal(value, 5, thousandsSeparator, useParenthesis);
				case '5':
					return formatDecimal(value, 6, thousandsSeparator, useParenthesis);
				case '6':
					return formatDecimal(value, 7, thousandsSeparator, useParenthesis);
				case '7':
					return formatDecimal(value, 8, thousandsSeparator, useParenthesis);
				case '8':
					return formatDecimal(value, 0, thousandsSeparator, useParenthesis);
				case '9':
					return formatDecimal(value, 1, thousandsSeparator, useParenthesis);
				case 'A':
					return formatDecimal(value, 2, thousandsSeparator, useParenthesis);
				case 'B':
					return formatDecimal(value, 3, thousandsSeparator, useParenthesis);
				case 'C':
					return formatDecimal(value, 4, thousandsSeparator, useParenthesis);
				case 'D':
					return formatDecimal(value, 5, thousandsSeparator, useParenthesis);
				case 'E':
					return formatDecimal(value, 6, thousandsSeparator, useParenthesis);
				default:
					return '';
			}
		} else {
			const originalValue = value;
			const absoluteValue = Math.abs(value);

			const negative = value < 0;

			let prefix;
			let suffix;

			if (negative) {
				if (useParenthesis === true) {
					prefix = '(';
					suffix = ')';
				} else {
					prefix = '-';
					suffix = '';
				}
			} else {
				prefix = '';
				suffix = '';
			}

			switch (unitCode) {
				case '2':
					return [prefix, getWholeNumberAsString(absoluteValue, fractionSeparator), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * 8, 1), suffix].join('');
				case '3':
					return [prefix, getWholeNumberAsString(absoluteValue, fractionSeparator), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * 16, 2), suffix].join('');
				case '4':
					return [prefix, getWholeNumberAsString(absoluteValue, fractionSeparator), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * 32, 2), suffix].join('');
				case '5':
					return [prefix, getWholeNumberAsString(absoluteValue, fractionSeparator), fractionSeparator, frontPad(Math.floor(((absoluteValue - Math.floor(absoluteValue)) * (specialFractions ? 320 : 64)).toFixed(1)), (specialFractions ? 3 : 2)), suffix].join('');
				case '6':
					return [prefix, getWholeNumberAsString(absoluteValue, fractionSeparator), fractionSeparator, frontPad(Math.floor(((absoluteValue - Math.floor(absoluteValue)) * (specialFractions ? 320 : 128)).toFixed(1)), 3), suffix].join('');
				case '7':
					return [prefix, getWholeNumberAsString(absoluteValue, fractionSeparator), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * (specialFractions ? 320 : 256), 3), suffix].join('');
				case '8':
					return formatDecimal(originalValue, 0, thousandsSeparator, useParenthesis);
				case '9':
					return formatDecimal(originalValue, 1, thousandsSeparator, useParenthesis);
				case 'A':
					return formatDecimal(originalValue, 2, thousandsSeparator, useParenthesis);
				case 'B':
					return formatDecimal(originalValue, 3, thousandsSeparator, useParenthesis);
				case 'C':
					return formatDecimal(originalValue, 4, thousandsSeparator, useParenthesis);
				case 'D':
					return formatDecimal(originalValue, 5, thousandsSeparator, useParenthesis);
				case 'E':
					return formatDecimal(originalValue, 6, thousandsSeparator, useParenthesis);
				default:
					return '';
			}
		}
	}

	return formatPrice;
})();