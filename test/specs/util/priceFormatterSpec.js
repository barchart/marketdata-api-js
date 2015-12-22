var PriceFormatter = require('../../../lib/util/priceFormatter');

describe('When a price formatter is created', function() {
    var priceFormatter;

    describe('with a dash fraction separator and no special fractions', function() {
        beforeEach(function() {
            priceFormatter = new PriceFormatter('-', false);
        });

        it('formats 123.5 (with unit code 2) as "123-4"', function() {
            expect(priceFormatter.format(123.5, '2')).toBe('123-4');
        });

        it('formats 0 (with unit code 2) as "0-0"', function() {
            expect(priceFormatter.format(0, '2')).toBe('0-0');
        });
    });
});