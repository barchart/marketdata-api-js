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