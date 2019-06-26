const process = require('process');

const version = require('./../../lib/index').version;

const Connection = require('./../../lib/connection/websocket/Connection'),
	WebSocketAdapterFactoryForNode = require('./../../lib/connection/websocket/adapter/WebSocketAdapterFactoryForNode');

const startup = (() => {
	'use strict';

	console.log(`Example: Node.js example script started [ version ${version} ]`);

	let connection = null;
	let adapterFactory = null;

	process.on('SIGINT', () => {
		console.log('\nExample: Processing SIGINT');

		if (connection !== null) {
			connection.disconnect();
		}

		console.log('Example: Node.js example script ending');

		process.exit();
	});

	const host = process.argv[2];
	const username = process.argv[3];
	const password = process.argv[4];
	const symbols = process.argv[5];

	console.log(`Example: Instantiating Connection (using Node.js adapter) for [ ${username}/${password} ] @ [ ${host} ]`);

	connection = new Connection();
	adapterFactory = new WebSocketAdapterFactoryForNode();

	connection.connect(host, username, password, adapterFactory);

	if (typeof symbols === 'string') {
		symbols.split(',').forEach((s) => {
			let price = null;

			const handleMarketUpdate = function(message) {
				const current = connection.getMarketState().getQuote(s).lastPrice;

				if (price !== current) {
					price = current;

					console.log(`Example: ${s} = ${price}`);
				}
			};

			connection.on('marketUpdate', handleMarketUpdate, s);
		});
	}
})();
