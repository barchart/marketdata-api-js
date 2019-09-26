module.exports = (() => {
	'use strict';

	/**
	 * Converts a day code (e.g. "A" ) to a day number (e.g. 11).
	 *
	 * @function
	 * @param {String} dayCode
	 * @returns {Number|null}
	 */
	function dayCodeToNumber(dayCode) {
		if (dayCode === null || dayCode === undefined || dayCode === '') {
			return null;
		}

		let d = parseInt(dayCode, 31);

		if (d > 9) {
			d++;
		} else if (d === 0) {
			d = 10;
		}

		return d;
	}

	return dayCodeToNumber;
})();



