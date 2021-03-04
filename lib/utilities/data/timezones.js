const timezone = require('@barchart/common-js/lang/timezone');

module.exports = (() => {
	'use strict';


	return {
		/**
		 * Gets a list of names in the tz database (see https://en.wikipedia.org/wiki/Tz_database
		 * and https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
		 *
		 * @public
		 * @static
		 * @exported
		 * @returns {Array<String>}
		 */
		getTimezones() {
			return timezone.getTimezones();
		},

		/**
		 * Attempts to guess the local timezone.
		 *
		 * @public
		 * @static
		 * @exported
		 * @returns {String|null}
		 */
		guessTimezone() {
			return timezone.guessTimezone();
		}
	};
})();