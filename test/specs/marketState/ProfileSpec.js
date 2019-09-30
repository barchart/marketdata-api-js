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