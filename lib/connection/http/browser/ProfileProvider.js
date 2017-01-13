var xhr = require('xhr');

var ProfileProviderBase = require('./../../ProfileProviderBase');

module.exports = (() => {
    'use strict';

	/**
	 * <p>This implementation is intended for browser-based environments.</p>
	 *
	 * @ignore
	 * @extends ProfileProviderBase
	 * @variation browser
	 */
    class ProfileProvider extends ProfileProviderBase {
        constructor() {
            super();
        }

        _loadProfileData(symbols, callback) {
            return new Promise((resolveCallback) => {
				const options = {
					url: 'proxies/instruments/?lookup=' + symbols.join(','),
					method: 'GET',
					json: true
				};

				xhr(options, (error, response, body) => {
					var instrumentData;

					if (error || response.statusCode !== 200) {
						instrumentData = [ ];
					} else {
						instrumentData = body.instruments;
					}

					if (typeof callback === 'function') {
						callback(instrumentData);
					}

					resolveCallback(instrumentData);
				});
			});
        }

        toString() {
            return '[ProfileProvider]';
        }
    }

    return ProfileProvider;
})();