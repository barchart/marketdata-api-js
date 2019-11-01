module.exports = (() => {
	'use strict';

	/**
	 * Describes an exchange.
	 *
	 * @public
	 */
	class Exchange {
		constructor(id, name, timezone) {
			/**
			 * @property {string} id - the code used to identify the exchange
			 */
			this.id = id;

			/**
			 * @property {string} name - the name of the exchange
			 */
			this.name = name;

			/**
			 * @property {Timezone} timezone - the timezone of the exchange (should conform to TZ database name)
			 */
			this.timezone = timezone;
		}

		toString() {
			return `[Exchange (id=${this.id})]`;
		}
	}

	return Exchange;
})();