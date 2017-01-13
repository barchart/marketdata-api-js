module.exports = (() => {
	'use strict';

	/**
	 * An object which can lookup {@link Profile} instances.
	 *
	 * @ignore
	 * @interface
	 */
	class ProfileProviderBase {
		constructor() {

		}

		/**
		 * Performs asynchronous lookup of instrument metadata.
		 *
		 * @public
		 * @param {string[]} symbols - An array of symbols.
		 * @param {function} callback - Optional. A callback that is invoked with the {@link Profile} instances.
		 * @returns {Promise} The {@link Profile} instances, as a promise.
		 */
		loadProfileData(symbols, callback) {
			return Promise.resolve()
				.then(() => {
					return this._loadProfileData(symbols, callback);
				});
		}

		/**
		 * @protected
		 * @ignore
		 */
		_loadProfileData(symbols, callback) {
			return [ ];
		}

		toString() {
			return '[ProfileProviderBase]';
		}
	}

	return ProfileProviderBase;
})();