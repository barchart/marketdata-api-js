module.exports = (() => {
	'use strict';

	const object = {
		keys(target) {
			const keys = [];

			for (var k in target) {
				if (target.hasOwnProperty(k)) {
					keys.push(k);
				}
			}

			return keys;
		}
	};

	return object;
})();