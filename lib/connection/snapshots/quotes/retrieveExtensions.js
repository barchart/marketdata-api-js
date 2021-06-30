const axios = require('axios');

const array = require('@barchart/common-js/lang/array'),
	Day = require('@barchart/common-js/lang/Day'),
	is = require('@barchart/common-js/lang/is');

const SymbolParser = require('./../../../utilities/parsers/SymbolParser');

module.exports = (() => {
	'use strict';

	let logger = null;

	/**
	 * Executes an HTTP request for a quote snapshot extension(s). A quote
	 * extension contains supplemental quote-related data that is not available
	 * though normal sources (i.e. some data points are not available through
	 * a stream from JERQ).
	 *
	 * An array of quote refresh messages (suitable for processing by
	 * the {@link MarketState#processMessage} function) are returned.
	 *
	 * @function
	 * @ignore
	 * @param {String|Array<String>} symbols
	 * @param {String} username
	 * @param {String} password
	 * @returns {Promise<QuoteExtension[]>}
	 */
	function retrieveExtensions(symbols, username, password) {
		return Promise.resolve()
			.then(() => {
				let symbolsToUse;

				if (is.string(symbols)) {
					symbolsToUse = [ symbols ];
				} else if (Array.isArray(symbols)) {
					symbolsToUse = symbols;
				} else {
					throw new Error('The "symbols" argument must be a string or an array of strings.');
				}

				if (symbolsToUse.some(s => !is.string(s))) {
					throw new Error('The "symbols" can only contain strings.');
				}

				if (!is.string(username)) {
					throw new Error('The "username" argument must be a string.');
				}

				if (!is.string(password)) {
					throw new Error('The "password" argument must be a string.');
				}

				const extensions = [ ];

				const getOrCreateExtension = (symbol) => {
					let extension = extensions.find(e => e.symbol === symbol);

					if (!extension) {
						extension = { symbol };

						extensions.push(extension);
					}

					return extension;
				};

				const promises = [ ];

				const futuresSymbols = array.unique(symbolsToUse.filter(s => SymbolParser.getIsFuture(s) && SymbolParser.getIsConcrete(s)).sort());

				if (futuresSymbols.length !== 0) {
					promises.push(retrieveFuturesHiLo(futuresSymbols, username, password)
						.then((results) => {
							results.forEach((result) => {
								if (result.hilo) {
									const extension = getOrCreateExtension(result.symbol);

									const hilo = { };

									hilo.highPrice = result.hilo.highPrice;
									hilo.highDate = result.hilo.highDate ? Day.parse(result.hilo.highDate) : null;
									hilo.lowPrice = result.hilo.lowPrice;
									hilo.lowDate = result.hilo.lowDate ? Day.parse(result.hilo.lowDate) : null;

									extension.hilo = hilo;
								}
							});
						})
					);
				}

				if (promises.length === 0) {
					return Promise.resolve([ ]);
				}

				return Promise.all(promises)
					.then(() => {
						return extensions;
					});
			});
	}

	/**
	 * Retrieves all-time highs and lows for specific futures contracts.
	 *
	 * @private
	 * @param symbols
	 * @param username
	 * @param password
	 * @returns {Promise<Object[]>}
	 */
	function retrieveFuturesHiLo(symbols, username, password) {
		return Promise.resolve()
			.then(() => {
				const options = {
					url: `https://instrument-extensions.aws.barchart.com/v1/futures/hilo?&symbols=${encodeURIComponent(symbols.join())}`,
					method: 'GET'
				};

				return Promise.resolve(axios(options))
					.then((response) => {
						return response.data || [ ];
					});
			});
	}

	/**
	 * Extended quote information.
	 *
	 * @typedef QuoteExtension
	 * @type {Object}
	 * @ignore
	 * @property {String} symbol
	 * @property {QuoteExtensionHiLo=} hilo
	 */

	/**
	 * Extended quote information (for all-time highs and lows).
	 *
	 * @typedef QuoteExtensionHiLo
	 * @type {Object}
	 * @ignore
	 * @property {Number=} highPrice
	 * @property {Day=} highDate
	 * @property {Number=} lowPrice
	 * @property {Day=} lowDate
	 */

	return retrieveExtensions;
})();
