const UnitCode = require('../../../../lib/utilities/data/UnitCode');

describe('When parsing a character as a unit code', () => {
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
	});
});