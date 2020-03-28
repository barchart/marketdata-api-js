## Contents {docsify-ignore}

* [WebSocketAdapter](#WebSocketAdapter) 

* [WebSocketAdapterFactory](#WebSocketAdapterFactory) 

* [WebSocketAdapterFactoryForBrowsers](#WebSocketAdapterFactoryForBrowsers) 

* [WebSocketAdapterFactoryForNode](#WebSocketAdapterFactoryForNode) 

## WebSocketAdapter :id=websocketadapter
**Kind**: global abstract class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/adapter/WebSocketAdapter  
**File**: /lib/connection/adapter/WebSocketAdapter.js  
>The abstract definition for an object which can establish and
communicate over a WebSocket. It is unlikely that SDK consumers
will need to implement this class.


* * *

## WebSocketAdapterFactory :id=websocketadapterfactory
**Kind**: global abstract class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/adapter/WebSocketAdapterFactory  
**File**: /lib/connection/adapter/WebSocketAdapterFactory.js  
>An abstract definition for an factory that builds [WebSocketAdapter](/content/sdk/lib-connection-adapter?id=websocketadapter)
instances. It is unlikely that SDK consumers will need to implement this class.


* * *

### webSocketAdapterFactory.build(host) :id=websocketadapterfactorybuild
**Kind**: instance abstract method of [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)  
**Returns**: [<code>WebSocketAdapter</code>](#WebSocketAdapter)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/adapter/WebSocketAdapterFactory  
**File**: /lib/connection/adapter/WebSocketAdapterFactory.js  

| Param | Type |
| --- | --- |
| host | <code>String</code> | 

>Returns a new [WebSocketAdapter](/content/sdk/lib-connection-adapter?id=websocketadapter) instance.


* * *

## WebSocketAdapterFactoryForBrowsers :id=websocketadapterfactoryforbrowsers
**Kind**: global class  
**Extends**: [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/adapter/WebSocketAdapterFactoryForBrowsers  
**File**: /lib/connection/adapter/WebSocketAdapterFactoryForBrowsers.js  
>An implementation of [WebSocketAdapterFactory](/content/sdk/lib-connection-adapter?id=websocketadapterfactory) for use with web browsers. By default,
this strategy is used by the [Connection](/content/sdk/lib-connection?id=connection) class.


* * *

### webSocketAdapterFactoryForBrowsers.build(host) :id=websocketadapterfactoryforbrowsersbuild
**Kind**: instance method of [<code>WebSocketAdapterFactoryForBrowsers</code>](#WebSocketAdapterFactoryForBrowsers)  
**Overrides**: [<code>build</code>](#WebSocketAdapterFactorybuild)  
**Returns**: [<code>WebSocketAdapter</code>](#WebSocketAdapter)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/adapter/WebSocketAdapterFactoryForBrowsers  
**File**: /lib/connection/adapter/WebSocketAdapterFactoryForBrowsers.js  

| Param | Type |
| --- | --- |
| host | <code>String</code> | 

>Returns a new [WebSocketAdapter](/content/sdk/lib-connection-adapter?id=websocketadapter) instance suitable for use
with a web browser.


* * *

## WebSocketAdapterFactoryForNode :id=websocketadapterfactoryfornode
**Kind**: global class  
**Extends**: [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/adapter/WebSocketAdapterFactoryForNode  
**File**: /lib/connection/adapter/WebSocketAdapterFactoryForNode.js  
>An implementation of [WebSocketAdapterFactory](/content/sdk/lib-connection-adapter?id=websocketadapterfactory) for use by Node.js servers. Pass
an instance of this class to [Connection.connect](Connection.connect) when operating in a Node.js
environment.


* * *

### webSocketAdapterFactoryForNode.build(host) :id=websocketadapterfactoryfornodebuild
**Kind**: instance method of [<code>WebSocketAdapterFactoryForNode</code>](#WebSocketAdapterFactoryForNode)  
**Overrides**: [<code>build</code>](#WebSocketAdapterFactorybuild)  
**Returns**: [<code>WebSocketAdapter</code>](#WebSocketAdapter)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/adapter/WebSocketAdapterFactoryForNode  
**File**: /lib/connection/adapter/WebSocketAdapterFactoryForNode.js  

| Param | Type |
| --- | --- |
| host | <code>String</code> | 

>Returns a new [WebSocketAdapter](/content/sdk/lib-connection-adapter?id=websocketadapter) instance suitable for use
within a Node.js environment.


* * *

