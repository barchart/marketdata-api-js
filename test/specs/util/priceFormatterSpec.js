var PriceFormatter = require('../../../lib/util/priceFormatter');

describe('When a price formatter is created', function() {
    var priceFormatter;

    describe('with a dash fraction separator and no special fractions', function() {
        beforeEach(function() {
            priceFormatter = new PriceFormatter('-', false);
        });

        it('formats 123 (with unit code 2) as "123-0"', function() {
            expect(priceFormatter.format(123, '2')).toEqual('123-0');
        });

        it('formats 123.5 (with unit code 2) as "123-4"', function() {
            expect(priceFormatter.format(123.5, '2')).toEqual('123-4');
        });

        it('formats 0.5 (with unit code 2) as "0-4"', function() {
            expect(priceFormatter.format(0.5, '2')).toEqual('0-4');
        });

        it('formats 0 (with unit code 2) as "0-0"', function() {
            expect(priceFormatter.format(0, '2')).toEqual('0-0');
        });
    });

    describe('with a tick fraction separator and no special fractions', function() {
        beforeEach(function() {
            priceFormatter = new PriceFormatter('\'', false);
        });

        it('formats 123 (with unit code 2) as "123\'0"', function() {
            expect(priceFormatter.format(123, '2')).toEqual('123\'0');
        });

        it('formats 123.5 (with unit code 2) as "123\'4"', function() {
            expect(priceFormatter.format(123.5, '2')).toEqual('123\'4');
        });

        it('formats 0.5 (with unit code 2) as "0\'4"', function() {
            expect(priceFormatter.format(0.5, '2')).toEqual('0\'4');
        });

        it('formats 0 (with unit code 2) as "0\'0"', function() {
            expect(priceFormatter.format(0, '2')).toEqual('0\'0');
        });
    });

    describe('with no fraction separator and no special fractions', function() {
        beforeEach(function() {
            priceFormatter = new PriceFormatter('', false);
        });

        it('formats 123 (with unit code 2) as "1230"', function() {
            expect(priceFormatter.format(123, '2')).toEqual('1230');
        });

        it('formats 123.5 (with unit code 2) as "1234"', function() {
            expect(priceFormatter.format(123.5, '2')).toEqual('1234');
        });

        it('formats 0.5 (with unit code 2) as "4"', function() {
            expect(priceFormatter.format(0.5, '2')).toEqual('4');
        });

        it('formats 0 (with unit code 2) as "0"', function() {
            expect(priceFormatter.format(0, '2')).toEqual('0');
        });

    });
});