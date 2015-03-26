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
