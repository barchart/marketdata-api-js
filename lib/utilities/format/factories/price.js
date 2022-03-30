const formatPrice = require('./../price');

module.exports = (() => {
	'use strict';

	/**
	 * Returns a {@link PriceFormatterFactory~formatPrice} which uses
	 * the configuration supplied to this function as parameters.
	 *
	 * @exported
	 * @function
	 * @param {String=} fractionSeparator
	 * @param {Boolean=} specialFractions
	 * @param {String=} thousandsSeparator
	 * @param {Boolean=} useParenthesis
	 * @returns {PriceFormatterFactory~formatPrice}
	 */
	function buildPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {
		return (value, unitCode, profile) => formatPrice(value, unitCode, fractionSeparator, specialFractions, thousandsSeparator, useParenthesis);
	}

	/**
	 * Accepts a numeric value and a unit code, and returns a formatted price as a string.
	 *
	 * @public
	 * @callback PriceFormatterFactory~formatPrice
	 * @param {Number} value
	 * @param {String} unitCode
	 * @param {Profile} profile
	 * @returns {String}
	 */

	return buildPriceFormatter;
})();