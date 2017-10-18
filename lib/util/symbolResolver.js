module.exports = (() => {
	'use strict';

	/**
	 * Promise-based utility function for resolving symbol aliases (e.g. ES*1 is a reference
	 * to the front month for the ES contract -- not a concrete symbol). This implementation
	 * is for use Node.js environments.
	 *
	 * @public
	 * @param {string} - The symbol to lookup (i.e. the alias).
	 * @returns {Promise}
	 */
	return function(symbol) {
		return Promise.resolve()
			.then(() => {
				throw new Error('Unable to resolve symbol, this environment is not supported.');
			});
	};
})();