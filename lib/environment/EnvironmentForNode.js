const Environment = require('./Environment');

const WebSocketAdapterFactoryForNode = require('./../connection/adapter/WebSocketAdapterFactoryForNode'),
    XmlParserFactoryForNode = require('./../utilities/xml/XmlParserFactoryForNode');

module.exports = (() => {
    'use strict';

    const webSocketAdapterFactory = new WebSocketAdapterFactoryForNode();
    const xmlParserFactory = new XmlParserFactoryForNode();

    /**
     * A container for strategies used when running in a Node.js environment.
     * These strategies use third-party libraries for WebSocket connections
     * and XML parsing (which are not included natively in Node.js).
     *
     * @public
     * @exported
     * @extends {Environment}
     */
    class EnvironmentForNode extends Environment {
        constructor() {
            super(webSocketAdapterFactory, xmlParserFactory);
        }

        toString() {
            return '[Environment]';
        }
    }

    return EnvironmentForNode;
})();