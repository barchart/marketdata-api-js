var ProfileProviderBase = require('./../../ProfileProviderBase');

var jQueryProvider = require('./../../../common/jQuery/jQueryProvider');

module.exports = function() {
    'use strict';

    var $ = jQueryProvider.getInstance();

    console.log('Invoked jQueryProvider.getInstance');
    console.log($);

    return ProfileProviderBase.extend({
        init: function() {

        },

        _loadProfileData: function(symbols, callback) {
            console.log('ProfileProvider.loadProfileData invoked.');
            console.log($);
            console.log($.ajax);

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