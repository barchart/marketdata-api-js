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

	describe('and the symbol is ESM08', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('ESM08');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ESM08"', () => {
			expect(instrumentType.symbol).toEqual('ESM08');
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

		it('the "month" should be "M"', () => {
			expect(instrumentType.month).toEqual('M');
		});

		it('the "year" should be 2008', () => {
			expect(instrumentType.year).toEqual(2008);
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

		it('the "year" should be 2029', () => {
			expect(instrumentType.year).toEqual(2029);
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

	describe('and the symbol is SPY00', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('SPY00');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "SPY00"', () => {
			expect(instrumentType.symbol).toEqual('SPY00');
		});

		it('the "type" should be "future"', () => {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be false', () => {
			expect(instrumentType.dynamic).toEqual(false);
		});

		it('the "root" should be "SP"', () => {
			expect(instrumentType.root).toEqual('SP');
		});

		it('the "month" should be "Y"', () => {
			expect(instrumentType.month).toEqual('Y');
		});

		it('the "year" should be 2100', () => {
			expect(instrumentType.year).toEqual(2100);
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

	describe('and the symbol is NG*13', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('NG*13');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "NG*13"', () => {
			expect(instrumentType.symbol).toEqual('NG*13');
		});

		it('the "type" should be "future"', () => {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be true', () => {
			expect(instrumentType.dynamic).toEqual(true);
		});

		it('the "root" should be "NG"', () => {
			expect(instrumentType.root).toEqual('NG');
		});

		it('the "dynamicCode" property should be "13"', () => {
			expect(instrumentType.dynamicCode).toEqual('13');
		});
	});

	describe('and the symbol is CLF0', () => {
		let instrumentType;
		
		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('CLF0');
		});

		it('the "year" should be 2020', () =>{
			expect(instrumentType.year).toEqual(2030);
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
			expect(instrumentType.year).toEqual(new Date().getFullYear() + 1);
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

		it('the "year" should be 2029', () => {
			expect(instrumentType.year).toEqual(2029);
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

	describe('and the symbol is AAPL|20200515|250.00P', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('AAPL|20200515|250.00P');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "|20200515|250.00P"', () => {
			expect(instrumentType.symbol).toEqual('AAPL|20200515|250.00P');
		});

		it('the "type" should be "equity_option"', () => {
			expect(instrumentType.type).toEqual('equity_option');
		});

		it('the "root" should be "AAPL"', () => {
			expect(instrumentType.root).toEqual('AAPL');
		});

		it('the "month" should be 5', () => {
			expect(instrumentType.month).toEqual(5);
		});

		it('the "day" should be 15', () => {
			expect(instrumentType.day).toEqual(15);
		});

		it('the "year" should be 2020', () => {
			expect(instrumentType.year).toEqual(2020);
		});

		it('the "strike" should be 250', () => {
			expect(instrumentType.strike).toEqual(250);
		});

		it('the "option_type" should be "put"', () => {
			expect(instrumentType.option_type).toEqual('put');
		});

		it('the "adjusted" flag should be true', () => {
			expect(instrumentType.adjusted).toEqual(false);
		});
	});

	describe('and the symbol is AAPL1|20200515|250.00P', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('AAPL1|20200515|250.00P');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "AAPL1|20200515|250.00P"', () => {
			expect(instrumentType.symbol).toEqual('AAPL1|20200515|250.00P');
		});

		it('the "type" should be "equity_option"', () => {
			expect(instrumentType.type).toEqual('equity_option');
		});

		it('the "root" should be "AAPL"', () => {
			expect(instrumentType.root).toEqual('AAPL');
		});

		it('the "month" should be 5', () => {
			expect(instrumentType.month).toEqual(5);
		});

		it('the "day" should be 15', () => {
			expect(instrumentType.day).toEqual(15);
		});

		it('the "year" should be 2020', () => {
			expect(instrumentType.year).toEqual(2020);
		});

		it('the "strike" should be 250', () => {
			expect(instrumentType.strike).toEqual(250);
		});

		it('the "option_type" should be "call"', () => {
			expect(instrumentType.option_type).toEqual('put');
		});

		it('the "adjusted" flag should be true', () => {
			expect(instrumentType.adjusted).toEqual(true);
		});
	});

	describe('and the symbol is HBM.TO|20220121|1.00C', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('HBM.TO|20220121|1.00C');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "HBM.TO|20220121|1.00C"', () => {
			expect(instrumentType.symbol).toEqual('HBM.TO|20220121|1.00C');
		});

		it('the "type" should be "equity_option"', () => {
			expect(instrumentType.type).toEqual('equity_option');
		});

		it('the "root" should be "HBM.TO"', () => {
			expect(instrumentType.root).toEqual('HBM.TO');
		});

		it('the "month" should be 1', () => {
			expect(instrumentType.month).toEqual(1);
		});

		it('the "day" should be 21', () => {
			expect(instrumentType.day).toEqual(21);
		});

		it('the "year" should be 2022', () => {
			expect(instrumentType.year).toEqual(2022);
		});

		it('the "strike" should be 1', () => {
			expect(instrumentType.strike).toEqual(1);
		});

		it('the "option_type" should be "call"', () => {
			expect(instrumentType.option_type).toEqual('call');
		});

		it('the "adjusted" flag should be true', () => {
			expect(instrumentType.adjusted).toEqual(false);
		});
	});

	describe('and the symbol is HBM2.TO|20220121|1.00C', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('HBM2.TO|20220121|1.00C');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "HBM2.TO|20220121|1.00C"', () => {
			expect(instrumentType.symbol).toEqual('HBM2.TO|20220121|1.00C');
		});

		it('the "type" should be "equity_option"', () => {
			expect(instrumentType.type).toEqual('equity_option');
		});

		it('the "root" should be "HBM.TO"', () => {
			expect(instrumentType.root).toEqual('HBM.TO');
		});

		it('the "month" should be 1', () => {
			expect(instrumentType.month).toEqual(1);
		});

		it('the "day" should be 21', () => {
			expect(instrumentType.day).toEqual(21);
		});

		it('the "year" should be 2022', () => {
			expect(instrumentType.year).toEqual(2022);
		});

		it('the "strike" should be 1', () => {
			expect(instrumentType.strike).toEqual(1);
		});

		it('the "option_type" should be "call"', () => {
			expect(instrumentType.option_type).toEqual('call');
		});

		it('the "adjusted" flag should be true', () => {
			expect(instrumentType.adjusted).toEqual(true);
		});
	});

	describe('and the symbol is BRK.B|20210205|170.00C', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('BRK.B|20210205|170.00C');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "BRK.B|20210205|170.00C', () => {
			expect(instrumentType.symbol).toEqual('BRK.B|20210205|170.00C');
		});

		it('the "type" should be "equity_option"', () => {
			expect(instrumentType.type).toEqual('equity_option');
		});

		it('the "root" should be "BRK.B"', () => {
			expect(instrumentType.root).toEqual('BRK.B');
		});

		it('the "month" should be 2', () => {
			expect(instrumentType.month).toEqual(2);
		});

		it('the "day" should be 5', () => {
			expect(instrumentType.day).toEqual(5);
		});

		it('the "year" should be 2021', () => {
			expect(instrumentType.year).toEqual(2021);
		});

		it('the "strike" should be 170', () => {
			expect(instrumentType.strike).toEqual(170);
		});

		it('the "option_type" should be "call"', () => {
			expect(instrumentType.option_type).toEqual('call');
		});

		it('the "adjusted" flag should be true', () => {
			expect(instrumentType.adjusted).toEqual(false);
		});
	});

	describe('and the symbol is BRK.B2|20210205|170.00C', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('BRK.B2|20210205|170.00C');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "BRK.B2|20210205|170.00C', () => {
			expect(instrumentType.symbol).toEqual('BRK.B2|20210205|170.00C');
		});

		it('the "type" should be "equity_option"', () => {
			expect(instrumentType.type).toEqual('equity_option');
		});

		it('the "root" should be "BRK.B"', () => {
			expect(instrumentType.root).toEqual('BRK.B');
		});

		it('the "month" should be 2', () => {
			expect(instrumentType.month).toEqual(2);
		});

		it('the "day" should be 5', () => {
			expect(instrumentType.day).toEqual(5);
		});

		it('the "year" should be 2021', () => {
			expect(instrumentType.year).toEqual(2021);
		});

		it('the "strike" should be 170', () => {
			expect(instrumentType.strike).toEqual(170);
		});

		it('the "option_type" should be "call"', () => {
			expect(instrumentType.option_type).toEqual('call');
		});

		it('the "adjusted" flag should be true', () => {
			expect(instrumentType.adjusted).toEqual(true);
		});
	});

	describe('and the symbol is $VIX|20200422|20.00WP', () => {
		let instrumentType;

		beforeEach(() => {
			instrumentType = SymbolParser.parseInstrumentType('$VIX|20200422|20.00WP');
		});

		it('the result should not be null', () => {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "$VIX|20200422|20.00WP"', () => {
			expect(instrumentType.symbol).toEqual('$VIX|20200422|20.00WP');
		});

		it('the "type" should be "equity_option"', () => {
			expect(instrumentType.type).toEqual('equity_option');
		});

		it('the "root" should be "$VIX"', () => {
			expect(instrumentType.root).toEqual('$VIX');
		});

		it('the "month" should be 4', () => {
			expect(instrumentType.month).toEqual(4);
		});

		it('the "day" should be 22', () => {
			expect(instrumentType.day).toEqual(22);
		});

		it('the "year" should be 2020', () => {
			expect(instrumentType.year).toEqual(2020);
		});

		it('the "strike" should be 20', () => {
			expect(instrumentType.strike).toEqual(20);
		});

		it('the "option_type" should be "put"', () => {
			expect(instrumentType.option_type).toEqual('put');
		});

		it('the "adjusted" flag should be false', () => {
			expect(instrumentType.adjusted).toEqual(false);
		});
	});
});

