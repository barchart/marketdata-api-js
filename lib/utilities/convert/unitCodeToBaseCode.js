const is = require('@barchart/common-js/lang/is');

const UnitCode = require('./../data/UnitCode');

module.exports = (() => {
	'use strict';

	/**
	 * Converts a Barchart "unit" code into a Barchart "base" code. If the "unit"
	 * code provided is invalid, a base code of zero will be returned.
	 *
	 * @function
	 * @memberOf Functions
	 * @ignore
	 * @param {String} unitCode
	 * @returns {Number}
	 */
	function convertUnitCodeToBaseCode(unitCode) {
		if (!is.string(unitCode) || unitCode.length !== 1) {
			return 0;
		}

		const unitCodeItem = UnitCode.parse(unitCode);

		return unitCodeItem === null ? 0 : unitCodeItem.baseCode;
	}

	return convertUnitCodeToBaseCode;
})();