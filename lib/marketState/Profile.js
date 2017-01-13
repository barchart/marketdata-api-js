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
			this.symbol = symbol;
			this.name = name;
			this.exchange = exchange;
			this.unitCode = unitCode;
			this.pointValue = pointValue;
			this.tickIncrement = tickIncrement;

			var info = parseSymbolType(this.symbol);

			if (info) {
				if (info.type === 'future') {
					this.root = info.root;
					this.month = info.month;
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