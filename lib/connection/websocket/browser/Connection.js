var ConnectionBase = require('./../../ConnectionBase');
var MarketState = require('./../../../marketState/MarketState');
var parseMessage = require('./../../../messageParser/parseMessage');

var jQueryProvider = require('./../../../common/jQuery/jQueryProvider');

module.exports = function() {
	'use strict';

	var _API_VERSION = 4;

	var $ = jQueryProvider.getInstance();

	var Connection = function() {
		var __state = 'DISCONNECTED';
		var __isConsumerDisconnect = false;

		var __marketState = new MarketState();
		var __connection = null;

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
			var task = __tasks.pop();

			if (!task) {
				__tasks.push({ id: id, symbols: [symbol] });
			} else if (task.id == id) {
				task.symbols.push(symbol);
				__tasks.push(task);
			} else {
				__tasks.push(task);
				__tasks.push({id: id, symbols: [symbol]});
			}
		}

		function broadcastEvent(eventId, message) {
			var listeners;

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

			if (!listeners)
				return;

			for (var i = 0; i < listeners.length; i++) {
				var listener = listeners[i];

				listener(message);
			}
		}

		function connect(server, username, password) {
			if (__connection)
				return;

			/* don't try to reconnect if explicitly told to disconnect */
			if(__isConsumerDisconnect === true){
				return;
			}

			__loginInfo.username = username;
			__loginInfo.password = password;
			__loginInfo.server = server;

			if (window.WebSocket) {
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

						var marketUpdateSymbols = [ ];

						for (var s in __marketUpdateSymbols) {
							marketUpdateSymbols.push(s);
						}

						for (var s in __cumulativeVolumeSymbols) {
							marketUpdateSymbols.push(s);
						}

						marketUpdateSymbols.sort();

						var previousUpdateSymbol = null;

						for (var i = 0; i < marketUpdateSymbols.length; i++) {
							var currentUpdateSymbol = marketUpdateSymbols[i];

							if (currentUpdateSymbol !== previousUpdateSymbol) {
								addTask('MU_GO', currentUpdateSymbol);

								previousUpdateSymbol = currentUpdateSymbol;
							}
						}

						for (var k in __marketDepthSymbols) {
							addTask('MD_GO', k);
						}

					}, 5000);
				};

				__connection.onmessage = function(evt) {
					__networkMessages.push(evt.data);
				};

				__connection.onopen = function(evt) {
					console.log(new Date() + ' connection open.');
				};
			}
			else {
				console.warn('Websockets are not supported by this browser. Invoking refreshing quotes.');
				setTimeout(refreshQuotes, 1000);
			}
		}

		function disconnect() {
			__state = 'DISCONNECTED';

			if (__connection !== null) {
				__connection.send("LOGOUT\r\n");
				__connection.close();
				__connection = null;
			}

			__tasks = [];
			__commands = [];
			__feedMessages = [];

			__marketDepthSymbols = {};
			__marketUpdateSymbols = {};
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
				throw new Error("Bad number of arguments. Must pass in an eventId and handler.");

			var eventId = arguments[0];
			var handler = arguments[1];

			var symbol;

			if (arguments.length > 2) {
				symbol = arguments[2];
			} else {
				symbol = null;
			}

			var removeHandler = function(listeners) {
				var found = false;

				listeners = listeners || [ ];

				for (var i = listeners.length - 1; !(i < 0); i--) {
					if (listeners[i] == handler) {
						listeners.splice(i, 1);

						found = true;
					}
				}

				return found && listeners.length === 0;
			};

			var unsubscribe = function(trackingMap, taskName, listenerMap, additionalListenerMaps) {
				if (removeHandler(listenerMap[symbol])) {
					delete listenerMap[symbol];
					delete trackingMap[symbol];

					var stop = true;

					for (var i = 0; i < additionalListenerMaps.length; i++) {
						if (additionalListenerMaps[i][symbol]) {
							stop = false;

							break;
						}
					}

					if (stop) {
						addTask(taskName, symbol);
					}
				}
			};

			switch (eventId) {
				case 'events': {
					removeHandler(__listeners.events);

					break;
				}
				case 'marketDepth': {
					if (arguments.length < 3)
						throw new Error("Invalid arguments. Invoke as follows: off('marketDepth', handler, symbol)");

					unsubscribe(__marketDepthSymbols, "MD_STOP", __listeners.marketDepth, [ ]);

					break;
				}
				case 'marketUpdate': {
					if (arguments.length < 3)
						throw new Error("Invalid arguments. Invoke as follows: off('marketUpdate', handler, symbol)");

					unsubscribe(__marketUpdateSymbols, "MD_STOP", __listeners.marketUpdate, [ __listeners.cumulativeVolume ]);

					break;
				}
				case 'cumulativeVolume': {
					if (arguments.length < 3)
						throw new Error("Invalid arguments. Invoke as follows: off('cumulativeVolume', handler, symbol)");

					unsubscribe(__cumulativeVolumeSymbols, "MD_STOP", __listeners.cumulativeVolume, [ __listeners.marketUpdate ]);

					break;
				}
				case 'timestamp': {
					removeHandler(__listeners.timestamp);

					break;
				}
			}
		}

		function on() {
			if (arguments.length < 2)
				throw new Error("Bad number of arguments. Must pass in an eventId and handler.");

			var eventId = arguments[0];
			var handler = arguments[1];

			var symbol;

			if (arguments.length > 2) {
				symbol = arguments[2];
			} else {
				symbol = null;
			}

			var addHandler = function(listeners) {
				listeners = listeners || [ ];

				var add = true;

				for (var i = 0; i < listeners.length; i++) {
					if (listeners[i] == handler) {
						add = false;
						break;
					}
				}

				var updatedListeners;

				if (add) {
					updatedListeners = listeners.slice(0);
					updatedListeners.push(handler);
				} else {
					updatedListeners = listeners;
				}

				return updatedListeners;
			};

			var subscribe = function(trackingMap, taskName, listenerMap, additionalListenerMaps) {
				listenerMap[symbol] = addHandler(listenerMap[symbol]);

				if (!trackingMap[symbol]) {
					trackingMap[symbol] = true;

					var start = true;

					for (var i = 0; i < additionalListenerMaps.length; i++) {
						if (additionalListenerMaps[i][symbol]) {
							start = false;

							break;
						}
					}

					if (start) {
						addTask(taskName, symbol);
					}
				}
			};

			switch (eventId) {
				case 'events': {
					__listeners.events = addHandler(__listeners.events);

					break;
				}
				case 'marketDepth': {
					if (arguments.length < 3)
						throw new Error("Invalid arguments. Invoke as follows: on('marketDepth', handler, symbol)");

					subscribe(__marketDepthSymbols, "MD_GO", __listeners.marketDepth, [ ]);

					if (getMarketState().getBook(symbol))
						handler({ type: 'INIT', symbol: symbol });

					break;
				}
				case 'marketUpdate': {
					if (arguments.length < 3)
						throw new Error("Invalid arguments. Invoke as follows: on('marketUpdate', handler, symbol)");

					subscribe(__marketUpdateSymbols, "MU_GO", __listeners.marketUpdate, [ __listeners.cumulativeVolume ]);

					if (getMarketState().getQuote(symbol))
						handler({ type: 'INIT', symbol: symbol });

					break;
				}
				case 'cumulativeVolume': {
					if (arguments.length < 3)
						throw new Error("Invalid arguments. Invoke as follows: on('cumulativeVolume', handler, symbol)");

					subscribe(__marketUpdateSymbols, "MU_GO", __listeners.cumulativeVolume, [ __listeners.marketUpdate ]);

					getMarketState().getCumulativeVolume(symbol, function(container) {
						container.on('events', handler);
					});

					break;
				}
				case 'timestamp': {
					__listeners.timestamp = addHandler(__listeners.timestamp);

					break;
				}
			}
		}

		function onNewMessage(msg) {
			var message;
			try {
				message = parseMessage(msg);
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
			}
		}

		function processCommands() {
			var cmd = __commands.shift();
			while (cmd) {
				console.log(cmd);
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

				if (__feedMessages.length === 0)
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
				while (__tasks.length > 0) {
					var task = __tasks.shift();
					var cmd = '';
					var suffix = '';
					switch (task.id) {
						case 'MD_GO':
							cmd = 'GO';
							suffix = 'Bb';
							break;
						case 'MU_GO':
							cmd = 'GO';
							suffix = 'Ssc';
							break;
						case 'MD_STOP':
							cmd = 'STOP';
							suffix = 'Bb';
							break;
						case 'MU_STOP':
							cmd = 'STOP';
							suffix = 'Ssc';
							break;
					}

					var s = cmd + ' ';
					for (var i = 0; i < task.symbols.length; i++) {
						if (i > 0)
							s += ',';
						s += task.symbols[i] + '=' + suffix;
					}

					__commands.push(s);
				}
			}

			setTimeout(pumpTasks, 250);
		}

		function refreshQuotes() {
			var symbols = [];
			for (var k in __marketUpdateSymbols) {
				symbols.push(k);
			}

			//TO DO: verify that this proxy gets market depth and then add that list

			$.ajax({
				url: 'quotes.php?username=' + __loginInfo.username + '&password=' + __loginInfo.password + '&symbols=' + symbols.join(',')
			}).done(function(xml) {
				$(xml).find('QUOTE').each(function() {
					onNewMessage('%' + this.outerHTML);
				});
			});
			setTimeout(refreshQuotes, 5000);
		}

		function getActiveSymbolCount() {
			var list = {};
			for (var k in __marketUpdateSymbols) {
				if (__marketUpdateSymbols[k] === true)
					list[k] = true;
			}

			for (var k in __marketDepthSymbols) {
				if (__marketDepthSymbols[k] === true)
					list[k] = true;
			}

			return Object.keys(list).length;
		}

		setTimeout(processCommands, 200);
		setTimeout(pumpMessages, 125);
		setTimeout(pumpTasks, 250);
		setTimeout(processFeedMessages, 125);

		return {
			connect : function(server, username, password){
				/* always reset when told to connect */
				__isConsumerDisconnect = false;

				connect(server, username, password);
				return this;
			},
			disconnect: function(){
				/* set to true so we know not to reconnect */
				__isConsumerDisconnect = true;

				disconnect();
				return this;
			},
			getMarketState: getMarketState,
			getPassword : getPassword,
			getUsername : getUsername,
			off: off,
			on: on,
			getActiveSymbolCount: getActiveSymbolCount
		};
	};

	return ConnectionBase.extend({
		init: function() {
			this._wrapppedConnection = new Connection();
		},

		_connect: function(server, username, password) {
			this._wrapppedConnection.connect(server, username, password);
		},

		_disconnect: function() {
			this._wrapppedConnection.disconnect();
		},

		_on: function() {
			this._wrapppedConnection.on.apply(this._wrapppedConnection, arguments);
		},

		_off: function() {
			this._wrapppedConnection.off.apply(this._wrapppedConnection, arguments);
		},

		_getMarketState: function() {
			return this._wrapppedConnection.getMarketState();
		},

		_getActiveSymbolCount: function() {
			return this._wrapppedConnection.getActiveSymbolCount();
		},

		_getPassword: function() {
			return this._wrapppedConnection.getPassword();
		},

		_getUsername: function() {
			return this._wrapppedConnection.getUsername();
		},

		toString: function() {
			return '[ConnectionBase]';
		}
	});
}();