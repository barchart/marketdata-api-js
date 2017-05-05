module.exports = (() => {
	'use strict';

	/**
	 * @namespace Subscription
	 */

	/**
	 * A data feed type. See {@link ConnectionBase#on}.
	 *
	 * @public
	 * @memberof Subscription
	 * @enum {string}
	 * @readonly
	 */
	const EventType = {
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
		EventType: 'events'
	};

	return EventType;
})();