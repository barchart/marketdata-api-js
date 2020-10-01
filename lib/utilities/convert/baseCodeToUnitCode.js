const is = require('@barchart/common-js/lang/is');

const UnitCode = require('./../data/UnitCode');

module.exports = (() => {
	'use strict';

	/**
	 * Converts a Barchart "base" code into a Barchart "unit" code. If the "base"
	 * code provided is invalid, the character '0' will be returned -- which is
	 * not a valid unit code.
	 *
	 * @function
	 * @memberOf Functions
	 * @ignore
	 * @param {Number} baseCode
	 * @returns {String}
	 */
	function convertBaseCodeToUnitCode(baseCode) {
		if (!is.number(baseCode)) {
			return '0';
		}

		const unitCodeItem = UnitCode.fromBaseCode(baseCode);

		return unitCodeItem === null ? '0' : unitCodeItem.unitCode;
	}

	return convertBaseCodeToUnitCode;
})();