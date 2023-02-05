module.exports = (() => {
    'use strict';

    /**
     * The abstract definition for an object that parses XML and
     * outputs a duck-typed XML document. It is unlikely that SDK
     * consumers will need to implement this class.
     *
     * @public
     * @exported
     * @abstract
     */
    class XmlParser {
        constructor() {

        }

        /**
         * Accepts a string and returns a (duck-typed) XML document.
         *
         * @public
         * @param {String} text
         * @returns {*}
         */
        parse(text) {
            if (typeof text !== 'string') {
                throw new Error('The "text" argument must be a string.');
            }

            return this._parse(text);
        }

        /**
         * @protected
         * @abstract
         * @param {String} text
         * @returns {*}
         */
        _parse(text) {
            return null;
        }

        toString() {
            return '[XmlParser]';
        }
    }

    return XmlParser;
})();