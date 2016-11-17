module.exports = function() {
	'use strict';

	var EVENT_TYPE_UPDATE = 'update';
	var EVENT_TYPE_RESET = 'reset';

	return function(symbol, tickIncrement) {
		this.symbol = symbol;

		var handlers = [ ];

		var priceLevels = { };
		var highPrice = null;
		var lowPrice = null;

		var x = 1;

		var onPriceVolumeUpdated = function(priceLevel) {
			for (var i = 0; i < handlers.length; i++) {
				var handler = handlers[i];

				handler({ container: this, event: EVENT_TYPE_UPDATE, price: priceLevel.price, volume: priceLevel.volume });
			}
		};

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
						onPriceVolumeUpdated.call(this, addPriceVolume(p.toString(), p));
					}

					highPrice = priceValue;
				} else if (priceValue < lowPrice) {
					for (var p = lowPrice - tickIncrement; p > priceValue; p -= tickIncrement) {
						onPriceVolumeUpdated.call(this, addPriceVolume(p.toString(), p));
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

			onPriceVolumeUpdated.call(this, priceLevel);
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
}();