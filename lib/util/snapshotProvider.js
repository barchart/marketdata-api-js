const xhr = require('xhr');

const convertDateToDayCode = require('./convertDateToDayCode'),
	convertDayCodeToNumber = require('./convertDayCodeToNumber'),
	convertBaseCodeToUnitCode = require('./convertBaseCodeToUnitCode');

module.exports = (() => {
	'use strict';

	const regex = { };

	regex.cmdty = /^(BCSD-|BEA-|BLS-|EIA-|CFTC-|USCB-|USDA-)/;

	/**
	 * Executes an HTTP request for a quote snapshot(s) and returns a
	 * promise of quote refresh message(s) (suitable for processing by
	 * the {@link MarketState#processMessage} function).
	 *
	 * @function
	 * @param {String|Array.<String>} symbols
	 * @param {String} username
	 * @param {String} password
	 * @returns {Promise.<Array>}
	 */
	function retrieveSnapshots(symbols, username, password) {
		return Promise.resolve()
			.then(() => {
				let symbolsToUse;

				if (typeof symbols === 'string') {
					symbolsToUse = [ symbols ];
				} else if (Array.isArray(symbols)) {
					symbolsToUse = symbols;
				} else {
					throw new Error('The "symbols" argument must be a string or an array of strings.');
				}

				if (symbolsToUse.some(s => typeof s !== 'string')) {
					throw new Error('The "symbols" can only contain strings.');
				}

				if (typeof username !== 'string') {
					throw new Error('The "username" argument must be a string.');
				}

				if (typeof password !== 'string') {
					throw new Error('The "password" argument must be a string.');
				}

				const getCmdtySymbols = [ ];
				const getQuoteSymbols = [ ];

				symbolsToUse.forEach((symbol) => {
					if (regex.cmdty.test(symbol)) {
						getCmdtySymbols.push(symbol);
					} else {
						getQuoteSymbols.push(symbol);
					}
				});

				const promises = [ ];

				if (getCmdtySymbols.length !== 0) {
					promises.push(retrieveSnapshotsUsingGetCmdtyStats(getCmdtySymbols, username, password));
				}


				if (getQuoteSymbols.length !== 0) {
					promises.push(retrieveSnapshotsUsingGetQuote(getQuoteSymbols, username, password));
				}

				if (promises.length === 0) {
					return Promise.resolve([ ]);
				}

				return Promise.all(promises)
					.then((results) => {
						const result = [ ];

						return result.concat.apply(this, results);
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
		return new Promise((resolveCallback, rejectCallback) => {
			try {
				const options = {
					url: `https://webapp-proxy.aws.barchart.com/v1/proxies/ondemand/getQuote.json?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&symbols=${encodeURIComponent(symbolsToUse.join())}&fields=${encodeURIComponent(ADDITIONAL_FIELDS.join())}`,
					method: 'GET'
				};

				xhr(options, (error, response, body) => {
					try {
						if (error) {
							rejectCallback(error);
						} else if (response.statusCode !== 200) {
							rejectCallback(`The server returned an HTTP ${response.statusCode} response code.`);
						} else {
							const messages = JSON.parse(body).results.map((result) => {
								const message = { };

								message.type = 'REFRESH_QUOTE';

								message.symbol = result.symbol.toUpperCase();
								message.name = result.name;
								message.exchange = result.exchange;
								message.unitcode = convertBaseCodeToUnitCode(parseInt(result.unitCode));

								message.tradeTime = new Date(result.tradeTimestamp);

								let dayCode;

								if (typeof(result.dayCode) === 'string' && result.dayCode.length === 1) {
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

								return message;
							});

							resolveCallback(messages);
						}
					} catch (processError) {
						rejectCallback(processError);
					}
				});
			} catch (executeError) {
				rejectCallback(executeError);
			}
		});
	}

	function retrieveSnapshotsUsingGetCmdtyStats(symbol, username, password) {
		return Promise.all([ ]);
	}

	function retrieveSnapshotUsingGetCmdtyStats(symbol, username, password) {
		return new Promise((resolveCallback, rejectCallback) => {
			try {
				const options = {
					url: `https://webapp-proxy.aws.barchart.com/v1/proxies/ondemand/getCmdtyStats.json?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&symbols=${encodeURIComponent(symbol}`,
					method: 'GET'
				};

				xhr(options, (error, response, body) => {
					try {
						if (error) {
							rejectCallback(error);
						} else if (response.statusCode !== 200) {
							rejectCallback(`The server returned an HTTP ${response.statusCode} response code.`);
						} else {
							const messages = JSON.parse(body).results.map((result) => {
								const message = { };

								message.type = 'REFRESH_QUOTE';

								return message;
							});

							resolveCallback(messages);
						}
					} catch (processError) {
						rejectCallback(processError);
					}
				});
			} catch (executeError) {
				rejectCallback(executeError);
			}
		});
	}

	return retrieveSnapshots;
})();