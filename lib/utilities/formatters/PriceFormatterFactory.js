const formatPrice = require('./../format/price');

module.exports = (() => {
	'use strict';

	/**
	 * Static utilities for building simplified price format functions.
	 *
	 * @public
	 */
	class PriceFormatterFactory {
		constructor() {

		}

		/**
		 * Returns a {@link PriceFormatterFactory~formatPrice} which uses
		 * the configuration supplied to this function as parameters.
		 *
		 * @public
		 * @static
		 * @param {String=} fractionSeparator
		 * @param {Boolean=} specialFractions
		 * @param {String=} thousandsSeparator
		 * @param {Boolean=} useParenthesis
		 * @returns {PriceFormatterFactory~formatPrice}
		 */
		static build(fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {
			return (value, unitcode) => formatPrice(value, unitcode, fractionSeparator, specialFractions, thousandsSeparator, useParenthesis);
		}

		toString() {
			return '[PriceFormatterFactory]';
		}
	}

	/**
	 * Accepts a numeric value and a unit code, and returns a formatted
	 * price as a string.
	 *
	 * @public
	 * @callback PriceFormatterFactory~formatPrice
	 * @param {Number} value
	 * @param {String} unitcode
	 * @returns {String}
	 */

	return PriceFormatterFactory;
})();