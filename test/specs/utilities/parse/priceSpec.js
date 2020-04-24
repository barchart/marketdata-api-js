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

describe('when valid prices are parsed', () => {
	describe('with a unit code of "A"', () => {
		describe('with a decimal fraction separator', () => {
			it('parses "0.00" as 0', () => {
				expect(parsePrice('0.00', 'A', '.')).toEqual(0);
			});

			it('parses "123.00" as 123', () => {
				expect(parsePrice('123.00', 'A', '.')).toEqual(123);
			});

			it('parses "123.50" as 123.5', () => {
				expect(parsePrice('123.50', 'A', '.')).toEqual(123.50);
			});

			it('parses "123.567" as 123.57', () => {
				expect(parsePrice('123.567', 'A', '.')).toEqual(123.57);
			});

			it('parses "123.561" as 123.56', () => {
				expect(parsePrice('123.561', 'A', '.')).toEqual(123.56);
			});
		});

		describe('with a dash fraction separator', () => {
			it('parses "0.00" as 0', () => {
				expect(parsePrice('0.00', 'A', '-')).toEqual(0);
			});

			it('parses "123.00" as 123', () => {
				expect(parsePrice('123.00', 'A', '-')).toEqual(123);
			});

			it('parses "123.50" as 123.5', () => {
				expect(parsePrice('123.50', 'A', '-')).toEqual(123.50);
			});

			it('parses "123.567" as 123.57', () => {
				expect(parsePrice('123.567', 'A', '-')).toEqual(123.57);
			});

			it('parses "123.561" as 123.56', () => {
				expect(parsePrice('123.561', 'A', '-')).toEqual(123.56);
			});
		});
	});

	describe('with a unit code of "2"', () => {
		describe('with default arguments', () => {
			it('parses "0.000" as 0', () => {
				expect(parsePrice('0.000', '2')).toEqual(0);
			});

			it('parses "377.000" as 377', () => {
				expect(parsePrice('377.000', '2')).toEqual(377);
			});
		});

		describe('with a decimal fraction separator', () => {
			it('parse "0.000" as 0', () => {
				expect(parsePrice('0.000', '2', '.')).toEqual(0);
			});

			it('parses "377.000" as 377', () => {
				expect(parsePrice('377.000', '2', '.')).toEqual(377);
			});

			it('parses "-377.000" as -377', () => {
				expect(parsePrice('-377.000', '2', '.')).toEqual(-377);
			});

			it('parses "377.500" as 377.5', () => {
				expect(parsePrice('377.500', '2', '.')).toEqual(377.5);
			});

			it('parses "377.750" as 377.75', () => {
				expect(parsePrice('377.750', '2', '.')).toEqual(377.75);
			});

			it('parses "3770.750" as 3770.75', () => {
				expect(parsePrice('3770.750', '2', '.')).toEqual(3770.75);
			});

			it('parses "37700.750" as 37700.75', () => {
				expect(parsePrice('37700.750', '2', '.')).toEqual(37700.75);
			});

			it('parses "377000.750" as 377000.75', () => {
				expect(parsePrice('377000.750', '2', '.')).toEqual(377000.75);
			});

			it('parses "3770000.750" as 3770000.75', () => {
				expect(parsePrice('3770000.750', '2', '.')).toEqual(3770000.75);
			});

			it('parses "3770000.000" as 3770000', () => {
				expect(parsePrice('3770000.000', '2', '.')).toEqual(3770000);
			});
		});
	});
});