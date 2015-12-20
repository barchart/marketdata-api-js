var Class = require('class.extend');

module.exports = function() {
	'use strict';

	return Class.extend({
		init: function() {

		},

		loadProfileData: function(symbols, callback) {
			return this._loadProfileData(symbols, callback);
		},

		_loadProfileData: function(symbols, callback) {
			return null;
		},

		toString: function() {
			return '[ProfileProviderBase]';
		}
	});
}();