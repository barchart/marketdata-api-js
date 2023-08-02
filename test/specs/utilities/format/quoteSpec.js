const formatQuote = require('./../../../../lib/utilities/format/quote');

describe('When a quote formatter is used (without specifying the clock)', () => {
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
				expect(formatQuote(quote)).toEqual('00:00:00');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00:00"', () => {
				expect(formatQuote(quote)).toEqual('12:00:00');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08:09"', () => {
				expect(formatQuote(quote)).toEqual('07:08:09');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "13:08:09"', () => {
				expect(formatQuote(quote)).toEqual('13:08:09');
			});
		});

		describe('and the quote time is 1:08:09 PM and timezone is present', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
				quote.timezone = 'CST';
			});

			it('the formatter outputs "13:08:09"', () => {
				expect(formatQuote(quote)).toEqual('13:08:09 CST');
			});
		});

		describe('and the quote time is 1:08:09 PM, the quote timeUtc is undefined, and exchangeRef is present', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
				quote.timeUtc = undefined;
			});

			it('the formatter outputs "13:08:09" (when output timezone is not specified)', () => {
				expect(formatQuote(quote)).toEqual('13:08:09');
			});

			it('the formatter outputs does not throw an error when output timezone is specified', () => {
				expect(() => formatQuote(quote, false, false, "America/New_York")).not.toThrow();
			});

			it('the formatter outputs "13:08:09" (when output timezone is "America/New_York")', () => {
				expect(formatQuote(quote)).toEqual('13:08:09', false, false, "America/New_York");
			});

			it('the formatter outputs "13:08:09" (when output timezone is "America/Denver")', () => {
				expect(formatQuote(quote)).toEqual('13:08:09', false, false, "America/Denver");
			});
		});

		describe('and the quote timeUtc is 2:00:01 AM UTC (and exchangeRef is present)', () => {
			beforeEach(() => {
				const milliseconds = Date.UTC(2022, 6, 1, 2, 0, 1);

				quote.time = new Date(1, 2, 3, 4, 5, 6); //ignored
				quote.timeUtc = new Date(milliseconds);
			});

			it('the formatter outputs "22:00:01" (when asked to display time in the "America/New_York" timezone)', () => {
				expect(formatQuote(quote, false, false, "America/New_York")).toEqual('22:00:01');
			});

			it('the formatter outputs "20:00:01" (when asked to display time in the "America/Denver" timezone)', () => {
				expect(formatQuote(quote, false, false, "America/Denver")).toEqual('20:00:01');
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
				expect(formatQuote(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(formatQuote(quote)).toEqual('05/03/16');
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
				expect(formatQuote(quote)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(formatQuote(quote)).toEqual('05/03/16');
			});
		});
	});
});

describe('When a quote formatter is used (and a 24-hour clock is specified)', () => {
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
				expect(formatQuote(quote, false)).toEqual('00:00:00');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00:00"', () => {
				expect(formatQuote(quote, false)).toEqual('12:00:00');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08:09"', () => {
				expect(formatQuote(quote, false)).toEqual('07:08:09');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "13:08:09"', () => {
				expect(formatQuote(quote, false)).toEqual('13:08:09');
			});
		});

		describe('and the quote time is 1:08:09 PM and a timezone is present', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
				quote.timezone = 'EDT';
			});

			it('the formatter outputs "13:08:09"', () => {
				expect(formatQuote(quote, false)).toEqual('13:08:09 EDT');
			});
		});
	});

	describe('and a quote formatter is used (with with a "flag" and a "lastPrice" value)', () => {
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
				expect(formatQuote(quote, false)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(formatQuote(quote, false)).toEqual('05/03/16');
			});
		});
	});
});

describe('When a time formatter is used (and a "short" 24-hour clock is specified)', () => {
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
				expect(formatQuote(quote, false, true)).toEqual('00:00');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00"', () => {
				expect(formatQuote(quote, false, true)).toEqual('12:00');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08"', () => {
				expect(formatQuote(quote, false, true)).toEqual('07:08');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "13:08"', () => {
				expect(formatQuote(quote, false, true)).toEqual('13:08');
			});
		});

		describe('and the quote time is 1:08:09 PM and a timezone is present', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
				quote.timezone = 'EDT';
			});

			it('the formatter outputs "13:08"', () => {
				expect(formatQuote(quote, false, true)).toEqual('13:08 EDT');
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
				expect(formatQuote(quote, false, true)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(formatQuote(quote, false, true)).toEqual('05/03/16');
			});
		});
	});
});

describe('When a time formatter is created (and a 12-hour clock is specified)', () => {
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
				expect(formatQuote(quote, true)).toEqual('12:00:00 AM');
			});
		});

		describe('and the quote time is five after midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 5, 0);
			});

			it('the formatter outputs "12:05:00 AM"', () => {
				expect(formatQuote(quote, true)).toEqual('12:05:00 AM');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00:00 PM"', () => {
				expect(formatQuote(quote, true)).toEqual('12:00:00 PM');
			});
		});

		describe('and the quote time is ten after noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 10, 0);
			});

			it('the formatter outputs "12:10:00 PM"', () => {
				expect(formatQuote(quote, true)).toEqual('12:10:00 PM');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08:09 AM"', () => {
				expect(formatQuote(quote, true)).toEqual('07:08:09 AM');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "01:08:09 PM"', () => {
				expect(formatQuote(quote, true)).toEqual('01:08:09 PM');
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
				expect(formatQuote(quote, true)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(formatQuote(quote, true)).toEqual('05/03/16');
			});
		});
	});
});

describe('When a time formatter is created (and a "short" 12-hour clock is specified)', () => {
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
				expect(formatQuote(quote, true, true)).toEqual('12:00A');
			});
		});

		describe('and the quote time is five after midnight on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 0, 5, 0);
			});

			it('the formatter outputs "12:05A"', () => {
				expect(formatQuote(quote, true, true)).toEqual('12:05A');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "12:00P"', () => {
				expect(formatQuote(quote, true, true)).toEqual('12:00P');
			});
		});

		describe('and the quote time is ten after noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 10, 0);
			});

			it('the formatter outputs "12:10P"', () => {
				expect(formatQuote(quote, true, true)).toEqual('12:10P');
			});
		});

		describe('and the quote time is 7:08:09 AM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 7, 8, 9);
			});

			it('the formatter outputs "07:08A"', () => {
				expect(formatQuote(quote, true, true)).toEqual('07:08A');
			});
		});

		describe('and the quote time is 1:08:09 PM on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 13, 8, 9);
			});

			it('the formatter outputs "01:08P"', () => {
				expect(formatQuote(quote, true, true)).toEqual('01:08P');
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
				expect(formatQuote(quote, true, true)).toEqual('05/03/16');
			});
		});

		describe('and the quote time is noon on May 3, 2016', () => {
			beforeEach(() => {
				quote.time = new Date(2016, 4, 3, 12, 0, 0);
			});

			it('the formatter outputs "05/03/16"', () => {
				expect(formatQuote(quote, true, true)).toEqual('05/03/16');
			});
		});
	});
});