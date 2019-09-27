const convertUnitCodeToBaseCode = require('./../../../../lib/utilities/convert/unitCodeToBaseCode');

describe('When converting a unitCode to a baseCode', () => {
	it('"2" should translate to -1', () => {
		expect(convertUnitCodeToBaseCode("2")).toEqual(-1);
	});

	it('"3" should translate to -2', () => {
		expect(convertUnitCodeToBaseCode("3")).toEqual(-2);
	});

	it('"4" should translate to -3', () => {
		expect(convertUnitCodeToBaseCode("4")).toEqual(-3);
	});

	it('"5" should translate to -4', () => {
		expect(convertUnitCodeToBaseCode("5")).toEqual(-4);
	});

	it('"6" should translate to -5', () => {
		expect(convertUnitCodeToBaseCode("6")).toEqual(-5);
	});

	it('"7" should translate to -6', () => {
		expect(convertUnitCodeToBaseCode("7")).toEqual(-6);
	});

	it('"8" should translate to 0', () => {
		expect(convertUnitCodeToBaseCode("8")).toEqual(0);
	});

	it('"9" should translate to 1', () => {
		expect(convertUnitCodeToBaseCode("9")).toEqual(1);
	});

	it('"A" should translate to 1', () => {
		expect(convertUnitCodeToBaseCode("A")).toEqual(2);
	});

	it('"B" should translate to 3', () => {
		expect(convertUnitCodeToBaseCode("B")).toEqual(3);
	});

	it('"C" should translate to 4', () => {
		expect(convertUnitCodeToBaseCode("C")).toEqual(4);
	});

	it('"D" should translate to 5', () => {
		expect(convertUnitCodeToBaseCode("D")).toEqual(5);
	});

	it('"E" should translate to 6', () => {
		expect(convertUnitCodeToBaseCode("E")).toEqual(6);
	});

	it('"F" should translate to 6', () => {
		expect(convertUnitCodeToBaseCode("F")).toEqual(7);
	});

	it('2 should translate to ', () => {
		expect(convertUnitCodeToBaseCode(2)).toEqual(0);
	});

	it('A null value should translate to 0', () => {
		expect(convertUnitCodeToBaseCode(null)).toEqual(0);
	});

	it('An undefined value should translate to 0', () => {
		expect(convertUnitCodeToBaseCode(undefined)).toEqual(0);
	});
});