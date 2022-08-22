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
	function retrieveExtensions(symbols) {
		return Promise.resolve()
			.then(() => {
				if (logger === null) {
					logger = LoggerFactory.getLogger('@barchart/marketdata-api-js');
				}

				assert.argumentIsArray(symbols, 'symbols', String);

				return Promise.all([
					retrieveExtensionsForC3(symbols.filter(SymbolParser.getIsC3)),
					retrieveExtensionsForCmdtyStats(symbols.filter(SymbolParser.getIsCmdtyStats)),
					retrieveExtensionsForFutures(symbols.filter(SymbolParser.getIsFuture)),
					retrieveExtensionsForFuturesOptions(symbols.filter(SymbolParser.getIsFutureOption)),
					retrieveExtensionsForGrainBids(symbols.filter(SymbolParser.getIsGrainBid))
				]).then((results) => {
					return array.flatten(results);
				});
			});
	}

	function retrieveExtensionsForFutures(symbols) {
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

	function retrieveExtensionsForCmdtyStats(symbols) {
		return Promise.resolve()
			.then(() => {
				if (symbols.length === 0) {
					return Promise.resolve([ ]);
				}

				const options = {
					url: `https://instrument-extensions.aws.barchart.com/v1/cmdtyStats/meta?&symbols=${encodeURIComponent(symbols.join())}`,
					method: 'GET'
				};

				return Promise.resolve(axios(options))
					.then((response) => {
						if (response.status !== 200) {
							return [];
						}
						
						const results = (response.data || []).filter((result) => {
							return result.meta !== null;
						});

						return results.map((result) => {
							const extension = { };

							extension.symbol = result.symbol;
							extension.cmdtyStats = result.meta;

							return extension;
						});
					});
			});
	}

	function retrieveExtensionsForC3(symbols) {
		return Promise.resolve()
			.then(() => {
				if (symbols.length === 0) {
					return Promise.resolve([ ]);
				}

				const options = {
					url: `https://instrument-extensions.aws.barchart.com/v1/c3/meta?symbols=${encodeURIComponent(symbols.join())}`,
					method: 'GET'
				};

				return Promise.resolve(axios(options))
					.then((response) => {
						const results = response.data || [];

						return results.reduce((accumulator, result) => {
							try {
								const extension = {};

								extension.symbol = result.symbol.toUpperCase();

								if (SymbolParser.getIsC3(extension.symbol) && is.object(result.meta)) {
									const c3 = { };

									c3.area = null;
									c3.basis = null;
									c3.currency = null;
									c3.delivery = null;
									c3.description = null;
									c3.lot = null;
									c3.market = null;
									c3.product = null;
									c3.terms = null;

									const meta = result.meta;

									if (meta.area) {
										c3.area = meta.area;
									}

									if (meta.basis) {
										c3.basis = meta.basis;
									}

									if (meta.lot) {
										c3.currency = getC3Currency(meta.lot);
									}

									if (meta.delivery) {
										c3.delivery = meta.delivery;
									}

									if (meta.description) {
										c3.description = meta.description;
									}

									if (meta.lot) {
										c3.lot = meta.lot;
									}

									if (meta.market) {
										c3.market = meta.market;
									}

									if (meta.product) {
										c3.product = meta.product;
									}

									if (meta.terms) {
										c3.terms = meta.terms;
									}

									extension.c3 = c3;
								}

								accumulator.push(extension);
							} catch (e) {
								logger.warn(`Extensions: Failed to process extension [ ${symbols.join()} ]`);
							}

							return accumulator;
						}, [ ]);
					});
			});
	}

	function retrieveExtensionsForFuturesOptions(symbols) {
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
							const extension = { };

							extension.symbol = result.lookup;

							if (is.string(result.symbol_expire)) {
								const matches = result.symbol_expire.match(regex.dates.expire);

								if (matches !== null) {
									extension.expiration = Day.parse(matches[1]).format();
								}
							}

							extension.option = { };

							if (result.underlier) {
								const u = SymbolParser.parseInstrumentType(result.underlier);
								const o = SymbolParser.parseInstrumentType(result.lookup);

								if (o !== null) {
									if (extension.expiration) {
										const expiration = { };

										expiration.date = extension.expiration;
										expiration.month = result.symbol_ddf_expire_month;
										expiration.year = SymbolParser.getFuturesYear(result.symbol_ddf_expire_year, result.symbol_ddf_expire_month);

										extension.option.expiration = expiration;
									}

									extension.option.putCall = o.option_type;
									extension.option.strike = o.strike;
								}

								const underlying = { };

								underlying.symbol = result.underlier;

								if (u !== null) {
									underlying.root = u.root;
									underlying.month = u.month;
									underlying.year = u.year;
								}

								extension.option.underlying = underlying;
							}

							return extension;
						});
					});
			});
	}

	function retrieveExtensionsForGrainBids(symbols) {
		return Promise.resolve()
			.then(() => {
				if (symbols.length === 0) {
					return Promise.resolve([ ]);
				}

				const options = {
					url: `https://instrument-extensions.aws.barchart.com/v1/grains/meta?&symbols=${encodeURIComponent(symbols.join())}`,
					method: 'GET'
				};

				return Promise.resolve(axios(options))
					.then((response) => {
						if (response.status !== 200) {
							return [];
						}

						const results = (response.data || []).filter((result) => {
							return result.meta !== null;
						});

						return results.map((result) => {
							const extension = { };

							extension.symbol = result.symbol;
							extension.grainBid = result.meta;

							return extension;
						});
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
	 * @property {Object=} c3
	 * @property {Object=} cmdtyStats
	 * @property {String=} firstNotice
	 * @property {Object=} grainBid
	 * @property {Object=} option
	 */

	return retrieveExtensions;
})();
