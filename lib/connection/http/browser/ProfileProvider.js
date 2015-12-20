var ProfileProviderBase = require('./../../ProfileProviderBase');

var jQueryProvider = require('./../../../common/jQuery/jQueryProvider');

module.exports = function() {
    'use strict';

    var $ = jQueryProvider.getInstance();

    return ProfileProviderBase.extend({
        init: function() {

        },

        _loadProfileData: function(symbols, callback) {
            $.ajax({
                url: 'proxies/instruments/?lookup=' + symbols.join(','),
            }).done(function(json) {
                var instrumentData = [ ];

                if (json.status === 200) {
                    instrumentData = json.instruments;
                } else {
                    instrumentData = [ ];
                }

                callback(instrumentData);
            });
        },

        toString: function() {
            return '[ProfileProvider]';
        }
    });
}();