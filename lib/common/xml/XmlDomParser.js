var xmlDom = require('xmldom');
var XmlDomParserBase = require('./XmlDomParserBase');

module.exports = function() {
    'use strict';

    return XmlDomParserBase.extend({
        init: function(document) {
            this._xmlDomParser = new xmlDom.DOMParser();
        },

        _parse: function(textDocument) {
            return this._xmlDomParser.parseFromString(textDocument, 'text/xml');
        },

        toString: function() {
            return '[XmlDomParser]';
        }
    });
}();