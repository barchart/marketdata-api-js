const SymbolParser = require('./../utilities/parsers/SymbolParser'),
	buildPriceFormatter = require('../utilities/format/factories/price');

module.exports = (() => {
	'use strict';

	let profiles = { };

	let formatter = buildPriceFormatter('-', true, ',');

	/**
	 * Describes an instrument (associated with a unique symbol).
	 *
	 * @public
	 */
	class Profile {
		constructor(symbol, name, exchangeId, unitCode, pointValue, tickIncrement, exchange, additional) {
			/**
			 * @property {string} symbol - Symbol of the instrument.
			 * @public
			 * @readonly
			 */
			this.symbol = symbol;

			/**
			 * @property {string} name - Name of the instrument.
			 * @public
			 * @readonly
			 */
			this.name = name;

			/**
			 * @property {string} exchange - Code for the listing exchange.
			 * @public
			 * @readonly
			 */
			this.exchange = exchangeId;

			/**
			 * @property {Exchange|null} exchangeRef - The {@link Exchange}.
			 * @public
			 * @readonly
			 */
			this.exchangeRef = exchange || null;

			/**
			 * @property {string} unitCode - Code indicating how a prices should be formatted.
			 * @public
			 * @readonly
			 */
			this.unitCode = unitCode;

			/**
			 * @property {string} pointValue - The change in value for a one point change in price.
			 * @public
			 * @readonly
			 */
			this.pointValue = pointValue;

			/**
			 * @property {number} tickIncrement - The minimum price movement.
			 * @public
			 * @readonly
			 */
			this.tickIncrement = tickIncrement;

			const info = SymbolParser.parseInstrumentType(this.symbol);

			if (info) {
				if (info.type === 'future') {
					/**
					 * @property {string|undefined} root - Root symbol (futures only).
					 * @public
					 * @readonly
					 */
					this.root = info.root;

					/**
					 * @property {string|undefined} month - Month code (futures only).
					 */
					this.month = info.month;

					/**
					 * @property {number|undefined} year - Expiration year (futures only).
					 */
					this.year = info.year;

					/**
					 * @property {string|undefined} expiration - Expiration date, formatted as YYYY-MM-DD (futures only).
					 */
					this.expiration = null;

					/**
					 * @property {string|undefined} expiration - First notice date, formatted as YYYY-MM-DD (futures only).
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
		 * Given a price, returns a the human-readable string representation.
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
		 * @public
		 * @static
		 * @ignore
		 * @deprecated
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