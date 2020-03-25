## Classes

* [Connection](#Connection) 

* [ConnectionBase](#ConnectionBase) 

## Objects

* [Subscription](#Subscription) 

## Connection :id=connection
**Kind**: global class  
**Extends**: [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  
>Object used to connect to Barchart servers and subscribe to market data.


* [Connection](#Connection) ⇐ [<code>ConnectionBase</code>](#ConnectionBase)
    * [.connect(server, username, password, [webSocketAdapterFactory])](#ConnectionBase+connect)
    * [.disconnect()](#ConnectionBase+disconnect)
    * [.pause()](#ConnectionBase+pause)
    * [.resume()](#ConnectionBase+resume)
    * [.on(subscriptionType, callback, [symbol])](#ConnectionBase+on)
    * [.off(subscriptionType, callback, [symbol])](#ConnectionBase+off)
    * [.getPollingFrequency()](#ConnectionBase+getPollingFrequency) ⇒ <code>number</code> \| <code>null</code>
    * [.setPollingFrequency(pollingFrequency)](#ConnectionBase+setPollingFrequency)
    * [.getExtendedProfileMode()](#ConnectionBase+getExtendedProfileMode) ⇒ <code>boolean</code>
    * [.getMarketState()](#ConnectionBase+getMarketState) ⇒ <code>MarketState</code>
    * [.getServer()](#ConnectionBase+getServer) ⇒ <code>null</code> \| <code>string</code>
    * [.getPassword()](#ConnectionBase+getPassword) ⇒ <code>null</code> \| <code>string</code>
    * [.getUsername()](#ConnectionBase+getUsername) ⇒ <code>null</code> \| <code>string</code>
    * [._getInstance()](#ConnectionBase+_getInstance) ⇒ <code>Number</code>


* * *

### connection.connect(server, username, password, [webSocketAdapterFactory]) :id=connectionconnect
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>connect</code>](#ConnectionBase+connect)  
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
**Overrides**: [<code>disconnect</code>](#ConnectionBase+disconnect)  
**Access**: public  
>Forces a disconnect from the server.


* * *

### connection.pause() :id=connectionpause
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>pause</code>](#ConnectionBase+pause)  
**Access**: public  
>Causes the market state to stop updating. All subscriptions are maintained.


* * *

### connection.resume() :id=connectionresume
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>resume</code>](#ConnectionBase+resume)  
**Access**: public  
>Causes the market state to begin updating again (after [pause](#ConnectionBase+pause) has been called).


* * *

### connection.on(subscriptionType, callback, [symbol]) :id=connectionon
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>on</code>](#ConnectionBase+on)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionType | [<code>SubscriptionType</code>](#Subscription.SubscriptionType) |  |
| callback | <code>function</code> | notified each time the event occurs |
| [symbol] | <code>String</code> | A symbol, if applicable, to the given [SubscriptionType](#Subscription.SubscriptionType) |

>Initiates a subscription to an [SubscriptionType](#Subscription.SubscriptionType) and
registers the callback for notifications.


* * *

### connection.off(subscriptionType, callback, [symbol]) :id=connectionoff
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>off</code>](#ConnectionBase+off)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionType | [<code>SubscriptionType</code>](#Subscription.SubscriptionType) | the [SubscriptionType](#Subscription.SubscriptionType) which was passed to [on](#ConnectionBase+on) |
| callback | <code>function</code> | the callback which was passed to [on](#ConnectionBase+on) |
| [symbol] | <code>String</code> | A symbol, if applicable, to the given [SubscriptionType](#Subscription.SubscriptionType) |

>Stops notification of the callback for the [SubscriptionType](#Subscription.SubscriptionType).
See [on](#ConnectionBase+on).


* * *

### connection.getPollingFrequency() :id=connectiongetpollingfrequency
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getPollingFrequency</code>](#ConnectionBase+getPollingFrequency)  
**Access**: public  
>The frequency, in milliseconds, used to poll for changes to [Quote](Quote)
objects. A null value indicates streaming updates (default).


* * *

### connection.setPollingFrequency(pollingFrequency) :id=connectionsetpollingfrequency
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>setPollingFrequency</code>](#ConnectionBase+setPollingFrequency)  
**Access**: public  

| Param | Type |
| --- | --- |
| pollingFrequency | <code>number</code> \| <code>null</code> | 

>Sets the polling frequency, in milliseconds. A null value indicates
streaming market updates (where polling is not used).


* * *

### connection.getExtendedProfileMode() :id=connectiongetextendedprofilemode
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getExtendedProfileMode</code>](#ConnectionBase+getExtendedProfileMode)  
**Access**: public  
>Indicates if additional profile data (e.g. future contract expiration dates
should be loaded when subscribing to to market data).


* * *

### connection.getMarketState() :id=connectiongetmarketstate
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getMarketState</code>](#ConnectionBase+getMarketState)  
>Returns the [MarketState](MarketState) singleton, used to access [Quote](Quote), 
[Profile](Profile), and [CumulativeVolume](CumulativeVolume) objects.


* * *

### connection.getServer() :id=connectiongetserver
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getServer</code>](#ConnectionBase+getServer)  
**Access**: public  

* * *

### connection.getPassword() :id=connectiongetpassword
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getPassword</code>](#ConnectionBase+getPassword)  
**Access**: public  

* * *

### connection.getUsername() :id=connectiongetusername
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getUsername</code>](#ConnectionBase+getUsername)  
**Access**: public  

* * *

### connection.\_getInstance() :id=connection_getinstance
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>\_getInstance</code>](#ConnectionBase+_getInstance)  
**Access**: protected  
>Get an unique identifier for the current instance.


* * *

## ConnectionBase :id=connectionbase
**Kind**: global class  
**Access**: protected  
>Contract for communicating with remove market data servers and
querying current market state.


* [ConnectionBase](#ConnectionBase)
    * [.connect(server, username, password, [webSocketAdapterFactory])](#ConnectionBase+connect)
    * [.disconnect()](#ConnectionBase+disconnect)
    * [.pause()](#ConnectionBase+pause)
    * [.resume()](#ConnectionBase+resume)
    * [.on(subscriptionType, callback, [symbol])](#ConnectionBase+on)
    * [.off(subscriptionType, callback, [symbol])](#ConnectionBase+off)
    * [.getPollingFrequency()](#ConnectionBase+getPollingFrequency) ⇒ <code>number</code> \| <code>null</code>
    * [.setPollingFrequency(pollingFrequency)](#ConnectionBase+setPollingFrequency)
    * [.getExtendedProfileMode()](#ConnectionBase+getExtendedProfileMode) ⇒ <code>boolean</code>
    * [.getMarketState()](#ConnectionBase+getMarketState) ⇒ <code>MarketState</code>
    * [.getServer()](#ConnectionBase+getServer) ⇒ <code>null</code> \| <code>string</code>
    * [.getPassword()](#ConnectionBase+getPassword) ⇒ <code>null</code> \| <code>string</code>
    * [.getUsername()](#ConnectionBase+getUsername) ⇒ <code>null</code> \| <code>string</code>
    * [._getInstance()](#ConnectionBase+_getInstance) ⇒ <code>Number</code>


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
>Causes the market state to begin updating again (after [pause](#ConnectionBase+pause) has been called).


* * *

### connectionBase.on(subscriptionType, callback, [symbol]) :id=connectionbaseon
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionType | [<code>SubscriptionType</code>](#Subscription.SubscriptionType) |  |
| callback | <code>function</code> | notified each time the event occurs |
| [symbol] | <code>String</code> | A symbol, if applicable, to the given [SubscriptionType](#Subscription.SubscriptionType) |

>Initiates a subscription to an [SubscriptionType](#Subscription.SubscriptionType) and
registers the callback for notifications.


* * *

### connectionBase.off(subscriptionType, callback, [symbol]) :id=connectionbaseoff
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionType | [<code>SubscriptionType</code>](#Subscription.SubscriptionType) | the [SubscriptionType](#Subscription.SubscriptionType) which was passed to [on](#ConnectionBase+on) |
| callback | <code>function</code> | the callback which was passed to [on](#ConnectionBase+on) |
| [symbol] | <code>String</code> | A symbol, if applicable, to the given [SubscriptionType](#Subscription.SubscriptionType) |

>Stops notification of the callback for the [SubscriptionType](#Subscription.SubscriptionType).
See [on](#ConnectionBase+on).


* * *

### connectionBase.getPollingFrequency() :id=connectionbasegetpollingfrequency
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  
>The frequency, in milliseconds, used to poll for changes to [Quote](Quote)
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
**Access**: public  
>Indicates if additional profile data (e.g. future contract expiration dates
should be loaded when subscribing to to market data).


* * *

### connectionBase.getMarketState() :id=connectionbasegetmarketstate
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
>Returns the [MarketState](MarketState) singleton, used to access [Quote](Quote), 
[Profile](Profile), and [CumulativeVolume](CumulativeVolume) objects.


* * *

### connectionBase.getServer() :id=connectionbasegetserver
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

* * *

### connectionBase.getPassword() :id=connectionbasegetpassword
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

* * *

### connectionBase.getUsername() :id=connectionbasegetusername
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

* * *

### connectionBase.\_getInstance() :id=connectionbase_getinstance
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: protected  
>Get an unique identifier for the current instance.


* * *

## Subscription :id=subscription
**Kind**: global namespace  

* * *

### Subscription.SubscriptionType :id=subscriptionsubscriptiontype
**Kind**: static enum of [<code>Subscription</code>](#Subscription)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| MarketDepth | <code>string</code> | <code>&quot;marketDepth&quot;</code> | a subscription to [Book](Book) changes |
| MarketUpdate | <code>string</code> | <code>&quot;marketUpdate&quot;</code> | a subscription to [Quote](Quote) changes |
| CumulativeVolume | <code>string</code> | <code>&quot;cumulativeVolume&quot;</code> | a subscription to [CumulativeVolume](CumulativeVolume) changes |
| Timestamp | <code>string</code> | <code>&quot;timestamp&quot;</code> | a subscription to the server's timestamp beacon |
| Events | <code>string</code> | <code>&quot;events&quot;</code> | a subscription to system events (debugging only) |

>A data feed type. See [on](#ConnectionBase+on).


* * *

