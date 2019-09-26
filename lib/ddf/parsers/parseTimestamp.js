module.exports = (() => {
	'use strict';

	return function(bytes) {
		if (bytes.length !== 9) {
			return null;
		}

		const year = (bytes.charCodeAt(0) * 100) + bytes.charCodeAt(1) - 64;
		const month = bytes.charCodeAt(2) - 64 - 1;
		const day = bytes.charCodeAt(3) - 64;
		const hour = bytes.charCodeAt(4) - 64;
		const minute = bytes.charCodeAt(5) - 64;
		const second = bytes.charCodeAt(6) - 64;
		const ms = (0xFF & bytes.charCodeAt(7)) + ((0xFF & bytes.charCodeAt(8)) << 8);

		// 2016/02/17. JERQ is providing us with date and time values that
		// are meant to be interpreted in the exchange's local timezone.
		//
		// This is interesting because different time values (e.g. 14:30 and
		// 13:30) can refer to the same moment (e.g. EST for US equities and
		// CST for US futures).
		//
		// Furthermore, when we use the timezone-sensitive Date object, we
		// create a problem. The represents (computer) local time. So, for
		// server applications, it is recommended that we use UTC -- so
		// that the values (hours) are not changed when JSON serialized
		// to ISO-8601 format. Then, the issue is passed along to the
		// consumer (which must ignore the timezone too).

		return new Date(year, month, day, hour, minute, second, ms);
	};
})();