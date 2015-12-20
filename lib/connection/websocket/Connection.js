var ConnectionBase = require('./../ConnectionBase');

module.exports = function() {
	'use strict';

	return ConnectionBase.extend({
		init: function() {

		},

		_connect: function(server, username, password) {
			throw new Error(this.toString() + '.connect has not been implemented.');
		},

		_disconnect: function() {
			throw new Error(this.toString() + '.disconnect has not been implemented.');
		},

		_on: function() {
			throw new Error(this.toString() + '.on has not been implemented.');
		},

		_off: function() {
			throw new Error(this.toString() + '.off has not been implemented.');
		},

		_getMarketState: function() {
			throw new Error(this.toString() + '.getMarketState has not been implemented.');
		},

		_getActiveSymbolCount: function() {
			throw new Error(this.toString() + '.getActiveSymbolCount has not been implemented.');
		},

		_getPassword: function() {
			throw new Error(this.toString() + '.getPassword has not been implemented.');
		},

		_getUsername: function() {
			throw new Error(this.toString() + '.getUsername has not been implemented.');
		},

		toString: function() {
			return '[ConnectionBase]';
		}
	});
}();