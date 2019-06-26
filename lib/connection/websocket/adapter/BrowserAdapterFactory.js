const Adapter = require('./Adapter'),
	AdapterFactory = require('./AdapterFactory');

module.exports = (() => {
	'use strict';

	let __window;

	try {
		__window = window || self || null;
	} catch (e) {
		__window = null;
	}

	/**
	 * An interface for creating and interacting with a WebSocket connection.
	 *
	 * @public
	 * @interface
	 */
	class BrowserAdapterFactory extends AdapterFactory {
		constructor() {
			super();
		}

		build(host) {
			if (!__window || !__window.WebSocket) {
				console.warn('Connection: Unable to connect, WebSockets are not supported.');

				return;
			}

			return new BrowserAdapter(host);
		}

		toString() {
			return '[BrowserAdapterFactory]';
		}
	}

	class BrowserAdapter extends Adapter {
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
			return '[BrowserAdapter]';
		}
	}

	return BrowserAdapterFactory;
})();