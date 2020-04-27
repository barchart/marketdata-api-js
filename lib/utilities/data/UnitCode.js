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
	 * @param {Number} fractionFactor
	 * @param {Number} fractionFactorSpecial
	 */
	class UnitCode extends Enum {
		constructor(code, baseCode, decimals, supportsFractions, fractionFactor, fractionFactorSpecial) {
			super(code, code);

			this._baseCode = baseCode;

			this._decimals = decimals;

			this._supportsFractions = supportsFractions;

			if (supportsFractions) {
				this._fractionFactor = fractionFactor;
				this._fractionFactorSpecial = fractionFactorSpecial || fractionFactor;
			} else {
				this._fractionFactor = undefined;
				this._fractionFactorSpecial = undefined;
			}
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
		 * Indicates if formatting can use the alternative to decimal notation -- that
		 * is, fractional notation.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get supportsFractions() {
			return this._supportsFractions;
		}

		/**
		 * When formatting with fractional notation (instead of decimal notation), multiply the
		 * decimal part of the value by this factor to get the fractional (i.e. numerator) value.
		 * In other words, this factor is the denominator.
		 *
		 * For example, the value 9.5 will be formatted as "9-4" with a fractional factor of eight.
		 * This is because 8 * 0.5 = 4. Using the same logic, the value of 9.75 will be formatted
		 * as "9-6" with a fractional factor of eight.
		 *
		 * @public
		 * @returns {Number|undefined}
		 */
		get fractionFactor() {
			return this._fractionFactor;
		}

		/**
		 * Same as {@link UnitCode#fractionFactor} for "special" fractions.
		 *
		 * @public
		 * @returns {Number|undefined}
		 */
		get fractionFactorSpecial() {
			return this._fractionFactorSpecial;
		}

		/**
		 * Returns the {@link UnitCode#fractionFactor} or {@link UnitCode#fractionFactorSpecial}.
		 *
		 * @public
		 * @param {Boolean=} special
		 * @returns {Number|undefined}
		 */
		getFractionFactor(special) {
			return special === true ? this._fractionFactorSpecial : this._fractionFactor;
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

	const TWO = new UnitCode('2', -1, 3, true, 8);
	const THREE = new UnitCode('3', -2, 4, true, 16);
	const FOUR = new UnitCode('4', -3, 5, true, 32);
	const FIVE = new UnitCode('5', -4, 6, true, 64, 320);
	const SIX = new UnitCode('6', -5, 7, true, 128, 320);
	const SEVEN = new UnitCode('7', -6, 8, true, 256, 320);

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
