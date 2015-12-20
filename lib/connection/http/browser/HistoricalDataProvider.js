var HistoricalDataProviderBase = require('./../../HistoricalDataProviderBase');

var jQueryProvider = require('./../../../common/jQuery/jQueryProvider');

module.exports = function() {
	'use strict';

	var $ = jQueryProvider.getInstance();

	return HistoricalDataProviderBase.extend({
		init: function() {

		},

		_getHistoricalData: function(params, callback) {
			$.ajax({
				url : 'proxies/historicaldata',
				dataType : 'text',
				data : params
			}).done(function(json) {
				return callback(json);
			});
		},

		toString: function() {
			return '[HistoricalDataProvider]';
		}
	});
}();