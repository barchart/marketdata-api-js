const convertMonthCodeToNumber = require('./../../../../lib/utilities/convert/monthCodeToNumber');

describe('When converting a futures month code to a month name', () => {
	it('The character "F" should translate to the number 1', () => {
		expect(convertMonthCodeToNumber('F')).toEqual(1);
	});

	it('The character "N" should translate to the number 7', () => {
		expect(convertMonthCodeToNumber('N')).toEqual(7);
	});

	it('The character "A" should translate to null value', () => {
		expect(convertMonthCodeToNumber('A')).toBe(null);
	});
});