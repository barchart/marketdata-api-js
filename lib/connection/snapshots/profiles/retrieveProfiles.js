const axios = require('axios');

const assert = require('@barchart/common-js/lang/assert'),
	Day = require('@barchart/common-js/lang/Day'),
	is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	const regex = {};

	regex.dates = {};
	regex.dates.expire = /^([0-9]{4}-[0-9]{2}-[0-9]{2})T/;

	/**
	 * Executes an HTTP request for profile data.
	 *
	 * @function
	 * @ignore
	 * @exported
	 * @param {String[]} symbols
	 * @returns {Promise<ProfileExtension[]>}
	 */
	function retrieveProfiles(symbols) {
		return Promise.resolve()
			.then(() => {
				assert.argumentIsArray(symbols, 'symbols', String);

				const options = {
					url: `https://extras.ddfplus.com/json/instruments/?lookup=${encodeURIComponent(symbols.join())}`,
					method: 'GET'
				};

				return Promise.resolve(axios(options))
					.then((response) => {
						if (response.status !== 200) {
							return [];
						}

						const results = (response.data.instruments || []).filter((result) => {
							return result.status === 200;
						});

						return results.map((result) => {
							const profile = {};

							profile.symbol = result.lookup;

							if (is.string(result.symbol_expire)) {
								const matches = result.symbol_expire.match(regex.dates.expire);

								if (matches !== null) {
									profile.expiration = Day.parse(matches[1]).format();
								}
							}

							if (is.string(result.symbol_fnd)) {
								profile.firstNotice = Day.parse(result.symbol_fnd).format();
							}

							return profile;
						});
					});
			});
	}

	/**
	 * Extended profile information.
	 *
	 * @typedef ProfileExtension
	 * @type {Object}
	 * @ignore
	 * @property {String} symbol
	 * @property {String=} expiration
	 * @property {String=} firstNotice
	 */

	return retrieveProfiles;
})();
