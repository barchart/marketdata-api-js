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