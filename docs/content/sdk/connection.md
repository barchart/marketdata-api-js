## Classes

### [ConnectionBase](#ConnectionBase) :id=ConnectionBaseDesc
Contract for communicating with remove market data servers and
querying current market state.

## Objects

### [Subscription](#Subscription) :id=SubscriptionDesc


## ConnectionBase :id=connectionbase
Contract for communicating with remove market data servers and
querying current market state.

**Kind**: global class  
**Access**: protected  

* [ConnectionBase](#ConnectionBase)
    * [.connect(server, username, password, [webSocketAdapterFactory])](#ConnectionBaseconnect)
    * [.disconnect()](#ConnectionBasedisconnect)
    * [.pause()](#ConnectionBasepause)
    * [.resume()](#ConnectionBaseresume)
    * [.on(eventType, callback, [symbol])](#ConnectionBaseon)
    * [.off(eventType, callback, [symbol])](#ConnectionBaseoff)
    * [.getPollingFrequency()](#ConnectionBasegetPollingFrequency) ⇒ <code>number</code> \| <code>null</code>
    * [.setPollingFrequency(pollingFrequency)](#ConnectionBasesetPollingFrequency)
    * [.getExtendedProfileMode()](#ConnectionBasegetExtendedProfileMode) ⇒ <code>boolean</code>
    * [.getMarketState()](#ConnectionBasegetMarketState) ⇒ <code>MarketState</code>
    * [.getServer()](#ConnectionBasegetServer) ⇒ <code>null</code> \| <code>string</code>
    * [.getPassword()](#ConnectionBasegetPassword) ⇒ <code>null</code> \| <code>string</code>
    * [.getUsername()](#ConnectionBasegetUsername) ⇒ <code>null</code> \| <code>string</code>
    * [._getInstance()](#ConnectionBase_getInstance) ⇒ <code>Number</code>

### connectionBase.connect(server, username, password, [webSocketAdapterFactory]) :id=connectionbaseconnect
Connects to the given server with username and password.

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

| Param | Type |
| --- | --- |
| server | <code>string</code> | 
| username | <code>string</code> | 
| password | <code>string</code> | 
| [webSocketAdapterFactory] | <code>WebSocketAdapterFactory</code> | 

### connectionBase.disconnect() :id=connectionbasedisconnect
Forces a disconnect from the server.

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  
### connectionBase.pause() :id=connectionbasepause
Causes the market state to stop updating. All subscriptions are maintained.

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  
### connectionBase.resume() :id=connectionbaseresume
Causes the market state to begin updating again (after [pause](#ConnectionBasepause) has been called).

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  
### connectionBase.on(eventType, callback, [symbol]) :id=connectionbaseon
Initiates a subscription to an [Subscription.EventType](Subscription.EventType) and
registers the callback for notifications.

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| eventType | <code>Subscription.EventType</code> |  |
| callback | <code>function</code> | notified each time the event occurs |
| [symbol] | <code>String</code> | A symbol, if applicable, to the given [Subscription.EventType](Subscription.EventType) |

### connectionBase.off(eventType, callback, [symbol]) :id=connectionbaseoff
Stops notification of the callback for the [Subscription.EventType](Subscription.EventType).
See [on](#ConnectionBaseon).

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| eventType | <code>Subscription.EventType</code> | the [Subscription.EventType](Subscription.EventType) which was passed to [on](#ConnectionBaseon) |
| callback | <code>function</code> | the callback which was passed to [on](#ConnectionBaseon) |
| [symbol] | <code>String</code> | A symbol, if applicable, to the given [Subscription.EventType](Subscription.EventType) |

### connectionBase.getPollingFrequency() ⇒ <code>number</code> \| <code>null</code> :id=connectionbasegetpollingfrequency
The frequency, in milliseconds, used to poll for changes to [Quote](Quote)
objects. A null value indicates streaming updates (default).

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  
### connectionBase.setPollingFrequency(pollingFrequency) :id=connectionbasesetpollingfrequency
Sets the polling frequency, in milliseconds. A null value indicates
streaming market updates (where polling is not used).

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

| Param | Type |
| --- | --- |
| pollingFrequency | <code>number</code> \| <code>null</code> | 

### connectionBase.getExtendedProfileMode() ⇒ <code>boolean</code> :id=connectionbasegetextendedprofilemode
Indicates if additional profile data (e.g. future contract expiration dates
should be loaded when subscribing to to market data).

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  
### connectionBase.getMarketState() ⇒ <code>MarketState</code> :id=connectionbasegetmarketstate
Returns the [MarketState](MarketState) singleton, used to access [Quote](Quote), 
[Profile](Profile), and [CumulativeVolume](CumulativeVolume) objects.

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
### connectionBase.getServer() ⇒ <code>null</code> \| <code>string</code> :id=connectionbasegetserver
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  
### connectionBase.getPassword() ⇒ <code>null</code> \| <code>string</code> :id=connectionbasegetpassword
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  
### connectionBase.getUsername() ⇒ <code>null</code> \| <code>string</code> :id=connectionbasegetusername
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  
### connectionBase.\_getInstance() ⇒ <code>Number</code> :id=connectionbase_getinstance
Get an unique identifier for the current instance.

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: protected  
## Subscription : <code>object</code> :id=subscription
**Kind**: global namespace  
### Subscription.SubscriptionType : <code>enum</code> :id=subscriptionsubscriptiontype
A data feed type. See [on](#ConnectionBaseon).

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

