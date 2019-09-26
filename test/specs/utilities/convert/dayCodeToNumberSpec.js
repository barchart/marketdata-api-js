const dayCodeToNumber = require('./../../../../lib/utilities/convert/dayCodeToNumber');

describe('When converting a dayCode to number', () => {
	it('"1" should translate to 1', () => {
		expect(dayCodeToNumber("1")).toEqual(1);
	});

	it('"2" should translate to 2', () => {
		expect(dayCodeToNumber("2")).toEqual(2);
	});

	it('"3" should translate to 3', () => {
		expect(dayCodeToNumber("3")).toEqual(3);
	});

	it('"4" should translate to 4', () => {
		expect(dayCodeToNumber("4")).toEqual(4);
	});

	it('"5" should translate to 5', () => {
		expect(dayCodeToNumber("5")).toEqual(5);
	});

	it('"6" should translate to 6', () => {
		expect(dayCodeToNumber("6")).toEqual(6);
	});

	it('"7" should translate to 7', () => {
		expect(dayCodeToNumber("7")).toEqual(7);
	});

	it('"8" should translate to 8', () => {
		expect(dayCodeToNumber("8")).toEqual(8);
	});

	it('"9" should translate to 9', () => {
		expect(dayCodeToNumber("9")).toEqual(9);
	});

	it('"0" should translate to 10', () => {
		expect(dayCodeToNumber("0")).toEqual(10);
	});

	it('"A" should translate to 11', () => {
		expect(dayCodeToNumber("A")).toEqual(11);
	});

	it('"a" should translate to 11', () => {
		expect(dayCodeToNumber("a")).toEqual(11);
	});

	it('"B" should translate to 12', () => {
		expect(dayCodeToNumber("B")).toEqual(12);
	});

	it('"b" should translate to 12', () => {
		expect(dayCodeToNumber("b")).toEqual(12);
	});

	it('"C" should translate to 13', () => {
		expect(dayCodeToNumber("C")).toEqual(13);
	});

	it('"c" should translate to 13', () => {
		expect(dayCodeToNumber("c")).toEqual(13);
	});

	it('"D" should translate to 14', () => {
		expect(dayCodeToNumber("D")).toEqual(14);
	});

	it('"d" should translate to 14', () => {
		expect(dayCodeToNumber("d")).toEqual(14);
	});

	it('"E" should translate to 15', () => {
		expect(dayCodeToNumber("E")).toEqual(15);
	});

	it('"e" should translate to 15', () => {
		expect(dayCodeToNumber("e")).toEqual(15);
	});

	it('"F" should translate to 16', () => {
		expect(dayCodeToNumber("F")).toEqual(16);
	});

	it('"f" should translate to 16', () => {
		expect(dayCodeToNumber("f")).toEqual(16);
	});

	it('"G" should translate to 17', () => {
		expect(dayCodeToNumber("G")).toEqual(17);
	});

	it('"g" should translate to 17', () => {
		expect(dayCodeToNumber("g")).toEqual(17);
	});

	it('"H" should translate to 18', () => {
		expect(dayCodeToNumber("H")).toEqual(18);
	});

	it('"h" should translate to 18', () => {
		expect(dayCodeToNumber("h")).toEqual(18);
	});

	it('"I" should translate to 19', () => {
		expect(dayCodeToNumber("I")).toEqual(19);
	});

	it('"i" should translate to 19', () => {
		expect(dayCodeToNumber("i")).toEqual(19);
	});

	it('"J" should translate to 20', () => {
		expect(dayCodeToNumber("J")).toEqual(20);
	});

	it('"j" should translate to 20', () => {
		expect(dayCodeToNumber("j")).toEqual(20);
	});

	it('"K" should translate to 21', () => {
		expect(dayCodeToNumber("K")).toEqual(21);
	});

	it('"k" should translate to 21', () => {
		expect(dayCodeToNumber("k")).toEqual(21);
	});

	it('"L" should translate to 22', () => {
		expect(dayCodeToNumber("L")).toEqual(22);
	});

	it('"l" should translate to 22', () => {
		expect(dayCodeToNumber("l")).toEqual(22);
	});

	it('"M" should translate to 23', () => {
		expect(dayCodeToNumber("M")).toEqual(23);
	});

	it('"m" should translate to 23', () => {
		expect(dayCodeToNumber("m")).toEqual(23);
	});

	it('"N" should translate to 24', () => {
		expect(dayCodeToNumber("N")).toEqual(24);
	});

	it('"n" should translate to 24', () => {
		expect(dayCodeToNumber("n")).toEqual(24);
	});

	it('"O" should translate to 25', () => {
		expect(dayCodeToNumber("O")).toEqual(25);
	});

	it('"o" should translate to 25', () => {
		expect(dayCodeToNumber("o")).toEqual(25);
	});

	it('"P" should translate to 26', () => {
		expect(dayCodeToNumber("P")).toEqual(26);
	});

	it('"p" should translate to 26', () => {
		expect(dayCodeToNumber("p")).toEqual(26);
	});

	it('"Q" should translate to 27', () => {
		expect(dayCodeToNumber("Q")).toEqual(27);
	});

	it('"q" should translate to 27', () => {
		expect(dayCodeToNumber("q")).toEqual(27);
	});

	it('"R" should translate to 28', () => {
		expect(dayCodeToNumber("R")).toEqual(28);
	});

	it('"r" should translate to 28', () => {
		expect(dayCodeToNumber("r")).toEqual(28);
	});

	it('"S" should translate to 29', () => {
		expect(dayCodeToNumber("S")).toEqual(29);
	});

	it('"s" should translate to 29', () => {
		expect(dayCodeToNumber("s")).toEqual(29);
	});

	it('"T" should translate to 30', () => {
		expect(dayCodeToNumber("T")).toEqual(30);
	});

	it('"t" should translate to 30', () => {
		expect(dayCodeToNumber("t")).toEqual(30);
	});

	it('"U" should translate to 31', () => {
		expect(dayCodeToNumber("U")).toEqual(31);
	});

	it('"u" should translate to 31', () => {
		expect(dayCodeToNumber("u")).toEqual(31);
	});

	it('A null value should translate to a null value', () => {
		expect(dayCodeToNumber(null)).toEqual(null);
	});

	it('A undefined value should translate to a null value', () => {
		expect(dayCodeToNumber(null)).toEqual(null);
	});

	it('A zero-length string should translate to a null value', () => {
		expect(dayCodeToNumber('')).toEqual(null);
	});
});