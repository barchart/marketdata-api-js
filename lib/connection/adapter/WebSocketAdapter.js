module.exports = (() => {
	'use strict';

	/**
	 * An interface for establishing and interacting with a WebSocket connection.
	 *
	 * @public
	 * @interface
	 */
	class WebSocketAdapter {
		constructor(host) {

		}

		get CONNECTING() {
			return null;
		}

		get OPEN() {
			return null;
		}

		get CLOSING() {
			return null;
		}

		get CLOSED() {
			return null;
		}

		get binaryType() {
			return null;
		}

		set binaryType(value) {
			return;
		}

		get readyState() {
			return null;
		}

		set readyState(value) {
			return;
		}

		get onopen() {
			return null;
		}

		set onopen(callback) {
			return;
		}

		get onclose() {
			return null;
		}

		set onclose(callback) {
			return;
		}

		get onmessage() {
			return null;
		}

		set onmessage(callback) {
			return;
		}

		send(message) {
			return;
		}

		close() {
			return;
		}

		getDecoder() {
			return null;
		}

		toString() {
			return '[WebSocketAdapter]';
		}
	}

	return WebSocketAdapter;
})();