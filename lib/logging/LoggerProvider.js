module.exports = (() => {
	'use strict';

	/**
	 * A contract for generating {@link Logger} instances. For custom logging
	 * the SDK consumer should implement this class and pass it to the
	 * {@link LoggerFactory.configure} function.
	 *
	 * @public
	 * @exported
	 * @abstract
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