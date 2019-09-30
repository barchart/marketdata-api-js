const formatDate = require('./../../../../lib/utilities/format/date');

describe('when using the date formatter', () => {
	it('A date set to 2019-09-30 23:59:59 should return "09/30/19"', () => {
		expect(formatDate(new Date(2019, 8, 30, 23, 59, 59))).toEqual('09/30/19');
	});

	it('A date set to 2019-09-30 00:00:00 should return "09/30/19"', () => {
		expect(formatDate(new Date(2019, 8, 30, 0, 0, 0))).toEqual('09/30/19');
	});
});