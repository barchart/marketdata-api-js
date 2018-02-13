const utilities = require('@barchart/marketdata-utilities-js');

const object = require('./../../../common/lang/object');

const ConnectionBase = require('./../../ConnectionBase'),
	parseMessage = require('./../../../messageParser/parseMessage');

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

	function ConnectionInternal(marketState) {
		const __marketState = marketState;

		let __state = state.disconnected;
		let __suppressReconnect = false;

		let __pollingFrequency = null;

		let __connection = null;

		let __producerSymbols = {};
		let __marketDepthSymbols = {};
		let __marketUpdateSymbols = {};
		let __cumulativeVolumeSymbols = {};
		let __profileLookupSymbols = {};

		let __tasks = [];
		let __commands = [];
		let __feedMessages = [];
		let __networkMessages = [];

		const __listeners = {
			events: [],
			marketDepth: {},
			marketUpdate: {},
			cumulativeVolume: {},
			timestamp: []
		};

		const __loginInfo = {
			username: null,
			password: null,
			server: null
		};

		function addTask(id, symbol) {
			const lastIndex = __tasks.length - 1;

			if (lastIndex > 0 && __tasks[lastIndex].id === id) {
				__tasks[lastIndex].symbols.push(symbol);
			} else {
				__tasks.push({id: id, symbols: [symbol]});
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
			object.keys(__marketUpdateSymbols).forEach((symbol) => {
				addTask('MU_GO', symbol);
			});

			object.keys(__cumulativeVolumeSymbols).forEach((symbol) => {
				addTask('MU_GO', symbol);
			});

			object.keys(__marketDepthSymbols).forEach((symbol) => {
				addTask('MD_GO', symbol);
			});
		}

		function enqueueStopTasks() {
			object.keys(__marketUpdateSymbols).forEach((symbol) => {
				addTask('MU_STOP', symbol);
			});

			object.keys(__cumulativeVolumeSymbols).forEach((symbol) => {
				addTask('MU_STOP', symbol);
			});

			object.keys(__marketDepthSymbols).forEach((symbol) => {
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
				__connection.binaryType = "arraybuffer";

				__connection.onclose = (evt) => {
					console.warn(new Date() + ' connection closed.');

					__connection = null;

					if (__state !== state.authenticated) {
						return;
					}

					__state = state.disconnected;

					broadcastEvent('events', {event: 'disconnect'});

					setTimeout(() => {
						__connection = null;

						connect(__loginInfo.server, __loginInfo.username, __loginInfo.password);

						enqueueGoTasks();
					}, _RECONNECT_INTERVAL);
				};

				__connection.onmessage = (evt) => {
					if (evt.data instanceof ArrayBuffer) {
						var decoder = new TextDecoder();
						var msg = decoder.decode(evt.data);
						__networkMessages.push(msg);
				}
				else				
					__networkMessages.push(evt.data);
				};

				__connection.onopen = (evt) => {
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
				const lines = message.split('\n');

				lines.forEach((line) => {
					if (line == '+++') {
						__state = state.authenticating;
						__commands.push('LOGIN ' + __loginInfo.username + ':' + __loginInfo.password + " VERSION=" + _API_VERSION + "\r\n");
					}
				});
			} else if (__state === state.authenticating) {
				const firstCharacter = message.charAt(0);

				if (firstCharacter === '+') {
					__state = state.authenticated;
					broadcastEvent('events', {event: 'login success'});
				} else if (firstCharacter === '-') {
					disconnect();
					broadcastEvent('events', {event: 'login fail'});
				}
			}

			if (__state === state.authenticated) {
				__feedMessages.push(message);
			}
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
				const listenersToFilter = (listeners || []);

				return listenersToFilter.filter((candidate) => {
					return candidate !== handler;
				});
			};

			const getConsumerIsActive = (consumerSymbol, listenerMaps) => {
				return listenerMaps.reduce((active, listenerMap) => {
					return active || listenerMap.hasOwnProperty(consumerSymbol);
				}, false);
			};

			const unsubscribe = (trackingMap, taskName, listenerMap, additionalTrackingMaps, additionalListenerMaps) => {
				const consumerSymbol = symbol;
				const producerSymbol = utilities.symbolParser.getProducerSymbol(consumerSymbol);

				const previousListeners = listenerMap[consumerSymbol] || [];
				const currentListeners = removeHandler(previousListeners);

				listenerMap[consumerSymbol] = currentListeners;

				if (previousListeners.length > 0 && currentListeners.length === 0) {
					delete listenerMap[consumerSymbol];

					let stopConsumer = true;
					let stopProducer = true;

					let consumerSymbols = __producerSymbols[producerSymbol] || [];

					if (!getConsumerIsActive(consumerSymbol, additionalListenerMaps)) {
						stopConsumer = true;
					}

					if (stopConsumer) {
						consumerSymbols = consumerSymbols.filter((candidate) => {
							const returnVal = candidate !== consumerSymbol;

							if (!returnVal && getConsumerIsActive(candidate, [listenerMap])) {
								stopProducer = false;
							}

							return returnVal;
						});

						__producerSymbols[producerSymbol] = consumerSymbols;
					}

					if (stopProducer) {
						delete trackingMap[producerSymbol];

						additionalTrackingMaps.forEach((map) => {
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

			const addHandler = (listeners) => {
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

			const subscribe = (trackingMap, taskName, listenerMap, additionalTrackingMaps) => {
				const consumerSymbol = symbol;
				const producerSymbol = utilities.symbolParser.getProducerSymbol(consumerSymbol);

				listenerMap[consumerSymbol] = addHandler(listenerMap[consumerSymbol]);

				let consumerSymbols = __producerSymbols[producerSymbol] || [];

				let startConsumer = !consumerSymbols.some((candidate) => {
					return candidate === consumerSymbol;
				});

				if (startConsumer) {
					consumerSymbols = consumerSymbols.slice(0);
					consumerSymbols.push(consumerSymbol);

					__producerSymbols[producerSymbol] = consumerSymbols;
				}

				if (!trackingMap[producerSymbol]) {
					trackingMap[producerSymbol] = true;

					let startProducer = !additionalTrackingMaps.some((additionalTrackingMap) => {
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
						handler({type: 'INIT', symbol: symbol});
					}

					break;
				case 'marketUpdate':
					if (arguments.length < 3) {
						throw new Error("Invalid arguments. Invoke as follows: on('marketUpdate', handler, symbol)");
					}

					subscribe(__marketUpdateSymbols, "MU_GO", __listeners.marketUpdate, [__cumulativeVolumeSymbols]);

					if (__marketState.getQuote(symbol)) {
						handler({type: 'INIT', symbol: symbol});
					}

					break;
				case 'cumulativeVolume':
					if (arguments.length < 3) {
						throw new Error("Invalid arguments. Invoke as follows: on('cumulativeVolume', handler, symbol)");
					}

					subscribe(__cumulativeVolumeSymbols, "MU_GO", __listeners.cumulativeVolume, [__marketUpdateSymbols]);

					__marketState.getCumulativeVolume(symbol, (container) => {
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
			let message;

			try {
				message = parseMessage(raw);

				if (message.type) {
					if (message.symbol) {
						let consumerSymbols = __producerSymbols[message.symbol] || [ ];

						if (__profileLookupSymbols.hasOwnProperty(message.symbol)) {
							consumerSymbols = consumerSymbols.concat(__profileLookupSymbols[message.symbol]).filter((item, index, array) => array.indexOf(item) === index);

							delete __profileLookupSymbols[message.symbol];
						}

						consumerSymbols.forEach((consumerSymbol) => {
							let messageToProcess;

							if (consumerSymbol === message.symbol) {
								messageToProcess = message;
							} else {
								messageToProcess = Object.assign({ }, message);
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
				let command = __commands.shift();

				while (command) {
					console.log(command);

					__connection.send(command);
					command = __commands.shift();
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

						const unique = task.symbols.filter((item, index, array) => array.indexOf(item) === index);

						let batchSize;

						if (task.id === 'MD_GO' || task.id === 'MD_STOP') {
							batchSize = 1;
						} else {
							batchSize = 250;
						}

						while (unique.length > 0) {
							const batch = unique.splice(0, batchSize);

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
					const partitions = [ ];

					while (symbols.length !== 0) {
						partitions.push(symbols.splice(0, 250));
					}

					return partitions;
				};

				const quoteBatches = getBatches(getUniqueSymbols([ __marketUpdateSymbols, __cumulativeVolumeSymbols ]));

				quoteBatches.forEach((batch) => {
					__commands.push('GO' + ' ' + batch.join(',') + '=' + 'sc');
				});

				const bookBatches = getBatches(object.keys(__marketDepthSymbols));

				quoteBatches.forEach((batch) => {
					__commands.push('GO' + ' ' + batch.join(',') + '=' + 'b');
				});

				const profileBatches = getBatches(object.keys(__profileLookupSymbols)).filter(s => !quoteBatches.some(q => q === s));

				profileBatches.forEach((batch) => {
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
			return object.keys(maps.reduce((aggregator, map) => {
				for (let k in map) {
					if (map[k] === true) {
						aggregator[k] = true;
					}
				}

				return aggregator;
			}, { }));
		}

		function getActiveSymbolCount() {
			return getUniqueSymbols([ __marketUpdateSymbols, __marketDepthSymbols, __cumulativeVolumeSymbols ]).length;
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

		function handleProfileRequest(symbol) {
			const producerSymbol = utilities.symbolParser.getProducerSymbol(symbol);

			__profileLookupSymbols[producerSymbol] = [ symbol, producerSymbol ];

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