## Contents {docsify-ignore}

* [Connection](#Connection) 

* [ConnectionBase](#ConnectionBase) 

* [Enums](#Enums) 

## Connection :id=connection
**Kind**: global class  
**Extends**: [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  
 **Import**: @barchart/marketdata-api-js/lib/connection/Connection  
>Object used to connect to Barchart servers and subscribe to market data.


* [Connection](#Connection) ⇐ [<code>ConnectionBase</code>](#ConnectionBase)
    * [.connect(server, username, password, [webSocketAdapterFactory])](#ConnectionBaseconnect)
    * [.disconnect()](#ConnectionBasedisconnect)
    * [.pause()](#ConnectionBasepause)
    * [.resume()](#ConnectionBaseresume)
    * [.on(subscriptionType, callback, [symbol])](#ConnectionBaseon)
    * [.off(subscriptionType, callback, [symbol])](#ConnectionBaseoff)
    * [.getPollingFrequency()](#ConnectionBasegetPollingFrequency) ⇒ <code>number</code> \| <code>null</code>
    * [.setPollingFrequency(pollingFrequency)](#ConnectionBasesetPollingFrequency)
    * [.getExtendedProfileMode()](#ConnectionBasegetExtendedProfileMode) ⇒ <code>boolean</code>
    * [.getMarketState()](#ConnectionBasegetMarketState) ⇒ <code>MarketState</code>
    * [.getServer()](#ConnectionBasegetServer) ⇒ <code>null</code> \| <code>string</code>
    * [.getPassword()](#ConnectionBasegetPassword) ⇒ <code>null</code> \| <code>string</code>
    * [.getUsername()](#ConnectionBasegetUsername) ⇒ <code>null</code> \| <code>string</code>
    * [._getInstance()](#ConnectionBase_getInstance) ⇒ <code>Number</code>


* * *

### connection.connect(server, username, password, [webSocketAdapterFactory]) :id=connectionconnect
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>connect</code>](#ConnectionBaseconnect)  
**Access**: public  

| Param | Type |
| --- | --- |
| server | <code>string</code> | 
| username | <code>string</code> | 
| password | <code>string</code> | 
| [webSocketAdapterFactory] | <code>WebSocketAdapterFactory</code> | 

>Connects to the given server with username and password.


* * *

### connection.disconnect() :id=connectiondisconnect
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>disconnect</code>](#ConnectionBasedisconnect)  
**Access**: public  
>Forces a disconnect from the server.


* * *

### connection.pause() :id=connectionpause
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>pause</code>](#ConnectionBasepause)  
**Access**: public  
>Causes the market state to stop updating. All subscriptions are maintained.


* * *

### connection.resume() :id=connectionresume
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>resume</code>](#ConnectionBaseresume)  
**Access**: public  
>Causes the market state to begin updating again (after [pause](#ConnectionBasepause) has been called).


* * *

### connection.on(subscriptionType, callback, [symbol]) :id=connectionon
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>on</code>](#ConnectionBaseon)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionType | [<code>SubscriptionType</code>](#EnumsSubscriptionType) |  |
| callback | <code>function</code> | notified each time the event occurs |
| [symbol] | <code>String</code> | A symbol, if applicable, to the given [SubscriptionType](#EnumsSubscriptionType) |

>Initiates a subscription to an [SubscriptionType](#EnumsSubscriptionType) and
registers the callback for notifications.


* * *

### connection.off(subscriptionType, callback, [symbol]) :id=connectionoff
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>off</code>](#ConnectionBaseoff)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionType | [<code>SubscriptionType</code>](#EnumsSubscriptionType) | the [SubscriptionType](#EnumsSubscriptionType) which was passed to [on](#ConnectionBaseon) |
| callback | <code>function</code> | the callback which was passed to [on](#ConnectionBaseon) |
| [symbol] | <code>String</code> | A symbol, if applicable, to the given [SubscriptionType](#EnumsSubscriptionType) |

>Stops notification of the callback for the [SubscriptionType](#EnumsSubscriptionType).
See [on](#ConnectionBaseon).


* * *

### connection.getPollingFrequency() :id=connectiongetpollingfrequency
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getPollingFrequency</code>](#ConnectionBasegetPollingFrequency)  
**Returns**: <code>number</code> \| <code>null</code>  
**Access**: public  
>The frequency, in milliseconds, used to poll for changes to [Quote](/content/sdk/marketstate?id=quote)
objects. A null value indicates streaming updates (default).


* * *

### connection.setPollingFrequency(pollingFrequency) :id=connectionsetpollingfrequency
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>setPollingFrequency</code>](#ConnectionBasesetPollingFrequency)  
**Access**: public  

| Param | Type |
| --- | --- |
| pollingFrequency | <code>number</code> \| <code>null</code> | 

>Sets the polling frequency, in milliseconds. A null value indicates
streaming market updates (where polling is not used).


* * *

### connection.getExtendedProfileMode() :id=connectiongetextendedprofilemode
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getExtendedProfileMode</code>](#ConnectionBasegetExtendedProfileMode)  
**Returns**: <code>boolean</code>  
**Access**: public  
>Indicates if additional profile data (e.g. future contract expiration dates
should be loaded when subscribing to to market data).


* * *

### connection.getMarketState() :id=connectiongetmarketstate
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getMarketState</code>](#ConnectionBasegetMarketState)  
**Returns**: <code>MarketState</code>  
>Returns the [MarketState](/content/sdk/marketstate?id=marketstate) singleton, used to access [Quote](/content/sdk/marketstate?id=quote), 
[Profile](/content/sdk/marketstate?id=profile), and [CumulativeVolume](/content/sdk/marketstate?id=cumulativevolume) objects.


* * *

### connection.getServer() :id=connectiongetserver
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getServer</code>](#ConnectionBasegetServer)  
**Returns**: <code>null</code> \| <code>string</code>  
**Access**: public  

* * *

### connection.getPassword() :id=connectiongetpassword
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getPassword</code>](#ConnectionBasegetPassword)  
**Returns**: <code>null</code> \| <code>string</code>  
**Access**: public  

* * *

### connection.getUsername() :id=connectiongetusername
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getUsername</code>](#ConnectionBasegetUsername)  
**Returns**: <code>null</code> \| <code>string</code>  
**Access**: public  

* * *

### connection.\_getInstance() :id=connection_getinstance
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>\_getInstance</code>](#ConnectionBase_getInstance)  
**Returns**: <code>Number</code>  
**Access**: protected  
>Get an unique identifier for the current instance.


* * *

## ConnectionBase :id=connectionbase
**Kind**: global class  
**Access**: protected  
 **Import**: @barchart/marketdata-api-js/lib/connection/ConnectionBase  
>Contract for communicating with remove market data servers and
querying current market state.


* [ConnectionBase](#ConnectionBase)
    * [.connect(server, username, password, [webSocketAdapterFactory])](#ConnectionBaseconnect)
    * [.disconnect()](#ConnectionBasedisconnect)
    * [.pause()](#ConnectionBasepause)
    * [.resume()](#ConnectionBaseresume)
    * [.on(subscriptionType, callback, [symbol])](#ConnectionBaseon)
    * [.off(subscriptionType, callback, [symbol])](#ConnectionBaseoff)
    * [.getPollingFrequency()](#ConnectionBasegetPollingFrequency) ⇒ <code>number</code> \| <code>null</code>
    * [.setPollingFrequency(pollingFrequency)](#ConnectionBasesetPollingFrequency)
    * [.getExtendedProfileMode()](#ConnectionBasegetExtendedProfileMode) ⇒ <code>boolean</code>
    * [.getMarketState()](#ConnectionBasegetMarketState) ⇒ <code>MarketState</code>
    * [.getServer()](#ConnectionBasegetServer) ⇒ <code>null</code> \| <code>string</code>
    * [.getPassword()](#ConnectionBasegetPassword) ⇒ <code>null</code> \| <code>string</code>
    * [.getUsername()](#ConnectionBasegetUsername) ⇒ <code>null</code> \| <code>string</code>
    * [._getInstance()](#ConnectionBase_getInstance) ⇒ <code>Number</code>


* * *

### connectionBase.connect(server, username, password, [webSocketAdapterFactory]) :id=connectionbaseconnect
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

| Param | Type |
| --- | --- |
| server | <code>string</code> | 
| username | <code>string</code> | 
| password | <code>string</code> | 
| [webSocketAdapterFactory] | <code>WebSocketAdapterFactory</code> | 

>Connects to the given server with username and password.


* * *

### connectionBase.disconnect() :id=connectionbasedisconnect
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  
>Forces a disconnect from the server.


* * *

### connectionBase.pause() :id=connectionbasepause
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  
>Causes the market state to stop updating. All subscriptions are maintained.


* * *

### connectionBase.resume() :id=connectionbaseresume
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  
>Causes the market state to begin updating again (after [pause](#ConnectionBasepause) has been called).


* * *

### connectionBase.on(subscriptionType, callback, [symbol]) :id=connectionbaseon
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionType | [<code>SubscriptionType</code>](#EnumsSubscriptionType) |  |
| callback | <code>function</code> | notified each time the event occurs |
| [symbol] | <code>String</code> | A symbol, if applicable, to the given [SubscriptionType](#EnumsSubscriptionType) |

>Initiates a subscription to an [SubscriptionType](#EnumsSubscriptionType) and
registers the callback for notifications.


* * *

### connectionBase.off(subscriptionType, callback, [symbol]) :id=connectionbaseoff
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionType | [<code>SubscriptionType</code>](#EnumsSubscriptionType) | the [SubscriptionType](#EnumsSubscriptionType) which was passed to [on](#ConnectionBaseon) |
| callback | <code>function</code> | the callback which was passed to [on](#ConnectionBaseon) |
| [symbol] | <code>String</code> | A symbol, if applicable, to the given [SubscriptionType](#EnumsSubscriptionType) |

>Stops notification of the callback for the [SubscriptionType](#EnumsSubscriptionType).
See [on](#ConnectionBaseon).


* * *

### connectionBase.getPollingFrequency() :id=connectionbasegetpollingfrequency
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Returns**: <code>number</code> \| <code>null</code>  
**Access**: public  
>The frequency, in milliseconds, used to poll for changes to [Quote](/content/sdk/marketstate?id=quote)
objects. A null value indicates streaming updates (default).


* * *

### connectionBase.setPollingFrequency(pollingFrequency) :id=connectionbasesetpollingfrequency
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

| Param | Type |
| --- | --- |
| pollingFrequency | <code>number</code> \| <code>null</code> | 

>Sets the polling frequency, in milliseconds. A null value indicates
streaming market updates (where polling is not used).


* * *

### connectionBase.getExtendedProfileMode() :id=connectionbasegetextendedprofilemode
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Returns**: <code>boolean</code>  
**Access**: public  
>Indicates if additional profile data (e.g. future contract expiration dates
should be loaded when subscribing to to market data).


* * *

### connectionBase.getMarketState() :id=connectionbasegetmarketstate
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Returns**: <code>MarketState</code>  
>Returns the [MarketState](/content/sdk/marketstate?id=marketstate) singleton, used to access [Quote](/content/sdk/marketstate?id=quote), 
[Profile](/content/sdk/marketstate?id=profile), and [CumulativeVolume](/content/sdk/marketstate?id=cumulativevolume) objects.


* * *

### connectionBase.getServer() :id=connectionbasegetserver
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Returns**: <code>null</code> \| <code>string</code>  
**Access**: public  

* * *

### connectionBase.getPassword() :id=connectionbasegetpassword
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Returns**: <code>null</code> \| <code>string</code>  
**Access**: public  

* * *

### connectionBase.getUsername() :id=connectionbasegetusername
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Returns**: <code>null</code> \| <code>string</code>  
**Access**: public  

* * *

### connectionBase.\_getInstance() :id=connectionbase_getinstance
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Returns**: <code>Number</code>  
**Access**: protected  
>Get an unique identifier for the current instance.


* * *

## Enums :id=enums
**Kind**: global namespace  

* * *

### Enums.SubscriptionType :id=enumssubscriptiontype
**Kind**: static enum of [<code>Enums</code>](#Enums)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| MarketDepth | <code>string</code> | <code>&quot;marketDepth&quot;</code> | a subscription to [Book](/content/sdk/marketstate?id=book) changes |
| MarketUpdate | <code>string</code> | <code>&quot;marketUpdate&quot;</code> | a subscription to [Quote](/content/sdk/marketstate?id=quote) changes |
| CumulativeVolume | <code>string</code> | <code>&quot;cumulativeVolume&quot;</code> | a subscription to [CumulativeVolume](/content/sdk/marketstate?id=cumulativevolume) changes |
| Timestamp | <code>string</code> | <code>&quot;timestamp&quot;</code> | a subscription to the server's timestamp beacon |
| Events | <code>string</code> | <code>&quot;events&quot;</code> | a subscription to system events (debugging only) |

>A data feed type. See [on](#ConnectionBaseon).


* * *

