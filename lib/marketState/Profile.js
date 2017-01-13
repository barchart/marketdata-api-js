var parseSymbolType = require('./../util/parseSymbolType');
var priceFormatter = require('./../util/priceFormatter');

module.exports = (() => {
	'use strict';

	let profiles = { };
	let formatter = priceFormatter('-', true, ',').format;

	class Profile {
		constructor(symbol, name, exchange, unitCode, pointValue, tickIncrement) {
			this.symbol = symbol;
			this.name = name;
			this.exchange = exchange;
			this.unitCode = unitCode;
			this.pointValue = pointValue;
			this.tickIncrement = tickIncrement;

			var info = parseSymbolType(this.symbol);

			if (info) {
				if (info.type === 'future') {
					this.root = info.root;
					this.month = info.month;
					this.year = info.year;
				}
			}

			profiles[symbol] = this;
		}

		formatPrice(price) {
			return formatter(price);
		}

		static setPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator) {
			formatter = priceFormatter(fractionSeparator, specialFractions, thousandsSeparator).format;
		}

		static PriceFormatter(fractionSeparator, specialFractions, thousandsSeparator) {
			Profile.setPriceFormatter(fractionSeparator, specialFractions, thousandsSeparator);
		}

		static get Profiles() {
			return profiles;
		}

		static set Profiles(p) {
			profiles = p;
		}
	}

	return Profile;
})();