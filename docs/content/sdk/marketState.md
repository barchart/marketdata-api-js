## Classes

* [CumulativeVolume](#CumulativeVolume) 

* [Exchange](#Exchange) 

* [MarketState](#MarketState) 

* [Profile](#Profile) 

* [Quote](#Quote) 

## Typedefs

* [BookPriceLevel](#BookPriceLevel) 

* [Book](#Book) 

## CumulativeVolume :id=cumulativevolume
**Kind**: global class  
**Access**: public  
>An aggregation of the total volume traded at each price level for a
single instrument.


* [CumulativeVolume](#CumulativeVolume)
    * [.symbol](#CumulativeVolume+symbol)
    * [.getVolume(price)](#CumulativeVolume+getVolume) ⇒ <code>number</code>
    * [.toArray()](#CumulativeVolume+toArray) ⇒ [<code>Array.&lt;PriceLevel&gt;</code>](#PriceLevel)


* * *

### cumulativeVolume.symbol :id=cumulativevolumesymbol
**Kind**: instance property of [<code>CumulativeVolume</code>](#CumulativeVolume)  
**Properties**

| Name | Type |
| --- | --- |
| symbol | <code>string</code> | 


* * *

### cumulativeVolume.getVolume(price) :id=cumulativevolumegetvolume
**Kind**: instance method of [<code>CumulativeVolume</code>](#CumulativeVolume)  
**Access**: public  

| Param | Type |
| --- | --- |
| price | <code>number</code> | 

>Given a numeric price, returns the volume traded at that price level.


* * *

### cumulativeVolume.toArray() :id=cumulativevolumetoarray
**Kind**: instance method of [<code>CumulativeVolume</code>](#CumulativeVolume)  
>Returns an array of all price levels. This is an expensive operation. Observing
an ongoing subscription is preferred (see [Connection#on](Connection#on)).


* * *

## Exchange :id=exchange
**Kind**: global class  
**Access**: public  
>Describes an exchange.


* [Exchange](#Exchange)
    * [.id](#Exchange+id)
    * [.name](#Exchange+name)
    * [.timezoneDdf](#Exchange+timezoneDdf)
    * [.offsetDdf](#Exchange+offsetDdf)
    * [.timezoneExchange](#Exchange+timezoneExchange)
    * [.offsetExchange](#Exchange+offsetExchange)


* * *

### exchange.id :id=exchangeid
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | the code used to identify the exchange |


* * *

### exchange.name :id=exchangename
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the exchange |


* * *

### exchange.timezoneDdf :id=exchangetimezoneddf
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| timezoneDdf | <code>string</code> \| <code>null</code> | the timezone used by DDF for this exchange (should conform to a TZ database name) |


* * *

### exchange.offsetDdf :id=exchangeoffsetddf
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| offsetDdf | <code>number</code> \| <code>null</code> | the UTC offset, in milliseconds, for DDF purposes. |


* * *

### exchange.timezoneExchange :id=exchangetimezoneexchange
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| timezoneLocal | <code>string</code> | the actual timezone of the exchange (should conform to a TZ database name) |


* * *

### exchange.offsetExchange :id=exchangeoffsetexchange
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| offsetExchange | <code>number</code> | - the UTC offset, in milliseconds, of the exchange's local time. |


* * *

## MarketState :id=marketstate
**Kind**: global class  
**Access**: public  
>Repository for current market state. This repository will only contain
data for an instrument after a subscription has been established using
the [Connection#on](Connection#on) function.

Access the singleton instance using the [ConnectionBase#getMarketState](ConnectionBase#getMarketState)
function.


* [MarketState](#MarketState)
    * [.getProfile(symbol, [callback])](#MarketState+getProfile) ⇒ [<code>Promise.&lt;Profile&gt;</code>](#Profile)
    * [.getQuote(symbol)](#MarketState+getQuote) ⇒ [<code>Quote</code>](#Quote)
    * [.getBook(symbol)](#MarketState+getBook) ⇒ [<code>Book</code>](#Book)
    * [.getCumulativeVolume(symbol, [callback])](#MarketState+getCumulativeVolume) ⇒ [<code>Promise.&lt;CumulativeVolume&gt;</code>](#CumulativeVolume)
    * [.getTimestamp()](#MarketState+getTimestamp) ⇒ <code>Date</code>


* * *

### marketState.getProfile(symbol, [callback]) :id=marketstategetprofile
**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Returns**: [<code>Promise.&lt;Profile&gt;</code>](#Profile) - The [Profile](#Profile) instance, as a promise.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> |  |
| [callback] | <code>function</code> | invoked when the [Profile](#Profile) instance becomes available |


* * *

### marketState.getQuote(symbol) :id=marketstategetquote
**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>string</code> | 


* * *

### marketState.getBook(symbol) :id=marketstategetbook
**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>string</code> | 


* * *

### marketState.getCumulativeVolume(symbol, [callback]) :id=marketstategetcumulativevolume
**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Returns**: [<code>Promise.&lt;CumulativeVolume&gt;</code>](#CumulativeVolume) - The [CumulativeVolume](#CumulativeVolume) instance, as a promise  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> |  |
| [callback] | <code>function</code> | invoked when the [CumulativeVolume](#CumulativeVolume) instance becomes available |


* * *

### marketState.getTimestamp() :id=marketstategettimestamp
**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Access**: public  
>Returns the time the most recent market data message was received.


* * *

## Profile :id=profile
**Kind**: global class  
**Access**: public  
>Describes an instrument.


* [Profile](#Profile)
    * _instance_
        * [.symbol](#Profile+symbol)
        * [.name](#Profile+name)
        * [.exchange](#Profile+exchange)
        * [.unitCode](#Profile+unitCode)
        * [.pointValue](#Profile+pointValue)
        * [.tickIncrement](#Profile+tickIncrement)
        * [.exchangeRef](#Profile+exchangeRef)
        * [.root](#Profile+root)
        * [.month](#Profile+month)
        * [.year](#Profile+year)
        * [.expiration](#Profile+expiration)
        * [.firstNotice](#Profile+firstNotice)
        * [.formatPrice(price)](#Profile+formatPrice) ⇒ <code>string</code>
    * _static_
        * [.setPriceFormatter(fractionSeparator, specialFractions, [thousandsSeparator])](#Profile.setPriceFormatter)
        * ~~[.PriceFormatter()](#Profile.PriceFormatter)~~


* * *

### profile.symbol :id=profilesymbol
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | the symbol of the instrument. |


* * *

### profile.name :id=profilename
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the instrument. |


* * *

### profile.exchange :id=profileexchange
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| exchange | <code>string</code> | code of the listing exchange. |


* * *

### profile.unitCode :id=profileunitcode
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| unitCode | <code>string</code> | code indicating how a prices for the instrument should be formatted. |


* * *

### profile.pointValue :id=profilepointvalue
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| pointValue | <code>string</code> | the change in value for a one point change in price. |


* * *

### profile.tickIncrement :id=profiletickincrement
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tickIncrement | <code>number</code> | the minimum price movement. |


* * *

### profile.exchangeRef :id=profileexchangeref
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type |
| --- | --- |
| exchangeRef | [<code>Exchange</code>](#Exchange) \| <code>null</code> | 


* * *

### profile.root :id=profileroot
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| root | <code>string</code> \| <code>undefined</code> | the root symbol, if a future; otherwise undefined. |


* * *

### profile.month :id=profilemonth
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| month | <code>string</code> \| <code>undefined</code> | the month code, if a future; otherwise undefined. |


* * *

### profile.year :id=profileyear
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| year | <code>undefined</code> \| <code>number</code> | the expiration year, if a future; otherwise undefined. |


* * *

### profile.expiration :id=profileexpiration
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| expiration | <code>string</code> \| <code>undefined</code> | the expiration date, as a string, formatted YYYY-MM-DD. |


* * *

### profile.firstNotice :id=profilefirstnotice
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| expiration | <code>string</code> \| <code>undefined</code> | the first notice date, as a string, formatted YYYY-MM-DD. |


* * *

### profile.formatPrice(price) :id=profileformatprice
**Kind**: instance method of [<code>Profile</code>](#Profile)  
**Access**: public  

| Param | Type |
| --- | --- |
| price | <code>number</code> | 

>Given a numeric price, returns a human-readable price.


* * *

### Profile.setPriceFormatter(fractionSeparator, specialFractions, [thousandsSeparator]) :id=profilesetpriceformatter
**Kind**: static method of [<code>Profile</code>](#Profile)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| fractionSeparator | <code>string</code> | usually a dash or a period |
| specialFractions | <code>boolean</code> | usually true |
| [thousandsSeparator] | <code>string</code> | usually a comma |

>Configures the logic used to format all prices using the [formatPrice](#Profile+formatPrice) instance function.


* * *

### ~~Profile.PriceFormatter()~~ :id=profilepriceformatter
***Deprecated***

**Kind**: static method of [<code>Profile</code>](#Profile)  
**Access**: public  
**See**: [setPriceFormatter](#Profile.setPriceFormatter)  
>Alias for [setPriceFormatter](#Profile.setPriceFormatter) function.


* * *

## Quote :id=quote
**Kind**: global class  
**Access**: public  
>Current market conditions for an instrument.


* [Quote](#Quote)
    * [.symbol](#Quote+symbol)
    * [.message](#Quote+message)
    * [.flag](#Quote+flag)
    * [.day](#Quote+day)
    * [.dayNum](#Quote+dayNum)
    * [.lastUpdate](#Quote+lastUpdate)
    * [.bidPrice](#Quote+bidPrice)
    * [.bidSize](#Quote+bidSize)
    * [.askPrice](#Quote+askPrice)
    * [.askSize](#Quote+askSize)
    * [.lastPrice](#Quote+lastPrice)
    * [.tradePrice](#Quote+tradePrice)
    * [.tradeSize](#Quote+tradeSize)
    * [.blockTrade](#Quote+blockTrade)
    * [.settlementPrice](#Quote+settlementPrice)
    * [.previousPrice](#Quote+previousPrice)
    * [.time](#Quote+time)
    * [.profile](#Quote+profile)


* * *

### quote.symbol :id=quotesymbol
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | the symbol of the quoted instrument. |


* * *

### quote.message :id=quotemessage
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | last DDF message that caused a mutation to this instance. |


* * *

### quote.flag :id=quoteflag
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| flag | <code>string</code> | market status, will have one of three values: p, s, or undefined. |


* * *

### quote.day :id=quoteday
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| day | <code>string</code> | one character code that indicates day of the month of the current trading session. |


* * *

### quote.dayNum :id=quotedaynum
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| dayNum | <code>number</code> | day of the month of the current trading session. |


* * *

### quote.lastUpdate :id=quotelastupdate
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| lastUpdate | <code>Date</code> \| <code>null</code> | the most recent refresh. this date instance stores the hours and minutes for the exchange time (without proper timezone adjustment). use caution. |


* * *

### quote.bidPrice :id=quotebidprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| bidPrice | <code>number</code> | top-of-book price on the buy side. |


* * *

### quote.bidSize :id=quotebidsize
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| bidSize | <code>number</code> | top-of-book quantity on the buy side. |


* * *

### quote.askPrice :id=quoteaskprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| askPrice | <code>number</code> | top-of-book price on the sell side. |


* * *

### quote.askSize :id=quoteasksize
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| askSize | <code>number</code> | top-of-book quantity on the sell side. |


* * *

### quote.lastPrice :id=quotelastprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| lastPrice | <code>number</code> | most recent price (not necessarily a trade). |


* * *

### quote.tradePrice :id=quotetradeprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tradePrice | <code>number</code> | most recent trade price. |


* * *

### quote.tradeSize :id=quotetradesize
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tradeSize | <code>number</code> | most recent trade quantity. |


* * *

### quote.blockTrade :id=quoteblocktrade
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| blockTrade | <code>number</code> | most recent block trade price. |


* * *

### quote.settlementPrice :id=quotesettlementprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type |
| --- | --- |
| settlementPrice | <code>number</code> | 


* * *

### quote.previousPrice :id=quotepreviousprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| previousPrice | <code>number</code> | price from the previous session. |


* * *

### quote.time :id=quotetime
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| time | <code>Date</code> \| <code>null</code> | the most recent trade, quote, or refresh. this date instance stores the hours and minutes for the exchange time (without proper timezone adjustment). use caution. |


* * *

### quote.profile :id=quoteprofile
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| profile | [<code>Profile</code>](#Profile) \| <code>null</code> | metadata regarding the quoted instrument. |


* * *

## BookPriceLevel :id=bookpricelevel
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| price | <code>number</code> | 
| size | <code>number</code> | 


* * *

## Book :id=book
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| symbol | <code>string</code> | 
| bids | [<code>Array.&lt;BookPriceLevel&gt;</code>](#BookPriceLevel) | 
| asks | [<code>Array.&lt;BookPriceLevel&gt;</code>](#BookPriceLevel) | 


* * *

## ~PriceLevel :id=pricelevel
**Kind**: inner typedef  
**Properties**

| Name | Type |
| --- | --- |
| price | <code>number</code> | 
| volume | <code>number</code> | 


* * *

