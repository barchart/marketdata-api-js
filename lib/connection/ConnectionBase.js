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
		 * Initiates a subscription to an {@link Subscription.EventType} and
		 * registers the callback for notifications.
		 *
		 * @public
		 * @param {Subscription.EventType} eventType
		 * @param {function} callback - notified each time the event occurs
		 * @param {...string=} symbols - one or more symbols, if applicable to the given {@link Subscription.EventType}
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
		 * Stops notification of the callback for the {@link Subscription.EventType}.
		 * See {@link ConnectionBase#on}.
		 *
		 * @public
		 * @param {Subscription.EventType} eventType - the {@link Subscription.EventType} which was passed to {@link ConnectionBase#on}
		 * @param {function} callback - the callback which was passed to {@link ConnectionBase#on}
		 * @param {...string=} symbols - one or more symbols, if applicable to the given {@link Subscription.EventType}
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
		 * Returns the {@link MarketState} singleton, which can be used to access {@link Quote}, {@link Profile}, and {@link CumulativeVolume} objects.
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