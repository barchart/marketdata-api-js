module.exports = (() => {
	'use strict';

	/**
	 * An enumeration of subscriptions supported by a {@link Connection}.
	 *
	 * @public
	 * @exported
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
		 * A subscription to the remote server's heartbeat
		 */
		Timestamp: 'timestamp',

		/**
		 * A Level I market data subscription
		 */
		MarketUpdate: 'marketUpdate',

		/**
		 * A Level II market data subscription
		 */
		MarketDepth: 'marketDepth',

		/**
		 * A subscription for aggregate volume
		 */
		CumulativeVolume: 'cumulativeVolume'
	};

	return SubscriptionType;
})();