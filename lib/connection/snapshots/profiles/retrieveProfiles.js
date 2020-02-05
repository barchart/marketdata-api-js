const axios = require('axios');

const assert = require('@barchart/common-js/lang/assert');

module.exports = (() => {
	'use strict';

	/**
	 * Executes an HTTP request for profile data.
	 *
	 * @function
	 * @returns {Promise<ExchangeMetadata[]>}
	 */
	function retrieveProfiles(symbols) {
		return Promise.resolve()
			.then(() => {
				assert.argumentIsArray(symbols, 'symbols', String);

				const options = {
					url: `https://extras.ddfplus.com/json/instruments/?lookup=${encodeURIComponent(symbols.join())}`,
					method: 'GET'
				};

				return Promise.resolve(axios(options))
					.then((response) => {
						const results = response.instruments || [ ];

						return results.map((result) => {
							const profile = { };

							return profile;
						});
					});
			});
	}

	/**
	 * Profile metadata
	 *
	 * @typedef ProfileMetadata
	 * @type {Object}
	 * @property {String} symbol
	 */

	return retrieveProfiles;
})();
