const axios = require('axios');

const is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * Promise-based utility for resolving symbol aliases (e.g. ES*1 is a reference
	 * to the front month for the ES contract -- e.g. ESZ19 -- not a concrete symbol).
	 *
	 * @function
	 * @ignore
	 * @param {String} symbol - The symbol to lookup (i.e. the alias).
	 * @returns {Promise<String>}
	 */
	function retrieveConcreteSymbol(symbol) {
		return Promise.resolve()
			.then(() => {
				if (!is.string(symbol)) {
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
	}

	return retrieveConcreteSymbol;
})();
