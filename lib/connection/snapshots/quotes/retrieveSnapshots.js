const axios = require('axios');

const array = require('@barchart/common-js/lang/array'),
	is = require('@barchart/common-js/lang/is');

const convertDateToDayCode = require('./../../../utilities/convert/dateToDayCode'),
	convertDayCodeToNumber = require('./../../../utilities/convert/dayCodeToNumber'),
	convertBaseCodeToUnitCode = require('./../../../utilities/convert/baseCodeToUnitCode');

const SymbolParser = require('./../../../utilities/parsers/SymbolParser');

const LoggerFactory = require('./../../../logging/LoggerFactory');

module.exports = (() => {
	'use strict';

	let logger = null;

	/**
	 * Executes an HTTP request for a quote snapshot(s) and returns a
	 * promise of quote refresh message(s) (suitable for processing by
	 * the {@link MarketState#processMessage} function).
	 *
	 * @function
	 * @ignore
	 * @param {String|Array<String>} symbols
	 * @param {String} username
	 * @param {String} password
	 * @returns {Promise<Array>}
	 */
	function retrieveSnapshots(symbols, username, password) {
		return Promise.resolve()
			.then(() => {
				if (logger === null) {
					logger = LoggerFactory.getLogger('@barchart/marketdata-api-js');
				}

				let symbolsToUse;

				if (is.string(symbols)) {
					symbolsToUse = [symbols];
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

				const aliases = {};

				const getCmdtySymbols = [];
				const getQuoteSymbols = [];

				symbolsToUse.forEach((symbol) => {
					const concrete = SymbolParser.getProducerSymbol(symbol);

					if (concrete !== symbol) {
						aliases[concrete] = symbol;
					}

					getQuoteSymbols.push(concrete);
				});

				const promises = [];


				if (getQuoteSymbols.length !== 0) {
					promises.push(retrieveSnapshotsUsingGetQuote(getQuoteSymbols, username, password));
				}

				if (promises.length === 0) {
					return Promise.resolve([]);
				}

				return Promise.all(promises)
					.then((results) => {
						const quotes = array.flatten(results, true);

						quotes.forEach((quote) => {
							const concrete = quote.symbol;

							if (aliases.hasOwnProperty(concrete)) {
								quote.symbol = aliases[concrete];
							}
						});

						return quotes;
					});
			});
	}

	const ADDITIONAL_FIELDS = [
		'exchange',
		'bid',
		'bidSize',
		'ask',
		'askSize',
		'tradeSize',
		'numTrades',
		'settlement',
		'previousLastPrice'
	];

	function retrieveSnapshotsUsingGetQuote(symbols, username, password) {
		return Promise.resolve()
			.then(() => {
				const options = {
					url: `https://webapp-proxy.aws.barchart.com/v1/proxies/ondemand/getQuote.json?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&symbols=${encodeURIComponent(symbols.join())}&fields=${encodeURIComponent(ADDITIONAL_FIELDS.join())}`,
					method: 'GET'
				};

				return Promise.resolve(axios(options))
					.then((response) => {
						const results = response.data.results || [];

						const messages = results.reduce((accumulator, result) => {
							try {
								const message = {};

								message.type = 'REFRESH_QUOTE';

								message.symbol = result.symbol.toUpperCase();
								message.name = result.name;
								message.exchange = result.exchange;

								if (result.unitCode !== null) {
									message.unitcode = convertBaseCodeToUnitCode(parseInt(result.unitCode));
								} else {
									message.unitcode = '2';
								}

								message.tradeTime = new Date(result.tradeTimestamp);

								let dayCode;

								if (is.string(result.dayCode) && result.dayCode.length === 1) {
									dayCode = result.dayCode;
								} else {
									dayCode = convertDateToDayCode(message.tradeTime);
								}

								message.day = dayCode;
								message.dayNum = convertDayCodeToNumber(dayCode);
								message.flag = result.flag;
								message.mode = result.mode;

								message.lastPrice = result.lastPrice;
								message.tradeSize = result.tradeSize;
								message.numberOfTrades = result.numTrades;

								message.bidPrice = result.bid;
								message.bidSize = result.bidSize;
								message.askPrice = result.ask;
								message.askSize = result.askSize;

								message.settlementPrice = result.settlement;
								message.previousPrice = result.previousLastPrice;

								message.openPrice = result.open;
								message.highPrice = result.high;
								message.lowPrice = result.low;

								message.volume = result.volume;

								message.lastUpdate = message.tradeTime;

								if (SymbolParser.getIsC3(message.symbol)) {
									const c3 = {};

									c3.currency = null;
									c3.delivery = null;

									if (result.commodityDataCurrency) {
										c3.currency = getC3Currency(result.commodityDataCurrency);
									}

									if (result.commodityDataDelivery) {
										c3.delivery = result.commodityDataDelivery;
									}

									message.additional = { c3: c3 };
								}

								accumulator.push(message);
							} catch (e) {
								logger.warn(`Snapshot: Failed to process snapshot [ ${symbols.join()} ]`);
							}

							return accumulator;
						}, [ ]);

						return messages;
					});
			});
	}

	const regex = {};

	regex.day = /^([0-9]{4}).?([0-9]{2}).?([0-9]{2})$/;

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

	return retrieveSnapshots;
})();
