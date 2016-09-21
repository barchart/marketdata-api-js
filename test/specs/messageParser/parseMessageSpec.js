var parseMessage = require('../../../lib/messageParser/parseMessage');

describe('when parsing an XML refresh message', function() {
	describe('for an instrument that has settled and has a postmarket (form-T) trade', function() {
		var x;

		beforeEach(function() {
			x = parseMessage('%<QUOTE symbol="AAPL" name="Apple Inc" exchange="NASDAQ" basecode="A" pointvalue="1.0" tickincrement="1" ddfexchange="Q" flag="s" lastupdate="20160920163525" bid="11345" bidsize="10" ask="11352" asksize="1" mode="I"><SESSION day="J" session="R" timestamp="20160920171959" open="11305" high="11412" low="11251" last="11357" previous="11358" settlement="11357" tradesize="1382944" volume="36258067" numtrades="143218" pricevolume="3548806897.06" tradetime="20160920160000" ticks=".." id="combined"/><SESSION day="I" timestamp="20160919000000" open="11519" high="11618" low="11325" last="11358" previous="11492" settlement="11358" volume="47010000" ticks=".." id="previous"/><SESSION day="J" session="R" previous="11358" volume="13198" id="session_J_R"/><SESSION day="J" session="T" timestamp="20160920172007" last="11355" previous="11358" tradesize="500" volume="656171" numtrades="1118" pricevolume="74390050.90" tradetime="20160920172007" ticks="+-" id="session_J_T"/></QUOTE>');
		});

		it('the "flag" should be "s"', function() {
			expect(x.flag).toEqual('s');
		});

		it('the "session" should not be "T"', function() {
			expect(x.session).toEqual('T');
		});

		it('the "sessionT" should be true', function() {
			expect(x.sessionT).toEqual(true);
		});

		it('the "lastPrice" should be 113.57', function() {
			expect(x.lastPrice).toEqual(113.57);
		});

		it('the "lastPriceT" should be 113.55', function() {
			expect(x.lastPriceT).toEqual(113.55);
		});
	});

	describe('for an instrument that is not settled, but has a postmarket (form-T) trade', function() {
		var x;

		beforeEach(function() {
			x = parseMessage('%<QUOTE symbol="BAC" name="Bank of America Corp" exchange="NYSE" basecode="A" pointvalue="1.0" tickincrement="1" ddfexchange="N" lastupdate="20160920152208" bid="1558" bidsize="20" ask="1559" asksize="1" mode="I"><SESSION day="J" session="R" timestamp="20160920160021" open="1574" high="1576" low="1551" last="1560" previous="1559" tradesize="1483737" volume="67399368" numtrades="96903" pricevolume="1041029293.48" tradetime="20160920160021" ticks=".." id="combined"/><SESSION day="I" timestamp="20160919000000" open="1555" high="1578" low="1555" last="1559" previous="1549" settlement="1559" volume="66174800" ticks=".." id="previous"/><SESSION day="J" session="R" previous="1559" volume="1772" id="session_J_R"/><SESSION day="J" session="T" timestamp="20160920160527" last="1559" previous="1559" tradesize="1175" volume="296998" numtrades="356" pricevolume="4652652.89" tradetime="20160920160527" ticks=".." id="session_J_T"/></QUOTE>');
		});

		it('the "flag" should not be "s"', function() {
			expect(x.flag).not.toEqual('s');
		});

		it('the "session" should not be "T"', function() {
			expect(x.session).not.toEqual('T');
		});

		it('the "sessionT" should be true', function() {
			expect(x.sessionT).toEqual(true);
		});
	});
});

describe('when parsing a DDF message', function() {
	describe('for a 2,Z message for SIRI, 3@3.94', function() {
		var x;

		beforeEach(function() {
			x = parseMessage('\x012SIRI,Z AQ15394,3,1I');
		});

		it('the "record" should be "2"', function() {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "Z"', function() {
			expect(x.subrecord).toEqual('Z');
		});

		it('the "symbol" should be "SIRI"', function() {
			expect(x.symbol).toEqual('SIRI');
		});

		it('the "type" should be "TRADE_OUT_OF_SEQUENCE"', function() {
			expect(x.type).toEqual('TRADE_OUT_OF_SEQUENCE');
		});

		it('the "tradePrice" should be 3.94', function() {
			expect(x.tradePrice).toEqual(3.94);
		});

		it('the "tradeSize" should be 3', function() {
			expect(x.tradeSize).toEqual(3);
		});
	});

	describe('for a 2,Z message for SIRI, 2998262@3.95', function() {
		var x;

		beforeEach(function() {
			x = parseMessage('\x012SIRI,Z AQ15395,2998262,1W');
		});

		it('the "record" should be "2"', function() {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "Z"', function() {
			expect(x.subrecord).toEqual('Z');
		});

		it('the "symbol" should be "SIRI"', function() {
			expect(x.symbol).toEqual('SIRI');
		});

		it('the "type" should be "TRADE_OUT_OF_SEQUENCE"', function() {
			expect(x.type).toEqual('TRADE_OUT_OF_SEQUENCE');
		});

		it('the "tradePrice" should be 3.95', function() {
			expect(x.tradePrice).toEqual(3.95);
		});

		it('the "tradeSize" should be 2998262', function() {
			expect(x.tradeSize).toEqual(2998262);
		});
	});

	describe('for a 2,0 message for AAPL', function() {
		var x;

		beforeEach(function() {
			x = parseMessage('\x012AAPL,0\x02AQ1510885,D0M \x03\x14PHWQT@\x04$');
		});

		it('the "record" should be "2"', function() {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "0"', function() {
			expect(x.subrecord).toEqual('0');
		});

		it('the "symbol" should be "AAPL"', function() {
			expect(x.symbol).toEqual('AAPL');
		});

		it('the "type" should be "SETTLEMENT"', function() {
			expect(x.type).toEqual('SETTLEMENT');
		});

		it('the "value" should be 108.85', function() {
			expect(x.value).toEqual(108.85);
		});
	});

	describe('for a 2,Z message for TSLA', function() {
		var x;

		beforeEach(function() {
			x = parseMessage('\x012TSLA,Z\x02AQ1521201,3,TI\x03');
		});

		it('the "record" should be "2"', function() {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "Z"', function() {
			expect(x.subrecord).toEqual('Z');
		});

		it('the "symbol" should be "AAPL"', function() {
			expect(x.symbol).toEqual('TSLA');
		});

		it('the "type" should be "TRADE_OUT_OF_SEQUENCE"', function() {
			expect(x.type).toEqual('TRADE_OUT_OF_SEQUENCE');
		});

		it('the "tradePrice" should be "212.01"', function() {
			expect(x.tradePrice).toEqual(212.01);
		});

		it('the "day" should be "T"', function() {
			expect(x.day).toEqual('T');
		});

		it('the "session" should be "I"', function() {
			expect(x.session).toEqual('I');
		});
	});
});
