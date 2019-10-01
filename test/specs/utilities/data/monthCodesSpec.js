const monthCodes = require('../../../../lib/utilities/data/monthCodes');

describe('When looking up a month name by code', () => {
	let map;

	beforeEach(() => {
		map = monthCodes.getCodeToNameMap();
	});

	it('"F" should map to "January"', () => {
		expect(map.F).toEqual("January");
	});

	it('"G" should map to "February"', () => {
		expect(map.G).toEqual("February");
	});

	it('"H" should map to "March"', () => {
		expect(map.H).toEqual("March");
	});

	it('"J" should map to "April"', () => {
		expect(map.J).toEqual("April");
	});

	it('"K" should map to "May"', () => {
		expect(map.K).toEqual("May");
	});

	it('"M" should map to "June"', () => {
		expect(map.M).toEqual("June");
	});

	it('"N" should map to "July"', () => {
		expect(map.N).toEqual("July");
	});

	it('"Q" should map to "August"', () => {
		expect(map.Q).toEqual("August");
	});

	it('"U" should map to "September"', () => {
		expect(map.U).toEqual("September");
	});

	it('"V" should map to "October"', () => {
		expect(map.V).toEqual("October");
	});

	it('"X" should map to "November"', () => {
		expect(map.X).toEqual("November");
	});

	it('"Z" should map to "December"', () => {
		expect(map.Z).toEqual("December");
	});
});

describe('When looking up a month number by code', () => {
	let map;

	beforeEach(() => {
		map = monthCodes.getCodeToNumberMap();
	});

	it('"F" should map to 1', () => {
		expect(map.F).toEqual(1);
	});

	it('"G" should map to 2', () => {
		expect(map.G).toEqual(2);
	});

	it('"H" should map to 3', () => {
		expect(map.H).toEqual(3);
	});

	it('"J" should map to 4', () => {
		expect(map.J).toEqual(4);
	});

	it('"K" should map to 5', () => {
		expect(map.K).toEqual(5);
	});

	it('"M" should map to 6', () => {
		expect(map.M).toEqual(6);
	});

	it('"N" should map to 7', () => {
		expect(map.N).toEqual(7);
	});

	it('"Q" should map to 8', () => {
		expect(map.Q).toEqual(8);
	});

	it('"U" should map to 9', () => {
		expect(map.U).toEqual(9);
	});

	it('"V" should map to 10', () => {
		expect(map.V).toEqual(10);
	});

	it('"X" should map to 11', () => {
		expect(map.X).toEqual(11);
	});

	it('"Z" should map to 12', () => {
		expect(map.Z).toEqual(12);
	});
});