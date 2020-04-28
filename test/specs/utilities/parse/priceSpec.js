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

		it('parses "123A456" as Number.NaN', () => {
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

		it('parses "123A456" as Number.NaN', () => {
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

		describe('with a decimal fraction separator and a thousands separator', () => {
			it('parses "0.000" as 0', () => {
				expect(parsePrice('0.000', '2', '.', false, ',')).toEqual(0);
			});

			it('parses "377.000" as 377', () => {
				expect(parsePrice('377.000', '2', '.', false, ',')).toEqual(377);
			});

			it('parses "-377.000" as -377', () => {
				expect(parsePrice('-377.000', '2', '.', false, ',')).toEqual(-377);
			});

			it('parses "377.500" as 377.5', () => {
				expect(parsePrice('377.500', '2', '.', false, ',')).toEqual(377.5);
			});

			it('parses "377.750" as 377.75', () => {
				expect(parsePrice('377.750', '2', '.', false, ',')).toEqual(377.75);
			});

			it('parses "3,770.750" as 3770.75', () => {
				expect(parsePrice('3,770.750', '2', '.', false, ',')).toEqual(3770.75);
			});

			it('parses "37,700.750" as 37700.75', () => {
				expect(parsePrice('37,700.750', '2', '.', false, ',')).toEqual(37700.75);
			});

			it('parses "377,000.750" as 377000.75', () => {
				expect(parsePrice('377,000.750', '2', '.', false, ',')).toEqual(377000.75);
			});

			it('parses "-377,000.750" as -377000.75', () => {
				expect(parsePrice('-377,000.750', '2', '.', false, ',')).toEqual(-377000.75);
			});

			it('parses "3,770,000.750" as 3770000.75', () => {
				expect(parsePrice('3,770,000.750', '2', '.', false, ',')).toEqual(3770000.75);
			});

			it('parses "3,770,000.000" as 3770000', () => {
				expect(parsePrice('3,770,000.000', '2', '.', false, ',')).toEqual(3770000);
			});
		});

		describe('with a decimal fraction separator and a thousands separator and parenthetical negatives', () => {
			it('parses "3,770.750" as 3770.75', () => {
				expect(parsePrice('3,770.750', '2', '.', false, ',')).toEqual(3770.75);
			});

			it('parses "(3,770.750)" as -3770.75', () => {
				expect(parsePrice('(3,770.750)', '2', '.', false, ',')).toEqual(-3770.75);
			});

			it('parses "0.000" as 0', () => {
				expect(parsePrice('0.000', '2', '.', false, ',')).toEqual(0);
			});
		});

		describe('with a decimal fraction separator and parenthetical negatives', () => {
			it('parses "3770.750" as 3770.75', () => {
				expect(parsePrice('3770.750', '2', '.', false, '')).toEqual(3770.75);
			});

			it('parses "(3770.750)" -3770.75', () => {
				expect(parsePrice('(3770.750)', '2', '.', false, '')).toEqual(-3770.75);
			});

			it('parses "0.000" as 0', () => {
				expect(parsePrice('0.000', '2', '.', false, '')).toEqual(0);
			});
		});

		describe('with a dash fraction separator', () => {
			it('parses "9.543" as 9.5', () => {
				expect(parsePrice('9-4', '2', '-')).toEqual(9.5);
			});

			it('parses "123-0" as 123', () => {
				expect(parsePrice('123-0', '2', '-')).toEqual(123);
			});

			it('parses "-123-0" as -123', () => {
				expect(parsePrice('-123-0', '2', '-')).toEqual(-123);
			});

			it('parses "123-4" as 123.5', () => {
				expect(parsePrice('123-4', '2', '-')).toEqual(123.5);
			});

			it('parses "-123-4" as -123.5', () => {
				expect(parsePrice('-123-4', '2', '-')).toEqual(-123.5);
			});

			it('parses "0-4" as 0.5', () => {
				expect(parsePrice('0-4', '2', '-')).toEqual(0.5);
			});

			it('parses "0-0" as 0', () => {
				expect(parsePrice('0-0', '2', '-')).toEqual(0);
			});
		});

		describe('with a dash fraction separator and parenthetical negatives', () => {
			it('parses "123-0" as 123', () => {
				expect(parsePrice('123-0', '2', '-', false, '')).toEqual(123);
			});

			it('parses "(123-0)" as -123', () => {
				expect(parsePrice('(123-0)', '2', '-', false, '')).toEqual(-123);
			});

			it('parses "123-4" as 123.5', () => {
				expect(parsePrice('123-4', '2', '-', false, '')).toEqual(123.5);
			});

			it('parses "(123-4)" as -123.5', () => {
				expect(parsePrice('(123-4)', '2', '-', false, '')).toEqual(-123.5);
			});

			it('parses "0-4" as 0.5', () => {
				expect(parsePrice('0-4', '2', '-', false, '')).toEqual(0.5);
			});

			it('parses "(0-4)" -0.5', () => {
				expect(parsePrice('(0-4)', '2', '-', false, '')).toEqual(-0.5);
			});

			it('parses "0" as 0', () => {
				expect(parsePrice('0-0', '2', '-', false, '')).toEqual(0);
			});
		});

		describe('with a tick separator', () => {
			it('parses "123\'0" as 123', () => {
				expect(parsePrice('123\'0', '2', '\'')).toEqual(123);
			});

			it('parses "123\'4" as 123.5', () => {
				expect(parsePrice('123\'4', '2', '\'')).toEqual(123.5);
			});

			it('parses "-123\'4" as -123.5', () => {
				expect(parsePrice('-123\'4', '2', '\'')).toEqual(-123.5);
			});

			it('parses "0\'4" as 0.5', () => {
				expect(parsePrice('0\'4', '2', '\'')).toEqual(0.5);
			});

			it('formats "-0\'4" as -0.5', () => {
				expect(parsePrice('-0\'4', '2', '\'')).toEqual(-0.5);
			});

			it('formats "0\'0" as 0', () => {
				expect(parsePrice('0\'0', '2', '\'')).toEqual(0);
			});
		});

		describe('with a tick separator and parenthetical negatives', () => {
			it('parses "123\'4" as 123.5', () => {
				expect(parsePrice('123\'4', '2', '\'', false, '', true)).toEqual(123.5);
			});

			it('parses "(123\'4)" as -123.5', () => {
				expect(parsePrice('(123\'4)', '2', '\'', false, '', true)).toEqual(-123.5);
			});

			it('parses "0\'4" as 0.5', () => {
				expect(parsePrice('0\'4', '2', '\'', false, '', true)).toEqual(0.5);
			});

			it('parses "(0\'4)" as -0.5', () => {
				expect(parsePrice('(0\'4)', '2', '\'', false, '', true)).toEqual(-0.5);
			});

			it('parses "0\'0" as 0', () => {
				expect(parsePrice('0\'0', '2', '\'', false, '', true)).toEqual(0);
			});
		});

		describe('with a zero-length separator', () => {
			it('parses "1230" as 123', () => {
				expect(parsePrice('1230', '2', '')).toEqual(123);
			});

			it('parses "1234" as 123.5', () => {
				expect(parsePrice('1234', '2', '')).toEqual(123.5);
			});

			it('parses "4" as 0.5', () => {
				expect(parsePrice('4', '2', '')).toEqual(0.5);
			});

			it('parses "0" as 0', () => {
				expect(parsePrice('0', '2', '')).toEqual(0);
			});
		});

		describe('with a zero-length separator and parenthetical negatives', () => {
			describe('with no separator and no special fractions', () => {
				it('parses "4" as 0.5', () => {
					expect(parsePrice('4', '2', '', false, '')).toEqual(0.5);
				});

				it('parses "(4)" as -0.5', () => {
					expect(parsePrice('(4)', '2', '', false, '')).toEqual(-0.5);
				});

				it('parses "0" as 0', () => {
					expect(parsePrice('0', '2', '', false, '')).toEqual(0);
				});
			});
		});
	});

	describe('with a unit code of "5"', () => {
		describe('with a dash fraction separator and special fractions', () => {
			it('parses "123-200" as 123.625', () => {
				expect(parsePrice('123-200', '5', '-', true)).toEqual(123.625);
			});

			it('parses "-123-200" as -123.625', () => {
				expect(parsePrice('-123-200', '5', '-', true)).toEqual(-123.625);
			});

			it('parses "123-205" as 123.640625', () => {
				expect(parsePrice('123-205', '5', '-', true)).toEqual(123.640625);
			});

			it('parses "-123-205" as -123.640625', () => {
				expect(parsePrice('-123-205', '5', '-', true)).toEqual(-123.640625);
			});

			it('parses "122-225" as 122.703125', () => {
				expect(parsePrice('122-225', '5', '-', true)).toEqual(122.703125);
			});

			it('parses "0-000" as 0', () => {
				expect(parsePrice('0-000', '5', '-', true)).toEqual(0);
			});
		});

		describe('with a dash fraction separator and special fractions and parenthetical negatives', () => {
			it('parses "123-200" as 123.625', () => {
				expect(parsePrice('123-200', '5', '-', true, '', true)).toEqual(123.625);
			});

			it('parses "(123-200)" as -123.625', () => {
				expect(parsePrice('(123-200)', '5', '-', true, '', true)).toEqual(-123.625);
			});

			it('parses "123-205" as 123.640625', () => {
				expect(parsePrice('123-205', '5', '-', true, '', true)).toEqual(123.640625);
			});

			it('parses "(123-205)" as -123.640625', () => {
				expect(parsePrice('(123-205)', '5', '-', true, '', true)).toEqual(-123.640625);
			});
		});
	});

	describe('with a unit code of "6"', () => {
		describe('with a dash fraction separator and special fractions', () => {
			it('parses "114-165" as 114.515625 ', () => {
				expect(parsePrice('114-165', '6', '-', true)).toEqual(114.515625);
			});

			it('parses "114-252" as 114.7875', () => {
				expect(parsePrice('114-252', '6', '-', true)).toEqual(114.7875);
			});

			it('parses "114-270" as 114.84375', () => {
				expect(parsePrice('114-270', '6', '-', true)).toEqual(114.84375);
			});

			it('parses "114-240" as 114.75', () => {
				expect(parsePrice('114-240', '6', '-', true)).toEqual(114.75);
			});

			it('parses "0-000" as 0', () => {
				expect(parsePrice('0-000', '6', '-', true)).toEqual(0);
			});
		});
	});

	describe('with a unit code of "8"', () => {
		describe('with a decimal fraction separator', () => {
			it('parses "0" as 0', () => {
				expect(parsePrice('0', '8', '.')).toEqual(0);
			});

			it('parses "1000" as 1000', () => {
				expect(parsePrice('1000', '8', '.')).toEqual(1000);
			});
		});

		describe('with a decimal separator and a thousands separator', () => {
			it('parses "0" as 0', () => {
				expect(parsePrice('0', '8', '.', false, ',')).toEqual(0);
			});

			it('parses "1,000" as 1000', () => {
				expect(parsePrice('1,000', '8', '.', false, ',')).toEqual(1000);
			});
		});
	});

	describe('with ad hoc settings from previous unit tests', () => {
		it('parses "125-5" as 125.625 (with unit code 2)', () => {
			expect(parsePrice('125-5', '2')).toEqual(125.625);
		});

		it('parses "-125-5" as -125.625 (with unit code 2)', () => {
			expect(parsePrice('-125-5', '2')).toEqual(-125.625);
		});

		it('parses "125-240" as 125.75 (with unit code 5, using special fractions)', () => {
			expect(parsePrice('125-240', '5', '-', true)).toEqual(125.75);
		});

		it('parses "-125-240" as -125.75 (with unit code 5, using special fractions)', () => {
			expect(parsePrice('-125-240', '5', '-', true)).toEqual(-125.75);
		});
	});

	describe('with insufficient data to infer correct settings', () => {
		it('parses "125-240" as Number.NaN (with unit code 5 where "special fractions" cannot be inferred)', () => {
			expect(parsePrice('125-240', '5')).toEqual(Number.NaN);
		});
	});
});