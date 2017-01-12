module.exports = (() => {
	'use strict';

	class HistoricalDataProviderBase {
		constructor() {

		}

		getHistoricalData(parameters, callback) {
			return Promise.resolve()
				.then(() => {
					return this._getHistoricalData(parameters, callback);
				});
		}

		_getHistoricalData(parameters, callback) {
			return [ ];
		}

		toString() {
			return '[HistoricalDataProviderBase]';
		}
	}

	return HistoricalDataProviderBase;
})();