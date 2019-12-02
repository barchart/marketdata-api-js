const Timezones = require('@barchart/common-js/lang/Timezones');

module.exports = (() => {
	'use strict';

	/**
	 * Describes an exchange.
	 *
	 * @public
	 */
	class Exchange {
		constructor(id, name, timezoneDdf, timezoneExchange) {
			/**
			 * @property {string} id - the code used to identify the exchange
			 */
			this.id = id;

			/**
			 * @property {string} name - the name of the exchange
			 */
			this.name = name;

			/**
			 * @property {string|null} timezoneDdf - the timezone used by DDF for this exchange (should conform to a TZ database name)
			 */
			this.timezoneDdf = null;

			/**
			 * @property {number|null} offsetDdf - the UTC offset, in milliseconds, for DDF purposes.
			 */
			this.offsetDdf = null;

			/**
			 * @property {string} timezoneLocal - the actual timezone of the exchange (should conform to a TZ database name)
			 */
			this.timezoneExchange = null;

			/**
			 * @property {number} offsetExchange -- the UTC offset, in milliseconds, of the exchange's local time.
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
