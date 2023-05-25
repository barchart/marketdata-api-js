## Contents {docsify-ignore}

* [AssetClass](#AssetClass) 

* [UnitCode](#UnitCode) 

* [getTimezones()](#getTimezones) 

* [guessTimezone()](#guessTimezone) 


* * *

## AssetClass :id=assetclass
> An enumeration for instrument types (e.g. stock, future, etc).

**Kind**: global class  
**Extends**: <code>Enum</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/utilities/data/AssetClass  
**File**: /lib/utilities/data/AssetClass.js  

* [AssetClass](#AssetClass) ⇐ <code>Enum</code>
    * _instance_
        * [.id](#AssetClassid) ⇒ <code>Number</code>
    * _static_
        * [.STOCK](#AssetClassSTOCK) ⇒ [<code>AssetClass</code>](#AssetClass)
        * [.STOCK_OPTION](#AssetClassSTOCK_OPTION) ⇒ [<code>AssetClass</code>](#AssetClass)
        * [.FUTURE](#AssetClassFUTURE) ⇒ [<code>AssetClass</code>](#AssetClass)
        * [.FUTURE_OPTION](#AssetClassFUTURE_OPTION) ⇒ [<code>AssetClass</code>](#AssetClass)
        * [.FOREX](#AssetClassFOREX) ⇒ [<code>AssetClass</code>](#AssetClass)
        * [.CMDTY_STATS](#AssetClassCMDTY_STATS) ⇒ [<code>AssetClass</code>](#AssetClass)
        * [.parse(code)](#AssetClassparse) ⇒ [<code>AssetClass</code>](#AssetClass) \| <code>null</code>
        * [.fromId(id)](#AssetClassfromId) ⇒ [<code>AssetClass</code>](#AssetClass) \| <code>null</code>
    * _constructor_
        * [new AssetClass(code, description, id)](#new_AssetClass_new)


* * *

### assetClass.id :id=assetclassid
> A unique numeric identifier assigned by Barchart.

**Kind**: instance property of [<code>AssetClass</code>](#AssetClass)  
**Returns**: <code>Number</code>  
**Access**: public  

* * *

### AssetClass.STOCK :id=assetclassstock
> A stock.

**Kind**: static property of [<code>AssetClass</code>](#AssetClass)  
**Returns**: [<code>AssetClass</code>](#AssetClass)  
**Access**: public  

* * *

### AssetClass.STOCK\_OPTION :id=assetclassstock_option
> A stock option.

**Kind**: static property of [<code>AssetClass</code>](#AssetClass)  
**Returns**: [<code>AssetClass</code>](#AssetClass)  
**Access**: public  

* * *

### AssetClass.FUTURE :id=assetclassfuture
> A future.

**Kind**: static property of [<code>AssetClass</code>](#AssetClass)  
**Returns**: [<code>AssetClass</code>](#AssetClass)  
**Access**: public  

* * *

### AssetClass.FUTURE\_OPTION :id=assetclassfuture_option
> A future option.

**Kind**: static property of [<code>AssetClass</code>](#AssetClass)  
**Returns**: [<code>AssetClass</code>](#AssetClass)  
**Access**: public  

* * *

### AssetClass.FOREX :id=assetclassforex
> A foreign exchange instrument.

**Kind**: static property of [<code>AssetClass</code>](#AssetClass)  
**Returns**: [<code>AssetClass</code>](#AssetClass)  
**Access**: public  

* * *

### AssetClass.CMDTY\_STATS :id=assetclasscmdty_stats
> A cmdtyStats instrument.

**Kind**: static property of [<code>AssetClass</code>](#AssetClass)  
**Returns**: [<code>AssetClass</code>](#AssetClass)  
**Access**: public  

* * *

### AssetClass.parse(code) :id=assetclassparse
> Converts the string-based identifier into an enumeration item.

**Kind**: static method of [<code>AssetClass</code>](#AssetClass)  
**Returns**: [<code>AssetClass</code>](#AssetClass) \| <code>null</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| code | <code>String</code> | 


* * *

### AssetClass.fromId(id) :id=assetclassfromid
> Converts the numeric identifier into an enumeration item.

**Kind**: static method of [<code>AssetClass</code>](#AssetClass)  
**Returns**: [<code>AssetClass</code>](#AssetClass) \| <code>null</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| id | <code>Number</code> | 


* * *

### new AssetClass(code, description, id) :id=new_assetclass_new
**Kind**: constructor of [<code>AssetClass</code>](#AssetClass)  

| Param | Type |
| --- | --- |
| code | <code>String</code> | 
| description | <code>String</code> | 
| id | <code>Number</code> | 


* * *

## UnitCode :id=unitcode
> An enumeration that describes different conventions for formatting prices,
> as decimals or fractions (using tick notation). Each instrument is assigned
> a unit code. See the [Profile.unitCode](#profileunitcode) property.</p>
> <p>Barchart uses fourteen distinct unit codes.

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
        * [.parse(code)](#UnitCodeparse) ⇒ [<code>UnitCode</code>](#UnitCode) \| <code>null</code>
        * [.fromBaseCode(code)](#UnitCodefromBaseCode) ⇒ [<code>UnitCode</code>](#UnitCode) \| <code>null</code>
    * _constructor_
        * [new UnitCode(code, baseCode, decimalDigits, supportsFractions, [fractionFactor], fractionDigits, [fractionFactorSpecial], [fractionDigitsSpecial])](#new_UnitCode_new)


* * *

### unitCode.baseCode :id=unitcodebasecode
> The numeric counterpart of a &quot;unit&quot; code.

**Kind**: instance property of [<code>UnitCode</code>](#UnitCode)  
**Returns**: <code>Number</code>  
**Access**: public  

* * *

### unitCode.unitCode :id=unitcodeunitcode
> The single character &quot;unit&quot; code.

**Kind**: instance property of [<code>UnitCode</code>](#UnitCode)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### unitCode.decimalDigits :id=unitcodedecimaldigits
> When formatting in decimal mode, the number of digits to show after the
> decimal point.

**Kind**: instance property of [<code>UnitCode</code>](#UnitCode)  
**Returns**: <code>Number</code>  
**Access**: public  

* * *

### unitCode.supportsFractions :id=unitcodesupportsfractions
> Indicates if formatting can use the alternative to decimal notation -- that
> is, fractional notation.

**Kind**: instance property of [<code>UnitCode</code>](#UnitCode)  
**Returns**: <code>Boolean</code>  
**Access**: public  

* * *

### unitCode.fractionFactor :id=unitcodefractionfactor
> The count of discrete prices which a unit can be divided into (e.g. a US dollar can be divided
> into 100 cents). By default, this is also the implied denominator in fractional notation (e.g. 3.6875
> equals 3 and 22/32 — which is represented in fractional notation as &quot;3-22&quot;, where the denominator of 32
> is implied).

**Kind**: instance property of [<code>UnitCode</code>](#UnitCode)  
**Returns**: <code>Number</code> \| <code>undefined</code>  
**Access**: public  

* * *

### unitCode.fractionDigits :id=unitcodefractiondigits
> The number of digits of the fraction's numerator to display (e.g. using two digits, the fraction 22/32 is
> shown as &quot;0-22&quot;; using three digits, the fraction 22.375/32 is shown as &quot;0-223&quot;).

**Kind**: instance property of [<code>UnitCode</code>](#UnitCode)  
**Returns**: <code>Number</code> \| <code>undefined</code>  
**Access**: public  

* * *

### unitCode.fractionFactorSpecial :id=unitcodefractionfactorspecial
> Special fraction factors refer to the CME tick notation scheme (read more <a href="https://www.cmegroup.com/confluence/display/EPICSANDBOX/Fractional+Pricing+-+Tick+and+Decimal+Conversions">here</a>).

**Kind**: instance property of [<code>UnitCode</code>](#UnitCode)  
**Returns**: <code>Number</code> \| <code>undefined</code>  
**Access**: public  

* * *

### unitCode.fractionDigitsSpecial :id=unitcodefractiondigitsspecial
> Same as [fractionDigits](#unitcodefractiondigits) for &quot;special&quot; fractions.

**Kind**: instance property of [<code>UnitCode</code>](#UnitCode)  
**Returns**: <code>Number</code> \| <code>undefined</code>  
**Access**: public  

* * *

### unitCode.getFractionFactor([special]) :id=unitcodegetfractionfactor
> The number of digits of the fraction's numerator to display, when formatting
> in CME tick notation. For example, the notation &quot;0-163&quot; (in 1/8ths of 1/32nds) equates
> to the fraction of 16.375/32. This notation is limited to three digits (163)
> and omits the trailing two digits (75).

**Kind**: instance method of [<code>UnitCode</code>](#UnitCode)  
**Returns**: <code>Number</code> \| <code>undefined</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| [special] | <code>Boolean</code> | 


* * *

### unitCode.getFractionDigits([special]) :id=unitcodegetfractiondigits
> Returns the [fractionDigits](#unitcodefractiondigits) or [fractionDigitsSpecial](#unitcodefractiondigitsspecial) value.

**Kind**: instance method of [<code>UnitCode</code>](#UnitCode)  
**Returns**: <code>Number</code> \| <code>undefined</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| [special] | <code>Boolean</code> | 


* * *

### UnitCode.parse(code) :id=unitcodeparse
> Converts a unit code character into a [UnitCode](/content/sdk/lib-utilities-data?id=unitcode) enumeration item.

**Kind**: static method of [<code>UnitCode</code>](#UnitCode)  
**Returns**: [<code>UnitCode</code>](#UnitCode) \| <code>null</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| code | <code>String</code> | 


* * *

### UnitCode.fromBaseCode(code) :id=unitcodefrombasecode
> Converts a numeric &quot;base&quot; code into a [UnitCode](/content/sdk/lib-utilities-data?id=unitcode) item.

**Kind**: static method of [<code>UnitCode</code>](#UnitCode)  
**Returns**: [<code>UnitCode</code>](#UnitCode) \| <code>null</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| code | <code>Number</code> | 


* * *

### new UnitCode(code, baseCode, decimalDigits, supportsFractions, [fractionFactor], fractionDigits, [fractionFactorSpecial], [fractionDigitsSpecial]) :id=new_unitcode_new
**Kind**: constructor of [<code>UnitCode</code>](#UnitCode)  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>String</code> |  |
| baseCode | <code>Number</code> |  |
| decimalDigits | <code>Number</code> | <p>When formatting a price as a decimal value, the number of decimal places to display.</p> |
| supportsFractions | <code>Boolean</code> | <p>As an alternative to decimal-formatted prices, some instruments support fractional representations.</p> |
| [fractionFactor] | <code>Number</code> | <p>The count of discrete prices which a unit can be divided into (e.g. a US dollar can be divided into 100 cents). By default, this is also the implied denominator in fractional notation (e.g. 3.6875 equals 3 and 22/32 — which is represented in fractional notation as &quot;3-22&quot;, where the denominator of 32 is implied).</p> |
| fractionDigits | <code>Number</code> | <p>The number of digits of the fraction's numerator to display (e.g. using two digits, the fraction 22/32 is shown as &quot;0-22&quot;; using three digits, the fraction 22.375/32 is shown as &quot;0-223&quot;).</p> |
| [fractionFactorSpecial] | <code>Number</code> | <p>Special fraction factors refer to the CME tick notation scheme (read more <a href="https://www.cmegroup.com/confluence/display/EPICSANDBOX/Fractional+Pricing+-+Tick+and+Decimal+Conversions">here</a>). For example, the CME notation for 0.51171875 (in 1/8ths of 1/32nds) is &quot;0-163&quot;, where the numerator of &quot;163&quot; means 16 thirty-seconds and 3 eighths of a thirty-second, where the actual fraction is 16.3[75] / 32, which equals 0.51171875.</p> |
| [fractionDigitsSpecial] | <code>Number</code> | <p>The number of digits of the fraction's numerator to display, when formatting in CME tick notation. For example, the notation &quot;0-163&quot; (in 1/8ths of 1/32nds) equates to the fraction of 16.375/32. This notation is limited to three digits (163) and omits the trailing two digits (75).</p> |


* * *

## getTimezones() :id=gettimezones
> Gets a list of names in the tz database (see https://en.wikipedia.org/wiki/Tz_database
> and https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

**Kind**: global function  
**Returns**: <code>Array.&lt;String&gt;</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/utilities/data/timezones  
**File**: /lib/utilities/data/timezones.js  

* * *

## guessTimezone() :id=guesstimezone
> Attempts to guess the local timezone.

**Kind**: global function  
**Returns**: <code>String</code> \| <code>null</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/utilities/data/timezones  
**File**: /lib/utilities/data/timezones.js  

* * *

