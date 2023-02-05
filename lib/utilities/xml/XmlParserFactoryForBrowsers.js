const XmlParser = require('./XmlParser'),
    XmlParserFactory = require('./XmlParserFactory');

module.exports = (() => {
    'use strict';
    
    /**
     * An implementation of {@link XmlParserFactory} for use with web browsers. Pass
     * an instance of this class to the {@link Connection.connect} function when operating
     * in a web browser.
     *
     * @public
     * @extends {XmlParserFactory}
     * @exported
     */
    class XmlParserFactoryForBrowsers extends XmlParserFactory {
        constructor() {
            super();
        }

        /**
         * Returns a new {@link XmlParser} instance suitable for use
         * with a web browser.
         *
         * @public
         * @returns {XmlParser}
         */
        build() {
            return new XmlParserForBrowsers();
        }

        toString() {
            return '[XmlParserFactoryForBrowsers]';
        }
    }

    /**
     * The browser implementation of a {@link XmlParser} which uses the browser's
     * built-in [DOMParser](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser)
     * class.
     *
     * @private
     * @extends {XmlParser}
     */
    class XmlParserForBrowsers extends XmlParser {
        constructor() {
            super();

            this._parser = new DOMParser();
        }

        _parse(text) {
            return this._parser.parseFromString(text, 'text/xml');
        }

        toString() {
            return '[XmlParserForBrowsers]';
        }
    }

    return XmlParserFactoryForBrowsers;
})();