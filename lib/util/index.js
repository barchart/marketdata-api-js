var utilities = require('barchart-marketdata-utilities');

var convertBaseCodeToUnitCode = require('./convertBaseCodeToUnitCode');
var convertDateToDayCode = require('./convertDateToDayCode');
var convertDayCodeToNumber = require('./convertDayCodeToNumber');
var convertUnitCodeToBaseCode = require('./convertUnitCodeToBaseCode');
var monthCodes = require('./monthCodes');
var parseSymbolType = require('./parseSymbolType');

module.exports = function() {
	'use strict';

	return {
		convertBaseCodeToUnitCode: convertBaseCodeToUnitCode,
		convertUnitCodeToBaseCode: convertUnitCodeToBaseCode,
		convertDateToDayCode: convertDateToDayCode,
		convertDayCodeToNumber: convertDayCodeToNumber,
		monthCodes: monthCodes,
		parseSymbolType: parseSymbolType,

		BaseCode2UnitCode: convertBaseCodeToUnitCode,
		DateToDayCode: convertDateToDayCode,
		DayCodeToNumber: convertDayCodeToNumber,
		MonthCodes: monthCodes,
		ParseSymbolType: parseSymbolType,
		PriceFormatter: utilities.priceFormatter,
		TimeFormatter: utilities.timeFormatter,
		UnitCode2BaseCode: convertUnitCodeToBaseCode
	};
}();