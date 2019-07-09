const axios = require('axios');

module.exports = (() => {
	'use strict';

	/**
	 * Promise-based utility for resolving symbol aliases (e.g. ES*1 is a reference
	 * to the front month for the ES contract -- not a concrete symbol). This
	 * implementation is for use in browser environments.
	 *
	 * @public
	 * @param {string} - The symbol to lookup (i.e. the alias).
	 * @returns {Promise<string>}
	 */
	return function(symbol) {
		return Promise.resolve()
			.then(() => {
				if (typeof symbol !== 'string') {
					throw new Error('The "symbol" argument must be a string.');
				}

				if (symbol.length === 0) {
					throw new Error('The "symbol" argument must be at least one character.');
				}

				const options = {
					url: `https://instruments-prod.aws.barchart.com/instruments/${encodeURIComponent(symbol)}`,
					method: 'GET'
				};

				return Promise.resolve(axios(options))
					.then((response) => {
						if (!response.data || !response.data.instrument || !response.data.instrument.symbol) {
							throw new Error(`The server was unable to resolve symbol ${symbol}.`);
						}

						return response.data.instrument.symbol;
					});
			});
	};
})();