describe('When parsing a symbol for a futures contract', () => {
	describe('and the year is 2022', () => {
		let getFullYear;

		beforeEach(() => {
			getFullYear = Date.prototype.getFullYear;

			Date.prototype.getFullYear = () => { return 2022; };
		});

		it('the expiration year of "ZCN19" should parse to 2019', () => {
			expect(SymbolParser.parseInstrumentType('ZCN19').year).toEqual(2019);
		});

		it('the expiration year of "ZCN21" should parse to 2021', () => {
			expect(SymbolParser.parseInstrumentType('ZCN21').year).toEqual(2021);
		});

		it('the expiration year of "ZCN22" should parse to 2022', () => {
			expect(SymbolParser.parseInstrumentType('ZCN22').year).toEqual(2022);
		});

		it('the expiration year of "ZCN32" should parse to 2032', () => {
			expect(SymbolParser.parseInstrumentType('ZCN32').year).toEqual(2032);
		});

		it('the expiration year of "ZCN42" should parse to 2042', () => {
			expect(SymbolParser.parseInstrumentType('ZCN42').year).toEqual(2042);
		});

		it('the expiration year of "ZCN47" should parse to 2047', () => {
			expect(SymbolParser.parseInstrumentType('ZCN47').year).toEqual(2047);
		});

		it('the expiration year of "ZCN48" should parse to 1948', () => {
			expect(SymbolParser.parseInstrumentType('ZCN48').year).toEqual(1948);
		});

		it('the expiration year of "ZCN49" should parse to 1949', () => {
			expect(SymbolParser.parseInstrumentType('ZCN49').year).toEqual(1949);
		});

		it('the expiration year of "ZCN99" should parse to 1999', () => {
			expect(SymbolParser.parseInstrumentType('ZCM99').year).toEqual(1999);
		});

		afterEach(() => {
			Date.prototype.getFullYear = getFullYear;
		});
	});
});

describe('When parsing a symbol for a futures option', () => {
	describe('and the year is 2022', () => {
		let getFullYear;

		beforeEach(() => {
			getFullYear = Date.prototype.getFullYear;

			Date.prototype.getFullYear = () => { return 2022; };
		});

		it('the expiration year of "ZWK18465C" should parse to 2018', () => {
			expect(SymbolParser.parseInstrumentType('ZWK18465C').year).toEqual(2018);
		});

		it('the expiration year of "ZWK22465C" should parse to 2022', () => {
			expect(SymbolParser.parseInstrumentType('ZWK22465C').year).toEqual(2022);
		});

		it('the expiration year of "ZWK47465C" should parse to 2047', () => {
			expect(SymbolParser.parseInstrumentType('ZWK47465C').year).toEqual(2047);
		});

		it('the expiration year of "ZWK48465C" should parse to 2048', () => {
			expect(SymbolParser.parseInstrumentType('ZWK48465C').year).toEqual(1948);
		});

		afterEach(() => {
			Date.prototype.getFullYear = getFullYear;
		});
	});
});

