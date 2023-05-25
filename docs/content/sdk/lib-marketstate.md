## Contents {docsify-ignore}

* [CumulativeVolume](#CumulativeVolume) 

* [Exchange](#Exchange) 

* [MarketState](#MarketState) 

* [Profile](#Profile) 

* [Quote](#Quote) 

* [Schema](#Schema) 

* [Callbacks](#Callbacks) 


* * *

## CumulativeVolume :id=cumulativevolume
> An aggregation of the total volume traded at each price level for a
> single instrument, mutates as <strong>CumulativeVolume</strong> subscription updates
> are processed (see [Enums.SubscriptionType](/content/sdk/lib-connection?id=enumssubscriptiontype)).

**Kind**: global class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/CumulativeVolume  
**File**: /lib/marketState/CumulativeVolume.js  

* [CumulativeVolume](#CumulativeVolume)
    * _instance_
        * [.symbol](#CumulativeVolumesymbol)
        * [.getVolume(price)](#CumulativeVolumegetVolume) ⇒ <code>number</code>
        * [.toArray()](#CumulativeVolumetoArray) ⇒ [<code>Array.&lt;VolumeLevel&gt;</code>](#SchemaVolumeLevel)


* * *

### cumulativeVolume.symbol :id=cumulativevolumesymbol
**Kind**: instance property of [<code>CumulativeVolume</code>](#CumulativeVolume)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | <p>Symbol of the cumulative volume.</p> |


* * *

### cumulativeVolume.getVolume(price) :id=cumulativevolumegetvolume
> Given a numeric price, returns the volume traded at that price level.

**Kind**: instance method of [<code>CumulativeVolume</code>](#CumulativeVolume)  
**Returns**: <code>number</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| price | <code>number</code> | 


* * *

### cumulativeVolume.toArray() :id=cumulativevolumetoarray
> Returns an array of all price levels. This is an expensive operation. Observing
> an ongoing subscription is preferred (see [Connection#on](/content/sdk/lib-connection?id=connectionon)).

**Kind**: instance method of [<code>CumulativeVolume</code>](#CumulativeVolume)  
**Returns**: [<code>Array.&lt;VolumeLevel&gt;</code>](#SchemaVolumeLevel)  

* * *

## Exchange :id=exchange
> Describes an exchange.

**Kind**: global class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Exchange  
**File**: /lib/marketState/Exchange.js  

* [Exchange](#Exchange)
    * _instance_
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
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | <p>Barchart code for the exchange</p> |


* * *

### exchange.name :id=exchangename
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | <p>Name of the exchange</p> |


* * *

### exchange.timezoneDdf :id=exchangetimezoneddf
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| timezoneDdf | <code>string</code> \| <code>null</code> | <p>Implied timezone of DDF messages for this exchange (conforms to a TZ database name)</p> |


* * *

### exchange.offsetDdf :id=exchangeoffsetddf
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| offsetDdf | <code>number</code> \| <code>null</code> | <p>The offset, in milliseconds, between a DDF time and UTC.</p> |


* * *

### exchange.timezoneExchange :id=exchangetimezoneexchange
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| timezoneLocal | <code>string</code> | <p>Timezone exchange is physically located in (conforms to a TZ database name).</p> |


* * *

### exchange.offsetExchange :id=exchangeoffsetexchange
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| offsetExchange | <code>number</code> | <ul> <li>The offset, in milliseconds, between exchange time and UTC.</li> </ul> |


* * *

## MarketState :id=marketstate
> Repository for current market state. This repository will only contain
> data for an symbol after a subscription has been established using
> the [Connection#on](/content/sdk/lib-connection?id=connectionon) function.</p>
> <p>Access the singleton instance using the [Connection#getMarketState](/content/sdk/lib-connection?id=connectiongetmarketstate)
> function.

**Kind**: global class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/MarketState  
**File**: /lib/marketState/MarketState.js  

* [MarketState](#MarketState)
    * _instance_
        * [.getProfile(symbol, [callback])](#MarketStategetProfile) ⇒ <code>Promise.&lt;(Profile\|null)&gt;</code>
        * [.getQuote(symbol)](#MarketStategetQuote) ⇒ [<code>Quote</code>](#Quote) \| <code>undefined</code>
        * [.getBook(symbol)](#MarketStategetBook) ⇒ [<code>Book</code>](#SchemaBook) \| <code>undefined</code>
        * [.getCumulativeVolume(symbol, [callback])](#MarketStategetCumulativeVolume) ⇒ [<code>Promise.&lt;CumulativeVolume&gt;</code>](#CumulativeVolume)
        * [.getTimestamp()](#MarketStategetTimestamp) ⇒ <code>Date</code>


* * *

### marketState.getProfile(symbol, [callback]) :id=marketstategetprofile
> Returns a promise for the [Profile](/content/sdk/lib-marketstate?id=profile) instance matching the symbol provided.

**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Returns**: <code>Promise.&lt;(Profile\|null)&gt;</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> |  |
| [callback] | <code>function</code> | <p>Invoked when the [Profile](/content/sdk/lib-marketstate?id=profile) instance becomes available</p> |


* * *

### marketState.getQuote(symbol) :id=marketstategetquote
> Synchronously returns the [Quote](/content/sdk/lib-marketstate?id=quote) instance for a symbol. If no <strong>MarketUpdate</strong>
> subscription has been established for the symbol, an undefined value will be returned
> (see [Enums.SubscriptionType](/content/sdk/lib-connection?id=enumssubscriptiontype)).

**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Returns**: [<code>Quote</code>](#Quote) \| <code>undefined</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>string</code> | 


* * *

### marketState.getBook(symbol) :id=marketstategetbook
> Synchronously returns a [Book](#book) object for a symbol. If no <strong>MarketDepth</strong>
> subscription has been established for the symbol, an undefined value will be returned
> (see [Enums.SubscriptionType](/content/sdk/lib-connection?id=enumssubscriptiontype)).

**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Returns**: [<code>Book</code>](#SchemaBook) \| <code>undefined</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>string</code> | 


* * *

### marketState.getCumulativeVolume(symbol, [callback]) :id=marketstategetcumulativevolume
> Returns a promise for the [CumulativeVolume](/content/sdk/lib-marketstate?id=cumulativevolume) instance matching the symbol
> provided. The promise will not be fulfilled until a <strong>CumulativeVolume</strong> subscription
> has been established (see [Enums.SubscriptionType](/content/sdk/lib-connection?id=enumssubscriptiontype)).

**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Returns**: [<code>Promise.&lt;CumulativeVolume&gt;</code>](#CumulativeVolume) - <p>The [CumulativeVolume](/content/sdk/lib-marketstate?id=cumulativevolume) instance, as a promise</p>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> |  |
| [callback] | <code>function</code> | <p>Invoked when the [CumulativeVolume](/content/sdk/lib-marketstate?id=cumulativevolume) instance becomes available</p> |


* * *

### marketState.getTimestamp() :id=marketstategettimestamp
> Returns the time of the most recent server heartbeat.

**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Returns**: <code>Date</code>  
**Access**: public  

* * *

## Profile :id=profile
> Describes an instrument (associated with a unique symbol).

**Kind**: global class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Profile  
**File**: /lib/marketState/Profile.js  

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
        * [.asset](#Profileasset)
        * [.formatPrice(price)](#ProfileformatPrice) ⇒ <code>string</code>
    * _static_
        * [.setPriceFormatter(fractionSeparator, specialFractions, [thousandsSeparator])](#ProfilesetPriceFormatter)
        * [.setPriceFormatterCustom(fn)](#ProfilesetPriceFormatterCustom)


* * *

### profile.symbol :id=profilesymbol
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | <p>Symbol of the instrument.</p> |


* * *

### profile.name :id=profilename
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | <p>Name of the instrument.</p> |


* * *

### profile.exchange :id=profileexchange
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| exchange | <code>string</code> | <p>Code for the listing exchange.</p> |


* * *

### profile.exchangeRef :id=profileexchangeref
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| exchangeRef | [<code>Exchange</code>](#Exchange) \| <code>null</code> | <p>The [Exchange](/content/sdk/lib-marketstate?id=exchange).</p> |


* * *

### profile.unitCode :id=profileunitcode
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| unitCode | <code>string</code> | <p>Code indicating how a prices should be formatted.</p> |


* * *

### profile.pointValue :id=profilepointvalue
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| pointValue | <code>string</code> | <p>The change in value for a one point change in price.</p> |


* * *

### profile.tickIncrement :id=profiletickincrement
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tickIncrement | <code>number</code> | <p>The minimum price movement.</p> |


* * *

### profile.root :id=profileroot
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| root | <code>string</code> \| <code>undefined</code> | <p>Root symbol (futures and futures options only).</p> |


* * *

### profile.month :id=profilemonth
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| month | <code>string</code> \| <code>undefined</code> | <p>Month code (futures only).</p> |


* * *

### profile.year :id=profileyear
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| year | <code>number</code> \| <code>undefined</code> | <p>Expiration year (futures only).</p> |


* * *

### profile.expiration :id=profileexpiration
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| expiration | <code>string</code> \| <code>undefined</code> | <p>Expiration date, formatted as YYYY-MM-DD (futures only).</p> |


* * *

### profile.firstNotice :id=profilefirstnotice
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| firstNotice | <code>string</code> \| <code>undefined</code> | <p>First notice date, formatted as YYYY-MM-DD (futures only).</p> |


* * *

### profile.asset :id=profileasset
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| asset | [<code>AssetClass</code>](/content/sdk/lib-utilities-data?id=assetclass) \| <code>null</code> | <p>The instrument type. This will only be present when inference based on the instrument symbol is possible.</p> |


* * *

### profile.formatPrice(price) :id=profileformatprice
> Given a price, returns the human-readable representation.

**Kind**: instance method of [<code>Profile</code>](#Profile)  
**Returns**: <code>string</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| price | <code>number</code> | 


* * *

### Profile.setPriceFormatter(fractionSeparator, specialFractions, [thousandsSeparator]) :id=profilesetpriceformatter
> Configures the logic used to format all prices using the [formatPrice](#profileformatprice) instance function.
> Alternately, the [setPriceFormatterCustom](#profilesetpriceformattercustom) function can be used for complete control over
> price formatting.

**Kind**: static method of [<code>Profile</code>](#Profile)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| fractionSeparator | <code>string</code> | <p>usually a dash or a period</p> |
| specialFractions | <code>boolean</code> | <p>usually true</p> |
| [thousandsSeparator] | <code>string</code> | <p>usually a comma</p> |


* * *

### Profile.setPriceFormatterCustom(fn) :id=profilesetpriceformattercustom
> An alternative to [setPriceFormatter](#profilesetpriceformatter) which allows the consumer to specify
> a function to format prices. Use of this function overrides the rules set using the
> {link Profile.setPriceFormatter} function.

**Kind**: static method of [<code>Profile</code>](#Profile)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| fn | [<code>CustomPriceFormatterCallback</code>](#CallbacksCustomPriceFormatterCallback) | <p>The function to use for price formatting (which replaces the default logic).</p> |


* * *

## Quote :id=quote
> Current market conditions for an instrument, mutates as <strong>MarketUpdate</strong>
> subscription updates are processed (see [Enums.SubscriptionType](/content/sdk/lib-connection?id=enumssubscriptiontype)).

**Kind**: global class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/marketState/Quote  
**File**: /lib/marketState/Quote.js  

* [Quote](#Quote)
    * _instance_
        * [.symbol](#Quotesymbol)
        * [.profile](#Quoteprofile)
        * [.refresh](#Quoterefresh)
        * [.message](#Quotemessage)
        * [.flag](#Quoteflag)
        * [.mode](#Quotemode)
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
        * [.previousSettlementPrice](#QuotepreviousSettlementPrice)
        * [.openPrice](#QuoteopenPrice)
        * [.highPrice](#QuotehighPrice)
        * [.lowPrice](#QuotelowPrice)
        * [.recordHighPrice](#QuoterecordHighPrice)
        * [.recordLowPrice](#QuoterecordLowPrice)
        * [.volume](#Quotevolume)
        * [.openInterest](#QuoteopenInterest)
        * [.previousPrice](#QuotepreviousPrice)
        * [.time](#Quotetime)
        * [.timeUtc](#QuotetimeUtc)
        * [.priceChange](#QuotepriceChange)
        * [.priceChangePercent](#QuotepriceChangePercent)
        * [.previousPriceChange](#QuotepreviousPriceChange)
        * [.previousPriceChangePercent](#QuotepreviousPriceChangePercent)


* * *

### quote.symbol :id=quotesymbol
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | <p>Symbol of the quoted instrument.</p> |


* * *

### quote.profile :id=quoteprofile
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| profile | [<code>Profile</code>](#Profile) \| <code>null</code> | <p>Metadata regarding the quoted instrument.</p> |


* * *

### quote.refresh :id=quoterefresh
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| refresh | <code>string</code> | <p>Most recent DDF refresh message which caused this instance to mutate.</p> |


* * *

### quote.message :id=quotemessage
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | <p>Most recent DDF message which caused this instance to mutate.</p> |


* * *

### quote.flag :id=quoteflag
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| flag | <code>string</code> \| <code>undefined</code> | <p>Market status, will have one of three values: &quot;p&quot;, &quot;s&quot;, or undefined.</p> |


* * *

### quote.mode :id=quotemode
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| mode | <code>string</code> | <p>One of two values, &quot;I&quot; or &quot;R&quot; -- indicating delayed or realtime data, respectively.</p> |


* * *

### quote.day :id=quoteday
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| day | <code>string</code> | <p>One character code indicating the day of the month of the current trading session.</p> |


* * *

### quote.dayNum :id=quotedaynum
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| dayNum | <code>number</code> | <p>Day of the month of the current trading session.</p> |


* * *

### quote.session :id=quotesession
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type |
| --- | --- |
| session | <code>string</code> \| <code>null</code> | 


* * *

### quote.lastUpdate :id=quotelastupdate
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| lastUpdate | <code>Date</code> \| <code>null</code> | <p>The most recent refresh date. Caution should be used. This date was created from hours, minutes, and seconds without regard for the client computer's timezone. As such, it is only safe to read time-related values (e.g. <code>Date.getHours</code>, <code>Date.getMinutes</code>, etc). Do not attempt to compare. Do not attempt to convert.</p> |


* * *

### quote.lastUpdateUtc :id=quotelastupdateutc
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| lastUpdateUtc | <code>Date</code> \| <code>null</code> | <p>A timezone-aware version of [lastUpdate](#quotelastupdate). This property will only have a value when both (a) the exchange timezone is known; and (b) the client computer's timezone is known.</p> |


* * *

### quote.bidPrice :id=quotebidprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| bidPrice | <code>number</code> | <p>The top-of-book price on the buy side.</p> |


* * *

### quote.bidSize :id=quotebidsize
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| bidSize | <code>number</code> | <p>The top-of-book quantity on the buy side.</p> |


* * *

### quote.askPrice :id=quoteaskprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| askPrice | <code>number</code> | <p>The top-of-book price on the sell side.</p> |


* * *

### quote.askSize :id=quoteasksize
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| askSize | <code>number</code> | <p>The top-of-book quantity on the sell side.</p> |


* * *

### quote.lastPrice :id=quotelastprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| lastPrice | <code>number</code> | <p>Most recent price (not necessarily a trade).</p> |


* * *

### quote.tradePrice :id=quotetradeprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tradePrice | <code>number</code> | <p>Most recent trade price.</p> |


* * *

### quote.tradeSize :id=quotetradesize
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tradeSize | <code>number</code> | <p>Most recent trade quantity.</p> |


* * *

### quote.blockTrade :id=quoteblocktrade
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| blockTrade | <code>number</code> | <p>Most recent block trade price.</p> |


* * *

### quote.settlementPrice :id=quotesettlementprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| settlementPrice | <code>number</code> | <p>Settlement price for current trading session.</p> |


* * *

### quote.previousSettlementPrice :id=quoteprevioussettlementprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| previousSettlementPrice | <code>number</code> | <p>Settlement price from previous trading session.</p> |


* * *

### quote.openPrice :id=quoteopenprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| openPrice | <code>number</code> \| <code>null</code> | <p>The opening price for the current trading session.</p> |


* * *

### quote.highPrice :id=quotehighprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| highPrice | <code>number</code> \| <code>null</code> | <p>The highest trade price from the current trading session.</p> |


* * *

### quote.lowPrice :id=quotelowprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| lowPrice | <code>number</code> \| <code>null</code> | <p>The lowest trade price from the current trading session.</p> |


* * *

### quote.recordHighPrice :id=quoterecordhighprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| recordHighPrice | <code>number</code> \| <code>null</code> | <p>The all-time highest trade price from current or previous trading sessions.</p> |


* * *

### quote.recordLowPrice :id=quoterecordlowprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| recordLowPrice | <code>number</code> \| <code>null</code> | <p>The all-time lowest trade price from current or previous trading sessions.</p> |


* * *

### quote.volume :id=quotevolume
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| volume | <code>number</code> \| <code>null</code> | <p>The quantity traded during the current trading session.</p> |


* * *

### quote.openInterest :id=quoteopeninterest
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| openInterest | <code>number</code> \| <code>null</code> | <p>The outstanding number of active contracts. For some asset classes, this property is not relevant.</p> |


* * *

### quote.previousPrice :id=quotepreviousprice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| previousPrice | <code>number</code> | <p>The last price from the previous trading session.</p> |


* * *

### quote.time :id=quotetime
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| time | <code>Date</code> \| <code>null</code> | <p>The most recent trade, quote, or refresh time. Caution should be used. This date was created from hours, minutes, and seconds without regard for the client computer's timezone. As such, it is only safe to read time-related values (e.g. <code>Date.getHours</code>, <code>Date.getMinutes</code>, etc). Do not attempt to compare. Do not attempt to convert.</p> |


* * *

### quote.timeUtc :id=quotetimeutc
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| timeUtc | <code>Date</code> \| <code>null</code> | <p>A timezone-aware version of [time](#quotetime). This property will only have a value when both (a) the exchange timezone is known; and (b) the client computer's timezone is known.</p> |


* * *

### quote.priceChange :id=quotepricechange
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Type |
| --- |
| <code>Number</code> \| <code>null</code> | 


* * *

### quote.priceChangePercent :id=quotepricechangepercent
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Type |
| --- |
| <code>Number</code> \| <code>null</code> | 


* * *

### quote.previousPriceChange :id=quotepreviouspricechange
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Type |
| --- |
| <code>Number</code> \| <code>null</code> | 


* * *

### quote.previousPriceChangePercent :id=quotepreviouspricechangepercent
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Access**: public  
**Read only**: true  
**Properties**

| Type |
| --- |
| <code>Number</code> \| <code>null</code> | 


* * *

## Schema :id=schema
> A meta namespace containing structural contracts of anonymous objects.

**Kind**: global namespace  

* [Schema](#Schema) : <code>object</code>
    * _static_
        * [.Book](#SchemaBook) : <code>Object</code>
        * [.BookLevel](#SchemaBookLevel) : <code>Object</code>
        * [.VolumeLevel](#SchemaVolumeLevel) : <code>Object</code>


* * *

### Schema.Book :id=schemabook
> This object represents an aggregated order book. In other words, the total size
> of all orders (bid and ask) at every price. Constructed from <strong>MarketDepth</strong>
> subscription (see [Enums.SubscriptionType](/content/sdk/lib-connection?id=enumssubscriptiontype)).

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | <p>The symbol.</p> |
| bids | [<code>Array.&lt;BookLevel&gt;</code>](#SchemaBookLevel) | <p>The price levels for buy orders.</p> |
| asks | [<code>Array.&lt;BookLevel&gt;</code>](#SchemaBookLevel) | <p>The price levels for sell orders.</p> |


* * *

### Schema.BookLevel :id=schemabooklevel
> The definition of one price level within the <em>bids</em> or <em>asks</em> array of a
> [Book](#schemabook).

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| price | <code>number</code> | <p>The price level.</p> |
| size | <code>number</code> | <p>The quantity available at the price level.</p> |


* * *

### Schema.VolumeLevel :id=schemavolumelevel
> The definition of one price level within a [CumulativeVolume](/content/sdk/lib-marketstate?id=cumulativevolume)
> object.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| price | <code>number</code> | <p>The price level.</p> |
| size | <code>number</code> | <p>The aggregate quantity traded.</p> |


* * *

## Callbacks :id=callbacks
> A meta namespace containing signatures of anonymous functions.

**Kind**: global namespace  

* * *

### Callbacks.CustomPriceFormatterCallback :id=callbackscustompriceformattercallback
> The signature of a &quot;custom&quot; function used to format price values.

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Returns**: <code>String</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| value | <code>Number</code> | 
| unitCode | <code>String</code> | 
| profile | [<code>Profile</code>](#Profile) | 


* * *

