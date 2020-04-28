## Functions :id=functions
**Kind**: global namespace  
>A meta namespace of pure functions.


* * *

### Functions.parsePrice(value, unitCode, [fractionSeparator], [specialFractions], [thousandsSeparator]) :id=functionsparseprice
**Kind**: static method of <code>Functions</code>  
**Returns**: <code>Number</code>  
**Import**: @barchart/marketdata-api-js/lib/utilities/parse/price  
**File**: /lib/utilities/parse/price.js  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>String</code> \| <code>Number</code> |  |
| unitCode | <code>String</code> |  |
| [fractionSeparator] | <code>String</code> | Can be zero or one character in length. If invalid or omitted, the separator will be inferred based on the value being parsed. |
| [specialFractions] | <code>Boolean</code> | If fractional notation is used, indicates is "special" factor (i.e. denominator) was used to calculate the numerator of the value being parsed. |
| [thousandsSeparator] | <code>String</code> | = Can be zero or one character in length. If invalid or omitted, the parameter will be ignored. |

>Converts a string-formatted price into a number. If the value cannot be parsed,
the [Number.NaN](Number.NaN) value is returned.


* * *

