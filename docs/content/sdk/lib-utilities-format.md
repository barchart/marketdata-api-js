## Functions :id=functions
>A meta namespace of pure functions.

**Kind**: global namespace  

* [Functions](#Functions) : <code>object</code>
    * _static_
        * [.formatDate([date], [utc])](#FunctionsformatDate) ⇒ <code>String</code>
        * [.formatDecimal(value, digits, [thousandsSeparator], [useParenthesis])](#FunctionsformatDecimal) ⇒ <code>String</code>
        * [.formatPrice(value, unitCode, [fractionSeparator], [specialFractions], [thousandsSeparator], [useParenthesis])](#FunctionsformatPrice) ⇒ <code>String</code>
        * [.formatQuoteDateTime(quote, [useTwelveHourClock], [short], [timezone])](#FunctionsformatQuoteDateTime) ⇒ <code>String</code>
        * [.formatSymbol(symbol)](#FunctionsformatSymbol) ⇒ <code>String</code> \| <code>\*</code>
        * [.formatTime(date, [timezone], [useTwelveHourClock], [short], [utc])](#FunctionsformatTime) ⇒ <code>String</code>


* * *

### Functions.formatDate([date], [utc]) :id=functionsformatdate
>Formats a [Date](Date) instance as a string (using a MM/DD/YY pattern).

**Kind**: static method of <code>Functions</code>  
**Returns**: <code>String</code>  
**Import**: @barchart/marketdata-api-js/lib/utilities/format/date  
**File**: /lib/utilities/format/date.js  

| Param | Type |
| --- | --- |
| [date] | <code>Date</code> | 
| [utc] | <code>Boolean</code> | 


* * *

### Functions.formatDecimal(value, digits, [thousandsSeparator], [useParenthesis]) :id=functionsformatdecimal
>Formats a number as a string.

**Kind**: static method of <code>Functions</code>  
**Returns**: <code>String</code>  
**Import**: @barchart/marketdata-api-js/lib/utilities/format/decimal  
**File**: /lib/utilities/format/decimal.js  

| Param | Type |
| --- | --- |
| value | <code>Number</code> | 
| digits | <code>Number</code> | 
| [thousandsSeparator] | <code>String</code> | 
| [useParenthesis] | <code>Boolean</code> | 


* * *

### Functions.formatPrice(value, unitCode, [fractionSeparator], [specialFractions], [thousandsSeparator], [useParenthesis]) :id=functionsformatprice
>Converts a numeric price into a human-readable string. One of two modes
may be used, depending on the unit code and fraction separator. For example,
using unit code "2" the value 9.5432 is formatted as "9.543" in decimal
mode and "9-4" in fractional mode.

**Kind**: static method of <code>Functions</code>  
**Returns**: <code>String</code>  
**Import**: @barchart/marketdata-api-js/lib/utilities/format/price  
**File**: /lib/utilities/format/price.js  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> |  |
| unitCode | <code>String</code> |  |
| [fractionSeparator] | <code>String</code> | Can be zero or one character in length. If invalid or omitted, a decimal notation is used. If non-decimal, then fractional notation is used (assuming supported by unit code). |
| [specialFractions] | <code>Boolean</code> | If fractional notation is used, indicates if the "special" factor (i.e. denominator) is used to calculate numerator. |
| [thousandsSeparator] | <code>String</code> | Can be zero or one character in length. If invalid or omitted, a zero-length string is used. |
| [useParenthesis] | <code>Boolean</code> | If true, negative values will be represented with parenthesis (instead of a leading minus sign). |


* * *

### Functions.formatQuoteDateTime(quote, [useTwelveHourClock], [short], [timezone]) :id=functionsformatquotedatetime
>Returns a string-formatted date (or time), based on a [Quote](/content/sdk/lib-marketstate?id=quote) instance's
state. If the market is open, and a trade has occurred, then the formatted time
is returned. Otherwise, the formatted date is returned.

**Kind**: static method of <code>Functions</code>  
**Returns**: <code>String</code>  
**Import**: @barchart/marketdata-api-js/lib/utilities/format/quote  
**File**: /lib/utilities/format/quote.js  

| Param | Type | Description |
| --- | --- | --- |
| quote | <code>Quote</code> |  |
| [useTwelveHourClock] | <code>Boolean</code> |  |
| [short] | <code>Boolean</code> |  |
| [timezone] | <code>String</code> | A name from the tz database (see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) or "EXCHANGE" |


* * *

### Functions.formatSymbol(symbol) :id=functionsformatsymbol
>Formats a string (by capitalizing it). If anything other than a string
is passed, the argument is returned without modification.

**Kind**: static method of <code>Functions</code>  
**Returns**: <code>String</code> \| <code>\*</code>  
**Import**: @barchart/marketdata-api-js/lib/utilities/format/symbol  
**File**: /lib/utilities/format/symbol.js  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> \| <code>\*</code> | 


* * *

### Functions.formatTime(date, [timezone], [useTwelveHourClock], [short], [utc]) :id=functionsformattime
>Formats a [Date](Date) instance's time component as a string.

**Kind**: static method of <code>Functions</code>  
**Returns**: <code>String</code>  
**Import**: @barchart/marketdata-api-js/lib/utilities/format/time  
**File**: /lib/utilities/format/time.js  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 
| [timezone] | <code>String</code> | 
| [useTwelveHourClock] | <code>Boolean</code> | 
| [short] | <code>Boolean</code> | 
| [utc] | <code>Boolean</code> | 


* * *

