## Functions :id=functions
**Kind**: global namespace  
**Import**: @barchart/marketdata-api-js/lib/utilities/format/meta  
**File**: /lib/utilities/format/meta.js  
>A meta namespace of pure functions.


* [Functions](#Functions) : <code>object</code>
    * [.formatDate([date], [utc])](#FunctionsformatDate) ⇒ <code>String</code>
    * [.formatDecimal(value, digits, [thousandsSeparator], [useParenthesis])](#FunctionsformatDecimal) ⇒ <code>String</code>
    * [.formatPrice(value, unitcode, [fractionSeparator], [specialFractions], [thousandsSeparator], [useParenthesis])](#FunctionsformatPrice) ⇒ <code>String</code>
    * [.formatQuoteDateTime(quote, [useTwelveHourClock], [short], [timezone])](#FunctionsformatQuoteDateTime) ⇒ <code>String</code>
    * [.formatSymbol(symbol)](#FunctionsformatSymbol) ⇒ <code>String</code> \| <code>\*</code>
    * [.formatTime(date, [timezone], [useTwelveHourClock], [short], [utc])](#FunctionsformatTime) ⇒ <code>String</code>


* * *

### Functions.formatDate([date], [utc]) :id=functionsformatdate
**Kind**: static method of <code>Functions</code>  
**Returns**: <code>String</code>  
**Import**: @barchart/marketdata-api-js/lib/utilities/format/date  
**File**: /lib/utilities/format/date.js  

| Param | Type |
| --- | --- |
| [date] | <code>Date</code> | 
| [utc] | <code>Boolean</code> | 

>Formats a [Date](Date) instance as a string (using a MM/DD/YY pattern).


* * *

### Functions.formatDecimal(value, digits, [thousandsSeparator], [useParenthesis]) :id=functionsformatdecimal
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

>Formats a number as a string.


* * *

### Functions.formatPrice(value, unitcode, [fractionSeparator], [specialFractions], [thousandsSeparator], [useParenthesis]) :id=functionsformatprice
**Kind**: static method of <code>Functions</code>  
**Returns**: <code>String</code>  
**Import**: @barchart/marketdata-api-js/lib/utilities/format/price  
**File**: /lib/utilities/format/price.js  

| Param | Type |
| --- | --- |
| value | <code>Number</code> | 
| unitcode | <code>String</code> | 
| [fractionSeparator] | <code>String</code> | 
| [specialFractions] | <code>Boolean</code> | 
| [thousandsSeparator] | <code>String</code> | 
| [useParenthesis] | <code>Boolean</code> | 

>Formats a number as a string.


* * *

### Functions.formatQuoteDateTime(quote, [useTwelveHourClock], [short], [timezone]) :id=functionsformatquotedatetime
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

>Returns a string-formatted date (or time), based on a [Quote](/content/sdk/lib-marketstate?id=quote) instance's
state. If the market is open, and a trade has occurred, then the formatted time
is returned. Otherwise, the formatted date is returned.


* * *

### Functions.formatSymbol(symbol) :id=functionsformatsymbol
**Kind**: static method of <code>Functions</code>  
**Returns**: <code>String</code> \| <code>\*</code>  
**Import**: @barchart/marketdata-api-js/lib/utilities/format/symbol  
**File**: /lib/utilities/format/symbol.js  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> \| <code>\*</code> | 

>Formats a string (by capitalizing it). If anything other than a string
is passed, the argument is returned without modification.


* * *

### Functions.formatTime(date, [timezone], [useTwelveHourClock], [short], [utc]) :id=functionsformattime
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

>Formats a [Date](Date) instance's time component as a string.


* * *

