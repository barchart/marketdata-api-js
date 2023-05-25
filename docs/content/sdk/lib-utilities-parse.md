## Functions :id=functions
> A meta namespace of pure functions.

**Kind**: global namespace  

* * *

### Functions.parsePrice(value, unitCode, [fractionSeparator], [specialFractions], [thousandsSeparator]) :id=functionsparseprice
> Converts a string-formatted price into a number. If the value cannot be parsed,
> the [Number.NaN](#numbernan) value is returned.

**Kind**: static method of [<code>Functions</code>](#Functions)  
**Returns**: <code>Number</code>  
**Import**: @barchart/marketdata-api-js/lib/utilities/parse/price  
**File**: /lib/utilities/parse/price.js  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>String</code> \| <code>Number</code> |  |
| unitCode | <code>String</code> |  |
| [fractionSeparator] | <code>String</code> | <p>Can be zero or one character in length. If invalid or omitted, the separator will be inferred based on the value being parsed.</p> |
| [specialFractions] | <code>Boolean</code> | <p>If fractional notation is used, indicates if the &quot;special&quot; factor (i.e. denominator) was used to calculate the numerator of the value being parsed.</p> |
| [thousandsSeparator] | <code>String</code> | <p>Can be zero or one character in length. If invalid or omitted, the parameter will be ignored.</p> |


* * *

