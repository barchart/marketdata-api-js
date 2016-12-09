module.exports = function() {
	'use strict';

	return function(date) {
		var d = date.getDate();

		if (d >= 1 && d <= 9)
			return String.fromCharCode(("1").charCodeAt(0) + d - 1);
		else if (d == 10)
			return '0';
		else
			return String.fromCharCode(("A").charCodeAt(0) + d - 11);
	};
}();
