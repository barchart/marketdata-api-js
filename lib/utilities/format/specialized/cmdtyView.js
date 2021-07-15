const AssetClass = require('./../../data/AssetClass');

const formatFraction = require('./../fraction'),
	formatPrice = require('./../price');

module.exports = (() => {
	'use strict';

	/*
	// This is a listing of futures option roots which do not use the
	// same default formatting rules, as specified in the UnitCode
	// class. The desired formatting rules can be viewed on the CME
	// website.

	const futures = { };

	futures["ZB"] = [ 'ZB', 'BB1', 'BB3', 'BB5', 'BB8' ]; // T-Bond, includes weekly and wednesday options
	futures["ZT"] = [ 'ZT', 'BT1', 'BT3', 'BT5', 'BT8' ]; // 2-year note, includes weekly and wednesday options
	futures["ZF"] = [ 'ZF', 'BF1', 'BF3', 'BF5', 'BF8' ]; // 5-year note, includes weekly and wednesday options
	futures["ZN"] = [ 'ZN', 'BN1', 'BN3', 'BN5', 'BN8' ]; // 10-year note, includes weekly and wednesday options
	*/

	/**
	 * An implementation of {@link Callbacks.CustomPriceFormatterCallback} which can be
	 * used with ${@link Profile.setPriceFormatterCustom} which uses logic specific to
	 * the [cmdtyView](https://www.barchart.com/cmdty/trading/cmdtyview) product.
	 *
	 * @function
	 * @ignore
	 * @param {Number} value
	 * @param {String} unitcode
	 * @param {Profile} profile
	 * @returns {String}
	 */
	function formatForCmdtyView(value, unitcode, profile) {
		if (profile.asset === AssetClass.FUTURE_OPTION) {
			const root = profile.root;

			// 2021/07/15, BRI. Options for ZB and ZN use unitcode="5" which defines
			// 64 price increments. The default price formatter will output fractions
			// using halves of thirty-seconds (e.g. 0-315). However, the CME specifies
			// formatting with sixty-fourths (e.g. 0-63). These notations are numerically
			// equivalent (i.e. 0-315 equals 0-63); however, customers will expect to see
			// the latter. This logic includes the option "root" symbols for normal, weekly,
			// and wendesday options (for ZB and ZN futures).

			if (root === 'ZB' || root === 'BB1' || root === 'BB3' || root === 'BB5' || root === 'BB8' || root === 'ZN' || root === 'BN1' || root === 'BN3' || root === 'BN5' || root === 'BN8') {
				return formatFraction(value, 64, 2, '-', false);
			}

			// 2021/07/15, BRI. Options for ZT and ZF use unitcode="6" which defines
			// 128 price increments. The default price formatter will output fractions
			// using quarters of thirty-seconds (e.g. 0-317). However, the CME specifies
			// formatting with halves of sixty-fourths (e.g. 0-635). These notations are
			// numerically equivalent (i.e. 0-317 equals 0-635); however, customers will
			// expect to see the latter. This logic includes the option "root" symbols for
			// normal, weekly,and wendesday options (for ZT and ZF futures).

			if (root === 'ZT' || root === 'BT1' || root === 'BT3' || root === 'BT5' || root === 'BT8' || root === 'ZF' || root === 'BF1' || root === 'BF3' || root === 'BF5' || root === 'BF8') {
				return formatFraction(value, 640, 3, '-', false);
			}
		}

		return formatPrice(value, unitcode, '-', true, ',');
	}

	return formatForCmdtyView;
})();