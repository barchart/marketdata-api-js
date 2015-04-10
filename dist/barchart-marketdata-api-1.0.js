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


/*!
 * barchart-realtimedata-connection-1.0.js
 * Barchart Realtime Data JavaScript Library v1.0
 *
 * Copyright 2014 - 2015 Barchart.com, Inc.
 */
;(function() {
    // The Barchart namespace
    if (!window.Barchart) window.Barchart = {};
    if (!window.Barchart.RealtimeData) window.Barchart.RealtimeData = {}
}());

/*
 * The main Connection object
 */

Barchart.RealtimeData.Connection = function() {
    /* Constants */
    _API_VERSION = 4;

    var __state = 'DISCONNECTED';
    var __symbols = {};
    var __tasks = {
        "symbols" : [],
        "symbols_off" : []
    };

    var __commands = [];
    var __connection = null;
    var __feedMessages = [];
    var __marketState = new Barchart.RealtimeData.MarketState();
    var __networkMessages = [];
    var __listeners = {
    	events : [],
        marketDepth : {},
        marketUpdate : {},
        timestamp : []
    }
    var __loginInfo = {
        "username" : null,
        "password" : null,
        "server" : null
    }





    function broadcastEvent(eventId, message) {
        var ary;
        switch (eventId) {
            case 'events':
                ary = __listeners.events;
                break;
            case 'marketDepth':
                ary = __listeners.marketDepth[message.symbol];
                break;
            case 'marketUpdate':
                ary = __listeners.marketUpdate[message.symbol];
                break;
            case 'timestamp':
                ary = __listeners.timestamp;
                break;
        }

        if (!ary)
            return;

        for (var i = 0; i < ary.length; i++) {
            ary[i](message);
        }
    }


    function connect(server, username, password) {
        if (__connection)
            return;

        __loginInfo.username = username;
        __loginInfo.password = password;
        __loginInfo.server = server;


        if (window["WebSocket"]) {
            __state = 'DISCONNECTED';
            __connection = new WebSocket("wss://" + __loginInfo.server + "/jerq");

            __connection.onclose = function(evt) {
                console.warn(new Date() + ' connection closed.');
                __connection = null;

                if (__state != 'LOGGED_IN')
                    return;

                __state = 'DISCONNECTED';

                broadcastEvent('events', { event: 'disconnect' });
                setTimeout(function() {
                    // Retry the connection
                    // Possible there are some timing issues. Theoretically, is a user is
                    // adding a symbol at the exact same time that this triggers, the new symbol
                    // coould go unheeded, or *just* the new symbol, and the old symbols
                    // would be ignored.
                    __connection = null;
                    connect(__loginInfo.server, __loginInfo.username, __loginInfo.password);
                    if (__tasks.symbols.length == 0) {
                        for (var k in __symbols) {
                            __tasks.symbols.push(k);
                        }
                    }
                }, 5000);
            };

            __connection.onmessage = function(evt) {
                __networkMessages.push(evt.data);
            };

            __connection.onopen = function(evt) {
                console.log(new Date() + ' connection open.')
            };
        }
        else {
            console.warn('Websockets are not supported by this browser. Invoking refreshing quotes.');
            setTimeout(refreshQuotes, 1000);
        }
    }


    function disconnect() {        
        __state = 'DISCONNECTED';

        if (__connection != null) {
            __connection.send("LOGOUT\r\n");
            __connection.close();
            __connection = null;
        }

        __commands = [];
        __messages = [];
        __symbols = {};
    }


    function handleNetworkMessage(msg) {
        if (__state == 'DISCONNECTED')
            __state = 'CONNECTING';

        if (__state == 'CONNECTING') {
            var lines = msg.split("\n");
            for (var i = 0; i < lines.length; i++) {
                if (lines[i] == '+++') {
                    __state = 'LOGGING_IN';
                    __commands.push('LOGIN ' + __loginInfo.username + ':' + __loginInfo.password + " VERSION=" + _API_VERSION + "\r\n");
                    return;
                }
            }
        }

        if (__state == 'LOGGING_IN') {
            if (msg.substr(0, 1) == '+') {
                __state = 'LOGGED_IN';
                broadcastEvent('events', { event : 'login success'} );
            }
            else if (msg.substr(0, 1) == '-') {
                disconnect();
                __state = 'LOGIN_FAILED';
                broadcastEvent('events', { event : 'login fail'} );
            }
        }

        if (__state == 'LOGGED_IN') {
            __feedMessages.push(msg);
        }
    }


    function getMarketState() {
        return __marketState;
    }


    function getPassword() {
        return __loginInfo.password;
    }


    function getUsername() {
        return __loginInfo.username;
    }


    function off() {
        if (arguments.length < 2)
            throw new Error("Bad number of arguments. Must pass in an evnetId and handler.");

        var eventId = arguments[0];
        var handler = arguments[1];

        switch (eventId) {
            case 'events': {
                for (var i = 0; i < __listeners.events.length; i++) {
                    if (__listeners.events[i] == handler) {
                        __listeners.events.splice(i, 1);
                    }
                }

                break;
            }
            case 'marketDepth': {
                if (arguments.length < 3)
                    throw new Error("Bad number of arguments. For marketUpdate events, please specify a symbol. on('marketUpdate', handler, symbol).");

                var symbol = arguments[2];

                if (!__listeners.marketDepth[symbol])
                    return;

                for (var i = 0; i < __listeners.marketDepth[symbol].length; i++) {
                    if (__listeners.marketDepth[symbol][i] == handler) {
                        __listeners.marketDepth[symbol].splice(i, 1);
                    }
                }

                break;
            }
            case 'marketUpdate': {
                if (arguments.length < 3)
                    throw new Error("Bad number of arguments. For marketUpdate events, please specify a symbol. on('marketUpdate', handler, symbol).");

                var symbol = arguments[2];

                if (!__listeners.marketUpdate[symbol])
                    return;

                for (var i = 0; i < __listeners.marketUpdate[symbol].length; i++) {
                    if (__listeners.marketUpdate[symbol][i] == handler)
                        __listeners.marketUpdate[symbol].splice(i, 1);        
                }

                break;
            }


        }
    }


    function on() {
        if (arguments.length < 2)
            throw new Error("Bad number of arguments. Must pass in an evnetId and handler.");

        var eventId = arguments[0];
        var handler = arguments[1];

        switch (eventId) {
            case 'events': {
                var add = true;
                for (var i = 0; i < __listeners.events.length; i++) {
                    if (__listeners.events[i] == handler)
                        add = false;                
                }

                if (add)
                    __listeners.events.push(handler);                    
                break;
            }
            case 'marketDepth': {
                if (arguments.length < 3)
                    throw new Error("Bad number of arguments. For marketUpdate events, please specify a symbol. on('marketUpdate', handler, symbol).");

                var symbol = arguments[2];

                if (!__listeners.marketDepth[symbol])
                    __listeners.marketDepth[symbol] = [];

                var add = true;
                for (var i = 0; i < __listeners.marketDepth[symbol].length; i++) {
                    if (__listeners.marketDepth[symbol][i] == handler)
                        add = false;                
                }

                if (add)
                    __listeners.marketDepth[symbol].push(handler);

                var bk = getMarketState().getBook(symbol);
                if (bk)
                    handler({ type: 'INIT', symbol: symbol });
                break;
            }
            case 'marketUpdate': {
                if (arguments.length < 3)
                    throw new Error("Bad number of arguments. For marketUpdate events, please specify a symbol. on('marketUpdate', handler, symbol).");

                var symbol = arguments[2];

                if (!__listeners.marketUpdate[symbol])
                    __listeners.marketUpdate[symbol] = [];

                var add = true;
                for (var i = 0; i < __listeners.marketUpdate[symbol].length; i++) {
                    if (__listeners.marketUpdate[symbol][i] == handler)
                        add = false;                
                }

                if (add)
                    __listeners.marketUpdate[symbol].push(handler);

                var q = getMarketState().getQuote(symbol);
                if (q)
                    handler({ type: 'INIT', symbol: symbol });
                break;
            }
            case 'timestamp': {
                var add = true;
                for (var i = 0; i < __listeners.timestamp.length; i++) {
                    if (__listeners.timestamp[i] == handler)
                        add = false;                
                }

                if (add)
                    __listeners.timestamp.push(handler);                    
                break;
            }
        }
    }


    function onNewMessage(msg) {
        var message;
        try {
            message = Barchart.RealtimeData.MessageParser.Parse(msg);
            if (message.type) {
                __marketState.processMessage(message);

                switch (message.type) {
                    case 'BOOK':
                        broadcastEvent('marketDepth', message);
                        break;
                    case 'TIMESTAMP':
                        broadcastEvent('timestamp', __marketState.getTimestamp());
                        break;
                    default:
                        broadcastEvent('marketUpdate', message);
                        break;
                }
            }
            else
                console.log(msg);
        }
        catch (e) {
            console.error(e);
            console.log(message);
            console.trace();
        }
    }


    function processCommands() {
        var cmd = __commands.shift();
        while (cmd) {
            __connection.send(cmd);
            cmd = __commands.shift();
        }
        setTimeout(processCommands, 200);
    }


    function processFeedMessages() {
        var done = false;
        var suffixLength = 9;

        while (!done) {
            var s = __feedMessages.shift();
            if (!s)
                done = true;
            else {
                var skip = false;

                var msgType = 1; // Assume DDF message containing \x03

                var idx = -1;
                var idxETX = s.indexOf('\x03');
                var idxNL = s.indexOf('\x0A');

                if ((idxNL > -1) && ((idxETX < 0) || (idxNL < idxETX))) {
                    idx = idxNL;
                    msgType = 2;
                }
                else if (idxETX > -1)
                    idx = idxETX;


                if (idx > -1) {
                    var epos = idx + 1;
                    if (msgType == 1) {
                        if (s.length < idx + suffixLength + 1) {
                            if (__feedMessages.length > 0)
                                __feedMessages[0] = s + __feedMessages[0];
                            else {
                                __feedMessages.unshift(s);
                                done = true;
                            }

                            skip = true;
                        }
                        else if (s.substr(idx + 1, 1) == '\x14')
                            epos += suffixLength + 1;
                    }

                    if (!skip) {
                        var s2 = s.substring(0, epos);
                        if (msgType == 2)
                            s2 = s2.trim();
                        else {
                            idx = s2.indexOf('\x01');
                            if (idx > 0)
                                s2 = s2.substring(idx);
                        }

                        if (s2.length > 0)
                            onNewMessage(s2);

                        s = s.substring(epos);
                        if (s.length > 0) {
                            if (__feedMessages.length > 0)
                                __feedMessages[0] = s + __feedMessages[0];
                            else
                                __feedMessages.unshift(s);
                        }
                    }
                }
                else {
                    if (s.length > 0) {
                        if (__feedMessages.length > 0)
                            __feedMessages[0] = s + __feedMessages[0];
                        else {
                            __feedMessages.unshift(s);
                            done = true;
                        }
                    }
                }
            }

            if (__feedMessages.length == 0)
                done = true;
        }

        setTimeout(processFeedMessages, 125);
    }


    function pumpMessages() {
        var msg = __networkMessages.shift();
        while (msg) {
            if (msg)
                handleNetworkMessage(msg);

            msg = __networkMessages.shift();
        }

        setTimeout(pumpMessages, 125);
    }


    function pumpTasks() {
        if (__state == 'LOGGED_IN') {
            if (__tasks['symbols'].length > 0) {
                var ary = __tasks['symbols'];
                __tasks['symbols'] = [];
                var s = "GO ";
                for (var i = 0; i < ary.length; i++) {
                    if (i > 0)
                        s += ',';
                    s += ary[i] + '=SsBbV';
                }

                __commands.push(s);
            }
        }

        if (__tasks['symbols_off'].length > 0) {
            var ary = __tasks['symbols_off'];
            __tasks['symbols_off'] = [];
            var s = "STOP ";
            for (var i = 0; i < ary.length; i++) {
                if (i > 0)
                    s += ',';
                s += ary[i];
            }

            __commands.push(s);
        }

        setTimeout(pumpTasks, 200);
    }


    function refreshQuotes() {
        var symbols = [];
        for (var k in __symbols) {
            symbols.push(k);
        }

        $.ajax({
            url: 'quotes.php?username=' + __loginInfo.username + '&password=' + __loginInfo.password + '&symbols=' + symbols.join(','), 
        }).done(function(xml) {
            $(xml).find('QUOTE').each(function() {
                onNewMessage('%' + this.outerHTML);
            });
        });
        setTimeout(refreshQuotes, 5000);
    }


    function requestSymbols(symbols) {
        for (var i = 0; i < symbols.length; i++) {
            var s = symbols[i];
            if (typeof(symbols[i]) != 'string')
                s = s.symbol;

            if (!__symbols[s]) {
                __tasks["symbols"].push(s);
                __symbols[s] = true;
            }
        }
    }

    function unRequestSymbols (symbols) {
        for (var i = 0; i < symbols.length; i++) {
            if (__symbols[symbols[i]]) {
                __tasks['symbols_off'].push(symbols[i]);
                __symbols[symbols[i]] = false;
            }
        }
    }

    setTimeout(processCommands, 200);
    setTimeout(pumpMessages, 125);
    setTimeout(pumpTasks, 200);
    setTimeout(processFeedMessages, 125);


    return {
        connect : connect,
        disconnect : disconnect,
        getMarketState : getMarketState,
        getPassword : getPassword,
        getUsername : getUsername,
        off: off,
        on : on,
        requestSymbols : requestSymbols,
        unRequestSymbols : unRequestSymbols
    }
}

