## Contents {docsify-ignore}

* [Connection](#Connection) 

* [Enums](#Enums) 

* [Callbacks](#Callbacks) 

* [Schema](#Schema) 


* * *

## Connection :id=connection
> The <strong>central component of the SDK</strong>. It is responsible for connecting to Barchart's
> servers, managing market data subscriptions, and maintaining market state. The
> SDK consumer should use one instance at a time.

**Kind**: global class  
**Extends**: <code>ConnectionBase</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/Connection  
**File**: /lib/connection/Connection.js  

* [Connection](#Connection) ⇐ <code>ConnectionBase</code>
    * _instance_
        * [.connect(hostname, username, password, [webSocketAdapterFactory])](#Connectionconnect)
        * [.disconnect()](#Connectiondisconnect)
        * [.on(subscriptionType, callback, [symbol])](#Connectionon)
        * [.off(subscriptionType, callback, [symbol])](#Connectionoff)
        * [.pause()](#Connectionpause)
        * [.resume()](#Connectionresume)
        * [.setPollingFrequency(pollingFrequency)](#ConnectionsetPollingFrequency)
        * [.getPollingFrequency()](#ConnectiongetPollingFrequency) ⇒ <code>number</code> \| <code>null</code>
        * [.setExtendedProfileMode(mode)](#ConnectionsetExtendedProfileMode)
        * [.getExtendedProfileMode()](#ConnectiongetExtendedProfileMode) ⇒ <code>Boolean</code>
        * [.setExtendedQuoteMode(mode)](#ConnectionsetExtendedQuoteMode)
        * [.getExtendedQuoteMode()](#ConnectiongetExtendedQuoteMode) ⇒ <code>Boolean</code>
        * [.getMarketState()](#ConnectiongetMarketState) ⇒ [<code>MarketState</code>](/content/sdk/lib-marketstate?id=marketstate)
        * [.getHostname()](#ConnectiongetHostname) ⇒ <code>null</code> \| <code>string</code>
        * [.getServer()](#ConnectiongetServer) ⇒ <code>null</code> \| <code>string</code>
        * [.getPassword()](#ConnectiongetPassword) ⇒ <code>null</code> \| <code>string</code>
        * [.getUsername()](#ConnectiongetUsername) ⇒ <code>null</code> \| <code>string</code>


* * *

### connection.connect(hostname, username, password, [webSocketAdapterFactory]) :id=connectionconnect
> Establishes WebSocket connection to Barchart's servers and authenticates. Success
> or failure is reported asynchronously by the <strong>Events</strong> subscription (see
> [SubscriptionType](#enumssubscriptiontype)). Connection attempts will continue until
> the disconnect function is called.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>connect</code>](#ConnectionBaseconnect)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| hostname | <code>string</code> | <p>Barchart hostname (contact solutions@barchart.com)</p> |
| username | <code>string</code> | <p>Your username (contact solutions@barchart.com)</p> |
| password | <code>string</code> | <p>Your password (contact solutions@barchart.com)</p> |
| [webSocketAdapterFactory] | [<code>WebSocketAdapterFactory</code>](/content/sdk/lib-connection-adapter?id=websocketadapterfactory) | <p>Strategy for creating a WebSocket (required for Node.js)</p> |


* * *

### connection.disconnect() :id=connectiondisconnect
> Forces a disconnect from the server. All subscriptions are discarded. Reconnection
> attempts will cease.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>disconnect</code>](#ConnectionBasedisconnect)  
**Access**: public  

* * *

### connection.on(subscriptionType, callback, [symbol]) :id=connectionon
> Initiates a subscription, registering a callback for event notifications.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>on</code>](#ConnectionBaseon)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionType | [<code>SubscriptionType</code>](#EnumsSubscriptionType) | <p>The type of subscription</p> |
| callback | [<code>MarketDepthCallback</code>](#CallbacksMarketDepthCallback) \| [<code>MarketUpdateCallback</code>](#CallbacksMarketUpdateCallback) \| [<code>CumulativeVolumeCallback</code>](#CallbacksCumulativeVolumeCallback) \| [<code>TimestampCallback</code>](#CallbacksTimestampCallback) \| [<code>EventsCallback</code>](#CallbacksEventsCallback) | <p>A function which will be invoked each time the event occurs</p> |
| [symbol] | <code>String</code> | <p>A symbol (only applicable for market data subscriptions)</p> |


* * *

### connection.off(subscriptionType, callback, [symbol]) :id=connectionoff
> Drops a subscription (see [on](#connectionbaseon)).

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>off</code>](#ConnectionBaseoff)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionType | [<code>SubscriptionType</code>](#EnumsSubscriptionType) | <p>The type of subscription</p> |
| callback | [<code>MarketDepthCallback</code>](#CallbacksMarketDepthCallback) \| [<code>MarketUpdateCallback</code>](#CallbacksMarketUpdateCallback) \| [<code>CumulativeVolumeCallback</code>](#CallbacksCumulativeVolumeCallback) \| [<code>TimestampCallback</code>](#CallbacksTimestampCallback) \| [<code>EventsCallback</code>](#CallbacksEventsCallback) | <p>The <strong>same</strong> function which was passed to [on](#connectionbaseon)</p> |
| [symbol] | <code>String</code> | <p>The symbol (only applicable for market data subscriptions)</p> |


* * *

### connection.pause() :id=connectionpause
> Pauses the data flow over the network. All subscriptions are maintained;
> however, callbacks will cease to be invoked.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>pause</code>](#ConnectionBasepause)  
**Access**: public  

* * *

### connection.resume() :id=connectionresume
> Restarts the flow of data over the network. Subscription callbacks will once
> again be invoked.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>resume</code>](#ConnectionBaseresume)  
**Access**: public  

* * *

### connection.setPollingFrequency(pollingFrequency) :id=connectionsetpollingfrequency
> By default, the server pushes data to the SDK. However, to save network
> bandwidth, the SDK can operate in a polling mode -- only updating
> periodically. Calling this function with a positive number will
> cause the SDK to begin polling. Calling this function with a null
> value will cause to SDK to resume normal operation.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>setPollingFrequency</code>](#ConnectionBasesetPollingFrequency)  
**Access**: public  

| Param | Type |
| --- | --- |
| pollingFrequency | <code>number</code> \| <code>null</code> | 


* * *

### connection.getPollingFrequency() :id=connectiongetpollingfrequency
> By default, the server pushes data to the SDK. However, to save network
> bandwidth, the SDK can operate in a polling mode -- only updating
> periodically. If the SDK is configured for polling, the frequency, in
> milliseconds will be returned. If the SDK is configured for normal operation,
> a null value will be returned.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getPollingFrequency</code>](#ConnectionBasegetPollingFrequency)  
**Returns**: <code>number</code> \| <code>null</code>  
**Access**: public  

* * *

### connection.setExtendedProfileMode(mode) :id=connectionsetextendedprofilemode
> When set to true, additional properties become available on [Profile](/content/sdk/lib-marketstate?id=profile)
> instances (e.g. the &quot;first notice dates&quot; for futures contracts). This is accomplished
> by making additional out-of-band queries to web Barchart services.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>setExtendedProfileMode</code>](#ConnectionBasesetExtendedProfileMode)  
**Access**: public  

| Param | Type |
| --- | --- |
| mode | <code>Boolean</code> | 


* * *

### connection.getExtendedProfileMode() :id=connectiongetextendedprofilemode
> Indicates if additional [Profile](/content/sdk/lib-marketstate?id=profile) data (e.g. the &quot;first notice dates&quot; for
> futures contracts) should be loaded (via out-of-band queries).

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getExtendedProfileMode</code>](#ConnectionBasegetExtendedProfileMode)  
**Returns**: <code>Boolean</code>  
**Access**: public  

* * *

### connection.setExtendedQuoteMode(mode) :id=connectionsetextendedquotemode
> When set to true, additional properties become available on [Quote](/content/sdk/lib-marketstate?id=quote) instances
> (e.g. &quot;record high price&quot; for futures contracts). This is accomplished by making
> additional out-of-band queries to Barchart web services.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>setExtendedQuoteMode</code>](#ConnectionBasesetExtendedQuoteMode)  
**Access**: public  

| Param | Type |
| --- | --- |
| mode | <code>Boolean</code> | 


* * *

### connection.getExtendedQuoteMode() :id=connectiongetextendedquotemode
> Indicates if additional [Quote](/content/sdk/lib-marketstate?id=quote) data (e.g. &quot;record high price&quot; for futures
> contracts) should be loaded (via out-of-band queries).

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getExtendedQuoteMode</code>](#ConnectionBasegetExtendedQuoteMode)  
**Returns**: <code>Boolean</code>  
**Access**: public  

* * *

### connection.getMarketState() :id=connectiongetmarketstate
> Returns the [MarketState](/content/sdk/lib-marketstate?id=marketstate) singleton -- which can be used to access
> [Quote](/content/sdk/lib-marketstate?id=quote), [Profile](/content/sdk/lib-marketstate?id=profile), and [CumulativeVolume](/content/sdk/lib-marketstate?id=cumulativevolume) instances
> for any symbol subscribed symbol.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getMarketState</code>](#ConnectionBasegetMarketState)  
**Returns**: [<code>MarketState</code>](/content/sdk/lib-marketstate?id=marketstate)  
**Access**: public  

* * *

### connection.getHostname() :id=connectiongethostname
> The Barchart hostname.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getHostname</code>](#ConnectionBasegetHostname)  
**Returns**: <code>null</code> \| <code>string</code>  
**Access**: public  

* * *

### connection.getServer() :id=connectiongetserver
> The Barchart hostname.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getServer</code>](#ConnectionBasegetServer)  
**Returns**: <code>null</code> \| <code>string</code>  
**Access**: public  

* * *

### connection.getPassword() :id=connectiongetpassword
> The password used to authenticate to Barchart.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getPassword</code>](#ConnectionBasegetPassword)  
**Returns**: <code>null</code> \| <code>string</code>  
**Access**: public  

* * *

### connection.getUsername() :id=connectiongetusername
> The username used to authenticate to Barchart.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getUsername</code>](#ConnectionBasegetUsername)  
**Returns**: <code>null</code> \| <code>string</code>  
**Access**: public  

* * *

## Enums :id=enums
> A namespace for enumerations.

**Kind**: global namespace  

* [Enums](#Enums) : <code>object</code>
    * _static_
        * [.ConnectionEventType](#EnumsConnectionEventType) : <code>enum</code>
        * [.SubscriptionType](#EnumsSubscriptionType) : <code>enum</code>


* * *

### Enums.ConnectionEventType :id=enumsconnectioneventtype
> An enumeration of events which can occur during the life of a [Connection](/content/sdk/lib-connection?id=connection).

**Kind**: static enum of [<code>Enums</code>](#Enums)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/ConnectionEventType  
**File**: /lib/connection/ConnectionEventType.js  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| LoginSuccess | <code>string</code> | <code>&quot;login success&quot;</code> | <p>Remote server accepted your credentials</p> |
| LoginFail | <code>string</code> | <code>&quot;login fail&quot;</code> | <p>Remote server rejected your credentials</p> |
| Disconnecting | <code>string</code> | <code>&quot;disconnecting&quot;</code> | <p>Generated after [disconnect](#connectiondisconnect) is called</p> |
| Disconnect | <code>string</code> | <code>&quot;disconnect&quot;</code> | <p>Connection to remote server lost</p> |
| FeedPaused | <code>string</code> | <code>&quot;feed paused&quot;</code> | <p>Generated after [pause](#connectionpause) is called</p> |
| FeedResumed | <code>string</code> | <code>&quot;feed resumed&quot;</code> | <p>Generated after [resume](#connectionresume) is called</p> |


* * *

### Enums.SubscriptionType :id=enumssubscriptiontype
> An enumeration of subscriptions supported by a [Connection](/content/sdk/lib-connection?id=connection).

**Kind**: static enum of [<code>Enums</code>](#Enums)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/SubscriptionType  
**File**: /lib/connection/SubscriptionType.js  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| Events | <code>string</code> | <code>&quot;events&quot;</code> | <p>A subscription to connection status</p> |
| Timestamp | <code>string</code> | <code>&quot;timestamp&quot;</code> | <p>A subscription to the remote server's heartbeat</p> |
| MarketUpdate | <code>string</code> | <code>&quot;marketUpdate&quot;</code> | <p>A Level I market data subscription</p> |
| MarketDepth | <code>string</code> | <code>&quot;marketDepth&quot;</code> | <p>A Level II market data subscription</p> |
| CumulativeVolume | <code>string</code> | <code>&quot;cumulativeVolume&quot;</code> | <p>A subscription for aggregate volume</p> |


* * *

## Callbacks :id=callbacks
> A meta namespace containing signatures of anonymous functions.

**Kind**: global namespace  

* [Callbacks](#Callbacks) : <code>object</code>
    * _static_
        * [.EventsCallback](#CallbacksEventsCallback) : <code>function</code>
        * [.TimestampCallback](#CallbacksTimestampCallback) : <code>function</code>
        * [.MarketUpdateCallback](#CallbacksMarketUpdateCallback) : <code>function</code>
        * [.MarketDepthCallback](#CallbacksMarketDepthCallback) : <code>function</code>
        * [.CumulativeVolumeCallback](#CallbacksCumulativeVolumeCallback) : <code>function</code>


* * *

### Callbacks.EventsCallback :id=callbackseventscallback
> The signature of a function which accepts events generated by an
> <strong>Events</strong> subscription (see [SubscriptionType](#enumssubscriptiontype)).

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| event | [<code>EventsEvent</code>](#SchemaEventsEvent) | 


* * *

### Callbacks.TimestampCallback :id=callbackstimestampcallback
> The signature of a function which accepts events generated by a
> <strong>Timestamp</strong> subscription (see [SubscriptionType](#enumssubscriptiontype)).

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| event | <code>Date</code> | 


* * *

### Callbacks.MarketUpdateCallback :id=callbacksmarketupdatecallback
> The signature of a function which accepts events generated by a
> <strong>MarketUpdate</strong> subscription (see [SubscriptionType](#enumssubscriptiontype)).

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| event | [<code>MarketUpdateEvent</code>](#SchemaMarketUpdateEvent) | 


* * *

### Callbacks.MarketDepthCallback :id=callbacksmarketdepthcallback
> The signature of a function which accepts events generated by a
> <strong>MarketDepth</strong> subscription (see [SubscriptionType](#enumssubscriptiontype)).

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| event | [<code>MarketDepthEvent</code>](#SchemaMarketDepthEvent) | 


* * *

### Callbacks.CumulativeVolumeCallback :id=callbackscumulativevolumecallback
> The signature of a function which accepts events generated by a
> <strong>CumulativeVolume</strong> subscription (see [SubscriptionType](#enumssubscriptiontype)).

**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| event | [<code>CumulativeVolumeEvent</code>](#SchemaCumulativeVolumeEvent) | 


* * *

## Schema :id=schema
> A meta namespace containing structural contracts of anonymous objects.

**Kind**: global namespace  

* [Schema](#Schema) : <code>object</code>
    * _static_
        * [.EventsEvent](#SchemaEventsEvent) : <code>Object</code>
        * [.MarketUpdateEvent](#SchemaMarketUpdateEvent) : <code>Object</code>
        * [.MarketDepthEvent](#SchemaMarketDepthEvent) : <code>Object</code>
        * [.MarketDepthLevel](#SchemaMarketDepthLevel) : <code>Object</code>
        * [.CumulativeVolumeEvent](#SchemaCumulativeVolumeEvent) : <code>Object</code>


* * *

### Schema.EventsEvent :id=schemaeventsevent
> The object passed to a [EventsCallback](#callbackseventscallback).

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | [<code>ConnectionEventType</code>](#EnumsConnectionEventType) | <p>The event type.</p> |


* * *

### Schema.MarketUpdateEvent :id=schemamarketupdateevent
> The object passed to a [MarketUpdateCallback](#callbacksmarketupdatecallback). This object
> represents a change to the [Quote](/content/sdk/lib-marketstate?id=quote) state. It could be a trade, a
> change to the top of book, etc.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | <p>The symbol.</p> |
| type | <code>string</code> | <p>The message type (e.g. 'TRADE')</p> |


* * *

### Schema.MarketDepthEvent :id=schemamarketdepthevent
> The object passed to a [MarketDepthCallback](#callbacksmarketdepthcallback). This object represents
> an aggregated order book. In other words, the total size of all orders (bid and ask) at
> every price.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | <p>The symbol.</p> |
| bids | [<code>Array.&lt;MarketDepthLevel&gt;</code>](#SchemaMarketDepthLevel) | <p>The price levels for buy orders.</p> |
| asks | [<code>Array.&lt;MarketDepthLevel&gt;</code>](#SchemaMarketDepthLevel) | <p>The price levels for sell orders.</p> |


* * *

### Schema.MarketDepthLevel :id=schemamarketdepthlevel
> The definition of one price level within the <em>bids</em> or <em>asks</em> array of a
> [MarketDepthEvent](#schemamarketdepthevent).

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| price | <code>number</code> | <p>The price level.</p> |
| size | <code>number</code> | <p>The quantity available at the price level.</p> |


* * *

### Schema.CumulativeVolumeEvent :id=schemacumulativevolumeevent
> The object passed to a [CumulativeVolumeCallback](#callbackscumulativevolumecallback).

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | <p>Either &quot;update&quot; or &quot;reset&quot;.</p> |
| container | [<code>CumulativeVolume</code>](/content/sdk/lib-marketstate?id=cumulativevolume) | <p>Complete cumulative volume state.</p> |
| [price] | <code>number</code> | <p>The price level (for &quot;update&quot; events only).</p> |
| [volume] | <code>number</code> | <p>The  new aggregate volume (for &quot;update&quot; events only).</p> |


* * *

