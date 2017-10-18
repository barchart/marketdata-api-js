const ConnectionBase = require('./../ConnectionBase');

module.exports = (() => {
	'use strict';

	/**
	 * <p>Entry point for library. This implementation is intended for Node.js environments.</p>
	 * <p><strong>Implementation is incomplete. Do not attempt to use.</strong></p>
	 *
	 * @public
	 * @extends ConnectionBase
	 * @variation node.js
	 */
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

		_onPollingFrequencyChanged(pollingFrequency) {
			throw new Error('The "_onPollingFrequencyChanged" has not been implemented.');
		}

		toString() {
			return '[ConnectionBase]';
		}
	}

	return Connection;
})();