module.exports = (() => {
	'use strict';

	/**
	 * An interface for generating {@link Logger} instances.
	 *
	 * @public
	 * @interface
	 */
	class LoggerProvider {
		constructor() {

		}

		/**
		 * Returns an instance of {@link Logger}.
		 *
		 * @public
		 * @param {String} category
		 * @returns {Logger}
		 */
		getLogger(category) {
			return null;
		}

		toString() {
			return '[LoggerProvider]';
		}
	}

	return LoggerProvider;
})();