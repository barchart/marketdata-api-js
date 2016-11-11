module.exports = function() {
	'use strict';

	return function(dayCode) {
		var d = parseInt(dayCode, 31);

		if (d > 9) {
			d++;
		} else if (d == 0) {
			d = 10;
		}

		return d;
	};
}();