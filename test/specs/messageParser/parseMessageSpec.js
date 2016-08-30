var parseMessage = require('../../../lib/messageParser/parseMessage');

describe('When parsing a 2,Z message for SIRI, 3@3.94', function() {
	var x;

	beforeEach(function() {
		x = parseMessage('\x012SIRI,Z AQ15394,3,1I');
	});

	it('The "record" should be "2"', function() {
		expect(x.record).toEqual('2');
	});

	it('The "subrecord" should be "Z"', function() {
		expect(x.subrecord).toEqual('Z');
	});

	it('The "symbol" should be "SIRI"', function() {
		expect(x.symbol).toEqual('SIRI');
	});

	it('The "type" should be "TRADE_OUT_OF_SEQUENCE"', function() {
		expect(x.type).toEqual('TRADE_OUT_OF_SEQUENCE');
	});

	it('The "tradePrice" should be 3.94', function() {
		expect(x.tradePrice).toEqual(3.94);
	});

	it('The "tradeSize" should be 3', function() {
		expect(x.tradeSize).toEqual(3);
	});
});

describe('When parsing a 2,Z message for SIRI, 2998262@3.95', function() {
	var x;

	beforeEach(function() {
		x = parseMessage('\x012SIRI,Z AQ15395,2998262,1W');
	});

	it('The "record" should be "2"', function() {
		expect(x.record).toEqual('2');
	});

	it('The "subrecord" should be "Z"', function() {
		expect(x.subrecord).toEqual('Z');
	});

	it('The "symbol" should be "SIRI"', function() {
		expect(x.symbol).toEqual('SIRI');
	});

	it('The "type" should be "TRADE_OUT_OF_SEQUENCE"', function() {
		expect(x.type).toEqual('TRADE_OUT_OF_SEQUENCE');
	});

	it('The "tradePrice" should be 3.95', function() {
		expect(x.tradePrice).toEqual(3.95);
	});

	it('The "tradeSize" should be 2998262', function() {
		expect(x.tradeSize).toEqual(2998262);
	});
});

describe('When parsing a 2,0 message for AAPL', function() {
	var x;

	beforeEach(function() {
		x = parseMessage('\x012AAPL,0\x02AQ1510885,D0M \x03\x14PHWQT@\x04$');
	});

	it('The "record" should be "2"', function() {
		expect(x.record).toEqual('2');
	});

	it('The "subrecord" should be "0"', function() {
		expect(x.subrecord).toEqual('0');
	});

	it('The "symbol" should be "AAPL"', function() {
		expect(x.symbol).toEqual('AAPL');
	});

	it('The "type" should be "SETTLEMENT"', function() {
		expect(x.type).toEqual('SETTLEMENT');
	});

	it('The "value" should be 108.85', function() {
		expect(x.value).toEqual(108.85);
	});
});

describe('When parsing a 2,Z message for TSLA', function() {
	var x;

	beforeEach(function() {
		x = parseMessage('\x012TSLA,Z\x02AQ1521201,3,TI\x03');

		console.log(x);
	});

	it('The "record" should be "2"', function() {
		expect(x.record).toEqual('2');
	});

	it('The "subrecord" should be "Z"', function() {
		expect(x.subrecord).toEqual('Z');
	});
	
	it('The "symbol" should be "AAPL"', function() {
		expect(x.symbol).toEqual('TSLA');
	});

	it('The "type" should be "TRADE_OUT_OF_SEQUENCE"', function() {
		expect(x.type).toEqual('TRADE_OUT_OF_SEQUENCE');
	});

	it('The "tradePrice" should be "212.01"', function() {
		expect(x.tradePrice).toEqual(212.01);
	});

	it('The "day" should be "T"', function() {
		expect(x.day).toEqual('T');
	});

	it('The "session" should be "I"', function() {
		expect(x.session).toEqual('I');
	});
});