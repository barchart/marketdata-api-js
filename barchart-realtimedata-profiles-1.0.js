/*!
 * barchart-realtimedata-profiles-1.0.js
 * Barchart Realtime Data JavaScript Library v1.0
 * http://www.barchart.com-barchart-realtimedata-1
 *
 * Copyright 2014 - 2015 Barchart.com, Inc.
 */
(function() {
    // The Barchart namespace
    if (!window.Barchart) window.Barchart = {};
    if (!window.Barchart.RealtimeData) window.Barchart.RealtimeData = {}
}());


/*
 * Profiles is a small database that holds the profile
 * information for instruments. Uses a proxy passthru to the
 * instruments lookup on extras.ddfplus.com
 */

Barchart.RealtimeData.Profiles = function() {
    var _profiles = {};

    function getProfile(symbol) {
        return _profiles[symbol];
    };

    function getProfiles(symbols, callback) {
        $.ajax({
            url: 'proxies/instruments/?lookup=' + symbols.join(','), 
        }).done(function(json) {
            if (json.status == 200) {
                for (var i = 0; i < json.instruments.length; i++) {
                    _profiles[json.instruments[i].lookup] = json.instruments[i];
                }
            }
            callback();
        });
    };

    return {
        getProfile : getProfile,
        getProfiles : getProfiles
    }
}
