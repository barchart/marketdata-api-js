const is = require('@barchart/common-js/lang/is');

const ReplayFileReader = require('./common/ReplayFileReader'),
	ReplayWebSocket = require('./common/ReplayWebSocket');

module.exports = (() => {
	'use strict';

	let fileReader = null;
	let heartbeatInterval = null;

	function toBuffer(data) {
		return Buffer.from(data, 'ascii');
	}

	const handleWebSocketMessage = (ws, message) => {
		console.log(`Message received: [ ${message.replace('\r\n', '')} ]`);

		const matches = /(.[^\s]*)(?:$|[\s|$](.*))/gm.exec(message);

		if (!is.array(matches) || matches.length < 2) {
			return;
		}

		const type = matches[1];

		switch (type) {
			case 'LOAD': {
				const filename = matches[2] || null;

				console.log(`Command [ ${type} ], operand [ ${filename} ]`);

				try {
					fileReader = ReplayFileReader.for(`./logs/${filename}`);
				} catch (e) {
					console.log(`Unable to load file [ ./logs/${filename} ]`, e);
				}

				break;
			}
			case 'NEXT': {
				console.log(`Command [ ${type} ]`);

				if (fileReader === null) {
					return;
				}

				const data = fileReader.next();

				data.lines.forEach((line) => {
					ws.send(toBuffer(`${line}${(line.startsWith('%') ? '\n' : '')}`));
				});

				break;
			}
			case 'SCROLL': {
				if (fileReader === null) {
					return;
				}

				const to = parseInt(matches[2]);

				if (is.nan(to) || !is.integer(to)) {
					return;
				}

				console.log(`Command [ ${type} ], operand [ ${to} ]`);

				const data = fileReader.scroll(to);

				data.lines.forEach((line) => {
					ws.send(toBuffer(line));
				});

				break;
			}
			case 'GO': {
				const operand = matches[2];

				console.log(`Command [ ${type} ], operand [ ${operand} ]`);

				if (operand === '_TIMESTAMP_') {
					if (heartbeatInterval !== null) {
						clearInterval(heartbeatInterval);
					}

					heartbeatInterval = setInterval(() => {
						/* jshint -W113 */
						ws.send(toBuffer('#20210601134557'));
						/* jshint +W106 */
					}, 3000);
				}

				break;
			}
			default: {
				break;
			}
		}
	};

	const server = new ReplayWebSocket(8080, handleWebSocketMessage);
	server.start();
})();