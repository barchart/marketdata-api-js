const xmlDom = require('@xmldom/xmldom');

const XmlParser = require('./XmlParser'),
    XmlParserFactory = require('./XmlParserFactory');

module.exports = (() => {
    'use strict';

    /**
     * An implementation of {@link XmlParserFactory} for use by Node.js servers. Pass
     * an instance of this class to the {@link Connection.connect} function when
     * operating in Node.js.
     *
     * @public
     * @extends {XmlParserFactory}
     * @exported
     */
    class XmlParserFactoryForNode extends XmlParserFactory {
        constructor() {
            super();
        }

        /**
         * Returns a new {@link XmlParser} instance suitable for use
         * within a Node.js environment.
         *
         * @public
         * @returns {XmlParser}
         */
        build() {
            return new XmlParserForNode();
        }

        toString() {
            return '[XmlParserFactoryForNode]';
        }
    }

    /**
     * The implementation of a {@link XmlParser} suitable for use in Node.js
     * environments.
     *
     * @private
     * @extends {XmlParser}
     */
    class XmlParserForNode extends XmlParser {
        constructor() {
            super();

            this._parser = new xmlDom.DOMParser();
        }

        _parse(text) {
            return this._parser.parseFromString(text, 'text/xml');
        }

        toString() {
            return '[XmlParserForNode]';
        }
    }

    return XmlParserFactoryForNode;
})();