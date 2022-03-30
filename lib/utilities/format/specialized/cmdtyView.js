const AssetClass = require('./../../data/AssetClass');

const formatFraction = require('./../fraction'),
	formatPrice = require('./../price');

module.exports = (() => {
	'use strict';

	const regex = { };

	regex.ZB = /^BB\d$/;
	regex.ZT = /^BT\d$/;
	regex.ZF = /^BF\d$/;
	regex.ZN = /^BN\d$/;

	/**
	 * An implementation of {@link Callbacks.CustomPriceFormatterCallback} which can be
	 * used with ${@link Profile.setPriceFormatterCustom}. This implementation applies
	 * logic specific to the [cmdtyView](https://www.barchart.com/cmdty/trading/cmdtyview)
	 * product.
	 *
	 * @function
	 * @ignore
	 * @param {Number} value
	 * @param {String} unitCode
	 * @param {Profile} profile
	 * @returns {String}
	 */
	function formatForCmdtyView(value, unitCode, profile) {
		if (profile.asset === AssetClass.FUTURE_OPTION) {
			const root = profile.root;

			// 2021/07/15, BRI. Options for ZB and ZN use unitCode="5" which defines
			// 64 price increments. The default price formatter will output fractions
			// using halves of thirty-seconds (e.g. 0-315). However, the CME specifies
			// formatting with sixty-fourths (e.g. 0-63). These notations are numerically
			// equivalent (i.e. 0-315 equals 0-63); however, customers will expect to see
			// the latter. This logic includes the option "root" symbols for normal, weekly,
			// and wednesday options (for ZB and ZN futures).

			if (root === 'ZB' || root === 'ZN' || regex.ZB.test(root) || regex.ZN.test(root)) {
				return formatFraction(value, 64, 2, '-', false);
			}

			// 2021/07/15, BRI. Options for ZT and ZF use unitCode="6" which defines
			// 128 price increments. The default price formatter will output fractions
			// using quarters of thirty-seconds (e.g. 0-317). However, the CME specifies
			// formatting with halves of sixty-fourths (e.g. 0-635). These notations are
			// numerically equivalent (i.e. 0-317 equals 0-635); however, customers will
			// expect to see the latter. This logic includes the option "root" symbols for
			// normal, weekly,and wednesday options (for ZT and ZF futures).

			if (root === 'ZT' || root === 'ZF' || regex.ZT.test(root) || regex.ZF.test(root)) {
				return formatFraction(value, 640, 3, '-', false);
			}
		}

		return formatPrice(value, unitCode, '-', true, ',');
	}

	return formatForCmdtyView;
})();