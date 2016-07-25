var monthCodes = require('../../../lib/util/monthCodes');

describe('When looking up a month name by code', function() {
	var map;

	beforeEach(function() {
		map = monthCodes;
	});

	it('"F" should map to "January"', function() {
		expect(map.F).toEqual("January");
	});

	it('"G" should map to "February"', function() {
		expect(map.G).toEqual("February");
	});

	it('"H" should map to "March"', function() {
		expect(map.H).toEqual("March");
	});

	it('"J" should map to "April"', function() {
		expect(map.J).toEqual("April");
	});

	it('"K" should map to "May"', function() {
		expect(map.K).toEqual("May");
	});

	it('"M" should map to "June"', function() {
		expect(map.M).toEqual("June");
	});

	it('"N" should map to "July"', function() {
		expect(map.N).toEqual("July");
	});

	it('"Q" should map to "August"', function() {
		expect(map.Q).toEqual("August");
	});

	it('"U" should map to "September"', function() {
		expect(map.U).toEqual("September");
	});

	it('"V" should map to "October"', function() {
		expect(map.V).toEqual("October");
	});

	it('"X" should map to "November"', function() {
		expect(map.X).toEqual("November");
	});

	it('"Z" should map to "December"', function() {
		expect(map.Z).toEqual("December");
	});
});