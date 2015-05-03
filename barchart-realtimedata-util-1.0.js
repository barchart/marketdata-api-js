/*!
 * barchart-realtimedata-1.0.0.js
 * Barchart Realtime Data JavaScript Library v1.0.0
 * http://www.barchart.com-barchart-realtimedata-1
 *
 * Copyright 2014 - 2015 Barchart.com, Inc.
 */
;(function() {
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
        if (symbol.substring(0, 3) == '_S_') {
            return {
                'type' : 'future_spread'
            };
        };

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
    PriceFormatter : function(fractionSeparator, specialFractions) {
        var format = undefined;

        function frontPad(value, digits) {
            return ['000', Math.floor(value)].join('').substr(-1 * digits);
        }


        if (fractionSeparator == '.') { // Decimals
            format = function(value, unitcode) {
                if (!value)
                    return '';

                switch (unitcode) {
                    case '2':
                        return value.toFixed(3);
                        break;
                    case '3':
                        return value.toFixed(4);
                        break;
                    case '4':
                        return value.toFixed(5);
                        break;
                    case '5':
                        return value.toFixed(6);
                        break;
                    case '6':
                        return value.toFixed(7);
                        break;
                    case '7':
                        return value.toFixed(8);
                        break;
                    case '8':
                        return value.toFixed(0);
                        break;
                    case '9':
                        return value.toFixed(1);
                        break;
                    case 'A':
                        return value.toFixed(2);
                        break;
                    case 'B':
                        return value.toFixed(3);
                        break;
                    case 'C':
                        return value.toFixed(4);
                        break;
                    case 'D':
                        return value.toFixed(5);
                        break;
                    case 'E':
                        return value.toFixed(6);
                        break;
                    default:
                        return value;
                        break;                
                }
            };  

        }
        else {
            format = function(value, unitcode) {
                if (!value)
                    return '';

                var sign = (value >= 0) ? '' : '-';
                value = Math.abs(value);

                switch (unitcode) {
                    case '2':
                        return [sign, Math.floor(value), fractionSeparator, frontPad((value - Math.floor(value)) * 8, 1)].join('');
                        break;
                    case '3':
                        return [sign, Math.floor(value), fractionSeparator, frontPad((value - Math.floor(value)) * 16, 2)].join('');
                        break;
                    case '4':
                        return [sign, Math.floor(value), fractionSeparator, frontPad((value - Math.floor(value)) * 32, 2)].join('');
                        break;
                    case '5':
                        return [sign, Math.floor(value), fractionSeparator, frontPad((value - Math.floor(value)) * (specialFractions ? 320 : 64), (specialFractions ? 3 : 2))].join('');
                        break;
                    case '6':
                        return [sign, Math.floor(value), fractionSeparator, frontPad((value - Math.floor(value)) * (specialFractions ? 320 : 128), 3)].join('');
                        break;
                    case '7':
                        return [sign, Math.floor(value), fractionSeparator, frontPad((value - Math.floor(value)) * (specialFractions ? 320 : 256), 3)].join('');
                        break;
                    case '8':
                        return sign + value.toFixed(0);
                        break;
                    case '9':
                        return sign + value.toFixed(1);
                        break;
                    case 'A':
                        return sign + value.toFixed(2);
                        break;
                    case 'B':
                        return sign + value.toFixed(3);
                        break;
                    case 'C':
                        return sign + value.toFixed(4);
                        break;
                    case 'D':
                        return sign + value.toFixed(5);
                        break;
                    case 'E':
                        return sign + value.toFixed(6);
                        break;
                    default:
                        return sign + value;
                        break;                
                }
            };
        }

        return {
            format : format
        }  
    },
    TimeFormatter : function() {

        function format(t) {
            if(t.time && t.flag){
                return (t.time.getMonth() +1 ) + '/' + t.time.getDay() + '/' + t.time.getYear();
            }else{
                if(t.time) t = t.time;
                return [['00', t.getHours()].join('').substr(-2), ['00', t.getMinutes()].join('').substr(-2), ['00', t.getSeconds()].join('').substr(-2), ['000', t.getMilliseconds()].join('').substr(-3)].join(':');
            }
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
};

