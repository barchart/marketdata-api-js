const Express = require('express'),
	log4js = require('log4js'),
	http = require('http'),
	proxy = require('express-http-proxy');

const startup = (() => {
	"use strict";

	log4js.configure();

	const logger = log4js.getLogger('app');

	logger.info('Starting a proxy server for Barchart Historical Data.');
	logger.info('Initializing Express middleware.');

	const app = new Express();

	logger.info('Configuring Express to apply CORS headers to all requests.');

	app.use((req, res, next) => {
		logger.debug('Applying HTTP headers for ' + req.originalUrl);

		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		res.header('Access-Control-Allow-Methods', 'PUT,GET,POST,DELETE,OPTIONS');

		next();
	});

	logger.info('Configuring Express to proxy requests for historical data.');

	const getIsEodRequest = (query) => {
		const interval = query.interval || '';

		return interval === 'daily' || interval === 'weekly' || interval === 'monthly';
	};

	const fieldsForEod = [ 'symbol', 'time', 'open', 'high', 'low', 'close', 'volume' ];
	const fieldsForMinutes = [ 'time', 'trading_day', 'open', 'high', 'low', 'close', 'volume' ];

	app.use('/proxies/historicaldata', proxy('ds01.ddfplus.com', {
		proxyReqPathResolver: (req) => {
			const endpoint = getIsEodRequest(req.query) ? 'queryeod.ashx' : 'queryminutes.ashx';

			const username = req.query.username || '';
			const password = req.query.password || '';

			const symbol = req.query.symbol || '';
			const start = req.query.start || '';

			logger.debug('Sending proxied request to ds01.ddfplus.com');

			return `/historical/${endpoint}?username=${username}&password=${password}&symbol=${symbol}&format=csv&order=descending&start=${start}`;
		},
		userResDecorator: function(res, data, req) {
			const buffer = Buffer.from(data);
			const string = buffer.toString();

			const keys = getIsEodRequest(req.query) ? fieldsForEod : fieldsForMinutes;
			const records = [ ];

			buffer.toString().split('\n').forEach((data) => {
				const values = data.split(',');

				if (keys.length === values.length) {
					records.push(keys.reduce((item, key, index) => {
						item[key] = values[index];

						return item;
					}, { }));
				}
			});

			logger.debug('Translated results of proxy request to JSON format.');

			return JSON.stringify(records);
		}
	}));

	const server = http.createServer(app);

	server.listen(8080);

	logger.info('Starting started on port 8080.');
})();