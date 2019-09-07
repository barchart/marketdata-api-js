const xmlDom = require('xmldom');

module.exports = (() => {
    'use strict';

	/**
	 * Utility for parsing XML.
	 *
	 * @public
	 */
	class XmlDomParser  {
        constructor() {
			this._xmlDomParser = new xmlDom.DOMParser();
        }

		/**
		 * Parses an XML document.
		 *
		 * @public
		 * @param {String} textDocument
		 * @returns {Object}
		 */
		parse(textDocument) {
			if (typeof textDocument !== 'string') {
				throw new Error('The "textDocument" argument must be a string.');
			}

			return this._xmlDomParser.parseFromString(textDocument, 'text/xml');
		}

        toString() {
            return '[XmlDomParser]';
        }
    }

    return XmlDomParser;
})();