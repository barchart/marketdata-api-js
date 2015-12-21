module.exports = function() {
    'use strict';

    console.log('jQueryProvider exporting.');

    var provider = {
        getInstance: function() {
            console.log('jQueryProvider.getInstance called.');

            var instance = window.$ || window.jQuery || window.jquery;

            if (!instance) {
                throw new Error('jQuery is required for the browser-based version of Barchart utilities.');
            }

            provider.getInstance = function() {
                return instance;
            };
        }
    };

    return provider;
}();