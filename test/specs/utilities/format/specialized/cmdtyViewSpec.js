const cmdtyView = require('./../../../../../lib/utilities/format/specialized/cmdtyView');
const Profile = require('./../../../../../lib/marketState/Profile');

const ZBM2_1500C = new Profile('ZBM2|1500C', '30-Year T-Bond', 'CBOT', '5', 1000, 1);
const ZNM2_1230C =  new Profile('ZNM2|1230C', '10-Year T-Note', 'CBOT', '5', 1000, 1);

const ZTM2_1060C =  new Profile('ZTM2|1060C', '2-Year T-Note', 'CBOT', '6', 2000, 1);
const ZFM2_1147C =  new Profile('ZFM2|1147C', '5-Year T-Note', 'CBOT', '6', 1000, 1);

describe('when formatting prices for a ZB options', () => {
	it('formats 0.5 as 0-32 (using sixty-fourths)', () => {
		expect(cmdtyView(0.5, ZBM2_1500C.unitCode, ZBM2_1500C)).toEqual('0-32');
	});

	it('formats 0.984375 as 0-63 (using sixty-fourths)', () => {
		expect(cmdtyView(0.984375, ZBM2_1500C.unitCode, ZBM2_1500C)).toEqual('0-63');
	});
});

describe('when formatting prices for a ZN option', () => {
	it('formats 0.5 as 0-32 (using sixty-fourths)', () => {
		expect(cmdtyView(0.5, ZNM2_1230C.unitCode, ZNM2_1230C)).toEqual('0-32');
	});

	it('formats 0.984375 as 0-63 (using sixty-fourths)', () => {
		expect(cmdtyView(0.984375, ZNM2_1230C.unitCode, ZNM2_1230C)).toEqual('0-63');
	});
});

describe('when formatting prices for a ZT options', () => {
	it('formats 0.5 as 0-320 (using halves of sixty-fourths)', () => {
		expect(cmdtyView(0.5, ZTM2_1060C.unitCode, ZTM2_1060C)).toEqual('0-320');
	});

	it('formats 0.9921875 as 0-635 (using halves of sixty-fourths)', () => {
		expect(cmdtyView(0.9921875, ZTM2_1060C.unitCode, ZTM2_1060C)).toEqual('0-635');
	});
});

describe('when formatting prices for a ZF options', () => {
	it('formats 0.5 as 0-320 (using halves of sixty-fourths)', () => {
		expect(cmdtyView(0.5, ZFM2_1147C.unitCode, ZFM2_1147C)).toEqual('0-320');
	});

	it('formats 0.9921875 as 0-635 (using halves of sixty-fourths)', () => {
		expect(cmdtyView(0.9921875, ZFM2_1147C.unitCode, ZFM2_1147C)).toEqual('0-635');
	});
});