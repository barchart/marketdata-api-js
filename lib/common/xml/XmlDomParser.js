const xmlDom = require('xmldom');

module.exports = (() => {
    'use strict';

    class XmlDomParser  {
        constructor() {
			this._xmlDomParser = new xmlDom.DOMParser();
        }

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