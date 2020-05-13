const is = require('@barchart/common-js/lang/is');

const UnitCode = require('./../data/UnitCode');

module.exports = (() => {
	'use strict';

	const regex = {};

	regex.fractions = {};
	regex.fractions.separators = /([0-9]+)([\-'])([0-9]{1,3}$)/;

	function coerce(text) {
		return text * 1;
	}

	/**
	 * Converts a string-formatted price into a number. If the value cannot be parsed,
	 * the {@link Number.NaN} value is returned.
	 *
	 * @function
	 * @memberOf Functions
	 * @exported
	 * @param {String|Number} value
	 * @param {String} unitCode
	 * @param {String=} fractionSeparator - Can be zero or one character in length. If invalid or omitted, the separator will be inferred based on the value being parsed.
	 * @param {Boolean=} specialFractions -  If fractional notation is used, indicates if the "special" factor (i.e. denominator) was used to calculate the numerator of the value being parsed.
	 * @param {String=} thousandsSeparator - Can be zero or one character in length. If invalid or omitted, the parameter will be ignored.
	 * @returns {Number}
	 */
	function parsePrice(value, unitCode, fractionSeparator, specialFractions, thousandsSeparator) {
		if (is.number(value)) {
			return value;
		}

		if (!is.string(value) || value.length === 0) {
			return Number.NaN;
		}

		const unitCodeItem = UnitCode.parse(unitCode);

		if (unitCodeItem === null) {
			return Number.NaN;
		}

		let negative;

		if (value.startsWith('(') && value.endsWith(')')) {
			negative = true;

			value = value.slice(1, -1);
		} else if (value.startsWith('-')) {
			negative = true;

			value = value.slice(1);
		} else {
			negative = false;
		}

		if (is.string(fractionSeparator) && fractionSeparator.length < 2) {
			fractionSeparator = fractionSeparator;
		} else if (unitCodeItem.supportsFractions && regex.fractions.separators.test(value)) {
			fractionSeparator = value.match(regex.fractions.separators)[2];
		} else {
			fractionSeparator = '.';
		}

		if (!is.string(thousandsSeparator) || thousandsSeparator.length > 1) {
			thousandsSeparator = '';
		}

		if (thousandsSeparator.length !== 0) {
			const digitGroups = value.split(thousandsSeparator);

			const assumeFractionSeparator = thousandsSeparator === fractionSeparator && digitGroups.length > 1;

			if (assumeFractionSeparator) {
				const fractionGroup = digitGroups.pop();

				digitGroups.push(fractionSeparator);
				digitGroups.push(fractionGroup);
			}

			value = digitGroups.join('');
		}

		let absoluteValue;

		if (unitCodeItem.supportsFractions && fractionSeparator !== '.') {
			specialFractions = is.boolean(specialFractions) && specialFractions;

			const fractionDigits = unitCodeItem.getFractionDigits(specialFractions);

			let integerCharacters;
			let fractionCharacters;

			if (fractionSeparator.length === 1) {
				const characterGroups = value.split(fractionSeparator);

				integerCharacters = characterGroups[0];
				fractionCharacters = characterGroups[1];
			} else {
				integerCharacters = value.substring(0, value.length - fractionDigits - fractionSeparator.length);
				fractionCharacters = value.slice(-fractionDigits);
			}

			if (fractionCharacters.length !== fractionDigits) {
				return Number.NaN;
			}

			if (integerCharacters === '') {
				integerCharacters = '0';
			}

			const integerPart = parseInt(integerCharacters);
			const fractionPart = parseInt(fractionCharacters);

			if (is.nan(integerPart) || is.nan(fractionPart)) {
				return Number.NaN;
			}

			const denominator = unitCodeItem.getFractionFactor(specialFractions);

			absoluteValue = integerPart + (fractionPart / denominator);
		} else {
			const roundingFactor = Math.pow(10, unitCodeItem.decimalDigits);

			absoluteValue = Math.round(coerce(value) * roundingFactor) / roundingFactor;
		}

		if (negative) {
			return -absoluteValue;
		} else {
			return absoluteValue;
		}
	}

	return parsePrice;
})();