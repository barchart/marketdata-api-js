const axios = require('axios');

const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	Day = require('@barchart/common-js/lang/Day'),
	is = require('@barchart/common-js/lang/is');

const SymbolParser = require('./../../../utilities/parsers/SymbolParser');

module.exports = (() => {
	'use strict';

	const regex = {};

	regex.dates = {};
	regex.dates.expire = /^([0-9]{4}-[0-9]{2}-[0-9]{2})T/;

	/**
	 * Executes an HTTP request for "extended" profile data for an array
	 * of symbols.
	 *
	 * @function
	 * @ignore
	 * @param {String[]} symbols
	 * @returns {Promise<ProfileExtension[]>}
	 */
	function retrieveProfileExtensions(symbols, username, password) {
		return Promise.resolve()
			.then(() => {
				assert.argumentIsArray(symbols, 'symbols', String);

				const symbolsForOnDemand = symbols.filter(SymbolParser.getIsC3);
				const symbolsForExtras = symbols.filter(SymbolParser.getIsFuture);

				return Promise.all([
					retrieveProfileExtensionsFromExtras(symbolsForExtras),
					retrieveProfileExtensionsFromOnDemand(symbolsForOnDemand)
				]).then((results) => {
					return array.flatten(results);
				});
			});
	}

	function retrieveProfileExtensionsFromExtras(symbols) {
		return Promise.resolve()
			.then(() => {
				if (symbols.length === 0) {
					return Promise.resolve([ ]);
				}

				const options = {
					url: `https://extras.ddfplus.com/json/instruments/?lookup=${encodeURIComponent(symbols.join())}`,
					method: 'GET'
				};

				return Promise.resolve(axios(options))
					.then((response) => {
						if (response.status !== 200) {
							return [];
						}

						const results = (response.data.instruments || []).filter((result) => {
							return result.status === 200;
						});

						return results.map((result) => {
							const extension = {};

							extension.symbol = result.lookup;

							if (is.string(result.symbol_expire)) {
								const matches = result.symbol_expire.match(regex.dates.expire);

								if (matches !== null) {
									extension.expiration = Day.parse(matches[1]).format();
								}
							}

							if (is.string(result.symbol_fnd)) {
								extension.firstNotice = Day.parse(result.symbol_fnd).format();
							}

							return extension;
						});
					});
			});
	}

	function retrieveProfileExtensionsFromOnDemand(symbols) {
		return Promise.resolve()
			.then(() => {
				if (symbols.length === 0) {
					return Promise.resolve([ ]);
				}

				return Promise.resolve([ ]);
			});
	}

	/**
	 * Extended profile information.
	 *
	 * @typedef ProfileExtension
	 * @type {Object}
	 * @ignore
	 * @property {String} symbol
	 * @property {String=} expiration
	 * @property {String=} firstNotice
	 * @property {Object=} c3
	 */

	return retrieveProfileExtensions;
})();
