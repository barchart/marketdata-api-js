var MarketState = require('./../../../marketState/MarketState');

module.exports = (() => {
	'use strict';

	class ConnectionBase {
		constructor() {
			this._server = null;
			this._username = null;
			this._password = null;

			this._marketState = new MarketState();
		}

		connect(server, username, password) {
			this._server = server;
			this._username = username;
			this._password = password;

			this._connect();
		}

		_connect() {
			return;
		}

		disconnect() {
			this._server = null;
			this._username = null;
			this._password = null;

			this._disconnect();
		}

		_disconnect() {
			return;
		}

		on() {
			this._on.apply(this, arguments);
		}

		_on() {
			return;
		}

		off() {
			this._off.apply(this, arguments);
		}

		_off() {
			return;
		}

		getActiveSymbolCount() {
			return this._getActiveSymbolCount();
		}

		_getActiveSymbolCount() {
			return null;
		}

		getMarketState() {
			return this._marketState;
		}

		getServer() {
			return this._server;
		}

		getPassword() {
			return this._password;
		}

		getUsername() {
			return this._username;
		}

		toString() {
			return '[ConnectionBase]';
		}
	}

	return ConnectionBase;
})();