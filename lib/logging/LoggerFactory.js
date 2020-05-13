const Logger = require('./Logger'),
	LoggerProvider = require('./LoggerProvider');

module.exports = (() => {
	'use strict';

	let __provider = null;

	/**
	 * Container for static functions which control logging within the SDK.
	 *
	 * @public
	 * @exported
	 */
	class LoggerFactory {
		constructor() {

		}

		/**
		 * Configures the SDK to write log messages to the console.
		 *
		 * @public
		 * @static
		 */
		static configureForConsole() {
			LoggerFactory.configure(new ConsoleLoggerProvider());
		}

		/**
		 * Configures the SDK to mute all log messages.
		 *
		 * @public
		 * @static
		 */
		static configureForSilence() {
			LoggerFactory.configure(new EmptyLoggerProvider());
		}

		/**
		 * Configures the library to delegate any log messages to a custom
		 * implementation of the {@link LoggerProvider} class.
		 *
		 * @public
		 * @static
		 * @param {LoggerProvider} provider
		 */
		static configure(provider) {
			if (__provider === null && provider instanceof LoggerProvider) {
				__provider = provider;
			}
		}

		/**
		 * Returns an instance of {@link Logger} for a specific category.
		 *
		 * @public
		 * @static
		 * @param {String} category
		 * @returns {Logger}
		 */
		static getLogger(category) {
			if (__provider === null) {
				LoggerFactory.configureForConsole();
			}

			return __provider.getLogger(category);
		}

		toString() {
			return '[LoggerFactory]';
		}
	}

	let __consoleLogger = null;

	class ConsoleLoggerProvider extends LoggerProvider {
		constructor() {
			super();
		}

		getLogger(category) {
			if (__consoleLogger === null) {
				__consoleLogger = new ConsoleLogger();
			}

			return __consoleLogger;
		}

		toString() {
			return '[ConsoleLoggerProvider]';
		}
	}

	class ConsoleLogger extends Logger {
		constructor() {
			super();
		}

		log() {
			try {
				console.log.apply(console, arguments);
			} catch (e) {

			}
		}

		trace() {
			try {
				console.trace.apply(console, arguments);
			} catch (e) {

			}
		}

		debug() {
			try {
				console.debug.apply(console, arguments);
			} catch (e) {

			}
		}

		info() {
			try {
				console.info.apply(console, arguments);
			} catch (e) {

			}
		}

		warn() {
			try {
				console.warn.apply(console, arguments);
			} catch (e) {

			}
		}

		error() {
			try {
				console.error.apply(console, arguments);
			} catch (e) {

			}
		}

		toString() {
			return '[ConsoleLogger]';
		}
	}

	let __emptyLogger = null;

	class EmptyLoggerProvider extends LoggerProvider {
		constructor() {
			super();
		}

		getLogger(category) {
			if (__emptyLogger === null) {
				__emptyLogger = new EmptyLogger();
			}

			return __emptyLogger;
		}

		toString() {
			return '[EmptyLoggerProvider]';
		}
	}

	class EmptyLogger extends Logger {
		constructor() {
			super();
		}

		log() {
			return;
		}

		trace() {
			return;
		}

		debug() {
			return;
		}

		info() {
			return;
		}

		warn() {
			return;
		}

		error() {
			return;
		}

		toString() {
			return '[ConsoleLogger]';
		}
	}

	return LoggerFactory;
})();