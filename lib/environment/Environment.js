const assert = require('@barchart/common-js/lang/assert');

const WebSocketAdapterFactory = require('./../connection/adapter/WebSocketAdapterFactory'),
    XmlParserFactory = require('./../utilities/xml/XmlParserFactory');

module.exports = (() => {
    'use strict';

    /**
     * A container of operational strategies for used internally by the
     * SDK (e.g. XML parsing, WebSocket connections, and HTTP requests).
     *
     * The primary purpose of this container is to provide different
     * strategies when in running different environments (e.g. web browser
     * or Node.js).
     *
     * @public
     * @exported
     * @param {WebSocketAdapterFactory} webSocketAdapterFactory
     * @param {XmlParserFactory} xmlParserFactory
     */
    class Environment {
        constructor(webSocketAdapterFactory, xmlParserFactory) {
            assert.argumentIsRequired(webSocketAdapterFactory, 'webSocketAdapterFactory', WebSocketAdapterFactory, 'WebSocketAdapterFactory');
            assert.argumentIsRequired(xmlParserFactory, 'xmlParserFactory', XmlParserFactory, 'XmlParserFactory');

            this._webSocketAdapterFactory = webSocketAdapterFactory;
            this._xmlParserFactory = xmlParserFactory;
        }

        getWebSocketAdapterFactory() {
            return this._webSocketAdapterFactory;
        }

        getXmlParserFactory() {
            return this._xmlParserFactory;
        }

        toString() {
            return '[Environment]';
        }
    }

    return Environment;
})();