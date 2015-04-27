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
};


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
};


Barchart.RealtimeData.MarketState.Profile.prototype.PriceFormatter = function(fractionSeparator, specialFractions) {
    var format = Barchart.RealtimeData.Util.PriceFormatter(fractionSeparator, specialFractions).format;

    Barchart.RealtimeData.MarketState.Profile.prototype.formatPrice = function(price) {
        return format(price, this.unitCode);
    }
};

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
};
