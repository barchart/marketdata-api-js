module.exports = (() => {
	'use strict';

	/**
	 * An enumeration of events which can occur during the life of a {@link Connection}.
	 *
	 * @public
	 * @memberOf Enums
	 * @enum {string}
	 * @exported
	 * @readonly
	 */
	const ConnectionEventType = {
		/**
		 * Remote server accepted your credentials
		 */
		LoginSuccess: 'login success',

		/**
		 * Remote server rejected your credentials
		 */
		LoginFail: 'login fail',

		/**
		 * Generated after {@link Connection#disconnect} is called
		 */
		Disconnecting: 'disconnecting',

		/**
		 * Connection to remote server lost
		 */
		Disconnect: 'disconnect',

		/**
		 * Generated after {@link Connection#pause} is called
		 */
		FeedPaused: 'feed paused',

		/**
		 * Generated after {@link Connection#resume} is called
		 */
		FeedResumed: 'feed resumed'
	};

	return ConnectionEventType;
})();