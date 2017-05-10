const connection = require('./connection/index'),
	historicalData = require('./historicalData/index'),
	MarketState = require('./marketState/index'),
	messageParser = require('./messageParser/index'),
	util = require('./util/index');

module.exports = (() => {
	'use strict';

	return {
		Connection: connection,

		historicalData: historicalData,
		HistoricalData: historicalData,

		MarketState: MarketState,

		MessageParser: messageParser,
		messageParser: messageParser,

		Util: util,
		util: util,

		version: '0.0.0'
	};
})();