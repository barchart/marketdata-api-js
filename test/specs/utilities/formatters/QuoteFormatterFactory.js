const QuoteFormatterFactory = require('./../../../../lib/utilities/formatters/QuoteFormatterFactory');

describe('When a time formatter is created (without specifying the clock)', () => {
	let qf;

	beforeEach(() => {
		qf = QuoteFormatterFactory.build();
	});

	describe('and a quote is formatted (with no "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "00:00:00"', () => {
				expect(qf(quote)).toEqual('00:00:00');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00:00"', () => {
				expect(qf(quote)).toEqual('12:00:00');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08:09"', () => {
				expect(qf(quote)).toEqual('07:08:09');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "13:08:09"', () => {
				expect(qf(quote)).toEqual('13:08:09');
			});
		});

		describe('and the quote time is 1:08:09 PM and timezone is present', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
				quote.timezone = 'CST';
			});

			it('the formatter outputs "13:08:09"', () => {
				expect(qf(quote)).toEqual('13:08:09 CST');
			});
		});
	});

	describe('and a quote is formatted (with with a "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456,
				flag: 'p'
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(qf(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(qf(quote)).toEqual('05/03/16');
			});
		});
	});

	describe('and a quote is formatted (with with no "flag" and a "lastPrice" value and a "sessionT" indicator)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456,
				sessionT: true
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(qf(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(qf(quote)).toEqual('05/03/16');
			});
		});
	});
});

describe('When a time formatter is created (and a 24-hour clock is specified)', () => {
	let qf;

	beforeEach(() => {
		qf = QuoteFormatterFactory.build(false);
	});

	describe('and a quote is formatted (with no "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "00:00:00"', () => {
				expect(qf(quote)).toEqual('00:00:00');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00:00"', () => {
				expect(qf(quote)).toEqual('12:00:00');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08:09"', () => {
				expect(qf(quote)).toEqual('07:08:09');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "13:08:09"', () => {
				expect(qf(quote)).toEqual('13:08:09');
			});
		});

		describe('and the quote time is 1:08:09 PM and a timezone is present', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
				quote.timezone = 'EDT';
			});

			it('the formatter outputs "13:08:09"', () => {
				expect(qf(quote)).toEqual('13:08:09 EDT');
			});
		});
	});

	describe('and a quote is formatted (with with a "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456,
				flag: 'p'
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(qf(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(qf(quote)).toEqual('05/03/16');
			});
		});
	});
});

describe('When a time formatter is created (and a "short" 24-hour clock is specified)', () => {
	let qf;

	beforeEach(() => {
		qf = QuoteFormatterFactory.build(false, true);
	});

	describe('and a quote is formatted (with no "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "00:00"', () => {
				expect(qf(quote)).toEqual('00:00');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00"', () => {
				expect(qf(quote)).toEqual('12:00');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08"', () => {
				expect(qf(quote)).toEqual('07:08');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "13:08"', () => {
				expect(qf(quote)).toEqual('13:08');
			});
		});

		describe('and the quote time is 1:08:09 PM and a timezone is present', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
				quote.timezone = 'EDT';
			});

			it('the formatter outputs "13:08"', () => {
				expect(qf(quote)).toEqual('13:08 EDT');
			});
		});
	});

	describe('and a quote is formatted (with with a "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456,
				flag: 'p'
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(qf(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(qf(quote)).toEqual('05/03/16');
			});
		});
	});
});

describe('When a time formatter is created (and a 12-hour clock is specified)', () => {
	let qf;

	beforeEach(() => {
		qf = QuoteFormatterFactory.build(true);
	});

	describe('and a quote is formatted (with no "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "12:00:00 AM"', () => {
				expect(qf(quote)).toEqual('12:00:00 AM');
			});
		});

		describe('and the quote time is five after midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 5, 0);
			});

			it('the formatter outputs "12:05:00 AM"', () => {
				expect(qf(quote)).toEqual('12:05:00 AM');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00:00 PM"', () => {
				expect(qf(quote)).toEqual('12:00:00 PM');
			});
		});

		describe('and the quote time is ten after noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 10, 0);
			});

			it('the formatter outputs "12:10:00 PM"', () => {
				expect(qf(quote)).toEqual('12:10:00 PM');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08:09 AM"', () => {
				expect(qf(quote)).toEqual('07:08:09 AM');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "01:08:09 PM"', () => {
				expect(qf(quote)).toEqual('01:08:09 PM');
			});
		});
	});

	describe('and a quote is formatted (with with a "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456,
				flag: 'p'
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(qf(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(qf(quote)).toEqual('05/03/16');
			});
		});
	});
});

describe('When a time formatter is created (and a "short" 12-hour clock is specified)', () => {
	let qf;

	beforeEach(() => {
		qf = QuoteFormatterFactory.build(true, true);
	});

	describe('and a quote is formatted (with no "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "12:00A"', () => {
				expect(qf(quote)).toEqual('12:00A');
			});
		});

		describe('and the quote time is five after midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 5, 0);
			});

			it('the formatter outputs "12:05A"', () => {
				expect(qf(quote)).toEqual('12:05A');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00P"', () => {
				expect(qf(quote)).toEqual('12:00P');
			});
		});

		describe('and the quote time is ten after noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 10, 0);
			});

			it('the formatter outputs "12:10P"', () => {
				expect(qf(quote)).toEqual('12:10P');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08A"', () => {
				expect(qf(quote)).toEqual('07:08A');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "01:08P"', () => {
				expect(qf(quote)).toEqual('01:08P');
			});
		});
	});

	describe('and a quote is formatted (with with a "flag" and a "lastPrice" value)', () => {
		let quote;

		beforeEach(() => {
			quote = {
				lastPrice: 123.456,
				flag: 'p'
			};
		});

		describe('and the quote time is midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(qf(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(qf(quote)).toEqual('05/03/16');
			});
		});
	});
});