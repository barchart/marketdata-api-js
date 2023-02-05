const parseMessage = require('../../../../../lib/utilities/parse/ddf/message');

const XmlParserFactoryForNode = require('./../../../../../lib/utilities/xml/XmlParserFactoryForNode');

function translateCaretControlCharacters(message) {
	return message.replace(/\^A/g, '\x01')
		.replace(/\^B/g, '\x02')
		.replace(/\^C/g, '\x03')
		.replace(/\^D/g, '\x04')
		.replace(/\^T/g, '\x20');
}

/*
describe('when parsing ad hoc DDF messages', () => {
	'use strict';

	let x;

	beforeEach(() => {
		x = parseMessage(translateCaretControlCharacters(`^A2NIO,7^BAN151027,100,KT^C^TVKUD@@^X^@`));
		//x = parseMessage(translateCaretControlCharacters(`^A2NIO,7^BAN151000,100,9@^C^TVKII^@�^B`));
	});

	it('the message should be an object', () => {
		console.log(x);
	});
});
*/

describe('when parsing an XML refresh message', () => {
	'use strict';

	let xmlParser;

	beforeEach(() => {
		const factory = new XmlParserFactoryForNode();

		xmlParser = factory.build();
	});

	describe('for an instrument that has settled and has a postmarket (form-T) trade', () => {
		let x;

		beforeEach(() => {
			x = parseMessage(`%<QUOTE symbol="AAPL" name="Apple Inc" exchange="NASDAQ" basecode="A" pointvalue="1.0" tickincrement="1" ddfexchange="Q" flag="s" lastupdate="20160920163525" bid="11345" bidsize="10" ask="11352" asksize="1" mode="I">
				<SESSION day="J" session="R" timestamp="20160920171959" open="11305" high="11412" low="11251" last="11357" previous="11358" settlement="11357" tradesize="1382944" volume="36258067" numtrades="143218" pricevolume="3548806897.06" tradetime="20160920160000" ticks=".." id="combined"/>
				<SESSION day="I" timestamp="20160919000000" open="11519" high="11618" low="11325" last="11358" previous="11492" settlement="11358" volume="47010000" ticks=".." id="previous"/>
				<SESSION day="J" session="R" previous="11358" volume="13198" id="session_J_R"/>
				<SESSION day="J" session="T" timestamp="20160920172007" last="11355" previous="11358" tradesize="500" volume="656171" numtrades="1118" pricevolume="74390050.90" tradetime="20160920172007" ticks="+-" id="session_J_T"/>
				</QUOTE>`, xmlParser);
		});

		it('the "flag" should be "s"', () => {
			expect(x.flag).toEqual('s');
		});

		it('the "session" should not be "T"', () => {
			expect(x.session).toEqual('T');
		});

		it('the "sessionT" should be true', () => {
			expect(x.sessionT).toEqual(true);
		});

		it('the "lastPrice" should be 113.57', () => {
			expect(x.lastPrice).toEqual(113.57);
		});

		it('the "lastPriceT" should be 113.55', () => {
			expect(x.lastPriceT).toEqual(113.55);
		});

		it('the "volume" should come from the "combined" session', () => {
			expect(x.volume).toEqual(36258067);
		});
	});

	describe('for an instrument that is not settled, but has a postmarket (form-T) trade', () => {
		let x;

		beforeEach(() => {
			x = parseMessage(`%<QUOTE symbol="BAC" name="Bank of America Corp" exchange="NYSE" basecode="A" pointvalue="1.0" tickincrement="1" ddfexchange="N" lastupdate="20160920152208" bid="1558" bidsize="20" ask="1559" asksize="1" mode="I">
					<SESSION day="J" session="R" timestamp="20160920160021" open="1574" high="1576" low="1551" last="1560" previous="1559" tradesize="1483737" volume="67399368" numtrades="96903" pricevolume="1041029293.48" tradetime="20160920160021" ticks=".." id="combined"/>
					<SESSION day="I" timestamp="20160919000000" open="1555" high="1578" low="1555" last="1559" previous="1549" settlement="1559" volume="66174800" ticks=".." id="previous"/>
					<SESSION day="J" session="R" previous="1559" volume="1772" id="session_J_R"/>
					<SESSION day="J" session="T" timestamp="20160920160527" last="1559" previous="1559" tradesize="1175" volume="296998" numtrades="356" pricevolume="4652652.89" tradetime="20160920160527" ticks=".." id="session_J_T"/>
					</QUOTE>`, xmlParser);
		});

		it('the "flag" should not be "s"', () => {
			expect(x.flag).not.toEqual('s');
		});

		it('the "session" should not be "T"', () => {
			expect(x.session).not.toEqual('T');
		});

		it('the "sessionT" should be true', () => {
			expect(x.sessionT).toEqual(true);
		});

		it('the "lastPrice" should be 15.60', () => {
			expect(x.lastPrice).toEqual(15.60);
		});

		it('the "lastPriceT" should be 15.59', () => {
			expect(x.lastPriceT).toEqual(15.59);
		});

		it('the "volume" should come from the "combined" session', () => {
			expect(x.volume).toEqual(67399368);
		});
	});

	describe('for an instrument that has settled, but the form-T session is from the morning', () => {
		let x;

		beforeEach(() => {
			x = parseMessage(`%<QUOTE symbol="UDOW" name="Ultrapro DOW 30 Proshares" exchange="AMEX" basecode="A" pointvalue="1.0" tickincrement="1" ddfexchange="A" lastupdate="20170222103439" bid="10994" bidsize="16" ask="10997" asksize="8" mode="I" flag="s">
				<SESSION day="L" session="R" timestamp="20170222111751" open="10933" high="11032" low="10918" last="10993" previous="10993" tradesize="112" volume="87485" numtrades="357" pricevolume="8628142.83" tradetime="20170222111751" ticks="++" id="combined" settlement="10993"/>
				<SESSION day="K" timestamp="20170221000000" open="10921" high="11021" low="10889" last="10993" previous="10798" settlement="10993" volume="387500" ticks=".." id="previous"/>
				<SESSION day="L" session="R" previous="10993" id="session_L_R"/>
				<SESSION day="L" session="T" timestamp="20170222080456" last="10987" previous="10993" tradesize="200" volume="400" numtrades="3" pricevolume="43949.00" tradetime="20170222080456" ticks=".-" id="session_L_T"/>
				</QUOTE>`, xmlParser);
		});

		it('the "flag" should be "s"', () => {
			expect(x.flag).toEqual('s');
		});

		it('the "session" should be "T"', () => {
			expect(x.session).toEqual('T');
		});

		it('the "sessionT" should be false', () => {
			expect(x.sessionT).toEqual(false);
		});

		it('the "lastPrice" should be 109.93 (taken from "combined" session)', () => {
			expect(x.lastPrice).toEqual(109.93);
		});

		it('the "lastPriceT" should not be included', () => {
			expect(x.lastPriceT).not.toBeDefined();
		});

		it('the "tradeTime" should come from the "combined" session', () => {
			expect(x.tradeTime.getTime()).toEqual((new Date(2017, 1, 22, 11, 17, 51)).getTime());
		});
	});

	describe('for an instrument that has not opened and has no form-T session', () => {
		let x;

		beforeEach(() => {
			x = parseMessage(`%<QUOTE symbol="BAC" name="Bank of America Corp" exchange="NYSE" basecode="A" pointvalue="1.0" tickincrement="1" ddfexchange="N" lastupdate="20160920152208" bid="1558" bidsize="20" ask="1559" asksize="1" mode="I">
					<SESSION day="J" session="R" timestamp="20160920160021" open="1574" high="1576" low="1551" previous="1559" tradesize="1483737" volume="67399368" numtrades="96903" pricevolume="1041029293.48" tradetime="20160920160021" ticks=".." id="combined"/>
					<SESSION day="I" timestamp="20160919000000" open="1555" high="1578" low="1555" last="1559" previous="1549" settlement="1559" volume="66174800" ticks=".." id="previous"/>
					</QUOTE>`, xmlParser);
		});

		// 2021/08/05, BRI. We are now reading from the previous session (instead of the combined session).

		/*
		it('the "previousPrice" should come from the "combined" session', () => {
			expect(x.previousPrice).toEqual(15.59);
		});
		*/

		it('the "previousPrice" should come from the "previous" session', () => {
			expect(x.previousPrice).toEqual(15.49);
		});
	});
});

