module.exports = (() => {
	'use strict';

	/**
	 * An interface for writing log messages. An implementation of this
	 * class is returned by {@link LoggerProvider.getLogger}.
	 *
	 * @public
	 * @exported
	 * @abstract
	 */
	class Logger {
		constructor() {

		}

		/**
		 * Writes a log message.
		 *
		 * @public
		 * @abstract
		 * @param {...Schema.Loggable}
		 */
		log() {
			return;
		}

		/**
		 * Writes a log message at "trace" level.
		 *
		 * @public
		 * @abstract
		 * @param {...Schema.Loggable}
		 */
		trace() {
			return;
		}

		/**
		 * Writes a log message at "debug" level.
		 *
		 * @public
		 * @abstract
		 * @param {...Schema.Loggable}
		 */
		debug() {
			return;
		}

		/**
		 * Writes a log message at "info" level.
		 *
		 * @public
		 * @abstract
		 * @param {...Schema.Loggable}
		 */
		info() {
			return;
		}

		/**
		 * Writes a log message at "warn" level.
		 *
		 * @public
		 * @abstract
		 * @param {...Schema.Loggable}
		 */
		warn() {
			return;
		}

		/**
		 * Writes a log message at "error" level.
		 *
		 * @public
		 * @abstract
		 * @param {...Schema.Loggable}
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