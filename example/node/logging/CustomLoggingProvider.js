const log4js = require('log4js');

const Logger = require('./../../../lib/logging/Logger'),
	LoggerProvider = require('./../../../lib/logging/LoggerProvider');

module.exports = (() => {
	'use strict';

	const configuration = {
		"categories": {
			"default": { "appenders": [ "console" ], "level": "debug" }
		},
		"appenders": {
			"console": {
				"type": "console",
				"layout": {
					"type": "pattern",
					"pattern": "[%p] %c - %m%"
				}
			}
		}
	};

	class CustomLoggingProvider extends LoggerProvider {
		constructor() {
			super();

			this._configured = false;
		}

		getLogger(category) {
			if (!this._configured) {
				log4js.configure(configuration);

				this._configured = true;
			}

			return new CustomLogger(log4js.getLogger(category));
		}

		toString() {
			return '[CustomLoggingProvider]';
		}
	}

	class CustomLogger extends Logger {
		constructor(logger) {
			super();

			this._logger = logger;
		}

		log() {
			this.info.apply(this, arguments);
		}

		trace() {
			this._logger.trace.apply(this._logger, arguments);
		}

		debug() {
			this._logger.debug.apply(this._logger, arguments);
		}

		info() {
			this._logger.info.apply(this._logger, arguments);
		}

		warn() {
			this._logger.warn.apply(this._logger, arguments);
		}

		error() {
			this._logger.error.apply(this._logger, arguments);
		}

		toString() {
			return '[CustomLogger]';
		}
	}

	return CustomLoggingProvider;
})();