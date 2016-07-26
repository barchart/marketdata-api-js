var parseValue = require('../../../lib/messageParser/parseValue');

describe('when parsing prices', function() {
	'use strict';

	describe('with a decimal fraction separator', function() {
		it('returns 377 (with unit code 2) when parsing "377.000"', function() {
			expect(parseValue('377.000', '2')).toEqual(377);
		});

		it('returns 377.5 (with unit code 2) when parsing "377.500"', function() {
			expect(parseValue('377.500', '2')).toEqual(377.5);
		});

		it('returns 377.75 (with unit code 2) when parsing "377.750"', function() {
			expect(parseValue('377.750', '2')).toEqual(377.75);
		});
	});


	describe('with a dash fraction separator', function() {
		it('returns 123 (with unit code 2) when parsing "123-0"', function() {
			expect(parseValue('123-0', '2')).toEqual(123);
		});

		it('returns 123.5 (with unit code 2) when parsing "123-4"', function() {
			expect(parseValue('123-4', '2')).toEqual(123.5);
		});

		it('returns 0.5 (with unit code 2) when parsing "0-4"', function() {
			expect(parseValue('0-4', '2')).toEqual(0.5);
		});

		it('returns 0 (with unit code 2) when parsing "0-0"', function() {
			expect(parseValue('0-0', '2')).toEqual(0);
		});

		it('returns undefined (with unit code 2) when parsing zero-length string', function() {
			expect(parseValue('', '2')).toEqual(undefined);
		});
	});

	describe('with a tick fraction separator', function() {
		it('returns 123 (with unit code 2) when parsing "123\'0"', function() {
			expect(parseValue('123\'0', '2')).toEqual(123);
		});

		it('returns 123.5 (with unit code 2) when parsing "123\'4"', function() {
			expect(parseValue('123\'4', '2')).toEqual(123.5);
		});

		it('returns 0.5 (with unit code 2) when parsing "0\'4"', function() {
			expect(parseValue('0\'4', '2')).toEqual(0.5);
		});

		it('returns 0 (with unit code 2) when parsing "0\'0"', function() {
			expect(parseValue('0\'0', '2')).toEqual(0);
		});

		it('returns undefined (with unit code 2) when parsing zero-length string', function() {
			expect(parseValue('', '2')).toEqual(undefined);
		});
	});
});