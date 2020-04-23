const parsePrice = require('../../../../lib/utilities/parse/price');

describe('when parsing invalid values', () => {
	'use strict';

	describe('with a unit code of "A"', () => {
		it('parses a zero-length string as Number.NaN', () => {
			expect(parsePrice('', 'A')).toEqual(Number.NaN);
		});

		it('parses a non-numeric string as Number.NaN', () => {
			expect(parsePrice('bob', 'A')).toEqual(Number.NaN);
		});

		it('parses an undefined value as Number.NaN', () => {
			expect(parsePrice(undefined, 'A')).toEqual(Number.NaN);
		});

		it('parses a null value as Number.NaN', () => {
			expect(parsePrice(null, 'A')).toEqual(Number.NaN);
		});

		it('parses "123A456" as Number.NaM', () => {
			expect(parsePrice('123A456', 'A')).toEqual(Number.NaN);
		});
	});

	describe('with a unit code of "2"', () => {
		it('parses a zero-length string as Number.NaN', () => {
			expect(parsePrice('', '2')).toEqual(Number.NaN);
		});

		it('parses a non-numeric string as Number.NaN', () => {
			expect(parsePrice('bob', '2')).toEqual(Number.NaN);
		});

		it('parses an undefined value as Number.NaN', () => {
			expect(parsePrice(undefined, '2')).toEqual(Number.NaN);
		});

		it('parses a null value as Number.NaN', () => {
			expect(parsePrice(null, '2')).toEqual(Number.NaN);
		});

		it('parses "123A456" as Number.NaM', () => {
			expect(parsePrice('123A456', '2')).toEqual(Number.NaN);
		});
	});
});
