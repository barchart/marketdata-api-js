(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.Barchart || (g.Barchart = {})).RealtimeData = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Connection = require('./websocket/Connection');

module.exports = function () {
    'use strict';

    return Connection;
}();

},{"./websocket/Connection":10}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MarketState = require('./../marketState/MarketState');

module.exports = function () {
	'use strict';

	var ConnectionBase = function () {
		function ConnectionBase() {
			_classCallCheck(this, ConnectionBase);

			this._server = null;
			this._username = null;
			this._password = null;

			this._marketState = new MarketState();
		}

		_createClass(ConnectionBase, [{
			key: 'connect',
			value: function connect(server, username, password) {
				this._server = server;
				this._username = username;
				this._password = password;

				this._connect();
			}
		}, {
			key: '_connect',
			value: function _connect() {
				return;
			}
		}, {
			key: 'disconnect',
			value: function disconnect() {
				this._server = null;
				this._username = null;
				this._password = null;

				this._disconnect();
			}
		}, {
			key: '_disconnect',
			value: function _disconnect() {
				return;
			}
		}, {
			key: 'on',
			value: function on() {
				this._on.apply(this, arguments);
			}
		}, {
			key: '_on',
			value: function _on() {
				return;
			}
		}, {
			key: 'off',
			value: function off() {
				this._off.apply(this, arguments);
			}
		}, {
			key: '_off',
			value: function _off() {
				return;
			}
		}, {
			key: 'getActiveSymbolCount',
			value: function getActiveSymbolCount() {
				return this._getActiveSymbolCount();
			}
		}, {
			key: '_getActiveSymbolCount',
			value: function _getActiveSymbolCount() {
				return null;
			}
		}, {
			key: 'getMarketState',
			value: function getMarketState() {
				return this._marketState;
			}
		}, {
			key: 'getServer',
			value: function getServer() {
				return this._server;
			}
		}, {
			key: 'getPassword',
			value: function getPassword() {
				return this._password;
			}
		}, {
			key: 'getUsername',
			value: function getUsername() {
				return this._username;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[ConnectionBase]';
			}
		}]);

		return ConnectionBase;
	}();

	return ConnectionBase;
}();

},{"./../marketState/MarketState":14}],3:[function(require,module,exports){
'use strict';

var HistoricalDataProvider = require('./http/HistoricalDataProvider');

module.exports = function () {
	'use strict';

	return HistoricalDataProvider;
}();

},{"./http/HistoricalDataProvider":7}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
	'use strict';

	var HistoricalDataProviderBase = function () {
		function HistoricalDataProviderBase() {
			_classCallCheck(this, HistoricalDataProviderBase);
		}

		_createClass(HistoricalDataProviderBase, [{
			key: 'getHistoricalData',
			value: function getHistoricalData(parameters, callback) {
				var _this = this;

				return Promise.resolve().then(function () {
					return _this._getHistoricalData(parameters, callback);
				});
			}
		}, {
			key: '_getHistoricalData',
			value: function _getHistoricalData(parameters, callback) {
				return [];
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[HistoricalDataProviderBase]';
			}
		}]);

		return HistoricalDataProviderBase;
	}();

	return HistoricalDataProviderBase;
}();

},{}],5:[function(require,module,exports){
'use strict';

var ProfileProvider = require('./http/ProfileProvider');

module.exports = function () {
	'use strict';

	return ProfileProvider;
}();

},{"./http/ProfileProvider":8}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
	'use strict';

	var ProfileProviderBase = function () {
		function ProfileProviderBase() {
			_classCallCheck(this, ProfileProviderBase);
		}

		_createClass(ProfileProviderBase, [{
			key: 'loadProfileData',
			value: function loadProfileData(symbols, callback) {
				var _this = this;

				return Promise.resolve().then(function () {
					return _this._loadProfileData(symbols, callback);
				});
			}
		}, {
			key: '_loadProfileData',
			value: function _loadProfileData(symbols, callback) {
				return [];
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[ProfileProviderBase]';
			}
		}]);

		return ProfileProviderBase;
	}();

	return ProfileProviderBase;
}();

},{}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var xhr = require('xhr');

var HistoricalDataProviderBase = require('./../../HistoricalDataProviderBase');

module.exports = function () {
	'use strict';

	var HistoricalDataProvider = function (_HistoricalDataProvid) {
		_inherits(HistoricalDataProvider, _HistoricalDataProvid);

		function HistoricalDataProvider() {
			_classCallCheck(this, HistoricalDataProvider);

			return _possibleConstructorReturn(this, (HistoricalDataProvider.__proto__ || Object.getPrototypeOf(HistoricalDataProvider)).call(this));
		}

		_createClass(HistoricalDataProvider, [{
			key: '_getHistoricalData',
			value: function _getHistoricalData(params, callback) {
				return new Promise(function (resolveCallback) {
					var queryStrings = Object.keys(params).map(function (key) {
						return encodeURIComponent(key) + '=' + encodeURIComponent(params[p]);
					});

					var options = {
						url: encodeURI('proxies/historicaldata/?' + queryStrings.join('&')),
						method: 'GET',
						json: true
					};

					xhr(options, function (error, response, body) {
						var historicalData;

						if (error || response.statusCode !== 200) {
							historicalData = [];
						} else {
							historicalData = body;
						}

						if (typeof callback === 'function') {
							callback(historicalData);
						}

						resolveCallback(historicalData);
					});
				});
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[HistoricalDataProvider]';
			}
		}]);

		return HistoricalDataProvider;
	}(HistoricalDataProviderBase);

	return HistoricalDataProvider;
}();

},{"./../../HistoricalDataProviderBase":4,"xhr":51}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var xhr = require('xhr');

var ProfileProviderBase = require('./../../ProfileProviderBase');

module.exports = function () {
	'use strict';

	var ProfileProvider = function (_ProfileProviderBase) {
		_inherits(ProfileProvider, _ProfileProviderBase);

		function ProfileProvider() {
			_classCallCheck(this, ProfileProvider);

			return _possibleConstructorReturn(this, (ProfileProvider.__proto__ || Object.getPrototypeOf(ProfileProvider)).call(this));
		}

		_createClass(ProfileProvider, [{
			key: '_loadProfileData',
			value: function _loadProfileData(symbols, callback) {
				return new Promise(function (resolveCallback) {
					var options = {
						url: 'proxies/instruments/?lookup=' + symbols.join(','),
						method: 'GET',
						json: true
					};

					xhr(options, function (error, response, body) {
						var instrumentData;

						if (error || response.statusCode !== 200) {
							instrumentData = [];
						} else {
							instrumentData = body.instruments;
						}

						if (typeof callback === 'function') {
							callback(instrumentData);
						}

						resolveCallback(instrumentData);
					});
				});
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[ProfileProvider]';
			}
		}]);

		return ProfileProvider;
	}(ProfileProviderBase);

	return ProfileProvider;
}();

},{"./../../ProfileProviderBase":6,"xhr":51}],9:[function(require,module,exports){
'use strict';

var Connection = require('./Connection');

module.exports = function () {
	'use strict';

	return Connection;
}();

},{"./Connection":1}],10:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var utilities = require('barchart-marketdata-utilities');

var ConnectionBase = require('./../../ConnectionBase');
var parseMessage = require('./../../../messageParser/parseMessage');

