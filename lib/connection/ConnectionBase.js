const is = require('@barchart/common-js/lang/is');

const MarketState = require('./../marketState/MarketState');

module.exports = (() => {
	'use strict';

	let instanceCounter = 0;

	/**
	 * Contract for communicating with remove market data servers and
	 * querying current market state.
	 *
	 * @protected
	 * @interface
	 */
	class ConnectionBase {
		constructor() {
			this._server = null;
			this._username = null;
			this._password = null;

			this._marketState = new MarketState(symbol => this._handleProfileRequest(symbol));

			this._pollingFrequency = null;
			this._extendedProfileMode = false;

			this._instance = ++instanceCounter;
		}

		/**
		 * Connects to the given server with username and password.
		 *
		 * @public
		 * @param {string} server
		 * @param {string} username
		 * @param {string} password
		 * @param {WebSocketAdapterFactory=} webSocketAdapterFactory
		 */
		connect(server, username, password, webSocketAdapterFactory) {
			this._server = server;
			this._username = username;
			this._password = password;

			this._connect(webSocketAdapterFactory || null);
		}

		/**
		 * @protected
		 * @param {WebSocketAdapterFactory=} webSocketAdapterFactory
		 * @ignore
		 */
		_connect(webSocketAdapterFactory) {
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
		 * Causes the market state to stop updating. All subscriptions are maintained.
		 *
		 * @public
		 */
		pause() {
			this._pause();
		}

		/**
		 * @protected
		 * @ignore
		 */
		_pause() {
			return;
		}

		/**
		 * Causes the market state to begin updating again (after {@link ConnectionBase#pause} has been called).
		 *
		 * @public
		 */
		resume() {
			this._resume();
		}

		/**
		 * @protected
		 * @ignore
		 */
		_resume() {
			return;
		}

		/**
		 * Initiates a subscription to an {@link Enums.SubscriptionType} and
		 * registers the callback for notifications.
		 *
		 * @public
		 * @param {Enums.SubscriptionType} subscriptionType
		 * @param {function} callback - notified each time the event occurs
		 * @param {String=} symbol - A symbol, if applicable, to the given {@link Enums.SubscriptionType}
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
		 * Stops notification of the callback for the {@link Enums.SubscriptionType}.
		 * See {@link ConnectionBase#on}.
		 *
		 * @public
		 * @param {Enums.SubscriptionType} subscriptionType - the {@link Enums.SubscriptionType} which was passed to {@link ConnectionBase#on}
		 * @param {function} callback - the callback which was passed to {@link ConnectionBase#on}
		 * @param {String=} symbol - A symbol, if applicable, to the given {@link Enums.SubscriptionType}
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
		 * The frequency, in milliseconds, used to poll for changes to {@link Quote}
		 * objects. A null value indicates streaming updates (default).
		 *
		 * @public
		 * @returns {number|null}
		 */
		getPollingFrequency() {
			return this._pollingFrequency;
		}

		/**
		 * Sets the polling frequency, in milliseconds. A null value indicates
		 * streaming market updates (where polling is not used).
		 *
		 * @public
		 * @param {number|null} pollingFrequency
		 */
		setPollingFrequency(pollingFrequency) {
			if (this._pollingFrequency !== pollingFrequency) {
				if (pollingFrequency && pollingFrequency > 0) {
					this._pollingFrequency = pollingFrequency;
				} else {
					this._pollingFrequency = null;
				}

				this._onPollingFrequencyChanged(this._pollingFrequency);
			}
		}

		/**
		 * @protected
		 * @ignore
		 */
		_onPollingFrequencyChanged(pollingFrequency) {
			return;
		}

		/**
		 * Indicates if additional profile data (e.g. future contract expiration dates
		 * should be loaded when subscribing to to market data).
		 *
		 * @public
		 * @return {boolean}
		 */
		getExtendedProfileMode() {
			return this._extendedProfileMode;
		}

		setExtendedProfileMode(mode) {
			if (is.boolean(mode) && this._extendedProfileMode !== mode) {
				this._extendedProfileMode = mode;

				this._onExtendedProfileModeChanged(this._extendedProfileMode);
			}
		}

		/**
		 * @protected
		 * @ignore
		 */
		_onExtendedProfileModeChanged(mode) {
			return;
		}

		/**
		 * @protected
		 * @ignore
		 */
		_handleProfileRequest(symbol) {
			return;
		}

		/**
		 * Returns the {@link MarketState} singleton, used to access {@link Quote}, 
		 * {@link Profile}, and {@link CumulativeVolume} objects.
		 *
		 * @returns {MarketState}
		 */
		getMarketState() {
			return this._marketState;
		}

		/**
		 * @public
		 * @returns {null|string}
		 */
		getServer() {
			return this._server;
		}

		/**
		 * @public
		 * @returns {null|string}
		 */
		getPassword() {
			return this._password;
		}

		/**
		 * @public
		 * @returns {null|string}
		 */
		getUsername() {
			return this._username;
		}

		/**
		 * Get an unique identifier for the current instance.
		 *
		 * @protected
		 * @returns {Number}
		 */
		_getInstance() {
			return this._instance;
		}

		toString() {
			return `[ConnectionBase (instance=${this._instance}]`;
		}
	}

	return ConnectionBase;
})();