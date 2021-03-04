const convertMonthCodeToName = require('./../../../../lib/utilities/convert/monthCodeToName');

describe('When converting a futures month code to a month name', () => {
	it('The character "F" should translate to "January"', () => {
		expect(convertMonthCodeToName('F')).toEqual('January');
	});

	it('The character "N" should translate to "July"', () => {
		expect(convertMonthCodeToName('N')).toEqual('July');
	});

	it('The character "A" should translate to null value', () => {
		expect(convertMonthCodeToName('A')).toBe(null);
	});
});