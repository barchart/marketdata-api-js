## Contents {docsify-ignore}

* [CumulativeVolume](#CumulativeVolume) 

* [Exchange](#Exchange) 

* [MarketState](#MarketState) 

* [Profile](#Profile) 

* [Quote](#Quote) 

## CumulativeVolume :id=cumulativevolume
**Kind**: global class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/CumulativeVolume  
**File**: ./lib/marketState/CumulativeVolume.js  
>An aggregation of the total volume traded at each price level for a
single instrument.


* [CumulativeVolume](#CumulativeVolume)
    * [.symbol](#CumulativeVolumesymbol)
    * [.getVolume(price)](#CumulativeVolumegetVolume) ⇒ <code>number</code>
    * [.toArray()](#CumulativeVolumetoArray) ⇒ [<code>Array.&lt;PriceLevel&gt;</code>](#PriceLevel)


* * *

### cumulativeVolume.symbol :id=cumulativevolumesymbol
**Kind**: instance property of [<code>CumulativeVolume</code>](#CumulativeVolume)  
**Import**: @barchart/marketdata-api-js/lib/marketState/CumulativeVolume  
**File**: ./lib/marketState/CumulativeVolume.js  
**Properties**

| Name | Type |
| --- | --- |
| symbol | <code>string</code> | 


* * *

### cumulativeVolume.getVolume(price) :id=cumulativevolumegetvolume
**Kind**: instance method of [<code>CumulativeVolume</code>](#CumulativeVolume)  
**Returns**: <code>number</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/CumulativeVolume  
**File**: ./lib/marketState/CumulativeVolume.js  

| Param | Type |
| --- | --- |
| price | <code>number</code> | 

>Given a numeric price, returns the volume traded at that price level.


* * *

### cumulativeVolume.toArray() :id=cumulativevolumetoarray
**Kind**: instance method of [<code>CumulativeVolume</code>](#CumulativeVolume)  
**Returns**: [<code>Array.&lt;PriceLevel&gt;</code>](#PriceLevel)  
**Import**: @barchart/marketdata-api-js/lib/marketState/CumulativeVolume  
**File**: ./lib/marketState/CumulativeVolume.js  
>Returns an array of all price levels. This is an expensive operation. Observing
an ongoing subscription is preferred (see [Connection#on](/content/sdk/connection?id=connectionon)).


* * *

## Exchange :id=exchange
**Kind**: global class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Exchange  
**File**: ./lib/marketState/Exchange.js  
>Describes an exchange.


* [Exchange](#Exchange)
    * [.id](#Exchangeid)
    * [.name](#Exchangename)
    * [.timezoneDdf](#ExchangetimezoneDdf)
    * [.offsetDdf](#ExchangeoffsetDdf)
    * [.timezoneExchange](#ExchangetimezoneExchange)
    * [.offsetExchange](#ExchangeoffsetExchange)


* * *

### exchange.id :id=exchangeid
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Exchange  
**File**: ./lib/marketState/Exchange.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | the code used to identify the exchange |


* * *

### exchange.name :id=exchangename
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Exchange  
**File**: ./lib/marketState/Exchange.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the exchange |


* * *

### exchange.timezoneDdf :id=exchangetimezoneddf
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Exchange  
**File**: ./lib/marketState/Exchange.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| timezoneDdf | <code>string</code> \| <code>null</code> | the timezone used by DDF for this exchange (should conform to a TZ database name) |


* * *

### exchange.offsetDdf :id=exchangeoffsetddf
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Exchange  
**File**: ./lib/marketState/Exchange.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| offsetDdf | <code>number</code> \| <code>null</code> | the UTC offset, in milliseconds, for DDF purposes. |


* * *

### exchange.timezoneExchange :id=exchangetimezoneexchange
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Exchange  
**File**: ./lib/marketState/Exchange.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| timezoneLocal | <code>string</code> | the actual timezone of the exchange (should conform to a TZ database name) |


* * *

### exchange.offsetExchange :id=exchangeoffsetexchange
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Exchange  
**File**: ./lib/marketState/Exchange.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| offsetExchange | <code>number</code> | - the UTC offset, in milliseconds, of the exchange's local time. |


* * *

## MarketState :id=marketstate
**Kind**: global class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/MarketState  
**File**: ./lib/marketState/MarketState.js  
>Repository for current market state. This repository will only contain
data for an instrument after a subscription has been established using
the [Connection#on](/content/sdk/connection?id=connectionon) function.

Access the singleton instance using the [ConnectionBase#getMarketState](/content/sdk/connection?id=connectionbasegetmarketstate)
function.


* [MarketState](#MarketState)
    * [.getProfile(symbol, [callback])](#MarketStategetProfile) ⇒ [<code>Promise.&lt;Profile&gt;</code>](#Profile)
    * [.getQuote(symbol)](#MarketStategetQuote) ⇒ [<code>Quote</code>](#Quote)
    * [.getBook(symbol)](#MarketStategetBook) ⇒ <code>Book</code>
    * [.getCumulativeVolume(symbol, [callback])](#MarketStategetCumulativeVolume) ⇒ [<code>Promise.&lt;CumulativeVolume&gt;</code>](#CumulativeVolume)
    * [.getTimestamp()](#MarketStategetTimestamp) ⇒ <code>Date</code>


* * *

### marketState.getProfile(symbol, [callback]) :id=marketstategetprofile
**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Returns**: [<code>Promise.&lt;Profile&gt;</code>](#Profile) - The [Profile](/content/sdk/marketstate?id=profile) instance, as a promise.  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/MarketState  
**File**: ./lib/marketState/MarketState.js  

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> |  |
| [callback] | <code>function</code> | invoked when the [Profile](/content/sdk/marketstate?id=profile) instance becomes available |


* * *

### marketState.getQuote(symbol) :id=marketstategetquote
**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Returns**: [<code>Quote</code>](#Quote)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/MarketState  
**File**: ./lib/marketState/MarketState.js  

| Param | Type |
| --- | --- |
| symbol | <code>string</code> | 


* * *

### marketState.getBook(symbol) :id=marketstategetbook
**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Returns**: <code>Book</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/MarketState  
**File**: ./lib/marketState/MarketState.js  

| Param | Type |
| --- | --- |
| symbol | <code>string</code> | 


* * *

### marketState.getCumulativeVolume(symbol, [callback]) :id=marketstategetcumulativevolume
**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Returns**: [<code>Promise.&lt;CumulativeVolume&gt;</code>](#CumulativeVolume) - The [CumulativeVolume](/content/sdk/marketstate?id=cumulativevolume) instance, as a promise  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/MarketState  
**File**: ./lib/marketState/MarketState.js  

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> |  |
| [callback] | <code>function</code> | invoked when the [CumulativeVolume](/content/sdk/marketstate?id=cumulativevolume) instance becomes available |


* * *

### marketState.getTimestamp() :id=marketstategettimestamp
**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Returns**: <code>Date</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/MarketState  
**File**: ./lib/marketState/MarketState.js  
>Returns the time the most recent market data message was received.


* * *

## Profile :id=profile
**Kind**: global class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: ./lib/marketState/Profile.js  
>Describes an instrument.


* [Profile](#Profile)
    * _instance_
        * [.symbol](#Profilesymbol)
        * [.name](#Profilename)
        * [.exchange](#Profileexchange)
        * [.unitCode](#ProfileunitCode)
        * [.pointValue](#ProfilepointValue)
        * [.tickIncrement](#ProfiletickIncrement)
        * [.exchangeRef](#ProfileexchangeRef)
        * [.root](#Profileroot)
        * [.month](#Profilemonth)
        * [.year](#Profileyear)
        * [.expiration](#Profileexpiration)
        * [.firstNotice](#ProfilefirstNotice)
        * [.formatPrice(price)](#ProfileformatPrice) ⇒ <code>string</code>
    * _static_
        * [.setPriceFormatter(fractionSeparator, specialFractions, [thousandsSeparator])](#ProfilesetPriceFormatter)
        * ~~[.PriceFormatter()](#ProfilePriceFormatter)~~


* * *

### profile.symbol :id=profilesymbol
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: ./lib/marketState/Profile.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | the symbol of the instrument. |


* * *

### profile.name :id=profilename
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: ./lib/marketState/Profile.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the instrument. |


* * *

### profile.exchange :id=profileexchange
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: ./lib/marketState/Profile.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| exchange | <code>string</code> | code of the listing exchange. |


* * *

### profile.unitCode :id=profileunitcode
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: ./lib/marketState/Profile.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| unitCode | <code>string</code> | code indicating how a prices for the instrument should be formatted. |


* * *

### profile.pointValue :id=profilepointvalue
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: ./lib/marketState/Profile.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| pointValue | <code>string</code> | the change in value for a one point change in price. |


* * *

### profile.tickIncrement :id=profiletickincrement
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: ./lib/marketState/Profile.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tickIncrement | <code>number</code> | the minimum price movement. |


* * *

### profile.exchangeRef :id=profileexchangeref
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: ./lib/marketState/Profile.js  
**Properties**

| Name | Type |
| --- | --- |
| exchangeRef | [<code>Exchange</code>](#Exchange) \| <code>null</code> | 


* * *

### profile.root :id=profileroot
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: ./lib/marketState/Profile.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| root | <code>string</code> \| <code>undefined</code> | the root symbol, if a future; otherwise undefined. |


* * *

### profile.month :id=profilemonth
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: ./lib/marketState/Profile.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| month | <code>string</code> \| <code>undefined</code> | the month code, if a future; otherwise undefined. |


* * *

### profile.year :id=profileyear
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: ./lib/marketState/Profile.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| year | <code>undefined</code> \| <code>number</code> | the expiration year, if a future; otherwise undefined. |


* * *

### profile.expiration :id=profileexpiration
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: ./lib/marketState/Profile.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| expiration | <code>string</code> \| <code>undefined</code> | the expiration date, as a string, formatted YYYY-MM-DD. |


* * *

### profile.firstNotice :id=profilefirstnotice
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: ./lib/marketState/Profile.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| expiration | <code>string</code> \| <code>undefined</code> | the first notice date, as a string, formatted YYYY-MM-DD. |


* * *

### profile.formatPrice(price) :id=profileformatprice
**Kind**: instance method of [<code>Profile</code>](#Profile)  
**Returns**: <code>string</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: ./lib/marketState/Profile.js  

| Param | Type |
| --- | --- |
| price | <code>number</code> | 

>Given a numeric price, returns a human-readable price.


* * *

### Profile.setPriceFormatter(fractionSeparator, specialFractions, [thousandsSeparator]) :id=profilesetpriceformatter
**Kind**: static method of [<code>Profile</code>](#Profile)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: ./lib/marketState/Profile.js  

| Param | Type | Description |
| --- | --- | --- |
| fractionSeparator | <code>string</code> | usually a dash or a period |
| specialFractions | <code>boolean</code> | usually true |
| [thousandsSeparator] | <code>string</code> | usually a comma |

>Configures the logic used to format all prices using the [formatPrice](#ProfileformatPrice) instance function.


* * *

### ~~Profile.PriceFormatter()~~ :id=profilepriceformatter
***Deprecated***

**Kind**: static method of [<code>Profile</code>](#Profile)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: ./lib/marketState/Profile.js  
**See**: [setPriceFormatter](#ProfilesetPriceFormatter)  
>Alias for [setPriceFormatter](#ProfilesetPriceFormatter) function.


* * *

## Quote :id=quote
**Kind**: global class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: ./lib/marketState/Quote.js  
>Current market conditions for an instrument.


* [Quote](#Quote)
    * [.symbol](#Quotesymbol)
    * [.message](#Quotemessage)
    * [.flag](#Quoteflag)
    * [.day](#Quoteday)
    * [.dayNum](#QuotedayNum)
    * [.lastUpdate](#QuotelastUpdate)
    * [.bidPrice](#QuotebidPrice)
    * [.bidSize](#QuotebidSize)
    * [.askPrice](#QuoteaskPrice)
    * [.askSize](#QuoteaskSize)
    * [.lastPrice](#QuotelastPrice)
    * [.tradePrice](#QuotetradePrice)
    * [.tradeSize](#QuotetradeSize)
    * [.blockTrade](#QuoteblockTrade)
    * [.settlementPrice](#QuotesettlementPrice)
    * [.previousPrice](#QuotepreviousPrice)
    * [.time](#Quotetime)
    * [.profile](#Quoteprofile)


* * *

### quote.symbol :id=quotesymbol
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: ./lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | the symbol of the quoted instrument. |


* * *

### quote.message :id=quotemessage
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: ./lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | last DDF message that caused a mutation to this instance. |


* * *

### quote.flag :id=quoteflag
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: ./lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| flag | <code>string</code> | market status, will have one of three values: p, s, or undefined. |


* * *

### quote.day :id=quoteday
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: ./lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| day | <code>string</code> | one character code that indicates day of the month of the current trading session. |


* * *

### quote.dayNum :id=quotedaynum
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: ./lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| dayNum | <code>number</code> | day of the month of the current trading session. |


* * *

### quote.lastUpdate :id=quotelastupdate
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: ./lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| lastUpdate | <code>Date</code> \| <code>null</code> | the most recent refresh. this date instance stores the hours and minutes for the exchange time (without proper timezone adjustment). use caution. |


* * *

### quote.bidPrice :id=quotebidprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: ./lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| bidPrice | <code>number</code> | top-of-book price on the buy side. |


* * *

### quote.bidSize :id=quotebidsize
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: ./lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| bidSize | <code>number</code> | top-of-book quantity on the buy side. |


* * *

### quote.askPrice :id=quoteaskprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: ./lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| askPrice | <code>number</code> | top-of-book price on the sell side. |


* * *

### quote.askSize :id=quoteasksize
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: ./lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| askSize | <code>number</code> | top-of-book quantity on the sell side. |


* * *

### quote.lastPrice :id=quotelastprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: ./lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| lastPrice | <code>number</code> | most recent price (not necessarily a trade). |


* * *

### quote.tradePrice :id=quotetradeprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: ./lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tradePrice | <code>number</code> | most recent trade price. |


* * *

### quote.tradeSize :id=quotetradesize
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: ./lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tradeSize | <code>number</code> | most recent trade quantity. |


* * *

### quote.blockTrade :id=quoteblocktrade
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: ./lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| blockTrade | <code>number</code> | most recent block trade price. |


* * *

### quote.settlementPrice :id=quotesettlementprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: ./lib/marketState/Quote.js  
**Properties**

| Name | Type |
| --- | --- |
| settlementPrice | <code>number</code> | 


* * *

### quote.previousPrice :id=quotepreviousprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: ./lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| previousPrice | <code>number</code> | price from the previous session. |


* * *

### quote.time :id=quotetime
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: ./lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| time | <code>Date</code> \| <code>null</code> | the most recent trade, quote, or refresh. this date instance stores the hours and minutes for the exchange time (without proper timezone adjustment). use caution. |


* * *

### quote.profile :id=quoteprofile
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: ./lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| profile | [<code>Profile</code>](#Profile) \| <code>null</code> | metadata regarding the quoted instrument. |


* * *

## ~PriceLevel :id=pricelevel
**Kind**: inner typedef  
**Import**: @barchart/marketdata-api-js/lib/marketState/CumulativeVolume  
**File**: ./lib/marketState/CumulativeVolume.js  
**Properties**

| Name | Type |
| --- | --- |
| price | <code>number</code> | 
| volume | <code>number</code> | 


* * *

