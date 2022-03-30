const is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	function getIntegerPart(value, fractionSeparator) {
		const floor = Math.floor(value);

		if (floor === 0 && fractionSeparator === '') {
			return '';
		} else {
			return floor;
		}
	}

	function getDecimalPart(absoluteValue) {
		return absoluteValue - Math.floor(absoluteValue);
	}

	function frontPad(value, digits) {
		return ['000', Math.floor(value)].join('').substr(-1 * digits);
	}

	/**
	 * Formats a value using fractional tick notation.
	 *
	 * @exported
	 * @function
	 * @memberOf Functions
	 * @param {Number} value - The decimal value to format as a fraction.
	 * @param {Number} fractionFactor - The count of discrete prices which a unit can be divided into (e.g. a US dollar can be divided into 100 cents). By default, this is also the implied denominator in fractional notation (e.g. 3.6875 equals 3 and 22/32 — which is represented in fractional notation as "3-22" where the denominator of 32 is implied).
	 * @param {Number} fractionDigits - The number of digits of the fraction's numerator to display (e.g. using two digits, the fraction 22/32 is shown as "0-22"; using three digits, the fraction 22.375/32 is shown as "0-223").
	 * @param {String=} fractionSeparator - An optional character to insert between the whole and fractional part of the value.
	 * @param {Boolean=} useParenthesis - If true, negative values will be wrapped in parenthesis.
	 * @returns {String}
	 */
	function formatFraction(value, fractionFactor, fractionDigits, fractionSeparator, useParenthesis) {
		if (!is.number(value)) {
			return '';
		}

		if (!is.number(fractionFactor)) {
			return '';
		}

		if (!is.number(fractionDigits)) {
			return '';
		}

		if (!is.string(fractionSeparator) || fractionSeparator.length > 1) {
			fractionSeparator = '.';
		}

		const absoluteValue = Math.abs(value);

		const integerPart = getIntegerPart(absoluteValue, fractionSeparator);
		const decimalPart = getDecimalPart(absoluteValue);

		const denominator = fractionFactor;
		const numerator = decimalPart * denominator;

		const roundedNumerator = Math.floor(parseFloat(numerator.toFixed(1)));
		const formattedNumerator = frontPad(roundedNumerator, fractionDigits);

		let prefix;
		let suffix;

		if (value < 0) {
			useParenthesis = is.boolean(useParenthesis) && useParenthesis;

			if (useParenthesis) {
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

		return [prefix, integerPart, fractionSeparator, formattedNumerator, suffix].join('');
	}

	return formatFraction;
})();