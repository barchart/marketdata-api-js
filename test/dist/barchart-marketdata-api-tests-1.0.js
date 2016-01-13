(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function() {
	'use strict';

	function frontPad(value, digits) {
		return ['000', Math.floor(value)].join('').substr(-1 * digits);
	}

	return function(fractionSeparator, specialFractions) {
		var format;

		function getWholeNumberAsString(value) {
			var val = Math.floor(value);

			if ((val === 0) && (fractionSeparator === ''))
				return '';
            else
			    return val;
		}

		if (fractionSeparator == '.') { // Decimals
			format = function(value, unitcode) {
				if (value === '' || value === undefined)
					return '';

				switch (unitcode) {
					case '2':
						return value.toFixed(3);
					case '3':
						return value.toFixed(4);
					case '4':
						return value.toFixed(5);
					case '5':
						return value.toFixed(6);
					case '6':
						return value.toFixed(7);
					case '7':
						return value.toFixed(8);
					case '8':
						return value.toFixed(0);
					case '9':
						return value.toFixed(1);
					case 'A':
						return value.toFixed(2);
					case 'B':
						return value.toFixed(3);
					case 'C':
						return value.toFixed(4);
					case 'D':
						return value.toFixed(5);
					case 'E':
						return value.toFixed(6);
					default:
						return value;
				}
			};
		}
		else {
			format = function(value, unitcode) {
				if (value === '' || value === undefined)
					return '';

				var sign = (value >= 0) ? '' : '-';
				value = Math.abs(value);

				// Well, damn it, sometimes code that is beautiful just doesn't work quite right.
				// return [sign, Math.floor(value), fractionSeparator, frontPad((value - Math.floor(value)) * 8, 1)].join('');
				// will fail when Math.floor(value) is 0 and the fractionSeparator is '', since 0.500 => 04 instead of just 4

				switch (unitcode) {
					case '2':
						return [sign, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * 8, 1)].join('');
					case '3':
						return [sign, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * 16, 2)].join('');
					case '4':
						return [sign, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * 32, 2)].join('');
					case '5':
						return [sign, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * (specialFractions ? 320 : 64), (specialFractions ? 3 : 2))].join('');
					case '6':
						return [sign, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * (specialFractions ? 320 : 128), 3)].join('');
					case '7':
						return [sign, getWholeNumberAsString(value), fractionSeparator, frontPad((value - Math.floor(value)) * (specialFractions ? 320 : 256), 3)].join('');
					case '8':
						return sign + value.toFixed(0);
					case '9':
						return sign + value.toFixed(1);
					case 'A':
						return sign + value.toFixed(2);
					case 'B':
						return sign + value.toFixed(3);
					case 'C':
						return sign + value.toFixed(4);
					case 'D':
						return sign + value.toFixed(5);
					case 'E':
						return sign + value.toFixed(6);
					default:
						return sign + value;
				}
			};
		}

		return {
			format : format
		};
	};
}();
},{}],2:[function(require,module,exports){
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
},{"../../../lib/util/priceFormatter":1}]},{},[2]);
