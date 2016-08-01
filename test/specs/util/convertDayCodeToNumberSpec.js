var convertDayCodeToNumber = require('../../../lib/util/convertDayCodeToNumber');

describe('When converting a dayCode to number', function() {
	it('"1" should translate to 1', function() {
		expect(convertDayCodeToNumber("1")).toEqual(1);
	});

	it('"2" should translate to 2', function() {
		expect(convertDayCodeToNumber("2")).toEqual(2);
	});

	it('"9" should translate to 9', function() {
		expect(convertDayCodeToNumber("9")).toEqual(9);
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