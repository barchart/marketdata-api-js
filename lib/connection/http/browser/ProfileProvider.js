var xhr = require('xhr');

var ProfileProviderBase = require('./../../ProfileProviderBase');

module.exports = function() {
    'use strict';

    return ProfileProviderBase.extend({
        init: function() {

        },

        _loadProfileData: function(symbols, callback) {
            var options = {
                url: 'proxies/instruments/?lookup=' + symbols.join(','),
                method: 'GET',
                json: true
            };

            xhr(options, function(error, response, body) {
                var instrumentData;

                if (error || response.statusCode !== 200) {
                    instrumentData = [ ];
                } else {
                    instrumentData = body.instruments;
                }

                callback(instrumentData);
            });
        },

        toString: function() {
            return '[ProfileProvider]';
        }
    });
}();