module.exports = function () {
	'use strict';

	var _API_VERSION = 4;

	var state = {
		connecting: 'CONNECTING',
		authenticating: 'LOGGING_IN',
		authenticated: 'LOGGED_IN',
		disconnected: 'DISCONNECTED'
	};

	var ascii = {
		soh: '\x01',
		etx: '\x03',
		lf: '\x0A',
		dc4: '\x14'
	};

	var _RECONNECT_INTERVAL = 5000;

	function ConnectionInternal(marketState) {
		var __marketState = marketState;

		var __state = state.disconnected;
		var __isConsumerDisconnect = false;

		var __connection = null;

		var __producerSymbols = {};
		var __marketDepthSymbols = {};
		var __marketUpdateSymbols = {};
		var __cumulativeVolumeSymbols = {};

		var __tasks = [];
		var __commands = [];
		var __feedMessages = [];
		var __networkMessages = [];

		var __listeners = {
			events: [],
			marketDepth: {},
			marketUpdate: {},
			cumulativeVolume: {},
			timestamp: []
		};

		var __loginInfo = {
			username: null,
			password: null,
			server: null
		};

		function addTask(id, symbol) {
			var lastIndex = __tasks.length - 1;

			if (lastIndex > 0 && __tasks[lastIndex].id === id) {
				__tasks[lastIndex].symbols.push(symbol);
			} else {
				__tasks.push({ id: id, symbols: [symbol] });
			}
		}

		function broadcastEvent(eventId, message) {
			var listeners = void 0;

			switch (eventId) {
				case 'events':
					listeners = __listeners.events;
					break;
				case 'marketDepth':
					listeners = __listeners.marketDepth[message.symbol];
					break;
				case 'marketUpdate':
					listeners = __listeners.marketUpdate[message.symbol];
					break;
				case 'timestamp':
					listeners = __listeners.timestamp;
					break;
			}

			if (listeners) {
				listeners.forEach(function (listener) {
					return listener(message);
				});
			}
		}

		function connect(server, username, password) {
			if (__connection || __isConsumerDisconnect) {
				return;
			}

			__loginInfo.username = username;
			__loginInfo.password = password;
			__loginInfo.server = server;

			if (window.WebSocket) {
				__state = state.disconnected;

				__connection = new WebSocket('wss://' + __loginInfo.server + '/jerq');

				__connection.onclose = function (evt) {
					console.warn(new Date() + ' connection closed.');

					__connection = null;

					if (__state !== state.authenticated) {
						return;
					}

					__state = state.disconnected;

					broadcastEvent('events', { event: 'disconnect' });

					setTimeout(function () {
						__connection = null;

						connect(__loginInfo.server, __loginInfo.username, __loginInfo.password);

						Object.keys(__marketUpdateSymbols).forEach(function (symbol) {
							addTask('MU_GO', symbol);
						});

						Object.keys(__cumulativeVolumeSymbols).forEach(function (symbol) {
							addTask('MU_GO', symbol);
						});

						Object.keys(__marketDepthSymbols).forEach(function (symbol) {
							addTask('MD_GO', symbol);
						});
					}, _RECONNECT_INTERVAL);
				};

				__connection.onmessage = function (evt) {
					__networkMessages.push(evt.data);
				};

				__connection.onopen = function (evt) {
					console.log(new Date() + ' connection open.');
				};
			} else {
				console.warn('Websockets are not supported by this browser.');
			}
		}

		function disconnect() {
			__state = state.disconnected;

			if (__connection !== null) {
				__connection.send('LOGOUT\r\n');
				__connection.close();
				__connection = null;
			}

			__tasks = [];
			__commands = [];
			__feedMessages = [];

			__marketDepthSymbols = {};
			__marketUpdateSymbols = {};
			__cumulativeVolumeSymbols = {};
		}

		function handleNetworkMessage(message) {
			if (__state === state.disconnected) {
				__state = state.connecting;
			}

			if (__state === state.connecting) {
				var lines = message.split('\n');

				lines.forEach(function (line) {
					if (line == '+++') {
						__state = state.authenticating;
						__commands.push('LOGIN ' + __loginInfo.username + ':' + __loginInfo.password + " VERSION=" + _API_VERSION + "\r\n");
					}
				});
			} else if (__state === state.authenticating) {
				var firstCharacter = message.charAt(0);

				if (firstCharacter === '+') {
					__state = state.authenticated;
					broadcastEvent('events', { event: 'login success' });
				} else if (firstCharacter === '-') {
					disconnect();
					broadcastEvent('events', { event: 'login fail' });
				}
			}

			if (__state === state.authenticated) {
				__feedMessages.push(message);
			}
		}

		function off() {
			if (arguments.length < 2) {
				throw new Error("Bad number of arguments. Must pass in an eventId and handler.");
			}

			var eventId = arguments[0];
			var handler = arguments[1];

			var symbol = void 0;

			if (arguments.length > 2) {
				symbol = arguments[2];
			} else {
				symbol = null;
			}

			var removeHandler = function removeHandler(listeners) {
				var listenersToFilter = listeners || [];

				return listenersToFilter.filter(function (candidate) {
					return candidate !== handler;
				});
			};

			var getConsumerIsActive = function getConsumerIsActive(consumerSymbol, listenerMaps) {
				return listenerMaps.reduce(function (active, listenerMap) {
					return active || listenerMap.hasOwnProperty(consumerSymbol);
				}, false);
			};

			var unsubscribe = function unsubscribe(trackingMap, taskName, listenerMap, additionalTrackingMaps, additionalListenerMaps) {
				var consumerSymbol = symbol;
				var producerSymbol = utilities.symbolParser.getProducerSymbol(consumerSymbol);

				var previousListeners = listenerMap[consumerSymbol] || [];
				var currentListeners = removeHandler(previousListeners);

				listenerMap[consumerSymbol] = currentListeners;

				if (previousListeners.length > 0 && currentListeners.length === 0) {
					delete listenerMap[consumerSymbol];

					var stopConsumer = true;
					var stopProducer = true;

					var _consumerSymbols = __producerSymbols[producerSymbol] || [];

					if (!getConsumerIsActive(consumerSymbol, additionalListenerMaps)) {
						stopConsumer = true;
					}

					if (stopConsumer) {
						_consumerSymbols = _consumerSymbols.filter(function (candidate) {
							var returnVal = candidate !== consumerSymbol;

							if (!returnVal && getConsumerIsActive(candidate, [listenerMap])) {
								stopProducer = false;
							}

							return returnVal;
						});

						__producerSymbols[producerSymbol] = _consumerSymbols;
					}

					if (stopProducer) {
						delete trackingMap[producerSymbol];

						additionalTrackingMaps.forEach(function (map) {
							if (map.hasOwnProperty(producerSymbol)) {
								stopProducer = false;
							}
						});

						if (stopProducer) {
							addTask(taskName, producerSymbol);
						}
					}
				}
			};

			switch (eventId) {
				case 'events':
					__listeners.events = removeHandler(__listeners.events);

					break;
				case 'marketDepth':
					if (arguments.length < 3) {
						throw new Error("Invalid arguments. Invoke as follows: off('marketDepth', handler, symbol)");
					}

					unsubscribe(__marketDepthSymbols, "MD_STOP", __listeners.marketDepth, [], []);

					break;
				case 'marketUpdate':
					if (arguments.length < 3) {
						throw new Error("Invalid arguments. Invoke as follows: off('marketUpdate', handler, symbol)");
					}

					unsubscribe(__marketUpdateSymbols, "MU_STOP", __listeners.marketUpdate, [__cumulativeVolumeSymbols], [__listeners.cumulativeVolume]);

					break;
				case 'cumulativeVolume':
					if (arguments.length < 3) {
						throw new Error("Invalid arguments. Invoke as follows: off('cumulativeVolume', handler, symbol)");
					}

					unsubscribe(__cumulativeVolumeSymbols, "MU_STOP", __listeners.cumulativeVolume, [__marketUpdateSymbols], [__listeners.marketUpdate]);

					getMarketState().getCumulativeVolume(symbol, function (container) {
						container.off('events', handler);
					});

					break;
				case 'timestamp':
					__listeners.timestamp = removeHandler(__listeners.timestamp);

					break;
			}
		}

		function on() {
			if (arguments.length < 2) {
				throw new Error("Bad number of arguments. Must pass in an eventId and handler.");
			}

			var eventId = arguments[0];
			var handler = arguments[1];

			var symbol = void 0;

			if (arguments.length > 2) {
				symbol = arguments[2];
			} else {
				symbol = null;
			}

			var addHandler = function addHandler(listeners) {
				listeners = listeners || [];

				var add = !listeners.some(function (candidate) {
					return candidate === handler;
				});

				var updatedListeners;

				if (add) {
					updatedListeners = listeners.slice(0);
					updatedListeners.push(handler);
				} else {
					updatedListeners = listeners;
				}

				return updatedListeners;
			};

			var subscribe = function subscribe(trackingMap, taskName, listenerMap, additionalTrackingMaps) {
				var consumerSymbol = symbol;
				var producerSymbol = utilities.symbolParser.getProducerSymbol(consumerSymbol);

				listenerMap[consumerSymbol] = addHandler(listenerMap[consumerSymbol]);

				var startConsumer = !consumerSymbols.some(function (candidate) {
					return candidate === consumerSymbol;
				});

				if (startConsumer) {
					var _consumerSymbols2 = __producerSymbols[producerSymbol] || [];

					_consumerSymbols2 = _consumerSymbols2.slice(0);
					_consumerSymbols2.push(consumerSymbol);

					__producerSymbols[producerSymbol] = _consumerSymbols2;
				}

				if (!trackingMap[producerSymbol]) {
					trackingMap[producerSymbol] = true;

					var startProducer = !additionalTrackingMaps.some(function (additionalTrackingMap) {
						return additionalTrackingMap[producerSymbol];
					});

					if (startProducer) {
						addTask(taskName, producerSymbol);
					}
				}
			};

			switch (eventId) {
				case 'events':
					__listeners.events = addHandler(__listeners.events);
					break;
				case 'marketDepth':
					if (arguments.length < 3) {
						throw new Error("Invalid arguments. Invoke as follows: on('marketDepth', handler, symbol)");
					}

					subscribe(__marketDepthSymbols, "MD_GO", __listeners.marketDepth, []);

					if (getMarketState().getBook(symbol)) {
						handler({ type: 'INIT', symbol: symbol });
					}

					break;
				case 'marketUpdate':
					if (arguments.length < 3) {
						throw new Error("Invalid arguments. Invoke as follows: on('marketUpdate', handler, symbol)");
					}

					subscribe(__marketUpdateSymbols, "MU_GO", __listeners.marketUpdate, [__cumulativeVolumeSymbols]);

					if (getMarketState().getQuote(symbol)) {
						handler({ type: 'INIT', symbol: symbol });
					}

					break;
				case 'cumulativeVolume':
					if (arguments.length < 3) {
						throw new Error("Invalid arguments. Invoke as follows: on('cumulativeVolume', handler, symbol)");
					}

					subscribe(__cumulativeVolumeSymbols, "MU_GO", __listeners.cumulativeVolume, [__marketUpdateSymbols]);

					getMarketState().getCumulativeVolume(symbol, function (container) {
						container.on('events', handler);
					});

					break;
				case 'timestamp':
					__listeners.timestamp = addHandler(__listeners.timestamp);
					break;
			}
		}

		function processMessage(message) {
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

		function onNewMessage(raw) {
			var message = void 0;

			try {
				message = parseMessage(raw);

				if (message.type) {
					if (message.symbol) {
						var _consumerSymbols3 = __producerSymbols[message.symbol] || [];

						_consumerSymbols3.forEach(function (consumerSymbol) {
							var messageToProcess = void 0;

							if (consumerSymbol === message.symbol) {
								messageToProcess = message;
							} else {
								messageToProcess = Object.assign({}, message);
								messageToProcess.symbol = consumerSymbol;
							}

							processMessage(messageToProcess);
						});
					} else {
						processMessage(message);
					}
				} else {
					console.log(raw);
				}
			} catch (e) {
				console.error(e);
				console.log(message);
			}
		}

		function processCommands() {
			var command = __commands.shift();

			while (command) {
				console.log(command);

				__connection.send(command);
				command = __commands.shift();
			}

			setTimeout(processCommands, 200);
		}

		function processFeedMessages() {
			var suffixLength = 9;

			var done = false;

			while (!done) {
				var s = __feedMessages.shift();

				if (!s) {
					done = true;
				} else {
					var skip = false;

					var msgType = 1; // Assume DDF message containing \x03

					var idx = -1;
					var idxETX = s.indexOf(ascii.etx);
					var idxNL = s.indexOf(ascii.lf);

					if (idxNL > -1 && (idxETX < 0 || idxNL < idxETX)) {
						idx = idxNL;
						msgType = 2;
					} else if (idxETX > -1) {
						idx = idxETX;
					}

					if (idx > -1) {
						var epos = idx + 1;
						if (msgType == 1) {
							if (s.length < idx + suffixLength + 1) {
								if (__feedMessages.length > 0) __feedMessages[0] = s + __feedMessages[0];else {
									__feedMessages.unshift(s);
									done = true;
								}

								skip = true;
							} else if (s.substr(idx + 1, 1) == ascii.dc4) {
								epos += suffixLength + 1;
							}
						}

						if (!skip) {
							var s2 = s.substring(0, epos);
							if (msgType == 2) {
								s2 = s2.trim();
							} else {
								idx = s2.indexOf(ascii.soh);
								if (idx > 0) {
									s2 = s2.substring(idx);
								}
							}

							if (s2.length > 0) {
								onNewMessage(s2);
							}

							s = s.substring(epos);
							if (s.length > 0) {
								if (__feedMessages.length > 0) {
									__feedMessages[0] = s + __feedMessages[0];
								} else {
									__feedMessages.unshift(s);
								}
							}
						}
					} else {
						if (s.length > 0) {
							if (__feedMessages.length > 0) {
								__feedMessages[0] = s + __feedMessages[0];
							} else {
								__feedMessages.unshift(s);
								done = true;
							}
						}
					}
				}

				if (__feedMessages.length === 0) {
					done = true;
				}
			}

			setTimeout(processFeedMessages, 125);
		}

		function pumpMessages() {
			var message = __networkMessages.shift();

			while (message) {
				handleNetworkMessage(message);
				message = __networkMessages.shift();
			}

			setTimeout(pumpMessages, 125);
		}

		function pumpTasks() {
			if (__state == state.authenticated) {
				while (__tasks.length > 0) {
					var task = __tasks.shift();

					var command = '';
					var suffix = '';

					switch (task.id) {
						case 'MD_GO':
							command = 'GO';
							suffix = 'Bb';
							break;
						case 'MU_GO':
							command = 'GO';
							suffix = 'Ssc';
							break;
						case 'MD_STOP':
							command = 'STOP';
							suffix = 'Bb';
							break;
						case 'MU_STOP':
							command = 'STOP';
							suffix = 'Ssc';
							break;
					}

					__commands.push(command + ' ' + symbols.join(',') + '=' + suffix);
				}
			}

			setTimeout(pumpTasks, 250);
		}

		function getActiveSymbolCount() {
			var map = {};

			for (var k in __marketUpdateSymbols) {
				if (__marketUpdateSymbols[k] === true) {
					map[k] = true;
				}
			}

			for (var _k in __marketDepthSymbols) {
				if (__marketDepthSymbols[_k] === true) {
					map[_k] = true;
				}
			}

			for (var _k2 in __cumulativeVolumeSymbols) {
				if (__cumulativeVolumeSymbols[_k2] === true) {
					map[_k2] = true;
				}
			}

			return Object.keys(map).length;
		}

		setTimeout(processCommands, 200);
		setTimeout(pumpMessages, 125);
		setTimeout(pumpTasks, 250);
		setTimeout(processFeedMessages, 125);

		function userConnect(server, username, password) {
			// always reset when told to connect
			__isConsumerDisconnect = false;

			connect(server, username, password);
		}

		function userDisconnect() {
			// set to true so we know not to reconnect
			__isConsumerDisconnect = true;

			disconnect();
		}

		return {
			connect: userConnect,
			disconnect: userDisconnect,
			off: off,
			on: on,
			getActiveSymbolCount: getActiveSymbolCount
		};
	}

	var Connection = function (_ConnectionBase) {
		_inherits(Connection, _ConnectionBase);

		function Connection() {
			_classCallCheck(this, Connection);

			var _this = _possibleConstructorReturn(this, (Connection.__proto__ || Object.getPrototypeOf(Connection)).call(this));

			_this._internal = ConnectionInternal(_this.getMarketState());
			return _this;
		}

		_createClass(Connection, [{
			key: '_connect',
			value: function _connect(server, username, password) {
				this._internal.connect(server, username, password);
			}
		}, {
			key: '_disconnect',
			value: function _disconnect() {
				this._internal.disconnect();
			}
		}, {
			key: '_on',
			value: function _on() {
				this._internal.on.apply(this._internal, arguments);
			}
		}, {
			key: '_off',
			value: function _off() {
				this._internal.off.apply(this._internal, arguments);
			}
		}, {
			key: '_getActiveSymbolCount',
			value: function _getActiveSymbolCount() {
				return this._internal.getActiveSymbolCount();
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Connection]';
			}
		}]);

		return Connection;
	}(ConnectionBase);

	return Connection;
}();

},{"./../../../messageParser/parseMessage":19,"./../../ConnectionBase":2,"barchart-marketdata-utilities":35}],11:[function(require,module,exports){
'use strict';

var HistoricalDataProvider = require('./../connection/HistoricalDataProvider');

module.exports = function () {
	'use strict';

	return HistoricalDataProvider;
}();

},{"./../connection/HistoricalDataProvider":3}],12:[function(require,module,exports){
'use strict';

var connection = require('./connection/index');
var historicalData = require('./historicalData/index');
var MarketState = require('./marketState/index');
var messageParser = require('./messageParser/index');
var util = require('./util/index');

module.exports = function () {
	'use strict';

	return {
		Connection: connection,

		historicalData: historicalData,
		HistoricalData: historicalData,

		MarketState: MarketState,

		MessageParser: messageParser,
		messageParser: messageParser,

		Util: util,
		util: util
	};
}();

},{"./connection/index":9,"./historicalData/index":11,"./marketState/index":17,"./messageParser/index":18,"./util/index":26}],13:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
	'use strict';

	var events = {
		update: 'update',
		reset: 'reset'
	};

	var CumulativeVolume = function () {
		function CumulativeVolume(symbol, tickIncrement) {
			_classCallCheck(this, CumulativeVolume);

			this.symbol = symbol;
			this._tickIncrement = tickIncrement;

			this._handlers = [];

			this._priceLevels = {};
			this._highPrice = null;
			this._lowPrice = null;
		}

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
		}, {
			key: 'getTickIncrement',
			value: function getTickIncrement() {
				return this._tickIncrement;
			}
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
		}, {
			key: 'incrementVolume',
			value: function incrementVolume(priceValue, volume) {
				if (this._highPrice && this._lowPrice) {
					if (priceValue > this._highPrice) {
						for (var p = this._highPrice + this._tickIncrement; p < priceValue; p += this._tickIncrement) {
							broadcastPriceVolumeUpdate(this, this._handlers, addPriceVolume(this._priceLevels, p.toString(), p));
						}

						this._highPrice = priceValue;
					} else if (priceValue < this._lowPrice) {
						for (var _p = this._lowPrice - this._tickIncrement; _p > priceValue; _p -= this._tickIncrement) {
							broadcastPriceVolumeUpdate(this, this._handlers, addPriceVolume(this._priceLevels, _p.toString(), _p));
						}

						this._lowPrice = priceValue;
					}
				} else {
					this._lowPrice = this._highPrice = priceValue;
				}

				var priceString = priceValue.toString();
				var priceLevel = this._priceLevels[priceString];

				if (!priceLevel) {
					priceLevel = addPriceVolume(this._priceLevels, priceString, priceValue);
				}

				priceLevel.volume += volume;

				broadcastPriceVolumeUpdate(this, this._handlers, priceLevel);
			}
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
		}, {
			key: 'toArray',
			value: function toArray() {
				var _this3 = this;

				var array = Object.keys(this._priceLevels).map(function (p) {
					var priceLevel = _this3._priceLevels[p];

					array.push({
						price: priceLevel.price,
						volume: priceLevel.volume
					});
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

	var addPriceVolume = function addPriceVolume(priceLevels, priceString, priceValue) {
		var priceLevel = {
			price: priceValue,
			volume: 0
		};

		priceLevels[priceString] = priceLevel;

		return priceLevel;
	};

	return CumulativeVolume;
}();

},{}],14:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utilities = require('barchart-marketdata-utilities');

var CumulativeVolume = require('./CumulativeVolume');
var Profile = require('./Profile');
var Quote = require('./Quote');

var dayCodeToNumber = require('./../util/convertDayCodeToNumber');
var ProfileProvider = require('./../connection/ProfileProvider');

module.exports = function () {
	'use strict';

	function MarketStateInternal() {
		var _book = {};
		var _quote = {};
		var _cvol = {};

		var _timestamp = void 0;

		var _profileProvider = new ProfileProvider();

		var loadProfiles = function loadProfiles(symbols) {
			return _profileProvider.loadProfileData(symbols).then(function (instrumentData) {
				instrumentData.forEach(function (instrumentDataItem) {
					if (instrumentDataItem.status !== 404) {
						new Profile(instrumentDataItem.lookup, instrumentDataItem.symbol_description, instrumentDataItem.exchange_channel, instrumentDataItem.base_code.toString(), // bug in DDF, sends '0' to '9' as 0 to 9, so a JSON number, not string
						instrumentDataItem.point_value, instrumentDataItem.tick_increment);
					}
				});
			});
		};

		var _getOrCreateBook = function _getOrCreateBook(symbol) {
			var book = _book[symbol];

			if (!book) {
				book = {
					symbol: symbol,
					bids: [],
					asks: []
				};

				var producerSymbol = utilities.symbolParser.getProducerSymbol(symbol);
				var producerBook = _book[producerSymbol];

				if (producerBook) {
					book.bids = producerBook.bids.slice(0);
					book.asks = producerBook.asks.slice(0);
				}

				_book[symbol] = book;
			}

			return book;
		};

		var _getOrCreateCumulativeVolume = function _getOrCreateCumulativeVolume(symbol) {
			var cvol = _cvol[symbol];

			if (!cvol) {
				cvol = {
					container: null,
					callbacks: []
				};

				var producerSymbol = utilities.symbolParser.getProducerSymbol(symbol);
				var producerCvol = _cvol[producerSymbol];

				if (producerCvol && producerCvol.container) {
					cvol.container = CumulativeVolume.clone(symbol, producerCvol.container);
				}

				_cvol[symbol] = cvol;
			}

			return cvol;
		};

		var _getOrCreateQuote = function _getOrCreateQuote(symbol) {
			var quote = _quote[symbol];

			if (!quote) {
				var producerSymbol = utilities.symbolParser.getProducerSymbol(symbol);
				var producerQuote = _quote[producerSymbol];

				if (producerQuote) {
					quote = Quote.clone(symbol, producerQuote);
				} else {
					quote = new Quote(symbol);
				}

				_quote[symbol] = quote;
			}

			return quote;
		};

		var _getOrCreateProfile = function _getOrCreateProfile(symbol) {
			var p = Profile.Profiles[symbol];

			if (!p) {
				var producerSymbol = utilities.symbolParser.getProducerSymbol(symbol);
				var producerProfile = Profile.prototype.Profiles[producerSymbol];

				if (producerProfile) {
					p = new Profile(symbol, producerProfile.name, producerProfile.exchange, producerProfile.unitcode, producerProfile.pointValue, producerProfile.tickIncrement);
				}
			}

			return p;
		};

		var _processMessage = function _processMessage(message) {
			var symbol = message.symbol;

			if (message.type === 'TIMESTAMP') {
				_timestamp = message.timestamp;
				return;
			}

			// Process book messages first, they don't need profiles, etc.
			if (message.type === 'BOOK') {
				var b = _getOrCreateBook(symbol);

				b.asks = message.asks;
				b.bids = message.bids;

				return;
			}

			if (message.type == 'REFRESH_CUMULATIVE_VOLUME') {
				var priceLevels;

				var _ret = function () {
					var cv = _getOrCreateCumulativeVolume(symbol);
					var container = cvol.container;

					if (container) {
						container.reset();
					} else {
						cv.container = container = new CumulativeVolume(symbol, message.tickIncrement);

						var callbacks = cv.callbacks || [];

						callbacks.forEach(function (callback) {
							callback(container);
						});

						cv.callbacks = null;
					}

					priceLevels = message.priceLevels;


					message.priceLevels.forEach(function (priceLevel) {
						container.incrementVolume(priceLevel.price, priceLevel.volume);
					});

					return {
						v: void 0
					};
				}();

				if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
			}

			var p = _getOrCreateProfile(symbol);

			if (!p && message.type !== 'REFRESH_QUOTE') {
				console.warn('No profile found for ' + symbol);
				console.log(message);

				return;
			}

			var q = _getOrCreateQuote(symbol);

			if (!q.day && message.day) {
				q.day = message.day;
				q.dayNum = dayCodeToNumber(q.day);
			}

			if (q.day && message.day) {
				var dayNum = dayCodeToNumber(message.day);

				if (dayNum > q.dayNum || q.dayNum - dayNum > 5) {
					// Roll the quote
					q.day = message.day;
					q.dayNum = dayNum;
					q.flag = 'p';
					q.bidPrice = 0.0;
					q.bidSize = undefined;
					q.askPrice = undefined;
					q.askSize = undefined;
					if (q.settlementPrice) {
						q.previousPrice = q.settlementPrice;
					} else if (q.lastPrice) {
						q.previousPrice = q.lastPrice;
					}
					q.lastPrice = undefined;
					q.tradePrice = undefined;
					q.tradeSize = undefined;
					q.numberOfTrades = undefined;
					q.openPrice = undefined;
					q.highPrice = undefined;
					q.lowPrice = undefined;
					q.volume = undefined;
				} else if (q.dayNum > dayNum) {
					return;
				}
			} else {
				return;
			}

			var cv = _cvol[symbol];

			switch (message.type) {
				case 'HIGH':
					q.highPrice = message.value;
					break;
				case 'LOW':
					q.lowPrice = message.value;
					break;
				case 'OPEN':
					q.flag = undefined;
					q.openPrice = message.value;
					q.highPrice = message.value;
					q.lowPrice = message.value;
					q.lastPrice = message.value;

					if (cv && cv.container) {
						cv.container.reset();
					}

					break;
				case 'OPEN_INTEREST':
					q.openInterest = message.value;
					break;
				case 'REFRESH_DDF':
					switch (message.subrecord) {
						case '1':
						case '2':
						case '3':
							q.message = message;
							if (message.openPrice === null) {
								q.openPrice = undefined;
							} else if (message.openPrice) {
								q.openPrice = message.openPrice;
							}
							if (message.highPrice === null) {
								q.highPrice = undefined;
							} else if (message.highPrice) {
								q.highPrice = message.highPrice;
							}
							if (message.lowPrice === null) {
								q.lowPrice = undefined;
							} else if (message.lowPrice) {
								q.lowPrice = message.lowPrice;
							}
							if (message.lastPrice === null) {
								q.lastPrice = undefined;
							} else if (message.lastPrice) {
								q.lastPrice = message.lastPrice;
							}
							if (message.bidPrice === null) {
								q.bidPrice = undefined;
							} else if (message.bidPrice) {
								q.bidPrice = message.bidPrice;
							}
							if (message.askPrice === null) {
								q.askPrice = undefined;
							} else if (message.askPrice) {
								q.askPrice = message.askPrice;
							}
							if (message.previousPrice === null) {
								q.previousPrice = undefined;
							} else if (message.previousPrice) {
								q.previousPrice = message.previousPrice;
							}
							if (message.settlementPrice === null) {
								q.settlementPrice = undefined;
								if (q.flag == 's') {
									q.flag = undefined;
								}
							} else if (message.settlementPrice) {
								q.settlementPrice = message.settlementPrice;
							}
							if (message.volume === null) {
								q.volume = undefined;
							} else if (message.volume) {
								q.volume = message.volume;
							}
							if (message.openInterest === null) {
								q.openInterest = undefined;
							} else if (message.openInterest) {
								q.openInterest = message.openInterest;
							}
							if (message.subsrecord == '1') {
								q.lastUpdate = message.time;
							}
							break;
					}
					break;
				case 'REFRESH_QUOTE':
					p = new Profile(symbol, message.name, message.exchange, message.unitcode, message.pointValue, message.tickIncrement);

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
					if (message.tradeTime) {
						q.time = message.tradeTime;
					} else if (message.timeStamp) {
						q.time = message.timeStamp;
					}
					break;
				case 'SETTLEMENT':
					q.lastPrice = message.value;
					q.settlement = message.value;
					if (message.element === 'D') {
						q.flag = 's';
					}
					break;
				case 'TOB':
					q.bidPrice = message.bidPrice;
					q.bidSize = message.bidSize;
					q.askPrice = message.askPrice;
					q.askSize = message.askSize;
					if (message.time) {
						q.time = message.time;
					}
					break;
				case 'TRADE':
					q.flag = undefined;
					q.tradePrice = message.tradePrice;
					q.lastPrice = message.tradePrice;
					if (message.tradeSize) {
						q.tradeSize = message.tradeSize;
						q.volume += message.tradeSize;
					}

					q.ticks.push({ price: q.tradePrice, size: q.tradeSize });
					while (q.ticks.length > 50) {
						q.ticks.shift();
					}

					if (!q.numberOfTrades) {
						q.numberOfTrades = 0;
					}
					q.numberOfTrades++;

					if (message.time) {
						q.time = message.time;
					}

					if (cv && cv.container && message.tradePrice && message.tradeSize) {
						cv.container.incrementVolume(q.tradePrice, q.tradeSize);
					}
					break;
				case 'TRADE_OUT_OF_SEQUENCE':
					if (message.tradeSize) {
						q.volume += message.tradeSize;
					}

					if (cv && cv.container && message.tradePrice && message.tradeSize) {
						cv.container.incrementVolume(q.tradePrice, q.tradeSize);
					}

					break;
				case 'VOLUME':
					q.volume = message.value;
					break;
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

		var _getBook = function _getBook(symbol) {
			return _book[symbol];
		};

		var _getCumulativeVolume = function _getCumulativeVolume(symbol, callback) {
			var cv = _getOrCreateCumulativeVolume(symbol);

			if (cv.container) {
				callback(cv.container);
			} else {
				cv.callbacks.push(callback);
			}
		};

		var _getProfile = function _getProfile(symbol, callback) {
			var profile = _getOrCreateProfile(symbol);
			var promise = void 0;

			if (profile) {
				promise = Promise.resolve(profile);
			} else {
				promise = loadProfiles([symbol]).then(function () {
					return Profile.Profiles[symbol];
				});
			}

			promise = promise.then(function (p) {
				if (typeof callback === 'function') {
					callback(p);
				}

				return p;
			});
		};

		var _getQuote = function _getQuote(symbol) {
			return _quote[symbol];
		};

		var _getTimestamp = function _getTimestamp() {
			return _timestamp;
		};

		return {
			getBook: _getBook,
			getCumulativeVolume: _getCumulativeVolume,
			getProfile: _getProfile,
			getQuote: _getQuote,
			getTimestamp: _getTimestamp,
			processMessage: _processMessage
		};
	}

	var MarketState = function () {
		function MarketState() {
			_classCallCheck(this, MarketState);

			this._internal = MarketStateInternal();
		}

		_createClass(MarketState, [{
			key: 'getBook',
			value: function getBook(symbol) {
				return this._internal.getBook(symbol);
			}
		}, {
			key: 'getCumulativeVolume',
			value: function getCumulativeVolume(symbol, callback) {
				return this._internal.getCumulativeVolume(symbol, callback);
			}
		}, {
			key: 'getProfile',
			value: function getProfile(symbol, callback) {
				return this._internal.getProfile(symbol, callback);
			}
		}, {
			key: 'getQuote',
			value: function getQuote(symbol) {
				return this._internal.getQuote(symbol);
			}
		}, {
			key: 'getTimestamp',
			value: function getTimestamp() {
				return this._internal.getTimestamp();
			}
		}, {
			key: 'processMessage',
			value: function processMessage(message) {
				return this._internal.getTimestamp(message);
			}
		}], [{
			key: 'CumulativeVolume',
			get: function get() {
				return CumulativeVolume;
			}
		}, {
			key: 'Profile',
			get: function get() {
				return Profile;
			}
		}, {
			key: 'Quote',
			get: function get() {
				return Quote;
			}
		}]);

		return MarketState;
	}();

	return MarketState;
}();

},{"./../connection/ProfileProvider":5,"./../util/convertDayCodeToNumber":24,"./CumulativeVolume":13,"./Profile":15,"./Quote":16,"barchart-marketdata-utilities":35}],15:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var parseSymbolType = require('./../util/parseSymbolType');
var priceFormatter = require('./../util/priceFormatter');

module.exports = function () {
	'use strict';

	var profiles = {};
	var formatter = priceFormatter('-', true, ',').format;

	var Profile = function () {
		function Profile(symbol, name, exchange, unitCode, pointValue, tickIncrement) {
			_classCallCheck(this, Profile);

			this.symbol = symbol;
			this.name = name;
			this.exchange = exchange;
			this.unitCode = unitCode;
			this.pointValue = pointValue;
			this.tickIncrement = tickIncrement;

			var info = parseSymbolType(this.symbol);

			if (info) {
				if (info.type === 'future') {
					this.root = info.root;
					this.month = info.month;
					this.year = info.year;
				}
			}

			profiles[symbol] = this;
		}

		_createClass(Profile, [{
			key: 'formatPrice',
			value: function formatPrice(price) {
				return formatter(price);
			}
		}], [{
			key: 'setPriceFormatter',
			value: function setPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator) {
				formatter = priceFormatter(fractionSeparator, specialFractions, thousandsSeparator).format;
			}
		}, {
			key: 'PriceFormatter',
			value: function PriceFormatter(fractionSeparator, specialFractions, thousandsSeparator) {
				Profile.setPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator);
			}
		}, {
			key: 'Profiles',
			get: function get() {
				return profiles;
			},
			set: function set(p) {
				profiles = p;
			}
		}]);

		return Profile;
	}();

	return Profile;
}();

},{"./../util/parseSymbolType":28,"./../util/priceFormatter":29}],16:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
	'use strict';

	var Quote = function () {
		function Quote(symbol) {
			_classCallCheck(this, Quote);

			this.symbol = symbol || null;
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

		_createClass(Quote, null, [{
			key: 'clone',
			value: function clone(symbol, source) {
				var clone = Object.assign({}, source);
				clone.symbol = symbol;

				return clone;
			}
		}]);

		return Quote;
	}();

	return Quote;
}();

},{}],17:[function(require,module,exports){
'use strict';

var MarketState = require('./MarketState');

module.exports = function () {
	'use strict';

	return MarketState;
}();

},{"./MarketState":14}],18:[function(require,module,exports){
'use strict';

var parseMessage = require('./parseMessage');
var parseTimestamp = require('./parseTimestamp');
var parseValue = require('./parseValue');

module.exports = function () {
	'use strict';

	return {
		parseMessage: parseMessage,
		parseTimestamp: parseTimestamp,
		parseValue: parseValue,

		Parse: parseMessage,
		ParseTimestamp: parseTimestamp,
		ParseValue: parseValue
	};
}();

},{"./parseMessage":19,"./parseTimestamp":20,"./parseValue":21}],19:[function(require,module,exports){
'use strict';

var utilities = require('barchart-marketdata-utilities');

module.exports = function () {
	'use strict';

	return utilities.messageParser;
}();

},{"barchart-marketdata-utilities":35}],20:[function(require,module,exports){
'use strict';

var utilities = require('barchart-marketdata-utilities');

module.exports = function () {
	'use strict';

	return utilities.timestampParser;
}();

},{"barchart-marketdata-utilities":35}],21:[function(require,module,exports){
'use strict';

var utilities = require('barchart-marketdata-utilities');

module.exports = function () {
	'use strict';

	return utilities.priceParser;
}();

},{"barchart-marketdata-utilities":35}],22:[function(require,module,exports){
'use strict';

var utilities = require('barchart-marketdata-utilities');

module.exports = function () {
	'use strict';

	return utilities.convert.baseCodeToUnitCode;
}();

},{"barchart-marketdata-utilities":35}],23:[function(require,module,exports){
'use strict';

var utilities = require('barchart-marketdata-utilities');

module.exports = function () {
	'use strict';

	return utilities.convert.dateToDayCode;
}();

},{"barchart-marketdata-utilities":35}],24:[function(require,module,exports){
'use strict';

var utilities = require('barchart-marketdata-utilities');

module.exports = function () {
	'use strict';

	return utilities.convert.dayCodeToNumber;
}();

},{"barchart-marketdata-utilities":35}],25:[function(require,module,exports){
'use strict';

var utilities = require('barchart-marketdata-utilities');

module.exports = function () {
	'use strict';

	return utilities.convert.unitCodeToBaseCode;
}();

},{"barchart-marketdata-utilities":35}],26:[function(require,module,exports){
'use strict';

var convertBaseCodeToUnitCode = require('./convertBaseCodeToUnitCode');
var convertDateToDayCode = require('./convertDateToDayCode');
var convertDayCodeToNumber = require('./convertDayCodeToNumber');
var convertUnitCodeToBaseCode = require('./convertUnitCodeToBaseCode');
var monthCodes = require('./monthCodes');
var parseSymbolType = require('./parseSymbolType');
var priceFormatter = require('./priceFormatter');
var timeFormatter = require('./timeFormatter');

module.exports = function () {
	'use strict';

	return {
		convertBaseCodeToUnitCode: convertBaseCodeToUnitCode,
		convertUnitCodeToBaseCode: convertUnitCodeToBaseCode,
		convertDateToDayCode: convertDateToDayCode,
		convertDayCodeToNumber: convertDayCodeToNumber,
		monthCodes: monthCodes,
		parseSymbolType: parseSymbolType,

		BaseCode2UnitCode: convertBaseCodeToUnitCode,
		DateToDayCode: convertDateToDayCode,
		DayCodeToNumber: convertDayCodeToNumber,
		MonthCodes: monthCodes,
		ParseSymbolType: parseSymbolType,
		PriceFormatter: priceFormatter,
		TimeFormatter: timeFormatter,
		UnitCode2BaseCode: convertUnitCodeToBaseCode
	};
}();

},{"./convertBaseCodeToUnitCode":22,"./convertDateToDayCode":23,"./convertDayCodeToNumber":24,"./convertUnitCodeToBaseCode":25,"./monthCodes":27,"./parseSymbolType":28,"./priceFormatter":29,"./timeFormatter":30}],27:[function(require,module,exports){
'use strict';

var utilities = require('barchart-marketdata-utilities');

module.exports = function () {
	'use strict';

	return utilities.monthCodes.getCodeToNameMap();
}();

},{"barchart-marketdata-utilities":35}],28:[function(require,module,exports){
'use strict';

var utilities = require('barchart-marketdata-utilities');

module.exports = function () {
	'use strict';

	return utilities.symbolParser.parseInstrumentType;
}();

},{"barchart-marketdata-utilities":35}],29:[function(require,module,exports){
'use strict';

var utilities = require('barchart-marketdata-utilities');

module.exports = function () {
	'use strict';

	return utilities.priceFormatter;
}();

},{"barchart-marketdata-utilities":35}],30:[function(require,module,exports){
'use strict';

var utilities = require('barchart-marketdata-utilities');

module.exports = function () {
	'use strict';

	return utilities.timeFormatter;
}();

},{"barchart-marketdata-utilities":35}],31:[function(require,module,exports){
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
},{"class.extend":44}],32:[function(require,module,exports){
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
},{"./../XmlDomParserBase":31}],33:[function(require,module,exports){
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
		},

		dateToDayCode: function(date) {
			var d = date.getDate();

			if (d >= 1 && d <= 9)
				return String.fromCharCode(("1").charCodeAt(0) + d - 1);
			else if (d == 10)
				return '0';
			else
				return String.fromCharCode(("A").charCodeAt(0) + d - 11);
		},

		dayCodeToNumber: function(dayCode) {
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
},{}],34:[function(require,module,exports){
var lodashIsNaN = require('lodash.isnan');

module.exports = function() {
	'use strict';

	return function(value, digits, thousandsSeparator) {
		if (value === '' || value === undefined || value === null || lodashIsNaN(value)) {
			return '';
		}

		var returnRef = value.toFixed(digits);

		if (thousandsSeparator && !(value > -1000 && value < 1000)) {
			var length = returnRef.length;
			var negative = value < 0;

			var found = digits === 0;
			var counter = 0;

			var buffer = [];

			for (var i = (length - 1); !(i < 0); i--) {
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

			returnRef = buffer.join('');
		}

		return returnRef;
	};

	/*
	 // An alternative to consider ... seems about 15% faster ... not to
	 // mention much less lengthy ... but, has a problem with more than
	 // three decimal places ... regular expression needs work ...

	 return function(value, digits, thousandsSeparator) {
	 	if (typeof value === 'number' && (value || value === 0)) {
	 		return value.toFixed(digits).replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator || ',');
	 	} else {
	 		return '';
		}
	 };
	 */
}();
},{"lodash.isnan":48}],35:[function(require,module,exports){
var convert = require('./convert');
var decimalFormatter = require('./decimalFormatter');
var messageParser = require('./messageParser');
var monthCodes = require('./monthCodes');
var priceFormatter = require('./priceFormatter');
var symbolFormatter = require('./symbolFormatter');
var symbolParser = require('./symbolParser');
var priceParser = require('./priceParser');
var timeFormatter = require('./timeFormatter');
var timestampParser = require('./timestampParser');

module.exports = function() {
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
},{"./convert":33,"./decimalFormatter":34,"./messageParser":36,"./monthCodes":37,"./priceFormatter":38,"./priceParser":39,"./symbolFormatter":40,"./symbolParser":41,"./timeFormatter":42,"./timestampParser":43}],36:[function(require,module,exports){
var XmlDomParser = require('./common/xml/XmlDomParser');

var parseValue = require('./priceParser');
var parseTimestamp = require('./timestampParser');

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

								// 2016/10/29, BRI. We have a problem where we don't "roll" quotes
								// for futures. For example, LEZ16 doesn't "roll" the settlementPrice
								// to the previous price -- so, we did this on the open message (2,0A).
								// Eero has another idea. Perhaps we are setting the "day" improperly
								// here. Perhaps we should base the day off of the actual session
								// (i.e. "session" variable) -- instead of taking it from the "combined"
								// session.

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
						case 'CV': {
							message.type = 'REFRESH_CUMULATIVE_VOLUME';
							message.symbol = node.attributes.getNamedItem('symbol').value;
							message.unitCode = node.attributes.getNamedItem('basecode').value;
							message.tickIncrement = parseValue(node.attributes.getNamedItem('tickincrement').value, message.unitCode);

							var dataAttribute = node.attributes.getNamedItem('data');

							if (dataAttribute) {
								var priceLevelsRaw = dataAttribute.value || '';
								var priceLevels = priceLevelsRaw.split(':');

								for (var i = 0; i < priceLevels.length; i++) {
									var priceLevelRaw = priceLevels[i];
									var priceLevelData = priceLevelRaw.split(',');

									priceLevels[i] = {
										price: parseValue(priceLevelData[0], message.unitCode),
										volume: parseInt(priceLevelData[1])
									};
								}

								priceLevels.sort(function(a, b) {
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
},{"./common/xml/XmlDomParser":32,"./priceParser":39,"./timestampParser":43}],37:[function(require,module,exports){
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
},{}],38:[function(require,module,exports){
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
		} else {
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
},{"./decimalFormatter":34,"lodash.isnan":48}],39:[function(require,module,exports){
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

		if (!(str.indexOf('.') < 0)) {
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
},{}],40:[function(require,module,exports){
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
},{}],41:[function(require,module,exports){
module.exports = function() {
	'use strict';

	var exchangeRegex = /^(.*)\\.([A-Z]{1,4})$/i;

	var jerqFutureConversionRegex = /(.{1,3})([A-Z]{1})([0-9]{3}|[0-9]{1})?([0-9]{1})$/i;
	var concreteFutureRegex = /^(.{1,3})([A-Z]{1})([0-9]{4}|[0-9]{1,2})$/i;
	var referenceFutureRegex = /^(.{1,3})(\*{1})([0-9]{1})$/i;
	var futureSpreadRegex = /^_S_/i;
	var forexRegex = /^\^([A-Z]{3})([A-Z]{3})$/i;
	var sectorRegex = /^\-(.*)$/i;
	var indexRegex = /^\$(.*)$/i;
	var batsRegex = /^(.*)\.BZ$/i;
	var usePercentRegex = /(\.RT)$/;

	var symbolParser = {
		parseInstrumentType: function(symbol) {
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
				var currentDate = new Date();
				var currentYear = currentDate.getFullYear();

				var yearString = staticFutureMatch[3];
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

				return {
					symbol: symbol,
					type: 'future',
					root: staticFutureMatch[1],
					dynamic: false,
					month: staticFutureMatch[2],
					year: year
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

		getIsConcrete: function(symbol) {
			return !this.getIsReference(symbol);
		},

		getIsReference: function(symbol) {
			return referenceFutureRegex.test(symbol);
		},

		getIsFuture: function(symbol) {
			return getIsType(symbol, 'future');
		},

		getIsFutureSpread: function(symbol) {
			return getIsType(symbol, 'future_spread');
		},

		getIsForex: function(symbol) {
			return getIsType(symbol, 'forex');
		},

		getIsSector: function(symbol) {
			return getIsType(symbol, 'sector');
		},

		getIsIndex: function(symbol) {
			return getIsType(symbol, 'index');
		},

		getIsBats: function(symbol) {
			return batsRegex.test(symbol);
		},

		getProducerSymbol: function(symbol) {
			var returnRef;

			if (typeof symbol === 'string') {
				returnRef = symbol.replace(jerqFutureConversionRegex, '$1$2$4');
			} else {
				returnRef = null;
			}

			return returnRef;
		},

		displayUsingPercent: function(symbol) {
			return usePercentRegex.test(symbol);
		}
	};

	var getIsType = function(symbol, type) {
		var instrumentType = symbolParser.parseInstrumentType(symbol);

		return instrumentType !== null && instrumentType.type === type;
	};

	return symbolParser;
}();
},{}],42:[function(require,module,exports){
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
				} else if (!q.lastPrice || q.flag || q.sessionT) {
					return formatters.formatDate(t);
				} else {
					return formatters.formatTime(t, q.timezone);
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
},{}],43:[function(require,module,exports){
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
},{}],44:[function(require,module,exports){
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
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
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };

  //I only added this line
  module.exports = Class;
})();

},{}],45:[function(require,module,exports){
var isFunction = require('is-function')

module.exports = forEach

var toString = Object.prototype.toString
var hasOwnProperty = Object.prototype.hasOwnProperty

function forEach(list, iterator, context) {
    if (!isFunction(iterator)) {
        throw new TypeError('iterator must be a function')
    }

    if (arguments.length < 3) {
        context = this
    }
    
    if (toString.call(list) === '[object Array]')
        forEachArray(list, iterator, context)
    else if (typeof list === 'string')
        forEachString(list, iterator, context)
    else
        forEachObject(list, iterator, context)
}

function forEachArray(array, iterator, context) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            iterator.call(context, array[i], i, array)
        }
    }
}

function forEachString(string, iterator, context) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        iterator.call(context, string.charAt(i), i, string)
    }
}

function forEachObject(object, iterator, context) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            iterator.call(context, object[k], k, object)
        }
    }
}

},{"is-function":47}],46:[function(require,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window;
} else if (typeof global !== "undefined") {
    module.exports = global;
} else if (typeof self !== "undefined"){
    module.exports = self;
} else {
    module.exports = {};
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],47:[function(require,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};

},{}],48:[function(require,module,exports){
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

},{}],49:[function(require,module,exports){
var trim = require('trim')
  , forEach = require('for-each')
  , isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  forEach(
      trim(headers).split('\n')
    , function (row) {
        var index = row.indexOf(':')
          , key = trim(row.slice(0, index)).toLowerCase()
          , value = trim(row.slice(index + 1))

        if (typeof(result[key]) === 'undefined') {
          result[key] = value
        } else if (isArray(result[key])) {
          result[key].push(value)
        } else {
          result[key] = [ result[key], value ]
        }
      }
  )

  return result
}
},{"for-each":45,"trim":50}],50:[function(require,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],51:[function(require,module,exports){
"use strict";
var window = require("global/window")
var isFunction = require("is-function")
var parseHeaders = require("parse-headers")
var xtend = require("xtend")

module.exports = createXHR
createXHR.XMLHttpRequest = window.XMLHttpRequest || noop
createXHR.XDomainRequest = "withCredentials" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window.XDomainRequest

forEachArray(["get", "put", "post", "patch", "head", "delete"], function(method) {
    createXHR[method === "delete" ? "del" : method] = function(uri, options, callback) {
        options = initParams(uri, options, callback)
        options.method = method.toUpperCase()
        return _createXHR(options)
    }
})

function forEachArray(array, iterator) {
    for (var i = 0; i < array.length; i++) {
        iterator(array[i])
    }
}

function isEmpty(obj){
    for(var i in obj){
        if(obj.hasOwnProperty(i)) return false
    }
    return true
}

function initParams(uri, options, callback) {
    var params = uri

    if (isFunction(options)) {
        callback = options
        if (typeof uri === "string") {
            params = {uri:uri}
        }
    } else {
        params = xtend(options, {uri: uri})
    }

    params.callback = callback
    return params
}

function createXHR(uri, options, callback) {
    options = initParams(uri, options, callback)
    return _createXHR(options)
}

function _createXHR(options) {
    if(typeof options.callback === "undefined"){
        throw new Error("callback argument missing")
    }

    var called = false
    var callback = function cbOnce(err, response, body){
        if(!called){
            called = true
            options.callback(err, response, body)
        }
    }

    function readystatechange() {
        if (xhr.readyState === 4) {
            loadFunc()
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = undefined

        if (xhr.response) {
            body = xhr.response
        } else {
            body = xhr.responseText || getXml(xhr)
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }

    function errorFunc(evt) {
        clearTimeout(timeoutTimer)
        if(!(evt instanceof Error)){
            evt = new Error("" + (evt || "Unknown XMLHttpRequest Error") )
        }
        evt.statusCode = 0
        return callback(evt, failureResponse)
    }

    // will load the data & process the response in a special response object
    function loadFunc() {
        if (aborted) return
        var status
        clearTimeout(timeoutTimer)
        if(options.useXDR && xhr.status===undefined) {
            //IE8 CORS GET successful response doesn't have a status field, but body is fine
            status = 200
        } else {
            status = (xhr.status === 1223 ? 204 : xhr.status)
        }
        var response = failureResponse
        var err = null

        if (status !== 0){
            response = {
                body: getBody(),
                statusCode: status,
                method: method,
                headers: {},
                url: uri,
                rawRequest: xhr
            }
            if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE
                response.headers = parseHeaders(xhr.getAllResponseHeaders())
            }
        } else {
            err = new Error("Internal XMLHttpRequest Error")
        }
        return callback(err, response, response.body)
    }

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new createXHR.XDomainRequest()
        }else{
            xhr = new createXHR.XMLHttpRequest()
        }
    }

    var key
    var aborted
    var uri = xhr.url = options.uri || options.url
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data || null
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var timeoutTimer
    var failureResponse = {
        body: undefined,
        headers: {},
        statusCode: 0,
        method: method,
        url: uri,
        rawRequest: xhr
    }

    if ("json" in options && options.json !== false) {
        isJson = true
        headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json") //Don't override existing accept header declared by user
        if (method !== "GET" && method !== "HEAD") {
            headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json") //Don't override existing accept header declared by user
            body = JSON.stringify(options.json === true ? body : options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = loadFunc
    xhr.onerror = errorFunc
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    xhr.onabort = function(){
        aborted = true;
    }
    xhr.ontimeout = errorFunc
    xhr.open(method, uri, !sync, options.username, options.password)
    //has to be after open
    if(!sync) {
        xhr.withCredentials = !!options.withCredentials
    }
    // Cannot set timeout with sync request
    // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
    // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
    if (!sync && options.timeout > 0 ) {
        timeoutTimer = setTimeout(function(){
            if (aborted) return
            aborted = true//IE9 may still call readystatechange
            xhr.abort("timeout")
            var e = new Error("XMLHttpRequest timeout")
            e.code = "ETIMEDOUT"
            errorFunc(e)
        }, options.timeout )
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    } else if (options.headers && !isEmpty(options.headers)) {
        throw new Error("Headers cannot be set on an XDomainRequest object")
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }

    if ("beforeSend" in options &&
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    xhr.send(body)

    return xhr


}

function getXml(xhr) {
    if (xhr.responseType === "document") {
        return xhr.responseXML
    }
    var firefoxBugTakenEffect = xhr.status === 204 && xhr.responseXML && xhr.responseXML.documentElement.nodeName === "parsererror"
    if (xhr.responseType === "" && !firefoxBugTakenEffect) {
        return xhr.responseXML
    }

    return null
}

function noop() {}

},{"global/window":46,"is-function":47,"parse-headers":49,"xtend":52}],52:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}]},{},[12])(12)
});