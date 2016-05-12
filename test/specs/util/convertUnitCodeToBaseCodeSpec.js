var convertUnitCodeToBaseCode = require('../../../lib/util/convertUnitCodeToBaseCode');

describe('When converting a unitCode to a baseCode', function() {
	it('"2" should translate to -1', function() {
		expect(convertUnitCodeToBaseCode('2')).toEqual(-1);
	});
});