const SymbolParser = require('./../utilities/parsers/SymbolParser'),
	buildPriceFormatter = require('../utilities/format/factories/price');

module.exports = (() => {
	'use strict';

	let profiles = { };

	let formatter = buildPriceFormatter('-', true, ',');

	/**
	 * Describes an instrument.
	 *
	 * @public
	 * @param {string} symbol
	 * @param {name} name
	 * @param {string} exchangeId
	 * @param {string} unitCode
	 * @param {string} pointValue
	 * @param {number} tickIncrement
	 * @param {Exchange=} exchange
	 * @param {Object=} additional
	 */
	class Profile {
		constructor(symbol, name, exchangeId, unitCode, pointValue, tickIncrement, exchange, additional) {
			/**
			 * @property {string} symbol - the symbol of the instrument.
			 */
			this.symbol = symbol;

			/**
			 * @property {string} name - the name of the instrument.
			 */
			this.name = name;

			/**
			 * @property {string} exchange - code of the listing exchange.
			 */
			this.exchange = exchangeId;

			/**
			 * @property {string} unitCode - code indicating how a prices for the instrument should be formatted.
			 */
			this.unitCode = unitCode;

			/**
			 * @property {string} pointValue - the change in value for a one point change in price.
			 */
			this.pointValue = pointValue;

			/**
			 * @property {number} tickIncrement - the minimum price movement.
			 */
			this.tickIncrement = tickIncrement;

			/**
			 * @property {Exchange|null} exchangeRef
			 */
			this.exchangeRef = exchange || null;

			const info = SymbolParser.parseInstrumentType(this.symbol);

			if (info) {
				if (info.type === 'future') {
					/**
					 * @property {string|undefined} root - the root symbol, if a future; otherwise undefined.
					 */
					this.root = info.root;

					/**
					 * @property {string|undefined} month - the month code, if a future; otherwise undefined.
					 */
					this.month = info.month;

					/**
					 * @property {undefined|number} year - the expiration year, if a future; otherwise undefined.
					 */
					this.year = info.year;

					/**
					 * @property {string|undefined} expiration - the expiration date, as a string, formatted YYYY-MM-DD.
					 */
					this.expiration = null;

					/**
					 * @property {string|undefined} expiration - the first notice date, as a string, formatted YYYY-MM-DD.
					 */
					this.firstNotice = null;
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
			formatter = buildPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator);
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

		toString() {
			return `[Profile (symbol=${this.symbol})]`;
		}
	}

	return Profile;
})();