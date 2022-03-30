const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	// 2021/07/14, For a more detailed on the "special" fractional formatting (i.e. CME
	// tick notation), please refer to the detailed unit test suite written for CME
	// notation (see the cmeSpec.js file).

	/**
	 * An enumeration that describes different conventions for formatting prices,
	 * as decimals or fractions (using tick notation). Each instrument is assigned
	 * a unit code. See the {@link Profile.unitCode} property.
	 *
	 * Barchart uses fourteen distinct unit codes.
	 *
	 * @public
	 * @exported
	 * @extends {Enum}
	 * @param {String} code
	 * @param {Number} baseCode
	 * @param {Number} decimalDigits - When formatting a price as a decimal value, the number of decimal places to display.
	 * @param {Boolean} supportsFractions - As an alternative to decimal-formatted prices, some instruments support fractional representations.
	 * @param {Number=} fractionFactor - The count of discrete prices which a unit can be divided into (e.g. a US dollar can be divided into 100 cents). By default, this is also the implied denominator in fractional notation (e.g. 3.6875 equals 3 and 22/32 — which is represented in fractional notation as "3-22", where the denominator of 32 is implied).
	 * @param {Number} fractionDigits - The number of digits of the fraction's numerator to display (e.g. using two digits, the fraction 22/32 is shown as "0-22"; using three digits, the fraction 22.375/32 is shown as "0-223").
	 * @param {Number=} fractionFactorSpecial - Special fraction factors refer to the CME tick notation scheme (read more [here](https://www.cmegroup.com/confluence/display/EPICSANDBOX/Fractional+Pricing+-+Tick+and+Decimal+Conversions)). For example, the CME notation for 0.51171875 (in 1/8ths of 1/32nds) is "0-163", where the numerator of "163" means 16 thirty-seconds and 3 eighths of a thirty-second, where the actual fraction is 16.3[75] / 32, which equals 0.51171875.
	 * @param {Number=} fractionDigitsSpecial - The number of digits of the fraction's numerator to display, when formatting in CME tick notation. For example, the notation "0-163" (in 1/8ths of 1/32nds) equates to the fraction of 16.375/32. This notation is limited to three digits (163) and omits the trailing two digits (75).
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
		 * The numeric counterpart of a "unit" code.
		 *
		 * @public
		 * @returns {Number}
		 */
		get baseCode() {
			return this._baseCode;
		}

		/**
		 * The single character "unit" code.
		 *
		 * @public
		 * @returns {String}
		 */
		get unitCode() {
			return this._code;
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
		 * The count of discrete prices which a unit can be divided into (e.g. a US dollar can be divided
		 * into 100 cents). By default, this is also the implied denominator in fractional notation (e.g. 3.6875
		 * equals 3 and 22/32 — which is represented in fractional notation as "3-22", where the denominator of 32
		 * is implied).
		 *
		 * @public
		 * @returns {Number|undefined}
		 */
		get fractionFactor() {
			return this._fractionFactor;
		}

		/**
		 * The number of digits of the fraction's numerator to display (e.g. using two digits, the fraction 22/32 is
		 * shown as "0-22"; using three digits, the fraction 22.375/32 is shown as "0-223").
		 *
		 * @public
		 * @returns {Number|undefined}
		 */
		get fractionDigits() {
			return this._fractionDigits;
		}

		/**
		 * Special fraction factors refer to the CME tick notation scheme (read more [here](https://www.cmegroup.com/confluence/display/EPICSANDBOX/Fractional+Pricing+-+Tick+and+Decimal+Conversions)).
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
		 * The number of digits of the fraction's numerator to display, when formatting
		 * in CME tick notation. For example, the notation "0-163" (in 1/8ths of 1/32nds) equates
		 * to the fraction of 16.375/32. This notation is limited to three digits (163)
		 * and omits the trailing two digits (75).
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

		toString() {
			return `[UnitCode (code=${this.code})]`;
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

		/**
		 * Converts a numeric "base" code into a {@link UnitCode} item.
		 *
		 * @public
		 * @static
		 * @param {Number} code
		 * @returns {UnitCode|null}
		 */
		static fromBaseCode(code) {
			return Enum.getItems(UnitCode).find(x => x.baseCode === code) || null;
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
