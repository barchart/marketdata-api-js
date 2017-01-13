var MarketState = require('./../marketState/MarketState');

module.exports = (() => {
	'use strict';

	/**
	 * Object used to connect to market data server, request data feeds, and
	 * query market state.
	 *
	 * @public
	 * @interface
	 */
	class ConnectionBase {
		constructor() {
			this._server = null;
			this._username = null;
			this._password = null;

			this._marketState = new MarketState();
		}

		/**
		 * Connects to the given server with username and password.
		 *
		 * @public
		 * @param {string} server
		 * @param {string} username
		 * @param {string} password
		 */
		connect(server, username, password) {
			this._server = server;
			this._username = username;
			this._password = password;

			this._connect();
		}

		/**
		 * @protected
		 * @ignore
		 */
		_connect() {
			return;
		}

		/**
		 * Forces a disconnect from the server.
		 *
		 * @public
		 */
		disconnect() {
			this._server = null;
			this._username = null;
			this._password = null;

			this._disconnect();
		}

		/**
		 * @protected
		 * @ignore
		 */
		_disconnect() {
			return;
		}

		/**
		 * <p>Registers an event handler for a given event.</p>
		 * <p>The following events are supported:
		 * <ul>
		 *   <li>marketDepth -- notification for changes to the order book</li>
		 *   <li>marketUpdate -- notification for changes to the quote object</li>
		 *   <li>cumulativeVolume -- notification for changes to volume totals (grouped by price level)</li>
		 *   <li>timestamp -- notification of server time updates (once per second)</li>
		 *   <li>events -- network events pertaining to the state of the instance</li>
		 * </ul>
		 * </p>
		 *
		 * @public
		 * @param {string} event - name of the event (see above).
		 * @param {function} callback - notified each time the event occurs.
		 * @param {...string} symbols - One or more symbols.
		 */
		on() {
			this._on.apply(this, arguments);
		}

		/**
		 * @protected
		 * @ignore
		 */
		_on() {
			return;
		}

		/**
		 * Unregisters an event handler for a given event. See {@link ConnectionBase.on}.
		 *
		 * @public
		 * @param {string} event - the event which was registered using the {@link ConnectionBase.on}.
		 * @param {function} callback - the callback which was registered using the {@link ConnectionBase.on}.
		 */
		off() {
			this._off.apply(this, arguments);
		}

		/**
		 * @protected
		 * @ignore
		 */
		_off() {
			return;
		}

		getActiveSymbolCount() {
			return this._getActiveSymbolCount();
		}

		_getActiveSymbolCount() {
			return null;
		}

		/**
		 * Returns the {@link MarketState} singleton
		 *
		 * @return {MarketState}
		 */
		getMarketState() {
			return this._marketState;
		}

		/**
		 * @returns {null|string}
		 */
		getServer() {
			return this._server;
		}

		/**
		 * @returns {null|string}
		 */
		getPassword() {
			return this._password;
		}

		/**
		 * @returns {null|string}
		 */
		getUsername() {
			return this._username;
		}

		toString() {
			return '[ConnectionBase]';
		}
	}

	return ConnectionBase;
})();