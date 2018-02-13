(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = function () {
	'use strict';

	var object = {
		keys: function keys(target) {
			var keys = [];

			for (var k in target) {
				if (target.hasOwnProperty(k)) {
					keys.push(k);
				}
			}

			return keys;
		}
	};

	return object;
}();

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var object = require('./../common/lang/object');

module.exports = function () {
	'use strict';

	var events = {
		update: 'update',
		reset: 'reset'
	};

	/**
  * @typedef PriceLevel
  * @inner
  * @type Object
  * @property {number} price
  * @property {number} volume
  */

	/**
  * An aggregation of the total volume traded at each price level for a
  * single instrument.
  *
  * @public
  */

	var CumulativeVolume = function () {
		function CumulativeVolume(symbol, tickIncrement) {
			_classCallCheck(this, CumulativeVolume);

			/**
    * @property {string} symbol
    */
			this.symbol = symbol;

			this._tickIncrement = tickIncrement;

			this._handlers = [];

			this._priceLevels = {};
			this._highPrice = null;
			this._lowPrice = null;
		}

		/**
   * <p>Registers an event handler for a given event.</p>
   * <p>The following events are supported:
   * <ul>
   *   <li>update -- when a new price level is added, or an existing price level mutates.</li>
   *   <li>reset -- when all price levels are cleared.</li>
   * </ul>
   * </p>
   *
   * @ignore
   * @param {string} eventType
   * @param {function} handler - callback notified each time the event occurs
   */


		_createClass(CumulativeVolume, [{
			key: 'on',
			value: function on(eventType, handler) {
				var _this = this;

				if (eventType !== 'events') {
					return;
				}

				var i = this._handlers.indexOf(handler);

				if (i < 0) {
					var copy = this._handlers.slice(0);
					copy.push(handler);

					this._handlers = copy;

					this.toArray().forEach(function (priceLevel) {
						sendPriceVolumeUpdate(_this, handler, priceLevel);
					});
				}
			}

			/**
    * Unregisters an event handler for a given event. See {@link CumulativeVolume#on}.
    *
    * @ignore
    * @param {string} eventType - the event which was passed to {@link CumulativeVolume#on}
    * @param {function} handler - the callback which was passed to {@link CumulativeVolume#on}
    */

		}, {
			key: 'off',
			value: function off(eventType, handler) {
				if (eventType !== 'events') {
					return;
				}

				var i = this._handlers.indexOf(handler);

				if (!(i < 0)) {
					var copy = this._handlers.slice(0);
					copy.splice(i, 1);

					this._handlers = copy;
				}
			}

			/**
    * @ignore
    */

		}, {
			key: 'getTickIncrement',
			value: function getTickIncrement() {
				return this._tickIncrement;
			}

			/**
    * Given a numeric price, returns the volume traded at that price level.
    *
    * @public
    * @param {number} price
    * @returns {number}
    */

		}, {
			key: 'getVolume',
			value: function getVolume(price) {
				var priceString = price.toString();
				var priceLevel = this._priceLevels[priceString];

				if (priceLevel) {
					return priceLevel.volume;
				} else {
					return 0;
				}
			}

			/**
    * Increments the volume at a given price level. Used primarily
    * when a trade occurs.
    *
    * @ignore
    * @param {number} price
    * @param {number} volume - amount to add to existing cumulative volume
    */

		}, {
			key: 'incrementVolume',
			value: function incrementVolume(price, volume) {
				if (this._highPrice && this._lowPrice) {
					if (price > this._highPrice) {
						for (var p = this._highPrice + this._tickIncrement; p < price; p += this._tickIncrement) {
							broadcastPriceVolumeUpdate(this, this._handlers, addPriceVolume(this._priceLevels, p.toString(), p));
						}

						this._highPrice = price;
					} else if (price < this._lowPrice) {
						for (var _p = this._lowPrice - this._tickIncrement; _p > price; _p -= this._tickIncrement) {
							broadcastPriceVolumeUpdate(this, this._handlers, addPriceVolume(this._priceLevels, _p.toString(), _p));
						}

						this._lowPrice = price;
					}
				} else {
					this._lowPrice = this._highPrice = price;
				}

				var priceString = price.toString();
				var priceLevel = this._priceLevels[priceString];

				if (!priceLevel) {
					priceLevel = addPriceVolume(this._priceLevels, priceString, price);
				}

				priceLevel.volume += volume;

				broadcastPriceVolumeUpdate(this, this._handlers, priceLevel);
			}

			/**
    * Clears the data structure. Used primarily when a "reset" message
    * is received.
    *
    * @ignore
    */

		}, {
			key: 'reset',
			value: function reset() {
				var _this2 = this;

				this._priceLevels = {};
				this._highPrice = null;
				this._lowPrice = null;

				this._handlers.forEach(function (handler) {
					handler({ container: _this2, event: events.reset });
				});
			}

			/**
    * Returns an array of all price levels. This is an expensive operation. Observing
    * an ongoing subscription is preferred (see {@link Connection#on}).
    *
    * @return {PriceLevel[]}
    */

		}, {
			key: 'toArray',
			value: function toArray() {
				var _this3 = this;

				var array = object.keys(this._priceLevels).map(function (p) {
					var priceLevel = _this3._priceLevels[p];

					return {
						price: priceLevel.price,
						volume: priceLevel.volume
					};
				});

				array.sort(function (a, b) {
					return a.price - b.price;
				});

				return array;
			}
		}, {
			key: 'dispose',
			value: function dispose() {
				this._priceLevels = {};
				this._highPrice = null;
				this._lowPrice = null;

				this._handlers = [];
			}

			/**
    * Copies the price levels from one {@link CumulativeVolume} instance to
    * a newly {@link CumulativeVolume} created instance.
    *
    * @ignore
    * @param {string} symbol - The symbol to assign to the cloned instance.
    * @param {CumulativeVolume} source - The instance to copy.
    * @return {CumulativeVolume}
    */

		}], [{
			key: 'clone',
			value: function clone(symbol, source) {
				var clone = new CumulativeVolume(symbol, source.getTickIncrement());

				source.toArray().forEach(function (priceLevel) {
					clone.incrementVolume(priceLevel.price, priceLevel.volume);
				});

				return clone;
			}
		}]);

		return CumulativeVolume;
	}();

	var sendPriceVolumeUpdate = function sendPriceVolumeUpdate(container, handler, priceLevel) {
		try {
			handler({
				container: container,
				event: events.update,
				price: priceLevel.price,
				volume: priceLevel.volume
			});
		} catch (e) {
			console.error('An error was thrown by a cumulative volume observer.', e);
		}
	};

	var broadcastPriceVolumeUpdate = function broadcastPriceVolumeUpdate(container, handlers, priceLevel) {
		handlers.forEach(function (handler) {
			sendPriceVolumeUpdate(container, handler, priceLevel);
		});
	};

	var addPriceVolume = function addPriceVolume(priceLevels, priceString, price) {
		var priceLevel = {
			price: price,
			volume: 0
		};

		priceLevels[priceString] = priceLevel;

		return priceLevel;
	};

	return CumulativeVolume;
}();

},{"./../common/lang/object":1}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var parseSymbolType = require('./../util/parseSymbolType'),
    priceFormatter = require('./../util/priceFormatter');

