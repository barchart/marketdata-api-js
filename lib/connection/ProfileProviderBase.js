module.exports = (() => {
	'use strict';

	class ProfileProviderBase {
		constructor() {

		}

		loadProfileData(symbols, callback) {
			return Promise.resolve()
				.then(() => {
					return this._loadProfileData(symbols, callback);
				});
		}

		_loadProfileData(symbols, callback) {
			return [ ];
		}

		toString() {
			return '[ProfileProviderBase]';
		}
	}

	return ProfileProviderBase;
})();