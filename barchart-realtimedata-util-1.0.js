/*!
 * barchart-realtimedata-1.0.0.js
 * Barchart Realtime Data JavaScript Library v1.0.0
 * http://www.barchart.com-barchart-realtimedata-1
 *
 * Copyright 2014 - 2015 Barchart.com, Inc.
 */
(function() {
    // The Barchart namespace
    if (!window.Barchart) window.Barchart = {};
    if (!window.Barchart.RealtimeData) window.Barchart.RealtimeData = {}
}());


// Class to format Barchart prices.
// @param fractionSeparator for display. Sometimes we use a dash (-), sometimes an apostrophe (')
// @param specialFractions TRUE if we want 32nsd and halves and 32nds and quarters for unit
// codes of 5, 6, and 7. Otherwise these would be 64ths and 128th.

Barchart.RealtimeData.Util = {
    MonthCodes : {
        "F" : "January",
        "G" : "February",
        "H" : "March",
        "J" : "April",
        "K" : "May",
        "M" : "June",
        "N" : "July",
        "Q" : "August",
        "U" : "September",
        "V" : "October",
        "X" : "November",
        "Z" : "December"
    },
    BaseCode2UnitCode : function(basecode) {
        switch(basecode) {
            case -1: return '2';
            case -2: return '3';
            case -3: return '4';
            case -4: return '5';
            case -5: return '6';
            case -6: return '7';
            case 0: return '8';
            case 1: return '9';
            case 2: return 'A';
            case 3: return 'B';
            case 4: return 'C';
            case 5: return 'D';
            case 6: return 'E';
            case 7: return 'F';
            default: return 0;
        }
    },
    DayCodeToNumber : function(dayCode) {
        var val1 = dayCode.charCodeAt(0);

        if ((val1 >= ("1").charCodeAt(0)) && (dayCode <= ("9").charCodeAt(0)))
            return (val1 - ("0").charCodeAt(0));
        else if (dayCode == ("0").charCodeAt(0))
            return 10;
        else
            return ((val1 - ("A").charCodeAt(0)) + 11);
    },
    DateToDayCode : function(date) {
        var d = date.getDate();

        if ((d >= 1) && (d <= 9))
            return String.fromCharCode(("1").charCodeAt(0) + d - 1);
        else if (d == 10)
            return '0';
        else
            return String.fromCharCode(("A").charCodeAt(0) + d - 11);
    },
    // Parses a symbol, and determines if it is a future,
    // equity, future option, index, etc.
    ParseSymbolType : function(symbol) {
        var re1 = /[0-9]$/;
        // If we end in a number, then we are a future
        if (re1.test(symbol)) {
            var re2 = /^(.{1,3})([A-Z])([0-9]{1,4})$/i;
            var ary = re2.exec(symbol);
            var year = parseInt(ary[3]);
            if (year < 10)
                year += 2010;
            else if (year < 100)
                year += 2000;

            return {
                type: 'future',
                symbol: ary[0],
                root: ary[1],
                month: ary[2],
                year: year
            }
        }

        return null;
    },
    TimeFormatter : function() {

        function format(t) {
            return [['00', t.getHours()].join('').substr(-2), ['00', t.getMinutes()].join('').substr(-2), ['00', t.getSeconds()].join('').substr(-2), ['000', t.getMilliseconds()].join('').substr(-3)].join(':');
        }

        return {
            format : format
        }
    },
    UnitCode2BaseCode : function(unitcode) {
        switch(unitcode) {
            case '2': return -1;
            case '3': return -2;
            case '4': return -3;
            case '5': return -4;
            case '6': return -5;
            case '7': return -6;
            case '8': return 0;
            case '9': return 1;
            case 'A': return 2;
            case 'B': return 3;
            case 'C': return 4;
            case 'D': return 5;
            case 'E': return 6;
            case 'F': return 7;
            default: return 0;
        }
    }
}

