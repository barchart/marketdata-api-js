const formatFraction = require('./../../../../lib/utilities/format/fraction');

describe('when formatting in halves of thirty-seconds', () => {
	it('formats 0.984375 as 0-315', () => {
		expect(formatFraction(0.984375, 320, 3, '-')).toEqual('0-315');
	});
});

describe('when formatting in quarters of thirty-seconds', () => {
	it('formats 0.9921875 as 0-317', () => {
		expect(formatFraction(0.9921875, 320, 3, '-')).toEqual('0-317');
	});
});

describe('when formatting in sixty-fourths', () => {
	it('formats 0.984375 as 0-315', () => {
		expect(formatFraction(0.984375, 64, 2, '-')).toEqual('0-63');
	});
});

describe('when formatting in halves of sixty-fourths', () => {
	it('formats 0.9921875 as 0-317', () => {
		expect(formatFraction(0.9921875, 640, 3, '-')).toEqual('0-635');
	});
});