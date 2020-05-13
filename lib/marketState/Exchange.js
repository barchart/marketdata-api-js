const Timezones = require('@barchart/common-js/lang/Timezones');

module.exports = (() => {
	'use strict';

	/**
	 * Describes an exchange.
	 *
	 * @public
	 * @exported
	 */
	class Exchange {
		constructor(id, name, timezoneDdf, timezoneExchange) {
			/**
			 * @property {string} id - Barchart code for the exchange
			 * @public
			 * @readonly
			 */
			this.id = id;

			/**
			 * @property {string} name - Name of the exchange
			 * @public
			 * @readonly
			 */
			this.name = name;

			/**
			 * @property {string|null} timezoneDdf - Implied timezone of DDF messages for this exchange (conforms to a TZ database name)
			 * @public
			 * @readonly
			 */
			this.timezoneDdf = null;

			/**
			 * @property {number|null} offsetDdf - The offset, in milliseconds, between a DDF time and UTC.
			 * @public
			 * @readonly
			 */
			this.offsetDdf = null;

			/**
			 * @property {string} timezoneLocal - Timezone exchange is physically located in (conforms to a TZ database name).
			 * @public
			 * @readonly
			 */
			this.timezoneExchange = null;

			/**
			 * @property {number} offsetExchange -- The offset, in milliseconds, between exchange time and UTC.
			 * @public
			 * @readonly
			 */
			this.offsetExchange = null;

			const tzDdf = Timezones.parse(timezoneDdf);
			const tzExchange = Timezones.parse(timezoneExchange);

			if (tzDdf !== null) {
				this.timezoneDdf = tzDdf.code;
				this.offsetDdf = tzDdf.getUtcOffset(null, true);
			}

			if (tzExchange !== null) {
				this.timezoneExchange = tzExchange.code;
				this.offsetExchange = tzExchange.getUtcOffset(null, true);
			}
		}

		toString() {
			return `[Exchange (id=${this.id})]`;
		}
	}

	return Exchange;
})();
