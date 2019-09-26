const unitCodeToBaseCode = require('./../../../../lib/utilities/convert/unitCodeToBaseCode');

describe('When converting a unitCode to a baseCode', () => {
	it('"2" should translate to -1', () => {
		expect(unitCodeToBaseCode("2")).toEqual(-1);
	});

	it('"3" should translate to -2', () => {
		expect(unitCodeToBaseCode("3")).toEqual(-2);
	});

	it('"4" should translate to -3', () => {
		expect(unitCodeToBaseCode("4")).toEqual(-3);
	});

	it('"5" should translate to -4', () => {
		expect(unitCodeToBaseCode("5")).toEqual(-4);
	});

	it('"6" should translate to -5', () => {
		expect(unitCodeToBaseCode("6")).toEqual(-5);
	});

	it('"7" should translate to -6', () => {
		expect(unitCodeToBaseCode("7")).toEqual(-6);
	});

	it('"8" should translate to 0', () => {
		expect(unitCodeToBaseCode("8")).toEqual(0);
	});

	it('"9" should translate to 1', () => {
		expect(unitCodeToBaseCode("9")).toEqual(1);
	});

	it('"A" should translate to 1', () => {
		expect(unitCodeToBaseCode("A")).toEqual(2);
	});

	it('"B" should translate to 3', () => {
		expect(unitCodeToBaseCode("B")).toEqual(3);
	});

	it('"C" should translate to 4', () => {
		expect(unitCodeToBaseCode("C")).toEqual(4);
	});

	it('"D" should translate to 5', () => {
		expect(unitCodeToBaseCode("D")).toEqual(5);
	});

	it('"E" should translate to 6', () => {
		expect(unitCodeToBaseCode("E")).toEqual(6);
	});

	it('"F" should translate to 6', () => {
		expect(unitCodeToBaseCode("F")).toEqual(7);
	});

	it('2 should translate to ', () => {
		expect(unitCodeToBaseCode(2)).toEqual(0);
	});

	it('A null value should translate to 0', () => {
		expect(unitCodeToBaseCode(null)).toEqual(0);
	});

	it('An undefined value should translate to 0', () => {
		expect(unitCodeToBaseCode(undefined)).toEqual(0);
	});
});