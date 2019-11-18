module.exports = (() => {
	'use strict';

	/**
	 * Describes an exchange.
	 *
	 * @public
	 */
	class Exchange {
		constructor(id, name, timezoneLocal, timezoneDdf) {
			/**
			 * @property {string} id - the code used to identify the exchange
			 */
			this.id = id;

			/**
			 * @property {string} name - the name of the exchange
			 */
			this.name = name;

			/**
			 * @property {string} timezoneLocal - the timezone of the exchange (should conform to a TZ database name)
			 */
			this.timezoneLocal = timezoneLocal;

			/**
			 * @property {string} timezoneDdf - the timezone used by DDF for this exchange (should conform to a TZ database name)
			 */
			this.timezoneDdf = timezoneDdf;
		}

		toString() {
			return `[Exchange (id=${this.id})]`;
		}
	}

	return Exchange;
})();
