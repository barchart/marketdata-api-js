## Contents {docsify-ignore}

* [UnitCode](#UnitCode) 

* [getTimezones()](#getTimezones) 

* [guessTimezone()](#guessTimezone) 


* * *

## UnitCode :id=unitcode
>Describes how an instrument's price is formatted. In most cases, unit codes are stored as a
single character; however, this enumeration adds additional information. There are fourteen
distinct unit codes.

**Kind**: global class  
**Extends**: <code>Enum</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/utilities/data/UnitCode  
**File**: /lib/utilities/data/UnitCode.js  

* [UnitCode](#UnitCode) ⇐ <code>Enum</code>
    * _instance_
        * [.baseCode](#UnitCodebaseCode) ⇒ <code>Number</code>
        * [.unitCode](#UnitCodeunitCode) ⇒ <code>String</code>
        * [.decimalDigits](#UnitCodedecimalDigits) ⇒ <code>Number</code>
        * [.supportsFractions](#UnitCodesupportsFractions) ⇒ <code>Boolean</code>
        * [.fractionFactor](#UnitCodefractionFactor) ⇒ <code>Number</code> \| <code>undefined</code>
        * [.fractionDigits](#UnitCodefractionDigits) ⇒ <code>Number</code> \| <code>undefined</code>
        * [.fractionFactorSpecial](#UnitCodefractionFactorSpecial) ⇒ <code>Number</code> \| <code>undefined</code>
        * [.fractionDigitsSpecial](#UnitCodefractionDigitsSpecial) ⇒ <code>Number</code> \| <code>undefined</code>
        * [.getFractionFactor([special])](#UnitCodegetFractionFactor) ⇒ <code>Number</code> \| <code>undefined</code>
        * [.getFractionDigits([special])](#UnitCodegetFractionDigits) ⇒ <code>Number</code> \| <code>undefined</code>
    * _static_
        * [.parse(code)](#UnitCodeparse) ⇒ <code>UnitCode</code> \| <code>null</code>
        * [.fromBaseCode(code)](#UnitCodefromBaseCode) ⇒ <code>UnitCode</code> \| <code>null</code>
    * _constructor_
        * [new UnitCode(code, baseCode, decimalDigits, supportsFractions, [fractionFactor], [fractionDigits], [fractionFactorSpecial], [fractionDigitsSpecial])](#new_UnitCode_new)


* * *

### unitCode.baseCode :id=unitcodebasecode
>The numeric counterpart of a "unit" code.

**Kind**: instance property of <code>UnitCode</code>  
**Returns**: <code>Number</code>  
**Access**: public  

* * *

### unitCode.unitCode :id=unitcodeunitcode
>The single character "unit" code.

**Kind**: instance property of <code>UnitCode</code>  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### unitCode.decimalDigits :id=unitcodedecimaldigits
>When formatting in decimal mode, the number of digits to show after the
decimal point.

**Kind**: instance property of <code>UnitCode</code>  
**Returns**: <code>Number</code>  
**Access**: public  

* * *

### unitCode.supportsFractions :id=unitcodesupportsfractions
>Indicates if formatting can use the alternative to decimal notation -- that
is, fractional notation.

**Kind**: instance property of <code>UnitCode</code>  
**Returns**: <code>Boolean</code>  
**Access**: public  

* * *

### unitCode.fractionFactor :id=unitcodefractionfactor
>When formatting with fractional notation (instead of decimal notation), multiply the
decimal part of the value by this factor to get the fractional (i.e. numerator) value.
In other words, this factor is the denominator.

For example, the value 9.5 will be formatted as "9-4" with a fractional factor of eight.
This is because 8 * 0.5 = 4. In other words, the price is quoted in eighths and 0.5 is
four eighths. Using the same logic, the value of 9.75 will be formatted as "9-6" with
a fractional factor of eight.

**Kind**: instance property of <code>UnitCode</code>  
**Returns**: <code>Number</code> \| <code>undefined</code>  
**Access**: public  

* * *

### unitCode.fractionDigits :id=unitcodefractiondigits
>In fractional notation, the number of digits to which appear after the fraction separator.
For example, two digits are used in "9-01" and "9-11" (where a dash is the fraction
separator).

**Kind**: instance property of <code>UnitCode</code>  
**Returns**: <code>Number</code> \| <code>undefined</code>  
**Access**: public  

* * *

### unitCode.fractionFactorSpecial :id=unitcodefractionfactorspecial
>Same as [fractionFactor](#UnitCodefractionFactor) for "special" fractions.

**Kind**: instance property of <code>UnitCode</code>  
**Returns**: <code>Number</code> \| <code>undefined</code>  
**Access**: public  

* * *

### unitCode.fractionDigitsSpecial :id=unitcodefractiondigitsspecial
>Same as [fractionDigits](#UnitCodefractionDigits) for "special" fractions.

**Kind**: instance property of <code>UnitCode</code>  
**Returns**: <code>Number</code> \| <code>undefined</code>  
**Access**: public  

* * *

### unitCode.getFractionFactor([special]) :id=unitcodegetfractionfactor
>Returns the [fractionFactor](#UnitCodefractionFactor) or [fractionFactorSpecial](#UnitCodefractionFactorSpecial) value.

**Kind**: instance method of <code>UnitCode</code>  
**Returns**: <code>Number</code> \| <code>undefined</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| [special] | <code>Boolean</code> | 


* * *

### unitCode.getFractionDigits([special]) :id=unitcodegetfractiondigits
>Returns the [fractionDigits](#UnitCodefractionDigits) or [fractionDigitsSpecial](#UnitCodefractionDigitsSpecial) value.

**Kind**: instance method of <code>UnitCode</code>  
**Returns**: <code>Number</code> \| <code>undefined</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| [special] | <code>Boolean</code> | 


* * *

### UnitCode.parse(code) :id=unitcodeparse
>Converts a unit code character into a [UnitCode](/content/sdk/lib-utilities-data?id=unitcode) enumeration item.

**Kind**: static method of <code>UnitCode</code>  
**Returns**: <code>UnitCode</code> \| <code>null</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| code | <code>String</code> | 


* * *

### UnitCode.fromBaseCode(code) :id=unitcodefrombasecode
>Converts a numeric "base" code into a [UnitCode](/content/sdk/lib-utilities-data?id=unitcode) item.

**Kind**: static method of <code>UnitCode</code>  
**Returns**: <code>UnitCode</code> \| <code>null</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| code | <code>Number</code> | 


* * *

### new UnitCode(code, baseCode, decimalDigits, supportsFractions, [fractionFactor], [fractionDigits], [fractionFactorSpecial], [fractionDigitsSpecial]) :id=new_unitcode_new
**Kind**: constructor of <code>UnitCode</code>  

| Param | Type |
| --- | --- |
| code | <code>String</code> | 
| baseCode | <code>Number</code> | 
| decimalDigits | <code>Number</code> | 
| supportsFractions | <code>Boolean</code> | 
| [fractionFactor] | <code>Number</code> | 
| [fractionDigits] | <code>Number</code> | 
| [fractionFactorSpecial] | <code>Number</code> | 
| [fractionDigitsSpecial] | <code>Number</code> | 


* * *

## getTimezones() :id=gettimezones
>Gets a list of names in the tz database (see https://en.wikipedia.org/wiki/Tz_database
and https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

**Kind**: global function  
**Returns**: <code>Array.&lt;String&gt;</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/utilities/data/timezones  
**File**: /lib/utilities/data/timezones.js  

* * *

## guessTimezone() :id=guesstimezone
>Attempts to guess the local timezone.

**Kind**: global function  
**Returns**: <code>String</code> \| <code>null</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/utilities/data/timezones  
**File**: /lib/utilities/data/timezones.js  

* * *

