const convertBaseCodeToUnitCode = require('./../../../../lib/utilities/convert/baseCodeToUnitCode');

describe('When converting a baseCode to a unitCode', () => {
	it('-1 should translate to "2"', () => {
		expect(convertBaseCodeToUnitCode(-1)).toEqual('2');
	});

	it('-2 should translate to "3"', () => {
		expect(convertBaseCodeToUnitCode(-2)).toEqual('3');
	});

	it('-3 should translate to "4"', () => {
		expect(convertBaseCodeToUnitCode(-3)).toEqual('4');
	});

	it('-4 should translate to "5"', () => {
		expect(convertBaseCodeToUnitCode(-4)).toEqual('5');
	});

	it('-5 should translate to "6"', () => {
		expect(convertBaseCodeToUnitCode(-5)).toEqual('6');
	});

	it('-6 should translate to "7"', () => {
		expect(convertBaseCodeToUnitCode(-6)).toEqual('7');
	});

	it('0 should translate to "8"', () => {
		expect(convertBaseCodeToUnitCode(0)).toEqual('8');
	});

	it('1 should translate to "9"', () => {
		expect(convertBaseCodeToUnitCode(1)).toEqual('9');
	});

	it('2 should translate to "A"', () => {
		expect(convertBaseCodeToUnitCode(2)).toEqual('A');
	});

	it('3 should translate to "B"', () => {
		expect(convertBaseCodeToUnitCode(3)).toEqual('B');
	});

	it('4 should translate to "C"', () => {
		expect(convertBaseCodeToUnitCode(4)).toEqual('C');
	});

	it('5 should translate to "D"', () => {
		expect(convertBaseCodeToUnitCode(5)).toEqual('D');
	});

	it('6 should translate to "E"', () => {
		expect(convertBaseCodeToUnitCode(6)).toEqual('E');
	});

	it('7 should translate to "F"', () => {
		expect(convertBaseCodeToUnitCode(7)).toEqual('F');
	});

	it('"-1" should translate to "0"', () => {
		expect(convertBaseCodeToUnitCode("-1")).toEqual("0");
	});

	it('A null value should translate to "0"', () => {
		expect(convertBaseCodeToUnitCode(null)).toEqual("0");
	});

	it('An undefined value should translate to "0"', () => {
		expect(convertBaseCodeToUnitCode(undefined)).toEqual("0");
	});
});