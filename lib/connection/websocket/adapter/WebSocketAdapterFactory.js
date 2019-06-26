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

		build(host) {
			return null;
		}

		toString() {
			return '[WebSocketAdapterFactory]';
		}
	}

	return WebSocketAdapterFactory;
})();