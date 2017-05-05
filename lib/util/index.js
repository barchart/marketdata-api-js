const convertBaseCodeToUnitCode = require('./convertBaseCodeToUnitCode'),
	convertDateToDayCode = require('./convertDateToDayCode'),
	convertDayCodeToNumber = require('./convertDayCodeToNumber'),
	convertUnitCodeToBaseCode = require('./convertUnitCodeToBaseCode'),
	monthCodes = require('./monthCodes'),
	parseSymbolType = require('./parseSymbolType'),
	priceFormatter = require('./priceFormatter'),
	timeFormatter = require('./timeFormatter');

module.exports = (() => {
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
		PriceFormatter: priceFormatter,
		TimeFormatter: timeFormatter,
		UnitCode2BaseCode: convertUnitCodeToBaseCode
	};
})();