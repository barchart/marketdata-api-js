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

var CumulativeVolume = require('../../../lib/marketState/CumulativeVolume');

describe('When a cumulative volume container is created with a tick increment of 0.25', function () {
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

},{"../../../lib/marketState/CumulativeVolume":2}]},{},[3]);
