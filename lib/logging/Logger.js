module.exports = (() => {
	'use strict';

	/**
	 * An interface for writing log messages.
	 *
	 * @public
	 * @interface
	 */
	class Logger {
		constructor() {

		}

		/**
		 * Writes a log message.
		 *
		 * @public
		 */
		log() {
			return;
		}

		/**
		 * Writes a log message, at "debug" level.
		 *
		 * @public
		 */
		debug() {
			return;
		}

		/**
		 * Writes a log message, at "info" level.
		 *
		 * @public
		 */
		info() {
			return;
		}

		/**
		 * Writes a log message, at "warn" level.
		 *
		 * @public
		 */
		warn() {
			return;
		}

		/**
		 * Writes a log message, at "error" level.
		 *
		 * @public
		 */
		error() {
			return;
		}

		toString() {
			return '[Logger]';
		}
	}

	return Logger;
})();