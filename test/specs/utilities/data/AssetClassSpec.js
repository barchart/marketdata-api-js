const AssetClass = require('../../../../lib/utilities/data/AssetClass');

describe('When parsing asset class codes', () => {
	it('"STK" should parse as "AssetClass.STOCK"', () => {
		expect(AssetClass.parse('STK')).toEqual(AssetClass.STOCK);
	});
});