module.exports = function () {
	'use strict';

	var profiles = {};
	var formatter = priceFormatter('-', true, ',').format;

	/**
  * Describes an instrument.
  *
  * @public
  */

	var Profile = function () {
		function Profile(symbol, name, exchange, unitCode, pointValue, tickIncrement) {
			_classCallCheck(this, Profile);

			/**
    * @property {string} symbol - the instrument's symbol
    */
			this.symbol = symbol;

			/**
    * @property {string} name - the instrument's name
    */
			this.name = name;

			/**
    * @property {string} exchange - the code for the listing exchange
    */
			this.exchange = exchange;

			/**
    * @property {string} unitCode - code used to describe how a price should be formatted
    */
			this.unitCode = unitCode;

			/**
    * @property {string} pointValue - the change in dollar value for a one point change in price
    */
			this.pointValue = pointValue;

			/**
    * @property {number} tickIncrement - the minimum price movement
    */
			this.tickIncrement = tickIncrement;

			var info = parseSymbolType(this.symbol);

			if (info) {
				if (info.type === 'future') {
					/**
      * @property {undefined|string} root - he root symbol, if a future; otherwise undefined
      */
					this.root = info.root;

					/**
      * @property {undefined|string} month - the month code, if a future; otherwise undefined
      */
					this.month = info.month;

					/**
      * @property {undefined|number} year - the expiration year, if a symbol; otherwise undefined
      */
					this.year = info.year;
				}
			}

			profiles[symbol] = this;
		}

		/**
   * Given a numeric price, returns a human-readable price.
   *
   * @public
   * @param {number} price
   * @returns {string}
   */


		_createClass(Profile, [{
			key: 'formatPrice',
			value: function formatPrice(price) {
				return formatter(price, this.unitCode);
			}

			/**
    * Configures the logic used to format all prices using the {@link Profile#formatPrice} instance function.
    *
    * @public
    * @param {string} fractionSeparator - usually a dash or a period
    * @param {boolean} specialFractions - usually true
    * @param {string=} thousandsSeparator - usually a comma
    */

		}], [{
			key: 'setPriceFormatter',
			value: function setPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator) {
				formatter = priceFormatter(fractionSeparator, specialFractions, thousandsSeparator).format;
			}

			/**
    * Alias for {@link Profile.setPriceFormatter} function.
    *
    * @deprecated
    * @public
    * @see {@link Profile.setPriceFormatter}
    */

		}, {
			key: 'PriceFormatter',
			value: function PriceFormatter(fractionSeparator, specialFractions, thousandsSeparator) {
				Profile.setPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator);
			}

			/**
    * @protected
    * @ignore
    */

		}, {
			key: 'Profiles',
			get: function get() {
				return profiles;
			}
		}]);

		return Profile;
	}();

	return Profile;
}();

},{"./../util/parseSymbolType":4,"./../util/priceFormatter":5}],4:[function(require,module,exports){
'use strict';

var utilities = require('@barchart/marketdata-utilities-js');

module.exports = function () {
	'use strict';

	return utilities.symbolParser.parseInstrumentType;
}();

},{"@barchart/marketdata-utilities-js":10}],5:[function(require,module,exports){
'use strict';

var utilities = require('@barchart/marketdata-utilities-js');

module.exports = function () {
	'use strict';

	return utilities.priceFormatter;
}();

},{"@barchart/marketdata-utilities-js":10}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
    'use strict';

    var XmlDomParserBase = function () {
        function XmlDomParserBase() {
            _classCallCheck(this, XmlDomParserBase);
        }

        _createClass(XmlDomParserBase, [{
            key: 'parse',
            value: function parse(textDocument) {
                if (typeof textDocument !== 'string') {
                    throw new Error('The "textDocument" argument must be a string.');
                }

                return this._parse(textDocument);
            }
        }, {
            key: '_parse',
            value: function _parse(textDocument) {
                return null;
            }
        }, {
            key: 'toString',
            value: function toString() {
                return '[XmlDomParserBase]';
            }
        }]);

        return XmlDomParserBase;
    }();

    return XmlDomParserBase;
}();

},{}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var XmlDomParserBase = require('./../XmlDomParserBase');

