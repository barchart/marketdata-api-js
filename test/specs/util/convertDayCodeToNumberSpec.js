var convertDayCodeToNumber = require('../../../lib/util/convertDayCodeToNumber');

describe('When converting a dayCode to number', function() {
	it('"1" should translate to 1', function() {
		expect(convertDayCodeToNumber("1")).toEqual(1);
	});

	it('"2" should translate to 2', function() {
		expect(convertDayCodeToNumber("2")).toEqual(2);
	});

	it('"3" should translate to 3', function() {
		expect(convertDayCodeToNumber("3")).toEqual(3);
	});

	it('"4" should translate to 4', function() {
		expect(convertDayCodeToNumber("4")).toEqual(4);
	});

	it('"5" should translate to 5', function() {
		expect(convertDayCodeToNumber("5")).toEqual(5);
	});

	it('"6" should translate to 6', function() {
		expect(convertDayCodeToNumber("6")).toEqual(6);
	});

	it('"7" should translate to 7', function() {
		expect(convertDayCodeToNumber("7")).toEqual(7);
	});

	it('"8" should translate to 8', function() {
		expect(convertDayCodeToNumber("8")).toEqual(8);
	});

	it('"9" should translate to 9', function() {
		expect(convertDayCodeToNumber("9")).toEqual(9);
	});

	it('"0" should translate to 10', function() {
		expect(convertDayCodeToNumber("0")).toEqual(10);
	});

	it('"A" should translate to 11', function() {
		expect(convertDayCodeToNumber("A")).toEqual(11);
	});

	it('"B" should translate to 12', function() {
		expect(convertDayCodeToNumber("B")).toEqual(12);
	});

	it('"C" should translate to 13', function() {
		expect(convertDayCodeToNumber("C")).toEqual(13);
	});

	it('"D" should translate to 14', function() {
		expect(convertDayCodeToNumber("D")).toEqual(14);
	});

	it('"E" should translate to 15', function() {
		expect(convertDayCodeToNumber("E")).toEqual(15);
	});

	it('"F" should translate to 16', function() {
		expect(convertDayCodeToNumber("F")).toEqual(16);
	});

	it('"GF" should translate to 17', function() {
		expect(convertDayCodeToNumber("G")).toEqual(17);
	});

	it('"H" should translate to 18', function() {
		expect(convertDayCodeToNumber("H")).toEqual(18);
	});

	it('"I" should translate to 19', function() {
		expect(convertDayCodeToNumber("I")).toEqual(19);
	});

	it('"J" should translate to 20', function() {
		expect(convertDayCodeToNumber("J")).toEqual(20);
	});

	it('"K" should translate to 21', function() {
		expect(convertDayCodeToNumber("K")).toEqual(21);
	});

	it('"L" should translate to 22', function() {
		expect(convertDayCodeToNumber("L")).toEqual(22);
	});

	it('"M" should translate to 23', function() {
		expect(convertDayCodeToNumber("M")).toEqual(23);
	});

	it('"N" should translate to 24', function() {
		expect(convertDayCodeToNumber("N")).toEqual(24);
	});

	it('"O" should translate to 25', function() {
		expect(convertDayCodeToNumber("O")).toEqual(25);
	});

	it('"P" should translate to 26', function() {
		expect(convertDayCodeToNumber("P")).toEqual(26);
	});

	it('"Q" should translate to 27', function() {
		expect(convertDayCodeToNumber("Q")).toEqual(27);
	});

	it('"R" should translate to 28', function() {
		expect(convertDayCodeToNumber("R")).toEqual(28);
	});

	it('"S" should translate to 29', function() {
		expect(convertDayCodeToNumber("S")).toEqual(29);
	});

	it('"T" should translate to 30', function() {
		expect(convertDayCodeToNumber("T")).toEqual(30);
	});

	it('"U" should translate to 31', function() {
		expect(convertDayCodeToNumber("U")).toEqual(31);
	});
});