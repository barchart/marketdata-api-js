module.exports = (() => {
	'use strict';

	/**
	 * An enumeration of subscriptions supported by a {@link Connection}.
	 *
	 * @public
	 * @memberof Enums
	 * @enum {string}
	 * @readonly
	 */
	const SubscriptionType = {
		/**
		 * A subscription to connection status
		 */
		Events: 'events',

		/**
		 * A Level II market data subscription
		 */
		MarketDepth: 'marketDepth',

		/**
		 * A Level I market data subscription
		 */
		MarketUpdate: 'marketUpdate',

		/**
		 * A subscription for aggregate volume
		 */
		CumulativeVolume: 'cumulativeVolume',

		/**
		 * A subscription to the remote server's heartbeat
		 */
		Timestamp: 'timestamp'
	};

	return SubscriptionType;
})();