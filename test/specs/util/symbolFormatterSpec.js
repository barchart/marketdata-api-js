let symbolFormatter = require('./../../../lib/util/symbolFormatter');

describe('When a lowercase string is formatted as a symbol', () => {
	let originalSymbol;
	let formattedSymbol;

	beforeEach(() => {
		formattedSymbol = symbolFormatter.format(originalSymbol = 'aapl');
	});

	it('The result should only contain uppercase letters', () => {
		expect(formattedSymbol).toEqual('AAPL');
	});
});

describe('When an uppercase string is formatted as a symbol', () => {
	let originalSymbol;
	let formattedSymbol;

	beforeEach(() => {
		formattedSymbol = symbolFormatter.format(originalSymbol = 'AAPL');
	});

	it('The result should only contain uppercase letters', () => {
		expect(formattedSymbol).toEqual('AAPL');
	});
});

describe('When a mixed case string is formatted as a symbol', () => {
	let originalSymbol;
	let formattedSymbol;

	beforeEach(() => {
		formattedSymbol = symbolFormatter.format(originalSymbol = 'aApL');
	});

	it('The result should only contain uppercase letters', () => {
		expect(formattedSymbol).toEqual('AAPL');
	});
});

describe('When a zero-length string is formatted as a symbol', () => {
	let originalSymbol;
	let formattedSymbol;

	beforeEach(() => {
		formattedSymbol = symbolFormatter.format(originalSymbol = '');
	});

	it('The result should be the original, zero-length string', () => {
		expect(formattedSymbol).toEqual(originalSymbol);
	});
});

describe('When a string with numbers is formatted as a symbol', () => {
	let originalSymbol;
	let formattedSymbol;

	beforeEach(() => {
		formattedSymbol = symbolFormatter.format(originalSymbol = 'esm16');
	});

	it('The result should only contain uppercase letters', () => {
		expect(formattedSymbol).toEqual('ESM16');
	});
});

describe('When a number is formatted as a symbol', () => {
	let originalSymbol;
	let formattedSymbol;

	beforeEach(() => {
		formattedSymbol = symbolFormatter.format(originalSymbol = 1);
	});

	it('The result should be a number', () => {
		expect(typeof formattedSymbol).toEqual('number');
	});

	it('The result should the original, unformatted string', () => {
		expect(formattedSymbol).toEqual(originalSymbol);
	});
});

describe('When an undefined value is formatted as a symbol', () => {
	let originalSymbol;
	let formattedSymbol;

	beforeEach(() => {
		formattedSymbol = symbolFormatter.format(originalSymbol = undefined);
	});

	it('The result should be a undefined', () => {
		expect(typeof formattedSymbol).toEqual('undefined');
	});
});

describe('When an null value is formatted', () => {
	let originalSymbol;
	let formattedSymbol;

	beforeEach(() => {
		formattedSymbol = symbolFormatter.format(originalSymbol = null);
	});

	it('The result should be null', () => {
		expect(formattedSymbol).toEqual(null);
	});
});