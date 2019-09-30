const buildPriceFormatter = require('./../../../../../lib/utilities/format/factories/price');

describe('When a price formatter is created', () => {
	let formatPrice;

	describe('with a decimal separator', () => {
		beforeEach(() => {
			formatPrice = buildPriceFormatter('.');
		});

		it('formats 377 (with unit code 2) as "377.000"', () => {
			expect(formatPrice(377, '2')).toEqual('377.000');
		});

		it('formats -377 (with unit code 2) as "-377.000"', () => {
			expect(formatPrice(-377, '2')).toEqual('-377.000');
		});

		it('formats 377.5 (with unit code 2) as "377.500"', () => {
			expect(formatPrice(377.5, '2')).toEqual('377.500');
		});

		it('formats 377.75 (with unit code 2) as "377.750"', () => {
			expect(formatPrice(377.75, '2')).toEqual('377.750');
		});

		it('formats 3770.75 (with unit code 2) as "3770.750"', () => {
			expect(formatPrice(3770.75, '2')).toEqual('3770.750');
		});

		it('formats 37700.75 (with unit code 2) as "37700.750"', () => {
			expect(formatPrice(37700.75, '2')).toEqual('37700.750');
		});

		it('formats 377000.75 (with unit code 2) as "377000.750"', () => {
			expect(formatPrice(377000.75, '2')).toEqual('377000.750');
		});

		it('formats 3770000.75 (with unit code 2) as "3770000.750"', () => {
			expect(formatPrice(3770000.75, '2')).toEqual('3770000.750');
		});

		it('formats 3770000 (with unit code 2) as "3770000.000"', () => {
			expect(formatPrice(3770000, '2')).toEqual('3770000.000');
		});

		it('formats 0 (with unit code 2) as "0.000"', () => {
			expect(formatPrice(0, '2')).toEqual('0.000');
		});

		it('formats undefined (with unit code 2) as zero-length string', () => {
			expect(formatPrice(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', () => {
			expect(formatPrice(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', () => {
			expect(formatPrice(Number.NaN, '2')).toEqual('');
		});

		it('formats 0 (with unit code 8) as "0"', () => {
			expect(formatPrice(0, '8')).toEqual('0');
		});

		it('formats 1000 (with unit code 8) as "1000"', () => {
			expect(formatPrice(1000, '8')).toEqual('1000');
		});
	});

	describe('with a decimal separator, no special fractions, and a thousands separator', () => {
		beforeEach(() => {
			formatPrice = buildPriceFormatter('.', false, ',');
		});

		it('formats 377 (with unit code 2) as "377.000"', () => {
			expect(formatPrice(377, '2')).toEqual('377.000');
		});

		it('formats -377 (with unit code 2) as "-377.000"', () => {
			expect(formatPrice(-377, '2')).toEqual('-377.000');
		});

		it('formats 377.5 (with unit code 2) as "377.500"', () => {
			expect(formatPrice(377.5, '2')).toEqual('377.500');
		});

		it('formats 377.75 (with unit code 2) as "377.750"', () => {
			expect(formatPrice(377.75, '2')).toEqual('377.750');
		});

		it('formats 3770.75 (with unit code 2) as "3,770.750"', () => {
			expect(formatPrice(3770.75, '2')).toEqual('3,770.750');
		});

		it('formats 37700.75 (with unit code 2) as "37,700.750"', () => {
			expect(formatPrice(37700.75, '2')).toEqual('37,700.750');
		});

		it('formats 377000.75 (with unit code 2) as "377,000.750"', () => {
			expect(formatPrice(377000.75, '2')).toEqual('377,000.750');
		});

		it('formats -377000.75 (with unit code 2) as "-377,000.750"', () => {
			expect(formatPrice(-377000.75, '2')).toEqual('-377,000.750');
		});

		it('formats 3770000.75 (with unit code 2) as "3,770,000.750"', () => {
			expect(formatPrice(3770000.75, '2')).toEqual('3,770,000.750');
		});

		it('formats 3770000 (with unit code 2) as "3,770,000.000"', () => {
			expect(formatPrice(3770000, '2')).toEqual('3,770,000.000');
		});

		it('formats 0 (with unit code 2) as "0.000"', () => {
			expect(formatPrice(0, '2')).toEqual('0.000');
		});

		it('formats undefined (with unit code 2) as zero-length string', () => {
			expect(formatPrice(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', () => {
			expect(formatPrice(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', () => {
			expect(formatPrice(Number.NaN, '2')).toEqual('');
		});

		it('formats 0 (with unit code 8) as "0"', () => {
			expect(formatPrice(0, '8')).toEqual('0');
		});

		it('formats 1000 (with unit code 8) as "1,000"', () => {
			expect(formatPrice(1000, '8')).toEqual('1,000');
		});
	});

	describe('with a dash separator and no special fractions', () => {
		beforeEach(() => {
			formatPrice = buildPriceFormatter('-', false);
		});

		it('formats 123 (with unit code 2) as "123-0"', () => {
			expect(formatPrice(123, '2')).toEqual('123-0');
		});

		it('formats -123 (with unit code 2) as "-123-0"', () => {
			expect(formatPrice(-123, '2')).toEqual('-123-0');
		});

		it('formats 123.5 (with unit code 2) as "123-4"', () => {
			expect(formatPrice(123.5, '2')).toEqual('123-4');
		});

		it('formats -123.5 (with unit code 2) as "-123-4"', () => {
			expect(formatPrice(-123.5, '2')).toEqual('-123-4');
		});

		it('formats 0.5 (with unit code 2) as "0-4"', () => {
			expect(formatPrice(0.5, '2')).toEqual('0-4');
		});

		it('formats 0 (with unit code 2) as "0-0"', () => {
			expect(formatPrice(0, '2')).toEqual('0-0');
		});

		it('formats zero-length string (with unit code 2) as zero-length string', () => {
			expect(formatPrice('', '2')).toEqual('');
		});

		it('formats undefined (with unit code 2) as zero-length string', () => {
			expect(formatPrice(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', () => {
			expect(formatPrice(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', () => {
			expect(formatPrice(Number.NaN, '2')).toEqual('');
		});

		it('formats 123 (with unit code A) as "123.00"', () => {
			expect(formatPrice(123, 'A')).toEqual('123.00');
		});

		it('formats 123.5 (with unit code A) as "123.50"', () => {
			expect(formatPrice(123.5, 'A')).toEqual('123.50');
		});

		it('formats 123.555 (with unit code A) as "123.56"', () => {
			expect(formatPrice(123.555, 'A')).toEqual('123.56');
		});
	});

	describe('with a dash separator and special fractions', () => {
		beforeEach(() => {
			formatPrice = buildPriceFormatter('-', true);
		});

		it('formats 123.625 (with unit code 5) as "123-200"', () => {
			expect(formatPrice(123.625, '5')).toEqual('123-200');
		});

		it('formats -123.625 (with unit code 5) as "-123-200"', () => {
			expect(formatPrice(-123.625, '5')).toEqual('-123-200');
		});

		it('formats 123.640625 (with unit code 5) as "123-205"', () => {
			expect(formatPrice(123.640625, '5')).toEqual('123-205');
		});

		it('formats -123.640625 (with unit code 5) as "-123-205"', () => {
			expect(formatPrice(-123.640625, '5')).toEqual('-123-205');
		});

		it('formats 114.5156 (with unit code 6) as "114-165"', () => {
			expect(formatPrice(114.5156, '6')).toEqual('114-165');
		});

		it('formats 114.7891 (with unit code 6) as "114-252"', () => {
			expect(formatPrice(114.7891, '6')).toEqual('114-252');
		});

		it('formats 114.8438 (with unit code 6) as "114-270"', () => {
			expect(formatPrice(114.8438, '6')).toEqual('114-270');
		});

		it('formats 114.75 (with unit code 6) as "114-240"', () => {
			expect(formatPrice(114.75, '6')).toEqual('114-240');
		});

		it('formats 122.7031 (with unit code 5) as "122-225"', () => {
			expect(formatPrice(122.7031, '5')).toEqual('122-225');
		});

		it('formats 0 (with unit code 2) as "0"', function () {
			expect(formatPrice(0, '2')).toEqual('0-0');
		});
	});

	describe('with a tick separator and no special fractions', () => {
		beforeEach(() => {
			formatPrice = buildPriceFormatter('\'', false);
		});

		it('formats 123 (with unit code 2) as "123\'0"', () => {
			expect(formatPrice(123, '2')).toEqual('123\'0');
		});

		it('formats 123.5 (with unit code 2) as "123\'4"', () => {
			expect(formatPrice(123.5, '2')).toEqual('123\'4');
		});

		it('formats -123.5 (with unit code 2) as "-123\'4"', () => {
			expect(formatPrice(-123.5, '2')).toEqual('-123\'4');
		});

		it('formats 0.5 (with unit code 2) as "0\'4"', () => {
			expect(formatPrice(0.5, '2')).toEqual('0\'4');
		});

		it('formats -0.5 (with unit code 2) as "-0\'4"', () => {
			expect(formatPrice(-0.5, '2')).toEqual('-0\'4');
		});

		it('formats 0 (with unit code 2) as "0\'0"', () => {
			expect(formatPrice(0, '2')).toEqual('0\'0');
		});

		it('formats zero-length string (with unit code 2) as zero-length string', () => {
			expect(formatPrice('', '2')).toEqual('');
		});

		it('formats undefined (with unit code 2) as zero-length string', () => {
			expect(formatPrice(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', () => {
			expect(formatPrice(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', () => {
			expect(formatPrice(Number.NaN, '2')).toEqual('');
		});
	});

	describe('with no separator and no special fractions', () => {
		beforeEach(() => {
			formatPrice = buildPriceFormatter('', false);
		});

		it('formats 123 (with unit code 2) as "1230"', () => {
			expect(formatPrice(123, '2')).toEqual('1230');
		});

		it('formats 123.5 (with unit code 2) as "1234"', () => {
			expect(formatPrice(123.5, '2')).toEqual('1234');
		});

		it('formats 0.5 (with unit code 2) as "4"', () => {
			expect(formatPrice(0.5, '2')).toEqual('4');
		});

		it('formats 0 (with unit code 2) as "0"', () => {
			expect(formatPrice(0, '2')).toEqual('0');
		});

		it('formats zero-length string (with unit code 2) as zero-length string', () => {
			expect(formatPrice('', '2')).toEqual('');
		});

		it('formats undefined (with unit code 2) as zero-length string', () => {
			expect(formatPrice(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', () => {
			expect(formatPrice(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', () => {
			expect(formatPrice(Number.NaN, '2')).toEqual('');
		});
	});

	describe('with parenthetical negatives', () => {
		describe('and a decimal separator, no special fractions, and no thousands separator', () => {
			beforeEach(() => {
				formatPrice = buildPriceFormatter('.', false, '', true);
			});

			it('formats 3770.75 (with unit code 2) as "3770.750"', () => {
				expect(formatPrice(3770.75, '2')).toEqual('3770.750');
			});

			it('formats -3770.75 (with unit code 2) as "(3770.750)"', () => {
				expect(formatPrice(-3770.75, '2')).toEqual('(3770.750)');
			});

			it('formats 0 (with unit code 2) as "0.000"', () => {
				expect(formatPrice(0, '2')).toEqual('0.000');
			});
		});

		describe('with a decimal separator, no special fractions, and a thousands separator', () => {
			beforeEach(function () {
				formatPrice = buildPriceFormatter('.', false, ',', true);
			});

			it('formats 3770.75 (with unit code 2) as "3,770.750"', () => {
				expect(formatPrice(3770.75, '2')).toEqual('3,770.750');
			});

			it('formats -3770.75 (with unit code 2) as "(3,770.750)"', () => {
				expect(formatPrice(-3770.75, '2')).toEqual('(3,770.750)');
			});

			it('formats 0 (with unit code 2) as "0.000"', () => {
				expect(formatPrice(0, '2')).toEqual('0.000');
			});
		});

		describe('with a dash separator and no special fractions', () => {
			beforeEach(function () {
				formatPrice = buildPriceFormatter('-', false, '', true);
			});

			it('formats 123 (with unit code 2) as "123-0"', function () {
				expect(formatPrice(123, '2')).toEqual('123-0');
			});

			it('formats -123 (with unit code 2) as "(123-0)"', function () {
				expect(formatPrice(-123, '2')).toEqual('(123-0)');
			});

			it('formats 123.5 (with unit code 2) as "123-4"', function () {
				expect(formatPrice(123.5, '2')).toEqual('123-4');
			});

			it('formats -123.5 (with unit code 2) as "(123-4)"', function () {
				expect(formatPrice(-123.5, '2')).toEqual('(123-4)');
			});

			it('formats 0.5 (with unit code 2) as "0-4"', () => {
				expect(formatPrice(0.5, '2')).toEqual('0-4');
			});

			it('formats -0.5 (with unit code 2) as "(0-4)"', () => {
				expect(formatPrice(-0.5, '2')).toEqual('(0-4)');
			});

			it('formats 0 (with unit code 2) as "0"', function () {
				expect(formatPrice(0, '2')).toEqual('0-0');
			});
		});

		describe('with a dash separator and special fractions', () => {
			beforeEach(() => {
				formatPrice = buildPriceFormatter('-', true, '', true);
			});

			it('formats 123.625 (with unit code 5) as "123-200"', () => {
				expect(formatPrice(123.625, '5')).toEqual('123-200');
			});

			it('formats -123.625 (with unit code 5) as "(123-200)"', () => {
				expect(formatPrice(-123.625, '5')).toEqual('(123-200)');
			});

			it('formats 123.640625 (with unit code 5) as "123-205"', () => {
				expect(formatPrice(123.640625, '5')).toEqual('123-205');
			});

			it('formats -123.640625 (with unit code 5) as "(123-205)"', () => {
				expect(formatPrice(-123.640625, '5')).toEqual('(123-205)');
			});
		});

		describe('with a tick separator and no special fractions', () => {
			beforeEach(function () {
				formatPrice = buildPriceFormatter('\'', false, '', true);
			});

			it('formats 123.5 (with unit code 2) as "123\'4"', function () {
				expect(formatPrice(123.5, '2')).toEqual('123\'4');
			});

			it('formats -123.5 (with unit code 2) as "(123\'4)"', function () {
				expect(formatPrice(-123.5, '2')).toEqual('(123\'4)');
			});

			it('formats 0.5 (with unit code 2) as "0\'4"', () => {
				expect(formatPrice(0.5, '2')).toEqual('0\'4');
			});

			it('formats -0.5 (with unit code 2) as "(0\'4)"', () => {
				expect(formatPrice(-0.5, '2')).toEqual('(0\'4)');
			});

			it('formats 0 (with unit code 2) as "0\'0"', () => {
				expect(formatPrice(0, '2')).toEqual('0\'0');
			});
		});

		describe('with no separator and no special fractions', () => {
			beforeEach(function () {
				formatPrice = buildPriceFormatter('', false, '', true);
			});

			it('formats 0.5 (with unit code 2) as "4"', function () {
				expect(formatPrice(0.5, '2')).toEqual('4');
			});

			it('formats -0.5 (with unit code 2) as "(4)"', function () {
				expect(formatPrice(-0.5, '2')).toEqual('(4)');
			});

			it('formats 0 (with unit code 2) as "0"', function () {
				expect(formatPrice(0, '2')).toEqual('0');
			});
		});
	});
});