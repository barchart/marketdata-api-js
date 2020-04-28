const is = require('@barchart/common-js/lang/is');

const formatDecimal = require('./decimal');

const UnitCode = require('./../data/UnitCode');

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
	 * Converts a numeric price into a human-readable string. One of two modes
	 * may be used, depending on the unit code and fraction separator. For example,
	 * using unit code "2" the value 9.5432 is formatted as "9.543" in decimal
	 * mode and "9-4" in fractional mode.
	 *
	 * @exported
	 * @function
	 * @memberOf Functions
	 * @param {Number} value
	 * @param {String} unitCode
	 * @param {String=} fractionSeparator - Can be zero or one character in length. If invalid or omitted, a decimal notation is used. If non-decimal, then fractional notation is used (assuming supported by unit code).
	 * @param {Boolean=} specialFractions - If fractional notation is used, indicates if the "special" factor (i.e. denominator) is used to calculate numerator.
	 * @param {String=} thousandsSeparator - Can be zero or one character in length. If invalid or omitted, a zero-length string is used.
	 * @param {Boolean=} useParenthesis - If true, negative values will be represented with parenthesis (instead of a leading minus sign).
	 * @returns {String}
	 */
	function formatPrice(value, unitCode, fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {
		if (!is.number(value)) {
			return '';
		}

		const unitCodeItem = UnitCode.parse(unitCode);

		if (unitCodeItem === null) {
			return '';
		}

		if (!is.string(fractionSeparator) || fractionSeparator.length > 1) {
			fractionSeparator = '.';
		}

		if (!is.string(thousandsSeparator) || thousandsSeparator.length > 1) {
			thousandsSeparator = '';
		}

		specialFractions = is.boolean(specialFractions) && specialFractions;
		useParenthesis = is.boolean(useParenthesis) && useParenthesis;

		if (!unitCodeItem.supportsFractions || fractionSeparator === '.') {
			return formatDecimal(value, unitCodeItem.decimalDigits, thousandsSeparator, useParenthesis);
		} else {
			let prefix;
			let suffix;

			if (value < 0) {
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

			const absoluteValue = Math.abs(value);

			const integerPart = getIntegerPart(absoluteValue, fractionSeparator);
			const decimalPart = getDecimalPart(absoluteValue);

			const denominator = unitCodeItem.getFractionFactor(specialFractions);
			const numerator = decimalPart * denominator;

			const roundedNumerator = Math.floor(parseFloat(numerator.toFixed(1)));
			const formattedNumerator = frontPad(roundedNumerator, unitCodeItem.getFractionDigits(specialFractions));

			return [ prefix, integerPart, fractionSeparator, formattedNumerator, suffix ].join('');
		}
	}

	return formatPrice;
})();