/*!
 * barchart-realtimedata-historicaldata-1.0.js
 * Barchart Realtime Data JavaScript Library v1.0
 *
 * Copyright 2014 - 2015 Barchart.com, Inc.
 */
;(function() {
    // The Barchart namespace
    if (!window.Barchart) window.Barchart = {};
    if (!window.Barchart.RealtimeData) window.Barchart.RealtimeData = {};
}());


Barchart.RealtimeData.HistoricalData = function() {
    var _url = 'proxies/historicaldata';

    function getHistoricalData(params, callback) {
        $.ajax({
            url : _url,
            dataType : 'text',
            data : params
        }).done(function(json) {
            return callback(json);
        });
    }

    return {
        getHistoricalData : getHistoricalData
    };

};
/*!
 * barchart-realtimedata-marketstate-1.0.js
 * Barchart Realtime Data JavaScript Library v1.0
 *
 * Copyright 2014 - 2015 Barchart.com, Inc.
 */
;(function() {
    // The Barchart namespace
    if (!window.Barchart) window.Barchart = {};
    if (!window.Barchart.RealtimeData) window.Barchart.RealtimeData = {}
}());


// MarketState
// Essentially a DB and Message Processor
Barchart.RealtimeData.MarketState = function() {
    var _MAX_TIMEANDSALES = 10;

    var _book = {};
    var _cvol = {};
    var _quote = {};
    var _timestamp = undefined;
    var _timeAndSales = {};

    var _getCreateBook = function(symbol) {
        if (!_book[symbol]) {
            _book[symbol] = {
                "symbol" : symbol,
                "bids" : [],
                "asks" : []
            };
        }
        return _book[symbol];
    };


    var _getCreateQuote = function(symbol) {
        if (!_quote[symbol]) {
            _quote[symbol] = new Barchart.RealtimeData.MarketState.Quote();
            _quote[symbol].symbol = symbol;
        }
        return _quote[symbol];
    };

    var _getCreateTimeAndSales = function(symbol) {
        if (!_timeAndSales[symbol]) {
            _timeAndSales[symbol] = {
                "symbol" : symbol
            };
        }
        return _timeAndSales[symbol];            
    };


    function loadProfiles(symbols, callback) {
        $.ajax({
            url: 'proxies/instruments/?lookup=' + symbols.join(','), 
        }).done(function(json) {
            if (json.status == 200) {
                for (var i = 0; i < json.instruments.length; i++) {
                    if (json.instruments[i].status == 200) {
                        new Barchart.RealtimeData.MarketState.Profile(
                            json.instruments[i].lookup,
                            json.instruments[i].symbol_description,
                            json.instruments[i].exchange_channel,
                            json.instruments[i].base_code,
                            json.instruments[i].point_value,
                            json.instruments[i].tick_increment
                        );
                    }
                }
            }
            callback();
        });
    }


    var _processMessage = function(message) {
        if (message.type == 'TIMESTAMP') {
            _timestamp = message.timestamp;
            return;
        }


    	var q = _getCreateQuote(message.symbol);

        var p = Barchart.RealtimeData.MarketState.Profile.prototype.Profiles[message.symbol];
        if ((!p) && (message.type != 'REFRESH_QUOTE')) {
            console.warn('No profile found for ' + message.symbol);
            console.log(message);
            return;
        }


        if ((!q.day) && (message.day)) {
            q.day = message.day;
            q.dayNum = Barchart.RealtimeData.Util.DayCodeToNumber(q.day); 
        }

        if (message.type != 'BOOK') {
            if ((q.day) && (message.day)) {

                var dayNum = Barchart.RealtimeData.Util.DayCodeToNumber(message.day);

                if ((dayNum > q.dayNum) || ((q.dayNum - dayNum) > 5)) {
        			// Roll the quote
                    q.day = message.day;
                    q.dayNum = dayNum;
        			q.flag = 'p';
        			q.bidPrice = 0.0;
        			q.bidSize = undefined;
        			q.askPrice = undefined;
        			q.askSize = undefined;
        			if (q.settlementPrice)
        				q.previousPrice = q.settlementPrice;
        			else if (q.lastPrice)
        				q.previousPrice = q.lastPrice;
        			q.lastPrice = undefined;
        			q.tradePrice = undefined;
        			q.tradeSize = undefined;
        			q.numberOfTrades = undefined;
        			q.openPrice = undefined;
        			q.highPrice = undefined;
        			q.lowPrice = undefined;
        			q.volume = undefined;
        		}
        	}
        }


        switch (message.type) {
            case 'BOOK': {                
		    	var b = _getCreateBook(message.symbol);
                b.asks = message.asks;
                b.bids = message.bids;
                break;
            }
            case 'HIGH': {
                q.highPrice = message.value;
                break;
            }
            case 'LOW': {
                q.lowPrice = message.value;
                break;
            }
            case 'OPEN': {
            	q.flag = undefined;
            	q.openPrice = message.value;
                q.highPrice = message.value;
                q.lowPrice = message.value;
                q.lastPrice = message.value;
            	break;
            }
            case 'OPEN_INTEREST': {
                q.openInterest = message.value;
                break;
            }
            case 'REFRESH_DDF': {
                switch (message.subrecord) {
                    case '1':
                    case '2':
                    case '3': {
                        q.message = message;
                        if (message.openPrice === null)
                            q.openPrice = undefined;
                        else if (message.openPrice)
                            q.openPrice = message.openPrice;

                        if (message.highPrice === null)
                            q.highPrice = undefined;
                        else if (message.highPrice)
                            q.highPrice = message.highPrice;

                        if (message.lowPrice === null)
                            q.lowPrice = undefined;
                        else if (message.lowPrice)
                            q.lowPrice = message.lowPrice;

                        if (message.lastPrice === null)
                            q.lastPrice = undefined;
                        else if (message.lastPrice)
                            q.lastPrice = message.lastPrice;

                        if (message.bidPrice === null)
                            q.bidPrice = undefined;
                        else if (message.bidPrice)
                            q.bidPrice = message.bidPrice;

                        if (message.askPrice === null)
                            q.askPrice = undefined;
                        else if (message.askPrice)
                            q.askPrice = message.askPrice;

                        if (message.previousPrice === null)
                            q.previousPrice = undefined;
                        else if (message.previousPrice)
                            q.previousPrice = message.previousPrice;

                        if (message.settlementPrice === null) {
                            q.settlementPrice = undefined;
                            if (q.flag == 's')
                                q.flag = undefined;
                        }
                        else if (message.settlementPrice)
                            q.settlementPrice = message.settlementPrice;
                        else {
                            q.settlementPrice = undefined;
                            if (q.flag == 's')
                                q.flag = undefined;                    
                        }

                        if (message.volume === null)
                            q.volume = undefined;
                        else if (message.volume)
                            q.volume = message.volume;

                        if (message.openInterest === null)
                            q.openInterest = undefined;
                        else if (message.openInterest)
                            q.openInterest = message.openInterest;

                        if (message.subsrecord == '1')
                            q.lastUpdate = message.time;

                        break;
                    }
                }
                break;
            }
            case 'REFRESH_QUOTE': {
                p = new Barchart.RealtimeData.MarketState.Profile(message.symbol, message.name, message.exchange, message.unitcode, message.pointValue, message.tickIncrement); 
                
                q.message = message;
                q.flag = message.flag;
                q.mode = message.mode;
                q.lastUpdate = message.lastUpdate;
                q.bidPrice = message.bidPrice;
                q.bidSize = message.bidSize;
                q.askPrice = message.askPrice;
                q.askSize = message.askSize;
                q.lastPrice = message.lastPrice;
                q.tradeSize = message.tradeSize;
                q.numberOfTrades = message.numberOfTrades;
                q.previousPrice = message.previousPrice;
                q.settlementPrice = message.settlementPrice;
                q.openPrice = message.openPrice;
                q.highPrice = message.highPrice;
                q.lowPrice = message.lowPrice;
                q.volume = message.volume;
                q.openInterest = message.openInterest;

                if (message.tradeTime)
                    q.time = message.tradeTime;
                else if (message.timeStamp)
                    q.time = message.timeStamp;
                break;
            }
            case 'SETTLEMENT': {
                q.lastPrice = message.value;
                q.settlement = message.value;
                if (message.element == 'D')
                    q.flag = 's';
            }
            case 'TOB': {
                q.bidPrice = message.bidPrice;
                q.bidSize = message.bidSize;
                q.askPrice = message.askPrice;
                q.askSize = message.askSize;
                if (message.time)
                    q.time = message.time;

                break;
            }
            case 'TRADE': {                
                q.tradePrice = message.tradePrice;
                q.lastPrice = message.tradePrice;
                if (message.tradeSize) {
                    q.tradeSize = message.tradeSize;
                    q.volume += message.tradeSize;
                }

                q.ticks.push({price: q.tradePrice, size: q.tradeSize});
                while (q.ticks.length > 50) {
                    q.ticks.shift();
                }

                if (!q.numberOfTrades)
                    q.numberOfTrades = 0;

                q.numberOfTrades++;

                if (message.time)
                    q.time = message.time;

                q.flag = undefined;

                // TO DO: Add Time and Sales Tracking
                break;
            }
            case 'TRADE_OUT_OF_SEQUENCE': {
                q.volume += message.tradeSize;
                break;
            }
            case 'VOLUME': {
                q.volume = message.value;
                break;
            }
            case 'VOLUME_YESTERDAY':
                break;
            case 'VWAP':
                q.vwap1 = message.value;
                break;
            default:
                console.error('Unhandled Market Message:');
                console.log(message);
                break;
        }
    };

    return {
        getBook : function(symbol) {
            return _book[symbol];
        },
        getCVol : function(symbol) {
            return _cvol[symbol];
        },
        getProfile : function(symbol, callback) {
            var p = Barchart.RealtimeData.MarketState.Profile.prototype.Profiles[symbol];
            if (!p) {
                loadProfiles([symbol], function() {
                    p = Barchart.RealtimeData.MarketState.Profile.prototype.Profiles[symbol];
                    callback(p);
                });
            }
            else
                callback(p);
        },
        getQuote : function(symbol) {
            return _quote[symbol];
        },
        getTimestamp : function() {
            return _timestamp;
        },
        processMessage : _processMessage
    }
}


