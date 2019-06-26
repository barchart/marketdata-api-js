const ws = require('ws');

const Adapter = require('./Adapter'),
	AdapterFactory = require('./AdapterFactory');

module.exports = (() => {
	'use strict';

	/**
	 * An interface for creating and interacting with a WebSocket connection.
	 *
	 * @public
	 * @interface
	 */
	class NodeAdapterFactory extends AdapterFactory {
		constructor() {
			super();
		}

		build(host) {
			return new NodeAdapter(host);
		}

		toString() {
			return '[NodeAdapterFactory]';
		}
	}

	class NodeAdapter extends Adapter {
		constructor(host) {
			super(host);

			this._socket = new ws(host);
		}

		get CONNECTING() {
			return this._socket.CONNECTING;
		}

		get OPEN() {
			return this._socket.OPEN;
		}

		get CLOSING() {
			return this._socket.CLOSING;
		}

		get CLOSED() {
			return this._socket.CLOSED;
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
			return {
				decode: (data) => String.fromCharCode.apply(null, new Uint8Array(data))
			};
		}

		toString() {
			return '[NodeAdapter]';
		}
	}

	return NodeAdapterFactory;
})();