const xhr = require('xhr');

module.exports = (() => {
	'use strict';

	/**
	 * Executes HTTP requests for out-of-band quote snapshots. 
	 *
	 * @public
	 */
	class SnapshotProvider {
		constructor() {

		}

		/**
		 * Executes HTTP request for quote snapshot(s).
		 *
		 * @public
		 * @static
		 * @param {Array.<String>} symbols
		 * @returns {Promise.<Array>}
		 */
		static getSnapshot(symbols) {
			return Promise.resolve()
				.then(() => {
					let symbolsToUse;

					if (typeof symbols !== 'string') {
						symbolsToUse = [ symbols ];
					} else if (Array.isArray(symbols)) {
						symbolsToUse = symbols;
					} else {
						throw new Error('The "symbols" argument must be a string or an array of strings.');
					}

					if (symbolsToUse.some(s => typeof s !== 'string')) {
						throw new Error('The "symbols" can only contain strings.');
					}

					return new Promise((resolveCallback, rejectCallback) => {
						try {
							const options = {
								url: `https://webapp-proxy.aws.barchart.com/v1/proxies/ondemand/getQuote.json?symbols=${encodeURIComponent(symbolsToUse.join(','))}`,
								method: 'GET'
							};

							xhr(options, (error, response, body) => {
								if (error) {
									rejectCallback(error);
								} else if (response.statusCode !== 200) {
									rejectCallback(`The server returned an HTTP ${response.statusCode} response code.`);
								} else {
									resolveCallback(body);
								}
							});
						} catch (e) {
							rejectCallback(e);
						}
					});
				});
		}

		toString() {
			return '[SnapshotProvider]';
		}
	}

	return SnapshotProvider;
})();