describe('when parsing a DDF message', () => {
	'use strict';

	describe('for a 2,Z message for SIRI, 3@3.94', () => {
		let x;

		beforeEach(() => {
			x = parseMessage('\x012SIRI,Z AQ15394,3,1I');
		});

		it('the "record" should be "2"', () => {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "Z"', () => {
			expect(x.subrecord).toEqual('Z');
		});

		it('the "symbol" should be "SIRI"', () => {
			expect(x.symbol).toEqual('SIRI');
		});

		it('the "type" should be "TRADE_OUT_OF_SEQUENCE"', () => {
			expect(x.type).toEqual('TRADE_OUT_OF_SEQUENCE');
		});

		it('the "tradePrice" should be 3.94', () => {
			expect(x.tradePrice).toEqual(3.94);
		});

		it('the "tradeSize" should be 3', () => {
			expect(x.tradeSize).toEqual(3);
		});
	});

	describe('for a 2,Z message for SIRI, 2998262@3.95', () => {
		let x;

		beforeEach(() => {
			x = parseMessage('\x012SIRI,Z AQ15395,2998262,1W');
		});

		it('the "record" should be "2"', () => {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "Z"', () => {
			expect(x.subrecord).toEqual('Z');
		});

		it('the "symbol" should be "SIRI"', () => {
			expect(x.symbol).toEqual('SIRI');
		});

		it('the "type" should be "TRADE_OUT_OF_SEQUENCE"', () => {
			expect(x.type).toEqual('TRADE_OUT_OF_SEQUENCE');
		});

		it('the "tradePrice" should be 3.95', () => {
			expect(x.tradePrice).toEqual(3.95);
		});

		it('the "tradeSize" should be 2998262', () => {
			expect(x.tradeSize).toEqual(2998262);
		});
	});

	describe('for a 2,0 message for AAPL', () => {
		let x;

		beforeEach(() => {
			x = parseMessage('\x012AAPL,0\x02AQ1510885,D0M \x03\x14PHWQT@\x04$');
		});

		it('the "record" should be "2"', () => {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "0"', () => {
			expect(x.subrecord).toEqual('0');
		});

		it('the "symbol" should be "AAPL"', () => {
			expect(x.symbol).toEqual('AAPL');
		});

		it('the "type" should be "SETTLEMENT"', () => {
			expect(x.type).toEqual('SETTLEMENT');
		});

		it('the "value" should be 108.85', () => {
			expect(x.value).toEqual(108.85);
		});
	});

	describe('for a 2,Z message for TSLA', () => {
		let x;

		beforeEach(() => {
			x = parseMessage('\x012TSLA,Z\x02AQ1521201,3,TI\x03');
		});

		it('the "record" should be "2"', () => {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "Z"', () => {
			expect(x.subrecord).toEqual('Z');
		});

		it('the "symbol" should be "TSLA"', () => {
			expect(x.symbol).toEqual('TSLA');
		});

		it('the "type" should be "TRADE_OUT_OF_SEQUENCE"', () => {
			expect(x.type).toEqual('TRADE_OUT_OF_SEQUENCE');
		});

		it('the "tradePrice" should be "212.01"', () => {
			expect(x.tradePrice).toEqual(212.01);
		});

		it('the "day" should be "T"', () => {
			expect(x.day).toEqual('T');
		});

		it('the "session" should be "I"', () => {
			expect(x.session).toEqual('I');
		});
	});

	describe('for a 2,6 message for $M1LX', () => {
		let x;

		beforeEach(() => {
			x = parseMessage('\x012$M1LX,6\x02AI10,20200,20500,20100,20400,,,,,,,,,,540600,8 \x03');
		});

		it('the "record" should be "2"', () => {
			expect(x.record).toEqual('2');
		});

		it('the "subrecord" should be "6"', () => {
			expect(x.subrecord).toEqual('6');
		});

		it('the "symbol" should be "$M1LX"', () => {
			expect(x.symbol).toEqual('$M1LX');
		});

		it('the "type" should be "OHLC"', () => {
			expect(x.type).toEqual('OHLC');
		});

		it('the "openPrice" should be "202.00"', () => {
			expect(x.openPrice).toEqual(202.00);
		});

		it('the "highPrice" should be "205.00"', () => {
			expect(x.highPrice).toEqual(205.00);
		});

		it('the "lowPrice" should be "201.00"', () => {
			expect(x.lowPrice).toEqual(201.00);
		});

		it('the "lastPrice" should be "204.00"', () => {
			expect(x.lastPrice).toEqual(204.00);
		});

		it('the "volume" should be "540600"', () => {
			expect(x.volume).toEqual(540600);
		});

		it('the "day" should be "8"', () => {
			expect(x.day).toEqual('8');
		});

		it('the "session" should be " "', () => {
			expect(x.session).toEqual(' ');
		});
	});
});
