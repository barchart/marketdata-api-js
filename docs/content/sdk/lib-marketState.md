## Contents {docsify-ignore}

* [CumulativeVolume](#CumulativeVolume) 

* [Exchange](#Exchange) 

* [MarketState](#MarketState) 

* [Profile](#Profile) 

* [Quote](#Quote) 

* [Schema](#Schema) 

## CumulativeVolume :id=cumulativevolume
**Kind**: global class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/CumulativeVolume  
**File**: /lib/marketState/CumulativeVolume.js  
>An aggregation of the total volume traded at each price level for a
single instrument, mutates as **CumulativeVolume** subscription updates
are processed (see [Enums.SubscriptionType](/content/sdk/lib-connection?id=enumssubscriptiontype)).


* [CumulativeVolume](#CumulativeVolume)
    * [.symbol](#CumulativeVolumesymbol)
    * [.getVolume(price)](#CumulativeVolumegetVolume) ⇒ <code>number</code>
    * [.toArray()](#CumulativeVolumetoArray) ⇒ [<code>Array.&lt;VolumeLevel&gt;</code>](#SchemaVolumeLevel)


* * *

### cumulativeVolume.symbol :id=cumulativevolumesymbol
**Kind**: instance property of [<code>CumulativeVolume</code>](#CumulativeVolume)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/CumulativeVolume  
**File**: /lib/marketState/CumulativeVolume.js  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | Symbol of the cumulative volume. |


* * *

### cumulativeVolume.getVolume(price) :id=cumulativevolumegetvolume
**Kind**: instance method of [<code>CumulativeVolume</code>](#CumulativeVolume)  
**Returns**: <code>number</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/CumulativeVolume  
**File**: /lib/marketState/CumulativeVolume.js  

| Param | Type |
| --- | --- |
| price | <code>number</code> | 

>Given a numeric price, returns the volume traded at that price level.


* * *

### cumulativeVolume.toArray() :id=cumulativevolumetoarray
**Kind**: instance method of [<code>CumulativeVolume</code>](#CumulativeVolume)  
**Returns**: [<code>Array.&lt;VolumeLevel&gt;</code>](#SchemaVolumeLevel)  
**Import**: @barchart/marketdata-api-js/lib/marketState/CumulativeVolume  
**File**: /lib/marketState/CumulativeVolume.js  
>Returns an array of all price levels. This is an expensive operation. Observing
an ongoing subscription is preferred (see [Connection#on](/content/sdk/lib-connection?id=connectionon)).


* * *

## Exchange :id=exchange
**Kind**: global class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Exchange  
**File**: /lib/marketState/Exchange.js  
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
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Exchange  
**File**: /lib/marketState/Exchange.js  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Barchart code for the exchange |


* * *

### exchange.name :id=exchangename
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Exchange  
**File**: /lib/marketState/Exchange.js  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the exchange |


* * *

### exchange.timezoneDdf :id=exchangetimezoneddf
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Exchange  
**File**: /lib/marketState/Exchange.js  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| timezoneDdf | <code>string</code> \| <code>null</code> | Implied timezone of DDF messages for this exchange (conforms to a TZ database name) |


* * *

### exchange.offsetDdf :id=exchangeoffsetddf
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Exchange  
**File**: /lib/marketState/Exchange.js  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| offsetDdf | <code>number</code> \| <code>null</code> | The offset, in milliseconds, between a DDF time and UTC. |


* * *

### exchange.timezoneExchange :id=exchangetimezoneexchange
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Exchange  
**File**: /lib/marketState/Exchange.js  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| timezoneLocal | <code>string</code> | Timezone exchange is physically located in (conforms to a TZ database name). |


* * *

### exchange.offsetExchange :id=exchangeoffsetexchange
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Exchange  
**File**: /lib/marketState/Exchange.js  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| offsetExchange | <code>number</code> | - The offset, in milliseconds, between exchange time and UTC. |


* * *

## MarketState :id=marketstate
**Kind**: global class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/MarketState  
**File**: /lib/marketState/MarketState.js  
>Repository for current market state. This repository will only contain
data for an symbol after a subscription has been established using
the [Connection#on](/content/sdk/lib-connection?id=connectionon) function.

Access the singleton instance using the [Connection#getMarketState](/content/sdk/lib-connection?id=connectiongetmarketstate)
function.


* [MarketState](#MarketState)
    * [.getProfile(symbol, [callback])](#MarketStategetProfile) ⇒ <code>Promise.&lt;(Profile\|null)&gt;</code>
    * [.getQuote(symbol)](#MarketStategetQuote) ⇒ [<code>Quote</code>](#Quote) \| <code>undefined</code>
    * [.getBook(symbol)](#MarketStategetBook) ⇒ [<code>Book</code>](#SchemaBook) \| <code>undefined</code>
    * [.getCumulativeVolume(symbol, [callback])](#MarketStategetCumulativeVolume) ⇒ [<code>Promise.&lt;CumulativeVolume&gt;</code>](#CumulativeVolume)
    * [.getTimestamp()](#MarketStategetTimestamp) ⇒ <code>Date</code>


* * *

### marketState.getProfile(symbol, [callback]) :id=marketstategetprofile
**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Returns**: <code>Promise.&lt;(Profile\|null)&gt;</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/MarketState  
**File**: /lib/marketState/MarketState.js  

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> |  |
| [callback] | <code>function</code> | Invoked when the [Profile](/content/sdk/lib-marketstate?id=profile) instance becomes available |

>Returns a promise for the [Profile](/content/sdk/lib-marketstate?id=profile) instance matching the symbol provided.


* * *

### marketState.getQuote(symbol) :id=marketstategetquote
**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Returns**: [<code>Quote</code>](#Quote) \| <code>undefined</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/MarketState  
**File**: /lib/marketState/MarketState.js  

| Param | Type |
| --- | --- |
| symbol | <code>string</code> | 

>Synchronously returns the [Quote](/content/sdk/lib-marketstate?id=quote) instance for a symbol. If no **MarketUpdate**
subscription has been established for the symbol, an undefined value will be returned
(see [Enums.SubscriptionType](/content/sdk/lib-connection?id=enumssubscriptiontype)).


* * *

### marketState.getBook(symbol) :id=marketstategetbook
**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Returns**: [<code>Book</code>](#SchemaBook) \| <code>undefined</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/MarketState  
**File**: /lib/marketState/MarketState.js  

| Param | Type |
| --- | --- |
| symbol | <code>string</code> | 

>Synchronously returns a [Book](Book) object for a symbol. If no **MarketDepth**
subscription has been established for the symbol, an undefined value will be returned
(see [Enums.SubscriptionType](/content/sdk/lib-connection?id=enumssubscriptiontype)).


* * *

### marketState.getCumulativeVolume(symbol, [callback]) :id=marketstategetcumulativevolume
**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Returns**: [<code>Promise.&lt;CumulativeVolume&gt;</code>](#CumulativeVolume) - The [CumulativeVolume](/content/sdk/lib-marketstate?id=cumulativevolume) instance, as a promise  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/MarketState  
**File**: /lib/marketState/MarketState.js  

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> |  |
| [callback] | <code>function</code> | Invoked when the [CumulativeVolume](/content/sdk/lib-marketstate?id=cumulativevolume) instance becomes available |

>Returns a promise for the [CumulativeVolume](/content/sdk/lib-marketstate?id=cumulativevolume) volume instance matching the symbol
provided. The promise will not be fulfilled until a **CumulativeVolume** subscription
has been established (see [Enums.SubscriptionType](/content/sdk/lib-connection?id=enumssubscriptiontype)).


* * *

### marketState.getTimestamp() :id=marketstategettimestamp
**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Returns**: <code>Date</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/MarketState  
**File**: /lib/marketState/MarketState.js  
>Returns the time of the most recent server heartbeat.


* * *

## Profile :id=profile
**Kind**: global class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: /lib/marketState/Profile.js  
>Describes an instrument (associated with a unique symbol).


* [Profile](#Profile)
    * _instance_
        * [.symbol](#Profilesymbol)
        * [.name](#Profilename)
        * [.exchange](#Profileexchange)
        * [.exchangeRef](#ProfileexchangeRef)
        * [.unitCode](#ProfileunitCode)
        * [.pointValue](#ProfilepointValue)
        * [.tickIncrement](#ProfiletickIncrement)
        * [.root](#Profileroot)
        * [.month](#Profilemonth)
        * [.year](#Profileyear)
        * [.expiration](#Profileexpiration)
        * [.firstNotice](#ProfilefirstNotice)
        * [.formatPrice(price)](#ProfileformatPrice) ⇒ <code>string</code>
    * _static_
        * [.setPriceFormatter(fractionSeparator, specialFractions, [thousandsSeparator])](#ProfilesetPriceFormatter)


* * *

### profile.symbol :id=profilesymbol
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: /lib/marketState/Profile.js  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | Symbol of the instrument. |


* * *

### profile.name :id=profilename
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: /lib/marketState/Profile.js  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the instrument. |


* * *

### profile.exchange :id=profileexchange
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: /lib/marketState/Profile.js  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| exchange | <code>string</code> | Code for the listing exchange. |


* * *

### profile.exchangeRef :id=profileexchangeref
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: /lib/marketState/Profile.js  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| exchangeRef | [<code>Exchange</code>](#Exchange) \| <code>null</code> | The [Exchange](/content/sdk/lib-marketstate?id=exchange). |


* * *

### profile.unitCode :id=profileunitcode
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: /lib/marketState/Profile.js  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| unitCode | <code>string</code> | Code indicating how a prices should be formatted. |


* * *

### profile.pointValue :id=profilepointvalue
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: /lib/marketState/Profile.js  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| pointValue | <code>string</code> | The change in value for a one point change in price. |


* * *

### profile.tickIncrement :id=profiletickincrement
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: /lib/marketState/Profile.js  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tickIncrement | <code>number</code> | The minimum price movement. |


* * *

### profile.root :id=profileroot
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: /lib/marketState/Profile.js  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| root | <code>string</code> \| <code>undefined</code> | Root symbol (futures only). |


* * *

### profile.month :id=profilemonth
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: /lib/marketState/Profile.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| month | <code>string</code> \| <code>undefined</code> | Month code (futures only). |


* * *

### profile.year :id=profileyear
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: /lib/marketState/Profile.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| year | <code>number</code> \| <code>undefined</code> | Expiration year (futures only). |


* * *

### profile.expiration :id=profileexpiration
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: /lib/marketState/Profile.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| expiration | <code>string</code> \| <code>undefined</code> | Expiration date, formatted as YYYY-MM-DD (futures only). |


* * *

### profile.firstNotice :id=profilefirstnotice
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: /lib/marketState/Profile.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| expiration | <code>string</code> \| <code>undefined</code> | First notice date, formatted as YYYY-MM-DD (futures only). |


* * *

### profile.formatPrice(price) :id=profileformatprice
**Kind**: instance method of [<code>Profile</code>](#Profile)  
**Returns**: <code>string</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: /lib/marketState/Profile.js  

| Param | Type |
| --- | --- |
| price | <code>number</code> | 

>Given a price, returns a the human-readable string representation.


* * *

### Profile.setPriceFormatter(fractionSeparator, specialFractions, [thousandsSeparator]) :id=profilesetpriceformatter
**Kind**: static method of [<code>Profile</code>](#Profile)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: /lib/marketState/Profile.js  

| Param | Type | Description |
| --- | --- | --- |
| fractionSeparator | <code>string</code> | usually a dash or a period |
| specialFractions | <code>boolean</code> | usually true |
| [thousandsSeparator] | <code>string</code> | usually a comma |

>Configures the logic used to format all prices using the [formatPrice](#ProfileformatPrice) instance function.


* * *

## Quote :id=quote
**Kind**: global class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
>Current market conditions for an instrument, mutates as **MarketUpdate**
subscription updates are processed (see [Enums.SubscriptionType](/content/sdk/lib-connection?id=enumssubscriptiontype)).


* [Quote](#Quote)
    * [.symbol](#Quotesymbol)
    * [.message](#Quotemessage)
    * [.flag](#Quoteflag)
    * [.mode](#Quotemode) : <code>null</code>
    * [.day](#Quoteday)
    * [.dayNum](#QuotedayNum)
    * [.session](#Quotesession)
    * [.lastUpdate](#QuotelastUpdate)
    * [.lastUpdateUtc](#QuotelastUpdateUtc)
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
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | Symbol of the quoted instrument. |


* * *

### quote.message :id=quotemessage
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | Most recent DDF message to cause a this instance to mutate. |


* * *

### quote.flag :id=quoteflag
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| flag | <code>string</code> \| <code>undefined</code> | Market status, will have one of three values: "p", "s", or undefined. |


* * *

### quote.mode :id=quotemode
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Type | Description |
| --- | --- |
| <code>string</code> | One of two values, "I" or "R" -- indicating delayed or realtime data, respectively. |


* * *

### quote.day :id=quoteday
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| day | <code>string</code> | One character code indicating the day of the month of the current trading session. |


* * *

### quote.dayNum :id=quotedaynum
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| dayNum | <code>number</code> | Day of the month of the current trading session. |


* * *

### quote.session :id=quotesession
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type |
| --- | --- |
| session | <code>string</code> \| <code>null</code> | 


* * *

### quote.lastUpdate :id=quotelastupdate
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| lastUpdate | <code>Date</code> \| <code>null</code> | The most recent refresh date. Caution should be used. This date was created from hours, minutes, and seconds without regard for the current machine's timezone. As such, it is only safe to read time-related values (e.g. ```Date.getHours```, ```Date.getMinutes```, etc). Do not attempt to compare. Do not attempt to convert. |


* * *

### quote.lastUpdateUtc :id=quotelastupdateutc
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| lastUpdate | <code>Date</code> \| <code>null</code> | The most recent refresh date. |


* * *

### quote.bidPrice :id=quotebidprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| bidPrice | <code>number</code> | top-of-book price on the buy side. |


* * *

### quote.bidSize :id=quotebidsize
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| bidSize | <code>number</code> | top-of-book quantity on the buy side. |


* * *

### quote.askPrice :id=quoteaskprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| askPrice | <code>number</code> | top-of-book price on the sell side. |


* * *

### quote.askSize :id=quoteasksize
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| askSize | <code>number</code> | top-of-book quantity on the sell side. |


* * *

### quote.lastPrice :id=quotelastprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| lastPrice | <code>number</code> | most recent price (not necessarily a trade). |


* * *

### quote.tradePrice :id=quotetradeprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tradePrice | <code>number</code> | most recent trade price. |


* * *

### quote.tradeSize :id=quotetradesize
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tradeSize | <code>number</code> | most recent trade quantity. |


* * *

### quote.blockTrade :id=quoteblocktrade
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| blockTrade | <code>number</code> | Most recent block trade price. |


* * *

### quote.settlementPrice :id=quotesettlementprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type |
| --- | --- |
| settlementPrice | <code>number</code> | 


* * *

### quote.previousPrice :id=quotepreviousprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| previousPrice | <code>number</code> | price from the previous session. |


* * *

### quote.time :id=quotetime
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| time | <code>Date</code> \| <code>null</code> | the most recent trade, quote, or refresh. this date instance stores the hours and minutes for the exchange time (without proper timezone adjustment). use caution. |


* * *

### quote.profile :id=quoteprofile
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| profile | [<code>Profile</code>](#Profile) \| <code>null</code> | metadata regarding the quoted instrument. |


* * *

## Schema :id=schema
**Kind**: global namespace  
**Import**: @barchart/marketdata-api-js/lib/marketState/meta  
**File**: /lib/marketState/meta.js  
>A meta namespace containing structural contracts of anonymous objects.


* [Schema](#Schema) : <code>object</code>
    * [.Book](#SchemaBook) : <code>Object</code>
    * [.BookLevel](#SchemaBookLevel) : <code>Object</code>
    * [.VolumeLevel](#SchemaVolumeLevel) : <code>Object</code>


* * *

### Schema.Book :id=schemabook
**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Import**: @barchart/marketdata-api-js/lib/marketState/meta  
**File**: /lib/marketState/meta.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | The symbol. |
| bids | [<code>Array.&lt;BookLevel&gt;</code>](#SchemaBookLevel) | The price levels for buy orders. |
| asks | [<code>Array.&lt;BookLevel&gt;</code>](#SchemaBookLevel) | The price levels for sell orders. |

>This object represents an aggregated order book. In other words, the total size
of all orders (bid and ask) at every price. Constructed from **MarketDepth**
subscription (see [Enums.SubscriptionType](/content/sdk/lib-connection?id=enumssubscriptiontype)).


* * *

### Schema.BookLevel :id=schemabooklevel
**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Import**: @barchart/marketdata-api-js/lib/marketState/meta  
**File**: /lib/marketState/meta.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| price | <code>number</code> | The price level. |
| size | <code>number</code> | The quantity available at the price level. |

>The definition of one price level within the *bids* or *asks* array of a
[Book](#SchemaBook).


* * *

### Schema.VolumeLevel :id=schemavolumelevel
**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Import**: @barchart/marketdata-api-js/lib/marketState/meta  
**File**: /lib/marketState/meta.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| price | <code>number</code> | The price level. |
| size | <code>number</code> | The aggregate quantity traded. |

>The definition of one price level within a [CumulativeVolume](/content/sdk/lib-marketstate?id=cumulativevolume)
object.


* * *

