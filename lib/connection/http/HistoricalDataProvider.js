var HistoricalDataProviderBase = require('./../HistoricalDataProviderBase');

module.exports = (() => {
	'use strict';

	/**
	 * <p>This implementation is intended for Node.js environments.</p>
	 * <p><strong>Implementation is incomplete. Do not attempt to use.</strong></p>
	 *
	 * @ignore
	 * @extends HistoricalDataProviderBase
	 * @variation node.js
	 */
	class HistoricalDataProvider extends HistoricalDataProviderBase {
		constructor() {
			super();
		}

		_getHistoricalData(parameters, callback) {
			throw new Error('The "_getHistoricalData" has not been implemented.');
		}

		toString() {
			return '[HistoricalDataProvider]';
		}
	}

	return HistoricalDataProvider;
})();