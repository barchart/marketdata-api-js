(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.Barchart||(g.Barchart = {}));g=(g.RealtimeData||(g.RealtimeData = {}));g.Util = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return function(basecode) {
		switch(basecode) {
			case -1:
				return '2';
			case -2:
				return '3';
			case -3:
				return '4';
			case -4:
				return '5';
			case -5:
				return '6';
			case -6:
				return '7';
			case 0:
				return '8';
			case 1:
				return '9';
			case 2:
				return 'A';
			case 3:
				return 'B';
			case 4:
				return 'C';
			case 5:
				return 'D';
			case 6:
				return 'E';
			case 7:
				return 'F';
			default:
				return 0;
		}
	};
}();
},{}],2:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return function(date) {
		var d = date.getDate();

		if ((d >= 1) && (d <= 9))
			return String.fromCharCode(("1").charCodeAt(0) + d - 1);
		else if (d == 10)
			return '0';
		else
			return String.fromCharCode(("A").charCodeAt(0) + d - 11);
	};
}();

},{}],3:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return function(dayCode) {
		var val1 = dayCode.charCodeAt(0);

		if ((val1 >= ("1").charCodeAt(0)) && (dayCode <= ("9").charCodeAt(0)))
			return (val1 - ("0").charCodeAt(0));
		else if (dayCode == ("0").charCodeAt(0))
			return 10;
		else
			return ((val1 - ("A").charCodeAt(0)) + 11);
	};
}();
},{}],4:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return function(unitcode) {
		switch(unitcode) {
			case '2':
				return -1;
			case '3':
				return -2;
			case '4':
				return -3;
			case '5':
				return -4;
			case '6':
				return -5;
			case '7':
				return -6;
			case '8':
				return 0;
			case '9':
				return 1;
			case 'A':
				return 2;
			case 'B':
				return 3;
			case 'C':
				return 4;
			case 'D':
				return 5;
			case 'E':
				return 6;
			case 'F':
				return 7;
			default:
				return 0;
		}
	};
}();
},{}],5:[function(require,module,exports){
var convertBaseCodeToUnitCode = require('./convertBaseCodeToUnitCode');
var convertDateToDayCode = require('./convertDateToDayCode');
var convertDayCodeToNumber = require('./convertDayCodeToNumber');
var convertUnitCodeToBaseCode = require('./convertUnitCodeToBaseCode');
var monthCodes = require('./monthCodes');
var parseSymbolType = require('./parseSymbolType');
var priceFormatter = require('./priceFormatter');
var timeFormatter = require('./timeFormatter');

module.exports = function() {
	'use strict';

	return {
		convertBaseCodeToUnitCode: convertBaseCodeToUnitCode,
		convertUnitCodeToBaseCode: convertUnitCodeToBaseCode,
		convertDateToDayCode: convertDateToDayCode,
		convertDayCodeToNumber: convertDayCodeToNumber,
		monthCodes: monthCodes,
		parseSymbolType: parseSymbolType,

		BaseCode2UnitCode: convertBaseCodeToUnitCode,
		DateToDayCode: convertDateToDayCode,
		DayCodeToNumber: convertDayCodeToNumber,
		MonthCodes: monthCodes,
		ParseSymbolType: parseSymbolType,
		PriceFormatter: priceFormatter,
		TimeFormatter: timeFormatter,
		UnitCode2BaseCode: convertUnitCodeToBaseCode
	};
}();
},{"./convertBaseCodeToUnitCode":1,"./convertDateToDayCode":2,"./convertDayCodeToNumber":3,"./convertUnitCodeToBaseCode":4,"./monthCodes":6,"./parseSymbolType":7,"./priceFormatter":8,"./timeFormatter":9}],6:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return {
		"F": "January",
		"G": "February",
		"H": "March",
		"J": "April",
		"K": "May",
		"M": "June",
		"N": "July",
		"Q": "August",
		"U": "September",
		"V": "October",
		"X": "November",
		"Z": "December"
	};
}();
},{}],7:[function(require,module,exports){
module.exports = function() {
	'use strict';

	return function(symbol) {
		if (symbol.substring(0, 3) == '_S_') {
			return {
				'type' : 'future_spread'
			};
		}

		var re1 = /[0-9]$/;

		// If we end in a number, then we are a future

		if (re1.test(symbol)) {
			var re2 = /^(.{1,3})([A-Z])([0-9]{1,4})$/i;
			var ary = re2.exec(symbol);
			var year = parseInt(ary[3]);
			if (year < 10)
				year += 2010;
			else if (year < 100)
				year += 2000;

			return {
				type: 'future',
				symbol: ary[0],
				root: ary[1],
				month: ary[2],
				year: year
			};
		}

		return null;
	};
}();
},{}],8:[function(require,module,exports){
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
},{"lodash.isnan":10}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var numberTag = '[object Number]';

/** Used for built-in method references. */
var objectProto = global.Object.prototype;

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[5])(5)
});