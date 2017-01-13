var parseSymbolType = require('./../util/parseSymbolType');
var priceFormatter = require('./../util/priceFormatter');

module.exports = (() => {
	'use strict';

	let profiles = { };
	let formatter = priceFormatter('-', true, ',').format;

	/**
	 * Describes an instrument.
	 *
	 * @public
	 */
	class Profile {
		constructor(symbol, name, exchange, unitCode, pointValue, tickIncrement) {
			/**
			 * @property {string} symbol - The instrument's symbol.
			 */
			this.symbol = symbol;

			/**
			 * @property {string} name - The instrument's name.
			 */
			this.name = name;

			/**
			 * @property {string} exchange - The code for the listing exchange.
			 */
			this.exchange = exchange;

			/**
			 * @property {string} unitCode - Code used to describe how a price should be formatted.
			 */
			this.unitCode = unitCode;

			/**
			 * @property {string} unitCode - The value of one point in dollar terms. For equities, always one.
			 */
			this.pointValue = pointValue;

			/**
			 * @property {number} tickIncrement - The minimum price movement.
			 */
			this.tickIncrement = tickIncrement;

			var info = parseSymbolType(this.symbol);

			if (info) {
				if (info.type === 'future') {
					/**
					 * @property {undefined|string} root - The root symbol, if a future; otherwise undefined.
					 */
					this.root = info.root;

					/**
					 * @property {undefined|string} root - The month code, if a future; otherwise undefined.
					 */
					this.month = info.month;

					/**
					 * @property {undefined|number} root - The expiration year, if a symbol; otherwise undefined.
					 */
					this.year = info.year;
				}
			}

			profiles[symbol] = this;
		}

		/**
		 * Given a numeric price, returns a human-readable price.
		 *
		 * @public
		 * @param {number} price
		 * @returns {string}
		 */
		formatPrice(price) {
			return formatter(price);
		}


		/**
		 * Configures the logic used to format all prices using the {@link Profile#formatPrice} instance function.
		 *
		 * @public
		 * @param {string} fractionSeparator - Usually a dash or a period, for some instruments, this will be ignored.
		 * @param {boolean} specialFractions - Usually true, for some instruments, this will have no effect.
		 * @parram {string} thousandsSeparator - Usually a comma.
		 */
		static setPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator) {
			formatter = priceFormatter(fractionSeparator, specialFractions, thousandsSeparator).format;
		}

		/**
		 * Alias for {@link Profile.setPriceFormatter} function.
		 *
		 * @deprecated
		 * @public
		 * @see {@link Profile.setPriceFormatter}
		 */
		static PriceFormatter(fractionSeparator, specialFractions, thousandsSeparator) {
			Profile.setPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator);
		}

		/**
		 * @protected
		 * @ignore
		 */
		static get Profiles() {
			return profiles;
		}
	}

	return Profile;
})();