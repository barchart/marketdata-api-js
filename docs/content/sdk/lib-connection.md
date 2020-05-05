## Contents {docsify-ignore}

* [Connection](#Connection) 

* [Enums](#Enums) 

* [Callbacks](#Callbacks) 

* [Schema](#Schema) 


* * *

## Connection :id=connection
>The **central component of the SDK**. It is responsible for connecting to Barchart's
servers, managing market data subscriptions, and maintaining market state. The
SDK consumer should use one instance at a time.

**Kind**: global class  
**Extends**: <code>ConnectionBase</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/Connection  
**File**: /lib/connection/Connection.js  

* [Connection](#Connection) ⇐ <code>ConnectionBase</code>
    * _instance_
        * [.connect(server, username, password, [webSocketAdapterFactory])](#Connectionconnect)
        * [.disconnect()](#Connectiondisconnect)
        * [.on(subscriptionType, callback, [symbol])](#Connectionon)
        * [.off(subscriptionType, callback, [symbol])](#Connectionoff)
        * [.pause()](#Connectionpause)
        * [.resume()](#Connectionresume)
        * [.setPollingFrequency(pollingFrequency)](#ConnectionsetPollingFrequency)
        * [.getPollingFrequency()](#ConnectiongetPollingFrequency) ⇒ <code>number</code> \| <code>null</code>
        * [.setExtendedProfileMode(mode)](#ConnectionsetExtendedProfileMode)
        * [.getExtendedProfileMode()](#ConnectiongetExtendedProfileMode) ⇒ <code>boolean</code>
        * [.getMarketState()](#ConnectiongetMarketState) ⇒ <code>MarketState</code>
        * [.getServer()](#ConnectiongetServer) ⇒ <code>null</code> \| <code>string</code>
        * [.getPassword()](#ConnectiongetPassword) ⇒ <code>null</code> \| <code>string</code>
        * [.getUsername()](#ConnectiongetUsername) ⇒ <code>null</code> \| <code>string</code>


* * *

### connection.connect(server, username, password, [webSocketAdapterFactory]) :id=connectionconnect
>Establishes WebSocket connection to Barchart's servers and authenticates. Success
or failure is reported asynchronously by the **Events** subscription (see
[SubscriptionType](#EnumsSubscriptionType)).

**Kind**: instance method of <code>Connection</code>  
**Overrides**: <code>ConnectionBase#connect</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| server | <code>string</code> | Barchart hostname (contact solutions@barchart.com) |
| username | <code>string</code> | Your username (contact solutions@barchart.com) |
| password | <code>string</code> | Your password (contact solutions@barchart.com) |
| [webSocketAdapterFactory] | <code>WebSocketAdapterFactory</code> | Strategy for creating a WebSocket (required for Node.js) |


* * *

### connection.disconnect() :id=connectiondisconnect
>Forces a disconnect from the server. All subscriptions are discarded.

**Kind**: instance method of <code>Connection</code>  
**Overrides**: <code>ConnectionBase#disconnect</code>  
**Access**: public  

* * *

### connection.on(subscriptionType, callback, [symbol]) :id=connectionon
>Initiates a subscription, registering a callback for event notifications.

**Kind**: instance method of <code>Connection</code>  
**Overrides**: <code>ConnectionBase#on</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionType | [<code>SubscriptionType</code>](#EnumsSubscriptionType) | The type of subscription |
| callback | [<code>MarketDepthCallback</code>](#CallbacksMarketDepthCallback) \| [<code>MarketUpdateCallback</code>](#CallbacksMarketUpdateCallback) \| [<code>CumulativeVolumeCallback</code>](#CallbacksCumulativeVolumeCallback) \| [<code>TimestampCallback</code>](#CallbacksTimestampCallback) \| [<code>EventsCallback</code>](#CallbacksEventsCallback) | A function which will be invoked each time the event occurs |
| [symbol] | <code>String</code> | A symbol (only applicable for market data subscriptions) |


* * *

### connection.off(subscriptionType, callback, [symbol]) :id=connectionoff
>Drops a subscription (see [ConnectionBase#on](/content/sdk/lib-connection?id=connectionbaseon)).

**Kind**: instance method of <code>Connection</code>  
**Overrides**: <code>ConnectionBase#off</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionType | [<code>SubscriptionType</code>](#EnumsSubscriptionType) | The type of subscription |
| callback | [<code>MarketDepthCallback</code>](#CallbacksMarketDepthCallback) \| [<code>MarketUpdateCallback</code>](#CallbacksMarketUpdateCallback) \| [<code>CumulativeVolumeCallback</code>](#CallbacksCumulativeVolumeCallback) \| [<code>TimestampCallback</code>](#CallbacksTimestampCallback) \| [<code>EventsCallback</code>](#CallbacksEventsCallback) | The **same** function which was passed to [ConnectionBase#on](/content/sdk/lib-connection?id=connectionbaseon) |
| [symbol] | <code>String</code> | The symbol (only applicable for market data subscriptions) |


* * *

### connection.pause() :id=connectionpause
>Pauses the data flow over the network. All subscriptions are maintained;
however, callbacks will cease to be invoked.

**Kind**: instance method of <code>Connection</code>  
**Overrides**: <code>ConnectionBase#pause</code>  
**Access**: public  

* * *

### connection.resume() :id=connectionresume
>Restarts the flow of data over the network. Subscription callbacks will once
again be invoked.

**Kind**: instance method of <code>Connection</code>  
**Overrides**: <code>ConnectionBase#resume</code>  
**Access**: public  

* * *

### connection.setPollingFrequency(pollingFrequency) :id=connectionsetpollingfrequency
>By default, the server pushes data to the SDK. However, to save network
bandwidth, the SDK can operate in a polling mode -- only updating
periodically. Calling this function with a positive number will
cause the SDK to begin polling. Calling this function with a null
value will cause to SDK to resume normal operation.

**Kind**: instance method of <code>Connection</code>  
**Overrides**: <code>ConnectionBase#setPollingFrequency</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| pollingFrequency | <code>number</code> \| <code>null</code> | 


* * *

### connection.getPollingFrequency() :id=connectiongetpollingfrequency
>By default, the server pushes data to the SDK. However, to save network
bandwidth, the SDK can operate in a polling mode -- only updating
periodically. If the SDK is configured for polling, the frequency, in
milliseconds will be returned. If the SDK is configured for normal operation,
a null value will be returned.

**Kind**: instance method of <code>Connection</code>  
**Overrides**: <code>ConnectionBase#getPollingFrequency</code>  
**Returns**: <code>number</code> \| <code>null</code>  
**Access**: public  

* * *

### connection.setExtendedProfileMode(mode) :id=connectionsetextendedprofilemode
>When set to true, additional properties properties become
available on [Profile](/content/sdk/lib-marketstate?id=profile) instances (e.g. future contract
expiration date). This is accomplished by making additional
out-of-band queries to Barchart services.

**Kind**: instance method of <code>Connection</code>  
**Overrides**: <code>ConnectionBase#setExtendedProfileMode</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| mode | <code>Boolean</code> | 


* * *

### connection.getExtendedProfileMode() :id=connectiongetextendedprofilemode
>Indicates if additional [Profile](/content/sdk/lib-marketstate?id=profile) data (e.g. future contract
expiration dates) should be loaded (via out-of-band queries).

**Kind**: instance method of <code>Connection</code>  
**Overrides**: <code>ConnectionBase#getExtendedProfileMode</code>  
**Returns**: <code>boolean</code>  
**Access**: public  

* * *

### connection.getMarketState() :id=connectiongetmarketstate
>Returns the [MarketState](/content/sdk/lib-marketstate?id=marketstate) singleton -- which can be used to access
[Quote](/content/sdk/lib-marketstate?id=quote), [Profile](/content/sdk/lib-marketstate?id=profile), and [CumulativeVolume](/content/sdk/lib-marketstate?id=cumulativevolume) instances
for any symbol subscribed symbol.

**Kind**: instance method of <code>Connection</code>  
**Overrides**: <code>ConnectionBase#getMarketState</code>  
**Returns**: <code>MarketState</code>  
**Access**: public  

* * *

### connection.getServer() :id=connectiongetserver
>The Barchart hostname.

**Kind**: instance method of <code>Connection</code>  
**Overrides**: <code>ConnectionBase#getServer</code>  
**Returns**: <code>null</code> \| <code>string</code>  
**Access**: public  

* * *

### connection.getPassword() :id=connectiongetpassword
>The password used to authenticate to Barchart.

**Kind**: instance method of <code>Connection</code>  
**Overrides**: <code>ConnectionBase#getPassword</code>  
**Returns**: <code>null</code> \| <code>string</code>  
**Access**: public  

* * *

### connection.getUsername() :id=connectiongetusername
>The username used to authenticate to Barchart.

**Kind**: instance method of <code>Connection</code>  
**Overrides**: <code>ConnectionBase#getUsername</code>  
**Returns**: <code>null</code> \| <code>string</code>  
**Access**: public  

* * *

## Enums :id=enums
>A namespace for enumerations.

**Kind**: global namespace  

* [Enums](#Enums) : <code>object</code>
    * _static_
        * [.ConnectionEventType](#EnumsConnectionEventType) : <code>enum</code>
        * [.SubscriptionType](#EnumsSubscriptionType) : <code>enum</code>


* * *

### Enums.ConnectionEventType :id=enumsconnectioneventtype
>An enumeration of events which can occur during the life of a [Connection](/content/sdk/lib-connection?id=connection).

**Kind**: static enum of <code>Enums</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/ConnectionEventType  
**File**: /lib/connection/ConnectionEventType.js  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| LoginSuccess | <code>string</code> | <code>&quot;login success&quot;</code> | Remote server accepted your credentials |
| LoginFail | <code>string</code> | <code>&quot;login fail&quot;</code> | Remote server rejected your credentials |
| Disconnecting | <code>string</code> | <code>&quot;disconnecting&quot;</code> | Generated after [disconnect](#Connectiondisconnect) is called |
| Disconnect | <code>string</code> | <code>&quot;disconnect&quot;</code> | Connection to remote server lost |
| FeedPaused | <code>string</code> | <code>&quot;feed paused&quot;</code> | Generated after [pause](#Connectionpause) is called |
| FeedResumed | <code>string</code> | <code>&quot;feed resumed&quot;</code> | Generated after [resume](#Connectionresume) is called |


* * *

### Enums.SubscriptionType :id=enumssubscriptiontype
>An enumeration of subscriptions supported by a [Connection](/content/sdk/lib-connection?id=connection).

**Kind**: static enum of <code>Enums</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/SubscriptionType  
**File**: /lib/connection/SubscriptionType.js  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| Events | <code>string</code> | <code>&quot;events&quot;</code> | A subscription to connection status |
| Timestamp | <code>string</code> | <code>&quot;timestamp&quot;</code> | A subscription to the remote server's heartbeat |
| MarketUpdate | <code>string</code> | <code>&quot;marketUpdate&quot;</code> | A Level I market data subscription |
| MarketDepth | <code>string</code> | <code>&quot;marketDepth&quot;</code> | A Level II market data subscription |
| CumulativeVolume | <code>string</code> | <code>&quot;cumulativeVolume&quot;</code> | A subscription for aggregate volume |


* * *

## Callbacks :id=callbacks
>A meta namespace containing signatures of anonymous functions.

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
>The signature of a function which accepts events generated by an
**Events** subscription (see [SubscriptionType](#EnumsSubscriptionType)).

**Kind**: static typedef of <code>Callbacks</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| event | [<code>EventsEvent</code>](#SchemaEventsEvent) | 


* * *

### Callbacks.TimestampCallback :id=callbackstimestampcallback
>The signature of a function which accepts events generated by a
**Timestamp** subscription (see [SubscriptionType](#EnumsSubscriptionType)).

**Kind**: static typedef of <code>Callbacks</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| event | <code>Date</code> | 


* * *

### Callbacks.MarketUpdateCallback :id=callbacksmarketupdatecallback
>The signature of a function which accepts events generated by a
**MarketUpdate** subscription (see [SubscriptionType](#EnumsSubscriptionType)).

**Kind**: static typedef of <code>Callbacks</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| event | [<code>MarketUpdateEvent</code>](#SchemaMarketUpdateEvent) | 


* * *

### Callbacks.MarketDepthCallback :id=callbacksmarketdepthcallback
>The signature of a function which accepts events generated by a
**MarketDepth** subscription (see [SubscriptionType](#EnumsSubscriptionType)).

**Kind**: static typedef of <code>Callbacks</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| event | [<code>MarketDepthEvent</code>](#SchemaMarketDepthEvent) | 


* * *

### Callbacks.CumulativeVolumeCallback :id=callbackscumulativevolumecallback
>The signature of a function which accepts events generated by a
**CumulativeVolume** subscription (see [SubscriptionType](#EnumsSubscriptionType)).

**Kind**: static typedef of <code>Callbacks</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| event | [<code>CumulativeVolumeEvent</code>](#SchemaCumulativeVolumeEvent) | 


* * *

## Schema :id=schema
>A meta namespace containing structural contracts of anonymous objects.

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
>The object passed to a [EventsCallback](#CallbacksEventsCallback).

**Kind**: static typedef of <code>Schema</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | [<code>ConnectionEventType</code>](#EnumsConnectionEventType) | The event type. |


* * *

### Schema.MarketUpdateEvent :id=schemamarketupdateevent
>The object passed to a [MarketUpdateCallback](#CallbacksMarketUpdateCallback). This object
represents a change to the [Quote](/content/sdk/lib-marketstate?id=quote) state. It could be a trade, a
change to the top of book, etc.

**Kind**: static typedef of <code>Schema</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | The symbol. |
| type | <code>string</code> | The message type (e.g. 'TRADE') |


* * *

### Schema.MarketDepthEvent :id=schemamarketdepthevent
>The object passed to a [MarketDepthCallback](#CallbacksMarketDepthCallback). This object represents
an aggregated order book. In other words, the total size of all orders (bid and ask) at
every price.

**Kind**: static typedef of <code>Schema</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | The symbol. |
| bids | [<code>Array.&lt;MarketDepthLevel&gt;</code>](#SchemaMarketDepthLevel) | The price levels for buy orders. |
| asks | [<code>Array.&lt;MarketDepthLevel&gt;</code>](#SchemaMarketDepthLevel) | The price levels for sell orders. |


* * *

### Schema.MarketDepthLevel :id=schemamarketdepthlevel
>The definition of one price level within the *bids* or *asks* array of a
[MarketDepthEvent](#SchemaMarketDepthEvent).

**Kind**: static typedef of <code>Schema</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| price | <code>number</code> | The price level. |
| size | <code>number</code> | The quantity available at the price level. |


* * *

### Schema.CumulativeVolumeEvent :id=schemacumulativevolumeevent
>The object passed to a [CumulativeVolumeCallback](#CallbacksCumulativeVolumeCallback).

**Kind**: static typedef of <code>Schema</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Either "update" or "reset". |
| container | <code>CumulativeVolume</code> | Complete cumulative volume state. |
| [price] | <code>number</code> | The price level (for "update" events only). |
| [volume] | <code>number</code> | The  new aggregate volume (for "update" events only). |


* * *

