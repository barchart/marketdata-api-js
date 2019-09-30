const SymbolParser = require('../../../../lib/utilities/parsers/SymbolParser');

describe('When parsing a symbol for instrument type', () => {
	describe('and the symbol is IBM', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('IBM');
		});

		it('the result should be null', () => {
			expect(instrumentType).toBe(null);
		});
	});

	describe('and the symbol is ESZ9', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('ESZ9');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ESZ9"', () => {
			expect(instrumentType.symbol).toEqual('ESZ9');
		});

		it('the "type" should be "future"', () => {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be false', () => {
			expect(instrumentType.dynamic).toEqual(false);
		});

		it('the "root" should be "ES"', () => {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "month" should be "Z"', () => {
			expect(instrumentType.month).toEqual('Z');
		});

		it('the "year" should be 2019', () => {
			expect(instrumentType.year).toEqual(2019);
		});
	});

	describe('and the symbol is ESZ16', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('ESZ16');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ESZ16"', () => {
			expect(instrumentType.symbol).toEqual('ESZ16');
		});

		it('the "type" should be "future"', () => {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be false', () => {
			expect(instrumentType.dynamic).toEqual(false);
		});

		it('the "root" should be "ES"', () => {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "month" should be "Z"', () => {
			expect(instrumentType.month).toEqual('Z');
		});

		it('the "year" should be 2016', () => {
			expect(instrumentType.year).toEqual(2016);
		});
	});

	describe('and the symbol is ESZ2016', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('ESZ2016');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ES2016Z6"', () => {
			expect(instrumentType.symbol).toEqual('ESZ2016');
		});

		it('the "type" should be "future"', () => {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be false', () => {
			expect(instrumentType.dynamic).toEqual(false);
		});

		it('the "root" should be "ES"', () => {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "month" should be "Z"', () => {
			expect(instrumentType.month).toEqual('Z');
		});

		it('the "year" should be 2016', () => {
			expect(instrumentType.year).toEqual(2016);
		});
	});

	describe('and the symbol is ES*0', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('ES*0');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ES*0"', () => {
			expect(instrumentType.symbol).toEqual('ES*0');
		});

		it('the "type" should be "future"', () => {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be true', () => {
			expect(instrumentType.dynamic).toEqual(true);
		});

		it('the "root" should be "ES"', () => {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "dynamicCode" property should be "0"', () => {
			expect(instrumentType.dynamicCode).toEqual('0');
		});
	});

	describe('and the symbol is ES*1', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('ES*1');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ES*1"', () => {
			expect(instrumentType.symbol).toEqual('ES*1');
		});

		it('the "type" should be "future"', () => {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be true', () => {
			expect(instrumentType.dynamic).toEqual(true);
		});

		it('the "root" should be "ES"', () => {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "dynamicCode" property should be "1"', () => {
			expect(instrumentType.dynamicCode).toEqual('1');
		});
	});

	describe('and the symbol is CLF0', () => {
		let instrumentType;
		
		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('CLF0');
		});

		it('the "year" should be 2020', () =>{
			expect(instrumentType.year).toEqual(2020);
		});
	});

	describe('and the symbol is CLF1 and the year is 2019', () => {
		let instrumentType;

		beforeEach(() => {
			let getFullYear = Date.prototype.getFullYear;

			Date.prototype.getFullYear = () => { return 2019; };

			instrumentType = SymbolParser.parseInstrumentType('CLF1');

			Date.prototype.getFullYear = getFullYear;
		});

		it('the "year" should be 2021', () =>{
			expect(instrumentType.year).toEqual(2021);
		});
	});

	describe('and the symbol is CLF9 and the year is 2019', () => {
		let instrumentType;

		beforeEach(() => {
			let getFullYear = Date.prototype.getFullYear;

			Date.prototype.getFullYear = () => { return 2019; };

			instrumentType = SymbolParser.parseInstrumentType('CLF9');

			Date.prototype.getFullYear = getFullYear;
		});

		it('the "year" should be 2019', () =>{
			expect(instrumentType.year).toEqual(2019);
		});
	});

	describe('and the symbol is ^EURUSD', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('^EURUSD');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "^EURUSD"', () => {
			expect(instrumentType.symbol).toEqual('^EURUSD');
		});

		it('the "type" should be "forex"', () => {
			expect(instrumentType.type).toEqual('forex');
		});
	});

	describe('and the symbol is $DOWI', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('$DOWI');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "$DOWI"', () => {
			expect(instrumentType.symbol).toEqual('$DOWI');
		});

		it('the "type" should be "index"', () => {
			expect(instrumentType.type).toEqual('index');
		});
	});

	describe('and the symbol is $SG1E', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('$SG1E');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "$SG1E"', () => {
			expect(instrumentType.symbol).toEqual('$SG1E');
		});

		it('the "type" should be "index"', () => {
			expect(instrumentType.type).toEqual('index');
		});
	});

	describe('and the symbol is -001A', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('-001A');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "-001A"', () => {
			expect(instrumentType.symbol).toEqual('-001A');
		});

		it('the "type" should be "sector"', () => {
			expect(instrumentType.type).toEqual('sector');
		});
	});

	describe('and the symbol is ESZ2660Q', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('ESZ2660Q');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ESZ2660Q"', () => {
			expect(instrumentType.symbol).toEqual('ESZ2660Q');
		});

		it('the "type" should be "future_option"', () => {
			expect(instrumentType.type).toEqual('future_option');
		});

		it('the "root" should be "ES"', () => {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "month" should be "Z"', () => {
			expect(instrumentType.month).toEqual('Z');
		});

		it('the "year" should be next year', () => {
			expect(instrumentType.year).toEqual(new Date().getFullYear()+1);
		});

		it('the "strike" should be 2660', () => {
			expect(instrumentType.strike).toEqual(2660);
		});

		it('the "option_type" should be "put"', () => {
			expect(instrumentType.option_type).toEqual('put');
		});
	});

	describe('and the symbol is ZWH9|470C', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('ZWH9|470C');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ZWH9|470C"', () => {
			expect(instrumentType.symbol).toEqual('ZWH9|470C');
		});

		it('the "type" should be "future_option"', () => {
			expect(instrumentType.type).toEqual('future_option');
		});

		it('the "root" should be "ZW"', () => {
			expect(instrumentType.root).toEqual('ZW');
		});

		it('the "month" should be "H"', () => {
			expect(instrumentType.month).toEqual('H');
		});

		it('the "year" should be 2019', () => {
			expect(instrumentType.year).toEqual(2019);
		});

		it('the "strike" should be 470', () => {
			expect(instrumentType.strike).toEqual(470);
		});

		it('the "option_type" should be "call"', () => {
			expect(instrumentType.option_type).toEqual('call');
		});
	});

	describe('and the symbol is _S_SP_ZCH7_ZCK7', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('_S_SP_ZCH7_ZCK7');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "_S_SP_ZCH7_ZCK7"', () => {
			expect(instrumentType.symbol).toEqual('_S_SP_ZCH7_ZCK7');
		});

		it('the "type" should be "future_spread"', () => {
			expect(instrumentType.type).toEqual('future_spread');
		});
	});
});

