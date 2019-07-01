module.exports = (() => {
	'use strict';

	const object = {
		/**
		 * Given an object, returns an array of "own" properties.
		 *
		 * @static
		 * @param {Object} target - The object to interrogate.
		 * @returns {Array<string>}
		 */
		keys(target) {
			const keys = [];

			for (let k in target) {
				if (target.hasOwnProperty(k)) {
					keys.push(k);
				}
			}

			return keys;
		},

		/**
		 * Given an object, returns a Boolean value, indicating if the
		 * object has any "own" properties.
		 *
		 * @static
		 * @param {Object} target - The object to interrogate.
		 * @returns {Boolean}
		 */
		empty(target) {
			let empty = true;

			for (let k in target) {
				if (target.hasOwnProperty(k)) {
					empty = false;

					break;
				}
			}

			return empty;
		}
	};

	return object;
})();