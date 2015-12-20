var Class = require('class.extend');

module.exports = function() {
	'use strict';

	return Class.extend({
		init: function() {

		},

		connect: function(server, username, password) {
			this._connect(server, username, password);
		},

		_connect: function(server, username, password) {
			return;
		},

		disconnect: function() {
			this._disconnect();
		},

		_disconnect: function() {
			return;
		},

		on: function() {
			this._on.apply(this, arguments);
		},

		_on: function() {
			return;
		},

		off: function() {
			this._off.apply(this, arguments);
		},

		_off: function() {
			return;
		},

		getMarketState: function() {
			return this._getMarketState();
		},

		_getMarketState: function() {
			return null;
		},

		getActiveSymbolCount: function() {
			return this._getActiveSymbolCount();
		},

		_getActiveSymbolCount: function() {
			return null;
		},

		getPassword: function() {
			return this._getPassword();
		},

		_getPassword: function() {
			return null;
		},

		getUsername: function() {
			return this._getUsername();
		},

		_getUsername: function() {
			return null;
		},

		toString: function() {
			return '[ConnectionBase]';
		}
	});
}();