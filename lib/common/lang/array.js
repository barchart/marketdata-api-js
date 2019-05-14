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
		 * Returns the unique items from an array, where the unique
		 * key is determined via a strict equality check.
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