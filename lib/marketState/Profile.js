var utilities = require('barchart-marketdata-utilities');

var parseSymbolType = require('./../util/parseSymbolType');

module.exports = function() {
	'use strict';

	var priceFormatter = utilities.priceFormatter;

	var Profile = function(symbol, name, exchange, unitCode, pointValue, tickIncrement) {
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

		Profile.prototype.Profiles[symbol] = this;
	};

	Profile.prototype.Profiles = { };

	Profile.prototype.PriceFormatter = function(fractionSeparator, specialFractions) {
		var format = priceFormatter(fractionSeparator, specialFractions).format;

		Profile.prototype.formatPrice = function(price) {
			return format(price, this.unitCode);
		};
	};

	Profile.prototype.PriceFormatter('-', true);

	return Profile;
}();