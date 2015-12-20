var HistoricalDataProviderBase = require('./../HistoricalDataProviderBase');

module.exports = function() {
	'use strict';

	return HistoricalDataProviderBase.extend({
		init: function() {

		},

		_getHistoricalData: function(parameters, callback) {
			throw new Error(this.toString() + '.getHistoricalData has not been implemented.');
		},

		toString: function() {
			return '[HistoricalDataProvider]';
		}
	});
}();