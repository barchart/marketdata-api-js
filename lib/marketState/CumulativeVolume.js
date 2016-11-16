module.exports = function() {
	'use strict';

	var EVENT_TYPE_UPDATE = 'cumulativeVolumeUpdate';
	var EVENT_TYPE_RESET = 'cumulativeVolumeReset';

	return function(symbol, tickIncrement) {
		this.symbol = symbol;

		var handlers = [ ];

		var priceLevels = { };
		var highPrice = null;
		var lowPrice = null;

		var onPriceVolumeUpdated = function(priceLevel) {
			for (var i = 0; i < handlers.length; i++) {
				var handler = handlers[i];

				handler(this, EVENT_TYPE_UPDATE, { price: priceLevel.price, volume: priceLevel.volume });
			}
		};

		var addPriceVolume = function(priceString, priceValue) {
			return priceLevels[priceString] = {
				price: priceValue,
				volume: 0
			};
		};

		var addPriceVolumes = function(minimumPrice, maximumPrice) {
			for (var next = minimumPrice + tickIncrement; next < maximumPrice; next += tickIncrement) {
				onPriceVolumeUpdated(addPriceVolume(next.toString(), next));
			}
		};

		this.on = function(handler) {
			var i = handlers.indexOf(handler);

			if (i < 0) {
				var copy = handlers.slice(0);

				copy.push(handler);

				handlers = copy;
			}
		};

		this.off = function(handler) {
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
			var priceString = priceValue.toString();
			var priceLevel = priceLevels[priceString];

			if (!priceLevel) {
				priceLevel = addPriceVolume(priceString, priceValue);

				if (highPrice && lowPrice) {
					if (priceValue > highPrice) {
						addPriceVolumes(highPrice, priceValue);

						highPrice = priceValue;
					}

					if (priceValue < lowPrice) {
						addPriceVolumes(priceValue, lowPrice);

						lowPrice = priceValue;
					}
				} else {
					lowPrice = highPrice = priceValue;
				}
			}

			priceLevel.volume += volume;

			onPriceVolumeUpdated(priceLevel);
		};

		this.reset = function() {
			priceLevels = { };
			highPrice = null;
			lowPrice = null;

			for (var i = 0; i < handlers.length; i++) {
				var handler = handlers[i];

				handler(this, EVENT_TYPE_RESET, null);
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