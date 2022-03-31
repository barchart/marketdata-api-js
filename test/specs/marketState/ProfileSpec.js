const Profile = require('../../../lib/marketState/Profile');

describe('When a Profile is created (for a symbol with unitCode "2")', () => {
	'use strict';

	var p;

	beforeEach(() => {
		p = new Profile('ZCZ17', 'Corn', 'CME', '2');
	});

	it('formats 123.5 (with unit code 2) as "123-4"', () => {
		expect(p.formatPrice(123.5)).toEqual('123-4');
	});
});

describe('When a Profile is created (an option on a ZB future")', () => {
	'use strict';

	var p;

	beforeEach(() => {
		p = new Profile('ZBM2|1500C', '30-Year T-Bond', 'CBOT', '5', 1000, 1);
	});

	it('formats 0.5 as 0-32 (using sixty-fourths)', () => {
		expect(p.formatPrice(0.5)).toEqual('0-32');
	});

	it('formats 0.984375 as 0-63 (using sixty-fourths)', () => {
		expect(p.formatPrice(0.984375)).toEqual('0-63');
	});
});

describe('When a Profile is created (an option on a ZT future")', () => {
	'use strict';

	var p;

	beforeEach(() => {
		p = new Profile('ZTM2|1060C', '2-Year T-Note', 'CBOT', '6', 2000, 1);
	});

	it('formats 0.5 as 0-320 (using sixty-fourths)', () => {
		expect(p.formatPrice(0.5)).toEqual('0-320');
	});

	it('formats 0.9921875 as 0-635 (using sixty-fourths)', () => {
		expect(p.formatPrice(0.9921875)).toEqual('0-635');
	});
});