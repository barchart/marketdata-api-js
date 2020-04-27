const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * Describes how an instrument's price is formatted. In most cases, unit codes are stored as a
	 * single character; however, this enumeration adds additional information. There are fourteen
	 * distinct unit codes.
	 *
	 * @public
	 * @exported
	 * @extends {Enum}
	 * @param {String} code
	 * @param {Number} baseCode
	 * @param {Number} decimalDigits
	 * @param {Boolean} supportsFractions
	 * @param {Number=} fractionFactor
	 * @param {Number=} fractionDigits
	 * @param {Number=} fractionFactorSpecial
	 * @param {Number=} fractionDigitsSpecial
	 */
	class UnitCode extends Enum {
		constructor(code, baseCode, decimalDigits, supportsFractions, fractionFactor, fractionDigits, fractionFactorSpecial, fractionDigitsSpecial) {
			super(code, code);

			this._baseCode = baseCode;

			this._decimalDigits = decimalDigits;

			this._supportsFractions = supportsFractions;

			if (supportsFractions) {
				this._fractionFactor = fractionFactor;
				this._fractionDigits = fractionDigits;

				this._fractionFactorSpecial = fractionFactorSpecial || fractionFactor;
				this._fractionDigitsSpecial = fractionDigitsSpecial || fractionDigits;
			} else {
				this._fractionFactor = undefined;
				this._fractionDigits = undefined;

				this._fractionFactorSpecial = undefined;
				this._fractionDigitsSpecial = undefined;
			}
		}

		/**
		 * When formatting in decimal mode, the number of digits to show after the
		 * decimal point.
		 *
		 * @public
		 * @returns {Number}
		 */
		get decimalDigits() {
			return this._decimalDigits;
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
		 * This is because 8 * 0.5 = 4. In other words, the price is quoted in eighths and 0.5 is
		 * four eighths. Using the same logic, the value of 9.75 will be formatted as "9-6" with
		 * a fractional factor of eight.
		 *
		 * @public
		 * @returns {Number|undefined}
		 */
		get fractionFactor() {
			return this._fractionFactor;
		}

		/**
		 * In fractional notation, the number of digits to which appear after the fraction separator.
		 * For example, two digits are used in "9-01" and "9-11" (where a dash is the fraction
		 * separator).
		 *
		 * @public
		 * @returns {Number|undefined}
		 */
		get fractionDigits() {
			return this._fractionDigits;
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
		 * Same as {@link UnitCode#fractionDigits} for "special" fractions.
		 *
		 * @public
		 * @returns {Number|undefined}
		 */
		get fractionDigitsSpecial() {
			return this._fractionDigitsSpecial;
		}

		/**
		 * Returns the {@link UnitCode#fractionFactor} or {@link UnitCode#fractionFactorSpecial} value.
		 *
		 * @public
		 * @param {Boolean=} special
		 * @returns {Number|undefined}
		 */
		getFractionFactor(special) {
			return special === true ? this._fractionFactorSpecial : this._fractionFactor;
		}

		/**
		 * Returns the {@link UnitCode#fractionDigits} or {@link UnitCode#fractionDigitsSpecial} value.
		 *
		 * @public
		 * @param {Boolean=} special
		 * @returns {Number|undefined}
		 */
		getFractionDigits(special) {
			return special === true ? this._fractionDigitsSpecial : this._fractionDigits;
		}

		/**
		 * Converts a unit code character into a {@link UnitCode} enumeration item.
		 *
		 * @public
		 * @static
		 * @param {String} code
		 * @returns {UnitCode|null}
		 */
		static parse(code) {
			return Enum.fromCode(UnitCode, code);
		}

		static toString() {
			return `[UnitCode (code=${this.code})]`;
		}
	}

	const TWO = new UnitCode('2', -1, 3, true, 8, 1);
	const THREE = new UnitCode('3', -2, 4, true, 16, 2);
	const FOUR = new UnitCode('4', -3, 5, true, 32, 2);
	const FIVE = new UnitCode('5', -4, 6, true, 64, 2, 320, 3);
	const SIX = new UnitCode('6', -5, 7, true, 128, 3, 320, 3);
	const SEVEN = new UnitCode('7', -6, 8, true, 256, 3, 320, 3);

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