describe('When checking to see if a symbol is a future', () => {
	it('the symbol "ESZ6" should return true', () => {
		expect(SymbolParser.getIsFuture('ESZ6')).toEqual(true);
	});

	it('the symbol "ESZ16" should return true', () => {
		expect(SymbolParser.getIsFuture('ESZ16')).toEqual(true);
	});

	it('the symbol "ESZ2016" should return true', () => {
		expect(SymbolParser.getIsFuture('ESZ2016')).toEqual(true);
	});

	it('the symbol "ESZ016" should return false', () => {
		expect(SymbolParser.getIsFuture('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return true', () => {
		expect(SymbolParser.getIsFuture('O!H7')).toEqual(true);
	});

	it('the symbol "O!H2017" should return true', () => {
		expect(SymbolParser.getIsFuture('O!H2017')).toEqual(true);
	});

	it('the symbol "IBM" should return false', () => {
		expect(SymbolParser.getIsFuture('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', () => {
		expect(SymbolParser.getIsFuture('^EURUSD')).toEqual(false);
	});

	it('the symbol "-001A" should return false', () => {
		expect(SymbolParser.getIsFuture('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', () => {
		expect(SymbolParser.getIsFuture('$DOWI')).toEqual(false);
	});

	it('the symbol "$SG1E" should return false', () => {
		expect(SymbolParser.getIsFuture('$SG1E')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
		expect(SymbolParser.getIsFuture('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});

	it('the symbol "ESZ2660Q" should return false', () => {
		expect(SymbolParser.getIsFuture('ESZ2660Q')).toEqual(false);
	});

	it('the symbol "ZWH9|470C" should return false', () => {
		expect(SymbolParser.getIsFuture('ZWH9|470C')).toEqual(false);
	});

	it('the symbol "BB1F8|12050C" should return false', () => {
		expect(SymbolParser.getIsFuture('BB1F8|12050C')).toEqual(false);
	});

	it('the symbol "ZWK18465C" should return false', () => {
		expect(SymbolParser.getIsFuture('ZWK18465C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00C" should return false', () => {
		expect(SymbolParser.getIsFuture('PLATTS:AAVSV00C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00" should return false', () => {
		expect(SymbolParser.getIsFuture('PLATTS:AAVSV00')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(SymbolParser.getIsFuture('ZCPAUS.CM')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a "concrete" future', () => {
	it('the symbol "ESZ6" should return true', () => {
		expect(SymbolParser.getIsConcrete('ESZ6')).toEqual(true);
	});

	it('the symbol "ESZ16" should return true', () => {
		expect(SymbolParser.getIsConcrete('ESZ16')).toEqual(true);
	});

	it('the symbol "ESZ2016" should return true', () => {
		expect(SymbolParser.getIsConcrete('ESZ2016')).toEqual(true);
	});

	it('the symbol "ES*0" should return false', () => {
		expect(SymbolParser.getIsConcrete('ES*0')).toEqual(false);
	});

	it('the symbol "ES*1" should return false', () => {
		expect(SymbolParser.getIsConcrete('ES*1')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a "reference" future', () => {
	it('the symbol "ESZ6" should return false', () => {
		expect(SymbolParser.getIsReference('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', () => {
		expect(SymbolParser.getIsReference('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', () => {
		expect(SymbolParser.getIsReference('ESZ2016')).toEqual(false);
	});

	it('the symbol "ES*0" should return true', () => {
		expect(SymbolParser.getIsReference('ES*0')).toEqual(true);
	});

	it('the symbol "ES*1" should return true', () => {
		expect(SymbolParser.getIsReference('ES*1')).toEqual(true);
	});
});

describe('When checking to see if a symbol is sector', () => {
	it('the symbol "ESZ6" should return false', () => {
		expect(SymbolParser.getIsSector('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', () => {
		expect(SymbolParser.getIsSector('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', () => {
		expect(SymbolParser.getIsSector('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', () => {
		expect(SymbolParser.getIsSector('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', () => {
		expect(SymbolParser.getIsSector('O!H7')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', () => {
		expect(SymbolParser.getIsSector('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', () => {
		expect(SymbolParser.getIsSector('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', () => {
		expect(SymbolParser.getIsSector('^EURUSD')).toEqual(false);
	});

	it('the symbol "-001A" should return true', () => {
		expect(SymbolParser.getIsSector('-001A')).toEqual(true);
	});

	it('the symbol "$DOWI" should return false', () => {
		expect(SymbolParser.getIsSector('$DOWI')).toEqual(false);
	});

	it('the symbol "$S1GE" should return false', () => {
		expect(SymbolParser.getIsSector('$S1GE')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
		expect(SymbolParser.getIsSector('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});

	it('the symbol "ESZ2660Q" should return false', () => {
		expect(SymbolParser.getIsSector('ESZ2660Q')).toEqual(false);
	});

	it('the symbol "ZWH9|470C" should return false', () => {
		expect(SymbolParser.getIsSector('ZWH9|470C')).toEqual(false);
	});

	it('the symbol "BB1F8|12050C" should return false', () => {
		expect(SymbolParser.getIsSector('BB1F8|12050C')).toEqual(false);
	});

	it('the symbol "ZWK18465C" should return false', () => {
		expect(SymbolParser.getIsSector('ZWK18465C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00C" should return false', () => {
		expect(SymbolParser.getIsSector('PLATTS:AAVSV00C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00" should return false', () => {
		expect(SymbolParser.getIsSector('PLATTS:AAVSV00')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(SymbolParser.getIsSector('ZCPAUS.CM')).toEqual(false);
	});
});

describe('When checking to see if a symbol is forex', () => {
	it('the symbol "ESZ6" should return false', () => {
		expect(SymbolParser.getIsForex('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', () => {
		expect(SymbolParser.getIsForex('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', () => {
		expect(SymbolParser.getIsForex('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', () => {
		expect(SymbolParser.getIsForex('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', () => {
		expect(SymbolParser.getIsForex('O!H7')).toEqual(false);
	});

	it('the symbol "O!H17" should return false', () => {
		expect(SymbolParser.getIsForex('O!H17')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', () => {
		expect(SymbolParser.getIsForex('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', () => {
		expect(SymbolParser.getIsForex('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return true', () => {
		expect(SymbolParser.getIsForex('^EURUSD')).toEqual(true);
	});

	it('the symbol "-001A" should return false', () => {
		expect(SymbolParser.getIsForex('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', () => {
		expect(SymbolParser.getIsForex('$DOWI')).toEqual(false);
	});

	it('the symbol "$S1GE" should return false', () => {
		expect(SymbolParser.getIsForex('$S1GE')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
		expect(SymbolParser.getIsForex('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});

	it('the symbol "ESZ2660Q" should return false', () => {
		expect(SymbolParser.getIsForex('ESZ2660Q')).toEqual(false);
	});

	it('the symbol "ZWH9|470C" should return false', () => {
		expect(SymbolParser.getIsForex('ZWH9|470C')).toEqual(false);
	});

	it('the symbol "BB1F8|12050C" should return false', () => {
		expect(SymbolParser.getIsForex('BB1F8|12050C')).toEqual(false);
	});

	it('the symbol "ZWK18465C" should return false', () => {
		expect(SymbolParser.getIsForex('ZWK18465C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00C" should return false', () => {
		expect(SymbolParser.getIsForex('PLATTS:AAVSV00C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00" should return false', () => {
		expect(SymbolParser.getIsForex('PLATTS:AAVSV00')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(SymbolParser.getIsForex('ZCPAUS.CM')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a future spread', () => {
	it('the symbol "ESZ6" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('O!H7')).toEqual(false);
	});

	it('the symbol "O!H17" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('O!H17')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('^EURUSD')).toEqual(false);
	});

	it('the symbol "-001A" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('$DOWI')).toEqual(false);
	});

	it('the symbol "$S1GE" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('$S1GE')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return true', () => {
		expect(SymbolParser.getIsFutureSpread('_S_SP_ZCH7_ZCK7')).toEqual(true);
	});

	it('the symbol "ESZ2660Q" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('ESZ2660Q')).toEqual(false);
	});

	it('the symbol "ZWH9|470C" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('ZWH9|470C')).toEqual(false);
	});

	it('the symbol "BB1F8|12050C" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('BB1F8|12050C')).toEqual(false);
	});

	it('the symbol "ZWK18465C" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('ZWK18465C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00C" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('PLATTS:AAVSV00C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('PLATTS:AAVSV00')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('ZCPAUS.CM')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a future option', () => {
	it('the symbol "ESZ6" should return false', () => {
		expect(SymbolParser.getIsFutureOption('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', () => {
		expect(SymbolParser.getIsFutureOption('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', () => {
		expect(SymbolParser.getIsFutureOption('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', () => {
		expect(SymbolParser.getIsFutureOption('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', () => {
		expect(SymbolParser.getIsFutureOption('O!H7')).toEqual(false);
	});

	it('the symbol "O!H17" should return false', () => {
		expect(SymbolParser.getIsFutureOption('O!H17')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', () => {
		expect(SymbolParser.getIsFutureOption('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', () => {
		expect(SymbolParser.getIsFutureOption('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', () => {
		expect(SymbolParser.getIsFutureOption('^EURUSD')).toEqual(false);
	});

	it('the symbol "-001A" should return false', () => {
		expect(SymbolParser.getIsFutureOption('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', () => {
		expect(SymbolParser.getIsFutureOption('$DOWI')).toEqual(false);
	});

	it('the symbol "$S1GE" should return false', () => {
		expect(SymbolParser.getIsFutureOption('$S1GE')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
		expect(SymbolParser.getIsFutureOption('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});

	it('the symbol "ESZ2660Q" should return true', () => {
		expect(SymbolParser.getIsFutureOption('ESZ2660Q')).toEqual(true);
	});

	it('the symbol "ZWH9|470C" should return true', () => {
		expect(SymbolParser.getIsFutureOption('ZWH9|470C')).toEqual(true);
	});

	it('the symbol "BB1F8|12050C" should return true', () => {
		expect(SymbolParser.getIsFutureOption('BB1F8|12050C')).toEqual(true);
	});

	it('the symbol "ZWK18465C" should return true', () => {
		expect(SymbolParser.getIsFutureOption('ZWK18465C')).toEqual(true);
	});

	it('the symbol "PLATTS:AAVSV00C" should return false', () => {
		expect(SymbolParser.getIsFutureOption('PLATTS:AAVSV00C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00" should return false', () => {
		expect(SymbolParser.getIsFutureOption('PLATTS:AAVSV00')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(SymbolParser.getIsFutureOption('ZCPAUS.CM')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a cmdty index option', () => {
	it('the symbol "ESZ6" should return false', () => {
		expect(SymbolParser.getIsCmdty('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', () => {
		expect(SymbolParser.getIsCmdty('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', () => {
		expect(SymbolParser.getIsCmdty('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', () => {
		expect(SymbolParser.getIsCmdty('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', () => {
		expect(SymbolParser.getIsCmdty('O!H7')).toEqual(false);
	});

	it('the symbol "O!H17" should return false', () => {
		expect(SymbolParser.getIsCmdty('O!H17')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', () => {
		expect(SymbolParser.getIsCmdty('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', () => {
		expect(SymbolParser.getIsCmdty('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', () => {
		expect(SymbolParser.getIsCmdty('^EURUSD')).toEqual(false);
	});

	it('the symbol "-001A" should return false', () => {
		expect(SymbolParser.getIsCmdty('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', () => {
		expect(SymbolParser.getIsCmdty('$DOWI')).toEqual(false);
	});

	it('the symbol "$S1GE" should return false', () => {
		expect(SymbolParser.getIsCmdty('$S1GE')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
		expect(SymbolParser.getIsCmdty('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});

	it('the symbol "ESZ2660Q" should return false', () => {
		expect(SymbolParser.getIsCmdty('ESZ2660Q')).toEqual(false);
	});

	it('the symbol "ZWH9|470C" should return false', () => {
		expect(SymbolParser.getIsCmdty('ZWH9|470C')).toEqual(false);
	});

	it('the symbol "BB1F8|12050C" should return false', () => {
		expect(SymbolParser.getIsCmdty('BB1F8|12050C')).toEqual(false);
	});

	it('the symbol "ZWK18465C" should return false', () => {
		expect(SymbolParser.getIsCmdty('ZWK18465C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00C" should return false', () => {
		expect(SymbolParser.getIsCmdty('PLATTS:AAVSV00C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00" should return false', () => {
		expect(SymbolParser.getIsCmdty('PLATTS:AAVSV00')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return true', () => {
		expect(SymbolParser.getIsCmdty('ZCPAUS.CM')).toEqual(true);
	});
});

describe('When checking to see if a symbol is a BATS listing', () => {
	it('the symbol "IBM" should return false', () => {
		expect(SymbolParser.getIsBats('IBM')).toEqual(false);
	});

	it('the symbol "IBM.BZ" should return true', () => {
		expect(SymbolParser.getIsBats('IBM.BZ')).toEqual(true);
	});
});

describe('When checking the display format for the symbol ', () => {
	it('The symbol "HPIUSA.RP" should not be formatted as a percent', () => {
		expect(SymbolParser.displayUsingPercent('HPIUSA.RP')).toEqual(false);
	});

	it('The symbol "UERMNTUS.RT" should be formatted as a percent', () => {
		expect(SymbolParser.displayUsingPercent('UERMNTUS.RT')).toEqual(true);
	});
});

describe('When getting a producer symbol', () => {
	it('TSLA should map to TSLA', () => {
		expect(SymbolParser.getProducerSymbol('TSLA')).toEqual('TSLA');
	});

	it('TSLA.BZ should map to TSLA.BZ', () => {
		expect(SymbolParser.getProducerSymbol('TSLA.BZ')).toEqual('TSLA.BZ');
	});

	it('ESZ6 should map to ESZ6', () => {
		expect(SymbolParser.getProducerSymbol('ESZ6')).toEqual('ESZ6');
	});

	it('ESZ16 should map to ESZ6', () => {
		expect(SymbolParser.getProducerSymbol('ESZ16')).toEqual('ESZ6');
	});

	it('ESZ2016 should map to ESZ6', () => {
		expect(SymbolParser.getProducerSymbol('ESZ16')).toEqual('ESZ6');
	});

	it('ES*0 should map to ES*0', () => {
		expect(SymbolParser.getProducerSymbol('ES*0')).toEqual('ES*0');
	});

	it('$DOWI should map to $DOWI', () => {
		expect(SymbolParser.getProducerSymbol('$DOWI')).toEqual('$DOWI');
	});

	it('^EURUSD should map to ^EURUSD', () => {
		expect(SymbolParser.getProducerSymbol('^EURUSD')).toEqual('^EURUSD');
	});

	it('ZWK465C should map to ZWK465C', () => {
		expect(SymbolParser.getProducerSymbol('ZWK465C')).toEqual('ZWK465C');
	});

	it('ZWK19465C should map to ZWK465C', () => {
		expect(SymbolParser.getProducerSymbol('ZWK19465C')).toEqual('ZWK465C');
	});

	it('ZWK0|465P should map to ZWK465Q', () => {
		expect(SymbolParser.getProducerSymbol('ZWK0|465P')).toEqual('ZWK465Q');
	});

	it('BZ6N8|25C should map to BZ6N8|25C', () => {
		expect(SymbolParser.getProducerSymbol('BZ6N8|25C')).toEqual('BZ6N8|25C');
	});

	it('BZ6N9|25P should map to BZ6N9|25P', () => {
		expect(SymbolParser.getProducerSymbol('BZ6N9|25P')).toEqual('BZ6N9|25P');
	});

	it('BZ6N20|25P should map to BZ6N20|25P', () => {
		expect(SymbolParser.getProducerSymbol('BZ6N20|25P')).toEqual('BZ6N0|25P');
	});

	it('PLATTS:AAVSV00 should map to PLATTS:AAVSV00', () => {
		expect(SymbolParser.getProducerSymbol('PLATTS:AAVSV00')).toEqual('PLATTS:AAVSV00');
	});
});
