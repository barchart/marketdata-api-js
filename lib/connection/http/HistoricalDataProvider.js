var HistoricalDataProviderBase = require('./../HistoricalDataProviderBase');

module.exports = (() => {
	'use strict';

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