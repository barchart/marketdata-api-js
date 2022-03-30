const process = require('process');

const Connection = require('./../../lib/connection/Connection'),
	WebSocketAdapterFactoryForNode = require('./../../lib/connection/adapter/WebSocketAdapterFactoryForNode');

(() => {
	'use strict';

	let connection = null;
	let adapterFactory = null;

	process.on('SIGINT', () => {
		if (connection !== null) {
			connection.disconnect();
		}

		process.exit();
	});

	process.on('unhandledRejection', (error) => {

	});

	process.on('uncaughtException', (error) => {

	});

	const host = process.argv[2];
	const username = process.argv[3];
	const password = process.argv[4];
	const symbols = process.argv[5];

	connection = new Connection();
	adapterFactory = new WebSocketAdapterFactoryForNode();

	connection.connect(host, username, password, adapterFactory);

	if (typeof symbols === 'string') {
		symbols.split(',').forEach((s) => {
			connection.getMarketState().getProfile(s)
				.then((p) => {
					const formatted = p.formatPrice(123.5);

					console.log(`The price of [ ${p.name} ] is [ ${formatted} ] because [ ${p.symbol} ] uses unit code [ ${p.unitCode} ]`);
				});

		});
	}
})();
