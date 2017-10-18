(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.Barchart || (g.Barchart = {})).RealtimeData = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var Connection = require('./websocket/Connection');

module.exports = function () {
    'use strict';

    return Connection;
}();

},{"./websocket/Connection":5}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MarketState = require('./../marketState/MarketState');

module.exports = function () {
	'use strict';

	/**
  * Object used to connect to market data server, request data feeds, and
  * query market state.
  *
  * @public
  * @interface
  */

	var ConnectionBase = function () {
		function ConnectionBase() {
			var _this = this;

			_classCallCheck(this, ConnectionBase);

			this._server = null;
			this._username = null;
			this._password = null;

			this._marketState = new MarketState(function (symbol) {
				return _this._handleProfileRequest(symbol);
			});
			this._pollingFrequency = null;
		}

		/**
   * Connects to the given server with username and password.
   *
   * @public
   * @param {string} server
   * @param {string} username
   * @param {string} password
   */


		_createClass(ConnectionBase, [{
			key: 'connect',
			value: function connect(server, username, password) {
				this._server = server;
				this._username = username;
				this._password = password;

				this._connect();
			}

			/**
    * @protected
    * @ignore
    */

		}, {
			key: '_connect',
			value: function _connect() {
				return;
			}

			/**
    * Forces a disconnect from the server.
    *
    * @public
    */

		}, {
			key: 'disconnect',
			value: function disconnect() {
				this._server = null;
				this._username = null;
				this._password = null;

				this._disconnect();
			}

			/**
    * @protected
    * @ignore
    */

		}, {
			key: '_disconnect',
			value: function _disconnect() {
				return;
			}

			/**
    * Initiates a subscription to an {@link Subscription.EventType} and
    * registers the callback for notifications.
    *
    * @public
    * @param {Subscription.EventType} eventType
    * @param {function} callback - notified each time the event occurs
    * @param {...string=} symbols - one or more symbols, if applicable to the given {@link Subscription.EventType}
    */

		}, {
			key: 'on',
			value: function on() {
				this._on.apply(this, arguments);
			}

			/**
    * @protected
    * @ignore
    */

		}, {
			key: '_on',
			value: function _on() {
				return;
			}

			/**
    * Stops notification of the callback for the {@link Subscription.EventType}.
    * See {@link ConnectionBase#on}.
    *
    * @public
    * @param {Subscription.EventType} eventType - the {@link Subscription.EventType} which was passed to {@link ConnectionBase#on}
    * @param {function} callback - the callback which was passed to {@link ConnectionBase#on}
    * @param {...string=} symbols - one or more symbols, if applicable to the given {@link Subscription.EventType}
    */

		}, {
			key: 'off',
			value: function off() {
				this._off.apply(this, arguments);
			}

			/**
    * @protected
    * @ignore
    */

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

			/**
    * The frequency, in milliseconds, used to poll for changes to {@link Quote}
    * objects. A null value indicates streaming updates (default).
    *
    * @return {number|null}
    */

		}, {
			key: 'getPollingFrequency',
			value: function getPollingFrequency() {
				return this._pollingFrequency;
			}

			/**
    * Sets the polling frequency, in milliseconds. A null value indicates
    * streaming market updates (where polling is not used).
    *
    * @param {number|null} pollingFrequency
    */

		}, {
			key: 'setPollingFrequency',
			value: function setPollingFrequency(pollingFrequency) {
				if (this._pollingFrequency !== pollingFrequency) {
					if (pollingFrequency && pollingFrequency > 0) {
						this._pollingFrequency = pollingFrequency;
					} else {
						this._pollingFrequency = null;
					}

					this._onPollingFrequencyChanged(this._pollingFrequency);
				}
			}

			/**
    * @protected
    * @ignore
    */

		}, {
			key: '_onPollingFrequencyChanged',
			value: function _onPollingFrequencyChanged(pollingFrequency) {
				return;
			}

			/**
    * @protected
    * @ignore
    */

		}, {
			key: '_handleProfileRequest',
			value: function _handleProfileRequest(symbol) {
				return;
			}

			/**
    * Returns the {@link MarketState} singleton, which can be used to access {@link Quote}, {@link Profile}, and {@link CumulativeVolume} objects.
    *
    * @return {MarketState}
    */

		}, {
			key: 'getMarketState',
			value: function getMarketState() {
				return this._marketState;
			}

			/**
    * @returns {null|string}
    */

		}, {
			key: 'getServer',
			value: function getServer() {
				return this._server;
			}

			/**
    * @returns {null|string}
    */

		}, {
			key: 'getPassword',
			value: function getPassword() {
				return this._password;
			}

			/**
    * @returns {null|string}
    */

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

},{"./../marketState/MarketState":8}],4:[function(require,module,exports){
'use strict';

var Connection = require('./Connection');

module.exports = function () {
	'use strict';

	return Connection;
}();

},{"./Connection":2}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var utilities = require('@barchart/marketdata-utilities-js');

var object = require('./../../../common/lang/object');

var ConnectionBase = require('./../../ConnectionBase'),
    parseMessage = require('./../../../messageParser/parseMessage');

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
		var __suppressReconnect = false;

		var __pollingFrequency = null;

		var __connection = null;

		var __producerSymbols = {};
		var __marketDepthSymbols = {};
		var __marketUpdateSymbols = {};
		var __cumulativeVolumeSymbols = {};
		var __profileLookupSymbols = {};

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

		function enqueueGoTasks() {
			object.keys(__marketUpdateSymbols).forEach(function (symbol) {
				addTask('MU_GO', symbol);
			});

			object.keys(__cumulativeVolumeSymbols).forEach(function (symbol) {
				addTask('MU_GO', symbol);
			});

			object.keys(__marketDepthSymbols).forEach(function (symbol) {
				addTask('MD_GO', symbol);
			});
		}

		function enqueueStopTasks() {
			object.keys(__marketUpdateSymbols).forEach(function (symbol) {
				addTask('MU_STOP', symbol);
			});

			object.keys(__cumulativeVolumeSymbols).forEach(function (symbol) {
				addTask('MU_STOP', symbol);
			});

			object.keys(__marketDepthSymbols).forEach(function (symbol) {
				addTask('MU_STOP', symbol);
			});
		}

		function connect(server, username, password) {
			if (__connection || __suppressReconnect) {
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

						enqueueGoTasks();
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

					var consumerSymbols = __producerSymbols[producerSymbol] || [];

					if (!getConsumerIsActive(consumerSymbol, additionalListenerMaps)) {
						stopConsumer = true;
					}

					if (stopConsumer) {
						consumerSymbols = consumerSymbols.filter(function (candidate) {
							var returnVal = candidate !== consumerSymbol;

							if (!returnVal && getConsumerIsActive(candidate, [listenerMap])) {
								stopProducer = false;
							}

							return returnVal;
						});

						__producerSymbols[producerSymbol] = consumerSymbols;
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

					__marketState.getCumulativeVolume(symbol, function (container) {
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

				var updatedListeners = void 0;

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

				var consumerSymbols = __producerSymbols[producerSymbol] || [];

				var startConsumer = !consumerSymbols.some(function (candidate) {
					return candidate === consumerSymbol;
				});

				if (startConsumer) {
					consumerSymbols = consumerSymbols.slice(0);
					consumerSymbols.push(consumerSymbol);

					__producerSymbols[producerSymbol] = consumerSymbols;
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

					if (__marketState.getBook(symbol)) {
						handler({ type: 'INIT', symbol: symbol });
					}

					break;
				case 'marketUpdate':
					if (arguments.length < 3) {
						throw new Error("Invalid arguments. Invoke as follows: on('marketUpdate', handler, symbol)");
					}

					subscribe(__marketUpdateSymbols, "MU_GO", __listeners.marketUpdate, [__cumulativeVolumeSymbols]);

					if (__marketState.getQuote(symbol)) {
						handler({ type: 'INIT', symbol: symbol });
					}

					break;
				case 'cumulativeVolume':
					if (arguments.length < 3) {
						throw new Error("Invalid arguments. Invoke as follows: on('cumulativeVolume', handler, symbol)");
					}

					subscribe(__cumulativeVolumeSymbols, "MU_GO", __listeners.cumulativeVolume, [__marketUpdateSymbols]);

					__marketState.getCumulativeVolume(symbol, function (container) {
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
						var consumerSymbols = __producerSymbols[message.symbol] || [];

						if (__profileLookupSymbols.hasOwnProperty(message.symbol)) {
							consumerSymbols = consumerSymbols.concat(__profileLookupSymbols[message.symbol]).filter(function (item, index, array) {
								return array.indexOf(item) === index;
							});

							delete __profileLookupSymbols[message.symbol];
						}

						consumerSymbols.forEach(function (consumerSymbol) {
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
			if (__state === state.authenticating || __state === state.authenticated) {
				var command = __commands.shift();

				while (command) {
					console.log(command);

					__connection.send(command);
					command = __commands.shift();
				}
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

		function pumpStreamingTasks(forced) {
			if (__state === state.authenticated) {
				while (__tasks.length > 0) {
					var task = __tasks.shift();

					if (task.callback) {
						task.callback();
					} else if (task.id) {
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
							case 'P_SNAPSHOT':
								command = 'GO';
								suffix = 's';
								break;
						}

						__commands.push(command + ' ' + task.symbols.join(',') + '=' + suffix);
					}
				}
			}

			if (forced) {
				return;
			}

			resetTaskPump(false);
		}

		function pumpPollingTasks() {
			if (__state === state.authenticated && __commands.length === 0) {
				__tasks = [];

				var getBatches = function getBatches(symbols) {
					var partitions = [];

					while (symbols.length !== 0) {
						partitions.push(symbols.splice(0, 250));
					}

					return partitions;
				};

				var quoteBatches = getBatches(getUniqueSymbols([__marketUpdateSymbols, __cumulativeVolumeSymbols]));

				quoteBatches.forEach(function (batch) {
					__commands.push('GO' + ' ' + batch.join(',') + '=' + 'sc');
				});

				var bookBatches = getBatches(object.keys(__marketDepthSymbols));

				quoteBatches.forEach(function (batch) {
					__commands.push('GO' + ' ' + batch.join(',') + '=' + 'b');
				});

				var profileBatches = getBatches(object.keys(__profileLookupSymbols)).filter(function (s) {
					return !quoteBatches.some(function (q) {
						return q === s;
					});
				});

				profileBatches.forEach(function (batch) {
					__commands.push('GO' + ' ' + batch.join(',') + '=' + 's');
				});
			}

			resetTaskPump(true);
		}

		function setPollingFrequency(pollingFrequency) {
			if (__pollingFrequency === pollingFrequency) {
				return;
			}

			__pollingFrequency = pollingFrequency;
		}

		function getUniqueSymbols(maps) {
			return object.keys(maps.reduce(function (aggregator, map) {
				for (var k in map) {
					if (map[k] === true) {
						aggregator[k] = true;
					}
				}

				return aggregator;
			}, {}));
		}

		function getActiveSymbolCount() {
			return getUniqueSymbols([__marketUpdateSymbols, __marketDepthSymbols, __cumulativeVolumeSymbols]).length;
		}

		function resetTaskPump(polling) {
			var pumpDelegate = void 0;
			var milliseconds = void 0;

			if (__pollingFrequency) {
				if (!polling) {
					enqueueStopTasks();
					pumpStreamingTasks(true);
				}

				pumpDelegate = pumpPollingTasks;
				milliseconds = __pollingFrequency;
			} else {
				if (polling) {
					enqueueGoTasks();
				}

				pumpDelegate = pumpStreamingTasks;
				milliseconds = 250;
			}

			setTimeout(pumpDelegate, milliseconds);
		}

		setTimeout(processCommands, 200);
		setTimeout(pumpMessages, 125);
		setTimeout(processFeedMessages, 125);
		setTimeout(resetTaskPump, 250);

		function initializeConnection(server, username, password) {
			__suppressReconnect = false;

			connect(server, username, password);
		}

		function terminateConnection() {
			__suppressReconnect = true;

			__loginInfo.username = null;
			__loginInfo.password = null;
			__loginInfo.server = null;

			disconnect();
		}

		function handleProfileRequest(symbol) {
			var producerSymbol = utilities.symbolParser.getProducerSymbol(symbol);

			__profileLookupSymbols[producerSymbol] = [symbol, producerSymbol];

			addTask('P_SNAPSHOT', producerSymbol);
		}

		return {
			connect: initializeConnection,
			disconnect: terminateConnection,
			off: off,
			on: on,
			getActiveSymbolCount: getActiveSymbolCount,
			setPollingFrequency: setPollingFrequency,
			handleProfileRequest: handleProfileRequest
		};
	}

	/**
  * Entry point for library. This implementation is intended for browser environments and uses built-in Websocket support.
  *
  * @public
  * @extends ConnectionBase
  * @variation browser
  */

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
			value: function _connect() {
				this._internal.connect(this.getServer(), this.getUsername(), this.getPassword());
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
			key: '_onPollingFrequencyChanged',
			value: function _onPollingFrequencyChanged(pollingFrequency) {
				return this._internal.setPollingFrequency(pollingFrequency);
			}
		}, {
			key: '_handleProfileRequest',
			value: function _handleProfileRequest(symbol) {
				this._internal.handleProfileRequest(symbol);
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

},{"./../../../common/lang/object":1,"./../../../messageParser/parseMessage":13,"./../../ConnectionBase":3,"@barchart/marketdata-utilities-js":31}],6:[function(require,module,exports){
'use strict';

var connection = require('./connection/index'),
    MarketState = require('./marketState/index'),
    messageParser = require('./messageParser/index'),
    util = require('./util/index');

module.exports = function () {
	'use strict';

	return {
		Connection: connection,

		MarketState: MarketState,

		MessageParser: messageParser,
		messageParser: messageParser,

		Util: util,
		util: util,

		version: '2.0.12'
	};
}();

},{"./connection/index":4,"./marketState/index":11,"./messageParser/index":12,"./util/index":22}],7:[function(require,module,exports){
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

},{"./../common/lang/object":1}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utilities = require('@barchart/marketdata-utilities-js');

var CumulativeVolume = require('./CumulativeVolume'),
    Profile = require('./Profile'),
    Quote = require('./Quote');

var dayCodeToNumber = require('./../util/convertDayCodeToNumber');

module.exports = function () {
	'use strict';

	function MarketStateInternal(handleProfileRequest) {
		var _book = {};
		var _quote = {};
		var _cvol = {};
		var _profileCallbacks = {};

		var _timestamp = void 0;

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
			var cv = _cvol[symbol];

			if (!cv) {
				cv = {
					container: null,
					callbacks: []
				};

				var producerSymbol = utilities.symbolParser.getProducerSymbol(symbol);
				var producerCvol = _cvol[producerSymbol];

				if (producerCvol && producerCvol.container) {
					cv.container = CumulativeVolume.clone(symbol, producerCvol.container);
				}

				_cvol[symbol] = cv;
			}

			return cv;
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
				var producerProfile = Profile.Profiles[producerSymbol];

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
				var _cv = _getOrCreateCumulativeVolume(symbol);
				var container = _cv.container;

				if (container) {
					container.reset();
				} else {
					_cv.container = container = new CumulativeVolume(symbol, message.tickIncrement);

					var callbacks = _cv.callbacks || [];

					callbacks.forEach(function (callback) {
						callback(container);
					});

					_cv.callbacks = null;
				}

				message.priceLevels.forEach(function (priceLevel) {
					container.incrementVolume(priceLevel.price, priceLevel.volume);
				});

				return;
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
						q.settlementPrice = undefined;
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

					if (_profileCallbacks.hasOwnProperty(symbol)) {
						_profileCallbacks[symbol].forEach(function (profileCallback) {
							profileCallback(p);
						});

						delete _profileCallbacks[symbol];
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
			var promise = void 0;

			if (cv.container) {
				promise = Promise.resolve(cv.container);
			} else {
				promise = new Promise(function (resolveCallback) {
					cv.callbacks.push(resolveCallback);
				});
			}

			return promise.then(function (cv) {
				if (typeof callback === 'function') {
					callback(cv);
				}

				return cv;
			});
		};

		var _getProfile = function _getProfile(symbol, callback) {
			var profile = _getOrCreateProfile(symbol);
			var promise = void 0;

			if (profile) {
				promise = Promise.resolve(profile);
			} else {
				promise = new Promise(function (resolveCallback) {
					if (!_profileCallbacks.hasOwnProperty(symbol)) {
						_profileCallbacks[symbol] = [];
					}

					_profileCallbacks[symbol].push(function (p) {
						return resolveCallback(p);
					});

					if (handleProfileRequest && typeof handleProfileRequest === 'function') {
						handleProfileRequest(symbol);
					}
				});
			}

			return promise.then(function (p) {
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

	/**
  * @typedef Book
  * @type Object
  * @property {string} symbol
  * @property {Object[]} bids
  * @property {Object[]} asks
  */

	/**
  * <p>Repository for current market state. This repository will only contain
  * data for an instrument after a subscription has been established using
  * the {@link Connection#on} function.</p>
  * <p>Access the singleton instance using the {@link ConnectionBase#getMarketState}
  * function.</p>
  *
  * @public
  */

	var MarketState = function () {
		function MarketState(handleProfileRequest) {
			_classCallCheck(this, MarketState);

			this._internal = MarketStateInternal(handleProfileRequest);
		}

		/**
   * @public
   * @param {string} symbol
   * @return {Book}
   */


		_createClass(MarketState, [{
			key: 'getBook',
			value: function getBook(symbol) {
				return this._internal.getBook(symbol);
			}

			/**
    * @public
    * @param {string} symbol
    * @param {function=} callback - invoked when the {@link CumulativeVolume} instance becomes available
    * @returns {Promise} The {@link CumulativeVolume} instance, as a promise
    */

		}, {
			key: 'getCumulativeVolume',
			value: function getCumulativeVolume(symbol, callback) {
				return this._internal.getCumulativeVolume(symbol, callback);
			}

			/**
    * @public
    * @param {string} symbol
    * @param {function=} callback - invoked when the {@link Profile} instance becomes available
    * @returns {Promise} The {@link Profile} instance, as a promise.
    */

		}, {
			key: 'getProfile',
			value: function getProfile(symbol, callback) {
				return this._internal.getProfile(symbol, callback);
			}

			/**
    * @public
    * @param {string} symbol
    * @return {Quote}
    */

		}, {
			key: 'getQuote',
			value: function getQuote(symbol) {
				return this._internal.getQuote(symbol);
			}

			/**
    * Returns the time the most recent market data message was received.
    *
    * @public
    * @return {Date}
    */

		}, {
			key: 'getTimestamp',
			value: function getTimestamp() {
				return this._internal.getTimestamp();
			}

			/**
    * @ignore
    */

		}, {
			key: 'processMessage',
			value: function processMessage(message) {
				return this._internal.processMessage(message);
			}

			/**
    * @ignore
    */

		}], [{
			key: 'CumulativeVolume',
			get: function get() {
				return CumulativeVolume;
			}

			/**
    * @ignore
    */

		}, {
			key: 'Profile',
			get: function get() {
				return Profile;
			}

			/**
    * @ignore
    */

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

},{"./../util/convertDayCodeToNumber":19,"./CumulativeVolume":7,"./Profile":9,"./Quote":10,"@barchart/marketdata-utilities-js":31}],9:[function(require,module,exports){
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

},{"./../util/parseSymbolType":24,"./../util/priceFormatter":25}],10:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
	'use strict';

	/**
  * Current market conditions for an instrument.
  *
  * @public
  */

	var Quote = function () {
		function Quote(symbol) {
			_classCallCheck(this, Quote);

			/**
    * @property {string} symbol - The instrument's symbol.
    */
			this.symbol = symbol || null;

			/**
    * @property {string} message - last DDF message that caused a mutation to this instance
    */
			this.message = null;

			/**
    * @property {string} flag - market status, will have one of three values: p, s, or undefined
    */
			this.flag = null;

			this.mode = null;

			/**
    * @property {string} day - one character code that indicates day of the month of the current trading session
    */
			this.day = null;

			/**
    * @property {number} dayNum - day of the month of the current trading session
    */
			this.dayNum = 0;

			this.session = null;
			this.lastUpdate = null;

			/**
    * @property {number} bidPrice - top-of-book price on the buy side
    */
			this.bidPrice = null;

			/**
    * @property {number} bidSize - top-of-book quantity on the buy side
    */
			this.bidSize = null;

			/**
    * @property {number} askPrice - top-of-book price on the sell side
    */
			this.askPrice = null;

			/**
    * @property {number} askSize - top-of-book quantity on the sell side
    */
			this.askSize = null;

			/**
    * @property {number} lastPrice - most recent price (not necessarily a trade)
    */
			this.lastPrice = null;

			/**
    * @property {number} tradePrice - most recent trade price
    */
			this.tradePrice = null;

			/**
    * @property {number} tradeSize - most recent trade quantity
    */
			this.tradeSize = null;

			this.numberOfTrades = null;
			this.vwap1 = null; // Exchange Provided
			this.vwap2 = null; // Calculated

			/**
    * @property {number} settlementPrice
    */
			this.settlementPrice = null;
			this.openPrice = null;
			this.highPrice = null;
			this.lowPrice = null;
			this.volume = null;
			this.openInterest = null;

			/**
    * @property {number} previousPrice - price from the previous session
    */
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

},{}],11:[function(require,module,exports){
'use strict';

var MarketState = require('./MarketState');

module.exports = function () {
	'use strict';

	return MarketState;
}();

},{"./MarketState":8}],12:[function(require,module,exports){
'use strict';

var parseMessage = require('./parseMessage'),
    parseTimestamp = require('./parseTimestamp'),
    parseValue = require('./parseValue');

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

},{"./parseMessage":13,"./parseTimestamp":14,"./parseValue":15}],13:[function(require,module,exports){
'use strict';

var utilities = require('@barchart/marketdata-utilities-js');

module.exports = function () {
	'use strict';

	return utilities.messageParser;
}();

},{"@barchart/marketdata-utilities-js":31}],14:[function(require,module,exports){
'use strict';

var utilities = require('@barchart/marketdata-utilities-js');

module.exports = function () {
	'use strict';

	return utilities.timestampParser;
}();

},{"@barchart/marketdata-utilities-js":31}],15:[function(require,module,exports){
'use strict';

var utilities = require('@barchart/marketdata-utilities-js');

module.exports = function () {
	'use strict';

	return utilities.priceParser;
}();

},{"@barchart/marketdata-utilities-js":31}],16:[function(require,module,exports){
'use strict';

var xhr = require('xhr');

module.exports = function () {
	'use strict';

	/**
  * Promise-based utility for resolving symbol aliases (e.g. ES*1 is a reference
  * to the front month for the ES contract -- not a concrete symbol). This
  * implementation is for use in browser environments.
  *
  * @public
  * @param {string} - The symbol to lookup (i.e. the alias).
  * @returns {Promise<string>}
  */

	return function (symbol) {
		return Promise.resolve().then(function () {
			if (typeof symbol !== 'string') {
				throw new Error('The "symbol" argument must be a string.');
			}

			if (symbol.length === 0) {
				throw new Error('The "symbol" argument must be at least one character.');
			}

			return new Promise(function (resolveCallback, rejectCallback) {
				try {
					var options = {
						url: 'https://instruments-prod.aws.barchart.com/instruments/' + encodeURIComponent(symbol),
						method: 'GET'
					};

					xhr(options, function (error, response, body) {
						if (error) {
							rejectCallback(error);
						} else if (response.statusCode !== 200) {
							rejectCallback('The server returned an HTTP ' + response.statusCode + ' response code.');
						} else {
							var _response = JSON.parse(body);

							if (!_response || !_response.instrument || !_response.instrument.symbol) {
								rejectCallback('The server was unable to resolve symbol ' + symbol + '.');
							} else {
								resolveCallback(_response.instrument.symbol);
							}
						}
					});
				} catch (e) {
					rejectCallback(e);
				}
			});
		});
	};
}();

},{"xhr":46}],17:[function(require,module,exports){
'use strict';

var utilities = require('@barchart/marketdata-utilities-js');

module.exports = function () {
	'use strict';

	return utilities.convert.baseCodeToUnitCode;
}();

},{"@barchart/marketdata-utilities-js":31}],18:[function(require,module,exports){
'use strict';

var utilities = require('@barchart/marketdata-utilities-js');

module.exports = function () {
	'use strict';

	return utilities.convert.dateToDayCode;
}();

},{"@barchart/marketdata-utilities-js":31}],19:[function(require,module,exports){
'use strict';

var utilities = require('@barchart/marketdata-utilities-js');

module.exports = function () {
	'use strict';

	return utilities.convert.dayCodeToNumber;
}();

},{"@barchart/marketdata-utilities-js":31}],20:[function(require,module,exports){
'use strict';

var utilities = require('@barchart/marketdata-utilities-js');

module.exports = function () {
	'use strict';

	return utilities.convert.unitCodeToBaseCode;
}();

},{"@barchart/marketdata-utilities-js":31}],21:[function(require,module,exports){
'use strict';

var utilities = require('@barchart/marketdata-utilities-js');

module.exports = function () {
	'use strict';

	return utilities.decimalFormatter;
}();

},{"@barchart/marketdata-utilities-js":31}],22:[function(require,module,exports){
'use strict';

var convertBaseCodeToUnitCode = require('./convertBaseCodeToUnitCode'),
    convertDateToDayCode = require('./convertDateToDayCode'),
    convertDayCodeToNumber = require('./convertDayCodeToNumber'),
    convertUnitCodeToBaseCode = require('./convertUnitCodeToBaseCode'),
    decimalFormatter = require('./decimalFormatter'),
    monthCodes = require('./monthCodes'),
    parseSymbolType = require('./parseSymbolType'),
    priceFormatter = require('./priceFormatter'),
    symbolResolver = require('./symbolResolver'),
    timeFormatter = require('./timeFormatter');

module.exports = function () {
	'use strict';

	return {
		convertBaseCodeToUnitCode: convertBaseCodeToUnitCode,
		convertUnitCodeToBaseCode: convertUnitCodeToBaseCode,
		convertDateToDayCode: convertDateToDayCode,
		convertDayCodeToNumber: convertDayCodeToNumber,
		decimalFormatter: decimalFormatter,
		monthCodes: monthCodes,
		parseSymbolType: parseSymbolType,
		symbolResolver: symbolResolver,

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

},{"./convertBaseCodeToUnitCode":17,"./convertDateToDayCode":18,"./convertDayCodeToNumber":19,"./convertUnitCodeToBaseCode":20,"./decimalFormatter":21,"./monthCodes":23,"./parseSymbolType":24,"./priceFormatter":25,"./symbolResolver":16,"./timeFormatter":26}],23:[function(require,module,exports){
'use strict';

var utilities = require('@barchart/marketdata-utilities-js');

module.exports = function () {
	'use strict';

	return utilities.monthCodes.getCodeToNameMap();
}();

},{"@barchart/marketdata-utilities-js":31}],24:[function(require,module,exports){
'use strict';

var utilities = require('@barchart/marketdata-utilities-js');

module.exports = function () {
	'use strict';

	return utilities.symbolParser.parseInstrumentType;
}();

},{"@barchart/marketdata-utilities-js":31}],25:[function(require,module,exports){
'use strict';

var utilities = require('@barchart/marketdata-utilities-js');

module.exports = function () {
	'use strict';

	return utilities.priceFormatter;
}();

},{"@barchart/marketdata-utilities-js":31}],26:[function(require,module,exports){
'use strict';

var utilities = require('@barchart/marketdata-utilities-js');

module.exports = function () {
	'use strict';

	return utilities.timeFormatter;
}();

},{"@barchart/marketdata-utilities-js":31}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{"./../XmlDomParserBase":27}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{"lodash.isnan":43}],31:[function(require,module,exports){
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

},{"./convert":29,"./decimalFormatter":30,"./messageParser":32,"./monthCodes":33,"./priceFormatter":34,"./priceParser":35,"./symbolFormatter":36,"./symbolParser":37,"./timeFormatter":38,"./timestampParser":39}],32:[function(require,module,exports){
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

},{"./common/xml/XmlDomParser":28,"./priceParser":35,"./timestampParser":39}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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

},{"./decimalFormatter":30,"lodash.isnan":43}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
'use strict';

module.exports = function () {
	'use strict';

	var exchangeRegex = /^(.*)\\.([A-Z]{1,4})$/i,
	    jerqFutureConversionRegex = /(.{1,3})([A-Z]{1})([0-9]{3}|[0-9]{1})?([0-9]{1})$/i,
	    concreteFutureRegex = /^(.{1,3})([A-Z]{1})([0-9]{4}|[0-9]{1,2})$/i,
	    referenceFutureRegex = /^(.{1,3})(\*{1})([0-9]{1})$/i,
	    futureSpreadRegex = /^_S_/i,
	    forexRegex = /^\^([A-Z]{3})([A-Z]{3})$/i,
	    sectorRegex = /^\-(.*)$/i,
	    indexRegex = /^\$(.*)$/i,
	    batsRegex = /^(.*)\.BZ$/i,
	    usePercentRegex = /(\.RT)$/;

	function getIsType(symbol, type) {
		var instrumentType = symbolParser.parseInstrumentType(symbol);

		return instrumentType !== null && instrumentType.type === type;
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

},{}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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

},{"is-function":42}],41:[function(require,module,exports){
(function (global){
var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
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
},{"for-each":40,"trim":45}],45:[function(require,module,exports){

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

},{}],46:[function(require,module,exports){
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

},{"global/window":41,"is-function":42,"parse-headers":44,"xtend":47}],47:[function(require,module,exports){
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

},{}]},{},[6])(6)
});