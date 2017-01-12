var xhr = require('xhr');

var HistoricalDataProviderBase = require('./../../HistoricalDataProviderBase');

module.exports = (() => {
	'use strict';

	class HistoricalDataProvider extends HistoricalDataProviderBase {
		constructor() {
			super();
		}

		_getHistoricalData(params, callback) {
			return new Promise((resolveCallback) => {
				const queryStrings = Object.keys(params).map((key) => {
					return encodeURIComponent(key) + '=' + encodeURIComponent(params[p]);
				});

				const options = {
					url: encodeURI('proxies/historicaldata/?' + queryStrings.join('&')),
					method: 'GET',
					json: true
				};

				xhr(options, (error, response, body) => {
					var historicalData;

					if (error || response.statusCode !== 200) {
						historicalData = [ ];
					} else {
						historicalData = body;
					}

					if (typeof callback === 'function') {
						callback(historicalData);
					}

					resolveCallback(historicalData);
				});
			});
		}

		toString() {
			return '[HistoricalDataProvider]';
		}
	}

	return HistoricalDataProvider;
})();