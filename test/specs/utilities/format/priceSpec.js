const formatPrice = require('./../../../../lib/utilities/format/price');

describe('when invalid prices are formatted (regardless of other settings)', () => {
	it('formats an undefined value as a zero-length string', () => {
		expect(formatPrice()).toEqual('');
	});

	it('formats a null value as a zero-length string', () => {
		expect(formatPrice(null)).toEqual('');
	});

	it('formats a Number.NaN value as a zero-length string', () => {
		expect(formatPrice(Number.NaN)).toEqual('');
	});

	it('formats a zero-length string as a zero-length string', () => {
		expect(formatPrice('')).toEqual('');
	});

	it('formats the string "bob" as a zero-length string', () => {
		expect(formatPrice('bob')).toEqual('');
	});

	it('formats the string "123" as a zero-length string', () => {
		expect(formatPrice('123')).toEqual('');
	});

	it('formats an empty object as a zero-length string', () => {
		expect(formatPrice({ })).toEqual('');
	});
});

describe('when valid prices are formatted', () => {
	describe('with a unit code of "A"', () => {
		describe('with a decimal fraction separator', () => {
			it('formats 0 as "0.00"', () => {
				expect(formatPrice(0, 'A', '.', false)).toEqual('0.00');
			});

			it('formats 123 as "123.00"', () => {
				expect(formatPrice(123, 'A', '.', false)).toEqual('123.00');
			});

			it('formats 123.5 as "123.50"', () => {
				expect(formatPrice(123.5, 'A', '.', false)).toEqual('123.50');
			});

			it('formats 123.555 as "123.56"', () => {
				expect(formatPrice(123.555, 'A', '.', false)).toEqual('123.56');
			});
		});

		describe('with a dash fraction separator', () => {
			it('formats 0 as "0.00"', () => {
				expect(formatPrice(0, 'A', '-', false)).toEqual('0.00');
			});

			it('formats 123 as "123.00"', () => {
				expect(formatPrice(123, 'A', '-', false)).toEqual('123.00');
			});

			it('formats 123.5 as "123.50"', () => {
				expect(formatPrice(123.5, 'A', '-', false)).toEqual('123.50');
			});

			it('formats 123.555 as "123.56"', () => {
				expect(formatPrice(123.555, 'A', '-', false)).toEqual('123.56');
			});
		});
	});
	
	describe('with a unit code of "2"', () => {
		describe('with default arguments', () => {
			it('formats 0 as "0.000"', () => {
				expect(formatPrice(0, '2')).toEqual('0.000');
			});

			it('formats 377 as "377.000"', () => {
				expect(formatPrice(377, '2')).toEqual('377.000');
			});
		});

		describe('with a decimal fraction separator', () => {
			it('formats 0 as "0.000"', () => {
				expect(formatPrice(0, '2', '.')).toEqual('0.000');
			});

			it('formats 377 as "377.000"', () => {
				expect(formatPrice(377, '2', '.')).toEqual('377.000');
			});

			it('formats -377 as "-377.000"', () => {
				expect(formatPrice(-377, '2', '.')).toEqual('-377.000');
			});

			it('formats 377.5 as "377.500"', () => {
				expect(formatPrice(377.5, '2', '.')).toEqual('377.500');
			});

			it('formats 377.75 as "377.750"', () => {
				expect(formatPrice(377.75, '2', '.')).toEqual('377.750');
			});

			it('formats 3770.75 as "3770.750"', () => {
				expect(formatPrice(3770.75, '2', '.')).toEqual('3770.750');
			});

			it('formats 37700.75 as "37700.750"', () => {
				expect(formatPrice(37700.75, '2', '.')).toEqual('37700.750');
			});

			it('formats 377000.75 as "377000.750"', () => {
				expect(formatPrice(377000.75, '2', '.')).toEqual('377000.750');
			});

			it('formats 3770000.75 as "3770000.750"', () => {
				expect(formatPrice(3770000.75, '2', '.')).toEqual('3770000.750');
			});

			it('formats 3770000 as "3770000.000"', () => {
				expect(formatPrice(3770000, '2', '.')).toEqual('3770000.000');
			});
		});

		describe('with a decimal fraction separator and a thousands separator', () => {
			it('formats 0 as "0.000"', () => {
				expect(formatPrice(0, '2', '.', false, ',')).toEqual('0.000');
			});
			
			it('formats 377 as "377.000"', () => {
				expect(formatPrice(377, '2', '.', false, ',')).toEqual('377.000');
			});

			it('formats -377 as "-377.000"', () => {
				expect(formatPrice(-377, '2', '.', false, ',')).toEqual('-377.000');
			});

			it('formats 377.5 as "377.500"', () => {
				expect(formatPrice(377.5, '2', '.', false, ',')).toEqual('377.500');
			});

			it('formats 377.75 as "377.750"', () => {
				expect(formatPrice(377.75, '2', '.', false, ',')).toEqual('377.750');
			});

			it('formats 3770.75 as "3,770.750"', () => {
				expect(formatPrice(3770.75, '2', '.', false, ',')).toEqual('3,770.750');
			});

			it('formats 37700.75 as "37,700.750"', () => {
				expect(formatPrice(37700.75, '2', '.', false, ',')).toEqual('37,700.750');
			});

			it('formats 377000.75 as "377,000.750"', () => {
				expect(formatPrice(377000.75, '2', '.', false, ',')).toEqual('377,000.750');
			});

			it('formats -377000.75 as "-377,000.750"', () => {
				expect(formatPrice(-377000.75, '2', '.', false, ',')).toEqual('-377,000.750');
			});

			it('formats 3770000.75 as "3,770,000.750"', () => {
				expect(formatPrice(3770000.75, '2', '.', false, ',')).toEqual('3,770,000.750');
			});

			it('formats 3770000 as "3,770,000.000"', () => {
				expect(formatPrice(3770000, '2', '.', false, ',')).toEqual('3,770,000.000');
			});
		});

		describe('with a decimal fraction separator and a thousands separator and parenthetical negatives', () => {
			it('formats 3770.75 as "3,770.750"', () => {
				expect(formatPrice(3770.75, '2', '.', false, ',', true)).toEqual('3,770.750');
			});

			it('formats -3770.75 as "(3,770.750)"', () => {
				expect(formatPrice(-3770.75, '2', '.', false, ',', true)).toEqual('(3,770.750)');
			});

			it('formats 0 as "0.000"', () => {
				expect(formatPrice(0, '2', '.', false, ',', true)).toEqual('0.000');
			});
		});

		describe('with a decimal separator and parenthetical negatives', () => {
			it('formats 3770.75 as "3770.750"', () => {
				expect(formatPrice(3770.75, '2', '.', false, '', true)).toEqual('3770.750');
			});

			it('formats -3770.75 as "(3770.750)"', () => {
				expect(formatPrice(-3770.75, '2', '.', false, '', true)).toEqual('(3770.750)');
			});

			it('formats 0 as "0.000"', () => {
				expect(formatPrice(0, '2', '.', false, '', true)).toEqual('0.000');
			});
		});

		describe('with a dash fraction separator', () => {
			it('formats 123 as "123-0"', () => {
				expect(formatPrice(123, '2', '-')).toEqual('123-0');
			});

			it('formats -123 as "-123-0"', () => {
				expect(formatPrice(-123, '2', '-')).toEqual('-123-0');
			});

			it('formats 123.5 as "123-4"', () => {
				expect(formatPrice(123.5, '2', '-')).toEqual('123-4');
			});

			it('formats -123.5 as "-123-4"', () => {
				expect(formatPrice(-123.5, '2', '-')).toEqual('-123-4');
			});

			it('formats 0.5 as "0-4"', () => {
				expect(formatPrice(0.5, '2', '-')).toEqual('0-4');
			});

			it('formats 0 as "0-0"', () => {
				expect(formatPrice(0, '2', '-')).toEqual('0-0');
			});
		});

		describe('with a dash fraction separator and parenthetical negatives', () => {
			it('formats 123 as "123-0"', () => {
				expect(formatPrice(123, '2', '-', false, '', true)).toEqual('123-0');
			});

			it('formats -123 as "(123-0)"', () => {
				expect(formatPrice(-123, '2', '-', false, '', true)).toEqual('(123-0)');
			});

			it('formats 123.5 as "123-4"', () => {
				expect(formatPrice(123.5, '2', '-', false, '', true)).toEqual('123-4');
			});

			it('formats -123.5 as "(123-4)"', () => {
				expect(formatPrice(-123.5, '2', '-', false, '', true)).toEqual('(123-4)');
			});

			it('formats 0.5 as "0-4"', () => {
				expect(formatPrice(0.5, '2', '-', false, '', true)).toEqual('0-4');
			});

			it('formats -0.5 as "(0-4)"', () => {
				expect(formatPrice(-0.5, '2', '-', false, '', true)).toEqual('(0-4)');
			});

			it('formats 0 as "0"', () => {
				expect(formatPrice(0, '2', '-', false, '', true)).toEqual('0-0');
			});
		});

		describe('with a tick separator', () => {
			it('formats 123 as "123\'0"', () => {
				expect(formatPrice(123, '2', '\'')).toEqual('123\'0');
			});

			it('formats 123.5 as "123\'4"', () => {
				expect(formatPrice(123.5, '2', '\'')).toEqual('123\'4');
			});

			it('formats -123.5 as "-123\'4"', () => {
				expect(formatPrice(-123.5, '2', '\'')).toEqual('-123\'4');
			});

			it('formats 0.5 as "0\'4"', () => {
				expect(formatPrice(0.5, '2', '\'')).toEqual('0\'4');
			});

			it('formats -0.5 as "-0\'4"', () => {
				expect(formatPrice(-0.5, '2', '\'')).toEqual('-0\'4');
			});

			it('formats 0 as "0\'0"', () => {
				expect(formatPrice(0, '2', '\'')).toEqual('0\'0');
			});
		});

		describe('with a tick separator and parenthetical negatives', () => {
			it('formats 123.5 as "123\'4"', () => {
				expect(formatPrice(123.5, '2', '\'', false, '', true)).toEqual('123\'4');
			});

			it('formats -123.5 as "(123\'4)"', () => {
				expect(formatPrice(-123.5, '2', '\'', false, '', true)).toEqual('(123\'4)');
			});

			it('formats 0.5 as "0\'4"', () => {
				expect(formatPrice(0.5, '2', '\'', false, '', true)).toEqual('0\'4');
			});

			it('formats -0.5 as "(0\'4)"', () => {
				expect(formatPrice(-0.5, '2', '\'', false, '', true)).toEqual('(0\'4)');
			});

			it('formats 0 as "0\'0"', () => {
				expect(formatPrice(0, '2', '\'', false, '', true)).toEqual('0\'0');
			});
		});

		describe('with a zero-length separator', () => {
			it('formats 123 as "1230"', () => {
				expect(formatPrice(123, '2', '')).toEqual('1230');
			});

			it('formats 123.5 as "1234"', () => {
				expect(formatPrice(123.5, '2', '')).toEqual('1234');
			});

			it('formats 0.5 as "4"', () => {
				expect(formatPrice(0.5, '2', '')).toEqual('4');
			});

			it('formats 0 as "0"', () => {
				expect(formatPrice(0, '2', '')).toEqual('0');
			});
		});

		describe('with a zero-length separator and parenthetical negatives', () => {
			describe('with no separator and no special fractions', () => {
				it('formats 0.5 as "4"', () => {
					expect(formatPrice(0.5, '2', '', false, '', true)).toEqual('4');
				});

				it('formats -0.5 as "(4)"', () => {
					expect(formatPrice(-0.5, '2', '', false, '', true)).toEqual('(4)');
				});

				it('formats 0 as "0"', () => {
					expect(formatPrice(0, '2', '', false, '', true)).toEqual('0');
				});
			});
		});
	});

	describe('with a unit code of "5"', () => {
		describe('with a dash fraction separator and special fractions', () => {
			it('formats 123.625 as "123-200"', () => {
				expect(formatPrice(123.625, '5', '-', true)).toEqual('123-200');
			});

			it('formats -123.625 as "-123-200"', () => {
				expect(formatPrice(-123.625, '5', '-', true)).toEqual('-123-200');
			});

			it('formats 123.640625 as "123-205"', () => {
				expect(formatPrice(123.640625, '5', '-', true)).toEqual('123-205');
			});

			it('formats -123.640625 as "-123-205"', () => {
				expect(formatPrice(-123.640625, '5', '-', true)).toEqual('-123-205');
			});

			it('formats 122.7031 as "122-225"', () => {
				expect(formatPrice(122.7031, '5', '-', true)).toEqual('122-225');
			});

			it('formats 0 as "0-000"', () => {
				expect(formatPrice(0, '5', '-', true)).toEqual('0-000');
			});
		});

		describe('with a dash fraction separator and special fractions and parenthetical negatives', () => {
			it('formats 123.625 as "123-200"', () => {
				expect(formatPrice(123.625, '5', '-', true, '', true)).toEqual('123-200');
			});

			it('formats -123.625 as "(123-200)"', () => {
				expect(formatPrice(-123.625, '5', '-', true, '', true)).toEqual('(123-200)');
			});

			it('formats 123.640625 as "123-205"', () => {
				expect(formatPrice(123.640625, '5', '-', true, '', true)).toEqual('123-205');
			});

			it('formats -123.640625 as "(123-205)"', () => {
				expect(formatPrice(-123.640625, '5', '-', true, '', true)).toEqual('(123-205)');
			});
		});
	});

	describe('with a unit code of "6"', () => {
		describe('with a dash fraction separator and special fractions', () => {
			it('formats 114.5156 as "114-165"', () => {
				expect(formatPrice(114.5156, '6', '-', true)).toEqual('114-165');
			});

			it('formats 114.7891 as "114-252"', () => {
				expect(formatPrice(114.7891, '6', '-', true)).toEqual('114-252');
			});

			it('formats 114.8438 as "114-270"', () => {
				expect(formatPrice(114.8438, '6', '-', true)).toEqual('114-270');
			});

			it('formats 114.75 as "114-240"', () => {
				expect(formatPrice(114.75, '6', '-', true)).toEqual('114-240');
			});

			it('formats 0 as "0-000"', () => {
				expect(formatPrice(0, '6', '-', true)).toEqual('0-000');
			});
		});
	});
	
	describe('with a unit code of "8"', () => {
		describe('with a decimal fraction separator', () => {
			it('formats 0 as "0"', () => {
				expect(formatPrice(0, '8', '.')).toEqual('0');
			});

			it('formats 1000 as "1000"', () => {
				expect(formatPrice(1000, '8', '.')).toEqual('1000');
			});
		});

		describe('with a decimal separator and a thousands separator', () => {
			it('formats 0 as "0"', () => {
				expect(formatPrice(0, '8', '.', false, ',')).toEqual('0');
			});

			it('formats 1000 as "1,000"', () => {
				expect(formatPrice(1000, '8', '.', false, ',')).toEqual('1,000');
			});
		});
	});

	describe('with an invalid unit code', () => {
		it('formats 377 as "" (when omitted)', () => {
			expect(formatPrice(377)).toEqual('');
		});

		it('formats 377 as "" (when null)', () => {
			expect(formatPrice(377, null)).toEqual('');
		});

		it('formats 377 as "" (when numeric)', () => {
			expect(formatPrice(377, 2)).toEqual('');
		});

		it('formats 377 as "999" (when multiple characters are used)', () => {
			expect(formatPrice(377, '999')).toEqual('');
		});

		it('formats 377 as "999" (when a single character -- but an invalid unit code -- "1")', () => {
			expect(formatPrice(377, '1')).toEqual('');
		});

		it('formats 377 as "999" (when a single character -- but an invalid unit code -- "F")', () => {
			expect(formatPrice(377, 'F')).toEqual('');
		});

		it('formats 377 as "999" (when a single character -- but an invalid unit code -- "a")', () => {
			expect(formatPrice(377, 'a')).toEqual('');
		});
	});
});