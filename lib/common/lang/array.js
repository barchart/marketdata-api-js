module.exports = (() => {
	'use strict';

	const array = {
		unique(array) {
			const arrayToFilter = array || [ ];

			return arrayToFilter.filter((item, index) => arrayToFilter.indexOf(item) === index);
		}
	};

	return array;
})();