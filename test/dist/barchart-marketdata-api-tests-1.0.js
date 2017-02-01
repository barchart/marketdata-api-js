(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function() {
	'use strict';

	var EVENT_TYPE_UPDATE = 'update';
	var EVENT_TYPE_RESET = 'reset';

	var CumulativeVolume = function(symbol, tickIncrement) {
		this.symbol = symbol;

		var handlers = [ ];

		var priceLevels = { };
		var highPrice = null;
		var lowPrice = null;

		var addPriceVolume = function(priceString, priceValue) {
			return priceLevels[priceString] = {
				price: priceValue,
				volume: 0
			};
		};

		this.on = function(eventType, handler) {
			if (eventType !== 'events') {
				return;
			}

			var i = handlers.indexOf(handler);

			if (i < 0) {
				var copy = handlers.slice(0);

				copy.push(handler);

				handlers = copy;
				
				var priceLevels = this.toArray();
				
				for (var j = 0; j < priceLevels; j++) {
					sendPriceVolumeUpdate(this, handler, priceLevels[j]);
				}
			}
		};

		this.off = function(eventType, handler) {
			if (eventType !== 'events') {
				return;
			}

			var i = handlers.indexOf(handler);

			if (!(i < 0)) {
				var copy = handlers.slice(0);

				copy.splice(i, 1);

				handlers = copy;
			}
		};

		this.getTickIncrement = function() {
			return tickIncrement;
		};

		this.getVolume = function(price) {
			var priceString = price.toString();
			var priceLevel = priceLevels[priceString];

			if (priceLevel) {
				return priceLevel.volume;
			} else {
				return 0;
			}
		};

		this.incrementVolume = function(priceValue, volume) {
			if (highPrice && lowPrice) {
				if (priceValue > highPrice) {
					for (var p = highPrice + tickIncrement; p < priceValue; p += tickIncrement) {
						broadcastPriceVolumeUpdate(this, handlers, addPriceVolume(p.toString(), p));
					}

					highPrice = priceValue;
				} else if (priceValue < lowPrice) {
					for (var p = lowPrice - tickIncrement; p > priceValue; p -= tickIncrement) {
						broadcastPriceVolumeUpdate(this, handlers, addPriceVolume(p.toString(), p));
					}

					lowPrice = priceValue;
				}
			} else {
				lowPrice = highPrice = priceValue;
			}

			var priceString = priceValue.toString();
			var priceLevel = priceLevels[priceString];

			if (!priceLevel) {
				priceLevel = addPriceVolume(priceString, priceValue);
			}

			priceLevel.volume += volume;

			broadcastPriceVolumeUpdate(this, handlers, priceLevel);
		};

		this.reset = function() {
			priceLevels = { };
			highPrice = null;
			lowPrice = null;

			for (var i = 0; i < handlers.length; i++) {
				var handler = handlers[i];

				handler({ container: this, event: EVENT_TYPE_RESET });
			}
		};

		this.toArray = function() {
			var array = [ ];

			for (var p in priceLevels) {
				var priceLevel = priceLevels[p];

				array.push({
					price: priceLevel.price,
					volume: priceLevel.volume
				});
			}

			array.sort(function(a, b) {
				return a.price - b.price;
			});

			return array;
		};

		this.dispose = function() {
			priceLevels = { };
			highPrice = null;
			lowPrice = null;

			handlers = [ ];
		};
	};

	var sendPriceVolumeUpdate = function(container, handler, priceLevel) {
		try {
			handler({
				container: container,
				event: EVENT_TYPE_UPDATE,
				price: priceLevel.price,
				volume: priceLevel.volume
			});
		} catch(e) {
			console.error('An error was thrown by a cumulative volume observer.', e);
		}
	};

	var broadcastPriceVolumeUpdate = function(container, handlers, priceLevel) {
		for (var i = 0; i < handlers.length; i++) {
			sendPriceVolumeUpdate(container, handlers[i], priceLevel);
		}
	};

	CumulativeVolume.clone = function(symbol, source) {
		var clone = new CumulativeVolume(symbol, source.getTickIncrement());

		var data = source.toArray();

		for (var i = 0; i < data.length; i++) {
			var priceLevel = data[i];

			clone.incrementVolume(priceLevel.price, priceLevel.volume);
		}

		return clone;
	};

	return CumulativeVolume;
}();
},{}],2:[function(require,module,exports){
var CumulativeVolume = require('../../../lib/marketState/CumulativeVolume');

describe('When a cumulative volume container is created with a tick increment of 0.25', function() {
	var cv;

	var symbol;
	var tickIncrement;

	beforeEach(function() {
		cv = new CumulativeVolume(symbol = 'ESZ6', tickIncrement = 0.25);
	});

	it('the symbol should be the same value as assigned during construction', function() {
		expect(cv.symbol).toEqual(symbol);
	});

	it('the price level array should contain zero items', function() {
		expect(cv.toArray().length).toEqual(0);
	});

	describe('and 50 contracts are traded at 2172.50', function() {
		beforeEach(function() {
			cv.incrementVolume(2172.5, 50);
		});

		it('should report zero contracts traded at 2172.25', function() {
			expect(cv.getVolume(2172.25)).toEqual(0);
		});

		it('should report 50 contracts traded at 2172.50', function() {
			expect(cv.getVolume(2172.5)).toEqual(50);
		});

		it('should report zero contracts traded at 2172.75', function() {
			expect(cv.getVolume(2172.75)).toEqual(0);
		});

		describe('and the price level array is retrieved', function() {
			var priceLevels;

			beforeEach(function() {
				priceLevels = cv.toArray();
			});

			it('the price level array should contain one item', function() {
				expect(priceLevels.length).toEqual(1);
			});

			it('the first price level item should be for 50 contracts', function() {
				expect(priceLevels[0].volume).toEqual(50);
			});

			it('the first price level item should be priced at 2172.50', function() {
				expect(priceLevels[0].price).toEqual(2172.5);
			});
		});

		describe('and another 50 contracts are traded at 2172.50', function() {
			beforeEach(function() {
				cv.incrementVolume(2172.5, 50);
			});

			it('should report zero contracts traded at 2172.25', function() {
				expect(cv.getVolume(2172.25)).toEqual(0);
			});

			it('should report 50 contracts traded at 2172.50', function() {
				expect(cv.getVolume(2172.5)).toEqual(100);
			});

			it('should report zero contracts traded at 2172.75', function() {
				expect(cv.getVolume(2172.75)).toEqual(0);
			});

			describe('and the price level array is retrieved', function() {
				var priceLevels;

				beforeEach(function() {
					priceLevels = cv.toArray();
				});

				it('the price level array should contain one item', function() {
					expect(priceLevels.length).toEqual(1);
				});

				it('the first price level item should be for 100 contracts', function() {
					expect(priceLevels[0].volume).toEqual(100);
				});

				it('the first price level item should be priced at 2172.50', function() {
					expect(priceLevels[0].price).toEqual(2172.5);
				});
			});
		});

		describe('and 200 contracts are traded at 2172.25', function() {
			beforeEach(function() {
				cv.incrementVolume(2172.25, 200);
			});

			it('should report 200 contracts traded at 2172.25', function() {
				expect(cv.getVolume(2172.25)).toEqual(200);
			});

			it('should report 50 contracts traded at 2172.50', function() {
				expect(cv.getVolume(2172.5)).toEqual(50);
			});

			it('should report zero contracts traded at 2172.75', function() {
				expect(cv.getVolume(2172.75)).toEqual(0);
			});

			describe('and the price level array is retrieved', function() {
				var priceLevels;

				beforeEach(function() {
					priceLevels = cv.toArray();
				});

				it('the price level array should contain two items', function() {
					expect(priceLevels.length).toEqual(2);
				});

				it('the first price level item should be for 200 contracts', function() {
					expect(priceLevels[0].volume).toEqual(200);
				});

				it('the first price level item should be priced at 2172.25', function() {
					expect(priceLevels[0].price).toEqual(2172.25);
				});

				it('the second price level item should be for 50 contracts', function() {
					expect(priceLevels[1].volume).toEqual(50);
				});

				it('the second price level item should be priced at 2172.50', function() {
					expect(priceLevels[1].price).toEqual(2172.5);
				});
			});
		});

		describe('and 3 contracts are traded at 2173.50', function() {
			beforeEach(function() {
				cv.incrementVolume(2173.50, 3);
			});

			it('should report 50 contracts traded at 2172.50', function() {
				expect(cv.getVolume(2172.5)).toEqual(50);
			});

			it('should report zero contracts traded at 2172.75', function() {
				expect(cv.getVolume(2172.75)).toEqual(0);
			});

			it('should report zero contracts traded at 2173', function() {
				expect(cv.getVolume(2173)).toEqual(0);
			});

			it('should report zero contracts traded at 2173.25', function() {
				expect(cv.getVolume(2173.25)).toEqual(0);
			});

			it('should report 3 contracts traded at 2173.50', function() {
				expect(cv.getVolume(2173.50)).toEqual(3);
			});

			describe('and the price level array is retrieved', function() {
				var priceLevels;

				beforeEach(function() {
					priceLevels = cv.toArray();
				});

				it('the price level array should contain five items', function() {
					expect(priceLevels.length).toEqual(5);
				});

				it('the first price level item should be for 50 contracts', function() {
					expect(priceLevels[0].volume).toEqual(50);
				});

				it('the first price level item should be priced at 2172.50', function() {
					expect(priceLevels[0].price).toEqual(2172.5);
				});

				it('the second price level item should be for zero contracts', function() {
					expect(priceLevels[1].volume).toEqual(0);
				});

				it('the second price level item should be priced at 2172.75', function() {
					expect(priceLevels[1].price).toEqual(2172.75);
				});

				it('the third price level item should be for zero contracts', function() {
					expect(priceLevels[2].volume).toEqual(0);
				});

				it('the third price level item should be priced at 2173.00', function() {
					expect(priceLevels[2].price).toEqual(2173);
				});

				it('the fourth price level item should be for zero contracts', function() {
					expect(priceLevels[3].volume).toEqual(0);
				});

				it('the fourth price level item should be priced at 2173.25', function() {
					expect(priceLevels[3].price).toEqual(2173.25);
				});

				it('the fifth price level item should be for 3 contracts', function() {
					expect(priceLevels[4].volume).toEqual(3);
				});

				it('the fifth price level item should be priced at 2173.50', function() {
					expect(priceLevels[4].price).toEqual(2173.5);
				});
			});
		});

		describe('and 99 contracts are traded at 2172.00', function() {
			beforeEach(function() {
				cv.incrementVolume(2172.00, 99);
			});

			it('should report 99 contracts traded at 2172.00', function() {
				expect(cv.getVolume(2172.00)).toEqual(99);
			});

			it('should report zero contracts traded at 2172.25', function() {
				expect(cv.getVolume(2172.25)).toEqual(0);
			});

			it('should report 50 contracts traded at 2172.50', function() {
				expect(cv.getVolume(2172.50)).toEqual(50);
			});

			describe('and the price level array is retrieved', function() {
				var priceLevels;

				beforeEach(function() {
					priceLevels = cv.toArray();
				});

				it('the price level array should contain three items', function() {
					expect(priceLevels.length).toEqual(3);
				});

				it('the first price level item should be for 99 contracts', function() {
					expect(priceLevels[0].volume).toEqual(99);
				});

				it('the first price level item should be priced at 2172.00', function() {
					expect(priceLevels[0].price).toEqual(2172);
				});

				it('the second price level item should be for zero contracts', function() {
					expect(priceLevels[1].volume).toEqual(0);
				});

				it('the second price level item should be priced at 2172.25', function() {
					expect(priceLevels[1].price).toEqual(2172.25);
				});

				it('the third price level item should be for 50 contracts', function() {
					expect(priceLevels[2].volume).toEqual(50);
				});

				it('the third price level item should be priced at 2172.50', function() {
					expect(priceLevels[2].price).toEqual(2172.50);
				});
			});
		});

		describe('and the container is reset', function() {
			beforeEach(function() {
				cv.reset();
			});

			describe('and the price level array is retrieved', function() {
				var priceLevels;

				beforeEach(function() {
					priceLevels = cv.toArray();
				});

				it('the price level array should contain zero items', function() {
					expect(priceLevels.length).toEqual(0);
				});
			});
		});
	});

	describe('and an observer is added to the container', function() {
		var spyOne;

		beforeEach(function() {
			cv.on('events', spyOne = jasmine.createSpy('spyOne'));
		});

		describe('and 50 contracts are traded at 2172.50', function() {
			beforeEach(function () {
				cv.incrementVolume(2172.5, 50);
			});

			it('the observer should be called once', function() {
				expect(spyOne).toHaveBeenCalledTimes(1);
			});

			it('the arguments should refer to the container', function() {
				expect(spyOne.calls.mostRecent().args[0].container).toBe(cv);
			});

			it('the arguments should specify an event type of "update"', function() {
				expect(spyOne.calls.mostRecent().args[0].event).toEqual('update');
			});

			it('the arguments should specify a price of 2172.5', function() {
				expect(spyOne.calls.mostRecent().args[0].price).toEqual(2172.5);
			});

			it('the arguments should specify a volume of 50', function() {
				expect(spyOne.calls.mostRecent().args[0].volume).toEqual(50);
			});

			describe('and another 50 contracts are traded at 2172.50', function() {
				beforeEach(function () {
					cv.incrementVolume(2172.5, 50);
				});

				it('the observer should be called once more', function() {
					expect(spyOne).toHaveBeenCalledTimes(2);
				});

				it('the arguments should refer to the container', function() {
					expect(spyOne.calls.mostRecent().args[0].container).toBe(cv);
				});

				it('the arguments should specify an event type of "update"', function() {
					expect(spyOne.calls.mostRecent().args[0].event).toEqual('update');
				});

				it('the arguments should specify a price of 2172.5', function() {
					expect(spyOne.calls.mostRecent().args[0].price).toEqual(2172.5);
				});

				it('the arguments should specify a volume of 100', function() {
					expect(spyOne.calls.mostRecent().args[0].volume).toEqual(100);
				});
			});

			describe('and 99 contracts are traded at 2171.75', function() {
				var spyTwo;

				beforeEach(function () {
					cv.incrementVolume(2171.75, 99);
				});

				it('the observer should be called three more times', function() {
					expect(spyOne).toHaveBeenCalledTimes(4);
				});

				it('the arguments (for the first call) should specify a price of 2172.25', function() {
					expect(spyOne.calls.argsFor(1)[0].price).toEqual(2172.25);
				});

				it('the arguments (for the first call) should specify a volume of zero', function() {
					expect(spyOne.calls.argsFor(1)[0].volume).toEqual(0);
				});

				it('the arguments (for the second call) should specify a price of 2172.00', function() {
					expect(spyOne.calls.argsFor(2)[0].price).toEqual(2172);
				});

				it('the arguments (for the second call) should specify a volume of zero', function() {
					expect(spyOne.calls.argsFor(2)[0].volume).toEqual(0);
				});

				it('the arguments (for the third call) should specify a price of 2171.75', function() {
					expect(spyOne.calls.argsFor(3)[0].price).toEqual(2171.75);
				});

				it('the arguments (for the third call) should specify a volume of 99', function() {
					expect(spyOne.calls.argsFor(3)[0].volume).toEqual(99);
				});
			});

			describe('and 555 contracts are traded at 2173.25', function() {
				beforeEach(function () {
					cv.incrementVolume(2173.25, 555);
				});

				it('the observer should be called three more times', function() {
					expect(spyOne).toHaveBeenCalledTimes(4);
				});

				it('the arguments (for the first call) should specify a price of 2172.75', function() {
					expect(spyOne.calls.argsFor(1)[0].price).toEqual(2172.75);
				});

				it('the arguments (for the first call) should specify a volume of zero', function() {
					expect(spyOne.calls.argsFor(1)[0].volume).toEqual(0);
				});

				it('the arguments (for the second call) should specify a price of 2173.00', function() {
					expect(spyOne.calls.argsFor(2)[0].price).toEqual(2173);
				});

				it('the arguments (for the second call) should specify a volume of zero', function() {
					expect(spyOne.calls.argsFor(2)[0].volume).toEqual(0);
				});

				it('the arguments (for the third call) should specify a price of 2173.25', function() {
					expect(spyOne.calls.argsFor(3)[0].price).toEqual(2173.25);
				});

				it('the arguments (for the third call) should specify a volume of 555', function() {
					expect(spyOne.calls.argsFor(3)[0].volume).toEqual(555);
				});
			});

			describe('and the observer is removed from the container', function() {
				beforeEach(function () {
					cv.off('events', spyOne);
				});

				describe('and another 50 contracts are traded at 2172.50', function() {
					beforeEach(function () {
						cv.incrementVolume(2172.5, 50);
					});

					it('the observer should be called once', function() {
						expect(spyOne).toHaveBeenCalledTimes(1);
					});
				});
			});
		});
	});
});
},{"../../../lib/marketState/CumulativeVolume":1}]},{},[2]);
