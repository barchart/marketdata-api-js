module.exports = (() => {
	'use strict';

	/**
	 * An enumeration of descriptions for events which can occur during the life
	 * of a {@link Connection}.
	 *
	 * @public
	 * @memberOf Enums
	 * @enum {string}
	 * @readonly
	 */
	const ConnectionEventType = {
		/**
		 * Remote server accepted credentials
		 */
		LoginSuccess: 'login success',

		/**
		 * Remote server rejected credentials
		 */
		LoginFail: 'login fail',

		/**
		 * Generated after calling {@link Connection#disconnect}
		 */
		Disconnecting: 'disconnecting',

		/**
		 * Connection to remote server lost
		 */
		Disconnect: 'disconnect',

		/**
		 * Generated after calling {@link Connection#pause}
		 */
		FeedPaused: 'feed paused',

		/**
		 * Generated after calling {@link Connection#resume}
		 */
		FeedResumed: 'feed resumed'
	};

	return ConnectionEventType;
})();