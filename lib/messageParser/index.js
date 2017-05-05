const parseMessage = require('./parseMessage'),
	parseTimestamp = require('./parseTimestamp'),
	parseValue = require('./parseValue');

module.exports = (() => {
	'use strict';

	return {
		parseMessage: parseMessage,
		parseTimestamp: parseTimestamp,
		parseValue: parseValue,

		Parse: parseMessage,
		ParseTimestamp: parseTimestamp,
		ParseValue: parseValue
	};
})();