const utilities = require('@barchart/marketdata-utilities-js');

const array = require('./../../../common/lang/array'),
	object = require('./../../../common/lang/object');

const ConnectionBase = require('./../../ConnectionBase'),
	parseMessage = require('./../../../messageParser/parseMessage');

const _window = self || window;

module.exports = (() => {
	'use strict';

	const _API_VERSION = 4;

	const state = {
		connecting: 'CONNECTING',
		authenticating: 'LOGGING_IN',
		authenticated: 'LOGGED_IN',
		disconnected: 'DISCONNECTED'
	};

	const ascii = {
		soh: '\x01',
		etx: '\x03',
		lf: '\x0A',
		dc4: '\x14'
	};

	const _RECONNECT_INTERVAL = 5000;
	const _HEARTBEAT_INTERVAL = 10000;

	function ConnectionInternal(marketState) {
		const __marketState = marketState;

		let __state = state.disconnected;
		let __suppressReconnect = false;

		let __pollingFrequency = null;

		let __connection = null;
		let __watchdog = null;
		let __lastMessageTime = null;

		let __activeConsumerSymbols = {};
		let __knownConsumerSymbols = {};

		let __pendingProfileLookups = {};

		const __listeners = {
			marketDepth: {},
			marketUpdate: {},
			cumulativeVolume: {},
			events: [],
			timestamp: []
		};
		
		let __tasks = [];
		let __commands = [];
		let __feedMessages = [];
		let __networkMessages = [];

		const __loginInfo = {
			username: null,
			password: null,
			server: null
		};

		let __decoder;

		if (_window.TextDecoder) {
			__decoder = new TextDecoder();
		} else {
			__decoder = {
				decode: function (arr) {
					return String.fromCharCode.apply(null, new Uint8Array(arr));
				}
			};
		}

		function addTask(id, symbol) {
			const lastIndex = __tasks.length - 1;

			if (lastIndex > 0 && __tasks[lastIndex].id === id) {
				__tasks[lastIndex].symbols.push(symbol);
			} else {
				__tasks.push({ id: id, symbols: [symbol] });
			}
		}

		function broadcastEvent(eventId, message) {
			let listeners;

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
				listeners.forEach(listener => listener(message));
			}
		}

		function enqueueGoTasks() {
			getProducerSymbols([__listeners.marketUpdate, __listeners.cumulativeVolume]).forEach((symbol) => {
				addTask('MU_GO', symbol);
			});

			getProducerSymbols([__listeners.marketDepth]).forEach((symbol) => {
				addTask('MD_GO', symbol);
			});
		}

		function enqueueStopTasks() {
			getProducerSymbols([__listeners.marketUpdate, __listeners.cumulativeVolume]).forEach((symbol) => {
				addTask('MU_STOP', symbol);
			});

			getProducerSymbols([__listeners.marketDepth]).forEach((symbol) => {
				addTask('MU_STOP', symbol);
			});
		}

		function clearTasks() {
			__tasks = [];
		}

		function connect(server, username, password) {
			if (__connection || __suppressReconnect) {
				return;
			}

			__loginInfo.username = username;
			__loginInfo.password = password;
			__loginInfo.server = server;

			if (_window.WebSocket) {
				__state = state.disconnected;

				__connection = new WebSocket('wss://' + __loginInfo.server + '/jerq');
				__connection.binaryType = "arraybuffer";

				if (!__watchdog) {
					__watchdog = _window.setInterval(() => {
						if (!__lastMessageTime && __connection) {
							/* we should have seen a message in 10 seconds */
							/* trigger close event to handle reconnect */
							/* sending logout if we can to prevent CIP lockouts */
							console.log(new Date() + ' bouncing, heartbeat timeout');

							try {
								if (__connection.readyState === WebSocket.OPEN) {
									__connection.send('LOGOUT\r\n');
								}
								__connection.close();
							} catch (e) {
								console.warn('failed to send LOGOUT', e);
							}
						}

						__lastMessageTime = null;
					}, _HEARTBEAT_INTERVAL);
				}

				__connection.onclose = (evt) => {
					console.warn(new Date() + ' connection closed. pending messages', __networkMessages);

					__connection.onclose = null;
					__connection.onopen = null;
					__connection.onmessage = null;
					__connection = null;

					__lastMessageTime = null;

					// there is a race condition. it's possible that the setTimeout 
					// that triggers pumpMessages will never fire, never triggering badLogin
					// we do not reconnect if jerq explicitly says, - Login Failed.
					//
					if (__networkMessages.length === 1 && __networkMessages[0].indexOf('-') === 0) {
						console.warn('not triggering reconnect: bad credentails');
						disconnect();
						return;
					}

					__state = state.disconnected;

					broadcastEvent('events', { event: 'disconnect' });

					if (__suppressReconnect) {
						console.warn('not triggering reconnect: user has logged out.');
						return;
					}

					setTimeout(() => {
						connect(__loginInfo.server, __loginInfo.username, __loginInfo.password);

						/* let's not DDoS */
						clearTasks();

						enqueueGoTasks();
					}, (_RECONNECT_INTERVAL + Math.floor(Math.random() * _HEARTBEAT_INTERVAL)));
				};

				__connection.onmessage = (evt) => {
					__lastMessageTime = 1;

					if (evt.data instanceof ArrayBuffer) {
						let msg = __decoder.decode(evt.data);

						if (msg) {
							__networkMessages.push(msg);
						}
					} else {
						__networkMessages.push(evt.data);
					}
				};

				__connection.onopen = (evt) => {
					console.log(new Date() + ' connection open.');
				};
			} else {
				console.warn('Websockets are not supported by this browser.');
			}
		}

		function disconnect() {
			console.warn('shutting down.');

			__state = state.disconnected;

			if (__watchdog !== null) {
				_window.clearInterval(__watchdog);
			}

			if (__connection !== null) {
				__connection.send('LOGOUT\r\n');
				__connection.close();
			}

			__watchdog = null;
			__lastMessageTime = null;

			__tasks = [];
			__commands = [];
			__feedMessages = [];
		}

		function handleNetworkMessage(message) {
			if (__state === state.disconnected) {
				__state = state.connecting;
			}

			if (__state === state.connecting) {
				const lines = message.split('\n');

				lines.forEach((line) => {
					if (line == '+++') {
						__state = state.authenticating;
						__commands.splice(0, 0, 'LOGIN ' + __loginInfo.username + ':' + __loginInfo.password + " VERSION=" + _API_VERSION + "\r\n");
					}
				});
			} else if (__state === state.authenticating) {
				const firstCharacter = message.charAt(0);

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

		function getProducerSymbols(listenerMaps) {
			const producerSymbols = listenerMaps.reduce((symbols, listenerMap) => {
				return symbols.concat(object.keys(listenerMap));
			}, [ ]);

			return array.unique(producerSymbols);
		}

		function getProducerListenerExists(producerSymbol, listenerMaps) {
			const consumerSymbols = __knownConsumerSymbols[producerSymbol] || [ ];

			return consumerSymbols.some(consumerSymbol => getConsumerListenerExists(consumerSymbol, listenerMaps));
		}

		function getConsumerListenerExists(consumerSymbol, listenerMaps) {
			return listenerMaps.some(listenerMap => listenerMap.hasOwnProperty(consumerSymbol) && listenerMap[consumerSymbol].length !== 0);
		}

		function addKnownConsumerSymbol(consumerSymbol, producerSymbol) {
			if (!__knownConsumerSymbols.hasOwnProperty(producerSymbol)) {
				__knownConsumerSymbols[producerSymbol] = [ ];
			}

			const consumerSymbols = __knownConsumerSymbols[producerSymbol];

			if (!consumerSymbols.some(candidate => candidate === consumerSymbol)) {
				consumerSymbols.push(consumerSymbol);
			}
		}

		function getActiveConsumerSymbols(producerSymbol) {
			const knownConsumerSymbols = __knownConsumerSymbols[producerSymbol] || [ ];
			
			const activeConsumerSymbols = knownConsumerSymbols.filter((knownConsumerSymbol) => {
				return getConsumerListenerExists(knownConsumerSymbol, [ __listeners.marketDepth, __listeners.marketUpdate, __listeners.cumulativeVolume ]);
			});

			return activeConsumerSymbols;
		}

		function off() {
			if (arguments.length < 2) {
				throw new Error("Wrong number of arguments. Must pass in an eventId and handler.");
			}

			const eventId = arguments[0];
			const handler = arguments[1];

			let symbol;

			if (arguments.length > 2) {
				symbol = arguments[2];
			} else {
				symbol = null;
			}

			const removeHandler = (listeners) => {
				const listenersToFilter = listeners || [];

				return listenersToFilter.filter((candidate) => {
					return candidate !== handler;
				});
			};

			const unsubscribe = (stopTaskName, listenerMap, sharedListenerMaps) => {
				const consumerSymbol = symbol;
				const producerSymbol = utilities.symbolParser.getProducerSymbol(consumerSymbol);

				const listenerMaps = sharedListenerMaps.concat(listenerMap);

				let previousProducerListenerExists = getProducerListenerExists(producerSymbol, listenerMaps);
				let currentProducerListenerExists;

				listenerMap[consumerSymbol] = removeHandler(listenerMap[consumerSymbol] || []);

				currentProducerListenerExists = getProducerListenerExists(producerSymbol, listenerMaps);

				if (previousProducerListenerExists && !currentProducerListenerExists) {
					addTask(stopTaskName, producerSymbol);
				}

				__activeConsumerSymbols[producerSymbol] = getActiveConsumerSymbols(producerSymbol);
			};

			switch (eventId) {
				case 'events':
					__listeners.events = removeHandler(__listeners.events);

					break;
				case 'marketDepth':
					if (arguments.length < 3) {
						throw new Error("Invalid arguments. Invoke as follows: off('marketDepth', handler, symbol)");
					}

					unsubscribe("MD_STOP", __listeners.marketDepth, []);

					break;
				case 'marketUpdate':
					if (arguments.length < 3) {
						throw new Error("Invalid arguments. Invoke as follows: off('marketUpdate', handler, symbol)");
					}

					unsubscribe("MU_STOP", __listeners.marketUpdate, [__listeners.cumulativeVolume]);

					break;
				case 'cumulativeVolume':
					if (arguments.length < 3) {
						throw new Error("Invalid arguments. Invoke as follows: off('cumulativeVolume', handler, symbol)");
					}

					unsubscribe("MU_STOP", __listeners.cumulativeVolume, [__listeners.marketUpdate]);

					__marketState.getCumulativeVolume(symbol, (container) => {
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

			const eventId = arguments[0];
			const handler = arguments[1];

			let symbol;

			if (arguments.length > 2) {
				symbol = arguments[2];
			} else {
				symbol = null;
			}

			const addListener = (listeners) => {
				listeners = listeners || [];

				const add = !listeners.some((candidate) => {
					return candidate === handler;
				});

				let updatedListeners;

				if (add) {
					updatedListeners = listeners.slice(0);
					updatedListeners.push(handler);
				} else {
					updatedListeners = listeners;
				}

				return updatedListeners;
			};

			const subscribe = (streamingTaskName, snapshotTaskName, listenerMap, sharedListenerMaps) => {
				const consumerSymbol = symbol;
				const producerSymbol = utilities.symbolParser.getProducerSymbol(consumerSymbol);

				addKnownConsumerSymbol(consumerSymbol, producerSymbol);

				const producerListenerExists = getProducerListenerExists(producerSymbol, sharedListenerMaps.concat(listenerMap));

				listenerMap[consumerSymbol] = addListener(listenerMap[consumerSymbol]);

				if (producerListenerExists) {
					addTask(snapshotTaskName, producerSymbol);
				} else {
					addTask(streamingTaskName, producerSymbol);
				}

				__activeConsumerSymbols[producerSymbol] = getActiveConsumerSymbols(producerSymbol);
			};

			switch (eventId) {
				case 'events':
					__listeners.events = addListener(__listeners.events);
					break;
				case 'marketDepth':
					if (arguments.length < 3) {
						throw new Error("Invalid arguments. Invoke as follows: on('marketDepth', handler, symbol)");
					}

					subscribe("MD_GO", "MD_REFRESH", __listeners.marketDepth);

					if (__marketState.getBook(symbol)) {
						handler({ type: 'INIT', symbol: symbol });
					}

					break;
				case 'marketUpdate':
					if (arguments.length < 3) {
						throw new Error("Invalid arguments. Invoke as follows: on('marketUpdate', handler, symbol)");
					}

					subscribe("MU_GO", "MU_REFRESH", __listeners.marketUpdate, [__listeners.cumulativeVolume]);

					if (__marketState.getQuote(symbol)) {
						handler({ type: 'INIT', symbol: symbol });
					}

					break;
				case 'cumulativeVolume':
					if (arguments.length < 3) {
						throw new Error("Invalid arguments. Invoke as follows: on('cumulativeVolume', handler, symbol)");
					}

					subscribe("MU_GO", "MU_REFRESH", __listeners.cumulativeVolume, [__listeners.marketUpdate]);

					__marketState.getCumulativeVolume(symbol, (container) => {
						container.on('events', handler);
					});

					break;
				case 'timestamp':
					__listeners.timestamp = addListener(__listeners.timestamp);
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
			let message;

			try {
				message = parseMessage(raw);

				if (message.type) {
					if (message.symbol) {
						let consumerSymbols = __activeConsumerSymbols[message.symbol] || [];

						if (__pendingProfileLookups.hasOwnProperty(message.symbol)) {
							consumerSymbols = array.unique(consumerSymbols.concat(__pendingProfileLookups[message.symbol]));

							delete __pendingProfileLookups[message.symbol];
						}

						consumerSymbols.forEach((consumerSymbol) => {
							let messageToProcess;

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
			if ((__state === state.authenticating || __state === state.authenticated) && __connection) {
				let command = __commands.shift();

				// it's possible that on re-connect, the GO commands would be sent before the login
				// commands causing logout.

				if (__state === state.authenticating && command && command.indexOf('GO') === 0) {
					console.log('pushing back GO command until fully authenticated.');
					__commands.push(command);
				} else {
					while (command) {
						console.log(command);

						__connection.send(command);
						command = __commands.shift();
					}
				}
			}

			setTimeout(processCommands, 200);
		}

		function processFeedMessages() {
			const suffixLength = 9;

			let done = false;

			while (!done) {
				let s = __feedMessages.shift();

				if (!s) {
					done = true;
				} else {
					let skip = false;

					let msgType = 1; // Assume DDF message containing \x03

					let idx = -1;
					let idxETX = s.indexOf(ascii.etx);
					let idxNL = s.indexOf(ascii.lf);

					if ((idxNL > -1) && ((idxETX < 0) || (idxNL < idxETX))) {
						idx = idxNL;
						msgType = 2;
					}
					else if (idxETX > -1) {
						idx = idxETX;
					}

					if (idx > -1) {
						let epos = idx + 1;
						if (msgType == 1) {
							if (s.length < idx + suffixLength + 1) {
								if (__feedMessages.length > 0)
									__feedMessages[0] = s + __feedMessages[0];
								else {
									__feedMessages.unshift(s);
									done = true;
								}

								skip = true;
							} else if (s.substr(idx + 1, 1) == ascii.dc4) {
								epos += suffixLength + 1;
							}
						}

						if (!skip) {
							let s2 = s.substring(0, epos);
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
			let message = __networkMessages.shift();

			while (message) {
				handleNetworkMessage(message);
				message = __networkMessages.shift();
			}

			setTimeout(pumpMessages, 125);
		}

		function pumpStreamingTasks(forced) {
			if (__state === state.authenticated) {
				while (__tasks.length > 0) {
					const task = __tasks.shift();

					if (task.callback) {
						task.callback();
					} else if (task.id) {
						let command = '';
						let suffix = '';

						switch (task.id) {
							case 'MD_GO':
								command = 'GO';
								suffix = 'Bb';
								break;
							case 'MU_GO':
								command = 'GO';
								suffix = 'Ssc';
								break;
							case 'MD_REFRESH':
								command = 'GO';
								suffix = 'b';
								break;
							case 'MU_REFRESH':
								command = 'GO';
								suffix = 'sc';
								break;
							case 'P_SNAPSHOT':
								command = 'GO';
								suffix = 's';
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

						const uniqueSymbols = array.unique(task.symbols);

						let batchSize;

						if (task.id === 'MD_GO' || task.id === 'MD_STOP') {
							batchSize = 1;
						} else {
							batchSize = 250;
						}

						while (uniqueSymbols.length > 0) {
							const batch = uniqueSymbols.splice(0, batchSize);

							__commands.push(`${command} ${batch.join(',')}=${suffix}`);
						}
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

				const getBatches = (symbols) => {
					const partitions = [];

					while (symbols.length !== 0) {
						partitions.push(symbols.splice(0, 250));
					}

					return partitions;
				};

				const quoteBatches = getBatches(getProducerSymbols([__listeners.marketUpdate, __listeners.cumulativeVolume]));

				quoteBatches.forEach((batch) => {
					__commands.push(`GO ${batch.join(',')}=sc`);
				});

				const bookBatches = getBatches(getProducerSymbols([__listeners.marketDepth]));

				quoteBatches.forEach((batch) => {
					__commands.push(`GO ${batch.join(',')}=b`);
				});

				const profileBatches = getBatches(array.unique(object.keys(__pendingProfileLookups)).filter(s => !quoteBatches.some(q => q === s)));

				profileBatches.forEach((batch) => {
					__commands.push(`GO ${batch.join(',')}=s`);
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

		function getActiveSymbolCount() {
			return getProducerSymbols([__listeners.marketDepth, __listeners.marketUpdate, __listeners.cumulativeVolume]).length;
		}

		function resetTaskPump(polling) {
			let pumpDelegate;
			let milliseconds;

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

		function handleProfileRequest(consumerSymbol) {
			const producerSymbol = utilities.symbolParser.getProducerSymbol(consumerSymbol);

			const pendingConsumerSymbols = __pendingProfileLookups[producerSymbol] || [ ];

			if (!pendingConsumerSymbols.some(candidate => candidate === consumerSymbol)) {
				pendingConsumerSymbols.push(consumerSymbol);
			}

			if (!pendingConsumerSymbols.some(candidate => candidate === producerSymbol)) {
				pendingConsumerSymbols.push(producerSymbol);
			}

			__pendingProfileLookups[producerSymbol] = pendingConsumerSymbols;

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
	class Connection extends ConnectionBase {
		constructor() {
			super();

			this._internal = ConnectionInternal(this.getMarketState());
		}

		_connect() {
			this._internal.connect(this.getServer(), this.getUsername(), this.getPassword());
		}

		_disconnect() {
			this._internal.disconnect();
		}

		_on() {
			this._internal.on.apply(this._internal, arguments);
		}

		_off() {
			this._internal.off.apply(this._internal, arguments);
		}

		_getActiveSymbolCount() {
			return this._internal.getActiveSymbolCount();
		}

		_onPollingFrequencyChanged(pollingFrequency) {
			return this._internal.setPollingFrequency(pollingFrequency);
		}

		_handleProfileRequest(symbol) {
			this._internal.handleProfileRequest(symbol);
		}

		toString() {
			return '[Connection]';
		}
	}

	return Connection;
})();