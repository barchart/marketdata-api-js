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
	 * @param {Number} decimalPlaces
	 * @param {Boolean} canUseSpecialFractionNotation
	 */
	class UnitCode extends Enum {
		constructor(code, baseCode, decimalPlaces, canUseSpecialFractionNotation) {
			super(code, code);

			this._baseCode = baseCode;

			this._decimalPlaces = decimalPlaces;
			this._canUseSpecialFractionNotation = canUseSpecialFractionNotation;
		}

		/**
		 * The number of decimal places used for formatting -- in decimal mode.
		 *
		 * @public
		 * @returns {Number}
		 */
		get decimalPlaces() {
			return this._decimalPlaces;
		}
	}

	const TWO = new UnitCode('2', -1, 3);
	const THREE = new UnitCode('3', -2, 4);
	const FOUR = new UnitCode('4', -3, 5);
	const FIVE = new UnitCode('5', -4, 6);
	const SIX = new UnitCode('6', -5, 7);
	const SEVEN = new UnitCode('7', -6, 8);

	const EIGHT = new UnitCode('8', 0, 0);
	const NINE = new UnitCode('9', 1, 1);

	const A = new UnitCode('A', 2, 2);
	const B = new UnitCode('B', 3, 3);
	const C = new UnitCode('C', 4, 4);
	const D = new UnitCode('D', 5, 5);
	const E = new UnitCode('E', 6, 6);
	const F = new UnitCode('F', 7, 7);

	return UnitCode;
})();
