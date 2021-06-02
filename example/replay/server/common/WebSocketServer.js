const uuid = require('uuid'),
    WebSocket = require('ws');

const array = require('@barchart/common-js/lang/array'),
    is = require('@barchart/common-js/lang/is');

module.exports = (() => {
    'use strict';

    class WebSocketServer {
        constructor() {
            this._wss = null;
            this._clients = [ ];

            this._disposed = false;
            this._started = false;

            this._onMessage = null;
            this._maxConnections = 1;
        }

        start(opts) {
            if (this._disposed) {
                throw new Error('Server has been disposed.');
            }

            if (this._started) {
                throw new Error('The server has been already started.');
            }

            const options = Object.assign({ port: 8000 }, opts);

            options.verifyClient = (ignore, done) => {
                if (this._clients.length >= this._maxConnections) {
                    done(false, 401, `Server supports only [ ${this._maxConnections} ] connected client(s).`);
                } else {
                    done(true);
                }
            };

            this._wss = new WebSocket.Server(options);
            this._started = true;

            console.log(`Server started on port: ${options.port}`);

            onConnection.call(this);
        }

        onMessage(callback) {
            checkReady.call(this);

            this._onMessage = callback;
        }

        dispose() {
            checkReady.call(this);

            this._disposed = true;

            if (this._wss !== null && this._started) {
                this._wss.close();
                this._wss = null;

                this._started = false;
            } else {
                throw new Error('Unable to dispose, the server hasn\'t been started.');
            }
        }
    }

    function onConnection() {
        checkReady.call(this);

        this._wss.on('connection', (ws) => {
            const id = uuid.v4();

            ws.on('close', () => {
                const removed = array.remove(this._clients, c => c.id === id);

                if (removed) {
                    console.log(`Client disconnected [ ${ id } ]`);
                }
            });

            ws.on('message', (message) => {
                if (this._onMessage !== null) {
                    this._onMessage(ws, message);
                }
            });

            this._clients.push({ id: id, ws: ws });

            console.log(`Client connected [ ${ id } ]`);

            ws.send(Buffer.from('+++', 'utf-8'));
            ws.send(Buffer.from('+ success', 'utf-8'));
        });
    }

    function checkReady() {
        if (!this._started) {
            throw new Error('Server hasn\'t been started.');
        }

        if (this._disposed) {
            throw new Error('Server has been disposed.');
        }
    }

    return WebSocketServer;
})();
