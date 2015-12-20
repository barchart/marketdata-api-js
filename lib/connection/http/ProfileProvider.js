var ProfileProviderBase = require('./../ProfileProviderBase');

module.exports = function() {
    'use strict';

    return ProfileProviderBase.extend({
        init: function() {

        },

        _loadProfileData: function(symbols, callback) {
            throw new Error(this.toString() + '.loadProfileData has not been implemented.');
        },

        toString: function() {
            return '[ProfileProvider]';
        }
    });
}();