module.exports = function () {
    'use strict';

    var XmlDomParser = function (_XmlDomParserBase) {
        _inherits(XmlDomParser, _XmlDomParserBase);

        function XmlDomParser() {
            _classCallCheck(this, XmlDomParser);

            var _this = _possibleConstructorReturn(this, (XmlDomParser.__proto__ || Object.getPrototypeOf(XmlDomParser)).call(this));

            if (window.DOMParser) {
                _this._xmlDomParser = new DOMParser();
            } else {
                _this._xmlDomParser = null;
            }
            return _this;
        }

        _createClass(XmlDomParser, [{
            key: '_parse',
            value: function _parse(textDocument) {
                var xmlDocument = void 0;

                if (this._xmlDomParser) {
                    xmlDocument = this._xmlDomParser.parseFromString(textDocument, 'text/xml');
                } else {
                    xmlDocument = new ActiveXObject('Microsoft.XMLDOM');
                    xmlDocument.async = 'false';
                    xmlDocument.loadXML(textDocument);
                }

                return xmlDocument;
            }
        }, {
            key: 'toString',
            value: function toString() {
                return '[XmlDomParser]';
            }
        }]);

        return XmlDomParser;
    }(XmlDomParserBase);

    return XmlDomParser;
}();

},{"./../XmlDomParserBase":6}],8:[function(require,module,exports){
'use strict';

module.exports = function () {
	'use strict';

	return {
		unitCodeToBaseCode: function unitCodeToBaseCode(unitCode) {
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

		baseCodeToUnitCode: function baseCodeToUnitCode(baseCode) {
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
		},

		dateToDayCode: function dateToDayCode(date) {
			var d = date.getDate();

			if (d >= 1 && d <= 9) {
				return String.fromCharCode("1".charCodeAt(0) + d - 1);
			} else if (d == 10) {
				return '0';
			} else {
				return String.fromCharCode("A".charCodeAt(0) + d - 11);
			}
		},

		dayCodeToNumber: function dayCodeToNumber(dayCode) {
			var d = parseInt(dayCode, 31);

			if (d > 9) {
				d++;
			} else if (d === 0) {
				d = 10;
			}

			return d;
		}
	};
}();

},{}],9:[function(require,module,exports){
'use strict';

var lodashIsNaN = require('lodash.isnan');

module.exports = function () {
	'use strict';

	return function (value, digits, thousandsSeparator, useParenthesis) {
		if (value === '' || value === undefined || value === null || lodashIsNaN(value)) {
			return '';
		}

		var applyParenthesis = value < 0 && useParenthesis === true;

		if (applyParenthesis) {
			value = 0 - value;
		}

		var returnRef = value.toFixed(digits);

		if (thousandsSeparator && !(value > -1000 && value < 1000)) {
			var length = returnRef.length;
			var negative = value < 0;

			var found = digits === 0;
			var counter = 0;

			var buffer = [];

			for (var i = length - 1; !(i < 0); i--) {
				if (counter === 3 && !(negative && i === 0)) {
					buffer.unshift(thousandsSeparator);

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

			if (applyParenthesis) {
				buffer.unshift('(');
				buffer.push(')');
			}

			returnRef = buffer.join('');
		} else if (applyParenthesis) {
			returnRef = '(' + returnRef + ')';
		}

		return returnRef;
	};
}();

},{"lodash.isnan":19}],10:[function(require,module,exports){
'use strict';

var convert = require('./convert'),
    decimalFormatter = require('./decimalFormatter'),
    messageParser = require('./messageParser'),
    monthCodes = require('./monthCodes'),
    priceFormatter = require('./priceFormatter'),
    symbolFormatter = require('./symbolFormatter'),
    symbolParser = require('./symbolParser'),
    priceParser = require('./priceParser'),
    timeFormatter = require('./timeFormatter'),
    timestampParser = require('./timestampParser');

module.exports = function () {
	'use strict';

	return {
		convert: convert,
		decimalFormatter: decimalFormatter,
		monthCodes: monthCodes,
		messageParser: messageParser,
		priceFormatter: priceFormatter,
		symbolParser: symbolParser,
		priceParser: priceParser,
		symbolFormatter: symbolFormatter,
		timeFormatter: timeFormatter,
		timestampParser: timestampParser
	};
}();

},{"./convert":8,"./decimalFormatter":9,"./messageParser":11,"./monthCodes":12,"./priceFormatter":13,"./priceParser":14,"./symbolFormatter":15,"./symbolParser":16,"./timeFormatter":17,"./timestampParser":18}],11:[function(require,module,exports){
'use strict';

var parseValue = require('./priceParser'),
    parseTimestamp = require('./timestampParser'),
    XmlDomParser = require('./common/xml/XmlDomParser');

module.exports = function () {
	'use strict';

	return function (msg) {
		var message = {
			message: msg,
			type: null
		};

		switch (msg.substr(0, 1)) {
			case '%':
				{
					// Jerq Refresh Messages
					var xmlDocument = void 0;

					try {
						var xmlDomParser = new XmlDomParser();
						xmlDocument = xmlDomParser.parse(msg.substring(1));
					} catch (e) {
						xmlDocument = undefined;
					}

					if (xmlDocument) {
						var node = xmlDocument.firstChild;

						switch (node.nodeName) {
							case 'BOOK':
								{
									message.symbol = node.attributes.getNamedItem('symbol').value;
									message.unitcode = node.attributes.getNamedItem('basecode').value;
									message.askDepth = parseInt(node.attributes.getNamedItem('bidcount').value);
									message.bidDepth = parseInt(node.attributes.getNamedItem('bidcount').value);
									message.asks = [];
									message.bids = [];

									var ary1 = void 0,
									    ary2 = void 0;

									if (node.attributes.getNamedItem('askprices') && node.attributes.getNamedItem('asksizes')) {
										ary1 = node.attributes.getNamedItem('askprices').value.split(',');
										ary2 = node.attributes.getNamedItem('asksizes').value.split(',');

										for (var i = 0; i < ary1.length; i++) {
											message.asks.push({ "price": parseValue(ary1[i], message.unitcode), "size": parseInt(ary2[i]) });
										}
									}

									if (node.attributes.getNamedItem('bidprices') && node.attributes.getNamedItem('bidsizes')) {
										ary1 = node.attributes.getNamedItem('bidprices').value.split(',');
										ary2 = node.attributes.getNamedItem('bidsizes').value.split(',');

										for (var _i = 0; _i < ary1.length; _i++) {
											message.bids.push({ "price": parseValue(ary1[_i], message.unitcode), "size": parseInt(ary2[_i]) });
										}
									}

									message.type = 'BOOK';
									break;
								}
							case 'QUOTE':
								{
									for (var _i2 = 0; _i2 < node.attributes.length; _i2++) {
										switch (node.attributes[_i2].name) {
											case 'symbol':
												message.symbol = node.attributes[_i2].value;
												break;
											case 'name':
												message.name = node.attributes[_i2].value;
												break;
											case 'exchange':
												message.exchange = node.attributes[_i2].value;
												break;
											case 'basecode':
												message.unitcode = node.attributes[_i2].value;
												break;
											case 'pointvalue':
												message.pointValue = parseFloat(node.attributes[_i2].value);
												break;
											case 'tickincrement':
												message.tickIncrement = parseInt(node.attributes[_i2].value);
												break;
											case 'flag':
												message.flag = node.attributes[_i2].value;
												break;
											case 'lastupdate':
												{
													var v = node.attributes[_i2].value;
													message.lastUpdate = new Date(parseInt(v.substr(0, 4)), parseInt(v.substr(4, 2)) - 1, parseInt(v.substr(6, 2)), parseInt(v.substr(8, 2)), parseInt(v.substr(10, 2)), parseInt(v.substr(12, 2)));
													break;
												}
											case 'bid':
												message.bidPrice = parseValue(node.attributes[_i2].value, message.unitcode);
												break;
											case 'bidsize':
												message.bidSize = parseInt(node.attributes[_i2].value);
												break;
											case 'ask':
												message.askPrice = parseValue(node.attributes[_i2].value, message.unitcode);
												break;
											case 'asksize':
												message.askSize = parseInt(node.attributes[_i2].value);
												break;
											case 'mode':
												message.mode = node.attributes[_i2].value;
												break;
										}

										var sessions = {};

										for (var j = 0; j < node.childNodes.length; j++) {
											if (node.childNodes[j].nodeName == 'SESSION') {
												var s = {};
												var attributes = node.childNodes[j].attributes;

												if (attributes.getNamedItem('id')) s.id = attributes.getNamedItem('id').value;
												if (attributes.getNamedItem('day')) s.day = attributes.getNamedItem('day').value;
												if (attributes.getNamedItem('last')) s.lastPrice = parseValue(attributes.getNamedItem('last').value, message.unitcode);
												if (attributes.getNamedItem('previous')) s.previousPrice = parseValue(attributes.getNamedItem('previous').value, message.unitcode);
												if (attributes.getNamedItem('open')) s.openPrice = parseValue(attributes.getNamedItem('open').value, message.unitcode);
												if (attributes.getNamedItem('high')) s.highPrice = parseValue(attributes.getNamedItem('high').value, message.unitcode);
												if (attributes.getNamedItem('low')) s.lowPrice = parseValue(attributes.getNamedItem('low').value, message.unitcode);
												if (attributes.getNamedItem('tradesize')) s.tradeSize = parseInt(attributes.getNamedItem('tradesize').value);
												if (attributes.getNamedItem('numtrades')) s.numberOfTrades = parseInt(attributes.getNamedItem('numtrades').value);
												if (attributes.getNamedItem('settlement')) s.settlementPrice = parseValue(attributes.getNamedItem('settlement').value, message.unitcode);
												if (attributes.getNamedItem('volume')) s.volume = parseInt(attributes.getNamedItem('volume').value);
												if (attributes.getNamedItem('openinterest')) s.openInterest = parseInt(attributes.getNamedItem('openinterest').value);
												if (attributes.getNamedItem('timestamp')) {
													var _v = attributes.getNamedItem('timestamp').value;
													s.timeStamp = new Date(parseInt(_v.substr(0, 4)), parseInt(_v.substr(4, 2)) - 1, parseInt(_v.substr(6, 2)), parseInt(_v.substr(8, 2)), parseInt(_v.substr(10, 2)), parseInt(_v.substr(12, 2)));
												}
												if (attributes.getNamedItem('tradetime')) {
													var _v2 = attributes.getNamedItem('tradetime').value;
													s.tradeTime = new Date(parseInt(_v2.substr(0, 4)), parseInt(_v2.substr(4, 2)) - 1, parseInt(_v2.substr(6, 2)), parseInt(_v2.substr(8, 2)), parseInt(_v2.substr(10, 2)), parseInt(_v2.substr(12, 2)));
												}

												if (s.id) sessions[s.id] = s;
											}
										}

										var premarket = typeof sessions.combined.lastPrice === 'undefined';
										var postmarket = !premarket && typeof sessions.combined.settlementPrice !== 'undefined';

										var session = premarket ? sessions.previous : sessions.combined;

										if (sessions.combined.previousPrice) {
											message.previousPrice = sessions.combined.previousPrice;
										} else {
											message.previousPrice = sessions.previous.previousPrice;
										}

										if (session.lastPrice) message.lastPrice = session.lastPrice;
										if (session.openPrice) message.openPrice = session.openPrice;
										if (session.highPrice) message.highPrice = session.highPrice;
										if (session.lowPrice) message.lowPrice = session.lowPrice;
										if (session.tradeSize) message.tradeSize = session.tradeSize;
										if (session.numberOfTrades) message.numberOfTrades = session.numberOfTrades;
										if (session.settlementPrice) message.settlementPrice = session.settlementPrice;
										if (session.volume) message.volume = session.volume;
										if (session.openInterest) message.openInterest = session.openInterest;
										if (session.id === 'combined' && sessions.previous.openInterest) message.openInterest = sessions.previous.openInterest;
										if (session.timeStamp) message.timeStamp = session.timeStamp;
										if (session.tradeTime) message.tradeTime = session.tradeTime;

										// 2016/10/29, BRI. We have a problem where we don't "roll" quotes
										// for futures. For example, LEZ16 doesn't "roll" the settlementPrice
										// to the previous price -- so, we did this on the open message (2,0A).
										// Eero has another idea. Perhaps we are setting the "day" improperly
										// here. Perhaps we should base the day off of the actual session
										// (i.e. "session" variable) -- instead of taking it from the "combined"
										// session.

										if (sessions.combined.day) message.day = sessions.combined.day;
										if (premarket && typeof message.flag === 'undefined') message.flag = 'p';

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

													var sessionIsEvening = void 0;

													if (tradeTimeT) {
														var noon = new Date(tradeTimeT.getFullYear(), tradeTimeT.getMonth(), tradeTimeT.getDate(), 12, 0, 0, 0);

														sessionIsEvening = tradeTimeT.getTime() > noon.getTime();
													} else {
														sessionIsEvening = false;
													}

													message.sessionT = sessionIsEvening;

													var sessionIsCurrent = premarket || sessionIsEvening;

													if (sessionIsCurrent) {
														message.lastPriceT = lastPriceT;
													}

													if (premarket || postmarket) {
														message.session = 'T';

														if (sessionIsCurrent) {
															if (tradeTimeT) {
																message.tradeTime = tradeTimeT;
															}

															if (tradeSizeT) {
																message.tradeSize = tradeSizeT;
															}
														}

														if (premarket) {
															if (t.volume) {
																message.volume = t.volume;
															}

															if (t.previousPrice) {
																message.previousPrice = t.previousPrice;
															}
														}
													}
												}
											}
										}
									}

									message.type = 'REFRESH_QUOTE';
									break;
								}
							case 'CV':
								{
									message.type = 'REFRESH_CUMULATIVE_VOLUME';
									message.symbol = node.attributes.getNamedItem('symbol').value;
									message.unitCode = node.attributes.getNamedItem('basecode').value;
									message.tickIncrement = parseValue(node.attributes.getNamedItem('tickincrement').value, message.unitCode);

									var dataAttribute = node.attributes.getNamedItem('data');

									if (dataAttribute) {
										var priceLevelsRaw = dataAttribute.value || '';
										var priceLevels = priceLevelsRaw.split(':');

										for (var _i3 = 0; _i3 < priceLevels.length; _i3++) {
											var priceLevelRaw = priceLevels[_i3];
											var priceLevelData = priceLevelRaw.split(',');

											priceLevels[_i3] = {
												price: parseValue(priceLevelData[0], message.unitCode),
												volume: parseInt(priceLevelData[1])
											};
										}

										priceLevels.sort(function (a, b) {
											return a.price - b.price;
										});

										message.priceLevels = priceLevels;
									} else {
										message.priceLevels = [];
									}

									break;
								}
							default:
								console.log(msg);
								break;
						}
					}

					break;
				}
			case '\x01':
				{
					// DDF Messages
					switch (msg.substr(1, 1)) {
						case '#':
							{
								// TO DO: Standardize the timezones for Daylight Savings
								message.type = 'TIMESTAMP';
								message.timestamp = new Date(parseInt(msg.substr(2, 4)), parseInt(msg.substr(6, 2)) - 1, parseInt(msg.substr(8, 2)), parseInt(msg.substr(10, 2)), parseInt(msg.substr(12, 2)), parseInt(msg.substr(14, 2)));
								break;
							}
						case '2':
							{
								message.record = '2';
								var pos = msg.indexOf(',', 0);
								message.symbol = msg.substring(2, pos);
								message.subrecord = msg.substr(pos + 1, 1);
								message.unitcode = msg.substr(pos + 3, 1);
								message.exchange = msg.substr(pos + 4, 1);
								message.delay = parseInt(msg.substr(pos + 5, 2));
								switch (message.subrecord) {
									case '0':
										{
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
													if (message.modifier == '1') message.type = 'OPEN_INTEREST';
													break;
												case 'D':
												case 'd':
													if (message.modifier == '0') message.type = 'SETTLEMENT';
													break;
												case 'V':
													if (message.modifier == '0') message.type = 'VWAP';
													break;
												case '0':
													{
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
												case '7':
													{
														if (message.modifier == '1') message.type = 'VOLUME_YESTERDAY';else if (message.modifier == '6') message.type = 'VOLUME';
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
									case '4':
										{
											var ary = msg.substring(pos + 8).split(',');
											message.openPrice = parseValue(ary[0], message.unitcode);
											message.highPrice = parseValue(ary[1], message.unitcode);
											message.lowPrice = parseValue(ary[2], message.unitcode);
											message.lastPrice = parseValue(ary[3], message.unitcode);
											message.bidPrice = parseValue(ary[4], message.unitcode);
											message.askPrice = parseValue(ary[5], message.unitcode);
											message.previousPrice = parseValue(ary[7], message.unitcode);
											message.settlementPrice = parseValue(ary[10], message.unitcode);
											message.volume = ary[13].length > 0 ? parseInt(ary[13]) : undefined;
											message.openInterest = ary[12].length > 0 ? parseInt(ary[12]) : undefined;
											message.day = ary[14].substr(0, 1);
											message.session = ary[14].substr(1, 1);
											message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
											message.type = 'REFRESH_DDF';
											break;
										}
									case '7':
										{
											var _pos = msg.indexOf(',', pos + 7);
											message.tradePrice = parseValue(msg.substring(pos + 7, _pos), message.unitcode);

											pos = _pos + 1;
											_pos = msg.indexOf(',', pos);
											message.tradeSize = parseInt(msg.substring(pos, _pos));
											pos = _pos + 1;
											message.day = msg.substr(pos, 1);
											message.session = msg.substr(pos + 1, 1);
											message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
											message.type = 'TRADE';
											break;
										}
									case '8':
										{
											var _pos2 = msg.indexOf(',', pos + 7);
											message.bidPrice = parseValue(msg.substring(pos + 7, _pos2), message.unitcode);
											pos = _pos2 + 1;
											_pos2 = msg.indexOf(',', pos);
											message.bidSize = parseInt(msg.substring(pos, _pos2));
											pos = _pos2 + 1;
											_pos2 = msg.indexOf(',', pos);
											message.askPrice = parseValue(msg.substring(pos, _pos2), message.unitcode);
											pos = _pos2 + 1;
											_pos2 = msg.indexOf(',', pos);
											message.askSize = parseInt(msg.substring(pos, _pos2));
											pos = _pos2 + 1;
											message.day = msg.substr(pos, 1);
											message.session = msg.substr(pos + 1, 1);
											message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
											message.type = 'TOB';
											break;
										}
									case 'Z':
										{
											var _pos3 = msg.indexOf(',', pos + 7);
											message.tradePrice = parseValue(msg.substring(pos + 7, _pos3), message.unitcode);

											pos = _pos3 + 1;
											_pos3 = msg.indexOf(',', pos);
											message.tradeSize = parseInt(msg.substring(pos, _pos3));
											pos = _pos3 + 1;
											message.day = msg.substr(pos, 1);
											message.session = msg.substr(pos + 1, 1);
											message.time = parseTimestamp(msg.substr(msg.indexOf('\x03') + 1, 9));
											message.type = 'TRADE_OUT_OF_SEQUENCE';
											break;
										}
								}
								break;
							}
						case '3':
							{
								var _pos4 = msg.indexOf(',', 0);
								message.symbol = msg.substring(2, _pos4);
								message.subrecord = msg.substr(_pos4 + 1, 1);
								switch (message.subrecord) {
									case 'B':
										{
											message.unitcode = msg.substr(_pos4 + 3, 1);
											message.exchange = msg.substr(_pos4 + 4, 1);
											message.bidDepth = msg.substr(_pos4 + 5, 1) == 'A' ? 10 : parseInt(msg.substr(_pos4 + 5, 1));
											message.askDepth = msg.substr(_pos4 + 6, 1) == 'A' ? 10 : parseInt(msg.substr(_pos4 + 6, 1));
											message.bids = [];
											message.asks = [];
											var _ary = msg.substring(_pos4 + 8).split(',');
											for (var _i4 = 0; _i4 < _ary.length; _i4++) {
												var _ary2 = _ary[_i4].split(/[A-Z]/);
												var c = _ary[_i4].substr(_ary2[0].length, 1);
												if (c <= 'J') message.asks.push({ "price": parseValue(_ary2[0], message.unitcode), "size": parseInt(_ary2[1]) });else message.bids.push({ "price": parseValue(_ary2[0], message.unitcode), "size": parseInt(_ary2[1]) });
											}

											message.type = 'BOOK';
											break;
										}
									default:
										break;
								}

								break;
							}
						default:
							{
								message.type = 'UNKNOWN';
								break;
							}
					}
				}
		}

		return message;
	};
}();

},{"./common/xml/XmlDomParser":7,"./priceParser":14,"./timestampParser":18}],12:[function(require,module,exports){
"use strict";

module.exports = function () {
	'use strict';

	var monthMap = {};
	var numberMap = {};

	var addMonth = function addMonth(code, name, number) {
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
		getCodeToNameMap: function getCodeToNameMap() {
			return monthMap;
		},

		getCodeToNumberMap: function getCodeToNumberMap() {
			return numberMap;
		}
	};
}();

},{}],13:[function(require,module,exports){
'use strict';

var lodashIsNaN = require('lodash.isnan');
var decimalFormatter = require('./decimalFormatter');

module.exports = function () {
	'use strict';

	function frontPad(value, digits) {
		return ['000', Math.floor(value)].join('').substr(-1 * digits);
	}

	return function (fractionSeparator, specialFractions, thousandsSeparator, useParenthesis) {
		var format = void 0;

		function getWholeNumberAsString(value) {
			var val = Math.floor(value);

			if (val === 0 && fractionSeparator === '') {
				return '';
			} else {
				return val;
			}
		}

		function formatDecimal(value, digits) {
			return decimalFormatter(value, digits, thousandsSeparator, useParenthesis);
		}

		if (fractionSeparator === '.') {
			format = function format(value, unitcode) {
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
						if (value === '' || value === undefined || value === null || lodashIsNaN(value)) {
							return '';
						} else {
							return value;
						}
				}
			};
		} else {
			format = function format(value, unitcode) {
				if (value === '' || value === undefined || value === null || lodashIsNaN(value)) {
					return '';
				}

				var originalValue = value;
				var absoluteValue = Math.abs(value);

				var negative = value < 0;

				var prefix = void 0;
				var suffix = void 0;

				if (negative) {
					if (useParenthesis === true) {
						prefix = '(';
						suffix = ')';
					} else {
						prefix = '-';
						suffix = '';
					}
				} else {
					prefix = '';
					suffix = '';
				}

				switch (unitcode) {
					case '2':
						return [prefix, getWholeNumberAsString(absoluteValue), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * 8, 1), suffix].join('');
					case '3':
						return [prefix, getWholeNumberAsString(absoluteValue), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * 16, 2), suffix].join('');
					case '4':
						return [prefix, getWholeNumberAsString(absoluteValue), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * 32, 2), suffix].join('');
					case '5':
						return [prefix, getWholeNumberAsString(absoluteValue), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * (specialFractions ? 320 : 64), specialFractions ? 3 : 2), suffix].join('');
					case '6':
						return [prefix, getWholeNumberAsString(absoluteValue), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * (specialFractions ? 320 : 128), 3), suffix].join('');
					case '7':
						return [prefix, getWholeNumberAsString(absoluteValue), fractionSeparator, frontPad((absoluteValue - Math.floor(absoluteValue)) * (specialFractions ? 320 : 256), 3), suffix].join('');
					case '8':
						return formatDecimal(originalValue, 0);
					case '9':
						return formatDecimal(originalValue, 1);
					case 'A':
						return formatDecimal(originalValue, 2);
					case 'B':
						return formatDecimal(originalValue, 3);
					case 'C':
						return formatDecimal(originalValue, 4);
					case 'D':
						return formatDecimal(originalValue, 5);
					case 'E':
						return formatDecimal(originalValue, 6);
					default:
						return originalValue;
				}
			};
		}

		return {
			format: format
		};
	};
}();

},{"./decimalFormatter":9,"lodash.isnan":19}],14:[function(require,module,exports){
'use strict';

module.exports = function () {
	'use strict';

	var replaceExpressions = {};

	function getReplaceExpression(thousandsSeparator) {
		if (!replaceExpressions.hasOwnProperty(thousandsSeparator)) {
			replaceExpressions[thousandsSeparator] = new RegExp(thousandsSeparator, 'g');
		}

		return replaceExpressions[thousandsSeparator];
	}

	return function (str, unitcode, thousandsSeparator) {
		if (str.length < 1) {
			return undefined;
		} else if (str === '-') {
			return null;
		}

		if (thousandsSeparator) {
			str = str.replace(getReplaceExpression(thousandsSeparator), '');
		}

		if (!(str.indexOf('.') < 0)) {
			return parseFloat(str);
		}

		var sign = str.substr(0, 1) == '-' ? -1 : 1;

		if (sign === -1) {
			str = str.substr(1);
		}

		switch (unitcode) {
			case '2':
				// 8ths
				return sign * ((str.length > 1 ? parseInt(str.substr(0, str.length - 1)) : 0) + parseInt(str.substr(-1)) / 8);
			case '3':
				// 16ths
				return sign * ((str.length > 2 ? parseInt(str.substr(0, str.length - 2)) : 0) + parseInt(str.substr(-2)) / 16);
			case '4':
				// 32ths
				return sign * ((str.length > 2 ? parseInt(str.substr(0, str.length - 2)) : 0) + parseInt(str.substr(-2)) / 32);
			case '5':
				// 64ths
				return sign * ((str.length > 2 ? parseInt(str.substr(0, str.length - 2)) : 0) + parseInt(str.substr(-2)) / 64);
			case '6':
				// 128ths
				return sign * ((str.length > 3 ? parseInt(str.substr(0, str.length - 3)) : 0) + parseInt(str.substr(-3)) / 128);
			case '7':
				// 256ths
				return sign * ((str.length > 3 ? parseInt(str.substr(0, str.length - 3)) : 0) + parseInt(str.substr(-3)) / 256);
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

},{}],15:[function(require,module,exports){
'use strict';

module.exports = function () {
	'use strict';

	return {
		format: function format(symbol) {
			if (symbol !== null && typeof symbol === 'string') {
				return symbol.toUpperCase();
			} else {
				return symbol;
			}
		}
	};
}();

},{}],16:[function(require,module,exports){
'use strict';

module.exports = function () {
	'use strict';

	var exchangeRegex = /^(.*)\\.([A-Z]{1,4})$/i,
	    jerqFutureConversionRegex = /(.{1,3})([A-Z]{1})([0-9]{3}|[0-9]{1})?([0-9]{1})$/i,
	    concreteFutureRegex = /^(.{1,3})([A-Z]{1})([0-9]{4}|[0-9]{1,2})$/i,
	    referenceFutureRegex = /^(.{1,3})(\*{1})([0-9]{1})$/i,
	    futureSpreadRegex = /^_S_/i,
	    shortFutureOptionRegex = /^(.{1,2})([A-Z])([0-9]{1,4})([A-Z])$/i,
	    longFutureOptionRegex = /^(.{1,3})([A-Z])([0-9]{1,4})\|(\-?[0-9]{1,5})(C|P)$/i,
	    forexRegex = /^\^([A-Z]{3})([A-Z]{3})$/i,
	    sectorRegex = /^\-(.*)$/i,
	    indexRegex = /^\$(.*)$/i,
	    batsRegex = /^(.*)\.BZ$/i,
	    usePercentRegex = /(\.RT)$/;

	var altMonthCodes = {
		A: 'F', B: 'G', C: 'H', D: 'J', E: 'K', I: 'M', L: 'N', O: 'Q', P: 'U', R: 'V', S: 'X', T: 'Z'
	};

	function getIsType(symbol, type) {
		var instrumentType = symbolParser.parseInstrumentType(symbol);

		return instrumentType !== null && instrumentType.type === type;
	}

	function getFuturesYear(yearString) {
		var currentDate = new Date();
		var currentYear = currentDate.getFullYear();

		var year = parseInt(yearString);

		if (year < 10) {
			year = Math.floor(currentYear / 10) * 10 + year;
		} else if (year < 100) {
			year = Math.floor(currentYear / 100) * 100 + year;

			if (year < currentYear) {
				var alternateYear = year + 100;

				if (currentYear - year > alternateYear - currentYear) {
					year = alternateYear;
				}
			}
		}

		return year;
	}

	var symbolParser = {
		parseInstrumentType: function parseInstrumentType(symbol) {
			if (typeof symbol !== 'string') {
				return null;
			}

			var exchangeMatch = symbol.match(exchangeRegex);

			if (exchangeMatch !== null) {
				symbol = exchangeMatch[1];
			}

			if (futureSpreadRegex.test(symbol)) {
				return {
					symbol: symbol,
					type: 'future_spread'
				};
			}

			var staticFutureMatch = symbol.match(concreteFutureRegex);

			if (staticFutureMatch !== null) {
				return {
					symbol: symbol,
					type: 'future',
					root: staticFutureMatch[1],
					dynamic: false,
					month: staticFutureMatch[2],
					year: getFuturesYear(staticFutureMatch[3])
				};
			}

			var dynamicFutureMatch = symbol.match(referenceFutureRegex);

			if (dynamicFutureMatch !== null) {
				return {
					symbol: symbol,
					type: 'future',
					root: dynamicFutureMatch[1],
					dynamic: true,
					dynamicCode: dynamicFutureMatch[3]
				};
			}

			var shortFutureOptionMatch = symbol.match(shortFutureOptionRegex);

			if (shortFutureOptionMatch !== null) {
				var currentDate = new Date();
				var currentYear = currentDate.getFullYear();
				var optionType = void 0,
				    optionYear = void 0;

				if (shortFutureOptionMatch[4] >= 'P') {
					optionYear = currentYear + (shortFutureOptionMatch[4].charCodeAt(0) - 'P'.charCodeAt(0));
					optionType = 'put';
				} else {
					optionYear = currentYear + (shortFutureOptionMatch[4].charCodeAt(0) - 'C'.charCodeAt(0));
					optionType = 'call';
				}

				return {
					symbol: symbol,
					type: 'future_option',
					root: shortFutureOptionMatch[1],
					month: shortFutureOptionMatch[2],
					year: optionYear,
					strike: parseInt(shortFutureOptionMatch[3]),
					option_type: optionType
				};
			}

			var longFutureOptionMatch = symbol.match(longFutureOptionRegex);

			if (longFutureOptionMatch !== null) {
				var month = longFutureOptionMatch[2];

				return {
					symbol: symbol,
					type: 'future_option',
					root: longFutureOptionMatch[1],
					month: altMonthCodes.hasOwnProperty(month) ? altMonthCodes[month] : month,
					year: getFuturesYear(longFutureOptionMatch[3]),
					strike: parseInt(longFutureOptionMatch[4]),
					option_type: longFutureOptionMatch[5] === 'C' ? 'call' : 'put'
				};
			}

			var forexMatch = symbol.match(forexRegex);

			if (forexMatch !== null) {
				return {
					symbol: symbol,
					type: 'forex'
				};
			}

			var indexMatch = symbol.match(indexRegex);

			if (indexMatch !== null) {
				return {
					symbol: symbol,
					type: 'index'
				};
			}

			var sectorMatch = symbol.match(sectorRegex);

			if (sectorMatch !== null) {
				return {
					symbol: symbol,
					type: 'sector'
				};
			}

			return null;
		},

		getIsConcrete: function getIsConcrete(symbol) {
			return !symbolParser.getIsReference(symbol);
		},

		getIsReference: function getIsReference(symbol) {
			return referenceFutureRegex.test(symbol);
		},

		getIsFuture: function getIsFuture(symbol) {
			return getIsType(symbol, 'future');
		},

		getIsFutureSpread: function getIsFutureSpread(symbol) {
			return getIsType(symbol, 'future_spread');
		},

		getIsFutureOption: function getIsFutureOption(symbol) {
			return getIsType(symbol, 'future_option');
		},

		getIsForex: function getIsForex(symbol) {
			return getIsType(symbol, 'forex');
		},

		getIsSector: function getIsSector(symbol) {
			return getIsType(symbol, 'sector');
		},

		getIsIndex: function getIsIndex(symbol) {
			return getIsType(symbol, 'index');
		},

		getIsBats: function getIsBats(symbol) {
			return batsRegex.test(symbol);
		},

		getProducerSymbol: function getProducerSymbol(symbol) {
			if (typeof symbol === 'string') {
				return symbol.replace(jerqFutureConversionRegex, '$1$2$4');
			} else {
				return null;
			}
		},

		displayUsingPercent: function displayUsingPercent(symbol) {
			return usePercentRegex.test(symbol);
		}
	};

	return symbolParser;
}();

},{}],17:[function(require,module,exports){
'use strict';

module.exports = function () {
	'use strict';

	return function (useTwelveHourClock, short) {
		var _formatTime = void 0;

		if (useTwelveHourClock) {
			if (short) {
				_formatTime = formatTwelveHourTimeShort;
			} else {
				_formatTime = formatTwelveHourTime;
			}
		} else {
			if (short) {
				_formatTime = formatTwentyFourHourTimeShort;
			} else {
				_formatTime = formatTwentyFourHourTime;
			}
		}

		var formatters = {
			format: function format(q) {
				var t = q.time;

				if (!t) {
					return '';
				} else if (!q.lastPrice || q.flag || q.sessionT) {
					return formatters.formatDate(t);
				} else {
					return formatters.formatTime(t, q.timezone);
				}
			},

			formatTime: function formatTime(date, timezone) {
				var returnRef = void 0;

				if (date) {
					returnRef = _formatTime(date);

					if (timezone) {
						returnRef = returnRef + ' ' + timezone;
					}
				} else {
					returnRef = '';
				}

				return returnRef;
			},

			formatDate: function formatDate(date) {
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
		var period = void 0;

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
		var period = void 0;

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

},{}],18:[function(require,module,exports){
'use strict';

module.exports = function () {
	'use strict';

	return function (bytes) {
		if (bytes.length !== 9) {
			return null;
		}

		var year = bytes.charCodeAt(0) * 100 + bytes.charCodeAt(1) - 64;
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

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
'use strict';

var CumulativeVolume = require('../../../lib/marketState/CumulativeVolume');

describe('When a cumulative volume container is created with a tick increment of 0.25', function () {
	'use strict';

	var cv;

	var symbol;
	var tickIncrement;

	beforeEach(function () {
		cv = new CumulativeVolume(symbol = 'ESZ6', tickIncrement = 0.25);
	});

	it('the symbol should be the same value as assigned during construction', function () {
		expect(cv.symbol).toEqual(symbol);
	});

	it('the price level array should contain zero items', function () {
		expect(cv.toArray().length).toEqual(0);
	});

	describe('and 50 contracts are traded at 2172.50', function () {
		beforeEach(function () {
			cv.incrementVolume(2172.5, 50);
		});

		it('should report zero contracts traded at 2172.25', function () {
			expect(cv.getVolume(2172.25)).toEqual(0);
		});

		it('should report 50 contracts traded at 2172.50', function () {
			expect(cv.getVolume(2172.5)).toEqual(50);
		});

		it('should report zero contracts traded at 2172.75', function () {
			expect(cv.getVolume(2172.75)).toEqual(0);
		});

		describe('and the price level array is retrieved', function () {
			var priceLevels;

			beforeEach(function () {
				priceLevels = cv.toArray();
			});

			it('the price level array should contain one item', function () {
				expect(priceLevels.length).toEqual(1);
			});

			it('the first price level item should be for 50 contracts', function () {
				expect(priceLevels[0].volume).toEqual(50);
			});

			it('the first price level item should be priced at 2172.50', function () {
				expect(priceLevels[0].price).toEqual(2172.5);
			});
		});

		describe('and another 50 contracts are traded at 2172.50', function () {
			beforeEach(function () {
				cv.incrementVolume(2172.5, 50);
			});

			it('should report zero contracts traded at 2172.25', function () {
				expect(cv.getVolume(2172.25)).toEqual(0);
			});

			it('should report 50 contracts traded at 2172.50', function () {
				expect(cv.getVolume(2172.5)).toEqual(100);
			});

			it('should report zero contracts traded at 2172.75', function () {
				expect(cv.getVolume(2172.75)).toEqual(0);
			});

			describe('and the price level array is retrieved', function () {
				var priceLevels;

				beforeEach(function () {
					priceLevels = cv.toArray();
				});

				it('the price level array should contain one item', function () {
					expect(priceLevels.length).toEqual(1);
				});

				it('the first price level item should be for 100 contracts', function () {
					expect(priceLevels[0].volume).toEqual(100);
				});

				it('the first price level item should be priced at 2172.50', function () {
					expect(priceLevels[0].price).toEqual(2172.5);
				});
			});
		});

		describe('and 200 contracts are traded at 2172.25', function () {
			beforeEach(function () {
				cv.incrementVolume(2172.25, 200);
			});

			it('should report 200 contracts traded at 2172.25', function () {
				expect(cv.getVolume(2172.25)).toEqual(200);
			});

			it('should report 50 contracts traded at 2172.50', function () {
				expect(cv.getVolume(2172.5)).toEqual(50);
			});

			it('should report zero contracts traded at 2172.75', function () {
				expect(cv.getVolume(2172.75)).toEqual(0);
			});

			describe('and the price level array is retrieved', function () {
				var priceLevels;

				beforeEach(function () {
					priceLevels = cv.toArray();
				});

				it('the price level array should contain two items', function () {
					expect(priceLevels.length).toEqual(2);
				});

				it('the first price level item should be for 200 contracts', function () {
					expect(priceLevels[0].volume).toEqual(200);
				});

				it('the first price level item should be priced at 2172.25', function () {
					expect(priceLevels[0].price).toEqual(2172.25);
				});

				it('the second price level item should be for 50 contracts', function () {
					expect(priceLevels[1].volume).toEqual(50);
				});

				it('the second price level item should be priced at 2172.50', function () {
					expect(priceLevels[1].price).toEqual(2172.5);
				});
			});
		});

		describe('and 3 contracts are traded at 2173.50', function () {
			beforeEach(function () {
				cv.incrementVolume(2173.50, 3);
			});

			it('should report 50 contracts traded at 2172.50', function () {
				expect(cv.getVolume(2172.5)).toEqual(50);
			});

			it('should report zero contracts traded at 2172.75', function () {
				expect(cv.getVolume(2172.75)).toEqual(0);
			});

			it('should report zero contracts traded at 2173', function () {
				expect(cv.getVolume(2173)).toEqual(0);
			});

			it('should report zero contracts traded at 2173.25', function () {
				expect(cv.getVolume(2173.25)).toEqual(0);
			});

			it('should report 3 contracts traded at 2173.50', function () {
				expect(cv.getVolume(2173.50)).toEqual(3);
			});

			describe('and the price level array is retrieved', function () {
				var priceLevels;

				beforeEach(function () {
					priceLevels = cv.toArray();
				});

				it('the price level array should contain five items', function () {
					expect(priceLevels.length).toEqual(5);
				});

				it('the first price level item should be for 50 contracts', function () {
					expect(priceLevels[0].volume).toEqual(50);
				});

				it('the first price level item should be priced at 2172.50', function () {
					expect(priceLevels[0].price).toEqual(2172.5);
				});

				it('the second price level item should be for zero contracts', function () {
					expect(priceLevels[1].volume).toEqual(0);
				});

				it('the second price level item should be priced at 2172.75', function () {
					expect(priceLevels[1].price).toEqual(2172.75);
				});

				it('the third price level item should be for zero contracts', function () {
					expect(priceLevels[2].volume).toEqual(0);
				});

				it('the third price level item should be priced at 2173.00', function () {
					expect(priceLevels[2].price).toEqual(2173);
				});

				it('the fourth price level item should be for zero contracts', function () {
					expect(priceLevels[3].volume).toEqual(0);
				});

				it('the fourth price level item should be priced at 2173.25', function () {
					expect(priceLevels[3].price).toEqual(2173.25);
				});

				it('the fifth price level item should be for 3 contracts', function () {
					expect(priceLevels[4].volume).toEqual(3);
				});

				it('the fifth price level item should be priced at 2173.50', function () {
					expect(priceLevels[4].price).toEqual(2173.5);
				});
			});
		});

		describe('and 99 contracts are traded at 2172.00', function () {
			beforeEach(function () {
				cv.incrementVolume(2172.00, 99);
			});

			it('should report 99 contracts traded at 2172.00', function () {
				expect(cv.getVolume(2172.00)).toEqual(99);
			});

			it('should report zero contracts traded at 2172.25', function () {
				expect(cv.getVolume(2172.25)).toEqual(0);
			});

			it('should report 50 contracts traded at 2172.50', function () {
				expect(cv.getVolume(2172.50)).toEqual(50);
			});

			describe('and the price level array is retrieved', function () {
				var priceLevels;

				beforeEach(function () {
					priceLevels = cv.toArray();
				});

				it('the price level array should contain three items', function () {
					expect(priceLevels.length).toEqual(3);
				});

				it('the first price level item should be for 99 contracts', function () {
					expect(priceLevels[0].volume).toEqual(99);
				});

				it('the first price level item should be priced at 2172.00', function () {
					expect(priceLevels[0].price).toEqual(2172);
				});

				it('the second price level item should be for zero contracts', function () {
					expect(priceLevels[1].volume).toEqual(0);
				});

				it('the second price level item should be priced at 2172.25', function () {
					expect(priceLevels[1].price).toEqual(2172.25);
				});

				it('the third price level item should be for 50 contracts', function () {
					expect(priceLevels[2].volume).toEqual(50);
				});

				it('the third price level item should be priced at 2172.50', function () {
					expect(priceLevels[2].price).toEqual(2172.50);
				});
			});
		});

		describe('and the container is reset', function () {
			beforeEach(function () {
				cv.reset();
			});

			describe('and the price level array is retrieved', function () {
				var priceLevels;

				beforeEach(function () {
					priceLevels = cv.toArray();
				});

				it('the price level array should contain zero items', function () {
					expect(priceLevels.length).toEqual(0);
				});
			});
		});
	});

	describe('and an observer is added to the container', function () {
		var spyOne;

		beforeEach(function () {
			cv.on('events', spyOne = jasmine.createSpy('spyOne'));
		});

		describe('and 50 contracts are traded at 2172.50', function () {
			beforeEach(function () {
				cv.incrementVolume(2172.5, 50);
			});

			it('the observer should be called once', function () {
				expect(spyOne).toHaveBeenCalledTimes(1);
			});

			it('the arguments should refer to the container', function () {
				expect(spyOne.calls.mostRecent().args[0].container).toBe(cv);
			});

			it('the arguments should specify an event type of "update"', function () {
				expect(spyOne.calls.mostRecent().args[0].event).toEqual('update');
			});

			it('the arguments should specify a price of 2172.5', function () {
				expect(spyOne.calls.mostRecent().args[0].price).toEqual(2172.5);
			});

			it('the arguments should specify a volume of 50', function () {
				expect(spyOne.calls.mostRecent().args[0].volume).toEqual(50);
			});

			describe('and another 50 contracts are traded at 2172.50', function () {
				beforeEach(function () {
					cv.incrementVolume(2172.5, 50);
				});

				it('the observer should be called once more', function () {
					expect(spyOne).toHaveBeenCalledTimes(2);
				});

				it('the arguments should refer to the container', function () {
					expect(spyOne.calls.mostRecent().args[0].container).toBe(cv);
				});

				it('the arguments should specify an event type of "update"', function () {
					expect(spyOne.calls.mostRecent().args[0].event).toEqual('update');
				});

				it('the arguments should specify a price of 2172.5', function () {
					expect(spyOne.calls.mostRecent().args[0].price).toEqual(2172.5);
				});

				it('the arguments should specify a volume of 100', function () {
					expect(spyOne.calls.mostRecent().args[0].volume).toEqual(100);
				});
			});

			describe('and 99 contracts are traded at 2171.75', function () {
				var spyTwo;

				beforeEach(function () {
					cv.incrementVolume(2171.75, 99);
				});

				it('the observer should be called three more times', function () {
					expect(spyOne).toHaveBeenCalledTimes(4);
				});

				it('the arguments (for the first call) should specify a price of 2172.25', function () {
					expect(spyOne.calls.argsFor(1)[0].price).toEqual(2172.25);
				});

				it('the arguments (for the first call) should specify a volume of zero', function () {
					expect(spyOne.calls.argsFor(1)[0].volume).toEqual(0);
				});

				it('the arguments (for the second call) should specify a price of 2172.00', function () {
					expect(spyOne.calls.argsFor(2)[0].price).toEqual(2172);
				});

				it('the arguments (for the second call) should specify a volume of zero', function () {
					expect(spyOne.calls.argsFor(2)[0].volume).toEqual(0);
				});

				it('the arguments (for the third call) should specify a price of 2171.75', function () {
					expect(spyOne.calls.argsFor(3)[0].price).toEqual(2171.75);
				});

				it('the arguments (for the third call) should specify a volume of 99', function () {
					expect(spyOne.calls.argsFor(3)[0].volume).toEqual(99);
				});
			});

			describe('and 555 contracts are traded at 2173.25', function () {
				beforeEach(function () {
					cv.incrementVolume(2173.25, 555);
				});

				it('the observer should be called three more times', function () {
					expect(spyOne).toHaveBeenCalledTimes(4);
				});

				it('the arguments (for the first call) should specify a price of 2172.75', function () {
					expect(spyOne.calls.argsFor(1)[0].price).toEqual(2172.75);
				});

				it('the arguments (for the first call) should specify a volume of zero', function () {
					expect(spyOne.calls.argsFor(1)[0].volume).toEqual(0);
				});

				it('the arguments (for the second call) should specify a price of 2173.00', function () {
					expect(spyOne.calls.argsFor(2)[0].price).toEqual(2173);
				});

				it('the arguments (for the second call) should specify a volume of zero', function () {
					expect(spyOne.calls.argsFor(2)[0].volume).toEqual(0);
				});

				it('the arguments (for the third call) should specify a price of 2173.25', function () {
					expect(spyOne.calls.argsFor(3)[0].price).toEqual(2173.25);
				});

				it('the arguments (for the third call) should specify a volume of 555', function () {
					expect(spyOne.calls.argsFor(3)[0].volume).toEqual(555);
				});
			});

			describe('and the observer is removed from the container', function () {
				beforeEach(function () {
					cv.off('events', spyOne);
				});

				describe('and another 50 contracts are traded at 2172.50', function () {
					beforeEach(function () {
						cv.incrementVolume(2172.5, 50);
					});

					it('the observer should be called once', function () {
						expect(spyOne).toHaveBeenCalledTimes(1);
					});
				});
			});
		});
	});
});

},{"../../../lib/marketState/CumulativeVolume":2}],21:[function(require,module,exports){
'use strict';

var Profile = require('../../../lib/marketState/Profile');

describe('When a Profile is created (for a symbol with unitCode "2")', function () {
	'use strict';

	var p;

	beforeEach(function () {
		p = new Profile('ZCZ17', 'Corn', 'CME', '2');
	});

	it('formats 123.5 (with unit code 2) as "123-4"', function () {
		expect(p.formatPrice(123.5)).toEqual('123-4');
	});
});

},{"../../../lib/marketState/Profile":3}]},{},[20,21]);
