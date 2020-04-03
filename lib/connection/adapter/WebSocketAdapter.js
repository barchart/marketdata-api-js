module.exports = (() => {
	'use strict';

	/**
	 * The abstract definition for an object which can establish and
	 * communicate over a WebSocket. It is unlikely that SDK consumers
	 * will need to implement this class.
	 *
	 * @public
	 * @exported
	 * @abstract
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