const AssetClass = require('../../../../lib/utilities/data/AssetClass');

describe('When parsing asset class codes', () => {
	it('"STK" should parse as "AssetClass.STOCK"', () => {
		expect(AssetClass.parse('STK')).toEqual(AssetClass.STOCK);
	});

	it('"STKOPT" should parse as "AssetClass.STOCK_OPTION"', () => {
		expect(AssetClass.parse('STKOPT')).toEqual(AssetClass.STOCK_OPTION);
	});

	it('"FUT" should parse as "AssetClass.FUTURE"', () => {
		expect(AssetClass.parse('FUT')).toEqual(AssetClass.FUTURE);
	});

	it('"FUTOPT" should parse as "AssetClass.FUTURE_OPTION"', () => {
		expect(AssetClass.parse('FUTOPT')).toEqual(AssetClass.FUTURE_OPTION);
	});

	it('"FOREX" should parse as "AssetClass.FOREX"', () => {
		expect(AssetClass.parse('FOREX')).toEqual(AssetClass.FOREX);
	});
});

describe('When retrieving identifier from asset classes', () => {
	it('AssetClass.STOCK.id should return 1', () => {
		expect(AssetClass.STOCK.id).toEqual(1);
	});

	it('AssetClass.STOCK_OPTION.id should return 34', () => {
		expect(AssetClass.STOCK_OPTION.id).toEqual(34);
	});

	it('AssetClass.FUTURE.id should return 2', () => {
		expect(AssetClass.FUTURE.id).toEqual(2);
	});

	it('AssetClass.FUTURE_OPTION.id should return 12', () => {
		expect(AssetClass.FUTURE_OPTION.id).toEqual(12);
	});

	it('AssetClass.FOREX.id should return 10', () => {
		expect(AssetClass.FOREX.id).toEqual(10);
	});
});