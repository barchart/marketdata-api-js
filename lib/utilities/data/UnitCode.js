const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * Describes how an instrument's price is formatted. In most cases, unit codes are stored as a
	 * since character; however, this enumeration adds additional information. There are fourteen
	 * distinct unit codes.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {Number} baseCode
	 * @param {Number} decimals
	 * @param {Boolean} supportsFractions
	 */
	class UnitCode extends Enum {
		constructor(code, baseCode, decimals, supportsFractions) {
			super(code, code);

			this._baseCode = baseCode;

			this._decimals = decimals;
			this._supportsFractions = supportsFractions;
		}

		/**
		 * The number of decimal places used for formatting -- in decimal mode.
		 *
		 * @public
		 * @returns {Number}
		 */
		get decimals() {
			return this._decimals;
		}

		/**
		 * Indicates if formatting can use an alternative to decimal notation (i.e.
		 * fractional notation).
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get supportsFractions() {
			return this._supportsFractions;
		}

		/**
		 * Converts a unit code character into a {@link UnitCode} enumeration item.
		 *
		 * @public
		 * @static
		 * @param {String} code
		 * @returns {*|null}
		 */
		static parse(code) {
			return Enum.fromCode(UnitCode, code);
		}

		static toString() {
			return `[UnitCode (code=${this.code})]`;
		}
	}

	const TWO = new UnitCode('2', -1, 3, true);
	const THREE = new UnitCode('3', -2, 4, true);
	const FOUR = new UnitCode('4', -3, 5, true);
	const FIVE = new UnitCode('5', -4, 6, true);
	const SIX = new UnitCode('6', -5, 7, true);
	const SEVEN = new UnitCode('7', -6, 8, true);

	const EIGHT = new UnitCode('8', 0, 0, false);
	const NINE = new UnitCode('9', 1, 1, false);

	const A = new UnitCode('A', 2, 2, false);
	const B = new UnitCode('B', 3, 3, false);
	const C = new UnitCode('C', 4, 4, false);
	const D = new UnitCode('D', 5, 5, false);
	const E = new UnitCode('E', 6, 6, false);
	const F = new UnitCode('F', 7, 7, false);

	return UnitCode;
})();
