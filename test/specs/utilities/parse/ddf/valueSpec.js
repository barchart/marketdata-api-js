const parseValue = require('../../../../../lib/utilities/parse/ddf/value');

describe('when parsing prices', () => {
	'use strict';

	describe('with a decimal fraction separator', () => {
		it('returns 0.75 (with unit code 2) when parsing ".75"', () => {
			expect(parseValue('.75', '2')).toEqual(0.75);
		});

		it('returns 377 (with unit code 2) when parsing "377.000"', () => {
			expect(parseValue('377.000', '2')).toEqual(377);
		});

		it('returns 377.5 (with unit code 2) when parsing "377.500"', () => {
			expect(parseValue('377.500', '2')).toEqual(377.5);
		});

		it('returns 377.75 (with unit code 2) when parsing "377.750"', () => {
			expect(parseValue('377.750', '2')).toEqual(377.75);
		});

		it('returns 3770.75 (with unit code 2) when parsing "3770.750"', () => {
			expect(parseValue('3770.750', '2')).toEqual(3770.75);
		});

		it('returns 37700.75 (with unit code 2) when parsing "37700.750"', () => {
			expect(parseValue('37700.750', '2')).toEqual(37700.75);
		});

		it('returns 377000.75 (with unit code 2) when parsing "377000.750"', () => {
			expect(parseValue('377000.750', '2')).toEqual(377000.75);
		});

		it('returns 3770000.75 (with unit code 2) when parsing "3770000.750"', () => {
			expect(parseValue('3770000.750', '2')).toEqual(3770000.75);
		});

		it('returns 3770000 (with unit code 2) when parsing "3770000.000"', () => {
			expect(parseValue('3770000.000', '2')).toEqual(3770000);
		});

		it('returns 0 (with unit code 2) when parsing "0.000"', () => {
			expect(parseValue('0.000', '2')).toEqual(0);
		});

		it('returns undefined (with unit code 2) when parsing zero-length string', () => {
			expect(parseValue('', '2')).toEqual(undefined);
		});

		it('returns 0 (with unit code 8) when parsing "0"', () => {
			expect(parseValue('0', '8')).toEqual(0);
		});

		it('returns 1000 (with unit code 8) when parsing "1000"', () => {
			expect(parseValue('1000', '8')).toEqual(1000);
		});
	});

	describe('with a decimal fraction separator and a comma thousands separator', () => {
		it('returns 0.75 (with unit code 2) when parsing ".75"', () => {
			expect(parseValue('.75', '2', ',')).toEqual(0.75);
		});

		it('returns 3770.75 (with unit code 2) when parsing "3,770.750"', () => {
			expect(parseValue('3,770.750', '2', ',')).toEqual(3770.75);
		});

		it('returns 37700.75 (with unit code 2) when parsing "37,700.750"', () => {
			expect(parseValue('37,700.750', '2', ',')).toEqual(37700.75);
		});

		it('returns 377000.75 (with unit code 2) when parsing "377,000.750"', () => {
			expect(parseValue('377,000.750', '2', ',')).toEqual(377000.75);
		});

		it('returns 3770000.75 (with unit code 2) when parsing "3,770,000.750"', () => {
			expect(parseValue('3,770,000.750', '2', ',')).toEqual(3770000.75);
		});

		it('returns 3770000 (with unit code 2) when parsing "3,770,000.000"', () => {
			expect(parseValue('3,770,000.000', '2', ',')).toEqual(3770000);
		});
	});

	describe('with a dash fraction separator', () => {
		it('returns 123 (with unit code 2) when parsing "123-0"', () => {
			expect(parseValue('123-0', '2')).toEqual(123);
		});

		it('returns 123.5 (with unit code 2) when parsing "123-4"', () => {
			expect(parseValue('123-4', '2')).toEqual(123.5);
		});

		it('returns 0.5 (with unit code 2) when parsing "0-4"', () => {
			expect(parseValue('0-4', '2')).toEqual(0.5);
		});

		it('returns 0 (with unit code 2) when parsing "0-0"', () => {
			expect(parseValue('0-0', '2')).toEqual(0);
		});

		it('returns undefined (with unit code 2) when parsing zero-length string', () => {
			expect(parseValue('', '2')).toEqual(undefined);
		});
	});

	describe('with a tick fraction separator', () => {
		it('returns 123 (with unit code 2) when parsing "123\'0"', () => {
			expect(parseValue('123\'0', '2')).toEqual(123);
		});

		it('returns 123.5 (with unit code 2) when parsing "123\'4"', () => {
			expect(parseValue('123\'4', '2')).toEqual(123.5);
		});

		it('returns 0.5 (with unit code 2) when parsing "0\'4"', () => {
			expect(parseValue('0\'4', '2')).toEqual(0.5);
		});

		it('returns 0 (with unit code 2) when parsing "0\'0"', () => {
			expect(parseValue('0\'0', '2')).toEqual(0);
		});

		it('returns undefined (with unit code 2) when parsing zero-length string', () => {
			expect(parseValue('', '2')).toEqual(undefined);
		});
	});
});