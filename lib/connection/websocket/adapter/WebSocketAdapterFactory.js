module.exports = (() => {
	'use strict';

	/**
	 * An interface for creating WebSocket {@link WebSocketAdapter} instances.
	 *
	 * @public
	 * @interface
	 */
	class WebSocketAdapterFactory {
		constructor() {

		}

		/**
		 * Returns a new {@link WebSocketAdapter} instance.
		 *
		 * @public
		 * @param {String} host
		 * @returns {null}
		 */
		build(host) {
			return null;
		}

		toString() {
			return '[WebSocketAdapterFactory]';
		}
	}

	return WebSocketAdapterFactory;
})();