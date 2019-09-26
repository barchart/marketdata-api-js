module.exports = (() => {
	'use strict';

	/**
	 * Converts a unit code into a base code.
	 *
	 * @function
	 * @param {String} unitCode
	 * @return {Number}
	 */
	function unitCodeToBaseCode(unitCode) {
		switch (unitCode) {
			case '2':
				return -1;
			case '3':
				return -2;
			case '4':
				return -3;
			case '5':
				return -4;
			case '6':
				return -5;
			case '7':
				return -6;
			case '8':
				return 0;
			case '9':
				return 1;
			case 'A':
				return 2;
			case 'B':
				return 3;
			case 'C':
				return 4;
			case 'D':
				return 5;
			case 'E':
				return 6;
			case 'F':
				return 7;
			default:
				return 0;
		}
	}

	return unitCodeToBaseCode;
})();