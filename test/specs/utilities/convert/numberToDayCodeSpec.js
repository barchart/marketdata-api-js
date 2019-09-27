const convertNumberToDayCode = require('./../../../../lib/utilities/convert/numberToDayCode');

describe('When converting a number to a dayCode', () => {
	it('1 should translate to "1"', () => {
		expect(convertNumberToDayCode(1)).toEqual("1");
	});

	it('2 should translate to "2"', () => {
		expect(convertNumberToDayCode(2)).toEqual("2");
	});

	it('3 should translate to "3"', () => {
		expect(convertNumberToDayCode(3)).toEqual("3");
	});

	it('4 should translate to "4"', () => {
		expect(convertNumberToDayCode(4)).toEqual("4");
	});

	it('5 should translate to "5"', () => {
		expect(convertNumberToDayCode(5)).toEqual("5");
	});

	it('6 should translate to "6"', () => {
		expect(convertNumberToDayCode(6)).toEqual("6");
	});

	it('7 should translate to "7"', () => {
		expect(convertNumberToDayCode(7)).toEqual("7");
	});

	it('8 should translate to "8"', () => {
		expect(convertNumberToDayCode(8)).toEqual("8");
	});

	it('9 should translate to "9"', () => {
		expect(convertNumberToDayCode(9)).toEqual("9");
	});

	it('0 should translate to "0"', () => {
		expect(convertNumberToDayCode(10)).toEqual("0");
	});

	it('11 should translate to "A"', () => {
		expect(convertNumberToDayCode(11)).toEqual("A");
	});

	it('12 should translate to "B"', () => {
		expect(convertNumberToDayCode(12)).toEqual("B");
	});

	it('13 should translate to "C"', () => {
		expect(convertNumberToDayCode(13)).toEqual("C");
	});

	it('14 should translate to "D"', () => {
		expect(convertNumberToDayCode(14)).toEqual("D");
	});

	it('15 should translate to "E"', () => {
		expect(convertNumberToDayCode(15)).toEqual("E");
	});

	it('16 should translate to "F"', () => {
		expect(convertNumberToDayCode(16)).toEqual("F");
	});

	it('17 should translate to "G"', () => {
		expect(convertNumberToDayCode(17)).toEqual("G");
	});

	it('18 should translate to "H"', () => {
		expect(convertNumberToDayCode(18)).toEqual("H");
	});

	it('19 should translate to "I"', () => {
		expect(convertNumberToDayCode(19)).toEqual("I");
	});

	it('20 should translate to "J"', () => {
		expect(convertNumberToDayCode(20)).toEqual("J");
	});

	it('21 should translate to "K"', () => {
		expect(convertNumberToDayCode(21)).toEqual("K");
	});

	it('22 should translate to "L"', () => {
		expect(convertNumberToDayCode(22)).toEqual("L");
	});

	it('23 should translate to "M"', () => {
		expect(convertNumberToDayCode(23)).toEqual("M");
	});

	it('24 should translate to "N"', () => {
		expect(convertNumberToDayCode(24)).toEqual("N");
	});

	it('25 should translate to "O"', () => {
		expect(convertNumberToDayCode(25)).toEqual("O");
	});

	it('26 should translate to "P"', () => {
		expect(convertNumberToDayCode(26)).toEqual("P");
	});

	it('27 should translate to "Q"', () => {
		expect(convertNumberToDayCode(27)).toEqual("Q");
	});

	it('28 should translate to "R"', () => {
		expect(convertNumberToDayCode(28)).toEqual("R");
	});

	it('29 should translate to "S"', () => {
		expect(convertNumberToDayCode(29)).toEqual("S");
	});

	it('30 should translate to "T"', () => {
		expect(convertNumberToDayCode(30)).toEqual("T");
	});

	it('31 should translate to "U"', () => {
		expect(convertNumberToDayCode(31)).toEqual("U");
	});

	it('A null value should translate to a null value', () => {
		expect(convertNumberToDayCode(null)).toEqual(null);
	});

	it('A undefined value should translate to a null value', () => {
		expect(convertNumberToDayCode()).toEqual(null);
	});
});
