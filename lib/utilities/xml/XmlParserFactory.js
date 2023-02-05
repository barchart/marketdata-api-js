module.exports = (() => {
    'use strict';

    /**
     * An abstract definition for an factory that builds {@link XmlParser}
     * instances. It is unlikely that SDK consumers will need to implement
     * this class.
     *
     * @public
     * @exported
     * @abstract
     */
    class XmlParserFactory {
        constructor() {

        }

        /**
         * Returns a new {@link XmlParser} instance.
         *
         * @public
         * @abstract
         * @returns {XmlParser}
         */
        build() {
            return null;
        }

        toString() {
            return '[XmlParserFactory]';
        }
    }

    return XmlParserFactory;
})();