/*!
 * barchart-realtimedata-historicaldata-1.0.js
 * Barchart Realtime Data JavaScript Library v1.0
 *
 * Copyright 2014 - 2015 Barchart.com, Inc.
 */
(function() {
    // The Barchart namespace
    if (!window.Barchart) window.Barchart = {};
    if (!window.Barchart.RealtimeData) window.Barchart.RealtimeData = {}
}());


Barchart.RealtimeData.HistoricalData = function() {
    var _url = 'proxies/historicaldata';

    function getHistoricalData(params, callback) {
        $.ajax({
            url : _url,
            dataType : 'jsonp',
            data : params
        }).done(function(json) {
            return callback(json);
        });
    }


    return {
        getHistoricalData : getHistoricalData
    }

}