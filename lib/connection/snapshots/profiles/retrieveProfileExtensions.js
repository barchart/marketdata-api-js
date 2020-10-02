const axios = require('axios');

const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	Day = require('@barchart/common-js/lang/Day'),
	is = require('@barchart/common-js/lang/is');

const SymbolParser = require('./../../../utilities/parsers/SymbolParser');

const LoggerFactory = require('./../../../logging/LoggerFactory');

module.exports = (() => {
	'use strict';

	let logger = null;

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
				if (logger === null) {
					logger = LoggerFactory.getLogger('@barchart/marketdata-api-js');
				}

				assert.argumentIsArray(symbols, 'symbols', String);

				const symbolsForOnDemand = symbols.filter(SymbolParser.getIsC3);
				const symbolsForExtras = symbols.filter(SymbolParser.getIsFuture);

				return Promise.all([
					retrieveProfileExtensionsFromExtras(symbolsForExtras),
					retrieveProfileExtensionsFromOnDemand(symbolsForOnDemand, username, password)
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

	function retrieveProfileExtensionsFromOnDemand(symbols, username, password) {
		return Promise.resolve()
			.then(() => {
				if (symbols.length === 0) {
					return Promise.resolve([ ]);
				}

				const options = {
					url: `https://webapp-proxy.aws.barchart.com/v1/proxies/ondemand/getQuote.json?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&symbols=${encodeURIComponent(symbols.join())}`,
					method: 'GET'
				};

				return Promise.resolve(axios(options))
					.then((response) => {
						const results = response.data.results || [];

						return results.reduce((accumulator, result) => {
							try {
								const extension = {};

								extension.symbol = result.symbol.toUpperCase();

								if (SymbolParser.getIsC3(extension.symbol)) {
									const c3 = { };

									c3.currency = null;
									c3.delivery = null;

									if (result.commodityDataCurrency) {
										c3.currency = getC3Currency(result.commodityDataCurrency);
									}

									if (result.commodityDataDelivery) {
										c3.delivery = result.commodityDataDelivery;
									}

									extension.c3 = c3;
								}

								accumulator.push(extension);
							} catch (e) {
								logger.warn(`Snapshot: Failed to process symbol`);
							}

							return accumulator;
						}, [ ]);
					});
			});
	}


	const regex = {};

	regex.dates = {};
	regex.dates.expire = /^([0-9]{4}-[0-9]{2}-[0-9]{2})T/;

	regex.c3 = {};
	regex.c3.currencies = {};
	regex.c3.currencies.eur = /^(EUR)\/(.*)$/i;
	regex.c3.currencies.rub = /^(RUB)\/(.*)$/i;
	regex.c3.currencies.uah = /^(UAH)\/(.*)$/i;
	regex.c3.currencies.usd = /^(USD|Usc|\$|)\/(.*)$/i;

	function getC3Currency(lotSizeFix) {
		if (regex.c3.currencies.eur.test(lotSizeFix)) {
			return 'EUR';
		} else if (regex.c3.currencies.rub.test(lotSizeFix)) {
			return 'RUB';
		} else if (regex.c3.currencies.uah.test(lotSizeFix)) {
			return 'UAH';
		} else if (regex.c3.currencies.usd.test(lotSizeFix)) {
			return 'USD';
		} else {
			return null;
		}
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
