var parseMessage = require('../../../lib/messageParser/parseMessage');

describe('When parsing a 2,Z message for SIRI, 3@3.94', function() {
	var x;

	beforeEach(function() {
		x = parseMessage('\x012SIRI,Z AQ15394,3,1I');
	});

	it('The "symbol" should be "SIRI"', function() {
		expect(x.symbol).toBe('SIRI');
	});

	it('The "type" should be "TRADE_OUT_OF_SEQUENCE"', function() {
		expect(x.type).toBe('TRADE_OUT_OF_SEQUENCE');
	});

	it('The "tradePrice" should be 3.94', function() {
		expect(x.tradePrice).toBe(3.94);
	});

	it('The "tradeSize" should be 3', function() {
		expect(x.tradeSize).toBe(3);
	});
});

describe('When parsing a 2,Z message for SIRI, 2998262@3.95', function() {
	var x;

	beforeEach(function() {
		x = parseMessage('\x012SIRI,Z AQ15395,2998262,1W');
	});

	it('The "symbol" should be "SIRI"', function() {
		expect(x.symbol).toBe('SIRI');
	});

	it('The "type" should be "TRADE_OUT_OF_SEQUENCE"', function() {
		expect(x.type).toBe('TRADE_OUT_OF_SEQUENCE');
	});

	it('The "tradePrice" should be 3.95', function() {
		expect(x.tradePrice).toBe(3.95);
	});

	it('The "tradeSize" should be 2998262', function() {
		expect(x.tradeSize).toBe(2998262);
	});
});

describe('When parsing a 2,0 message for AAPL', function() {
	var x;

	beforeEach(function() {
		x = parseMessage('\x012AAPL,0\x02AQ1510885,D0M \x03\x14PHWQT@\x04$');
	});

	it('The "symbol" should be "AAPL"', function() {
		expect(x.symbol).toBe('AAPL');
	});

	it('The "type" should be "SETTLEMENT"', function() {
		expect(x.type).toBe('SETTLEMENT');
	});

	it('The "value" should be 108.85', function() {
		expect(x.value).toBe(108.85);
	});
});