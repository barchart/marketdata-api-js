const Environment = require('./Environment');

const WebSocketAdapterFactoryForBrowsers = require('./../connection/adapter/WebSocketAdapterFactoryForBrowsers'),
    XmlParserFactoryForBrowsers = require('./../utilities/xml/XmlParserFactoryForBrowsers');

module.exports = (() => {
    'use strict';

    const webSocketAdapterFactory = new WebSocketAdapterFactoryForBrowsers();
    const xmlParserFactory = new XmlParserFactoryForBrowsers();

    /**
     * A container for strategies used in a web browser environment. These
     * strategies include WebSocket connections and XML parsing using the
     * browser's built-in capabilities.
     *
     * @public
     * @exported
     * @extends {Environment}
     */
    class EnvironmentForBrowsers extends Environment {
        constructor() {
            super(webSocketAdapterFactory, xmlParserFactory);
        }

        toString() {
            return '[Environment]';
        }
    }

    return EnvironmentForBrowsers;
})();