Barchart.RealtimeData.MarketState.Profile = function(symbol, name, exchange, unitCode, pointValue, tickIncrement) {
    this.symbol = symbol;
    this.name = name;
    this.exchange = exchange;
    this.unitCode = unitCode;
    this.pointValue = pointValue;
    this.tickIncrement = tickIncrement;

    var info = Barchart.RealtimeData.Util.ParseSymbolType(this.symbol);
    if (info) {
        if (info.type == 'future') {
            this.root = info.root;
            this.month = info.month;
            this.year = info.year;
        }
    }

    Barchart.RealtimeData.MarketState.Profile.prototype.Profiles[symbol] = this;
}


Barchart.RealtimeData.MarketState.Profile.prototype.PriceFormatter = function(fractionSeparator, specialFractions) {
    var format = Barchart.RealtimeData.Util.PriceFormatter(fractionSeparator, specialFractions).format;

    Barchart.RealtimeData.MarketState.Profile.prototype.formatPrice = function(price) {
        return format(price, this.unitCode);
    }
}

Barchart.RealtimeData.MarketState.Profile.prototype.Profiles = {};

// The price formatter can be changed globally.

Barchart.RealtimeData.MarketState.Profile.prototype.PriceFormatter('-', true);



Barchart.RealtimeData.MarketState.Quote = function() {
    this.symbol = null;
    this.message = null;
    this.flag = null;
    this.mode = null;
    this.day = null;
    this.dayNum = 0;
    this.session = null;
    this.lastUpdate = null;
    this.bidPrice = null;
    this.bidSize = null;
    this.askPrice = null;
    this.askSize = null;
    this.lastPrice = null;
    this.tradePrice = null;
    this.tradeSize = null;
    this.numberOfTrades = null;
    this.vwap1 = null; // Exchange Provided
    this.vwap2 = null; // Calculated
    this.settlementPrice = null;
    this.openPrice = null;
    this.highPrice = null;
    this.lowPrice = null;
    this.volume = null;
    this.openInterest = null;
    this.previousPrice = null;
    this.time = null;
    this.ticks = [];
}

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


