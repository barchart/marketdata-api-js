const is = require('@barchart/common-js/lang/is');

const formatDecimal = require('./decimal');

const UnitCode = require('./../data/UnitCode');

module.exports = (() => {
	'use strict';

	function frontPad(value, digits) {
		return ['000', Math.floor(value)].join('').substr(-1 * digits);
	}

	function getIntegerPart(value, fractionSeparator) {
		const floor = Math.floor(value);

		if (floor === 0 && fractionSeparator === '') {
			return '';
		} else {
			return floor;
		}
	}

	function getDecimalPart(absoluteValue) {
		return absoluteValue - Math.floor(absoluteValue)
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
			return formatDecimal(value, unitCodeItem.decimals, thousandsSeparator, useParenthesis);
		} else {
			const negative = value < 0;

			let prefix;
			let suffix;

			if (negative) {
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

			switch (unitCode) {
				case '2':
					return [prefix, getIntegerPart(absoluteValue, fractionSeparator), fractionSeparator, frontPad(getDecimalPart(absoluteValue) * 8, 1), suffix].join('');
				case '3':
					return [prefix, getIntegerPart(absoluteValue, fractionSeparator), fractionSeparator, frontPad(getDecimalPart(absoluteValue) * 16, 2), suffix].join('');
				case '4':
					return [prefix, getIntegerPart(absoluteValue, fractionSeparator), fractionSeparator, frontPad(getDecimalPart(absoluteValue) * 32, 2), suffix].join('');
				case '5':
					return [prefix, getIntegerPart(absoluteValue, fractionSeparator), fractionSeparator, frontPad(Math.floor((getDecimalPart(absoluteValue) * (specialFractions ? 320 : 64)).toFixed(1)), (specialFractions ? 3 : 2)), suffix].join('');
				case '6':
					return [prefix, getIntegerPart(absoluteValue, fractionSeparator), fractionSeparator, frontPad(Math.floor((getDecimalPart(absoluteValue) * (specialFractions ? 320 : 128)).toFixed(1)), 3), suffix].join('');
				case '7':
					return [prefix, getIntegerPart(absoluteValue, fractionSeparator), fractionSeparator, frontPad(getDecimalPart(absoluteValue) * (specialFractions ? 320 : 256), 3), suffix].join('');
				default:
					return '';
			}
		}
	}

	return formatPrice;
})();