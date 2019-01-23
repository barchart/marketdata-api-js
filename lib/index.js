const connection = require('./connection/index'),
	MarketState = require('./marketState/index'),
	messageParser = require('./messageParser/index'),
	util = require('./util/index');

module.exports = (() => {
	'use strict';

	return {
		Connection: connection,

		MarketState: MarketState,

		MessageParser: messageParser,
		messageParser: messageParser,

		Util: util,
		util: util,

		version: '3.1.41'
	};
})();