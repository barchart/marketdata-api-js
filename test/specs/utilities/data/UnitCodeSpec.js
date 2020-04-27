const UnitCode = require('../../../../lib/utilities/data/UnitCode');

describe('When parsing an invalid argument', () => {
	it('should parse "1" as null', () => {
		expect(UnitCode.parse('1')).toEqual(null);
	});

	it('should parse "G" as null', () => {
		expect(UnitCode.parse('G')).toEqual(null);
	});

	it('should parse "a" as null', () => {
		expect(UnitCode.parse('a')).toEqual(null);
	});

	it('should parse the number two as null', () => {
		expect(UnitCode.parse(2)).toEqual(null);
	});

	it('should parse the string "AA" as null', () => {
		expect(UnitCode.parse('AA')).toEqual(null);
	});

	it('should parse null as null', () => {
		expect(UnitCode.parse(null)).toEqual(null);
	});
});

describe('When parsing a valid character as a unit code', () => {
	describe('When parsing "2"', () => {
		let unitCode;

		beforeEach(() => {
			unitCode = UnitCode.parse('2');
		});

		it('should have a code of "2"', () => {
			expect(unitCode.code).toEqual('2');
		});

		it('should use three decimal places', () => {
			expect(unitCode.decimals).toEqual(3);
		});

		it('does support fraction notation', () => {
			expect(unitCode.supportsFractions).toEqual(true);
		});

		it('the fraction factor should be 8', () => {
			expect(unitCode.fractionFactor).toEqual(8);
		});

		it('the "special" fraction factor should be 8', () => {
			expect(unitCode.fractionFactorSpecial).toEqual(8);
		});

		it('getting the fraction factor should return 8', () => {
			expect(unitCode.getFractionFactor()).toEqual(8);
		});

		it('getting the "special" fraction factor should return 8', () => {
			expect(unitCode.getFractionFactor(true)).toEqual(8);
		});
	});

	describe('When parsing "3"', () => {
		let unitCode;

		beforeEach(() => {
			unitCode = UnitCode.parse('3');
		});

		it('should have a code of "3"', () => {
			expect(unitCode.code).toEqual('3');
		});

		it('should use four decimal places', () => {
			expect(unitCode.decimals).toEqual(4);
		});

		it('does support fraction notation', () => {
			expect(unitCode.supportsFractions).toEqual(true);
		});

		it('the fraction factor should be 16', () => {
			expect(unitCode.fractionFactor).toEqual(16);
		});

		it('the "special" fraction factor should be 16', () => {
			expect(unitCode.fractionFactorSpecial).toEqual(16);
		});

		it('getting the fraction factor should return 16', () => {
			expect(unitCode.getFractionFactor()).toEqual(16);
		});

		it('getting the "special" fraction factor should return 16', () => {
			expect(unitCode.getFractionFactor(true)).toEqual(16);
		});
	});

	describe('When parsing "4"', () => {
		let unitCode;

		beforeEach(() => {
			unitCode = UnitCode.parse('4');
		});

		it('should have a code of "4"', () => {
			expect(unitCode.code).toEqual('4');
		});

		it('should use five decimal places', () => {
			expect(unitCode.decimals).toEqual(5);
		});

		it('does support fraction notation', () => {
			expect(unitCode.supportsFractions).toEqual(true);
		});

		it('the fraction factor should be 32', () => {
			expect(unitCode.fractionFactor).toEqual(32);
		});

		it('the "special" fraction factor should be 32', () => {
			expect(unitCode.fractionFactorSpecial).toEqual(32);
		});

		it('getting the fraction factor should return 32', () => {
			expect(unitCode.getFractionFactor()).toEqual(32);
		});

		it('getting the "special" fraction factor should return 32', () => {
			expect(unitCode.getFractionFactor(true)).toEqual(32);
		});
	});

	describe('When parsing "5"', () => {
		let unitCode;

		beforeEach(() => {
			unitCode = UnitCode.parse('5');
		});

		it('should have a code of "5"', () => {
			expect(unitCode.code).toEqual('5');
		});

		it('should use six decimal places', () => {
			expect(unitCode.decimals).toEqual(6);
		});

		it('does support fraction notation', () => {
			expect(unitCode.supportsFractions).toEqual(true);
		});

		it('the fraction factor should be 64', () => {
			expect(unitCode.fractionFactor).toEqual(64);
		});

		it('the "special" fraction factor should be 320', () => {
			expect(unitCode.fractionFactorSpecial).toEqual(320);
		});

		it('getting the fraction factor should return 64', () => {
			expect(unitCode.getFractionFactor()).toEqual(64);
		});

		it('getting the "special" fraction factor should return 320', () => {
			expect(unitCode.getFractionFactor(true)).toEqual(320);
		});
	});

	describe('When parsing "6"', () => {
		let unitCode;

		beforeEach(() => {
			unitCode = UnitCode.parse('6');
		});

		it('should have a code of "6"', () => {
			expect(unitCode.code).toEqual('6');
		});

		it('should use seven decimal places', () => {
			expect(unitCode.decimals).toEqual(7);
		});

		it('does support fraction notation', () => {
			expect(unitCode.supportsFractions).toEqual(true);
		});

		it('the fraction factor should be 128', () => {
			expect(unitCode.fractionFactor).toEqual(128);
		});

		it('the "special" fraction factor should be 320', () => {
			expect(unitCode.fractionFactorSpecial).toEqual(320);
		});

		it('getting the fraction factor should return 128', () => {
			expect(unitCode.getFractionFactor()).toEqual(128);
		});

		it('getting the "special" fraction factor should return 320', () => {
			expect(unitCode.getFractionFactor(true)).toEqual(320);
		});
	});

	describe('When parsing "7"', () => {
		let unitCode;

		beforeEach(() => {
			unitCode = UnitCode.parse('7');
		});

		it('should have a code of "7"', () => {
			expect(unitCode.code).toEqual('7');
		});

		it('should use eight decimal places', () => {
			expect(unitCode.decimals).toEqual(8);
		});

		it('does support fraction notation', () => {
			expect(unitCode.supportsFractions).toEqual(true);
		});

		it('the fraction factor should be 256', () => {
			expect(unitCode.fractionFactor).toEqual(256);
		});

		it('the "special" fraction factor should be 320', () => {
			expect(unitCode.fractionFactorSpecial).toEqual(320);
		});

		it('getting the fraction factor should return 256', () => {
			expect(unitCode.getFractionFactor()).toEqual(256);
		});

		it('getting the "special" fraction factor should return 320', () => {
			expect(unitCode.getFractionFactor(true)).toEqual(320);
		});
	});

	describe('When parsing "8"', () => {
		let unitCode;

		beforeEach(() => {
			unitCode = UnitCode.parse('8');
		});

		it('should have a code of "8"', () => {
			expect(unitCode.code).toEqual('8');
		});

		it('should use zero decimal places', () => {
			expect(unitCode.decimals).toEqual(0);
		});

		it('does not support fraction notation', () => {
			expect(unitCode.supportsFractions).toEqual(false);
		});

		it('the fraction factor should be undefined', () => {
			expect(unitCode.fractionFactor).toEqual(undefined);
		});

		it('the "special" fraction factor should be undefined', () => {
			expect(unitCode.fractionFactorSpecial).toEqual(undefined);
		});

		it('getting the fraction factor should return undefined', () => {
			expect(unitCode.getFractionFactor()).toEqual(undefined);
		});

		it('getting the "special" fraction factor should return undefined', () => {
			expect(unitCode.getFractionFactor(true)).toEqual(undefined);
		});
	});

	describe('When parsing "9"', () => {
		let unitCode;

		beforeEach(() => {
			unitCode = UnitCode.parse('9');
		});

		it('should have a code of "9"', () => {
			expect(unitCode.code).toEqual('9');
		});

		it('should use one decimal places', () => {
			expect(unitCode.decimals).toEqual(1);
		});

		it('does not support fraction notation', () => {
			expect(unitCode.supportsFractions).toEqual(false);
		});

		it('the fraction factor should be undefined', () => {
			expect(unitCode.fractionFactor).toEqual(undefined);
		});

		it('the "special" fraction factor should be undefined', () => {
			expect(unitCode.fractionFactorSpecial).toEqual(undefined);
		});

		it('getting the fraction factor should return undefined', () => {
			expect(unitCode.getFractionFactor()).toEqual(undefined);
		});

		it('getting the "special" fraction factor should return undefined', () => {
			expect(unitCode.getFractionFactor(true)).toEqual(undefined);
		});
	});

	describe('When parsing "A"', () => {
		let unitCode;

		beforeEach(() => {
			unitCode = UnitCode.parse('A');
		});

		it('should have a code of "A"', () => {
			expect(unitCode.code).toEqual('A');
		});

		it('should use two decimal places', () => {
			expect(unitCode.decimals).toEqual(2);
		});

		it('does not support fraction notation', () => {
			expect(unitCode.supportsFractions).toEqual(false);
		});

		it('the fraction factor should be undefined', () => {
			expect(unitCode.fractionFactor).toEqual(undefined);
		});

		it('the "special" fraction factor should be undefined', () => {
			expect(unitCode.fractionFactorSpecial).toEqual(undefined);
		});

		it('getting the fraction factor should return undefined', () => {
			expect(unitCode.getFractionFactor()).toEqual(undefined);
		});

		it('getting the "special" fraction factor should return undefined', () => {
			expect(unitCode.getFractionFactor(true)).toEqual(undefined);
		});
	});

	describe('When parsing "B"', () => {
		let unitCode;

		beforeEach(() => {
			unitCode = UnitCode.parse('B');
		});

		it('should have a code of "B"', () => {
			expect(unitCode.code).toEqual('B');
		});

		it('should use three decimal places', () => {
			expect(unitCode.decimals).toEqual(3);
		});

		it('does not support fraction notation', () => {
			expect(unitCode.supportsFractions).toEqual(false);
		});

		it('the fraction factor should be undefined', () => {
			expect(unitCode.fractionFactor).toEqual(undefined);
		});

		it('the "special" fraction factor should be undefined', () => {
			expect(unitCode.fractionFactorSpecial).toEqual(undefined);
		});

		it('getting the fraction factor should return undefined', () => {
			expect(unitCode.getFractionFactor()).toEqual(undefined);
		});

		it('getting the "special" fraction factor should return undefined', () => {
			expect(unitCode.getFractionFactor(true)).toEqual(undefined);
		});
	});

	describe('When parsing "C"', () => {
		let unitCode;

		beforeEach(() => {
			unitCode = UnitCode.parse('C');
		});

		it('should have a code of "C"', () => {
			expect(unitCode.code).toEqual('C');
		});

		it('should use four decimal places', () => {
			expect(unitCode.decimals).toEqual(4);
		});

		it('does not support fraction notation', () => {
			expect(unitCode.supportsFractions).toEqual(false);
		});

		it('the fraction factor should be undefined', () => {
			expect(unitCode.fractionFactor).toEqual(undefined);
		});

		it('the "special" fraction factor should be undefined', () => {
			expect(unitCode.fractionFactorSpecial).toEqual(undefined);
		});

		it('getting the fraction factor should return undefined', () => {
			expect(unitCode.getFractionFactor()).toEqual(undefined);
		});

		it('getting the "special" fraction factor should return undefined', () => {
			expect(unitCode.getFractionFactor(true)).toEqual(undefined);
		});
	});

	describe('When parsing "D"', () => {
		let unitCode;

		beforeEach(() => {
			unitCode = UnitCode.parse('D');
		});

		it('should have a code of "D"', () => {
			expect(unitCode.code).toEqual('D');
		});

		it('should use five decimal places', () => {
			expect(unitCode.decimals).toEqual(5);
		});

		it('does not support fraction notation', () => {
			expect(unitCode.supportsFractions).toEqual(false);
		});

		it('the fraction factor should be undefined', () => {
			expect(unitCode.fractionFactor).toEqual(undefined);
		});

		it('the "special" fraction factor should be undefined', () => {
			expect(unitCode.fractionFactorSpecial).toEqual(undefined);
		});

		it('getting the fraction factor should return undefined', () => {
			expect(unitCode.getFractionFactor()).toEqual(undefined);
		});

		it('getting the "special" fraction factor should return undefined', () => {
			expect(unitCode.getFractionFactor(true)).toEqual(undefined);
		});
	});

	describe('When parsing "E"', () => {
		let unitCode;

		beforeEach(() => {
			unitCode = UnitCode.parse('E');
		});

		it('should have a code of "E"', () => {
			expect(unitCode.code).toEqual('E');
		});

		it('should use six decimal places', () => {
			expect(unitCode.decimals).toEqual(6);
		});

		it('does not support fraction notation', () => {
			expect(unitCode.supportsFractions).toEqual(false);
		});

		it('the fraction factor should be undefined', () => {
			expect(unitCode.fractionFactor).toEqual(undefined);
		});

		it('the "special" fraction factor should be undefined', () => {
			expect(unitCode.fractionFactorSpecial).toEqual(undefined);
		});

		it('getting the fraction factor should return undefined', () => {
			expect(unitCode.getFractionFactor()).toEqual(undefined);
		});

		it('getting the "special" fraction factor should return undefined', () => {
			expect(unitCode.getFractionFactor(true)).toEqual(undefined);
		});
	});

	describe('When parsing "F"', () => {
		let unitCode;

		beforeEach(() => {
			unitCode = UnitCode.parse('F');
		});

		it('should have a code of "F"', () => {
			expect(unitCode.code).toEqual('F');
		});

		it('should use seven decimal places', () => {
			expect(unitCode.decimals).toEqual(7);
		});

		it('does not support fraction notation', () => {
			expect(unitCode.supportsFractions).toEqual(false);
		});

		it('the fraction factor should be undefined', () => {
			expect(unitCode.fractionFactor).toEqual(undefined);
		});

		it('the "special" fraction factor should be undefined', () => {
			expect(unitCode.fractionFactorSpecial).toEqual(undefined);
		});

		it('getting the fraction factor should return undefined', () => {
			expect(unitCode.getFractionFactor()).toEqual(undefined);
		});

		it('getting the "special" fraction factor should return undefined', () => {
			expect(unitCode.getFractionFactor(true)).toEqual(undefined);
		});
	});
});