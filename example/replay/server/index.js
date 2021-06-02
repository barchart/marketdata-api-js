const is = require('@barchart/common-js/lang/is');

const FileReader = require('./common/FileReader'),
    WebSocketServer = require('./common/WebSocketServer');

module.exports = (() => {
    'use strict';

    const server = new WebSocketServer();
    server.start();

    let reader = null;
    let interval = null;

    server.onMessage((ws, message) => {
        console.log(`Message received: [ ${message} ]`);

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
                    reader = FileReader.for(`./data/${filename}`);
                } catch (error) {
                    console.log(`Unable to load file [ ./data/${filename} ]`);
                }

                break;
            }
            case 'NEXT': {
                console.log(`Command [ ${type} ]`);

                if (reader === null) {
                    return;
                }

                const data = reader.next();

                data.lines.forEach((line) => {
                    ws.send(toBuffer(line));
                });

                break;
            }
            case 'SCROLL': {
                if (reader === null) {
                    return;
                }

                const to = parseInt(matches[2]);

                if (is.nan(to) || !is.integer(to)) {
                    return;
                }

                console.log(`Command [ ${type} ], operand [ ${to} ]`);

                const data = reader.scroll(to);

                data.lines.forEach((line) => {
                    ws.send(toBuffer(line));
                });

                break;
            }
            case 'GO': {
                const operand = matches[2];

                console.log(`Command [ ${type} ], operand [ ${operand} ]`);

                if (operand === '_TIMESTAMP_') {
                    clearInterval(interval);

                    interval = setInterval(() => {
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
    });

    const toBuffer = (data) => {
        return Buffer.from(data, 'utf-8');
    };
})();