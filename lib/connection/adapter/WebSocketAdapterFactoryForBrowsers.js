const WebSocketAdapter = require('./WebSocketAdapter'),
	WebSocketAdapterFactory = require('./WebSocketAdapterFactory');

const LoggerFactory = require('./../../logging/LoggerFactory');

module.exports = (() => {
	'use strict';

	let __window;

	try {
		__window = window || self || null;
	} catch (e) {
		__window = null;
	}

	/**
	 * An implementation of {@link WebSocketAdapterFactory} for use with web browsers. Pass
	 * an instance of this class to the {@link Connection.connect} function when operating in
	 * a web browser.
	 *
	 * @public
	 * @extends {WebSocketAdapterFactory}
	 * @exported
	 */
	class WebSocketAdapterFactoryForBrowsers extends WebSocketAdapterFactory {
		constructor() {
			super();

			this._logger = LoggerFactory.getLogger('@barchart/marketdata-api-js');
		}

		/**
		 * Returns a new {@link WebSocketAdapter} instance suitable for use
		 * with a web browser.
		 *
		 * @public
		 * @param {String} host
		 * @returns {WebSocketAdapter}
		 */
		build(host) {
			if (!__window || !__window.WebSocket) {
				this._logger.warn('Connection: Unable to connect, WebSockets are not supported.');

				return;
			}

			return new WebSocketAdapterForBrowsers(host);
		}

		toString() {
			return '[WebSocketAdapterFactoryForBrowsers]';
		}
	}

	/**
	 * A {@link WebSocketAdapter} for use with web browsers.
	 *
	 * @private
	 * @extends {WebSocketAdapter}
	 */
	class WebSocketAdapterForBrowsers extends WebSocketAdapter {
		constructor(host) {
			super(host);

			this._socket = new WebSocket(host);
		}

		get CONNECTING() {
			return WebSocket.CONNECTING;
		}

		get OPEN() {
			return WebSocket.OPEN;
		}

		get CLOSING() {
			return WebSocket.CLOSING;
		}

		get CLOSED() {
			return WebSocket.CLOSED;
		}

		get binaryType() {
			return this._socket.binaryType;
		}

		set binaryType(value) {
			this._socket.binaryType = value;
		}

		get readyState() {
			return this._socket.readyState;
		}

		set readyState(value) {
			this._socket.readyState = value;
		}

		get onopen() {
			return this._socket.onopen;
		}

		set onopen(callback) {
			this._socket.onopen = callback;
		}

		get onclose() {
			return this._socket.onclose;
		}

		set onclose(callback) {
			this._socket.onclose = callback;
		}

		get onmessage() {
			return this._socket.onmessage;
		}

		set onmessage(callback) {
			this._socket.onmessage = callback;
		}

		send(message) {
			this._socket.send(message);
		}

		close() {
			this._socket.close();
		}

		getDecoder() {
			let decoder;

			if (__window) {
				decoder = new __window.TextDecoder();
			} else {
				decoder = {
					decode: (data) => String.fromCharCode.apply(null, new Uint8Array(data))
				};
			}

			return decoder;
		}

		toString() {
			return '[WebSocketAdapterForBrowsers]';
		}
	}

	return WebSocketAdapterFactoryForBrowsers;
})();