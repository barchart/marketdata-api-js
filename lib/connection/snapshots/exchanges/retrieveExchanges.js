const axios = require('axios');

const Exchange = require('./../../../marketState/Exchange');

module.exports = (() => {
	'use strict';

	/**
	 * Executes an HTTP request for exchange metadata.
	 *
	 * @function
	 * @returns {Promise<Exchange[]>}
	 */
	function retrieveExchanges() {
		return Promise.resolve()
			.then(() => {
				const options = {
					url: `https://http://instruments-prod.aws.barchart.com/exchanges`,
					method: 'GET'
				};

				return Promise.resolve(axios(options))
					.then((response) => {
						const results = response.data.results || [ ];

						return results.map((result) => {
							return new Exchange(result.id, result.description, result.timezone);
						});
					});
			});
	}

	return retrieveExchanges;
})();
