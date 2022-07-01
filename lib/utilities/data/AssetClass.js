const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration for instrument types (e.g. stock, future, etc).
	 *
	 * @public
	 * @exported
	 * @extends {Enum}
	 * @param {String} code
	 * @param {String} description
	 * @param {Number} id
	 */
	class AssetClass extends Enum {
		constructor(code, description, id) {
			super(code, description);

			this._id = id;
		}

		/**
		 * A unique numeric identifier assigned by Barchart.
		 *
		 * @public
		 * @returns {Number}
		 */
		get id() {
			return this._id;
		}

		toJSON() {
			return this._id;
		}

		/**
		 * Converts the string-based identifier into an enumeration item.
		 *
		 * @public
		 * @static
		 * @param {String} code
		 * @returns {AssetClass|null}
		 */
		static parse(code) {
			return Enum.fromCode(AssetClass, code);
		}

		/**
		 * Converts the numeric identifier into an enumeration item.
		 *
		 * @public
		 * @static
		 * @param {Number} id
		 * @returns {AssetClass|null}
		 */
		static fromId(id) {
			return Enum.getItems(AssetClass).find(x => x.id === id) || null;
		}

		/**
		 * A stock.
		 *
		 * @public
		 * @static
		 * @returns {AssetClass}
		 */
		static get STOCK() {
			return STOCK;
		}

		/**
		 * A stock option.
		 *
		 * @public
		 * @static
		 * @returns {AssetClass}
		 */
		static get STOCK_OPTION() {
			return STOCK_OPTION;
		}

		/**
		 * A future.
		 *
		 * @public
		 * @static
		 * @returns {AssetClass}
		 */
		static get FUTURE() {
			return FUTURE;
		}

		/**
		 * A future option.
		 *
		 * @public
		 * @static
		 * @returns {AssetClass}
		 */
		static get FUTURE_OPTION() {
			return FUTURE_OPTION;
		}

		/**
		 * A foreign exchange instrument.
		 *
		 * @public
		 * @static
		 * @returns {AssetClass}
		 */
		static get FOREX() {
			return FOREX;
		}

		/**
		 * A cmdtyStats instrument.
		 *
		 * @public
		 * @static
		 * @returns {AssetClass}
		 */
		static get CMDTY_STATS() {
			return CMDTY_STATS;
		}

		toString() {
			return `[AssetClass (id=${this.id}, code=${this.code})]`;
		}
	}

	const STOCK = new AssetClass('STK', 'U.S. Equity', 1);
	const STOCK_OPTION = new AssetClass('STKOPT', 'Equity Option', 34);

	const FUTURE = new AssetClass('FUT', 'Future', 2);
	const FUTURE_OPTION = new AssetClass('FUTOPT', 'Future Option', 12);

	const FOREX = new AssetClass('FOREX', 'FOREX', 10);

	const CMDTY_STATS = new AssetClass('CMDTY', 'cmdtyStats', 24);

	return AssetClass;
})();
