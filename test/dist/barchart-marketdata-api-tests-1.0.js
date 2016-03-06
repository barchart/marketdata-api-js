(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var utilities = require('barchart-marketdata-utilities');

module.exports = function() {
	'use strict';

	return utilities.priceFormatter;
}();
},{"barchart-marketdata-utilities":2}],2:[function(require,module,exports){
var priceFormatter = require('./priceFormatter');
var timeFormatter = require('./timeFormatter');

module.exports = function() {
	'use strict';

	return {
		priceFormatter: priceFormatter,
		timeFormatter: timeFormatter
	};
}();
},{"./priceFormatter":3,"./timeFormatter":4}],3:[function(require,module,exports){
var isNaN = require('lodash.isnan');

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
				if (value === '' || value === undefined || value === null || isNaN(value))
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
				if (value === '' || value === undefined || value === null || isNaN(value))
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
},{"lodash.isnan":5}],4:[function(require,module,exports){
module.exports = function () {
	'use strict';

	return function () {
		return {
			format: function (t) {
				if (t.time && t.flag) {
					return (t.time.getMonth() + 1 ) + '/' + t.time.getDate() + '/' + String(t.time.getFullYear()).substr(2);
				} else {
					if (t.hasOwnProperty('time')) {
						t = t.time;
					}

					if (t) {
						return [['00', t.getHours()].join('').substr(-2), ['00', t.getMinutes()].join('').substr(-2), ['00', t.getSeconds()].join('').substr(-2)].join(':');
					} else {
						return ''; // FIXME ETS messages are missing (null) 'time' on them near settlement...
					}
				}
			}
		};
	};
}();
},{}],5:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var numberTag = '[object Number]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is `NaN`.
 *
 * **Note:** This method is not the same as [`isNaN`](https://es5.github.io/#x15.1.2.4)
 * which returns `true` for `undefined` and other non-numeric values.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 * @example
 *
 * _.isNaN(NaN);
 * // => true
 *
 * _.isNaN(new Number(NaN));
 * // => true
 *
 * isNaN(undefined);
 * // => true
 *
 * _.isNaN(undefined);
 * // => false
 */
function isNaN(value) {
  // An `NaN` primitive is the only value that is not equal to itself.
  // Perform the `toStringTag` check first to avoid errors with some ActiveX objects in IE.
  return isNumber(value) && value != +value;
}

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
 * as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */
function isNumber(value) {
  return typeof value == 'number' ||
    (isObjectLike(value) && objectToString.call(value) == numberTag);
}

module.exports = isNaN;

},{}],6:[function(require,module,exports){
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

		it('formats zero-length string (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format('', '2')).toEqual('');
		});

		it('formats undefined (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(Number.NaN, '2')).toEqual('');
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

		it('formats zero-length string (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format('', '2')).toEqual('');
		});

		it('formats undefined (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(Number.NaN, '2')).toEqual('');
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

		it('formats zero-length string (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format('', '2')).toEqual('');
		});

		it('formats undefined (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(undefined, '2')).toEqual('');
		});

		it('formats null (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(null, '2')).toEqual('');
		});

		it('formats Number.NaN (with unit code 2) as zero-length string', function() {
			expect(priceFormatter.format(Number.NaN, '2')).toEqual('');
		});
	});
});
},{"../../../lib/util/priceFormatter":1}]},{},[6]);
