const assert = require('@barchart/common-js/lang/assert');

const is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * Contract for sending diagnostic commands to the remote server.
	 *
	 * @protected
	 * @abstract
	 * @ignore
	 */
	class DiagnosticsControllerBase {
		constructor() {
			this._initialized = false;
		}

		/**
		 * @public
		 * @param {String} file
		 * @param {*} subscriptions
		 */
		initialize(file, subscriptions) {
			if (this._initialized) {
				throw new Error('The diagnostics controller has already been initialized.');
			}

			assert.argumentIsRequired(file, 'file', String);

			if (subscriptions) {
				assert.argumentIsArray(subscriptions, 'subscriptions', s => is.string(s.symbol) && is.fn(s.callback), 'DiagnosticsSubscription');
			}

			this._initialized = true;

			this._initialize(subscriptions || [ ]);
			this._transmit(`LOAD ${file}`);
		}

		_initialize(subscriptions) {
			return;
		}

		next() {
			checkReady.call(this);

			this._transmit('NEXT');
		}

		scroll(index) {
			assert.argumentIsRequired(index, 'index', Number);

			checkReady.call(this);

			this._transmit(`SCROLL ${index.toString()}`);
		}

		_transmit(message) {
			return;
		}

		toString() {
			return `[DiagnosticsControllerBase]`;
		}
	}

	function checkReady() {
		if (!this._initialized) {
			throw new Error('The diagnostics controller has not been initialized.');
		}
	}

	return DiagnosticsControllerBase;
})();