const xhr = require('xhr');

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

				return new Promise((resolveCallback, rejectCallback) => {
					try {
						const options = {
							url: `https://instruments-prod.aws.barchart.com/instruments/${encodeURIComponent(symbol)}`,
							method: 'GET'
						};

						xhr(options, (error, response, body) => {
							try {
								if (error) {
									rejectCallback(error);
								} else if (response.statusCode !== 200) {
									rejectCallback(`The server returned an HTTP ${response.statusCode} response code.`);
								} else {
									const response = JSON.parse(body);

									if (!response || !response.instrument || !response.instrument.symbol) {
										rejectCallback(`The server was unable to resolve symbol ${symbol}.`);
									} else {
										resolveCallback(response.instrument.symbol);
									}
								}
							} catch (processError) {
								rejectCallback(processError);
							}
						});
					} catch (executeError) {
						rejectCallback(executeError);
					}
				});
			});
	};
})();