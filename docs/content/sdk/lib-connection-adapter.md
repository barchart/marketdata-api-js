## Contents {docsify-ignore}

* [WebSocketAdapter](#WebSocketAdapter) 

* [WebSocketAdapterFactory](#WebSocketAdapterFactory) 

* [WebSocketAdapterFactoryForBrowsers](#WebSocketAdapterFactoryForBrowsers) 

* [WebSocketAdapterFactoryForNode](#WebSocketAdapterFactoryForNode) 


* * *

## WebSocketAdapter :id=websocketadapter
> The abstract definition for an object which can establish and
> communicate over a WebSocket. It is unlikely that SDK consumers
> will need to implement this class.

**Kind**: global abstract class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/adapter/WebSocketAdapter  
**File**: /lib/connection/adapter/WebSocketAdapter.js  

* * *

## WebSocketAdapterFactory :id=websocketadapterfactory
> An abstract definition for an factory that builds [WebSocketAdapter](/content/sdk/lib-connection-adapter?id=websocketadapter)
> instances. It is unlikely that SDK consumers will need to implement this class.

**Kind**: global abstract class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/adapter/WebSocketAdapterFactory  
**File**: /lib/connection/adapter/WebSocketAdapterFactory.js  

* * *

### webSocketAdapterFactory.build(host) :id=websocketadapterfactorybuild
> Returns a new [WebSocketAdapter](/content/sdk/lib-connection-adapter?id=websocketadapter) instance.

**Kind**: instance abstract method of [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)  
**Returns**: [<code>WebSocketAdapter</code>](#WebSocketAdapter)  
**Access**: public  

| Param | Type |
| --- | --- |
| host | <code>String</code> | 


* * *

## WebSocketAdapterFactoryForBrowsers :id=websocketadapterfactoryforbrowsers
> An implementation of [WebSocketAdapterFactory](/content/sdk/lib-connection-adapter?id=websocketadapterfactory) for use with web browsers. By default,
> this strategy is used by the [Connection](/content/sdk/lib-connection?id=connection) class.

**Kind**: global class  
**Extends**: [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/adapter/WebSocketAdapterFactoryForBrowsers  
**File**: /lib/connection/adapter/WebSocketAdapterFactoryForBrowsers.js  

* * *

### webSocketAdapterFactoryForBrowsers.build(host) :id=websocketadapterfactoryforbrowsersbuild
> Returns a new [WebSocketAdapter](/content/sdk/lib-connection-adapter?id=websocketadapter) instance suitable for use
> with a web browser.

**Kind**: instance method of [<code>WebSocketAdapterFactoryForBrowsers</code>](#WebSocketAdapterFactoryForBrowsers)  
**Overrides**: [<code>build</code>](#WebSocketAdapterFactorybuild)  
**Returns**: [<code>WebSocketAdapter</code>](#WebSocketAdapter)  
**Access**: public  

| Param | Type |
| --- | --- |
| host | <code>String</code> | 


* * *

## WebSocketAdapterFactoryForNode :id=websocketadapterfactoryfornode
> An implementation of [WebSocketAdapterFactory](/content/sdk/lib-connection-adapter?id=websocketadapterfactory) for use by Node.js servers. Pass
> an instance of this class to [Connection.connect](#connectionconnect) when operating in a Node.js
> environment.

**Kind**: global class  
**Extends**: [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/adapter/WebSocketAdapterFactoryForNode  
**File**: /lib/connection/adapter/WebSocketAdapterFactoryForNode.js  

* * *

### webSocketAdapterFactoryForNode.build(host) :id=websocketadapterfactoryfornodebuild
> Returns a new [WebSocketAdapter](/content/sdk/lib-connection-adapter?id=websocketadapter) instance suitable for use
> within a Node.js environment.

**Kind**: instance method of [<code>WebSocketAdapterFactoryForNode</code>](#WebSocketAdapterFactoryForNode)  
**Overrides**: [<code>build</code>](#WebSocketAdapterFactorybuild)  
**Returns**: [<code>WebSocketAdapter</code>](#WebSocketAdapter)  
**Access**: public  

| Param | Type |
| --- | --- |
| host | <code>String</code> | 


* * *

