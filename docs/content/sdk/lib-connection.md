## Contents {docsify-ignore}

* [Connection](#Connection) 

* [Enums](#Enums) 

* [Callbacks](#Callbacks) 

* [Schema](#Schema) 

## Connection :id=connection
**Kind**: global class  
**Extends**: <code>ConnectionBase</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/Connection  
**File**: /lib/connection/Connection.js  
>This class is the **central component of the SDK**. It is responsible for connecting to
Barchart's servers, maintaining market data subscriptions, and maintaining market
state. The SDK consumer should use one instance at a time.


* [Connection](#Connection) ⇐ <code>ConnectionBase</code>
    * [.connect(server, username, password, [webSocketAdapterFactory])](#ConnectionBaseconnect)
    * [.disconnect()](#ConnectionBasedisconnect)
    * [.on(subscriptionType, callback, [symbol])](#ConnectionBaseon)
    * [.off(subscriptionType, callback, [symbol])](#ConnectionBaseoff)
    * [.pause()](#ConnectionBasepause)
    * [.resume()](#ConnectionBaseresume)
    * [.setPollingFrequency(pollingFrequency)](#ConnectionBasesetPollingFrequency)
    * [.getPollingFrequency()](#ConnectionBasegetPollingFrequency) ⇒ <code>number</code> \| <code>null</code>
    * [.setExtendedProfileMode(mode)](#ConnectionBasesetExtendedProfileMode)
    * [.getExtendedProfileMode()](#ConnectionBasegetExtendedProfileMode) ⇒ <code>boolean</code>
    * [.getMarketState()](#ConnectionBasegetMarketState) ⇒ <code>MarketState</code>
    * [.getServer()](#ConnectionBasegetServer) ⇒ <code>null</code> \| <code>string</code>
    * [.getPassword()](#ConnectionBasegetPassword) ⇒ <code>null</code> \| <code>string</code>
    * [.getUsername()](#ConnectionBasegetUsername) ⇒ <code>null</code> \| <code>string</code>


* * *

### connection.connect(server, username, password, [webSocketAdapterFactory]) :id=connectionconnect
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>connect</code>](#ConnectionBaseconnect)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/ConnectionBase  
**File**: /lib/connection/ConnectionBase.js  

| Param | Type | Description |
| --- | --- | --- |
| server | <code>string</code> | Barchart hostname (contact solutions@barchart.com) |
| username | <code>string</code> | Your username (contact solutions@barchart.com) |
| password | <code>string</code> | Your password (contact solutions@barchart.com) |
| [webSocketAdapterFactory] | <code>WebSocketAdapterFactory</code> | Strategy for creating a WebSocket (required for Node.js) |

>Establishes WebSocket connection to Barchart's servers and authenticates. Success
or failure is reported asynchronously by the **Events** subscription (see
[SubscriptionType](#EnumsSubscriptionType)).


* * *

### connection.disconnect() :id=connectiondisconnect
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>disconnect</code>](#ConnectionBasedisconnect)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/ConnectionBase  
**File**: /lib/connection/ConnectionBase.js  
>Forces a disconnect from the server. All subscriptions are discarded.


* * *

### connection.on(subscriptionType, callback, [symbol]) :id=connectionon
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>on</code>](#ConnectionBaseon)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/ConnectionBase  
**File**: /lib/connection/ConnectionBase.js  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionType | [<code>SubscriptionType</code>](#EnumsSubscriptionType) | The type of subscription |
| callback | [<code>MarketDepthCallback</code>](#CallbacksMarketDepthCallback) \| [<code>MarketUpdateCallback</code>](#CallbacksMarketUpdateCallback) \| [<code>CumulativeVolumeCallback</code>](#CallbacksCumulativeVolumeCallback) \| [<code>TimestampCallback</code>](#CallbacksTimestampCallback) \| [<code>EventsCallback</code>](#CallbacksEventsCallback) | A function which will be invoked each time the event occurs |
| [symbol] | <code>String</code> | A symbol (only applicable for market data subscriptions) |

>Initiates a subscription, registering a callback for event notifications.


* * *

### connection.off(subscriptionType, callback, [symbol]) :id=connectionoff
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>off</code>](#ConnectionBaseoff)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/ConnectionBase  
**File**: /lib/connection/ConnectionBase.js  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionType | [<code>SubscriptionType</code>](#EnumsSubscriptionType) | The type of subscription |
| callback | [<code>MarketDepthCallback</code>](#CallbacksMarketDepthCallback) \| [<code>MarketUpdateCallback</code>](#CallbacksMarketUpdateCallback) \| [<code>CumulativeVolumeCallback</code>](#CallbacksCumulativeVolumeCallback) \| [<code>TimestampCallback</code>](#CallbacksTimestampCallback) \| [<code>EventsCallback</code>](#CallbacksEventsCallback) | The **same** function which was passed to [on](#ConnectionBaseon) |
| [symbol] | <code>String</code> | The symbol (only applicable for market data subscriptions) |

>Drops a subscription (see [on](#ConnectionBaseon)).


* * *

### connection.pause() :id=connectionpause
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>pause</code>](#ConnectionBasepause)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/ConnectionBase  
**File**: /lib/connection/ConnectionBase.js  
>Pauses the data flow over the network. All subscriptions are maintained;
however, callbacks will cease to be invoked.


* * *

### connection.resume() :id=connectionresume
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>resume</code>](#ConnectionBaseresume)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/ConnectionBase  
**File**: /lib/connection/ConnectionBase.js  
>Restarts the flow of data over the network. Subscription callbacks will once
again be invoked.


* * *

### connection.setPollingFrequency(pollingFrequency) :id=connectionsetpollingfrequency
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>setPollingFrequency</code>](#ConnectionBasesetPollingFrequency)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/ConnectionBase  
**File**: /lib/connection/ConnectionBase.js  

| Param | Type |
| --- | --- |
| pollingFrequency | <code>number</code> \| <code>null</code> | 

>By default, the server pushes data to the SDK. However, to save network
bandwidth, the SDK can operate in a polling mode -- only updating
periodically. Calling this function with a positive number will
cause the SDK to begin polling. Calling this function with a null
value will cause to SDK to resume normal operation.


* * *

### connection.getPollingFrequency() :id=connectiongetpollingfrequency
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getPollingFrequency</code>](#ConnectionBasegetPollingFrequency)  
**Returns**: <code>number</code> \| <code>null</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/ConnectionBase  
**File**: /lib/connection/ConnectionBase.js  
>By default, the server pushes data to the SDK. However, to save network
bandwidth, the SDK can operate in a polling mode -- only updating
periodically. If the SDK is configured for polling, the frequency, in
milliseconds will be returned. If the SDK is configured for normal operation,
a null value will be returned.


* * *

### connection.setExtendedProfileMode(mode) :id=connectionsetextendedprofilemode
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>setExtendedProfileMode</code>](#ConnectionBasesetExtendedProfileMode)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/ConnectionBase  
**File**: /lib/connection/ConnectionBase.js  

| Param | Type |
| --- | --- |
| mode | <code>Boolean</code> | 

>When set to true, additional properties properties become
available on [Profile](/content/sdk/lib-marketstate?id=profile) instances (e.g. future contract
expiration date). This is accomplished by making additional
out-of-band queries to Barchart services.


* * *

### connection.getExtendedProfileMode() :id=connectiongetextendedprofilemode
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getExtendedProfileMode</code>](#ConnectionBasegetExtendedProfileMode)  
**Returns**: <code>boolean</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/ConnectionBase  
**File**: /lib/connection/ConnectionBase.js  
>Indicates if additional [Profile](/content/sdk/lib-marketstate?id=profile) data (e.g. future contract
expiration dates) should be loaded (via out-of-band queries).


* * *

### connection.getMarketState() :id=connectiongetmarketstate
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getMarketState</code>](#ConnectionBasegetMarketState)  
**Returns**: <code>MarketState</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/ConnectionBase  
**File**: /lib/connection/ConnectionBase.js  
>Returns the [MarketState](/content/sdk/lib-marketstate?id=marketstate) singleton -- which can be used to access
[Quote](/content/sdk/lib-marketstate?id=quote), [Profile](/content/sdk/lib-marketstate?id=profile), and [CumulativeVolume](/content/sdk/lib-marketstate?id=cumulativevolume) instances
for any symbol subscribed symbol.


* * *

### connection.getServer() :id=connectiongetserver
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getServer</code>](#ConnectionBasegetServer)  
**Returns**: <code>null</code> \| <code>string</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/ConnectionBase  
**File**: /lib/connection/ConnectionBase.js  
>The Barchart hostname.


* * *

### connection.getPassword() :id=connectiongetpassword
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getPassword</code>](#ConnectionBasegetPassword)  
**Returns**: <code>null</code> \| <code>string</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/ConnectionBase  
**File**: /lib/connection/ConnectionBase.js  
>The password used to authenticate to Barchart.


* * *

### connection.getUsername() :id=connectiongetusername
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getUsername</code>](#ConnectionBasegetUsername)  
**Returns**: <code>null</code> \| <code>string</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/ConnectionBase  
**File**: /lib/connection/ConnectionBase.js  
>The username used to authenticate to Barchart.


* * *

## Enums :id=enums
**Kind**: global namespace  
**Import**: @barchart/marketdata-api-js/lib/connection/meta  
**File**: /lib/connection/meta.js  
>A namespace for enumerations.


* [Enums](#Enums) : <code>object</code>
    * [.ConnectionEventType](#EnumsConnectionEventType) : <code>enum</code>
    * [.SubscriptionType](#EnumsSubscriptionType) : <code>enum</code>


* * *

### Enums.ConnectionEventType :id=enumsconnectioneventtype
**Kind**: static enum of [<code>Enums</code>](#Enums)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/ConnectionEventType  
**File**: /lib/connection/ConnectionEventType.js  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| LoginSuccess | <code>string</code> | <code>&quot;login success&quot;</code> | Remote server accepted your credentials |
| LoginFail | <code>string</code> | <code>&quot;login fail&quot;</code> | Remote server rejected your credentials |
| Disconnecting | <code>string</code> | <code>&quot;disconnecting&quot;</code> | Generated after [disconnect](#ConnectionBasedisconnect) is called |
| Disconnect | <code>string</code> | <code>&quot;disconnect&quot;</code> | Connection to remote server lost |
| FeedPaused | <code>string</code> | <code>&quot;feed paused&quot;</code> | Generated after [pause](#ConnectionBasepause) is called |
| FeedResumed | <code>string</code> | <code>&quot;feed resumed&quot;</code> | Generated after [resume](#ConnectionBaseresume) is called |

>An enumeration of events which can occur during the life of a [Connection](/content/sdk/lib-connection?id=connection).


* * *

### Enums.SubscriptionType :id=enumssubscriptiontype
**Kind**: static enum of [<code>Enums</code>](#Enums)  
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

>An enumeration of subscriptions supported by a [Connection](/content/sdk/lib-connection?id=connection).


* * *

## Callbacks :id=callbacks
**Kind**: global namespace  
**Import**: @barchart/marketdata-api-js/lib/connection/meta  
**File**: /lib/connection/meta.js  
>A meta namespace containing signatures of anonymous functions.


* [Callbacks](#Callbacks) : <code>object</code>
    * [.EventsCallback](#CallbacksEventsCallback) : <code>function</code>
    * [.TimestampCallback](#CallbacksTimestampCallback) : <code>function</code>
    * [.MarketUpdateCallback](#CallbacksMarketUpdateCallback) : <code>function</code>
    * [.MarketDepthCallback](#CallbacksMarketDepthCallback) : <code>function</code>
    * [.CumulativeVolumeCallback](#CallbacksCumulativeVolumeCallback) : <code>function</code>


* * *

### Callbacks.EventsCallback :id=callbackseventscallback
**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/meta  
**File**: /lib/connection/meta.js  

| Param | Type |
| --- | --- |
| event | [<code>EventsEvent</code>](#SchemaEventsEvent) | 

>The signature of a function which accepts events generated by an
**Events** subscription (see [SubscriptionType](#EnumsSubscriptionType)).


* * *

### Callbacks.TimestampCallback :id=callbackstimestampcallback
**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/meta  
**File**: /lib/connection/meta.js  

| Param | Type |
| --- | --- |
| event | <code>Date</code> | 

>The signature of a function which accepts events generated by a
**Timestamp** subscription (see [SubscriptionType](#EnumsSubscriptionType)).


* * *

### Callbacks.MarketUpdateCallback :id=callbacksmarketupdatecallback
**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/meta  
**File**: /lib/connection/meta.js  

| Param | Type |
| --- | --- |
| event | [<code>MarketUpdateEvent</code>](#SchemaMarketUpdateEvent) | 

>The signature of a function which accepts events generated by a
**MarketUpdate** subscription (see [SubscriptionType](#EnumsSubscriptionType)).


* * *

### Callbacks.MarketDepthCallback :id=callbacksmarketdepthcallback
**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/meta  
**File**: /lib/connection/meta.js  

| Param | Type |
| --- | --- |
| event | [<code>MarketDepthEvent</code>](#SchemaMarketDepthEvent) | 

>The signature of a function which accepts events generated by a
**MarketDepth** subscription (see [SubscriptionType](#EnumsSubscriptionType)).


* * *

### Callbacks.CumulativeVolumeCallback :id=callbackscumulativevolumecallback
**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/meta  
**File**: /lib/connection/meta.js  

| Param | Type |
| --- | --- |
| event | [<code>CumulativeVolumeEvent</code>](#SchemaCumulativeVolumeEvent) | 

>The signature of a function which accepts events generated by a
**CumulativeVolume** subscription (see [SubscriptionType](#EnumsSubscriptionType)).


* * *

## Schema :id=schema
**Kind**: global namespace  
**Import**: @barchart/marketdata-api-js/lib/connection/meta  
**File**: /lib/connection/meta.js  
>A meta namespace containing structural contracts of anonymous objects.


* [Schema](#Schema) : <code>object</code>
    * [.EventsEvent](#SchemaEventsEvent) : <code>Object</code>
    * [.MarketUpdateEvent](#SchemaMarketUpdateEvent) : <code>Object</code>
    * [.MarketDepthEvent](#SchemaMarketDepthEvent) : <code>Object</code>
    * [.MarketDepthLevel](#SchemaMarketDepthLevel) : <code>Object</code>
    * [.CumulativeVolumeEvent](#SchemaCumulativeVolumeEvent) : <code>Object</code>


* * *

### Schema.EventsEvent :id=schemaeventsevent
**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Import**: @barchart/marketdata-api-js/lib/connection/meta  
**File**: /lib/connection/meta.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | [<code>ConnectionEventType</code>](#EnumsConnectionEventType) | The event type. |

>The object passed to a [EventsCallback](#CallbacksEventsCallback).


* * *

### Schema.MarketUpdateEvent :id=schemamarketupdateevent
**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Import**: @barchart/marketdata-api-js/lib/connection/meta  
**File**: /lib/connection/meta.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | The symbol. |
| type | <code>string</code> | The message type (e.g. 'TRADE') |

>The object passed to a [MarketUpdateCallback](#CallbacksMarketUpdateCallback). This object
represents a change to the [Quote](/content/sdk/lib-marketstate?id=quote) state. It could be a trade, a
change to the top of book, etc.


* * *

### Schema.MarketDepthEvent :id=schemamarketdepthevent
**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Import**: @barchart/marketdata-api-js/lib/connection/meta  
**File**: /lib/connection/meta.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | The symbol. |
| bids | [<code>Array.&lt;MarketDepthLevel&gt;</code>](#SchemaMarketDepthLevel) | The price levels for buy orders. |
| asks | [<code>Array.&lt;MarketDepthLevel&gt;</code>](#SchemaMarketDepthLevel) | The price levels for sell orders. |

>The object passed to a [MarketDepthCallback](#CallbacksMarketDepthCallback). This object represents
an aggregated order book. In other words, the total size of all orders (bid and ask) at
every price.


* * *

### Schema.MarketDepthLevel :id=schemamarketdepthlevel
**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Import**: @barchart/marketdata-api-js/lib/connection/meta  
**File**: /lib/connection/meta.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| price | <code>number</code> | The price level. |
| size | <code>number</code> | The quantity available at the price level. |

>The definition of one price level within the *bids* or *asks* array of a
[MarketDepthEvent](#SchemaMarketDepthEvent).


* * *

### Schema.CumulativeVolumeEvent :id=schemacumulativevolumeevent
**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Import**: @barchart/marketdata-api-js/lib/connection/meta  
**File**: /lib/connection/meta.js  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Either "update" or "reset". |
| container | <code>CumulativeVolume</code> | Complete cumulative volume state. |
| [price] | <code>number</code> | The price level (for "update" events only). |
| [volume] | <code>number</code> | The  new aggregate volume (for "update" events only). |

>The object passed to a [CumulativeVolumeCallback](#CallbacksCumulativeVolumeCallback).


* * *