describe('When checking to see if a symbol is a future', () => {
	it('the symbol "ES*1" should return true', () => {
		expect(SymbolParser.getIsFuture('ES*1')).toEqual(true);
	});

	it('the symbol "ESZ6" should return true', () => {
		expect(SymbolParser.getIsFuture('ESZ6')).toEqual(true);
	});

	it('the symbol "ESZ16" should return true', () => {
		expect(SymbolParser.getIsFuture('ESZ16')).toEqual(true);
	});

	it('the symbol "ESZ2016" should return true', () => {
		expect(SymbolParser.getIsFuture('ESZ2016')).toEqual(true);
	});

	it('the symbol "ESY00" should return true', () => {
		expect(SymbolParser.getIsFuture('ESY00')).toEqual(true);
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

	it('the symbol "^BTCUSDT" should return false', () => {
		expect(SymbolParser.getIsFuture('^BTCUSDT')).toEqual(false);
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

	it('the symbol "AAVSV00.PT" should return false', () => {
		expect(SymbolParser.getIsFuture('AAVSV00.PT')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(SymbolParser.getIsFuture('ZCPAUS.CM')).toEqual(false);
	});

	it('the symbol "SCB001.CP" should return false', () => {
		expect(SymbolParser.getIsFuture('SCB001.CP')).toEqual(false);
	});

	it('the symbol "AE030UBX.CS" should return false', () => {
		expect(SymbolParser.getIsFuture('AE030UBX.CS')).toEqual(false);
	});

	it('the symbol "AAPL|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsFuture('AAPL|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsFuture('AAPL1|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsFuture('HBM.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsFuture('HBM2.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsFuture('BRK.B|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsFuture('BRK.B2|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
		expect(SymbolParser.getIsFuture('$VIX|20200422|20.00WP')).toEqual(false);
	});

	it('the symbol "AL79MRM1.C3" should return false', () => {
		expect(SymbolParser.getIsFuture('AL79MRM1.C3')).toEqual(false);
	});

	it('the symbol "C3:AL79MRM1" should return false', () => {
		expect(SymbolParser.getIsFuture('C3:AL79MRM1')).toEqual(false);
	});

	it('the symbol "VIC400.CF" should return false', () => {
		expect(SymbolParser.getIsFuture('VIC400.CF')).toEqual(false);
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

	it('the symbol "NG*13" should return false', () => {
		expect(SymbolParser.getIsConcrete('NG*13')).toEqual(false);
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

	it('the symbol "NG*13" should return true', () => {
		expect(SymbolParser.getIsReference('NG*13')).toEqual(true);
	});
});

describe('When checking to see if a symbol is a "cash" future', () => {
	it('the symbol "ESY00" should return false', () => {
		expect(SymbolParser.getIsCash('ESY00')).toEqual(true);
	});

	it('the symbol "ESZ6" should return false', () => {
		expect(SymbolParser.getIsCash('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', () => {
		expect(SymbolParser.getIsCash('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', () => {
		expect(SymbolParser.getIsCash('ESZ2016')).toEqual(false);
	});

	it('the symbol "ES*0" should return false', () => {
		expect(SymbolParser.getIsCash('ES*0')).toEqual(false);
	});

	it('the symbol "ES*1" should return false', () => {
		expect(SymbolParser.getIsCash('ES*1')).toEqual(false);
	});

	it('the symbol "NG*13" should return false', () => {
		expect(SymbolParser.getIsCash('NG*13')).toEqual(false);
	});
});

describe('When checking to see if a symbol is sector', () => {
	it('the symbol "ES*1" should return false', () => {
		expect(SymbolParser.getIsSector('ES*1')).toEqual(false);
	});

	it('the symbol "NG*13" should return false', () => {
		expect(SymbolParser.getIsSector('NG*13')).toEqual(false);
	});

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

	it('the symbol "^BTCUSDT" should return false', () => {
		expect(SymbolParser.getIsSector('^BTCUSDT')).toEqual(false);
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

	it('the symbol "AAVSV00.PT" should return false', () => {
		expect(SymbolParser.getIsSector('AAVSV00.PT')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(SymbolParser.getIsSector('ZCPAUS.CM')).toEqual(false);
	});

	it('the symbol "SCB001.CP" should return false', () => {
		expect(SymbolParser.getIsSector('SCB001.CP')).toEqual(false);
	});

	it('the symbol "AE030UBX.CS" should return false', () => {
		expect(SymbolParser.getIsSector('AE030UBX.CS')).toEqual(false);
	});

	it('the symbol "AAPL|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsSector('AAPL|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsSector('AAPL1|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsSector('HBM.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsSector('HBM2.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsSector('BRK.B|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsSector('BRK.B2|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
		expect(SymbolParser.getIsSector('$VIX|20200422|20.00WP')).toEqual(false);
	});

	it('the symbol "AL79MRM1.C3" should return false', () => {
		expect(SymbolParser.getIsSector('AL79MRM1.C3')).toEqual(false);
	});

	it('the symbol "C3:AL79MRM1" should return false', () => {
		expect(SymbolParser.getIsSector('C3:AL79MRM1')).toEqual(false);
	});

	it('the symbol "VIC400.CF" should return false', () => {
		expect(SymbolParser.getIsSector('VIC400.CF')).toEqual(false);
	});
});

describe('When checking to see if a symbol is forex', () => {
	it('the symbol "ES*1" should return false', () => {
		expect(SymbolParser.getIsForex('ES*1')).toEqual(false);
	});

	it('the symbol "NG*13" should return false', () => {
		expect(SymbolParser.getIsForex('NG*13')).toEqual(false);
	});

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

	it('the symbol "^BTCUSDT" should return false', () => {
		expect(SymbolParser.getIsForex('^BTCUSDT')).toEqual(false);
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

	it('the symbol "AAVSV00.PT" should return false', () => {
		expect(SymbolParser.getIsForex('AAVSV00.PT')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(SymbolParser.getIsForex('ZCPAUS.CM')).toEqual(false);
	});

	it('the symbol "SCB001.CP" should return false', () => {
		expect(SymbolParser.getIsForex('SCB001.CP')).toEqual(false);
	});

	it('the symbol "AE030UBX.CS" should return false', () => {
		expect(SymbolParser.getIsForex('AE030UBX.CS')).toEqual(false);
	});

	it('the symbol "AAPL|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsForex('AAPL|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsForex('AAPL1|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsForex('HBM.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsForex('HBM2.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsForex('BRK.B|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsForex('BRK.B2|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
		expect(SymbolParser.getIsForex('$VIX|20200422|20.00WP')).toEqual(false);
	});

	it('the symbol "AL79MRM1.C3" should return false', () => {
		expect(SymbolParser.getIsForex('AL79MRM1.C3')).toEqual(false);
	});

	it('the symbol "C3:AL79MRM1" should return false', () => {
		expect(SymbolParser.getIsForex('C3:AL79MRM1')).toEqual(false);
	});

	it('the symbol "VIC400.CF" should return false', () => {
		expect(SymbolParser.getIsForex('VIC400.CF')).toEqual(false);
	});
});

describe('When checking to see if a symbol is crypto', () => {
	it('the symbol "ES*1" should return false', () => {
		expect(SymbolParser.getIsCrypto('ES*1')).toEqual(false);
	});

	it('the symbol "NG*13" should return false', () => {
		expect(SymbolParser.getIsCrypto('NG*13')).toEqual(false);
	});

	it('the symbol "ESZ6" should return false', () => {
		expect(SymbolParser.getIsCrypto('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', () => {
		expect(SymbolParser.getIsCrypto('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', () => {
		expect(SymbolParser.getIsCrypto('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', () => {
		expect(SymbolParser.getIsCrypto('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', () => {
		expect(SymbolParser.getIsCrypto('O!H7')).toEqual(false);
	});

	it('the symbol "O!H17" should return false', () => {
		expect(SymbolParser.getIsCrypto('O!H17')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', () => {
		expect(SymbolParser.getIsCrypto('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', () => {
		expect(SymbolParser.getIsCrypto('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return true', () => {
		expect(SymbolParser.getIsCrypto('^EURUSD')).toEqual(true); // should return false ...
	});

	it('the symbol "^BTCUSDT" should return true', () => {
		expect(SymbolParser.getIsCrypto('^BTCUSDT')).toEqual(true);
	});

	it('the symbol "-001A" should return false', () => {
		expect(SymbolParser.getIsCrypto('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', () => {
		expect(SymbolParser.getIsCrypto('$DOWI')).toEqual(false);
	});

	it('the symbol "$S1GE" should return false', () => {
		expect(SymbolParser.getIsCrypto('$S1GE')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
		expect(SymbolParser.getIsCrypto('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});

	it('the symbol "ESZ2660Q" should return false', () => {
		expect(SymbolParser.getIsCrypto('ESZ2660Q')).toEqual(false);
	});

	it('the symbol "ZWH9|470C" should return false', () => {
		expect(SymbolParser.getIsCrypto('ZWH9|470C')).toEqual(false);
	});

	it('the symbol "BB1F8|12050C" should return false', () => {
		expect(SymbolParser.getIsCrypto('BB1F8|12050C')).toEqual(false);
	});

	it('the symbol "ZWK18465C" should return false', () => {
		expect(SymbolParser.getIsCrypto('ZWK18465C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00C" should return false', () => {
		expect(SymbolParser.getIsCrypto('PLATTS:AAVSV00C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00" should return false', () => {
		expect(SymbolParser.getIsCrypto('PLATTS:AAVSV00')).toEqual(false);
	});

	it('the symbol "AAVSV00.PT" should return false', () => {
		expect(SymbolParser.getIsCrypto('AAVSV00.PT')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(SymbolParser.getIsCrypto('ZCPAUS.CM')).toEqual(false);
	});

	it('the symbol "SCB001.CP" should return false', () => {
		expect(SymbolParser.getIsCrypto('SCB001.CP')).toEqual(false);
	});

	it('the symbol "AE030UBX.CS" should return false', () => {
		expect(SymbolParser.getIsCrypto('AE030UBX.CS')).toEqual(false);
	});

	it('the symbol "AAPL|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsCrypto('AAPL|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsCrypto('AAPL1|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsCrypto('HBM.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsCrypto('HBM2.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsCrypto('BRK.B|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsCrypto('BRK.B2|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
		expect(SymbolParser.getIsCrypto('$VIX|20200422|20.00WP')).toEqual(false);
	});

	it('the symbol "AL79MRM1.C3" should return false', () => {
		expect(SymbolParser.getIsCrypto('AL79MRM1.C3')).toEqual(false);
	});

	it('the symbol "C3:AL79MRM1" should return false', () => {
		expect(SymbolParser.getIsCrypto('C3:AL79MRM1')).toEqual(false);
	});

	it('the symbol "VIC400.CF" should return false', () => {
		expect(SymbolParser.getIsCrypto('VIC400.CF')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a futures spread', () => {
	it('the symbol "ES*1" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('ES*1')).toEqual(false);
	});

	it('the symbol "NG*13" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('NG*13')).toEqual(false);
	});

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

	it('the symbol "^BTCUSDT" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('^BTCUSDT')).toEqual(false);
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

	it('the symbol "AAVSV00.PT" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('AAVSV00.PT')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('ZCPAUS.CM')).toEqual(false);
	});

	it('the symbol "SCB001.CP" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('SCB001.CP')).toEqual(false);
	});

	it('the symbol "AE030UBX.CS" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('AE030UBX.CS')).toEqual(false);
	});

	it('the symbol "AAPL|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('AAPL|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('AAPL1|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('HBM.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('HBM2.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('BRK.B|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('BRK.B2|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('$VIX|20200422|20.00WP')).toEqual(false);
	});

	it('the symbol "AL79MRM1.C3" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('AL79MRM1.C3')).toEqual(false);
	});

	it('the symbol "C3:AL79MRM1" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('C3:AL79MRM1')).toEqual(false);
	});

	it('the symbol "VIC400.CF" should return false', () => {
		expect(SymbolParser.getIsFutureSpread('VIC400.CF')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a futures option', () => {
	it('the symbol "ES*1" should return false', () => {
		expect(SymbolParser.getIsFutureOption('ES*1')).toEqual(false);
	});

	it('the symbol "NG*13" should return false', () => {
		expect(SymbolParser.getIsFutureOption('NG*13')).toEqual(false);
	});

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

	it('the symbol "^BTCUSDT" should return false', () => {
		expect(SymbolParser.getIsFutureOption('^BTCUSDT')).toEqual(false);
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

	it('the symbol "AAVSV00.PT" should return false', () => {
		expect(SymbolParser.getIsFutureOption('AAVSV00.PT')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(SymbolParser.getIsFutureOption('ZCPAUS.CM')).toEqual(false);
	});

	it('the symbol "SCB001.CP" should return false', () => {
		expect(SymbolParser.getIsFutureOption('SCB001.CP')).toEqual(false);
	});

	it('the symbol "AE030UBX.CS" should return false', () => {
		expect(SymbolParser.getIsFutureOption('AE030UBX.CS')).toEqual(false);
	});

	it('the symbol "AAPL|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsFutureOption('AAPL|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsFutureOption('AAPL1|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsFutureOption('HBM.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsFutureOption('HBM2.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsFutureOption('BRK.B|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsFutureOption('BRK.B2|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
		expect(SymbolParser.getIsFutureOption('$VIX|20200422|20.00WP')).toEqual(false);
	});

	it('the symbol "AL79MRM1.C3" should return false', () => {
		expect(SymbolParser.getIsFutureOption('AL79MRM1.C3')).toEqual(false);
	});

	it('the symbol "C3:AL79MRM1" should return false', () => {
		expect(SymbolParser.getIsFutureOption('C3:AL79MRM1')).toEqual(false);
	});

	it('the symbol "VIC400.CF" should return false', () => {
		expect(SymbolParser.getIsFutureOption('VIC400.CF')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a cmdty-branded instrument', () => {
	it('the symbol "ES*1" should return false', () => {
		expect(SymbolParser.getIsCmdty('ES*1')).toEqual(false);
	});

	it('the symbol "NG*13" should return false', () => {
		expect(SymbolParser.getIsCmdty('NG*13')).toEqual(false);
	});

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

	it('the symbol "^BTCUSDT" should return false', () => {
		expect(SymbolParser.getIsCmdty('^BTCUSDT')).toEqual(false);
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

	it('the symbol "AAVSV00.PT" should return false', () => {
		expect(SymbolParser.getIsCmdty('AAVSV00.PT')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return true', () => {
		expect(SymbolParser.getIsCmdty('ZCPAUS.CM')).toEqual(true);
	});

	it('the symbol "SCB001.CP" should return true', () => {
		expect(SymbolParser.getIsCmdty('SCB001.CP')).toEqual(true);
	});

	it('the symbol "AE030UBX.CS" should return true', () => {
		expect(SymbolParser.getIsCmdty('AE030UBX.CS')).toEqual(true);
	});

	it('the symbol "AAPL|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsCmdty('AAPL|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsCmdty('AAPL1|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsCmdty('HBM.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsCmdty('HBM2.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsCmdty('BRK.B|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsCmdty('BRK.B2|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
		expect(SymbolParser.getIsCmdty('$VIX|20200422|20.00WP')).toEqual(false);
	});

	it('the symbol "AL79MRM1.C3" should return false', () => {
		expect(SymbolParser.getIsCmdty('AL79MRM1.C3')).toEqual(false);
	});

	it('the symbol "C3:AL79MRM1" should return false', () => {
		expect(SymbolParser.getIsCmdty('C3:AL79MRM1')).toEqual(false);
	});

	it('the symbol "VIC400.CF" should return false', () => {
		expect(SymbolParser.getIsCmdty('VIC400.CF')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a cmdtyStats instrument', () => {
	it('the symbol "ES*1" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('ES*1')).toEqual(false);
	});

	it('the symbol "NG*13" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('NG*13')).toEqual(false);
	});

	it('the symbol "ESZ6" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('O!H7')).toEqual(false);
	});

	it('the symbol "O!H17" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('O!H17')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('^EURUSD')).toEqual(false);
	});

	it('the symbol "^BTCUSDT" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('^BTCUSDT')).toEqual(false);
	});

	it('the symbol "-001A" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('$DOWI')).toEqual(false);
	});

	it('the symbol "$S1GE" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('$S1GE')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});

	it('the symbol "ESZ2660Q" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('ESZ2660Q')).toEqual(false);
	});

	it('the symbol "ZWH9|470C" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('ZWH9|470C')).toEqual(false);
	});

	it('the symbol "BB1F8|12050C" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('BB1F8|12050C')).toEqual(false);
	});

	it('the symbol "ZWK18465C" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('ZWK18465C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00C" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('PLATTS:AAVSV00C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('PLATTS:AAVSV00')).toEqual(false);
	});

	it('the symbol "AAVSV00.PT" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('AAVSV00.PT')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('ZCPAUS.CM')).toEqual(false);
	});

	it('the symbol "SCB001.CP" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('SCB001.CP')).toEqual(false);
	});

	it('the symbol "AE030UBX.CS" should return true', () => {
		expect(SymbolParser.getIsCmdtyStats('AE030UBX.CS')).toEqual(true);
	});

	it('the symbol "AAPL|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('AAPL|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('AAPL1|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('HBM.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('HBM2.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('BRK.B|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('BRK.B2|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('$VIX|20200422|20.00WP')).toEqual(false);
	});

	it('the symbol "AL79MRM1.C3" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('AL79MRM1.C3')).toEqual(false);
	});

	it('the symbol "C3:AL79MRM1" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('C3:AL79MRM1')).toEqual(false);
	});

	it('the symbol "VIC400.CF" should return false', () => {
		expect(SymbolParser.getIsCmdtyStats('VIC400.CF')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a equity option', () => {
	it('the symbol "ES*1" should return false', () => {
		expect(SymbolParser.getIsEquityOption('ES*1')).toEqual(false);
	});

	it('the symbol "NG*13" should return false', () => {
		expect(SymbolParser.getIsEquityOption('NG*13')).toEqual(false);
	});

	it('the symbol "ESZ6" should return false', () => {
		expect(SymbolParser.getIsEquityOption('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', () => {
		expect(SymbolParser.getIsEquityOption('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', () => {
		expect(SymbolParser.getIsEquityOption('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', () => {
		expect(SymbolParser.getIsEquityOption('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', () => {
		expect(SymbolParser.getIsEquityOption('O!H7')).toEqual(false);
	});

	it('the symbol "O!H17" should return false', () => {
		expect(SymbolParser.getIsEquityOption('O!H17')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', () => {
		expect(SymbolParser.getIsEquityOption('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', () => {
		expect(SymbolParser.getIsEquityOption('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', () => {
		expect(SymbolParser.getIsEquityOption('^EURUSD')).toEqual(false);
	});

	it('the symbol "^BTCUSDT" should return false', () => {
		expect(SymbolParser.getIsEquityOption('^BTCUSDT')).toEqual(false);
	});

	it('the symbol "-001A" should return false', () => {
		expect(SymbolParser.getIsEquityOption('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', () => {
		expect(SymbolParser.getIsEquityOption('$DOWI')).toEqual(false);
	});

	it('the symbol "$S1GE" should return false', () => {
		expect(SymbolParser.getIsEquityOption('$S1GE')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
		expect(SymbolParser.getIsEquityOption('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});

	it('the symbol "ESZ2660Q" should return false', () => {
		expect(SymbolParser.getIsEquityOption('ESZ2660Q')).toEqual(false);
	});

	it('the symbol "ZWH9|470C" should return false', () => {
		expect(SymbolParser.getIsEquityOption('ZWH9|470C')).toEqual(false);
	});

	it('the symbol "BB1F8|12050C" should return false', () => {
		expect(SymbolParser.getIsEquityOption('BB1F8|12050C')).toEqual(false);
	});

	it('the symbol "ZWK18465C" should return false', () => {
		expect(SymbolParser.getIsEquityOption('ZWK18465C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00C" should return false', () => {
		expect(SymbolParser.getIsEquityOption('PLATTS:AAVSV00C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00" should return false', () => {
		expect(SymbolParser.getIsEquityOption('PLATTS:AAVSV00')).toEqual(false);
	});

	it('the symbol "AAVSV00.PT" should return false', () => {
		expect(SymbolParser.getIsEquityOption('AAVSV00.PT')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(SymbolParser.getIsEquityOption('ZCPAUS.CM')).toEqual(false);
	});

	it('the symbol "SCB001.CP" should return false', () => {
		expect(SymbolParser.getIsEquityOption('SCB001.CP')).toEqual(false);
	});

	it('the symbol "AE030UBX.CS" should return false', () => {
		expect(SymbolParser.getIsEquityOption('AE030UBX.CS')).toEqual(false);
	});

	it('the symbol "AAPL|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsEquityOption('AAPL|20200515|250.00P')).toEqual(true);
	});

	it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsEquityOption('AAPL1|20200515|250.00P')).toEqual(true);
	});

	it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsEquityOption('HBM.TO|20220121|1.00C')).toEqual(true);
	});

	it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsEquityOption('HBM2.TO|20220121|1.00C')).toEqual(true);
	});

	it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsEquityOption('BRK.B|20210205|170.00C')).toEqual(true);
	});

	it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsEquityOption('BRK.B2|20210205|170.00C')).toEqual(true);
	});

	it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
		expect(SymbolParser.getIsEquityOption('$VIX|20200422|20.00WP')).toEqual(true);
	});

	it('the symbol "AL79MRM1.C3" should return false', () => {
		expect(SymbolParser.getIsEquityOption('AL79MRM1.C3')).toEqual(false);
	});

	it('the symbol "C3:AL79MRM1" should return false', () => {
		expect(SymbolParser.getIsEquityOption('C3:AL79MRM1')).toEqual(false);
	});

	it('the symbol "VIC400.CF" should return false', () => {
		expect(SymbolParser.getIsEquityOption('VIC400.CF')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a C3 instrument', () => {
	it('the symbol "ES*1" should return false', () => {
		expect(SymbolParser.getIsC3('ES*1')).toEqual(false);
	});

	it('the symbol "NG*13" should return false', () => {
		expect(SymbolParser.getIsC3('NG*13')).toEqual(false);
	});

	it('the symbol "ESZ6" should return false', () => {
		expect(SymbolParser.getIsC3('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', () => {
		expect(SymbolParser.getIsC3('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', () => {
		expect(SymbolParser.getIsC3('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', () => {
		expect(SymbolParser.getIsC3('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', () => {
		expect(SymbolParser.getIsC3('O!H7')).toEqual(false);
	});

	it('the symbol "O!H17" should return false', () => {
		expect(SymbolParser.getIsC3('O!H17')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', () => {
		expect(SymbolParser.getIsC3('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', () => {
		expect(SymbolParser.getIsC3('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', () => {
		expect(SymbolParser.getIsC3('^EURUSD')).toEqual(false);
	});

	it('the symbol "^BTCUSDT" should return false', () => {
		expect(SymbolParser.getIsC3('^BTCUSDT')).toEqual(false);
	});

	it('the symbol "-001A" should return false', () => {
		expect(SymbolParser.getIsC3('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', () => {
		expect(SymbolParser.getIsC3('$DOWI')).toEqual(false);
	});

	it('the symbol "$S1GE" should return false', () => {
		expect(SymbolParser.getIsC3('$S1GE')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
		expect(SymbolParser.getIsC3('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});

	it('the symbol "ESZ2660Q" should return false', () => {
		expect(SymbolParser.getIsC3('ESZ2660Q')).toEqual(false);
	});

	it('the symbol "ZWH9|470C" should return false', () => {
		expect(SymbolParser.getIsC3('ZWH9|470C')).toEqual(false);
	});

	it('the symbol "BB1F8|12050C" should return false', () => {
		expect(SymbolParser.getIsC3('BB1F8|12050C')).toEqual(false);
	});

	it('the symbol "ZWK18465C" should return false', () => {
		expect(SymbolParser.getIsC3('ZWK18465C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00C" should return false', () => {
		expect(SymbolParser.getIsC3('PLATTS:AAVSV00C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00" should return false', () => {
		expect(SymbolParser.getIsC3('PLATTS:AAVSV00')).toEqual(false);
	});

	it('the symbol "AAVSV00.PT" should return false', () => {
		expect(SymbolParser.getIsC3('AAVSV00.PT')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(SymbolParser.getIsC3('ZCPAUS.CM')).toEqual(false);
	});

	it('the symbol "SCB001.CP" should return false', () => {
		expect(SymbolParser.getIsC3('SCB001.CP')).toEqual(false);
	});

	it('the symbol "AE030UBX.CS" should return false', () => {
		expect(SymbolParser.getIsC3('AE030UBX.CS')).toEqual(false);
	});

	it('the symbol "AAPL|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsC3('AAPL|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsC3('AAPL1|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsC3('HBM.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsC3('HBM2.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsC3('BRK.B|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsC3('BRK.B2|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
		expect(SymbolParser.getIsC3('$VIX|20200422|20.00WP')).toEqual(false);
	});

	it('the symbol "AL79MRM1.C3" should return true', () => {
		expect(SymbolParser.getIsC3('AL79MRM1.C3')).toEqual(true);
	});

	it('the symbol "C3:AL79MRM1" should return true', () => {
		expect(SymbolParser.getIsC3('C3:AL79MRM1')).toEqual(true);
	});

	it('the symbol "VIC400.CF" should return false', () => {
		expect(SymbolParser.getIsC3('VIC400.CF')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a Platts instrument', () => {
	it('the symbol "ES*1" should return false', () => {
		expect(SymbolParser.getIsPlatts('ES*1')).toEqual(false);
	});

	it('the symbol "ESZ6" should return false', () => {
		expect(SymbolParser.getIsPlatts('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', () => {
		expect(SymbolParser.getIsPlatts('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', () => {
		expect(SymbolParser.getIsPlatts('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', () => {
		expect(SymbolParser.getIsPlatts('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', () => {
		expect(SymbolParser.getIsPlatts('O!H7')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', () => {
		expect(SymbolParser.getIsPlatts('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', () => {
		expect(SymbolParser.getIsPlatts('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', () => {
		expect(SymbolParser.getIsPlatts('^EURUSD')).toEqual(false);
	});

	it('the symbol "^BTCUSDT" should return false', () => {
		expect(SymbolParser.getIsPlatts('^BTCUSDT')).toEqual(false);
	});

	it('the symbol "-001A" should return false', () => {
		expect(SymbolParser.getIsPlatts('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', () => {
		expect(SymbolParser.getIsPlatts('$DOWI')).toEqual(false);
	});

	it('the symbol "$SG1E" should return false', () => {
		expect(SymbolParser.getIsPlatts('$SG1E')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
		expect(SymbolParser.getIsPlatts('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});

	it('the symbol "ESZ2660Q" should return false', () => {
		expect(SymbolParser.getIsPlatts('ESZ2660Q')).toEqual(false);
	});

	it('the symbol "ZWH9|470C" should return false', () => {
		expect(SymbolParser.getIsPlatts('ZWH9|470C')).toEqual(false);
	});

	it('the symbol "BB1F8|12050C" should return false', () => {
		expect(SymbolParser.getIsPlatts('BB1F8|12050C')).toEqual(false);
	});

	it('the symbol "ZWK18465C" should return false', () => {
		expect(SymbolParser.getIsPlatts('ZWK18465C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00C" should return true', () => {
		expect(SymbolParser.getIsPlatts('PLATTS:AAVSV00C')).toEqual(true);
	});

	it('the symbol "PLATTS:AAVSV00" should return true', () => {
		expect(SymbolParser.getIsPlatts('PLATTS:AAVSV00')).toEqual(true);
	});

	it('the symbol "AAVSV00.PT" should return true', () => {
		expect(SymbolParser.getIsPlatts('AAVSV00.PT')).toEqual(true);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(SymbolParser.getIsPlatts('ZCPAUS.CM')).toEqual(false);
	});

	it('the symbol "SCB001.CP" should return false', () => {
		expect(SymbolParser.getIsPlatts('SCB001.CP')).toEqual(false);
	});

	it('the symbol "AE030UBX.CS" should return false', () => {
		expect(SymbolParser.getIsPlatts('AE030UBX.CS')).toEqual(false);
	});

	it('the symbol "AAPL|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsPlatts('AAPL|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsPlatts('AAPL1|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsPlatts('HBM.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsPlatts('HBM2.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsPlatts('BRK.B|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsPlatts('BRK.B2|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
		expect(SymbolParser.getIsPlatts('$VIX|20200422|20.00WP')).toEqual(false);
	});

	it('the symbol "AL79MRM1.C3" should return false', () => {
		expect(SymbolParser.getIsPlatts('AL79MRM1.C3')).toEqual(false);
	});

	it('the symbol "C3:AL79MRM1" should return false', () => {
		expect(SymbolParser.getIsPlatts('C3:AL79MRM1')).toEqual(false);
	});

	it('the symbol "VIC400.CF" should return false', () => {
		expect(SymbolParser.getIsPlatts('VIC400.CF')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a Canadian mutual fund', () => {
	it('the symbol "ES*1" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('ES*1')).toEqual(false);
	});

	it('the symbol "ESZ6" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('O!H7')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('^EURUSD')).toEqual(false);
	});

	it('the symbol "^BTCUSDT" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('^BTCUSDT')).toEqual(false);
	});

	it('the symbol "-001A" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('$DOWI')).toEqual(false);
	});

	it('the symbol "$SG1E" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('$SG1E')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});

	it('the symbol "ESZ2660Q" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('ESZ2660Q')).toEqual(false);
	});

	it('the symbol "ZWH9|470C" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('ZWH9|470C')).toEqual(false);
	});

	it('the symbol "BB1F8|12050C" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('BB1F8|12050C')).toEqual(false);
	});

	it('the symbol "ZWK18465C" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('ZWK18465C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00C" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('PLATTS:AAVSV00C')).toEqual(false);
	});

	it('the symbol "PLATTS:AAVSV00" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('PLATTS:AAVSV00')).toEqual(false);
	});

	it('the symbol "AAVSV00.PT" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('AAVSV00.PT')).toEqual(false);
	});

	it('the symbol "ZCPAUS.CM" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('ZCPAUS.CM')).toEqual(false);
	});

	it('the symbol "SCB001.CP" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('SCB001.CP')).toEqual(false);
	});

	it('the symbol "AE030UBX.CS" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('AE030UBX.CS')).toEqual(false);
	});

	it('the symbol "AAPL|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsPlatts('AAPL|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "AAPL1|20200515|250.00P" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('AAPL1|20200515|250.00P')).toEqual(false);
	});

	it('the symbol "HBM.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('HBM.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "HBM2.TO|20220121|1.00C" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('HBM2.TO|20220121|1.00C')).toEqual(false);
	});

	it('the symbol "BRK.B|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('BRK.B|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "BRK.B2|20210205|170.00C" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('BRK.B2|20210205|170.00C')).toEqual(false);
	});

	it('the symbol "$VIX|20200422|20.00WP" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('$VIX|20200422|20.00WP')).toEqual(false);
	});

	it('the symbol "AL79MRM1.C3" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('AL79MRM1.C3')).toEqual(false);
	});

	it('the symbol "C3:AL79MRM1" should return false', () => {
		expect(SymbolParser.getIsCanadianFund('C3:AL79MRM1')).toEqual(false);
	});

	it('the symbol "VIC400.CF" should return true', () => {
		expect(SymbolParser.getIsCanadianFund('VIC400.CF')).toEqual(true);
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

describe('When checking to see if a symbol is a grain bids instrument', () => {
	it('the symbol "IBM" should return false', () => {
		expect(SymbolParser.getIsGrainBid('IBM')).toEqual(false);
	});

	it('the symbol "ZCPN22-4574-5387.CM" should return true', () => {
		expect(SymbolParser.getIsGrainBid('ZCPN22-4574-5387.CM')).toEqual(true);
	});
});

describe('When checking to see if a symbol is pit-traded', () => {
	it('the symbol "IBM" (with the name "International Business Machines") should return false', () => {
		expect(SymbolParser.getIsPit('IBM', 'International Business Machines')).toEqual(false);
	});

	it('the symbol "ADU08" (with the name "Australian Dollar(P)") should return true', () => {
		expect(SymbolParser.getIsPit('ADU08', 'Australian Dollar(P)')).toEqual(true);
	});

	it('the symbol "BRQ17" (with the name "Brazilian Real (Pit)") should return true', () => {
		expect(SymbolParser.getIsPit('BRQ17', 'Brazilian Real (Pit)')).toEqual(true);
	});

	it('the symbol "CK21" (with the name "Corn (Pit) May 2021") should return true', () => {
		expect(SymbolParser.getIsPit('CK21', 'Corn (Pit) May 2021')).toEqual(true);
	});
});

describe('When checking the display format for the symbol', () => {
	it('The symbol "HPIUSA.RP" should not be formatted as a percent', () => {
		expect(SymbolParser.displayUsingPercent('HPIUSA.RP')).toEqual(false);
	});

	it('The symbol "UERMNTUS.RT" should be formatted as a percent', () => {
		expect(SymbolParser.displayUsingPercent('UERMNTUS.RT')).toEqual(true);
	});
});

describe('When getting a producer symbol', () => {
	describe('When the year is unimportant', () => {
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

		it('NG*13 should map to NG*13', () => {
			expect(SymbolParser.getProducerSymbol('NG*13')).toEqual('NG*13');
		});

		it('$DOWI should map to $DOWI', () => {
			expect(SymbolParser.getProducerSymbol('$DOWI')).toEqual('$DOWI');
		});

		it('^EURUSD should map to ^EURUSD', () => {
			expect(SymbolParser.getProducerSymbol('^EURUSD')).toEqual('^EURUSD');
		});

		it('^BTCUSDT should map to ^BTCUSDT', () => {
			expect(SymbolParser.getProducerSymbol('^BTCUSDT')).toEqual('^BTCUSDT');
		});

		it('ZWK465C should map to ZWK465C', () => {
			expect(SymbolParser.getProducerSymbol('ZWK465C')).toEqual('ZWK465C');
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

		it('PLATTS:AAVSV00 should map to AAVSV00.PT', () => {
			expect(SymbolParser.getProducerSymbol('PLATTS:AAVSV00')).toEqual('AAVSV00.PT');
		});

		it('AAVSV00.PT should map to AAVSV00.PT', () => {
			expect(SymbolParser.getProducerSymbol('AAVSV00.PT')).toEqual('AAVSV00.PT');
		});

		it('VIC400.CF should map to VIC400.CF', () => {
			expect(SymbolParser.getProducerSymbol('VIC400.CF')).toEqual('VIC400.CF');
		});

		it('AAPL|20200515|250.00P should map to AAPL|20200515|250.00P', () => {
			expect(SymbolParser.getProducerSymbol('AAPL|20200515|250.00P')).toEqual('AAPL|20200515|250.00P');
		});
	});

	describe('When the year is unspecified', () => {
		describe('When testing ZWK29465C in 2021', () => {
			let producerSymbol;

			beforeEach(() => {
				let getFullYear = Date.prototype.getFullYear;

				Date.prototype.getFullYear = () => { return 2021; };

				producerSymbol = SymbolParser.getProducerSymbol('ZWK29465C');

				Date.prototype.getFullYear = getFullYear;
			});

			it('ZWK29465C should map to ZWK465K', () =>{
				expect(producerSymbol).toEqual('ZWK465K');
			});
		});

		describe('When testing ZWK9|465P in 2021', () => {
			let producerSymbol;

			beforeEach(() => {
				let getFullYear = Date.prototype.getFullYear;

				Date.prototype.getFullYear = () => { return 2021; };

				producerSymbol = SymbolParser.getProducerSymbol('ZWK9|465P');

				Date.prototype.getFullYear = getFullYear;
			});

			it('ZWK9|465P should map to ZWK465X', () =>{
				expect(producerSymbol).toEqual('ZWK465X');
			});
		});

		describe('When testing ZCN22|800P in 2022', () => {
			let producerSymbol;

			beforeEach(() => {
				let getFullYear = Date.prototype.getFullYear;

				Date.prototype.getFullYear = () => { return 2022; };

				producerSymbol = SymbolParser.getProducerSymbol('ZCN22|800P');

				Date.prototype.getFullYear = getFullYear;
			});

			it('ZCN22|800P should map to ZCN800P', () =>{
				expect(producerSymbol).toEqual('ZCN800P');
			});
		});

		describe('When testing ZCN2|800P in 2022', () => {
			let producerSymbol;

			beforeEach(() => {
				let getFullYear = Date.prototype.getFullYear;

				Date.prototype.getFullYear = () => { return 2022; };

				producerSymbol = SymbolParser.getProducerSymbol('ZCN2|800P');

				Date.prototype.getFullYear = getFullYear;
			});

			it('ZCN2|800P should map to ZCN800P', () =>{
				expect(producerSymbol).toEqual('ZCN800P');
			});
		});
	});
});

describe('When checking to see if a symbol is expired', () => {
	it('TSLA should not be expired', () => {
		expect(SymbolParser.getIsExpired('TSLA')).toEqual(false);
	});

	it('ZC*0 should not be expired', () => {
		expect(SymbolParser.getIsExpired('ZC*0')).toEqual(false);
	});

	it('SPY00 should not be expired', () => {
		expect(SymbolParser.getIsExpired('SPY00')).toEqual(false);
	});
});

describe('When getting an explicit futures symbol', () => {
	it('TSLA should map to a null value', () => {
		expect(SymbolParser.getFuturesExplicitFormat('TSLA')).toEqual(null);
	});

	it('ZC*0 should map to a null value', () => {
		expect(SymbolParser.getFuturesExplicitFormat('ZC*0')).toEqual(null);
	});

	it('ZC*1 should map to a null value', () => {
		expect(SymbolParser.getFuturesExplicitFormat('ZC*1')).toEqual(null);
	});

	it('ZCZ21 should map to ZCZ21', () => {
		expect(SymbolParser.getFuturesExplicitFormat('ZCZ21')).toEqual('ZCZ21');
	});

	it('ZCZ0 should map to ZCZ21', () => {
		expect(SymbolParser.getFuturesExplicitFormat('ZCZ0')).toEqual('ZCZ30');
	});

	it('ZCZ6 should map to ZCZ26', () => {
		expect(SymbolParser.getFuturesExplicitFormat('ZCZ6')).toEqual('ZCZ26');
	});
});

describe('When parsing the expiration year for a futures contract', () => {
	describe('and the current year is 2022', () => {
		let getFullYear = null;

		beforeEach(() => {
			getFullYear = Date.prototype.getFullYear;
			Date.prototype.getFullYear = () => {
				return 2022;
			};
		});

		it('The string "2" should resolve to 2022 (in month "Z")', () => {
			expect(SymbolParser.getFuturesYear('2', 'Z')).toEqual(2022);
		});

		it('The string "22" should resolve to 2022 (in month "Z")', () => {
			expect(SymbolParser.getFuturesYear('22', 'Z')).toEqual(2022);
		});

		it('The string "2022" should resolve to 2022 (in month "Z")', () => {
			expect(SymbolParser.getFuturesYear('2022', 'Z')).toEqual(2022);
		});

		it('The string "3" should resolve to 2023 (in month "Z")', () => {
			expect(SymbolParser.getFuturesYear('3', 'Z')).toEqual(2023);
		});

		it('The string "23" should resolve to 2023 (in month "Z")', () => {
			expect(SymbolParser.getFuturesYear('23', 'Z')).toEqual(2023);
		});

		it('The string "2023" should resolve to 2023 (in month "Z")', () => {
			expect(SymbolParser.getFuturesYear('2023', 'Z')).toEqual(2023);
		});

		it('The string "1" should resolve to 2031 (in month "Z")', () => {
			expect(SymbolParser.getFuturesYear('1', 'Z')).toEqual(2031);
		});

		it('The string "21" should resolve to 2021 (in month "Z")', () => {
			expect(SymbolParser.getFuturesYear('21', 'Z')).toEqual(2021);
		});

		it('The string "31" should resolve to 2031 (in month "Z")', () => {
			expect(SymbolParser.getFuturesYear('31', 'Z')).toEqual(2031);
		});

		it('The string "2031" should resolve to 2031 (in month "Z")', () => {
			expect(SymbolParser.getFuturesYear('2031', 'Z')).toEqual(2031);
		});

		it('The string "46" should resolve to 2046 (in month "Z")', () => {
			expect(SymbolParser.getFuturesYear('46', 'Z')).toEqual(2046);
		});

		it('The string "47" should resolve to 2047 (in month "Z")', () => {
			expect(SymbolParser.getFuturesYear('47', 'Z')).toEqual(2047);
		});

		it('The string "48" should resolve to 1948 (in month "Z")', () => {
			expect(SymbolParser.getFuturesYear('48', 'Z')).toEqual(1948);
		});

		it('The string "49" should resolve to 1949 (in month "Z")', () => {
			expect(SymbolParser.getFuturesYear('49', 'Z')).toEqual(1949);
		});

		afterEach(() => {
			Date.prototype.getFullYear = getFullYear;
			getFullYear = null;
		});
	});
});



