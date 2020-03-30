module.exports = (() => {
	'use strict';

	/**
	 * An abstract definition for an factory that builds {@link WebSocketAdapter}
	 * instances. It is unlikely that SDK consumers will need to implement this class.
	 *
	 * @public
	 * @exported
	 * @abstract
	 */
	class WebSocketAdapterFactory {
		constructor() {

		}

		/**
		 * Returns a new {@link WebSocketAdapter} instance.
		 *
		 * @public
		 * @abstract
		 * @param {String} host
		 * @returns {WebSocketAdapter}
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