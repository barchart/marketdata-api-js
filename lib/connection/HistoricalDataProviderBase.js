var Class = require('class.extend');

module.exports = function() {
	'use strict';

	return Class.extend({
		init: function() {

		},

		getHistoricalData: function(parameters, callback) {
			return this._getHistoricalData(parameters, callback);
		},

		_getHistoricalData: function(parameters, callback) {
			return null;
		},

		toString: function() {
			return '[HistoricalDataProviderBase]';
		}
	});
}();