const is = require('@barchart/common-js/lang/is');

const formatDecimal = require('../format/decimal');

module.exports = (() => {
	'use strict';

	class PriceFormatter {
		constructor(fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {

		}

		static withOptions(fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {

		}

		toString() {
			return '[PriceFormatter]';
		}
	}

	function frontPad(value, digits) {
		return ['000', Math.floor(value)].join('').substr(-1 * digits);
	}

	return function(fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {
		let format;

		function getWholeNumberAsString(value) {
			const val = Math.floor(value);

			if ((val === 0) && (fractionSeparator === '')) {
				return '';
			} else {
				return val;
			}
		}

		if (fractionSeparator === '.') {
			format = (value, unitcode) => {
				switch (unitcode) {
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
						if (value === '' || value === undefined || value === null || is.nan(value)) {
							return '';
						} else {
							return value;
						}
				}
			};
		} else {
			format = (value, unitcode) => {
				if (value === '' || value === undefined || value === null || is.nan(value)) {
					return '';
				}

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

				switch (unitcode) {
					case '2':
						return [prefix, getWholeNumberAsString(absoluteValue), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * 8, 1), suffix].join('');
					case '3':
						return [prefix, getWholeNumberAsString(absoluteValue), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * 16, 2), suffix].join('');
					case '4':
						return [prefix, getWholeNumberAsString(absoluteValue), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * 32, 2), suffix].join('');
					case '5':
						return [prefix, getWholeNumberAsString(absoluteValue), fractionSeparator, frontPad(Math.floor(((absoluteValue - Math.floor(absoluteValue)) * (specialFractions ? 320 : 64)).toFixed(1)), (specialFractions ? 3 : 2)), suffix].join('');
					case '6':
						return [prefix, getWholeNumberAsString(absoluteValue), fractionSeparator, frontPad(Math.floor(((absoluteValue - Math.floor(absoluteValue)) * (specialFractions ? 320 : 128)).toFixed(1)), 3), suffix].join('');
					case '7':
						return [prefix, getWholeNumberAsString(absoluteValue), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * (specialFractions ? 320 : 256), 3), suffix].join('');
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
						return originalValue;
				}
			};
		}

		return {
			format: format
		};
	};
})();