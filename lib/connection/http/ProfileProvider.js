var ProfileProviderBase = require('./../ProfileProviderBase');

module.exports = (() => {
    'use strict';

	/**
	 * <p>This implementation is intended for Node.js environments.</p>
	 * <p><strong>Implementation is incomplete. Do not attempt to use.</strong></p>
	 *
	 * @public
	 * @extends ProfileProviderBase
	 * @variation node.js
	 */
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