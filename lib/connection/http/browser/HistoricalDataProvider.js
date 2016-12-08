var xhr = require('xhr');

var HistoricalDataProviderBase = require('./../../HistoricalDataProviderBase');

module.exports = function() {
	'use strict';

	return HistoricalDataProviderBase.extend({
		init: function() {

		},

		_getHistoricalData: function(params, callback) {
			var queryString = '';

			for (var p in params) {
				if (queryString !== '') {
					queryString += '&';
				}

				queryString += encodeURIComponent(p) + '=' + encodeURIComponent(params[p]);
			}

			var options = {
				url: encodeURI('proxies/historicaldata/?' + queryString),
				method: 'GET',
				json: true
			};

			xhr(options, function(error, response, body) {
				var historicalData;

				if (error || response.statusCode !== 200) {
					historicalData = [ ];
				} else {
					historicalData = body;
				}

				callback(historicalData);
			});
		},

		toString: function() {
			return '[HistoricalDataProvider]';
		}
	});
}();