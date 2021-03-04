module.exports = (() => {
	'use strict';

	const monthMap = {};
	const numberMap = {};

	function addMonth(code, name, number) {
		monthMap[code] = name;
		numberMap[code] = number;
	}

	addMonth("F", "January", 1);
	addMonth("G", "February", 2);
	addMonth("H", "March", 3);
	addMonth("J", "April", 4);
	addMonth("K", "May", 5);
	addMonth("M", "June", 6);
	addMonth("N", "July", 7);
	addMonth("Q", "August", 8);
	addMonth("U", "September", 9);
	addMonth("V", "October", 10);
	addMonth("X", "November", 11);
	addMonth("Z", "December", 12);
	addMonth("Y", "Cash", 0);

	return {
		getCodeToNameMap: () => {
			return Object.assign({ }, monthMap);
		},

		getCodeToNumberMap: () => {
			return Object.assign({ }, numberMap);
		}
	};
})();