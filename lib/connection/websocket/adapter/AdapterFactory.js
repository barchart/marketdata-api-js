module.exports = (() => {
	'use strict';

	/**
	 * An interface for creating a WebSocket {@link Adapter}.
	 *
	 * @public
	 * @interface
	 */
	class AdapterFactory {
		constructor() {

		}

		build(host) {
			return null;
		}

		toString() {
			return '[AdapterFactory]';
		}
	}

	return AdapterFactory;
})();