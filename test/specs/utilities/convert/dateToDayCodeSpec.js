const convertDateToDayCode = require('./../../../../lib/utilities/convert/dateToDayCode');

describe('When converting a date instance to a day code', () => {
	it('"Jan 1, 2016" should translate to 1', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 1))).toEqual('1');
	});

	it('"Jan 2, 2016" should translate to 2', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 2))).toEqual('2');
	});

	it('"Jan 3, 2016" should translate to 3', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 3))).toEqual('3');
	});

	it('"Jan 4, 2016" should translate to 4', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 4))).toEqual('4');
	});

	it('"Jan 5, 2016" should translate to 5', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 5))).toEqual('5');
	});

	it('"Jan 6, 2016" should translate to 6', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 6))).toEqual('6');
	});

	it('"Jan 7, 2016" should translate to 7', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 7))).toEqual('7');
	});

	it('"Jan 8, 2016" should translate to 8', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 8))).toEqual('8');
	});

	it('"Jan 9, 2016" should translate to 9', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 9))).toEqual('9');
	});

	it('"Jan 10, 2016" should translate to 0', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 10))).toEqual('0');
	});

	it('"Jan 11, 2016" should translate to A', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 11))).toEqual('A');
	});

	it('"Jan 12, 2016" should translate to B', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 12))).toEqual('B');
	});

	it('"Jan 13, 2016" should translate to C', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 13))).toEqual('C');
	});

	it('"Jan 14, 2016" should translate to D', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 14))).toEqual('D');
	});

	it('"Jan 15, 2016" should translate to E', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 15))).toEqual('E');
	});

	it('"Jan 16, 2016" should translate to F', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 16))).toEqual('F');
	});

	it('"Jan 17, 2016" should translate to G', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 17))).toEqual('G');
	});

	it('"Jan 18, 2016" should translate to H', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 18))).toEqual('H');
	});

	it('"Jan 19, 2016" should translate to I', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 19))).toEqual('I');
	});

	it('"Jan 20, 2016" should translate to J', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 20))).toEqual('J');
	});

	it('"Jan 21, 2016" should translate to K', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 21))).toEqual('K');
	});

	it('"Jan 22, 2016" should translate to L', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 22))).toEqual('L');
	});

	it('"Jan 23, 2016" should translate to M', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 23))).toEqual('M');
	});

	it('"Jan 24, 2016" should translate to N', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 24))).toEqual('N');
	});

	it('"Jan 25, 2016" should translate to O', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 25))).toEqual('O');
	});

	it('"Jan 26, 2016" should translate to P', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 26))).toEqual('P');
	});

	it('"Jan 27, 2016" should translate to Q', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 27))).toEqual('Q');
	});

	it('"Jan 28, 2016" should translate to R', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 28))).toEqual('R');
	});

	it('"Jan 29, 2016" should translate to S', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 29))).toEqual('S');
	});

	it('"Jan 30, 2016" should translate to T', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 30))).toEqual('T');
	});

	it('"Jan 31, 2016" should translate to U', () => {
		expect(convertDateToDayCode(new Date(2016, 0, 31))).toEqual('U');
	});

	it('A null value should translate to a null value', () => {
		expect(convertDateToDayCode(null)).toEqual(null);
	});

	it('A undefined value should translate to a null value', () => {
		expect(convertDateToDayCode(null)).toEqual(null);
	});
});