module.exports = function() {
	'use strict';

	return function(bytes) {
		if (bytes.length !== 9)
			return null;

		var year = (bytes.charCodeAt(0) * 100) + bytes.charCodeAt(1) - 64;
		var month = bytes.charCodeAt(2) - 64 - 1;
		var day = bytes.charCodeAt(3) - 64;
		var hour = bytes.charCodeAt(4) - 64;
		var minute = bytes.charCodeAt(5) - 64;
		var second = bytes.charCodeAt(6) - 64;
		var ms = (0xFF & bytes.charCodeAt(7)) + ((0xFF & bytes.charCodeAt(8)) << 8);

		return new Date(year, month, day, hour, minute, second, ms);
	};
}();