module.exports = (() => {
	'use strict';

	/**
	 * An object which can lookup historical data.
	 *
	 * @ignore
	 * @interface
	 */
	class HistoricalDataProviderBase {
		constructor() {

		}

		/**
		 * Performs asynchronous lookup of historical data.
		 *
		 * @public
		 */
		getHistoricalData(parameters, callback) {
			return Promise.resolve()
				.then(() => {
					return this._getHistoricalData(parameters, callback);
				});
		}

		/**
		 * @protected
		 * @ignore
		 */
		_getHistoricalData(parameters, callback) {
			return [ ];
		}

		toString() {
			return '[HistoricalDataProviderBase]';
		}
	}

	return HistoricalDataProviderBase;
})();