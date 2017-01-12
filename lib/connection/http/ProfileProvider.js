var ProfileProviderBase = require('./../ProfileProviderBase');

module.exports = (() => {
    'use strict';

    class ProfileProvider extends ProfileProviderBase {
        constructor() {
			super();
        }

        _loadProfileData(symbols, callback) {
            throw new Error('The "_loadProfileData" has not been implemented.');
        }

        toString() {
            return '[ProfileProvider]';
        }
    }

    return ProfileProvider;
})();