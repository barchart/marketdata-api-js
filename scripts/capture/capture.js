const fs = require('fs'),
	process = require('process');

const version = require('./../../lib/meta').version;

const Connection = require('./../../lib/connection/Connection'),
	SubscriptionType = require('./../../lib/connection/SubscriptionType'),
	WebSocketAdapterFactoryForNode = require('./../../lib/connection/adapter/WebSocketAdapterFactoryForNode');

const LoggerFactory = require('./../../lib/logging/LoggerFactory');

(() => {
	'use strict';

	LoggerFactory.configureForConsole();

	const __logger = LoggerFactory.getLogger('@barchart/example');

	__logger.log(`Example: Node.js capture script started, SDK version [ ${version} ]`);

	let connection = null;
	let adapterFactory = null;

	process.on('SIGINT', () => {
		__logger.log('Example: Processing SIGINT');

		if (connection !== null) {
			connection.disconnect();
		}

		__logger.log('Example: Node.js capture script ending');

		process.exit();
	});

	process.on('unhandledRejection', (error) => {
		__logger.error('Unhandled Promise Rejection', error);
		__logger.trace();
	});

	process.on('uncaughtException', (error) => {
		__logger.error('Unhandled Error', error);
		__logger.trace();
	});

	const host = process.argv[2];
	const username = process.argv[3];
	const password = process.argv[4];
	const symbols = process.argv[5];

	__logger.log(`Example: Instantiating Connection (using Node.js adapter) for [ ${username}/${password} ] @ [ ${host} ]`);

	connection = new Connection();
	adapterFactory = new WebSocketAdapterFactoryForNode();

	connection.connect(host, username, password, adapterFactory);

	const filename = `./logs/${(new Date().getTime().toString())}.ddf`;

	if (typeof symbols === 'string') {
		symbols.split(',').forEach((s) => {
			const handleMarketUpdate = (data) => {
				let m;

				if (data.message.startsWith('%')) {
					m = `${data.message}\n`;
				} else {
					m = data.message;
				}

				fs.appendFileSync(filename, m, { encoding: 'ascii' });
			};

			connection.on(SubscriptionType.MarketUpdate, handleMarketUpdate, s);
		});
	}
})();
