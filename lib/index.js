var connection = require('./connection/index');
var historicalData = require('./historicalData/index');
var MarketState = require('./marketState/index');
var messageParser = require('./messageParser/index');
var util = require('./util/index');

module.exports = function() {
	'use strict';

	return {
		Connection: connection,

		historicalData: historicalData,
		HistoricalData: historicalData,

		MarketState: MarketState,

		MessageParser: messageParser,
		messageParser: messageParser,

		Util: util,
		util: util
	};
}();