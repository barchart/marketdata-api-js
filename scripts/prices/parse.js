const parseValue = require('./../../lib/utilities/parse/ddf/value');

const value = process.argv[2];
const unitCode = process.argv[3];

const parsed = parseValue(value, unitCode);

console.log(`Parsed [ ${value} ] as [ ${parsed} ] with [ unitCode=${unitCode} ]`);