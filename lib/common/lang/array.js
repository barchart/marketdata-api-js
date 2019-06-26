module.exports = (() => {
	'use strict';

	const array = {
		/**
		 * Returns a copy of an array, replacing any item that is itself an array
		 * with the item's items.
		 *
		 * @static
		 * @param {Array} a
		 * @param {Boolean=} recursive - If true, all nested arrays will be flattened.
		 * @returns {Array}
		 */
		flatten(a, recursive) {
			const empty = [];

			let flat = empty.concat.apply(empty, a);

			if (recursive && flat.some(x => Array.isArray(x))) {
				flat = this.flatten(flat, true);
			}

			return flat;
		},

		/**
		 * Returns a copy of with only the unique elements from the original array.
		 * Elements are compared using strict equality.
		 *
		 * @static
		 * @param {Array} a
		 * @returns {Array}
		 */
		unique(array) {
			const arrayToFilter = array || [ ];

			return arrayToFilter.filter((item, index) => arrayToFilter.indexOf(item) === index);
		}
	};

	return array;
})();