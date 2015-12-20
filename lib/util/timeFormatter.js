module.exports = function () {
	'use strict';

	return function () {
		return {
			format: function (t) {
				if (t.time && t.flag) {
					return (t.time.getMonth() + 1 ) + '/' + t.time.getDate() + '/' + String(t.time.getFullYear()).substr(2);
				} else {
					if (t.hasOwnProperty('time')) {
						t = t.time;
					}

					if (t) {
						return [['00', t.getHours()].join('').substr(-2), ['00', t.getMinutes()].join('').substr(-2), ['00', t.getSeconds()].join('').substr(-2)].join(':');
					} else {
						return ''; // FIXME ETS messages are missing (null) 'time' on them near settlement...
					}
				}
			}
		};
	};
}();