Barchart.RealtimeData.MessageParser = {
    ParseTimestamp : function(bytes) {
        if (bytes.length != 9)
            return null;

        var year = (bytes.charCodeAt(0) * 100) + bytes.charCodeAt(1) - 64;
        var month = bytes.charCodeAt(2) - 64 - 1;
        var day = bytes.charCodeAt(3) - 64;
        var hour = bytes.charCodeAt(4) - 64;
        var minute = bytes.charCodeAt(5) - 64;
        var second = bytes.charCodeAt(6) - 64;
        var ms = (0xFF & bytes.charCodeAt(7)) + ((0xFF & bytes.charCodeAt(8)) << 8);

        return new Date(year, month, day, hour, minute, second, ms);
    },


    ParseValue : function(str, unitcode) {
        if (str.length < 1)
            return undefined;
        else if (str == '-')
            return null;
        else if (str.indexOf('.') > 0)
            return parseFloat(str);

        var sign = (str.substr(0, 1) == '-') ? -1 : 1;
        if (sign == -1)
            str = str.substr(1);


        switch (unitcode) {
            case '2': // 8ths
                return sign * (((str.length > 1) ? parseInt(str.substr(0, str.length - 1)) : 0) + (parseInt(str.substr(-1)) / 8));
                break;
            case '3': // 16ths
                return sign * (((str.length > 2) ? parseInt(str.substr(0, str.length - 2)) : 0) + (parseInt(str.substr(-2)) / 16));
                break;
            case '4': // 32ths
                return sign * (((str.length > 2) ? parseInt(str.substr(0, str.length - 2)) : 0) + (parseInt(str.substr(-2)) / 32));
                break;
            case '5': // 64ths
                return sign * (((str.length > 2) ? parseInt(str.substr(0, str.length - 2)) : 0) + (parseInt(str.substr(-2)) / 64));
                break;
            case '6': // 128ths
                return sign * (((str.length > 3) ? parseInt(str.substr(0, str.length - 3)) : 0) + (parseInt(str.substr(-3)) / 128));
                break;
            case '7': // 256ths
                return sign * (((str.length > 3) ? parseInt(str.substr(0, str.length - 3)) : 0) + (parseInt(str.substr(-3)) / 256));
                break;
            case '8':
                return sign * parseInt(str);
                break;
            case '9':
                return sign * (parseInt(str) / 10);
                break;
            case 'A':                
                return sign * (parseInt(str) / 100);
                break;
            case 'B':
                return sign * (parseInt(str) / 1000);
                break;
            case 'C':
                return sign * (parseInt(str) / 10000);
                break;
            case 'D':
                return sign * (parseInt(str) / 100000);
                break;
            case 'E':
                return sign * (parseInt(str) / 1000000);
                break;
            default:
                return sign * parseInt(str);
                break;
        }
    },


    Parse : function(msg) {
        var message = {
            message : msg,
            "type" : null
        };

        switch (msg.substr(0, 1)) {
            case '%': { // Jerq Refresh Messages                    
                try {
                    if (window.DOMParser) {
                        var tmp = new DOMParser();
                        xml = tmp.parseFromString(msg.substring(1), "text/xml" );
                    }
                    else { // IE
                        xml = new ActiveXObject( "Microsoft.XMLDOM" );
                        xml.async = "false";
                        xml.loadXML(msg.substring(1));
                    }
                }
                catch (e) {
                    xml = undefined;
                }

                if (xml) {
                    var node = xml.firstChild;

                    switch (node.nodeName) {
                        case 'BOOK': {
                            message.symbol = node.attributes.getNamedItem('symbol').value;
                            message.unitcode = node.attributes.getNamedItem('basecode').value;
                            message.askDepth = parseInt(node.attributes.getNamedItem('bidcount').value);
                            message.bidDepth = parseInt(node.attributes.getNamedItem('bidcount').value);
                            message.asks = [];
                            message.bids = [];

                            var ary1, ary2;
                            
                            if ((node.attributes.getNamedItem('askprices')) && (node.attributes.getNamedItem('asksizes'))) {
                                ary1 = node.attributes.getNamedItem('askprices').value.split(',');
                                ary2 = node.attributes.getNamedItem('asksizes').value.split(',');

                                for (var i = 0; i < ary1.length; i++) {
                                    message.asks.push({ "price" : Barchart.RealtimeData.MessageParser.ParseValue(ary1[i], message.unitcode), "size" : parseInt(ary2[i])});
                                }
                            }

                            if ((node.attributes.getNamedItem('bidprices')) && (node.attributes.getNamedItem('bidsizes'))) {
                                ary1 = node.attributes.getNamedItem('bidprices').value.split(',');
                                ary2 = node.attributes.getNamedItem('bidsizes').value.split(',');

                                for (var i = 0; i < ary1.length; i++) {
                                    message.bids.push({ "price" : Barchart.RealtimeData.MessageParser.ParseValue(ary1[i], message.unitcode), "size" : parseInt(ary2[i])});
                                }
                            }

                            message.type = 'BOOK';
                            break;
                        }
                        case 'QUOTE': {
                            for (var i = 0; i < node.attributes.length; i++) {
                                switch (node.attributes[i].name) {
                                    case 'symbol':
                                        message.symbol = node.attributes[i].value;
                                        break;
                                    case 'name':
                                        message.name = node.attributes[i].value;
                                        break;
                                    case 'exchange':
                                        message.exchange = node.attributes[i].value;
                                        break;
                                    case 'basecode':
                                        message.unitcode = node.attributes[i].value;
                                        break;
                                    case 'pointvalue':
                                        message.pointValue = parseFloat(node.attributes[i].value);
                                        break;
                                    case 'tickincrement':
                                        message.tickIncrement = parseInt(node.attributes[i].value);
                                        break;
                                    case 'flag':
                                        message.flag = node.attributes[i].value;
                                        break;
                                    case 'lastupdate': {
                                        var v = node.attributes[i].value;
                                        message.lastUpdate = new Date(parseInt(v.substr(0, 4)), parseInt(v.substr(4, 2)) - 1, parseInt(v.substr(6, 2)), parseInt(v.substr(8, 2)), parseInt(v.substr(10, 2)), parseInt(v.substr(12, 2)));
                                        break;
                                    }
                                    case 'bid':
                                        message.bidPrice = Barchart.RealtimeData.MessageParser.ParseValue(node.attributes[i].value, message.unitcode);
                                        break;
                                    case 'bidsize':
                                        message.bidSize = parseInt(node.attributes[i].value);
                                        break;
                                    case 'ask':
                                        message.askPrice = Barchart.RealtimeData.MessageParser.ParseValue(node.attributes[i].value, message.unitcode);
                                        break;
                                    case 'asksize':
                                        message.askSize = parseInt(node.attributes[i].value);
                                        break;
                                    case 'mode':
                                        message.mode = node.attributes[i].value;
                                        break;
                                }

                                var sessions = {};

                                for (var j = 0; j < node.childNodes.length; j++) {
                                    if (node.childNodes[j].nodeName == 'SESSION') {
                                        var session = {};
                                        var attributes = node.childNodes[j].attributes;

                                        if (attributes.getNamedItem('id'))
                                            session["id"] = attributes.getNamedItem('id').value;

                                        if (attributes.getNamedItem('day'))
                                            session.day = attributes.getNamedItem('day').value;
                                        if (attributes.getNamedItem('last'))
                                            session.lastPrice = Barchart.RealtimeData.MessageParser.ParseValue(attributes.getNamedItem('last').value, message.unitcode);
                                        if (attributes.getNamedItem('previous'))
                                            session.previousPrice = Barchart.RealtimeData.MessageParser.ParseValue(attributes.getNamedItem('previous').value, message.unitcode);
                                        if (attributes.getNamedItem('open'))
                                            session.openPrice = Barchart.RealtimeData.MessageParser.ParseValue(attributes.getNamedItem('open').value, message.unitcode);
                                        if (attributes.getNamedItem('high'))
                                            session.highPrice = Barchart.RealtimeData.MessageParser.ParseValue(attributes.getNamedItem('high').value, message.unitcode);
                                        if (attributes.getNamedItem('low'))
                                            session.lowPrice = Barchart.RealtimeData.MessageParser.ParseValue(attributes.getNamedItem('low').value, message.unitcode);
                                        if (attributes.getNamedItem('tradesize'))
                                            session.tradeSize = parseInt(attributes.getNamedItem('tradesize').value);
                                        if (attributes.getNamedItem('numtrades'))
                                            session.numberOfTrades = parseInt(attributes.getNamedItem('numtrades').value);
                                        if (attributes.getNamedItem('settlement'))
                                            session.settlementPrice = Barchart.RealtimeData.MessageParser.ParseValue(attributes.getNamedItem('settlement').value, message.unitcode);
                                        if (attributes.getNamedItem('volume'))
                                            session.volume = parseInt(attributes.getNamedItem('volume').value);
                                        if (attributes.getNamedItem('openinterest'))
                                            session.openInterest = parseInt(attributes.getNamedItem('openinterest').value);
                                        if (attributes.getNamedItem('timestamp')) {
                                            var v = attributes.getNamedItem('timestamp').value;
                                            session.timeStamp = new Date(parseInt(v.substr(0, 4)), parseInt(v.substr(4, 2)) - 1, parseInt(v.substr(6, 2)), parseInt(v.substr(8, 2)), parseInt(v.substr(10, 2)), parseInt(v.substr(12, 2)));
                                        }
                                        if (attributes.getNamedItem('tradetime')) {
                                            var v = attributes.getNamedItem('tradetime').value;
                                            session.tradeTime = new Date(parseInt(v.substr(0, 4)), parseInt(v.substr(4, 2)) - 1, parseInt(v.substr(6, 2)), parseInt(v.substr(8, 2)), parseInt(v.substr(10, 2)), parseInt(v.substr(12, 2)));
                                        }

                                        if (session.id)
                                            sessions[session.id] = session;
                                    }
                                }


                                var session = ((sessions["combined"].lastPrice) ? sessions["combined"] : sessions["previous"]);
                                if (session.lastPrice)
                                    message.lastPrice = session.lastPrice;
                                if (session.previousPrice)
                                    message.previousPrice = session.previousPrice;
                                if (session.openPrice)
                                    message.openPrice = session.openPrice;
                                if (session.highPrice)
                                    message.highPrice = session.highPrice;
                                if (session.lowPrice)
                                    message.lowPrice = session.lowPrice;
                                if (session.tradeSize)
                                    message.tradeSize = session.tradeSize;
                                if (session.numberOfTrades)
                                    message.numberOfTrades = session.numberOfTrades;
                                if (session.settlementPrice)
                                    message.settlementPrice = session.settlementPrice;
                                if (session.volume)
                                    message.volume = session.volume;
                                if (session.openInterest)
                                    message.openInterest = session.openInterest;
                                if (session.timeStamp)
                                    message.timeStamp = session.timeStamp;
                                if (session.tradeTime)
                                    message.tradeTime = session.tradeTime;

                                if (session.id == 'combined') {
                                    if (sessions['previous'].openInterest)
                                        message.openInterest = sessions['previous'].openInterest;
                                }
                            }

                            if (sessions['combined'].day)
                                message.day = sessions['combined'].day;

                            message.type = 'REFRESH_QUOTE';
                            break;
                        }
                        default:
                            console.log(msg);
                            break;
                    }
                }

                break;
            }
            case '\x01': { // DDF Messages
                switch (msg.substr(1, 1)) {
                    case '#': {
                        // TO DO: Standardize the timezones for Daylight Savings
                        message.type = 'TIMESTAMP';
                        message.timestamp = new Date(parseInt(msg.substr(2, 4)), parseInt(msg.substr(6, 2)) - 1, parseInt(msg.substr(8, 2)), parseInt(msg.substr(10, 2)), parseInt(msg.substr(12, 2)), parseInt(msg.substr(14, 2)));
                        break;
                    }
                    case '2': {

                        message.record = '2';
                        var pos = msg.indexOf(',', 0);
                        message.symbol = msg.substring(2, pos);
                        message.subrecord = msg.substr(pos + 1, 1);
                        message.unitcode = msg.substr(pos + 3, 1);
                        message.exchange = msg.substr(pos + 4, 1);
                        message.delay = parseInt(msg.substr(pos + 5, 2));
                        switch (message.subrecord) {
                            case '0': {
                                // TO DO: Error Handling / Sanity Check
                                var pos2 = msg.indexOf(',', pos + 7);
                                message.value = Barchart.RealtimeData.MessageParser.ParseValue(msg.substring(pos + 7, pos2), message.unitcode);
                                message.element = msg.substr(pos2 + 1, 1);
                                message.modifier = msg.substr(pos2 + 2, 1);

                                switch (message.element) {
                                	case 'A':
                                		message.type = 'OPEN';
                                		break;
                                    case 'C':
                                        if (message.modifier == '1')
                                            message.type = 'OPEN_INTEREST';
                                        break;
                                	case 'D':
                                	case 'd':
                                		if (message.modifier == '0')
                                			message.type = 'SETTLEMENT';
                                		break;
                                    case 'V':
                                        if (message.modifier == '0')
                                            message.type = 'VWAP';
                                        break;
                                    case '0': {
                                        if (message.modifier == '0') {
                                            message.tradePrice = message.value;
                                            message.type = 'TRADE';
                                        }
                                        break;
                                    }
                                    case '5':
                                        message.type = 'HIGH';
                                        break;
                                    case '6':
                                        message.type = 'LOW';
                                        break;
                                	case '7': {                                        
                                        if (message.modifier == '1')
                                            message.type ='VOLUME_YESTERDAY';
                                		else if (message.modifier == '6')
	                                        message.type ='VOLUME';
                                		break;
                                    }
                                }

                                message.day = msg.substr(pos2 + 3, 1);
                                message.session = msg.substr(pos2 + 4, 1);
                                message.time = Barchart.RealtimeData.MessageParser.ParseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
                                break;
                            }
                            case '1':
                            case '2':
                            case '3':
                            case '4': {
                                var ary = msg.substring(pos + 8).split(',');
                                message.openPrice = Barchart.RealtimeData.MessageParser.ParseValue(ary[0], message.unitcode);
                                message.highPrice = Barchart.RealtimeData.MessageParser.ParseValue(ary[1], message.unitcode);
                                message.lowPrice = Barchart.RealtimeData.MessageParser.ParseValue(ary[2], message.unitcode);
                                message.lastPrice = Barchart.RealtimeData.MessageParser.ParseValue(ary[3], message.unitcode);
                                message.bidPrice = Barchart.RealtimeData.MessageParser.ParseValue(ary[4], message.unitcode);
                                message.askPrice = Barchart.RealtimeData.MessageParser.ParseValue(ary[5], message.unitcode);
                                message.previousPrice = Barchart.RealtimeData.MessageParser.ParseValue(ary[7], message.unitcode);
                                message.settlementPrice = Barchart.RealtimeData.MessageParser.ParseValue(ary[10], message.unitcode);
                                message.volume = (ary[13].length > 0) ? parseInt(ary[13]) : undefined;
                                message.openInterest = (ary[12].length > 0) ? parseInt(ary[12]) : undefined;
                                message.day = ary[14].substr(0, 1);
                                message.session = ary[14].substr(1, 1);
                                message.time = Barchart.RealtimeData.MessageParser.ParseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
                                message.type = 'REFRESH_DDF';
                                break;
                            }
                            case '7': {
                                var pos2 = msg.indexOf(',', pos + 7);
                                message.tradePrice = Barchart.RealtimeData.MessageParser.ParseValue(msg.substring(pos + 7, pos2), message.unitcode);

                                pos = pos2 + 1;
                                pos2 = msg.indexOf(',', pos);
                                message.tradeSize = parseInt(msg.substring(pos, pos2));
                                pos = pos2 + 1;
                                message.day = msg.substr(pos, 1);
                                message.session = msg.substr(pos + 1, 1);
                                message.time = Barchart.RealtimeData.MessageParser.ParseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
                                message.type = 'TRADE';
                                break;
                            }
                            case '8': {
                                var pos2 = msg.indexOf(',', pos + 7);
                                message.bidPrice = Barchart.RealtimeData.MessageParser.ParseValue(msg.substring(pos + 7, pos2), message.unitcode);
                                pos = pos2 + 1;
                                pos2 = msg.indexOf(',', pos);
                                message.bidSize = parseInt(msg.substring(pos, pos2));
                                pos = pos2 + 1;
                                pos2 = msg.indexOf(',', pos);
                                message.askPrice = Barchart.RealtimeData.MessageParser.ParseValue(msg.substring(pos, pos2), message.unitcode);
                                pos = pos2 + 1;
                                pos2 = msg.indexOf(',', pos);
                                message.askSize = parseInt(msg.substring(pos, pos2));
                                pos = pos2 + 1;
                                message.day = msg.substr(pos, 1);
                                message.session = msg.substr(pos + 1, 1);
                                message.time = Barchart.RealtimeData.MessageParser.ParseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
                                message.type = 'TOB';
                                break;
                            }
                            case 'Z': {
                                var pos2 = msg.indexOf(',', pos + 7);
                                message.tradePrice = Barchart.RealtimeData.MessageParser.ParseValue(msg.substring(pos + 7, pos2), message.unitcode);

                                pos = pos2 + 1;
                                pos2 = msg.indexOf(',', pos);
                                message.tradeSize = parseInt(msg.substring(pos, pos2));
                                pos = pos2 + 1;
                                message.day = msg.substr(pos, 1);
                                message.session = msg.substr(pos + 1, 1);
                                message.time = Barchart.RealtimeData.MessageParser.ParseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
                                message.type = 'TRADE_OUT_OF_SEQUENCE';
                                break;
                            }
                        }
                        break;
                    }
                    case '3': {
                        var pos = msg.indexOf(',', 0);
                        message.symbol = msg.substring(2, pos);
                        message.subrecord = msg.substr(pos + 1, 1);
                        switch (message.subrecord) {
                            case 'B': {
                                message.unitcode = msg.substr(pos + 3, 1);
                                message.exchange = msg.substr(pos + 4, 1);
                                message.bidDepth = ((msg.substr(pos + 5, 1) == 'A') ? 10 : parseInt(msg.substr(pos + 5, 1)));
                                message.askDepth = ((msg.substr(pos + 6, 1) == 'A') ? 10 : parseInt(msg.substr(pos + 6, 1)));
                                message.bids = [];
                                message.asks = [];
                                var ary = msg.substring(pos + 8).split(',');
                                for (var i = 0; i < ary.length; i++) {
                                    var ary2 = ary[i].split(/[A-Z]/);
                                    var c = ary[i].substr(ary2[0].length, 1);
                                    if (c <= 'J')
                                        message.asks.push({"price" : Barchart.RealtimeData.MessageParser.ParseValue(ary2[0], message.unitcode), "size" : parseInt(ary2[1])});
                                    else
                                        message.bids.push({"price" : Barchart.RealtimeData.MessageParser.ParseValue(ary2[0], message.unitcode), "size" : parseInt(ary2[1])});
                                }

                                message.type = 'BOOK';
                                break;
                            }
                            default:
                                break;
                        }


                        break;
                    }
                    default: {
                        message.type = 'UNKNOWN';
                        break;
                    }
                }
            }
        }

        return message;
    }
}
//# sourceMappingURL=../dist/barchart-marketdata-api-1.0.js.map