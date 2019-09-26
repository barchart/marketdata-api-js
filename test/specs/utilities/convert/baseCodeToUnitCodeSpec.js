const baseCodeToUnitCode = require('./../../../../lib/utilities/convert/baseCodeToUnitCode');

describe('When converting a baseCode to a unitCode', () => {
	it('-1 should translate to "2"', () => {
		expect(baseCodeToUnitCode(-1)).toEqual('2');
	});

	it('-2 should translate to "3"', () => {
		expect(baseCodeToUnitCode(-2)).toEqual('3');
	});

	it('-3 should translate to "4"', () => {
		expect(baseCodeToUnitCode(-3)).toEqual('4');
	});

	it('-4 should translate to "5"', () => {
		expect(baseCodeToUnitCode(-4)).toEqual('5');
	});

	it('-5 should translate to "6"', () => {
		expect(baseCodeToUnitCode(-5)).toEqual('6');
	});

	it('-6 should translate to "7"', () => {
		expect(baseCodeToUnitCode(-6)).toEqual('7');
	});

	it('0 should translate to "8"', () => {
		expect(baseCodeToUnitCode(0)).toEqual('8');
	});

	it('1 should translate to "9"', () => {
		expect(baseCodeToUnitCode(1)).toEqual('9');
	});

	it('2 should translate to "A"', () => {
		expect(baseCodeToUnitCode(2)).toEqual('A');
	});

	it('3 should translate to "B"', () => {
		expect(baseCodeToUnitCode(3)).toEqual('B');
	});

	it('4 should translate to "C"', () => {
		expect(baseCodeToUnitCode(4)).toEqual('C');
	});

	it('5 should translate to "D"', () => {
		expect(baseCodeToUnitCode(5)).toEqual('D');
	});

	it('6 should translate to "E"', () => {
		expect(baseCodeToUnitCode(6)).toEqual('E');
	});

	it('7 should translate to "F"', () => {
		expect(baseCodeToUnitCode(7)).toEqual('F');
	});

	it('"-1" should translate to 0', () => {
		expect(baseCodeToUnitCode("-1")).toEqual(0);
	});

	it('A null value should translate to 0', () => {
		expect(baseCodeToUnitCode(null)).toEqual(0);
	});

	it('An undefined value should translate to 0', () => {
		expect(baseCodeToUnitCode(undefined)).toEqual(0);
	});
});