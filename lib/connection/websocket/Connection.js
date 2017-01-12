var ConnectionBase = require('./../ConnectionBase');

module.exports = (() => {
	'use strict';

	class Connection extends ConnectionBase {
		constructor() {
			super();
		}

		_connect() {
			throw new Error('The "_connect" has not been implemented.');
		}

		_disconnect() {
			throw new Error('The "_disconnect" has not been implemented.');
		}

		_on() {
			throw new Error('The "_on" has not been implemented.');
		}

		_off() {
			throw new Error('The "_off" has not been implemented.');
		}

		_getMarketState() {
			throw new Error('The "_getMarketState" has not been implemented.');
		}

		_getActiveSymbolCount() {
			throw new Error('The "_getActiveSymbolCount" has not been implemented.');
		}

		toString() {
			return '[ConnectionBase]';
		}
	}

	return Connection;
})();