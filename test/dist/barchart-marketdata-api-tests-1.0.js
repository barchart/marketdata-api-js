(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Class = require('class.extend');

module.exports = function() {
    'use strict';

    return Class.extend({
        init: function() {

        },

        parse: function(textDocument) {
            if (typeof textDocument !== 'string') {
                throw new Error('The "textDocument" argument must be a string.');
            }

            return this._parse(textDocument);
        },

        _parse: function(textDocument) {
            return null;
        },

        toString: function() {
            return '[XmlDomParserBase]';
        }
    });
}();
},{"class.extend":19}],2:[function(require,module,exports){
var XmlDomParserBase = require('./../XmlDomParserBase');

module.exports = function() {
    'use strict';

    return XmlDomParserBase.extend({
        init: function() {
            if (window.DOMParser) {
                this._xmlDomParser = new DOMParser();
            } else {
                this._xmlDomParser = null;
            }
        },

        _parse: function(textDocument) {
            var xmlDocument;

            if (this._xmlDomParser) {
                xmlDocument = this._xmlDomParser.parseFromString(textDocument, 'text/xml');
            } else {
                xmlDocument = new ActiveXObject('Microsoft.XMLDOM');
                xmlDocument.async = 'false';
                xmlDocument.loadXML(textDocument);
            }

            return xmlDocument;
        },

        toString: function() {
            return '[XmlDomParser]';
        }
    });
}();
},{"./../XmlDomParserBase":1}],3:[function(require,module,exports){
var XmlDomParser = require('./../common/xml/XmlDomParser');

var parseValue = require('./parseValue');
var parseTimestamp = require('./parseTimestamp');

module.exports = function() {
	'use strict';

	return function(msg) {
		var message = {
			message : msg,
			type : null
		};

		switch (msg.substr(0, 1)) {
			case '%': { // Jerq Refresh Messages
				var xmlDocument;

				try {
					var xmlDomParser = new XmlDomParser();
					xmlDocument = xmlDomParser.parse(msg.substring(1));
				}
				catch (e) {
					xmlDocument = undefined;
				}

				if (xmlDocument) {
					var node = xmlDocument.firstChild;

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
									message.asks.push({ "price" : parseValue(ary1[i], message.unitcode), "size" : parseInt(ary2[i])});
								}
							}

							if ((node.attributes.getNamedItem('bidprices')) && (node.attributes.getNamedItem('bidsizes'))) {
								ary1 = node.attributes.getNamedItem('bidprices').value.split(',');
								ary2 = node.attributes.getNamedItem('bidsizes').value.split(',');

								for (var i = 0; i < ary1.length; i++) {
									message.bids.push({ "price" : parseValue(ary1[i], message.unitcode), "size" : parseInt(ary2[i])});
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
										message.bidPrice = parseValue(node.attributes[i].value, message.unitcode);
										break;
									case 'bidsize':
										message.bidSize = parseInt(node.attributes[i].value);
										break;
									case 'ask':
										message.askPrice = parseValue(node.attributes[i].value, message.unitcode);
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
										var s = {};
										var attributes = node.childNodes[j].attributes;

										if (attributes.getNamedItem('id'))
											s.id = attributes.getNamedItem('id').value;
										if (attributes.getNamedItem('day'))
											s.day = attributes.getNamedItem('day').value;
										if (attributes.getNamedItem('last'))
											s.lastPrice = parseValue(attributes.getNamedItem('last').value, message.unitcode);
										if (attributes.getNamedItem('previous'))
											s.previousPrice = parseValue(attributes.getNamedItem('previous').value, message.unitcode);
										if (attributes.getNamedItem('open'))
											s.openPrice = parseValue(attributes.getNamedItem('open').value, message.unitcode);
										if (attributes.getNamedItem('high'))
											s.highPrice = parseValue(attributes.getNamedItem('high').value, message.unitcode);
										if (attributes.getNamedItem('low'))
											s.lowPrice = parseValue(attributes.getNamedItem('low').value, message.unitcode);
										if (attributes.getNamedItem('tradesize'))
											s.tradeSize = parseInt(attributes.getNamedItem('tradesize').value);
										if (attributes.getNamedItem('numtrades'))
											s.numberOfTrades = parseInt(attributes.getNamedItem('numtrades').value);
										if (attributes.getNamedItem('settlement'))
											s.settlementPrice = parseValue(attributes.getNamedItem('settlement').value, message.unitcode);
										if (attributes.getNamedItem('volume'))
											s.volume = parseInt(attributes.getNamedItem('volume').value);
										if (attributes.getNamedItem('openinterest'))
											s.openInterest = parseInt(attributes.getNamedItem('openinterest').value);
										if (attributes.getNamedItem('timestamp')) {
											var v = attributes.getNamedItem('timestamp').value;
											s.timeStamp = new Date(parseInt(v.substr(0, 4)), parseInt(v.substr(4, 2)) - 1, parseInt(v.substr(6, 2)), parseInt(v.substr(8, 2)), parseInt(v.substr(10, 2)), parseInt(v.substr(12, 2)));
										}
										if (attributes.getNamedItem('tradetime')) {
											var v = attributes.getNamedItem('tradetime').value;
											s.tradeTime = new Date(parseInt(v.substr(0, 4)), parseInt(v.substr(4, 2)) - 1, parseInt(v.substr(6, 2)), parseInt(v.substr(8, 2)), parseInt(v.substr(10, 2)), parseInt(v.substr(12, 2)));
										}

										if (s.id)
											sessions[s.id] = s;
									}
								}

								var premarket = typeof(sessions.combined.lastPrice) === 'undefined';
								var postmarket = !premarket && typeof(sessions.combined.settlementPrice) !== 'undefined';

								var session = premarket ? sessions.previous : sessions.combined;

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
								if (session.id === 'combined' && sessions.previous.openInterest)
									message.openInterest = sessions.previous.openInterest;
								if (session.timeStamp)
									message.timeStamp = session.timeStamp;
								if (session.tradeTime)
									message.tradeTime = session.tradeTime;

								if (sessions.combined.day)
									message.day = sessions.combined.day;
								if (premarket && typeof(message.flag) === 'undefined')
									message.flag = 'p';

								var p = sessions.previous;

								message.previousPreviousPrice = p.previousPrice;
								message.previousSettlementPrice = p.settlementPrice;
								message.previousOpenPrice = p.openPrice;
								message.previousHighPrice = p.highPrice;
								message.previousLowPrice = p.lowPrice;
								message.previousTimeStamp = p.timeStamp;

								if (sessions.combined.day) {
									var sessionFormT = 'session_' + sessions.combined.day + '_T';

									if (sessions.hasOwnProperty(sessionFormT)) {
										var t = sessions[sessionFormT];

										var lastPriceT = t.lastPrice;

										if (lastPriceT) {
											var tradeTimeT = t.tradeTime;
											var tradeSizeT = t.tradeSize;

											message.lastPriceT = lastPriceT;

											if (tradeTimeT) {
												var noon = new Date(tradeTimeT.getFullYear(), tradeTimeT.getMonth(), tradeTimeT.getDate(), 12, 0, 0, 0);

												message.sessionT = tradeTimeT.getTime() > noon.getTime();
											}

											if (tradeTimeT)
												message.tradeTime = tradeTimeT; // might be a problem (we've split lastPrice and lastPriceT -- we might need to split times)
											if (tradeSizeT)
												message.tradeSize = tradeSizeT;

											if (premarket || postmarket) {
												message.session = 'T';

												if (premarket) {
													if (t.volume)
														message.volume = t.volume;
													if (t.previousPrice)
														message.previousPrice = t.previousPrice;
												}
											}
										}
									}
								}
							}

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
								message.value = parseValue(msg.substring(pos + 7, pos2), message.unitcode);
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
								message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
								break;
							}
							case '1':
							case '2':
							case '3':
							case '4': {
								var ary = msg.substring(pos + 8).split(',');
								message.openPrice = parseValue(ary[0], message.unitcode);
								message.highPrice = parseValue(ary[1], message.unitcode);
								message.lowPrice = parseValue(ary[2], message.unitcode);
								message.lastPrice = parseValue(ary[3], message.unitcode);
								message.bidPrice = parseValue(ary[4], message.unitcode);
								message.askPrice = parseValue(ary[5], message.unitcode);
								message.previousPrice = parseValue(ary[7], message.unitcode);
								message.settlementPrice = parseValue(ary[10], message.unitcode);
								message.volume = (ary[13].length > 0) ? parseInt(ary[13]) : undefined;
								message.openInterest = (ary[12].length > 0) ? parseInt(ary[12]) : undefined;
								message.day = ary[14].substr(0, 1);
								message.session = ary[14].substr(1, 1);
								message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
								message.type = 'REFRESH_DDF';
								break;
							}
							case '7': {
								var pos2 = msg.indexOf(',', pos + 7);
								message.tradePrice = parseValue(msg.substring(pos + 7, pos2), message.unitcode);

								pos = pos2 + 1;
								pos2 = msg.indexOf(',', pos);
								message.tradeSize = parseInt(msg.substring(pos, pos2));
								pos = pos2 + 1;
								message.day = msg.substr(pos, 1);
								message.session = msg.substr(pos + 1, 1);
								message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
								message.type = 'TRADE';
								break;
							}
							case '8': {
								var pos2 = msg.indexOf(',', pos + 7);
								message.bidPrice = parseValue(msg.substring(pos + 7, pos2), message.unitcode);
								pos = pos2 + 1;
								pos2 = msg.indexOf(',', pos);
								message.bidSize = parseInt(msg.substring(pos, pos2));
								pos = pos2 + 1;
								pos2 = msg.indexOf(',', pos);
								message.askPrice = parseValue(msg.substring(pos, pos2), message.unitcode);
								pos = pos2 + 1;
								pos2 = msg.indexOf(',', pos);
								message.askSize = parseInt(msg.substring(pos, pos2));
								pos = pos2 + 1;
								message.day = msg.substr(pos, 1);
								message.session = msg.substr(pos + 1, 1);
								message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
								message.type = 'TOB';
								break;
							}
							case 'Z': {
								var pos2 = msg.indexOf(',', pos + 7);
								message.tradePrice = parseValue(msg.substring(pos + 7, pos2), message.unitcode);

								pos = pos2 + 1;
								pos2 = msg.indexOf(',', pos);
								message.tradeSize = parseInt(msg.substring(pos, pos2));
								pos = pos2 + 1;
								message.day = msg.substr(pos, 1);
								message.session = msg.substr(pos + 1, 1);
								message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
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
										message.asks.push({"price" : parseValue(ary2[0], message.unitcode), "size" : parseInt(ary2[1])});
									else
										message.bids.push({"price" : parseValue(ary2[0], message.unitcode), "size" : parseInt(ary2[1])});
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
	};
}();
},{"./../common/xml/XmlDomParser":2,"./parseTimestamp":4,"./parseValue":5}],4:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return function(bytes) {
		if (bytes.length !== 9)
			return null;

		var year = (bytes.charCodeAt(0) * 100) + bytes.charCodeAt(1) - 64;
		var month = bytes.charCodeAt(2) - 64 - 1;
		var day = bytes.charCodeAt(3) - 64;
		var hour = bytes.charCodeAt(4) - 64;
		var minute = bytes.charCodeAt(5) - 64;
		var second = bytes.charCodeAt(6) - 64;
		var ms = (0xFF & bytes.charCodeAt(7)) + ((0xFF & bytes.charCodeAt(8)) << 8);

		// 2016/02/17. JERQ is providing us with date and time values that
		// are meant to be interpreted in the exchange's local timezone.
		//
		// This is interesting because different time values (e.g. 14:30 and
		// 13:30) can refer to the same moment (e.g. EST for US equities and
		// CST for US futures).
		//
		// Furthermore, when we use the timezone-sensitive Date object, we
		// create a problem. The represents (computer) local time. So, for
		// server applications, it is recommended that we use UTC -- so
		// that the values (hours) are not changed when JSON serialized
		// to ISO-8601 format. Then, the issue is passed along to the
		// consumer (which must ignore the timezone too).

		return new Date(year, month, day, hour, minute, second, ms);
	};
}();
},{}],5:[function(require,module,exports){
var utilities = require('barchart-marketdata-utilities');

module.exports = function() {
	'use strict';

	return utilities.priceParser;
}();
},{"barchart-marketdata-utilities":13}],6:[function(require,module,exports){
var utilities = require('barchart-marketdata-utilities');

module.exports = function() {
	'use strict';

	return utilities.convert.baseCodeToUnitCode;
}();
},{"barchart-marketdata-utilities":13}],7:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return function(dayCode) {
		var val1 = dayCode.charCodeAt(0);

		if ((val1 >= ("1").charCodeAt(0)) && (dayCode <= ("9").charCodeAt(0)))
			return (val1 - ("0").charCodeAt(0));
		else if (dayCode == "0")
			return 10;
		else
			return ((val1 - ("A").charCodeAt(0)) + 11);
	};
}();
},{}],8:[function(require,module,exports){
var utilities = require('barchart-marketdata-utilities');

module.exports = function() {
	'use strict';

	return utilities.convert.unitCodeToBaseCode;
}();
},{"barchart-marketdata-utilities":13}],9:[function(require,module,exports){
var utilities = require('barchart-marketdata-utilities');

module.exports = function() {
	'use strict';

	return utilities.monthCodes.getCodeToNameMap();
}();
},{"barchart-marketdata-utilities":13}],10:[function(require,module,exports){
var utilities = require('barchart-marketdata-utilities');

module.exports = function() {
	'use strict';

	return utilities.priceFormatter;
}();
},{"barchart-marketdata-utilities":13}],11:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return {
		unitCodeToBaseCode: function(unitCode) {
			switch (unitCode) {
				case '2':
					return -1;
				case '3':
					return -2;
				case '4':
					return -3;
				case '5':
					return -4;
				case '6':
					return -5;
				case '7':
					return -6;
				case '8':
					return 0;
				case '9':
					return 1;
				case 'A':
					return 2;
				case 'B':
					return 3;
				case 'C':
					return 4;
				case 'D':
					return 5;
				case 'E':
					return 6;
				case 'F':
					return 7;
				default:
					return 0;
			}
		},

		baseCodeToUnitCode: function(baseCode) {
			switch (baseCode) {
				case -1:
					return '2';
				case -2:
					return '3';
				case -3:
					return '4';
				case -4:
					return '5';
				case -5:
					return '6';
				case -6:
					return '7';
				case 0:
					return '8';
				case 1:
					return '9';
				case 2:
					return 'A';
				case 3:
					return 'B';
				case 4:
					return 'C';
				case 5:
					return 'D';
				case 6:
					return 'E';
				case 7:
					return 'F';
				default:
					return 0;
			}
		}
	};
}();
},{}],12:[function(require,module,exports){
var lodashIsNaN = require('lodash.isnan');

module.exports = function() {
	'use strict';

	return function(value, digits, thousandsSeparator) {
		if (value === '' || value === undefined || value === null || lodashIsNaN(value)) {
			return '';
		}

		var returnRef = value.toFixed(digits);

		if (thousandsSeparator && !(value < 1000)) {
			var length = returnRef.length;

			var found = digits === 0;
			var counter = 0;

			var buffer = [];

			for (var i = (length - 1); !(i < 0); i--) {
				if (counter === 3) {
					buffer.unshift(',');

					counter = 0;
				}

				var character = returnRef.charAt(i);

				buffer.unshift(character);

				if (found) {
					counter = counter + 1;
				} else if (character === '.') {
					found = true;
				}
			}

			returnRef = buffer.join('');
		}

		return returnRef;
	};
}();
},{"lodash.isnan":20}],13:[function(require,module,exports){
var convert = require('./convert');
var decimalFormatter = require('./decimalFormatter');
var monthCodes = require('./monthCodes');
var priceFormatter = require('./priceFormatter');
var symbolFormatter = require('./symbolFormatter');
var priceParser = require('./priceParser');
var timeFormatter = require('./timeFormatter');

module.exports = function() {
	'use strict';

	return {
		convert: convert,
		decimalFormatter: decimalFormatter,
		monthCodes: monthCodes,
		priceFormatter: priceFormatter,
		priceParser: priceParser,
		symbolFormatter: symbolFormatter,
		timeFormatter: timeFormatter
	};
}();
},{"./convert":11,"./decimalFormatter":12,"./monthCodes":14,"./priceFormatter":15,"./priceParser":16,"./symbolFormatter":17,"./timeFormatter":18}],14:[function(require,module,exports){
module.exports = function() {
	'use strict';

	var monthMap = { };
	var numberMap = { };

	var addMonth = function (code, name, number) {
		monthMap[code] = name;
		numberMap[code] = number;
	};

	addMonth("F", "January", 1);
	addMonth("G", "February", 2);
	addMonth("H", "March", 3);
	addMonth("J", "April", 4);
	addMonth("K", "May", 5);
	addMonth("M", "June", 6);
	addMonth("N", "July", 7);
	addMonth("Q", "August", 8);
	addMonth("U", "September", 9);
	addMonth("V", "October", 10);
	addMonth("X", "November", 11);
	addMonth("Z", "December", 12);
	addMonth("Y", "Cash", 0);

	return {
		getCodeToNameMap: function() {
			return monthMap;
		},

		getCodeToNumberMap: function() {
			return numberMap;
		}
	};
}();
},{}],15:[function(require,module,exports){
var lodashIsNaN = require('lodash.isnan');
var decimalFormatter = require('./decimalFormatter');

module.exports = function() {
	'use strict';

	function frontPad(value, digits) {
		return ['000', Math.floor(value)].join('').substr(-1 * digits);
	}

	return function(fractionSeparator, specialFractions, thousandsSeparator) {
		var format;

		function getWholeNumberAsString(value) {
			var val = Math.floor(value);

			if ((val === 0) && (fractionSeparator === ''))
				return '';
			else
				return val;
		}

		function formatDecimal(value, digits) {
			return decimalFormatter(value, digits, thousandsSeparator);
		}

		if (fractionSeparator == '.') { // Decimals
			format = function(value, unitcode) {
				switch (unitcode) {
					case '2':
						return formatDecimal(value, 3);
					case '3':
						return formatDecimal(value, 4);
					case '4':
						return formatDecimal(value, 5);
					case '5':
						return formatDecimal(value, 6);
					case '6':
						return formatDecimal(value, 7);
					case '7':
						return formatDecimal(value, 8);
					case '8':
						return formatDecimal(value, 0);
					case '9':
						return formatDecimal(value, 1);
					case 'A':
						return formatDecimal(value, 2);
					case 'B':
						return formatDecimal(value, 3);
					case 'C':
						return formatDecimal(value, 4);
					case 'D':
						return formatDecimal(value, 5);
					case 'E':
						return formatDecimal(value, 6);
					default:
						if (value === '' || value === undefined || value === null || lodashIsNaN(value))
							return '';
						else
							return value;
				}
			};
		}
		else {
			format = function(value, unitcode) {
				if (value === '' || value === undefined || value === null || lodashIsNaN(value))
					return '';

				var sign = (value >= 0) ? '' : '-';
				value = Math.abs(value);

				// Well, damn it, sometimes code that is beautiful just doesn't work quite right.
				// return [sign, Math.floor(value), fractionSeparator, frontPad((value - Math.floor(value)) * 8, 1)].join('');
				// will fail when Math.floor(value) is 0 and the fractionSeparator is '', since 0.500 => 04 instead of just 4

				switch (unitcode) {
					case '2':
						return [sign, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * 8, 1)].join('');
					case '3':
						return [sign, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * 16, 2)].join('');
					case '4':
						return [sign, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * 32, 2)].join('');
					case '5':
						return [sign, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * (specialFractions ? 320 : 64), (specialFractions ? 3 : 2))].join('');
					case '6':
						return [sign, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * (specialFractions ? 320 : 128), 3)].join('');
					case '7':
						return [sign, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * (specialFractions ? 320 : 256), 3)].join('');
					case '8':
						return sign + formatDecimal(value, 0);
					case '9':
						return sign + formatDecimal(value, 1);
					case 'A':
						return sign + formatDecimal(value, 2);
					case 'B':
						return sign + formatDecimal(value, 3);
					case 'C':
						return sign + formatDecimal(value, 4);
					case 'D':
						return sign + formatDecimal(value, 5);
					case 'E':
						return sign + formatDecimal(value, 6);
					default:
						return sign + value;
				}
			};
		}

		return {
			format: format
		};
	};
}();
},{"./decimalFormatter":12,"lodash.isnan":20}],16:[function(require,module,exports){
module.exports = function() {
	'use strict';

	var replaceExpressions = { };

	function getReplaceExpression(thousandsSeparator) {
		if (!replaceExpressions.hasOwnProperty(thousandsSeparator)) {
			replaceExpressions[thousandsSeparator] = new RegExp(thousandsSeparator, 'g');
		}

		return replaceExpressions[thousandsSeparator];
	}

	return function(str, unitcode, thousandsSeparator) {
		if (str.length < 1) {
			return undefined;
		} else if (str === '-') {
			return null;
		}

		if (thousandsSeparator) {
			str = str.replace(getReplaceExpression(thousandsSeparator), '');
		}

		if (str.indexOf('.') > 0) {
			return parseFloat(str);
		}

		var sign = (str.substr(0, 1) == '-') ? -1 : 1;

		if (sign === -1) {
			str = str.substr(1);
		}

		switch (unitcode) {
			case '2': // 8ths
				return sign * (((str.length > 1) ? parseInt(str.substr(0, str.length - 1)) : 0) + (parseInt(str.substr(-1)) / 8));
			case '3': // 16ths
				return sign * (((str.length > 2) ? parseInt(str.substr(0, str.length - 2)) : 0) + (parseInt(str.substr(-2)) / 16));
			case '4': // 32ths
				return sign * (((str.length > 2) ? parseInt(str.substr(0, str.length - 2)) : 0) + (parseInt(str.substr(-2)) / 32));
			case '5': // 64ths
				return sign * (((str.length > 2) ? parseInt(str.substr(0, str.length - 2)) : 0) + (parseInt(str.substr(-2)) / 64));
			case '6': // 128ths
				return sign * (((str.length > 3) ? parseInt(str.substr(0, str.length - 3)) : 0) + (parseInt(str.substr(-3)) / 128));
			case '7': // 256ths
				return sign * (((str.length > 3) ? parseInt(str.substr(0, str.length - 3)) : 0) + (parseInt(str.substr(-3)) / 256));
			case '8':
				return sign * parseInt(str);
			case '9':
				return sign * (parseInt(str) / 10);
			case 'A':
				return sign * (parseInt(str) / 100);
			case 'B':
				return sign * (parseInt(str) / 1000);
			case 'C':
				return sign * (parseInt(str) / 10000);
			case 'D':
				return sign * (parseInt(str) / 100000);
			case 'E':
				return sign * (parseInt(str) / 1000000);
			default:
				return sign * parseInt(str);
		}
	};
}();
},{}],17:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return {
		format: function(symbol) {
			var returnRef;

			if (symbol !== null && typeof symbol === 'string') {
				returnRef = symbol.toUpperCase();
			} else {
				returnRef = symbol;
			}

			return returnRef;
 		}
	};
}();
},{}],18:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return function(useTwelveHourClock, short) {
		var formatTime;

		if (useTwelveHourClock) {
			if (short) {
				formatTime = formatTwelveHourTimeShort;
			} else {
				formatTime = formatTwelveHourTime;
			}
		} else {
			if (short) {
				formatTime = formatTwentyFourHourTimeShort;
			} else {
				formatTime = formatTwentyFourHourTime;
			}
		}

		var formatters = {
			format: function(q) {
				var t = q.time;

				if (!t) {
					return '';
				} else if (q.lastPrice && !q.flag) {
					return formatters.formatTime(t, q.timezone);
				} else {
					return formatters.formatDate(t);
				}
			},

			formatTime: function(date, timezone) {
				var returnRef;

				if (date) {
					returnRef = formatTime(date);

					if (timezone) {
						returnRef = returnRef + ' ' + timezone;
					}
				} else {
					returnRef = '';
				}

				return returnRef;
			},

			formatDate: function(date) {
				if (date) {
					return leftPad(date.getMonth() + 1) + '/' + leftPad(date.getDate()) + '/' + leftPad(date.getFullYear());
				} else {
					return '';
				}
			}
		};

		return formatters;
	};

	function formatTwelveHourTime(t) {
		var hours = t.getHours();
		var period;

		if (hours === 0) {
			hours = 12;
			period = 'AM';
		} else if (hours === 12) {
			hours = hours;
			period = 'PM';
		} else if (hours > 12) {
			hours = hours - 12;
			period = 'PM';
		} else {
			hours = hours;
			period = 'AM';
		}

		return leftPad(hours) + ':' + leftPad(t.getMinutes()) + ':' + leftPad(t.getSeconds()) + ' ' + period;
	}

	function formatTwelveHourTimeShort(t) {
		var hours = t.getHours();
		var period;

		if (hours === 0) {
			hours = 12;
			period = 'A';
		} else if (hours === 12) {
			hours = hours;
			period = 'P';
		} else if (hours > 12) {
			hours = hours - 12;
			period = 'P';
		} else {
			hours = hours;
			period = 'A';
		}

		return leftPad(hours) + ':' + leftPad(t.getMinutes()) + period;
	}

	function formatTwentyFourHourTime(t) {
		return leftPad(t.getHours()) + ':' + leftPad(t.getMinutes()) + ':' + leftPad(t.getSeconds());
	}

	function formatTwentyFourHourTimeShort(t) {
		return leftPad(t.getHours()) + ':' + leftPad(t.getMinutes());
	}

	function leftPad(value) {
		return ('00' + value).substr(-2);
	}
}();
},{}],19:[function(require,module,exports){
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};

  // Create a new Class that inherits from this class
  Class.extend = function(className, prop) {
    if(prop == undefined) {
        prop = className;
       className = "Class";
    }

    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    var func = new Function(
        "return function " + className + "(){ }"
    )();
    Class.prototype.constructor = func;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };

  //I only added this line
  module.exports = Class;
})();

},{}],20:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var numberTag = '[object Number]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is `NaN`.
 *
 * **Note:** This method is not the same as [`isNaN`](https://es5.github.io/#x15.1.2.4)
 * which returns `true` for `undefined` and other non-numeric values.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 * @example
 *
 * _.isNaN(NaN);
 * // => true
 *
 * _.isNaN(new Number(NaN));
 * // => true
 *
 * isNaN(undefined);
 * // => true
 *
 * _.isNaN(undefined);
 * // => false
 */
function isNaN(value) {
  // An `NaN` primitive is the only value that is not equal to itself.
  // Perform the `toStringTag` check first to avoid errors with some ActiveX objects in IE.
  return isNumber(value) && value != +value;
}

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
 * as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */
function isNumber(value) {
  return typeof value == 'number' ||
    (isObjectLike(value) && objectToString.call(value) == numberTag);
}

module.exports = isNaN;

},{}],21:[function(require,module,exports){
var parseMessage = require('../../../lib/messageParser/parseMessage');

describe('when parsing an XML refresh message', function() {
	describe('for an instrument that has settled and has a postmarket (form-T) trade', function() {
		var x;

		beforeEach(function() {
			x = parseMessage('%<QUOTE symbol="AAPL" name="Apple Inc" exchange="NASDAQ" basecode="A" pointvalue="1.0" tickincrement="1" ddfexchange="Q" flag="s" lastupdate="20160920163525" bid="11345" bidsize="10" ask="11352" asksize="1" mode="I"><SESSION day="J" session="R" timestamp="20160920171959" open="11305" high="11412" low="11251" last="11357" previous="11358" settlement="11357" tradesize="1382944" volume="36258067" numtrades="143218" pricevolume="3548806897.06" tradetime="20160920160000" ticks=".." id="combined"/><SESSION day="I" timestamp="20160919000000" open="11519" high="11618" low="11325" last="11358" previous="11492" settlement="11358" volume="47010000" ticks=".." id="previous"/><SESSION day="J" session="R" previous="11358" volume="13198" id="session_J_R"/><SESSION day="J" session="T" timestamp="20160920172007" last="11355" previous="11358" tradesize="500" volume="656171" numtrades="1118" pricevolume="74390050.90" tradetime="20160920172007" ticks="+-" id="session_J_T"/></QUOTE>');
		});

		it('the "flag" should be "s"', function() {
			expect(x.flag).toEqual('s');
		});

		it('the "session" should not be "T"', function() {
			expect(x.session).toEqual('T');
		});

		it('the "sessionT" should be true', function() {
			expect(x.sessionT).toEqual(true);
		});

		it('the "lastPrice" should be 113.57', function() {
			expect(x.lastPrice).toEqual(113.57);
		});

		it('the "lastPriceT" should be 113.55', function() {
			expect(x.lastPriceT).toEqual(113.55);
		});

		it('the "volume" should come from the "combined" session', function() {
			expect(x.volume).toEqual(36258067);
		});
	});

	describe('for an instrument that is not settled, but has a postmarket (form-T) trade', function() {
		var x;

		beforeEach(function() {
			x = parseMessage('%<QUOTE symbol="BAC" name="Bank of America Corp" exchange="NYSE" basecode="A" pointvalue="1.0" tickincrement="1" ddfexchange="N" lastupdate="20160920152208" bid="1558" bidsize="20" ask="1559" asksize="1" mode="I"><SESSION day="J" session="R" timestamp="20160920160021" open="1574" high="1576" low="1551" last="1560" previous="1559" tradesize="1483737" volume="67399368" numtrades="96903" pricevolume="1041029293.48" tradetime="20160920160021" ticks=".." id="combined"/><SESSION day="I" timestamp="20160919000000" open="1555" high="1578" low="1555" last="1559" previous="1549" settlement="1559" volume="66174800" ticks=".." id="previous"/><SESSION day="J" session="R" previous="1559" volume="1772" id="session_J_R"/><SESSION day="J" session="T" timestamp="20160920160527" last="1559" previous="1559" tradesize="1175" volume="296998" numtrades="356" pricevolume="4652652.89" tradetime="20160920160527" ticks=".." id="session_J_T"/></QUOTE>');
		});

		it('the "flag" should not be "s"', function() {
			expect(x.flag).not.toEqual('s');
		});

		it('the "session" should not be "T"', function() {
			expect(x.session).not.toEqual('T');
		});

		it('the "sessionT" should be true', function() {
			expect(x.sessionT).toEqual(true);
		});

		it('the "lastPrice" should be 15.60', function() {
			expect(x.lastPrice).toEqual(15.60);
		});

		it('the "lastPriceT" should be 15.59', function() {
			expect(x.lastPriceT).toEqual(15.59);
		});

		it('the "volume" should come from the "combined" session', function() {
			expect(x.volume).toEqual(67399368);
		});
	});
});

describe('when parsing a DDF message', function() {
	describe('for a 2,Z message for SIRI, 3@3.94', function() {
		var x;

		beforeEach(function() {
			x = parseMessage('\x012SIRI,Z AQ15394,3,1I');
		});

		it('the "record" should be "2"', function() {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "Z"', function() {
			expect(x.subrecord).toEqual('Z');
		});

		it('the "symbol" should be "SIRI"', function() {
			expect(x.symbol).toEqual('SIRI');
		});

		it('the "type" should be "TRADE_OUT_OF_SEQUENCE"', function() {
			expect(x.type).toEqual('TRADE_OUT_OF_SEQUENCE');
		});

		it('the "tradePrice" should be 3.94', function() {
			expect(x.tradePrice).toEqual(3.94);
		});

		it('the "tradeSize" should be 3', function() {
			expect(x.tradeSize).toEqual(3);
		});
	});

	describe('for a 2,Z message for SIRI, 2998262@3.95', function() {
		var x;

		beforeEach(function() {
			x = parseMessage('\x012SIRI,Z AQ15395,2998262,1W');
		});

		it('the "record" should be "2"', function() {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "Z"', function() {
			expect(x.subrecord).toEqual('Z');
		});

		it('the "symbol" should be "SIRI"', function() {
			expect(x.symbol).toEqual('SIRI');
		});

		it('the "type" should be "TRADE_OUT_OF_SEQUENCE"', function() {
			expect(x.type).toEqual('TRADE_OUT_OF_SEQUENCE');
		});

		it('the "tradePrice" should be 3.95', function() {
			expect(x.tradePrice).toEqual(3.95);
		});

		it('the "tradeSize" should be 2998262', function() {
			expect(x.tradeSize).toEqual(2998262);
		});
	});

	describe('for a 2,0 message for AAPL', function() {
		var x;

		beforeEach(function() {
			x = parseMessage('\x012AAPL,0\x02AQ1510885,D0M \x03\x14PHWQT@\x04$');
		});

		it('the "record" should be "2"', function() {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "0"', function() {
			expect(x.subrecord).toEqual('0');
		});

		it('the "symbol" should be "AAPL"', function() {
			expect(x.symbol).toEqual('AAPL');
		});

		it('the "type" should be "SETTLEMENT"', function() {
			expect(x.type).toEqual('SETTLEMENT');
		});

		it('the "value" should be 108.85', function() {
			expect(x.value).toEqual(108.85);
		});
	});

	describe('for a 2,Z message for TSLA', function() {
		var x;

		beforeEach(function() {
			x = parseMessage('\x012TSLA,Z\x02AQ1521201,3,TI\x03');
		});

		it('the "record" should be "2"', function() {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "Z"', function() {
			expect(x.subrecord).toEqual('Z');
		});

		it('the "symbol" should be "AAPL"', function() {
			expect(x.symbol).toEqual('TSLA');
		});

		it('the "type" should be "TRADE_OUT_OF_SEQUENCE"', function() {
			expect(x.type).toEqual('TRADE_OUT_OF_SEQUENCE');
		});

		it('the "tradePrice" should be "212.01"', function() {
			expect(x.tradePrice).toEqual(212.01);
		});

		it('the "day" should be "T"', function() {
			expect(x.day).toEqual('T');
		});

		it('the "session" should be "I"', function() {
			expect(x.session).toEqual('I');
		});
	});
});

},{"../../../lib/messageParser/parseMessage":3}],22:[function(require,module,exports){
var parseValue = require('../../../lib/messageParser/parseValue');

describe('when parsing prices', function() {
	'use strict';

	describe('with a decimal fraction separator', function() {
		it('returns 377 (with unit code 2) when parsing "377.000"', function() {
			expect(parseValue('377.000', '2')).toEqual(377);
		});

		it('returns 377.5 (with unit code 2) when parsing "377.500"', function() {
			expect(parseValue('377.500', '2')).toEqual(377.5);
		});

		it('returns 377.75 (with unit code 2) when parsing "377.750"', function() {
			expect(parseValue('377.750', '2')).toEqual(377.75);
		});
	});

	describe('with a dash fraction separator', function() {
		it('returns 123 (with unit code 2) when parsing "123-0"', function() {
			expect(parseValue('123-0', '2')).toEqual(123);
		});

		it('returns 123.5 (with unit code 2) when parsing "123-4"', function() {
			expect(parseValue('123-4', '2')).toEqual(123.5);
		});

		it('returns 0.5 (with unit code 2) when parsing "0-4"', function() {
			expect(parseValue('0-4', '2')).toEqual(0.5);
		});

		it('returns 0 (with unit code 2) when parsing "0-0"', function() {
			expect(parseValue('0-0', '2')).toEqual(0);
		});

		it('returns undefined (with unit code 2) when parsing zero-length string', function() {
			expect(parseValue('', '2')).toEqual(undefined);
		});
	});

	describe('with a tick fraction separator', function() {
		it('returns 123 (with unit code 2) when parsing "123\'0"', function() {
			expect(parseValue('123\'0', '2')).toEqual(123);
		});

		it('returns 123.5 (with unit code 2) when parsing "123\'4"', function() {
			expect(parseValue('123\'4', '2')).toEqual(123.5);
		});

		it('returns 0.5 (with unit code 2) when parsing "0\'4"', function() {
			expect(parseValue('0\'4', '2')).toEqual(0.5);
		});

		it('returns 0 (with unit code 2) when parsing "0\'0"', function() {
			expect(parseValue('0\'0', '2')).toEqual(0);
		});

		it('returns undefined (with unit code 2) when parsing zero-length string', function() {
			expect(parseValue('', '2')).toEqual(undefined);
		});
	});
});
},{"../../../lib/messageParser/parseValue":5}],23:[function(require,module,exports){
var convertBaseCodeToUnitCode = require('../../../lib/util/convertBaseCodeToUnitCode');

describe('When converting a baseCode to a unitCode', function() {
	it('-1 should translate to "2"', function() {
		expect(convertBaseCodeToUnitCode(-1)).toEqual('2');
	});
});
},{"../../../lib/util/convertBaseCodeToUnitCode":6}],24:[function(require,module,exports){
var convertDayCodeToNumber = require('../../../lib/util/convertDayCodeToNumber');

describe('When converting a dayCode to number', function() {
	it('"1" should translate to 1', function() {
		expect(convertDayCodeToNumber("1")).toEqual(1);
	});

	it('"2" should translate to 2', function() {
		expect(convertDayCodeToNumber("2")).toEqual(2);
	});

	it('"3" should translate to 3', function() {
		expect(convertDayCodeToNumber("3")).toEqual(3);
	});

	it('"4" should translate to 4', function() {
		expect(convertDayCodeToNumber("4")).toEqual(4);
	});

	it('"5" should translate to 5', function() {
		expect(convertDayCodeToNumber("5")).toEqual(5);
	});

	it('"6" should translate to 6', function() {
		expect(convertDayCodeToNumber("6")).toEqual(6);
	});

	it('"7" should translate to 7', function() {
		expect(convertDayCodeToNumber("7")).toEqual(7);
	});

	it('"8" should translate to 8', function() {
		expect(convertDayCodeToNumber("8")).toEqual(8);
	});

	it('"9" should translate to 9', function() {
		expect(convertDayCodeToNumber("9")).toEqual(9);
	});

	it('"0" should translate to 10', function() {
		expect(convertDayCodeToNumber("0")).toEqual(10);
	});

	it('"A" should translate to 11', function() {
		expect(convertDayCodeToNumber("A")).toEqual(11);
	});

	it('"B" should translate to 12', function() {
		expect(convertDayCodeToNumber("B")).toEqual(12);
	});

	it('"C" should translate to 13', function() {
		expect(convertDayCodeToNumber("C")).toEqual(13);
	});

	it('"D" should translate to 14', function() {
		expect(convertDayCodeToNumber("D")).toEqual(14);
	});

	it('"E" should translate to 15', function() {
		expect(convertDayCodeToNumber("E")).toEqual(15);
	});

	it('"F" should translate to 16', function() {
		expect(convertDayCodeToNumber("F")).toEqual(16);
	});

	it('"GF" should translate to 17', function() {
		expect(convertDayCodeToNumber("G")).toEqual(17);
	});

	it('"H" should translate to 18', function() {
		expect(convertDayCodeToNumber("H")).toEqual(18);
	});

	it('"I" should translate to 19', function() {
		expect(convertDayCodeToNumber("I")).toEqual(19);
	});

	it('"J" should translate to 20', function() {
		expect(convertDayCodeToNumber("J")).toEqual(20);
	});

	it('"K" should translate to 21', function() {
		expect(convertDayCodeToNumber("K")).toEqual(21);
	});

	it('"L" should translate to 22', function() {
		expect(convertDayCodeToNumber("L")).toEqual(22);
	});

	it('"M" should translate to 23', function() {
		expect(convertDayCodeToNumber("M")).toEqual(23);
	});

	it('"N" should translate to 24', function() {
		expect(convertDayCodeToNumber("N")).toEqual(24);
	});

	it('"O" should translate to 25', function() {
		expect(convertDayCodeToNumber("O")).toEqual(25);
	});

	it('"P" should translate to 26', function() {
		expect(convertDayCodeToNumber("P")).toEqual(26);
	});

	it('"Q" should translate to 27', function() {
		expect(convertDayCodeToNumber("Q")).toEqual(27);
	});

	it('"R" should translate to 28', function() {
		expect(convertDayCodeToNumber("R")).toEqual(28);
	});

	it('"S" should translate to 29', function() {
		expect(convertDayCodeToNumber("S")).toEqual(29);
	});

	it('"T" should translate to 30', function() {
		expect(convertDayCodeToNumber("T")).toEqual(30);
	});

	it('"U" should translate to 31', function() {
		expect(convertDayCodeToNumber("U")).toEqual(31);
	});
});
},{"../../../lib/util/convertDayCodeToNumber":7}],25:[function(require,module,exports){
var convertUnitCodeToBaseCode = require('../../../lib/util/convertUnitCodeToBaseCode');

describe('When converting a unitCode to a baseCode', function() {
	it('"2" should translate to -1', function() {
		expect(convertUnitCodeToBaseCode('2')).toEqual(-1);
	});
});
},{"../../../lib/util/convertUnitCodeToBaseCode":8}],26:[function(require,module,exports){
var monthCodes = require('../../../lib/util/monthCodes');

describe('When looking up a month name by code', function() {
	var map;

	beforeEach(function() {
		map = monthCodes;
	});

	it('"F" should map to "January"', function() {
		expect(map.F).toEqual("January");
	});

	it('"G" should map to "February"', function() {
		expect(map.G).toEqual("February");
	});

	it('"H" should map to "March"', function() {
		expect(map.H).toEqual("March");
	});

	it('"J" should map to "April"', function() {
		expect(map.J).toEqual("April");
	});

	it('"K" should map to "May"', function() {
		expect(map.K).toEqual("May");
	});

	it('"M" should map to "June"', function() {
		expect(map.M).toEqual("June");
	});

	it('"N" should map to "July"', function() {
		expect(map.N).toEqual("July");
	});

	it('"Q" should map to "August"', function() {
		expect(map.Q).toEqual("August");
	});

	it('"U" should map to "September"', function() {
		expect(map.U).toEqual("September");
	});

	it('"V" should map to "October"', function() {
		expect(map.V).toEqual("October");
	});

	it('"X" should map to "November"', function() {
		expect(map.X).toEqual("November");
	});

	it('"Z" should map to "December"', function() {
		expect(map.Z).toEqual("December");
	});
});
},{"../../../lib/util/monthCodes":9}],27:[function(require,module,exports){
var PriceFormatter = require('../../../lib/util/priceFormatter');

describe('When a price formatter is created', function() {
	var priceFormatter;

	describe('with a dash fraction separator and no special fractions', function() {
		beforeEach(function() {
			priceFormatter = new PriceFormatter('-', false);
		});

		it('formats 123 (with unit code 2) as "123-0"', function() {
			expect(priceFormatter.format(123, '2')).toEqual('123-0');
		});

		it('formats 123.5 (with unit code 2) as "123-4"', function() {
			expect(priceFormatter.format(123.5, '2')).toEqual('123-4');
		});

		it('formats 0.5 (with unit code 2) as "0-4"', function() {
			expect(priceFormatter.format(0.5, '2')).toEqual('0-4');
		});

		it('formats 0 (with unit code 2) as "0-0"', function() {
			expect(priceFormatter.format(0, '2')).toEqual('0-0');
		});

		it('formats zero-length string (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format('', '2')).toEqual('');
		});

		it('formats undefined (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(Number.NaN, '2')).toEqual('');
		});
	});

	describe('with a tick fraction separator and no special fractions', function() {
		beforeEach(function() {
			priceFormatter = new PriceFormatter('\'', false);
		});

		it('formats 123 (with unit code 2) as "123\'0"', function() {
			expect(priceFormatter.format(123, '2')).toEqual('123\'0');
		});

		it('formats 123.5 (with unit code 2) as "123\'4"', function() {
			expect(priceFormatter.format(123.5, '2')).toEqual('123\'4');
		});

		it('formats 0.5 (with unit code 2) as "0\'4"', function() {
			expect(priceFormatter.format(0.5, '2')).toEqual('0\'4');
		});

		it('formats 0 (with unit code 2) as "0\'0"', function() {
			expect(priceFormatter.format(0, '2')).toEqual('0\'0');
		});

		it('formats zero-length string (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format('', '2')).toEqual('');
		});

		it('formats undefined (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(Number.NaN, '2')).toEqual('');
		});
	});

	describe('with no fraction separator and no special fractions', function() {
		beforeEach(function() {
			priceFormatter = new PriceFormatter('', false);
		});

		it('formats 123 (with unit code 2) as "1230"', function() {
			expect(priceFormatter.format(123, '2')).toEqual('1230');
		});

		it('formats 123.5 (with unit code 2) as "1234"', function() {
			expect(priceFormatter.format(123.5, '2')).toEqual('1234');
		});

		it('formats 0.5 (with unit code 2) as "4"', function() {
			expect(priceFormatter.format(0.5, '2')).toEqual('4');
		});

		it('formats 0 (with unit code 2) as "0"', function() {
			expect(priceFormatter.format(0, '2')).toEqual('0');
		});

		it('formats zero-length string (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format('', '2')).toEqual('');
		});

		it('formats undefined (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(Number.NaN, '2')).toEqual('');
		});
	});
});
},{"../../../lib/util/priceFormatter":10}]},{},[21,22,23,24,25,26,27]);
