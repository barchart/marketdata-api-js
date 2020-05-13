const object = require('@barchart/common-js/lang//object');

const LoggerFactory = require('./../logging/LoggerFactory');

module.exports = (() => {
	'use strict';

	let __logger = null;

	const events = {
		update: 'update',
		reset: 'reset'
	};

	/**
	 * An aggregation of the total volume traded at each price level for a
	 * single instrument, mutates as **CumulativeVolume** subscription updates
	 * are processed (see {@link Enums.SubscriptionType}).
	 *
	 * @public
	 * @exported
	 */
	class CumulativeVolume {
		constructor(symbol, tickIncrement) {
			/**
			 * @property {string} symbol - Symbol of the cumulative volume.
			 * @public
			 * @readonly
			 */
			this.symbol = symbol;

			this._tickIncrement = tickIncrement;

			this._handlers = [];

			this._priceLevels = {};
			this._highPrice = null;
			this._lowPrice = null;

			if (__logger === null) {
				__logger = LoggerFactory.getLogger('@barchart/marketdata-api-js');
			}
		}

		/**
		 * Registers an event handler for a given event. The following events are
		 * supported:
		 *
		 * update -- when a new price level is added, or an existing price level mutates.
		 * reset -- when all price levels are cleared.
		 *
		 * @ignore
		 * @param {string} eventType
		 * @param {function} handler - callback notified each time the event occurs
		 */
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

		/**
		 * Unregisters an event handler for a given event. See {@link CumulativeVolume#on}.
		 *
		 * @ignore
		 * @param {string} eventType - the event which was passed to {@link CumulativeVolume#on}
		 * @param {function} handler - the callback which was passed to {@link CumulativeVolume#on}
		 */
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

		/**
		 * @ignore
		 */
		getTickIncrement() {
			return this._tickIncrement;
		}

		/**
		 * Given a numeric price, returns the volume traded at that price level.
		 *
		 * @public
		 * @param {number} price
		 * @returns {number}
		 */
		getVolume(price) {
			const priceString = price.toString();
			const priceLevel = this._priceLevels[priceString];

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
		incrementVolume(price, volume) {
			if (this._highPrice && this._lowPrice) {
				if (price > this._highPrice) {
					for (let p = this._highPrice + this._tickIncrement; p < price; p += this._tickIncrement) {
						broadcastPriceVolumeUpdate(this, this._handlers, addPriceVolume(this._priceLevels, p.toString(), p));
					}

					this._highPrice = price;
				} else if (price < this._lowPrice) {
					for (let p = this._lowPrice - this._tickIncrement; p > price; p -= this._tickIncrement) {
						broadcastPriceVolumeUpdate(this, this._handlers, addPriceVolume(this._priceLevels, p.toString(), p));
					}

					this._lowPrice = price;
				}
			} else {
				this._lowPrice = this._highPrice = price;
			}

			let priceString = price.toString();
			let priceLevel = this._priceLevels[priceString];

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
		reset() {
			this._priceLevels = {};
			this._highPrice = null;
			this._lowPrice = null;

			this._handlers.forEach((handler) => {
				handler({ container: this, event: events.reset });
			});
		}

		/**
		 * Returns an array of all price levels. This is an expensive operation. Observing
		 * an ongoing subscription is preferred (see {@link Connection#on}).
		 *
		 * @returns {Schema.VolumeLevel[]}
		 */
		toArray() {
			const array = object.keys(this._priceLevels).map((p) => {
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
		 * @returns {CumulativeVolume}
		 */
		static clone(symbol, source) {
			const clone = new CumulativeVolume(symbol, source.getTickIncrement());

			source.toArray().forEach((priceLevel) => {
				clone.incrementVolume(priceLevel.price, priceLevel.volume);
			});

			return clone;
		}

		toString() {
			return `[CumulativeVolume (symbol=${this.symbol})]`;
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
		} catch (e) {
			__logger.error('An error was thrown by a cumulative volume observer.', e);
		}
	};

	const broadcastPriceVolumeUpdate = (container, handlers, priceLevel) => {
		handlers.forEach((handler) => {
			sendPriceVolumeUpdate(container, handler, priceLevel);
		});
	};

	const addPriceVolume = (priceLevels, priceString, price) => {
		const priceLevel = {
			price: price,
			volume: 0
		};

		priceLevels[priceString] = priceLevel;

		return priceLevel;
	};

	return CumulativeVolume;
})();