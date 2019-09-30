const SymbolParser = require('./../utilities/parsers/SymbolParser'),
	PriceFormatterFactory = require('../utilities/formatters/PriceFormatterFactory');

module.exports = (() => {
	'use strict';

	let profiles = { };

	let formatter = PriceFormatterFactory.build('-', true, ',');

	/**
	 * Describes an instrument.
	 *
	 * @public
	 */
	class Profile {
		constructor(symbol, name, exchange, unitCode, pointValue, tickIncrement, additional) {
			/**
			 * @property {string} symbol - the instrument's symbol
			 */
			this.symbol = symbol;

			/**
			 * @property {string} name - the instrument's name
			 */
			this.name = name;

			/**
			 * @property {string} exchange - the code for the listing exchange
			 */
			this.exchange = exchange;

			/**
			 * @property {string} unitCode - code used to describe how a price should be formatted
			 */
			this.unitCode = unitCode;

			/**
			 * @property {string} pointValue - the change in dollar value for a one point change in price
			 */
			this.pointValue = pointValue;

			/**
			 * @property {number} tickIncrement - the minimum price movement
			 */
			this.tickIncrement = tickIncrement;

			const info = SymbolParser.parseInstrumentType(this.symbol);

			if (info) {
				if (info.type === 'future') {
					/**
					 * @property {undefined|string} root - he root symbol, if a future; otherwise undefined
					 */
					this.root = info.root;

					/**
					 * @property {undefined|string} month - the month code, if a future; otherwise undefined
					 */
					this.month = info.month;

					/**
					 * @property {undefined|number} year - the expiration year, if a symbol; otherwise undefined
					 */
					this.year = info.year;
				}
			}

			if (typeof(additional) === 'object' && additional !== null) {
				for (let p in additional) {
					this[p] = additional[p];
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
			return formatter(price, this.unitCode);
		}

		/**
		 * Configures the logic used to format all prices using the {@link Profile#formatPrice} instance function.
		 *
		 * @public
		 * @param {string} fractionSeparator - usually a dash or a period
		 * @param {boolean} specialFractions - usually true
		 * @param {string=} thousandsSeparator - usually a comma
		 */
		static setPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator) {
			formatter = PriceFormatterFactory.build(fractionSeparator, specialFractions, thousandsSeparator);
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