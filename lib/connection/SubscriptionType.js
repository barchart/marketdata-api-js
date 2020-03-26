module.exports = (() => {
	'use strict';

	/**
	 * @namespace Enums
	 */

	/**
	 * A data feed type. See {@link ConnectionBase#on}.
	 *
	 * @public
	 * @memberof Enums
	 * @enum {string}
	 * @readonly
	 */
	const SubscriptionType = {
		/**
		 * a subscription to {@link Book} changes
		 */
		MarketDepth: 'marketDepth',

		/**
		 * a subscription to {@link Quote} changes
		 */
		MarketUpdate: 'marketUpdate',

		/**
		 * a subscription to {@link CumulativeVolume} changes
		 */
		CumulativeVolume: 'cumulativeVolume',

		/**
		 * a subscription to the server's timestamp beacon
		 */
		Timestamp: 'timestamp',

		/**
		 * a subscription to system events (debugging only)
		 */
		Events: 'events'
	};

	return SubscriptionType;
})();