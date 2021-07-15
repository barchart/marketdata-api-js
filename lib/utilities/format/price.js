const is = require('@barchart/common-js/lang/is');

const formatDecimal = require('./decimal'),
	formatFraction = require('./fraction');

const UnitCode = require('./../data/UnitCode');

module.exports = (() => {
	'use strict';

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

		specialFractions = is.boolean(specialFractions) && specialFractions;
		useParenthesis = is.boolean(useParenthesis) && useParenthesis;

		if (!unitCodeItem.supportsFractions || fractionSeparator === '.') {
			return formatDecimal(value, unitCodeItem.decimalDigits, thousandsSeparator, useParenthesis);
		} else {
			const fractionFactor = unitCodeItem.getFractionFactor(specialFractions);
			const fractionDigits = unitCodeItem.getFractionDigits(specialFractions);

			return formatFraction(value, fractionFactor, fractionDigits, fractionSeparator, useParenthesis);
		}
	}

	return formatPrice;
})();