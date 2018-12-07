const xhr = require('xhr');

const convertDayCodeToNumber = require('./convertDayCodeToNumber');

module.exports = (() => {
	'use strict';

	const ADDITIONAL_FIELDS = [
		'exchange',
		'bid',
		'bidSize',
		'ask',
		'askSize',
		'tradeSize',
		'numTrades',
		'settlement'
	];


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
	return function(symbols, username, password) {
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
										message.unitcode = result.unitCode;

										message.day = result.dayCode;
										message.dayNum = convertDayCodeToNumber(result.dayCode);
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

										message.openPrice = result.open;
										message.highPrice = result.high;
										message.lowPrice = result.low;

										message.volume = result.volume;

										message.tradeTime = result.tradeTimestamp;

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
			});
	};
})();