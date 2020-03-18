## Classes

##### [Connection](#connection) ⇐ [<code>ConnectionBase</code>](#ConnectionBase) :id=connectiondesc

Object used to connect to Barchart servers and subscribe to market data.

##### [ConnectionBase](#ConnectionBase) :id=connectionbasedesc

Contract for communicating with remove market data servers and querying current market state.

##### [WebSocketAdapter](#websocketadapter) :id=websocketadapterdesc

An interface for establishing and interacting with a WebSocket connection.

##### [WebSocketAdapterFactory](#websocketadapterfactory) :id=websocketadapterfactorydesc

An interface for creating WebSocket [WebSocketAdapter](#websocketadapter) instances.

##### [WebSocketAdapterFactoryForBrowsers](#websocketadapterfactoryforbrowsers) ⇐ [<code>WebSocketAdapterFactory</code>](#websocketadapterfactory) :id=websocketadapterfactoryforbrowsersdesc

An implementation of [WebSocketAdapterFactory](#websocketadapterfactory) for use with web browsers.

##### [WebSocketAdapterFactoryForNode](#websocketadapterfactoryfornode) ⇐ [<code>WebSocketAdapterFactory</code>](#websocketadapterfactory) :id=websocketadapterfactoryfornodedesc

An implementation of [WebSocketAdapterFactory](#websocketadapterfactory) for use by Node.js servers

##### [Logger](#logger) :id=loggerdesc

An interface for writing log messages.

##### [LoggerFactory](#loggerfactory) :id=loggerfactorydesc
Static utilities for interacting with the log system.


##### [LoggerProvider](#loggerprovider) :id=loggerproviderdesc

An interface for generating [Logger](#logger) instances.

##### [CumulativeVolume](#cumulativevolume) :id=cumulativevolumedesc

An aggregation of the total volume traded at each price level for a single instrument.

##### [Exchange](#exchange) :id=exchangedesc

Describes an exchange.

##### [MarketState](#marketstate) :id=marketstatedesc

Repository for current market state. This repository will only contain data for an instrument after a subscription has been established using the [on](#ConnectionBaseon) function.
Access the singleton instance using the [getMarketState](#ConnectionBasegetmarketstate) function.

##### [Profile](#profile) :id=profiledesc

Describes an instrument.

##### [Quote](#quote) :id=quotedesc

Current market conditions for an instrument.

##### [SymbolParser](#symbolparser) :id=symbolparserdesc

Static utilities for parsing symbols.


## Objects

##### [Subscription : <code>object</code>](#subscription) :id=subscriptiondesc

## Functions

##### [getTimezones()](#gettimezones) ⇒ <code>Array.&lt;String&gt;</code> :id=gettimezonesdesc

Gets a list of names in the tz database (see <a href="https://en.wikipedia.org/wiki/Tz_database">https://en.wikipedia.org/wiki/Tz_database</a>
and <a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones">https://en.wikipedia.org/wiki/List_of_tz_database_time_zones</a>).


##### [guessTimezone()](#guessTimezone) ⇒ <code>String</code> | <code>null</code> :id=guessTimezonedesc

Attempts to guess the local timezone.

## Typedefs

##### [ExchangeMetadata](#exchangemetadata) : <code>Object</code> :id=exchangemetadatadesc

Exchange metadata.

##### [ProfileExtension](#profileextension) : <code>Object</code> :id=profileextensiondesc

Extended profile information.

##### [Book](#book) : <code>Object</code> :id=bookdesc

## Connection ⇐ [<code>ConnectionBase</code>](#ConnectionBase) :id=connection
Object used to connect to Barchart servers and subscribe to market data.

**Kind**: global class  
**Extends**: [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

* [Connection](#Connection) ⇐ [<code>ConnectionBase</code>](#ConnectionBase)
    * [.connect(server, username, password, [webSocketAdapterFactory])](#Connectionconnect)
    * [.disconnect()](#Connectiondisconnect)
    * [.pause()](#Connectionpause)
    * [.resume()](#Connectionresume)
    * [.on(eventType, callback, [symbol])](#Connectionon)
    * [.off(eventType, callback, [symbol])](#Connectionoff)
    * [.getPollingFrequency()](#ConnectiongetPollingFrequency) ⇒ <code>number</code> \| <code>null</code>
    * [.setPollingFrequency(pollingFrequency)](#ConnectionsetPollingFrequency)
    * [.getExtendedProfileMode()](#ConnectiongetExtendedProfileMode) ⇒ <code>boolean</code>
    * [.getMarketState()](#ConnectiongetMarketState) ⇒ [<code>MarketState</code>](#MarketState)
    * [.getServer()](#ConnectiongetServer) ⇒ <code>null</code> \| <code>string</code>
    * [.getPassword()](#ConnectiongetPassword) ⇒ <code>null</code> \| <code>string</code>
    * [.getUsername()](#ConnectiongetUsername) ⇒ <code>null</code> \| <code>string</code>
    * [._getInstance()](#ConnectiongetInstance) ⇒ <code>Number</code>


### connection.connect(server, username, password, [webSocketAdapterFactory]) :id=connectionconnect
Connects to the given server with username and password.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>connect</code>](#ConnectionBaseconnect)  
**Access**: public  

| Param | Type |
| --- | --- |
| server | <code>string</code> | 
| username | <code>string</code> | 
| password | <code>string</code> | 
| [webSocketAdapterFactory] | [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory) | 

### connection.disconnect() :id=connectiondisconnect
Forces a disconnect from the server.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>disconnect</code>](#ConnectionBasedisconnect)  
**Access**: public  

### connection.pause() :id=connectionpause
Causes the market state to stop updating. All subscriptions are maintained.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>pause</code>](#ConnectionBasepause)  
**Access**: public  

### connection.resume() :id=connectionresume
Causes the market state to begin updating again (after [pause](#ConnectionBasepause) has been called).

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>resume</code>](#ConnectionBaseresume)  
**Access**: public  

### connection.on(eventType, callback, [symbol]) :id=connectionon
Initiates a subscription to an [EventType](#Subscriptioneventtype) and
registers the callback for notifications.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>on</code>](#ConnectionBaseon)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| eventType | [<code>EventType</code>](#Subscriptioneventtype) |  |
| callback | <code>function</code> | notified each time the event occurs |
| [symbol] | <code>String</code> | A symbol, if applicable, to the given [EventType](#Subscriptioneventtype) |

### connection.off(eventType, callback, [symbol]) :id=connectionoff
Stops notification of the callback for the [EventType](#Subscriptioneventtype).
See [on](#ConnectionBaseon).

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>off</code>](#ConnectionBaseoff)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| eventType | [<code>EventType</code>](#Subscriptioneventtype) | the [EventType](#Subscriptioneventtype) which was passed to [on](#ConnectionBaseon) |
| callback | <code>function</code> | the callback which was passed to [on](#ConnectionBaseon) |
| [symbol] | <code>String</code> | A symbol, if applicable, to the given [EventType](#Subscriptioneventtype) |

### connection.getPollingFrequency() ⇒ <code>number</code> \| <code>null</code> :id=connectiongetPollingFrequency
The frequency, in milliseconds, used to poll for changes to [Quote](#Quote)
objects. A null value indicates streaming updates (default).

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getPollingFrequency</code>](#ConnectionBasegetPollingFrequency)  
**Access**: public  

### connection.setPollingFrequency(pollingFrequency) :id=connectionsetPollingFrequency
Sets the polling frequency, in milliseconds. A null value indicates
streaming market updates (where polling is not used).

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>setPollingFrequency</code>](#ConnectionBasesetPollingFrequency)  
**Access**: public  

| Param | Type |
| --- | --- |
| pollingFrequency | <code>number</code> \| <code>null</code> | 

### connection.getExtendedProfileMode() ⇒ <code>boolean</code> :id=connectiongetExtendedProfileMode
Indicates if additional profile data (e.g. future contract expiration dates
should be loaded when subscribing to to market data).

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getExtendedProfileMode</code>](#ConnectionBasegetExtendedProfileMode)  
**Access**: public  

### connection.getMarketState() ⇒ [<code>MarketState</code>](#MarketState) :id=connectiongetMarketState
Returns the [MarketState](#MarketState) singleton, used to access [Quote](#Quote), 
[Profile](#Profile), and [CumulativeVolume](#CumulativeVolume) objects.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getMarketState</code>](#ConnectionBasegetMarketState)  

### connection.getServer() ⇒ <code>null</code> \| <code>string</code> :id=connectiongetServer
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getServer</code>](#ConnectionBasegetServer)  
**Access**: public  

### connection.getPassword() ⇒ <code>null</code> \| <code>string</code> :id=connectiongetPassword
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getPassword</code>](#ConnectionBasegetPassword)  
**Access**: public  

### connection.getUsername() ⇒ <code>null</code> \| <code>string</code> :id=connectiongetUsername
**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>getUsername</code>](#ConnectionBasegetUsername)  
**Access**: public  


### connection.\_getInstance() ⇒ <code>Number</code> :id=connectiongetInstance
Get an unique identifier for the current instance.

**Kind**: instance method of [<code>Connection</code>](#Connection)  
**Overrides**: [<code>\_getInstance</code>](#ConnectionBase_getInstance)  
**Access**: protected  

## ConnectionBase
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
    * [.getMarketState()](#ConnectionBasegetMarketState) ⇒ [<code>MarketState</code>](#MarketState)
    * [.getServer()](#ConnectionBasegetServer) ⇒ <code>null</code> \| <code>string</code>
    * [.getPassword()](#ConnectionBasegetPassword) ⇒ <code>null</code> \| <code>string</code>
    * [.getUsername()](#ConnectionBasegetUsername) ⇒ <code>null</code> \| <code>string</code>
    * [._getInstance()](#ConnectionBase_getInstance) ⇒ <code>Number</code>

### connectionBase.connect(server, username, password, [webSocketAdapterFactory]) :id=ConnectionBaseconnect
Connects to the given server with username and password.

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

| Param | Type |
| --- | --- |
| server | <code>string</code> | 
| username | <code>string</code> | 
| password | <code>string</code> | 
| [webSocketAdapterFactory] | [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory) | 

### connectionBase.disconnect() :id=ConnectionBasedisconnect
Forces a disconnect from the server.

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

### connectionBase.pause() :id=ConnectionBasepause
Causes the market state to stop updating. All subscriptions are maintained.

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

### connectionBase.resume() :id=ConnectionBaseresume
Causes the market state to begin updating again (after [pause](#ConnectionBasepause) has been called).

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

### connectionBase.on(eventType, callback, [symbol]) :id=ConnectionBaseon
Initiates a subscription to an [EventType](#Subscriptioneventtype) and
registers the callback for notifications.

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| eventType | [<code>EventType</code>](#Subscriptioneventtype) |  |
| callback | <code>function</code> | notified each time the event occurs |
| [symbol] | <code>String</code> | A symbol, if applicable, to the given [EventType](#Subscriptioneventtype) |

### connectionBase.off(eventType, callback, [symbol]) :id=ConnectionBaseoff
Stops notification of the callback for the [EventType](#Subscriptioneventtype).
See [on](#ConnectionBaseon).

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| eventType | [<code>EventType</code>](#Subscriptioneventtype) | the [EventType](#Subscriptioneventtype) which was passed to [on](#ConnectionBaseon) |
| callback | <code>function</code> | the callback which was passed to [on](#ConnectionBaseon) |
| [symbol] | <code>String</code> | A symbol, if applicable, to the given [EventType](#Subscriptioneventtype) |

### connectionBase.getPollingFrequency() ⇒ <code>number</code> \| <code>null</code> :id=ConnectionBasegetPollingFrequency
The frequency, in milliseconds, used to poll for changes to [Quote](#Quote)
objects. A null value indicates streaming updates (default).

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

### connectionBase.setPollingFrequency(pollingFrequency) :id=ConnectionBasesetPollingFrequency
Sets the polling frequency, in milliseconds. A null value indicates
streaming market updates (where polling is not used).

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

| Param | Type |
| --- | --- |
| pollingFrequency | <code>number</code> \| <code>null</code> | 

### connectionBase.getExtendedProfileMode() ⇒ <code>boolean</code> :id=ConnectionBasegetExtendedProfileMode
Indicates if additional profile data (e.g. future contract expiration dates
should be loaded when subscribing to to market data).

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

### connectionBase.getMarketState() ⇒ [<code>MarketState</code>](#MarketState) :id=ConnectionBasegetMarketState
Returns the [MarketState](#MarketState) singleton, used to access [Quote](#Quote), 
[Profile](#Profile), and [CumulativeVolume](#CumulativeVolume) objects.

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  

### connectionBase.getServer() ⇒ <code>null</code> \| <code>string</code> :id=ConnectionBasegetServer
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

### connectionBase.getPassword() ⇒ <code>null</code> \| <code>string</code> :id=ConnectionBasegetPassword
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

### connectionBase.getUsername() ⇒ <code>null</code> \| <code>string</code> :id=ConnectionBasegetUsername
**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: public  

### connectionBase.\_getInstance() ⇒ <code>Number</code> :id=ConnectionBase_getInstance
Get an unique identifier for the current instance.

**Kind**: instance method of [<code>ConnectionBase</code>](#ConnectionBase)  
**Access**: protected  

## WebSocketAdapter
An interface for establishing and interacting with a WebSocket connection.

**Kind**: global class  
**Access**: public  

## WebSocketAdapterFactory
An interface for creating WebSocket [WebSocketAdapter](#WebSocketAdapter) instances.

**Kind**: global class  
**Access**: public  

### webSocketAdapterFactory.build(host) ⇒ <code>null</code>
Returns a new [WebSocketAdapter](#WebSocketAdapter) instance.

**Kind**: instance method of [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)  
**Access**: public  

| Param | Type |
| --- | --- |
| host | <code>String</code> | 

## WebSocketAdapterFactoryForBrowsers ⇐ [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)
An implementation of [WebSocketAdapterFactory](#WebSocketAdapterFactory) for use with web browsers.

**Kind**: global class  
**Extends**: [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)  
**Access**: public  

### webSocketAdapterFactoryForBrowsers.build(host) ⇒ <code>null</code>
Returns a new [WebSocketAdapter](#WebSocketAdapter) instance.

**Kind**: instance method of [<code>WebSocketAdapterFactoryForBrowsers</code>](#WebSocketAdapterFactoryForBrowsers)  
**Overrides**: [<code>build</code>](#WebSocketAdapterFactory+build)  
**Access**: public  

| Param | Type |
| --- | --- |
| host | <code>String</code> | 

## WebSocketAdapterFactoryForNode ⇐ [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)
An implementation of [WebSocketAdapterFactory](#WebSocketAdapterFactory) for use by Node.js servers.

**Kind**: global class  
**Extends**: [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)  
**Access**: public  

### webSocketAdapterFactoryForNode.build(host) ⇒ <code>null</code>
Returns a new [WebSocketAdapter](#WebSocketAdapter) instance.

**Kind**: instance method of [<code>WebSocketAdapterFactoryForNode</code>](#WebSocketAdapterFactoryForNode)  
**Overrides**: [<code>build</code>](#WebSocketAdapterFactory+build)  
**Access**: public  

| Param | Type |
| --- | --- |
| host | <code>String</code> | 

## Logger
An interface for writing log messages.

**Kind**: global class  
**Access**: public  

* [Logger](#Logger)
    * [.log()](#Loggerlog)
    * [.trace()](#Loggertrace)
    * [.debug()](#Loggerdebug)
    * [.info()](#Loggerinfo)
    * [.warn()](#Loggerwarn)
    * [.error()](#Loggererror)

### logger.log()
Writes a log message.

**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Access**: public  

### logger.trace()
Writes a log message, at "trace" level.

**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Access**: public  

### logger.debug()
Writes a log message, at "debug" level.

**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Access**: public  

### logger.info()
Writes a log message, at "info" level.

**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Access**: public  

### logger.warn()
Writes a log message, at "warn" level.

**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Access**: public  

### logger.error()
Writes a log message, at "error" level.

**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Access**: public  

## LoggerFactory
Static utilities for interacting with the log system.

**Kind**: global class  
**Access**: public  

* [LoggerFactory](#LoggerFactory)
    * [.configureForConsole()](#LoggerFactoryconfigureForConsole)
    * [.configureForSilence()](#LoggerFactoryconfigureForSilence)
    * [.configure(provider)](#LoggerFactoryconfigure)
    * [.getLogger(category)](#LoggerFactorygetLogger) ⇒ [<code>Logger</code>](#Logger)

### LoggerFactory.configureForConsole() :id=LoggerFactoryconfigureForConsole
Configures the library to write log messages to the console.

**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  

### LoggerFactory.configureForSilence() :id=LoggerFactoryconfigureForSilence
Configures the mute all log messages.

**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  

### LoggerFactory.configure(provider) :id=LoggerFactoryconfigure
Configures the library to delegate any log messages to a custom
implementation of the [LoggerProvider](#LoggerProvider) interface.

**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  

| Param | Type |
| --- | --- |
| provider | [<code>LoggerProvider</code>](#LoggerProvider) | 

### LoggerFactory.getLogger(category) ⇒ [<code>Logger</code>](#Logger) :id=LoggerFactorygetLogger
Returns an instance of [Logger](#Logger) for a specific category.

**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  

| Param | Type |
| --- | --- |
| category | <code>String</code> | 

## LoggerProvider
An interface for generating [Logger](#Logger) instances.

**Kind**: global class  
**Access**: public  

### loggerProvider.getLogger(category) ⇒ [<code>Logger</code>](#Logger)
Returns an instance of [Logger](#Logger).

**Kind**: instance method of [<code>LoggerProvider</code>](#LoggerProvider)  
**Access**: public  

| Param | Type |
| --- | --- |
| category | <code>String</code> | 

## CumulativeVolume
An aggregation of the total volume traded at each price level for a
single instrument.

**Kind**: global class  
**Access**: public  

* [CumulativeVolume](#CumulativeVolume)
    * [.symbol](#CumulativeVolumesymbol)
    * [.getVolume(price)](#CumulativeVolumegetVolume) ⇒ <code>number</code>
    * [.toArray()](#CumulativeVolumetoArray) ⇒ [<code>Array.&lt;PriceLevel&gt;</code>](#PriceLevel)

### cumulativeVolume.symbol :id=CumulativeVolumesymbol
**Kind**: instance property of [<code>CumulativeVolume</code>](#CumulativeVolume)  
**Properties**

| Name | Type |
| --- | --- |
| symbol | <code>string</code> | 

### cumulativeVolume.getVolume(price) ⇒ <code>number</code> :id=CumulativeVolumegetVolume
Given a numeric price, returns the volume traded at that price level.

**Kind**: instance method of [<code>CumulativeVolume</code>](#CumulativeVolume)  
**Access**: public  

| Param | Type |
| --- | --- |
| price | <code>number</code> | 

### cumulativeVolume.toArray() ⇒ [<code>Array.&lt;PriceLevel&gt;</code>](#PriceLevel) :id=CumulativeVolumetoArray
Returns an array of all price levels. This is an expensive operation. Observing
an ongoing subscription is preferred (see [on](#ConnectionBaseon)).

**Kind**: instance method of [<code>CumulativeVolume</code>](#CumulativeVolume)  

## Exchange
Describes an exchange.

**Kind**: global class  
**Access**: public  

* [Exchange](#Exchange)
    * [.id](#Exchangeid)
    * [.name](#Exchangename)
    * [.timezoneDdf](#ExchangetimezoneDdf)
    * [.offsetDdf](#ExchangeoffsetDdf)
    * [.timezoneExchange](#ExchangetimezoneExchange)
    * [.offsetExchange](#ExchangeoffsetExchange)

### exchange.id :id=Exchangeid
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | the code used to identify the exchange |

### exchange.name :id=Exchangename
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the exchange |

### exchange.timezoneDdf :id=ExchangetimezoneDdf
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| timezoneDdf | <code>string</code> \| <code>null</code> | the timezone used by DDF for this exchange (should conform to a TZ database name) |

### exchange.offsetDdf :id=ExchangeoffsetDdf
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| offsetDdf | <code>number</code> \| <code>null</code> | the UTC offset, in milliseconds, for DDF purposes. |

### exchange.timezoneExchange :id=ExchangetimezoneExchange
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| timezoneLocal | <code>string</code> | the actual timezone of the exchange (should conform to a TZ database name) |

### exchange.offsetExchange :id=ExchangeoffsetExchange
**Kind**: instance property of [<code>Exchange</code>](#Exchange)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| offsetExchange | <code>number</code> | - the UTC offset, in milliseconds, of the exchange's local time. |

## MarketState
Repository for current market state. This repository will only contain
data for an instrument after a subscription has been established using
the [on](#ConnectionBaseon) function.

Access the singleton instance using the [getMarketState](#ConnectionBasegetMarketState)
function.

**Kind**: global class  
**Access**: public  

* [MarketState](#MarketState)
    * [.getProfile(symbol, [callback])](#MarketStategetProfile) ⇒ [<code>Promise.&lt;Profile&gt;</code>](#Profile)
    * [.getQuote(symbol)](#MarketStategetQuote) ⇒ [<code>Quote</code>](#Quote)
    * [.getBook(symbol)](#MarketStategetBook) ⇒ [<code>Book</code>](#Book)
    * [.getCumulativeVolume(symbol, [callback])](#MarketStategetCumulativeVolume) ⇒ [<code>Promise.&lt;CumulativeVolume&gt;</code>](#CumulativeVolume)
    * [.getTimestamp()](#MarketStategetTimestamp) ⇒ <code>Date</code>

### marketState.getProfile(symbol, [callback]) ⇒ [<code>Promise.&lt;Profile&gt;</code>](#Profile) :id=MarketStategetProfile
**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Returns**: [<code>Promise.&lt;Profile&gt;</code>](#Profile) - The [Profile](#Profile) instance, as a promise.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> |  |
| [callback] | <code>function</code> | invoked when the [Profile](#Profile) instance becomes available |

### marketState.getQuote(symbol) ⇒ [<code>Quote</code>](#Quote) :id=MarketStategetQuote
**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>string</code> | 

### marketState.getBook(symbol) ⇒ [<code>Book</code>](#Book) :id=MarketStategetBook
**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>string</code> | 

### marketState.getCumulativeVolume(symbol, [callback]) ⇒ [<code>Promise.&lt;CumulativeVolume&gt;</code>](#CumulativeVolume) :id=MarketStategetCumulativeVolume
**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Returns**: [<code>Promise.&lt;CumulativeVolume&gt;</code>](#CumulativeVolume) - The [CumulativeVolume](#CumulativeVolume) instance, as a promise  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> |  |
| [callback] | <code>function</code> | invoked when the [CumulativeVolume](#CumulativeVolume) instance becomes available |

### marketState.getTimestamp() ⇒ <code>Date</code> :id=MarketStategetTimestamp
Returns the time the most recent market data message was received.

**Kind**: instance method of [<code>MarketState</code>](#MarketState)  
**Access**: public  

## Profile
Describes an instrument.

**Kind**: global class  
**Access**: public  

* [Profile](#Profile)
    * [new Profile(symbol, name, exchangeId, unitCode, pointValue, tickIncrement, [exchange], [additional])](#newProfilenew)
    * _instance_
        * [.symbol](#Profilesymbol)
        * [.name](#Profilename)
        * [.exchange](#Profileexchange)
        * [.unitCode](#ProfileunitCode)
        * [.pointValue](#ProfilepointValue)
        * [.tickIncrement](#ProfiletickIncrement)
        * [.exchangeRef](#ProfileexchangeRef)
        * [.root](#Profileroot)
        * [.month](#Profilemonth)
        * [.year](#Profileyear)
        * [.expiration](#Profileexpiration)
        * [.firstNotice](#ProfilefirstNotice)
        * [.formatPrice(price)](#ProfileformatPrice) ⇒ <code>string</code>
    * _static_
        * [.setPriceFormatter(fractionSeparator, specialFractions, [thousandsSeparator])](#ProfilesetPriceFormatter)
        * ~~[.PriceFormatter()](#ProfilePriceFormatter)~~

### new Profile(symbol, name, exchangeId, unitCode, pointValue, tickIncrement, [exchange], [additional]) :id=newProfilenew

| Param | Type |
| --- | --- |
| symbol | <code>string</code> | 
| name | <code>name</code> | 
| exchangeId | <code>string</code> | 
| unitCode | <code>string</code> | 
| pointValue | <code>string</code> | 
| tickIncrement | <code>number</code> | 
| [exchange] | [<code>Exchange</code>](#Exchange) | 
| [additional] | <code>Object</code> | 

### profile.symbol :id=Profilesymbol
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | the symbol of the instrument. |

### profile.name :id=Profilename
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the instrument. |

### profile.exchange :id=Profileexchange
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| exchange | <code>string</code> | code of the listing exchange. |

### profile.unitCode :id=ProfileunitCode
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| unitCode | <code>string</code> | code indicating how a prices for the instrument should be formatted. |

### profile.pointValue :id=ProfilepointValue
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| pointValue | <code>string</code> | the change in value for a one point change in price. |

### profile.tickIncrement :id=ProfiletickIncrement
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tickIncrement | <code>number</code> | the minimum price movement. |

### profile.exchangeRef :id=ProfileexchangeRef
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type |
| --- | --- |
| exchangeRef | [<code>Exchange</code>](#Exchange) \| <code>null</code> | 

### profile.root :id=Profileroot
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| root | <code>string</code> \| <code>undefined</code> | the root symbol, if a future; otherwise undefined. |

### profile.month :id=Profilemonth
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| month | <code>string</code> \| <code>undefined</code> | the month code, if a future; otherwise undefined. |

### profile.year :id=Profileyear
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| year | <code>undefined</code> \| <code>number</code> | the expiration year, if a future; otherwise undefined. |

### profile.expiration :id=Profileexpiration
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| expiration | <code>string</code> \| <code>undefined</code> | the expiration date, as a string, formatted YYYY-MM-DD. |

### profile.firstNotice :id=ProfilefirstNotice
**Kind**: instance property of [<code>Profile</code>](#Profile)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| expiration | <code>string</code> \| <code>undefined</code> | the first notice date, as a string, formatted YYYY-MM-DD. |

### profile.formatPrice(price) ⇒ <code>string</code> :id=ProfileformatPrice
Given a numeric price, returns a human-readable price.

**Kind**: instance method of [<code>Profile</code>](#Profile)  
**Access**: public  

| Param | Type |
| --- | --- |
| price | <code>number</code> | 

### Profile.setPriceFormatter(fractionSeparator, specialFractions, [thousandsSeparator]) :id=ProfilesetPriceFormatter
Configures the logic used to format all prices using the [formatPrice](#ProfileformatPrice) instance function.

**Kind**: static method of [<code>Profile</code>](#Profile)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| fractionSeparator | <code>string</code> | usually a dash or a period |
| specialFractions | <code>boolean</code> | usually true |
| [thousandsSeparator] | <code>string</code> | usually a comma |

### ~~Profile.PriceFormatter()~~ :id=ProfilePriceFormatter
***Deprecated***

Alias for [setPriceFormatter](#ProfilesetPriceFormatter) function.

**Kind**: static method of [<code>Profile</code>](#Profile)  
**Access**: public  
**See**: [setPriceFormatter](#ProfilesetPriceFormatter)  

## Quote
Current market conditions for an instrument.

**Kind**: global class  
**Access**: public  

* [Quote](#Quote)
    * [new Quote([symbol])](#new_Quote_new)
    * [.symbol](#Quotesymbol)
    * [.message](#Quotemessage)
    * [.flag](#Quoteflag)
    * [.day](#Quoteday)
    * [.dayNum](#QuotedayNum)
    * [.lastUpdate](#QuotelastUpdate)
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

### new Quote([symbol])

| Param | Type |
| --- | --- |
| [symbol] | <code>String</code> | 

### quote.symbol
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | the symbol of the quoted instrument. |

### quote.message
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | last DDF message that caused a mutation to this instance. |

### quote.flag
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| flag | <code>string</code> | market status, will have one of three values: p, s, or undefined. |

### quote.day
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| day | <code>string</code> | one character code that indicates day of the month of the current trading session. |

### quote.dayNum
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| dayNum | <code>number</code> | day of the month of the current trading session. |

### quote.lastUpdate
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| lastUpdate | <code>Date</code> \| <code>null</code> | the most recent refresh. this date instance stores the hours and minutes for the exchange time (without proper timezone adjustment). use caution. |

### quote.bidPrice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| bidPrice | <code>number</code> | top-of-book price on the buy side. |

### quote.bidSize
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| bidSize | <code>number</code> | top-of-book quantity on the buy side. |

### quote.askPrice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| askPrice | <code>number</code> | top-of-book price on the sell side. |

### quote.askSize
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| askSize | <code>number</code> | top-of-book quantity on the sell side. |

### quote.lastPrice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| lastPrice | <code>number</code> | most recent price (not necessarily a trade). |

### quote.tradePrice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tradePrice | <code>number</code> | most recent trade price. |

### quote.tradeSize
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tradeSize | <code>number</code> | most recent trade quantity. |

### quote.blockTrade
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| blockTrade | <code>number</code> | most recent block trade price. |

### quote.settlementPrice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type |
| --- | --- |
| settlementPrice | <code>number</code> | 

### quote.previousPrice
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| previousPrice | <code>number</code> | price from the previous session. |

### quote.time
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| time | <code>Date</code> \| <code>null</code> | the most recent trade, quote, or refresh. this date instance stores the hours and minutes for the exchange time (without proper timezone adjustment). use caution. |

### quote.profile
**Kind**: instance property of [<code>Quote</code>](#Quote)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| profile | [<code>Profile</code>](#Profile) \| <code>null</code> | metadata regarding the quoted instrument. |

## SymbolParser
Static utilities for parsing symbols.

**Kind**: global class  
**Access**: public  

* [SymbolParser](#SymbolParser)
    * [.parseInstrumentType(symbol)](#SymbolParserparseInstrumentType) ⇒ <code>Object</code> \| <code>null</code>
    * [.getProducerSymbol(symbol)](#SymbolParsergetProducerSymbol) ⇒ <code>String</code> \| <code>null</code>
    * [.getFuturesOptionPipelineFormat(symbol)](#SymbolParsergetFuturesOptionPipelineFormat) ⇒ <code>String</code> \| <code>null</code>
    * [.getIsConcrete(symbol)](#SymbolParsergetIsConcrete) ⇒ <code>Boolean</code>
    * [.getIsReference(symbol)](#SymbolParsergetIsReference) ⇒ <code>Boolean</code>
    * [.getIsFuture(symbol)](#SymbolParsergetIsFuture) ⇒ <code>Boolean</code>
    * [.getIsFutureSpread(symbol)](#SymbolParsergetIsFutureSpread) ⇒ <code>Boolean</code>
    * [.getIsFutureOption(symbol)](#SymbolParsergetIsFutureOption) ⇒ <code>Boolean</code>
    * [.getIsForex(symbol)](#SymbolParsergetIsForex) ⇒ <code>Boolean</code>
    * [.getIsIndex(symbol)](#SymbolParsergetIsIndex) ⇒ <code>Boolean</code>
    * [.getIsSector(symbol)](#SymbolParsergetIsSector) ⇒ <code>Boolean</code>
    * [.getIsCmdty(symbol)](#SymbolParsergetIsCmdty) ⇒ <code>Boolean</code>
    * [.getIsBats(symbol)](#SymbolParsergetIsBats) ⇒ <code>Boolean</code>
    * [.getIsExpired(symbol)](#SymbolParsergetIsExpired) ⇒ <code>Boolean</code>
    * [.displayUsingPercent(symbol)](#SymbolParserdisplayUsingPercent) ⇒ <code>Boolean</code>

### SymbolParser.parseInstrumentType(symbol) ⇒ <code>Object</code> \| <code>null</code> :id=SymbolParserparseInstrumentType
Returns a simple instrument definition with the terms that can be
gleaned from a symbol. If no specifics can be determined from the
symbol, a null value is returned.

**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

### SymbolParser.getProducerSymbol(symbol) ⇒ <code>String</code> \| <code>null</code> :id=SymbolParsergetProducerSymbol
Translates a symbol into a form suitable for use with JERQ (i.e. the quote "producer").

**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

### SymbolParser.getFuturesOptionPipelineFormat(symbol) ⇒ <code>String</code> \| <code>null</code> :id=SymbolParsergetFuturesOptionPipelineFormat
Attempts to convert database format of futures options to pipeline format
(e.g. ZLF320Q -> ZLF9|320C)

**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

### SymbolParser.getIsConcrete(symbol) ⇒ <code>Boolean</code> :id=SymbolParsergetIsConcrete
Returns true if the symbol is not an alias to another symbol; otherwise
false.

**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

### SymbolParser.getIsReference(symbol) ⇒ <code>Boolean</code> :id=SymbolParsergetIsReference
Returns true if the symbol is an alias for another symbol; false otherwise.

**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

### SymbolParser.getIsFuture(symbol) ⇒ <code>Boolean</code> :id=SymbolParsergetIsFuture
Returns true if the symbol represents futures contract; false otherwise.

**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

### SymbolParser.getIsFutureSpread(symbol) ⇒ <code>Boolean</code> :id=SymbolParsergetIsFutureSpread
Returns true if the symbol represents futures spread; false otherwise.

**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

### SymbolParser.getIsFutureOption(symbol) ⇒ <code>Boolean</code> :id=SymbolParsergetIsFutureOption
Returns true if the symbol represents an option on a futures contract; false
otherwise.

**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

### SymbolParser.getIsForex(symbol) ⇒ <code>Boolean</code> :id=SymbolParsergetIsForex
Returns true if the symbol represents a foreign exchange currency pair;
false otherwise.

**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

### SymbolParser.getIsIndex(symbol) ⇒ <code>Boolean</code> :id=SymbolParsergetIsIndex
Returns true if the symbol represents an external index (e.g. Dow Jones
Industrials); false otherwise.

**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

### SymbolParser.getIsSector(symbol) ⇒ <code>Boolean</code> :id=SymbolParsergetIsSector
Returns true if the symbol represents an internally-calculated sector
index; false otherwise.

**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

### SymbolParser.getIsCmdty(symbol) ⇒ <code>Boolean</code> :id=SymbolParsergetIsCmdty
Returns true if the symbol represents an internally-calculated, cmdty-branded
index; false otherwise.

**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

### SymbolParser.getIsBats(symbol) ⇒ <code>Boolean</code> :id=SymbolParsergetIsBats
Returns true if the symbol is listed on the BATS exchange; false otherwise.

**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

### SymbolParser.getIsExpired(symbol) ⇒ <code>Boolean</code> :id=SymbolParsergetIsExpired
Returns true if the symbol has an expiration and the symbol appears
to be expired (e.g. a future for a past year).

**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

### SymbolParser.displayUsingPercent(symbol) ⇒ <code>Boolean</code> :id=SymbolParserdisplayUsingPercent
Returns true if prices for the symbol should be represented as a percentage; false
otherwise.

**Kind**: static method of [<code>SymbolParser</code>](#SymbolParser)  
**Access**: public  

| Param | Type |
| --- | --- |
| symbol | <code>String</code> | 

## Subscription : <code>object</code> :id=Subscription
**Kind**: global namespace  


### Subscription.EventType : <code>enum</code> :id=Subscriptioneventtype
A data feed type. See [on](#ConnectionBaseon).

**Kind**: static enum of [<code>Subscription</code>](#Subscription)  
**Access**: public  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| MarketDepth | <code>string</code> | <code>&quot;marketDepth&quot;</code> | a subscription to [Book](#Book) changes |
| MarketUpdate | <code>string</code> | <code>&quot;marketUpdate&quot;</code> | a subscription to [Quote](#Quote) changes |
| CumulativeVolume | <code>string</code> | <code>&quot;cumulativeVolume&quot;</code> | a subscription to [CumulativeVolume](#CumulativeVolume) changes |
| Timestamp | <code>string</code> | <code>&quot;timestamp&quot;</code> | a subscription to the server's timestamp beacon |
| Events | <code>string</code> | <code>&quot;events&quot;</code> | a subscription to system events (debugging only) |

## getTimezones() ⇒ <code>Array.&lt;String&gt;</code>
Gets a list of names in the tz database (see https://en.wikipedia.org/wiki/Tz_database
and https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

**Kind**: global function  
**Access**: public  

## guessTimezone() ⇒ <code>String</code> \| <code>null</code>
Attempts to guess the local timezone.

**Kind**: global function  
**Access**: public  

## ExchangeMetadata : <code>Object</code>
Exchange metadata

**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| id | <code>String</code> | 
| description | <code>String</code> | 
| timezoneExchange | <code>String</code> | 
| timezoneDdf | <code>String</code> | 

## ProfileExtension : <code>Object</code>
Extended profile information.

**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| symbol | <code>String</code> | 
| [expiration] | <code>String</code> | 
| [firstNotice] | <code>String</code> | 

## Book : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| symbol | <code>string</code> | 
| bids | <code>Array.&lt;Object&gt;</code> | 
| asks | <code>Array.&lt;Object&gt;</code> | 

## ~PriceLevel : <code>Object</code>
**Kind**: inner typedef  
**Properties**

| Name | Type |
| --- | --- |
| price | <code>number</code> | 
| volume | <code>number</code> | 
