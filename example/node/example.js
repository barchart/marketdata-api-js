const process = require('process');

const version = require('./../../lib/meta').version;

const Connection = require('./../../lib/connection/Connection'),
	SubscriptionType = require('./../../lib/connection/SubscriptionType');

const EnvironmentForNode = require('./../../lib/environment/EnvironmentForNode');

const CustomLoggingProvider = require('./logging/CustomLoggingProvider');

const LoggerFactory = require('./../../lib/logging/LoggerFactory');

(() => {
	'use strict';
	
	//LoggerFactory.configureForConsole();
	//LoggerFactory.configureForSilence();

	LoggerFactory.configure(new CustomLoggingProvider());

	const __logger = LoggerFactory.getLogger('@barchart/example');

	__logger.log(`Example: Node.js example script started, SDK version [ ${version} ]`);

	let connection = null;

	process.on('SIGINT', () => {
		__logger.log('Example: Processing SIGINT');

		if (connection !== null) {
			connection.disconnect();
		}

		__logger.log('Example: Node.js example script ending');

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

	connection = new Connection(new EnvironmentForNode());

	connection.connect(host, username, password);

	if (typeof symbols === 'string') {
		symbols.split(',').forEach((s) => {
			let price = null;

			const handleMarketUpdate = (message) => {
				const current = connection.getMarketState().getQuote(s).lastPrice;

				if (price !== current) {
					price = current;

					__logger.log(`Example: ${s} = ${price}`);
				}
			};

			connection.on(SubscriptionType.MarketUpdate, handleMarketUpdate, s);
		});
	}
})();
