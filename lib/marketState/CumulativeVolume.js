module.exports = (() => {
	'use strict';

	const events = {
		update: 'update',
		reset: 'reset'
	};

	class CumulativeVolume {
		constructor(symbol, tickIncrement) {
			this.symbol = symbol;
			this._tickIncrement = tickIncrement;

		 	this._handlers = [ ];

			this._priceLevels = {};
			this._highPrice = null;
			this._lowPrice = null;
		}

		on(eventType, handler) {
			if (eventType !== 'events') {
				return;
			}

			const i = this._handlers.indexOf(handler);

			if (i < 0) {
				const copy = this._handlers.slice(0);
				copy.push(handler);

				this._handlers = copy;

				this.toArray().forEach((priceLevel) => {
					sendPriceVolumeUpdate(this, handler, priceLevel);
				});
			}
		}

		off(eventType, handler) {
			if (eventType !== 'events') {
				return;
			}

			const i = this._handlers.indexOf(handler);

			if (!(i < 0)) {
				const copy = this._handlers.slice(0);
				copy.splice(i, 1);

				this._handlers = copy;
			}
		}

		getTickIncrement() {
			return this._tickIncrement;
		}

		getVolume(price) {
			const priceString = price.toString();
			const priceLevel = this._priceLevels[priceString];

			if (priceLevel) {
				return priceLevel.volume;
			} else {
				return 0;
			}
		}

		incrementVolume(priceValue, volume) {
			if (this._highPrice && this._lowPrice) {
				if (priceValue > this._highPrice) {
					for (let p = this._highPrice + this._tickIncrement; p < priceValue; p += this._tickIncrement) {
						broadcastPriceVolumeUpdate(this, this._handlers, addPriceVolume(this._priceLevels, p.toString(), p));
					}

					this._highPrice = priceValue;
				} else if (priceValue < this._lowPrice) {
					for (let p = this._lowPrice - this._tickIncrement; p > priceValue; p -= this._tickIncrement) {
						broadcastPriceVolumeUpdate(this, this._handlers, addPriceVolume(this._priceLevels, p.toString(), p));
					}

					this._lowPrice = priceValue;
				}
			} else {
				this._lowPrice = this._highPrice = priceValue;
			}

			let priceString = priceValue.toString();
			let priceLevel = this._priceLevels[priceString];

			if (!priceLevel) {
				priceLevel = addPriceVolume(this._priceLevels, priceString, priceValue);
			}

			priceLevel.volume += volume;

			broadcastPriceVolumeUpdate(this, this._handlers, priceLevel);
		}

		reset() {
			this._priceLevels = { };
			this._highPrice = null;
			this._lowPrice = null;

			this._handlers.forEach((handler) => {
				handler({ container: this, event: events.reset });
			});
		}

		toArray() {
			const array = Object.keys(this._priceLevels).map((p) => {
				const priceLevel = this._priceLevels[p];

				return {
					price: priceLevel.price,
					volume: priceLevel.volume
				};
			});

			array.sort((a, b) => {
				return a.price - b.price;
			});

			return array;
		}

		dispose() {
			this._priceLevels = { };
			this._highPrice = null;
			this._lowPrice = null;

			this._handlers = [ ];
		}

		static clone(symbol, source) {
			const clone = new CumulativeVolume(symbol, source.getTickIncrement());

			source.toArray().forEach((priceLevel) => {
				clone.incrementVolume(priceLevel.price, priceLevel.volume);
			});

			return clone;
		}
	}

	const sendPriceVolumeUpdate = (container, handler, priceLevel) => {
		try {
			handler({
				container: container,
				event: events.update,
				price: priceLevel.price,
				volume: priceLevel.volume
			});
		} catch(e) {
			console.error('An error was thrown by a cumulative volume observer.', e);
		}
	};

	const broadcastPriceVolumeUpdate = (container, handlers, priceLevel) => {
		handlers.forEach((handler) => {
			sendPriceVolumeUpdate(container, handler, priceLevel);
		});
	};

	const addPriceVolume = (priceLevels, priceString, priceValue) => {
		const priceLevel = {
			price: priceValue,
			volume: 0
		};

		priceLevels[priceString] = priceLevel;

		return priceLevel;
	};

	return CumulativeVolume;
})();