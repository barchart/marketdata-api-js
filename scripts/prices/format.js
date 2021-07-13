const formatPrice = require('./../../lib/utilities/format/price');

const value = parseFloat(process.argv[2]);
const unitCode = process.argv[3];
const fractionSeparator = process.argv[4] || '';
const specialFractions = process.argv[5] === 'true';

const formatted = formatPrice(value, unitCode, fractionSeparator, specialFractions);

console.log(`Formatting [ ${value} ] as [ ${formatted} ] with [ unitCode=${unitCode}, fractionSeparator=${fractionSeparator}, specialFractions=${specialFractions} ]`);