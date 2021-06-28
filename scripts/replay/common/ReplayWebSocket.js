const uuid = require('uuid'),
    WebSocket = require('ws');

const array = require('@barchart/common-js/lang/array'),
    Disposable = require('@barchart/common-js/lang/Disposable');

module.exports = (() => {
    'use strict';

    class ReplayWebSocket extends Disposable {
        constructor(port, messageHandler) {
            super();

            this._port = port;
            this._messageHandler = messageHandler;

            this._wss = null;
            this._clients = [ ];

            this._started = false;
            this._maxConnections = 1;
        }

        start(options) {
            if (this.getIsDisposed()) {
                throw new Error('The Market Data Replay Server has been disposed.');
            }

            if (this._started) {
                throw new Error('The Market Data Replay Server has been already started.');
            }

            this._started = true;

            const o = Object.assign({ port: this._port }, options);

            o.verifyClient = (ignore, done) => {
                if (this._clients.length >= this._maxConnections) {
                    done(false, 401, `Market Data Replay Server only supports [ ${this._maxConnections} ] client(s).`);
                } else {
                    done(true);
                }
            };

            this._wss = new WebSocket.Server(o);

            this._wss.on('connection', (ws) => {
                const id = uuid.v4();

                ws.on('close', () => {
                    const removed = array.remove(this._clients, c => c.id === id);

                    if (removed) {
                        console.log(`Client disconnected [ ${ id } ]`);
                    }
                });

                ws.on('message', (message) => {
                    this._messageHandler(ws, message);
                });

                this._clients.push({ id: id, ws: ws });

                console.log(`Client connected [ ${ id } ]`);

                ws.send(Buffer.from('+++', 'utf-8'));
                ws.send(Buffer.from('+ success', 'utf-8'));
            });

            console.log(`The Market Data Replay Server is now running on port ${o.port}`);
        }

        _onDispose() {
            if (this._wss !== null) {
                this._wss.close();
                this._wss = null;
            }
        }
    }

    return ReplayWebSocket;
})();
