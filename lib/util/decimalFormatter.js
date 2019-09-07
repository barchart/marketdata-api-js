const lodashIsNaN = require('lodash.isnan');

module.exports = (() => {
	'use strict';

	return (value, digits, thousandsSeparator, useParenthesis) => {
		if (value === '' || value === undefined || value === null || lodashIsNaN(value)) {
			return '';
		}

		const applyParenthesis = value < 0 && useParenthesis === true;

		if (applyParenthesis) {
			value = 0 - value;
		}

		let returnRef = value.toFixed(digits);

		if (thousandsSeparator && !(value > -1000 && value < 1000)) {
			const length = returnRef.length;
			const negative = value < 0;

			let found = digits === 0;
			let counter = 0;

			const buffer = [];

			for (let i = (length - 1); !(i < 0); i--) {
				if (counter === 3 && !(negative && i === 0)) {
					buffer.unshift(thousandsSeparator);

					counter = 0;
				}

				const character = returnRef.charAt(i);

				buffer.unshift(character);

				if (found) {
					counter = counter + 1;
				} else if (character === '.') {
					found = true;
				}
			}

			if (applyParenthesis) {
				buffer.unshift('(');
				buffer.push(')');
			}

			returnRef = buffer.join('');
		} else if (applyParenthesis) {
			returnRef = '(' + returnRef + ')';
		}

		return returnRef;
	};
})();