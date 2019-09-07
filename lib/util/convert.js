module.exports = (() => {
	'use strict';

	function convertDayNumberToDayCode(d) {
		if (d >= 1 && d <= 9) {
			return String.fromCharCode(("1").charCodeAt(0) + d - 1);
		} else if (d == 10) {
			return '0';
		} else {
			return String.fromCharCode(("A").charCodeAt(0) + d - 11);
		}
	}

	return {
		/**
		 * Converts a unit code into a base code.
		 *
		 * @public
		 * @param {String} unitCode
		 * @return {Number}
		 */
		unitCodeToBaseCode: (unitCode) => {
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
		},

		/**
		 * Converts a base code into a unit code.
		 *
		 * @public
		 * @param {Number} baseCode
		 * @return {String}
		 */
		baseCodeToUnitCode: (baseCode) => {
			switch (baseCode) {
				case -1:
					return '2';
				case -2:
					return '3';
				case -3:
					return '4';
				case -4:
					return '5';
				case -5:
					return '6';
				case -6:
					return '7';
				case 0:
					return '8';
				case 1:
					return '9';
				case 2:
					return 'A';
				case 3:
					return 'B';
				case 4:
					return 'C';
				case 5:
					return 'D';
				case 6:
					return 'E';
				case 7:
					return 'F';
				default:
					return 0;
			}
		},

		/**
		 * Converts a date instance to a day code.
		 *
		 * @public
		 * @param {Date} date
		 * @returns {String|null}
		 */
		dateToDayCode: (date) => {
			if (date === null || date === undefined) {
				return null;
			}

			return convertDayNumberToDayCode(date.getDate());
		},

		/**
		 * Converts a day code (e.g. "A" ) to a day number (e.g. 11).
		 *
		 * @public
		 * @param {String} dayCode
		 * @returns {Number|null}
		 */
		dayCodeToNumber: (dayCode) => {
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
		},

		/**
		 * Converts a day number (e.g. the 11th of the month) in o a day code (e.g. 'A').
		 *
		 * @public
		 * @param {Number=} dayNumber
		 * @returns {Number|null}
		 */
		numberToDayCode: (dayNumber) => {
			if (dayNumber === null || dayNumber === undefined) {
				return null;
			}

			return convertDayNumberToDayCode(dayNumber);
		}
	};
})();