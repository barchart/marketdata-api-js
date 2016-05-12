var convertBaseCodeToUnitCode = require('../../../lib/util/convertBaseCodeToUnitCode');

describe('When converting a baseCode to a unitCode', function() {
	it('-1 should translate to "2"', function() {
		expect(convertBaseCodeToUnitCode(-1)).toEqual('2');
	});
});