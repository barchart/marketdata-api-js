var convertBaseCodeToUnitCode = require('./convertBaseCodeToUnitCode');
var convertConsumerSymbolToProducerSymbol = require('./convertConsumerSymbolToProducerSymbol');
var convertDateToDayCode = require('./convertDateToDayCode');
var convertDayCodeToNumber = require('./convertDayCodeToNumber');
var convertUnitCodeToBaseCode = require('./convertUnitCodeToBaseCode');
var monthCodes = require('./monthCodes');
var parseSymbolType = require('./parseSymbolType');
var priceFormatter = require('./priceFormatter');
var timeFormatter = require('./timeFormatter');

module.exports = function() {
	'use strict';

	return {
		convertBaseCodeToUnitCode: convertBaseCodeToUnitCode,
		convertUnitCodeToBaseCode: convertUnitCodeToBaseCode,
		convertConsumerSymbolToProducerSymbol: convertConsumerSymbolToProducerSymbol,
		convertDateToDayCode: convertDateToDayCode,
		convertDayCodeToNumber: convertDayCodeToNumber,
		monthCodes: monthCodes,
		parseSymbolType: parseSymbolType,

		BaseCode2UnitCode: convertBaseCodeToUnitCode,
		DateToDayCode: convertDateToDayCode,
		DayCodeToNumber: convertDayCodeToNumber,
		MonthCodes: monthCodes,
		ParseSymbolType: parseSymbolType,
		PriceFormatter: priceFormatter,
		TimeFormatter: timeFormatter,
		UnitCode2BaseCode: convertUnitCodeToBaseCode
	};
}();