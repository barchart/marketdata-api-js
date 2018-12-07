const convertBaseCodeToUnitCode = require('./convertBaseCodeToUnitCode'),
	convertDateToDayCode = require('./convertDateToDayCode'),
	convertDayCodeToNumber = require('./convertDayCodeToNumber'),
	convertUnitCodeToBaseCode = require('./convertUnitCodeToBaseCode'),
	decimalFormatter = require('./decimalFormatter'),
	monthCodes = require('./monthCodes'),
	parseSymbolType = require('./parseSymbolType'),
	priceFormatter = require('./priceFormatter'),
	snapshotProvider = require('./snapshotProvider'),
	symbolResolver = require('./symbolResolver'),
	timeFormatter = require('./timeFormatter');

module.exports = (() => {
	'use strict';

	return {
		convertBaseCodeToUnitCode: convertBaseCodeToUnitCode,
		convertUnitCodeToBaseCode: convertUnitCodeToBaseCode,
		convertDateToDayCode: convertDateToDayCode,
		convertDayCodeToNumber: convertDayCodeToNumber,
		decimalFormatter: decimalFormatter,
		monthCodes: monthCodes,
		parseSymbolType: parseSymbolType,
		snapshotProvider: snapshotProvider,
		symbolResolver: symbolResolver,

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