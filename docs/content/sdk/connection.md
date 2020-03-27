## Contents {docsify-ignore}

* [Connection](#Connection) 

* [Enums](#Enums) 

* [Callbacks](#Callbacks) 

## Connection :id=connection
**Kind**: global class  
**Extends**: <code>ConnectionBase</code>  
**Access**: public  
 **Import**: @barchart/marketdata-api-js/lib/connection/Connection  
>This class is the central component of the SDK. It is responsible for connecting to
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
>Forces a disconnect from the server. All subscriptions are discarded.


* * *

### connection.on(subscriptionType, callback, [symbol]) :id=connectionon
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>on</code>](#ConnectionBaseon)  
**Access**: public  

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
>Pauses the data flow over the network. All subscriptions are maintained;
however, callbacks will cease to be invoked.


* * *

### connection.resume() :id=connectionresume
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>resume</code>](#ConnectionBaseresume)  
**Access**: public  
>Restarts the flow of data over the network. Subscription callbacks will once
again be invoked.


* * *

### connection.setPollingFrequency(pollingFrequency) :id=connectionsetpollingfrequency
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>setPollingFrequency</code>](#ConnectionBasesetPollingFrequency)  
**Access**: public  

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

| Param | Type |
| --- | --- |
| mode | <code>Boolean</code> | 

>When set to true, additional properties properties become
available on [Profile](/content/sdk/marketstate?id=profile) instances (e.g. future contract
expiration date). This is accomplished by making additional
out-of-band queries to Barchart services.


* * *

### connection.getExtendedProfileMode() :id=connectiongetextendedprofilemode
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getExtendedProfileMode</code>](#ConnectionBasegetExtendedProfileMode)  
**Returns**: <code>boolean</code>  
**Access**: public  
>Indicates if additional [Profile](/content/sdk/marketstate?id=profile) data (e.g. future contract
expiration dates) should be loaded (via out-of-band queries).


* * *

### connection.getMarketState() :id=connectiongetmarketstate
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getMarketState</code>](#ConnectionBasegetMarketState)  
**Returns**: <code>MarketState</code>  
**Access**: public  
>Returns the [MarketState](/content/sdk/marketstate?id=marketstate) singleton -- which can be used to access
[Quote](/content/sdk/marketstate?id=quote), [Profile](/content/sdk/marketstate?id=profile), and [CumulativeVolume](/content/sdk/marketstate?id=cumulativevolume) instances
for any symbol subscribed symbol.


* * *

### connection.getServer() :id=connectiongetserver
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getServer</code>](#ConnectionBasegetServer)  
**Returns**: <code>null</code> \| <code>string</code>  
**Access**: public  
>The Barchart hostname.


* * *

### connection.getPassword() :id=connectiongetpassword
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getPassword</code>](#ConnectionBasegetPassword)  
**Returns**: <code>null</code> \| <code>string</code>  
**Access**: public  
>The password used to authenticate to Barchart.


* * *

### connection.getUsername() :id=connectiongetusername
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getUsername</code>](#ConnectionBasegetUsername)  
**Returns**: <code>null</code> \| <code>string</code>  
**Access**: public  
>The username used to authenticate to Barchart.


* * *

## Enums :id=enums
**Kind**: global namespace  
>A namespace for enumerations.


* [Enums](#Enums) : <code>object</code>
    * [.ConnectionEventType](#EnumsConnectionEventType) : <code>enum</code>
    * [.SubscriptionType](#EnumsSubscriptionType) : <code>enum</code>


* * *

### Enums.ConnectionEventType :id=enumsconnectioneventtype
**Kind**: static enum of [<code>Enums</code>](#Enums)  
**Access**: public  
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

>An enumeration of events which can occur during the life of a [Connection](/content/sdk/connection?id=connection).


* * *

### Enums.SubscriptionType :id=enumssubscriptiontype
**Kind**: static enum of [<code>Enums</code>](#Enums)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| Events | <code>string</code> | <code>&quot;events&quot;</code> | A subscription to connection status |
| MarketDepth | <code>string</code> | <code>&quot;marketDepth&quot;</code> | A Level II market data subscription |
| MarketUpdate | <code>string</code> | <code>&quot;marketUpdate&quot;</code> | A Level I market data subscription |
| CumulativeVolume | <code>string</code> | <code>&quot;cumulativeVolume&quot;</code> | A subscription for aggregate volume |
| Timestamp | <code>string</code> | <code>&quot;timestamp&quot;</code> | A subscription to the remote server's heartbeat |

>An enumeration of subscriptions supported by a [Connection](/content/sdk/connection?id=connection).


* * *

## Callbacks :id=callbacks
**Kind**: global namespace  
>A meta namespace for signatures of anonymous functions.


* [Callbacks](#Callbacks) : <code>object</code>
    * [.MarketDepthCallback](#CallbacksMarketDepthCallback) : <code>function</code>
    * [.MarketUpdateCallback](#CallbacksMarketUpdateCallback) : <code>function</code>
    * [.CumulativeVolumeCallback](#CallbacksCumulativeVolumeCallback) : <code>function</code>
    * [.TimestampCallback](#CallbacksTimestampCallback) : <code>function</code>
    * [.EventsCallback](#CallbacksEventsCallback) : <code>function</code>


* * *

### Callbacks.MarketDepthCallback :id=callbacksmarketdepthcallback
**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| book | <code>Schema.Book</code> | 

>The signature of a function which accepts events generated by a
**MarketDepth** subscription (see [SubscriptionType](#EnumsSubscriptionType)).


* * *

### Callbacks.MarketUpdateCallback :id=callbacksmarketupdatecallback
**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| data | <code>Object</code> | 

>The signature of a function which accepts events generated by a
**MarketUpdate** subscription (see [SubscriptionType](#EnumsSubscriptionType)).


* * *

### Callbacks.CumulativeVolumeCallback :id=callbackscumulativevolumecallback
**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| data | <code>Object</code> | 

>The signature of a function which accepts events generated by a
**CumulativeVolume** subscription (see [SubscriptionType](#EnumsSubscriptionType)).


* * *

### Callbacks.TimestampCallback :id=callbackstimestampcallback
**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 

>The signature of a function which accepts events generated by a
**Timestamp** subscription (see [SubscriptionType](#EnumsSubscriptionType)).


* * *

### Callbacks.EventsCallback :id=callbackseventscallback
**Kind**: static typedef of [<code>Callbacks</code>](#Callbacks)  
**Access**: public  

| Param | Type |
| --- | --- |
| data | [<code>ConnectionEventType</code>](#EnumsConnectionEventType) | 

>The signature of a function which accepts events generated by an
**Events** subscription (see [SubscriptionType](#EnumsSubscriptionType)).


* * *

