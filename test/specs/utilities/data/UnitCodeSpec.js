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

		it('should have a "unit" code of "2"', () => {
			expect(unitCode.unitCode).toEqual('2');
		});

		it('should have a "base" code of -1', () => {
			expect(unitCode.baseCode).toEqual(-1);
		});

		it('should be the same instance as resolving "base" code -1', () => {
			expect(UnitCode.fromBaseCode(-1)).toBe(unitCode);
		});

		it('should use three decimal places', () => {
			expect(unitCode.decimalDigits).toEqual(3);
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

		it('the fraction digits should be 1', () => {
			expect(unitCode.fractionDigits).toEqual(1);
		});

		it('the "special" fraction digits should be 1', () => {
			expect(unitCode.fractionDigitsSpecial).toEqual(1);
		});

		it('getting the fraction digits should return 1', () => {
			expect(unitCode.getFractionDigits()).toEqual(1);
		});

		it('getting the "special" fraction digits should return 1', () => {
			expect(unitCode.getFractionDigits(true)).toEqual(1);
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

		it('should have a "unit" code of "3"', () => {
			expect(unitCode.unitCode).toEqual('3');
		});

		it('should have a "base" code of -2', () => {
			expect(unitCode.baseCode).toEqual(-2);
		});

		it('should be the same instance as resolving "base" code -2', () => {
			expect(UnitCode.fromBaseCode(-2)).toBe(unitCode);
		});

		it('should use four decimal places', () => {
			expect(unitCode.decimalDigits).toEqual(4);
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

		it('the fraction digits should be 2', () => {
			expect(unitCode.fractionDigits).toEqual(2);
		});

		it('the "special" fraction digits should be 2', () => {
			expect(unitCode.fractionDigitsSpecial).toEqual(2);
		});

		it('getting the fraction digits should return 2', () => {
			expect(unitCode.getFractionDigits()).toEqual(2);
		});

		it('getting the "special" fraction digits should return 2', () => {
			expect(unitCode.getFractionDigits(true)).toEqual(2);
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

		it('should have a "unit" code of "4"', () => {
			expect(unitCode.unitCode).toEqual('4');
		});

		it('should have a "base" code of -3', () => {
			expect(unitCode.baseCode).toEqual(-3);
		});

		it('should be the same instance as resolving "base" code -3', () => {
			expect(UnitCode.fromBaseCode(-3)).toBe(unitCode);
		});

		it('should use five decimal places', () => {
			expect(unitCode.decimalDigits).toEqual(5);
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

		it('the fraction digits should be 2', () => {
			expect(unitCode.fractionDigits).toEqual(2);
		});

		it('the "special" fraction digits should be 2', () => {
			expect(unitCode.fractionDigitsSpecial).toEqual(2);
		});

		it('getting the fraction digits should return 2', () => {
			expect(unitCode.getFractionDigits()).toEqual(2);
		});

		it('getting the "special" fraction digits should return 2', () => {
			expect(unitCode.getFractionDigits(true)).toEqual(2);
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

		it('should have a "unit" code of "5"', () => {
			expect(unitCode.unitCode).toEqual('5');
		});

		it('should have a "base" code of -4', () => {
			expect(unitCode.baseCode).toEqual(-4);
		});

		it('should be the same instance as resolving "base" code -4', () => {
			expect(UnitCode.fromBaseCode(-4)).toBe(unitCode);
		});

		it('should use six decimal places', () => {
			expect(unitCode.decimalDigits).toEqual(6);
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

		it('the fraction digits should be 2', () => {
			expect(unitCode.fractionDigits).toEqual(2);
		});

		it('the "special" fraction digits should be 3', () => {
			expect(unitCode.fractionDigitsSpecial).toEqual(3);
		});

		it('getting the fraction digits should return 2', () => {
			expect(unitCode.getFractionDigits()).toEqual(2);
		});

		it('getting the "special" fraction digits should return 3', () => {
			expect(unitCode.getFractionDigits(true)).toEqual(3);
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

		it('should have a "unit" code of "6"', () => {
			expect(unitCode.unitCode).toEqual('6');
		});

		it('should have a "base" code of -5', () => {
			expect(unitCode.baseCode).toEqual(-5);
		});

		it('should be the same instance as resolving "base" code -5', () => {
			expect(UnitCode.fromBaseCode(-5)).toBe(unitCode);
		});

		it('should use seven decimal places', () => {
			expect(unitCode.decimalDigits).toEqual(7);
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

		it('the fraction digits should be 3', () => {
			expect(unitCode.fractionDigits).toEqual(3);
		});

		it('the "special" fraction digits should be 3', () => {
			expect(unitCode.fractionDigitsSpecial).toEqual(3);
		});

		it('getting the fraction digits should return 3', () => {
			expect(unitCode.getFractionDigits()).toEqual(3);
		});

		it('getting the "special" fraction digits should return 3', () => {
			expect(unitCode.getFractionDigits(true)).toEqual(3);
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

		it('should have a "unit" code of "7"', () => {
			expect(unitCode.unitCode).toEqual('7');
		});

		it('should have a "base" code of -6', () => {
			expect(unitCode.baseCode).toEqual(-6);
		});

		it('should be the same instance as resolving "base" code -6', () => {
			expect(UnitCode.fromBaseCode(-6)).toBe(unitCode);
		});

		it('should use eight decimal places', () => {
			expect(unitCode.decimalDigits).toEqual(8);
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

		it('the fraction digits should be 3', () => {
			expect(unitCode.fractionDigits).toEqual(3);
		});

		it('the "special" fraction digits should be 3', () => {
			expect(unitCode.fractionDigitsSpecial).toEqual(3);
		});

		it('getting the fraction digits should return 3', () => {
			expect(unitCode.getFractionDigits()).toEqual(3);
		});

		it('getting the "special" fraction digits should return 3', () => {
			expect(unitCode.getFractionDigits(true)).toEqual(3);
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

		it('should have a "unit" code of "8"', () => {
			expect(unitCode.unitCode).toEqual('8');
		});

		it('should have a "base" code of 0', () => {
			expect(unitCode.baseCode).toEqual(0);
		});

		it('should be the same instance as resolving "base" code 0', () => {
			expect(UnitCode.fromBaseCode(0)).toBe(unitCode);
		});

		it('should use zero decimal places', () => {
			expect(unitCode.decimalDigits).toEqual(0);
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

		it('the fraction digits should be undefined', () => {
			expect(unitCode.fractionDigits).toEqual(undefined);
		});

		it('the "special" fraction digits should be undefined', () => {
			expect(unitCode.fractionDigitsSpecial).toEqual(undefined);
		});

		it('getting the fraction digits should return undefined', () => {
			expect(unitCode.getFractionDigits()).toEqual(undefined);
		});

		it('getting the "special" fraction digits should return undefined', () => {
			expect(unitCode.getFractionDigits(true)).toEqual(undefined);
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

		it('should have a "unit" code of "9"', () => {
			expect(unitCode.unitCode).toEqual('9');
		});

		it('should have a "base" code of 1', () => {
			expect(unitCode.baseCode).toEqual(1);
		});

		it('should be the same instance as resolving "base" code 1', () => {
			expect(UnitCode.fromBaseCode(1)).toBe(unitCode);
		});

		it('should use one decimal places', () => {
			expect(unitCode.decimalDigits).toEqual(1);
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

		it('the fraction digits should be undefined', () => {
			expect(unitCode.fractionDigits).toEqual(undefined);
		});

		it('the "special" fraction digits should be undefined', () => {
			expect(unitCode.fractionDigitsSpecial).toEqual(undefined);
		});

		it('getting the fraction digits should return undefined', () => {
			expect(unitCode.getFractionDigits()).toEqual(undefined);
		});

		it('getting the "special" fraction digits should return undefined', () => {
			expect(unitCode.getFractionDigits(true)).toEqual(undefined);
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

		it('should have a "unit" code of "A"', () => {
			expect(unitCode.unitCode).toEqual('A');
		});

		it('should have a "base" code of 2', () => {
			expect(unitCode.baseCode).toEqual(2);
		});

		it('should be the same instance as resolving "base" code 2', () => {
			expect(UnitCode.fromBaseCode(2)).toBe(unitCode);
		});

		it('should use two decimal places', () => {
			expect(unitCode.decimalDigits).toEqual(2);
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

		it('the fraction digits should be undefined', () => {
			expect(unitCode.fractionDigits).toEqual(undefined);
		});

		it('the "special" fraction digits should be undefined', () => {
			expect(unitCode.fractionDigitsSpecial).toEqual(undefined);
		});

		it('getting the fraction digits should return undefined', () => {
			expect(unitCode.getFractionDigits()).toEqual(undefined);
		});

		it('getting the "special" fraction digits should return undefined', () => {
			expect(unitCode.getFractionDigits(true)).toEqual(undefined);
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

		it('should have a "unit" code of "B"', () => {
			expect(unitCode.unitCode).toEqual('B');
		});

		it('should have a "base" code of 3', () => {
			expect(unitCode.baseCode).toEqual(3);
		});

		it('should be the same instance as resolving "base" code 3', () => {
			expect(UnitCode.fromBaseCode(3)).toBe(unitCode);
		});

		it('should use three decimal places', () => {
			expect(unitCode.decimalDigits).toEqual(3);
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

		it('the fraction digits should be undefined', () => {
			expect(unitCode.fractionDigits).toEqual(undefined);
		});

		it('the "special" fraction digits should be undefined', () => {
			expect(unitCode.fractionDigitsSpecial).toEqual(undefined);
		});

		it('getting the fraction digits should return undefined', () => {
			expect(unitCode.getFractionDigits()).toEqual(undefined);
		});

		it('getting the "special" fraction digits should return undefined', () => {
			expect(unitCode.getFractionDigits(true)).toEqual(undefined);
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

		it('should have a "unit" code of "C"', () => {
			expect(unitCode.unitCode).toEqual('C');
		});

		it('should have a "base" code of 4', () => {
			expect(unitCode.baseCode).toEqual(4);
		});

		it('should be the same instance as resolving "base" code 4', () => {
			expect(UnitCode.fromBaseCode(4)).toBe(unitCode);
		});

		it('should use four decimal places', () => {
			expect(unitCode.decimalDigits).toEqual(4);
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

		it('the fraction digits should be undefined', () => {
			expect(unitCode.fractionDigits).toEqual(undefined);
		});

		it('the "special" fraction digits should be undefined', () => {
			expect(unitCode.fractionDigitsSpecial).toEqual(undefined);
		});

		it('getting the fraction digits should return undefined', () => {
			expect(unitCode.getFractionDigits()).toEqual(undefined);
		});

		it('getting the "special" fraction digits should return undefined', () => {
			expect(unitCode.getFractionDigits(true)).toEqual(undefined);
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

		it('should have a "unit" code of "D"', () => {
			expect(unitCode.unitCode).toEqual('D');
		});

		it('should have a "base" code of 5', () => {
			expect(unitCode.baseCode).toEqual(5);
		});

		it('should be the same instance as resolving "base" code 5', () => {
			expect(UnitCode.fromBaseCode(5)).toBe(unitCode);
		});

		it('should use five decimal places', () => {
			expect(unitCode.decimalDigits).toEqual(5);
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

		it('the fraction digits should be undefined', () => {
			expect(unitCode.fractionDigits).toEqual(undefined);
		});

		it('the "special" fraction digits should be undefined', () => {
			expect(unitCode.fractionDigitsSpecial).toEqual(undefined);
		});

		it('getting the fraction digits should return undefined', () => {
			expect(unitCode.getFractionDigits()).toEqual(undefined);
		});

		it('getting the "special" fraction digits should return undefined', () => {
			expect(unitCode.getFractionDigits(true)).toEqual(undefined);
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

		it('should have a "unit" code of "E"', () => {
			expect(unitCode.unitCode).toEqual('E');
		});

		it('should have a "base" code of 6', () => {
			expect(unitCode.baseCode).toEqual(6);
		});

		it('should be the same instance as resolving "base" code 6', () => {
			expect(UnitCode.fromBaseCode(6)).toBe(unitCode);
		});

		it('should use six decimal places', () => {
			expect(unitCode.decimalDigits).toEqual(6);
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

		it('the fraction digits should be undefined', () => {
			expect(unitCode.fractionDigits).toEqual(undefined);
		});

		it('the "special" fraction digits should be undefined', () => {
			expect(unitCode.fractionDigitsSpecial).toEqual(undefined);
		});

		it('getting the fraction digits should return undefined', () => {
			expect(unitCode.getFractionDigits()).toEqual(undefined);
		});

		it('getting the "special" fraction digits should return undefined', () => {
			expect(unitCode.getFractionDigits(true)).toEqual(undefined);
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

		it('should have a "unit" code of "F"', () => {
			expect(unitCode.unitCode).toEqual('F');
		});

		it('should have a "base" code of 7', () => {
			expect(unitCode.baseCode).toEqual(7);
		});

		it('should use seven decimal places', () => {
			expect(unitCode.decimalDigits).toEqual(7);
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

		it('the fraction digits should be undefined', () => {
			expect(unitCode.fractionDigits).toEqual(undefined);
		});

		it('the "special" fraction digits should be undefined', () => {
			expect(unitCode.fractionDigitsSpecial).toEqual(undefined);
		});

		it('getting the fraction digits should return undefined', () => {
			expect(unitCode.getFractionDigits()).toEqual(undefined);
		});

		it('getting the "special" fraction digits should return undefined', () => {
			expect(unitCode.getFractionDigits(true)).toEqual(undefined);
		});
	});
});

describe('When calculating minimum ticks and minimum tick values', () => {
	describe('For unit code "2" and with a tickIncrement of 2 and a pointValue of 50 (e.g. corn)', () => {
		let uc;

		beforeEach(() => {
			uc = UnitCode.parse('2');
		});

		it('The minimum tick should be 0.25', () => {
			expect(uc.getMinimumTick(2)).toEqual(0.25);
		});

		it('The minimum tick value should be 12.50', () => {
			expect(uc.getMinimumTickValue(2, 50)).toEqual(12.5);
		});
	});

	describe('For unit code "A" and with a tickIncrement of 25 and a pointValue of 50 (e.g. e-mini)', () => {
		let uc;

		beforeEach(() => {
			uc = UnitCode.parse('A');
		});

		it('The minimum tick should be 0.25', () => {
			expect(uc.getMinimumTick(25)).toEqual(0.25);
		});

		it('The minimum tick value should be 12.50', () => {
			expect(uc.getMinimumTickValue(25, 50)).toEqual(12.5);
		});
	});

	describe('For unit code "A" and with a tickIncrement of 1 and a pointValue of 1000 (e.g. crude)', () => {
		let uc;

		beforeEach(() => {
			uc = UnitCode.parse('A');
		});

		it('The minimum tick should be 0.01', () => {
			expect(uc.getMinimumTick(1)).toEqual(0.01);
		});

		it('The minimum tick value should be 10', () => {
			expect(uc.getMinimumTickValue(1, 1000)).toEqual(10);
		});
	});

	describe('For unit code "9" and with a tickIncrement of 1 and a pointValue of 100 (e.g. gold)', () => {
		let uc;

		beforeEach(() => {
			uc = UnitCode.parse('9');
		});

		it('The minimum tick should be 0.1', () => {
			expect(uc.getMinimumTick(1)).toEqual(0.1);
		});

		it('The minimum tick value should be 10', () => {
			expect(uc.getMinimumTickValue(1, 100)).toEqual(10);
		});
	});

	describe('For unit code "5" and with a tickIncrement of 1 and a pointValue of 1,000 (e.g. t-notes)', () => {
		let uc;

		beforeEach(() => {
			uc = UnitCode.parse('5');
		});

		it('The minimum tick should be 0.015625', () => {
			expect(uc.getMinimumTick(1)).toEqual(0.015625);
		});

		it('The minimum tick value should be 15.625', () => {
			expect(uc.getMinimumTickValue(1, 1000)).toEqual(15.625);
		});
	});

	describe('For unit code "E" and with a tickIncrement of 10 and a pointValue of 500,000 (e.g. mexican pesos)', () => {
		let uc;

		beforeEach(() => {
			uc = UnitCode.parse('E');
		});

		it('The minimum tick should be 0.015625', () => {
			expect(uc.getMinimumTick(10)).toEqual(0.00001);
		});

		it('The minimum tick value should be 15.625', () => {
			expect(uc.getMinimumTickValue(10, 500000)).toEqual(5);
		});
	});
});

describe('When rounding a value to the nearest tick value', () => {
	describe('For unit code "2" and with a tickIncrement of 2 (e.g. corn)', () => {
		let uc;
		let mt;

		beforeEach(() => {
			uc = UnitCode.parse('2');
			mt = uc.getMinimumTick(2);
		});

		it('A value of 0 should be rounded to 0', () => {
			expect(uc.roundToNearestTick(0, mt)).toEqual(0);
		});

		it('A value of 488.5 should be rounded to 488.5', () => {
			expect(uc.roundToNearestTick(488.5, mt)).toEqual(488.5);
		});

		it('A value of 488.51 should be rounded to 488.5', () => {
			expect(uc.roundToNearestTick(488.51, mt)).toEqual(488.5);
		});

		it('A value of 488.74 should be rounded to 488.75', () => {
			expect(uc.roundToNearestTick(488.74, mt)).toEqual(488.75);
		});

		it('A value of 488.625 should be rounded to 488.75', () => {
			expect(uc.roundToNearestTick(488.625, mt)).toEqual(488.75);
		});

		it('A value of 488.625 should be rounded to 488.5 (when using "roundDown" option)', () => {
			expect(uc.roundToNearestTick(488.625, mt, true)).toEqual(488.5);
		});
	});

	describe('For unit code "A" and with a tickIncrement of 25 (e.g. e-mini)', () => {
		let uc;
		let mt;

		beforeEach(() => {
			uc = UnitCode.parse('A');
			mt = uc.getMinimumTick(25);
		});

		it('A value of 4455.5 should be rounded to 4455.5', () => {
			expect(uc.roundToNearestTick(4455.5, mt)).toEqual(4455.5);
		});

		it('A value of 4455.51 should be rounded to 4455.5', () => {
			expect(uc.roundToNearestTick(4455.51, mt)).toEqual(4455.5);
		});

		it('A value of 4455.74 should be rounded to 4455.75', () => {
			expect(uc.roundToNearestTick(4455.74, mt)).toEqual(4455.75);
		});

		it('A value of 4455.625 should be rounded to 4455.75', () => {
			expect(uc.roundToNearestTick(4455.625, mt)).toEqual(4455.75);
		});

		it('A value of 4455.625 should be rounded to 4455.5 (when using "roundDown" option)', () => {
			expect(uc.roundToNearestTick(4455.625, mt, true)).toEqual(4455.5);
		});
	});

	describe('For unit code "A" and with a tickIncrement of 1 (e.g. crude)', () => {
		let uc;
		let mt;

		beforeEach(() => {
			uc = UnitCode.parse('A');
			mt = uc.getMinimumTick(1);
		});

		it('A value of 87.30 should be rounded to 87.30', () => {
			expect(uc.roundToNearestTick(87.30, mt)).toEqual(87.30);
		});

		it('A value of 87.31 should be rounded to 87.31', () => {
			expect(uc.roundToNearestTick(87.31, mt)).toEqual(87.31);
		});

		it('A value of 87.312 should be rounded to 87.31', () => {
			expect(uc.roundToNearestTick(87.312, mt)).toEqual(87.31);
		});

		it('A value of 87.318 should be rounded to 87.32', () => {
			expect(uc.roundToNearestTick(87.318, mt)).toEqual(87.32);
		});

		it('A value of 87.325 should be rounded to 87.33', () => {
			expect(uc.roundToNearestTick(87.325, mt)).toEqual(87.33);
		});

		it('A value of 87.325 should be rounded to 87.32 (when using "roundDown" option)', () => {
			expect(uc.roundToNearestTick(87.325, mt, true)).toEqual(87.32);
		});
	});

	describe('For unit code "9" and with a tickIncrement of 1 (e.g. gold)', () => {
		let uc;
		let mt;

		beforeEach(() => {
			uc = UnitCode.parse('9');
			mt = uc.getMinimumTick(1);
		});

		it('A value of 1922.5 should be rounded to 1922.5', () => {
			expect(uc.roundToNearestTick(1922.5, mt)).toEqual(1922.5);
		});

		it('A value of 1922.6 should be rounded to 1922.6', () => {
			expect(uc.roundToNearestTick(1922.6, mt)).toEqual(1922.6);
		});

		it('A value of 1922.51 should be rounded to 1922.5', () => {
			expect(uc.roundToNearestTick(1922.51, mt)).toEqual(1922.5);
		});

		it('A value of 1922.59 should be rounded to 1922.6', () => {
			expect(uc.roundToNearestTick(1922.59, mt)).toEqual(1922.6);
		});

		it('A value of 1922.55 should be rounded to 1922.6', () => {
			expect(uc.roundToNearestTick(1922.55, mt)).toEqual(1922.6);
		});

		it('A value of 1922.55 should be rounded to 1922.5 (when using "roundDown" option)', () => {
			expect(uc.roundToNearestTick(1922.55, mt, true)).toEqual(1922.5);
		});
	});

	describe('For unit code "5" and with a tickIncrement of 1 (e.g. t-notes)', () => {
		let uc;
		let mt;

		beforeEach(() => {
			uc = UnitCode.parse('5');
			mt = uc.getMinimumTick(1);
		});

		it('A value of 110.328125 should be rounded to 110.328125', () => {
			expect(uc.roundToNearestTick(110.328125, mt)).toEqual(110.328125);
		});

		it('A value of 110.34375 should be rounded to 110.34375', () => {
			expect(uc.roundToNearestTick(110.34375, mt)).toEqual(110.34375);
		});

		it('A value of 110.328126 should be rounded to 110.328125', () => {
			expect(uc.roundToNearestTick(110.328126, mt)).toEqual(110.328125);
		});

		it('A value of 110.34374 should be rounded to 110.34375', () => {
			expect(uc.roundToNearestTick(110.34374, mt)).toEqual(110.34375);
		});

		it('A value of 110.34374 should be rounded to 110.328125 (when using "roundDown" option)', () => {
			expect(uc.roundToNearestTick(110.34374, mt, true)).toEqual(110.328125);
		});
	});
});

