## Contents {docsify-ignore}

* [WebSocketAdapter](#WebSocketAdapter) 

* [WebSocketAdapterFactory](#WebSocketAdapterFactory) 

* [WebSocketAdapterFactoryForBrowsers](#WebSocketAdapterFactoryForBrowsers) 

* [WebSocketAdapterFactoryForNode](#WebSocketAdapterFactoryForNode) 

## WebSocketAdapter :id=websocketadapter
**Kind**: global class  
**Access**: public  
 **Import**: @barchart/marketdata-api-js/lib/connection/adapter/WebSocketAdapter  
>An interface for establishing and interacting with a WebSocket connection.


* * *

## WebSocketAdapterFactory :id=websocketadapterfactory
**Kind**: global class  
**Access**: public  
 **Import**: @barchart/marketdata-api-js/lib/connection/adapter/WebSocketAdapterFactory  
>An interface for creating WebSocket [WebSocketAdapter](/content/sdk/connection-adapter?id=websocketadapter) instances.


* * *

### webSocketAdapterFactory.build(host) :id=websocketadapterfactorybuild
**Kind**: instance method of [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)  
**Returns**: <code>null</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| host | <code>String</code> | 

>Returns a new [WebSocketAdapter](/content/sdk/connection-adapter?id=websocketadapter) instance.


* * *

## WebSocketAdapterFactoryForBrowsers :id=websocketadapterfactoryforbrowsers
**Kind**: global class  
**Extends**: [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)  
**Access**: public  
 **Import**: @barchart/marketdata-api-js/lib/connection/adapter/WebSocketAdapterFactoryForBrowsers  
>An implementation of [WebSocketAdapterFactory](/content/sdk/connection-adapter?id=websocketadapterfactory) for use with web browsers.


* * *

### webSocketAdapterFactoryForBrowsers.build(host) :id=websocketadapterfactoryforbrowsersbuild
**Kind**: instance method of [<code>WebSocketAdapterFactoryForBrowsers</code>](#WebSocketAdapterFactoryForBrowsers)  
**Overrides**: [<code>build</code>](#WebSocketAdapterFactorybuild)  
**Returns**: <code>null</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| host | <code>String</code> | 

>Returns a new [WebSocketAdapter](/content/sdk/connection-adapter?id=websocketadapter) instance.


* * *

## WebSocketAdapterFactoryForNode :id=websocketadapterfactoryfornode
**Kind**: global class  
**Extends**: [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)  
**Access**: public  
 **Import**: @barchart/marketdata-api-js/lib/connection/adapter/WebSocketAdapterFactoryForNode  
>An implementation of [WebSocketAdapterFactory](/content/sdk/connection-adapter?id=websocketadapterfactory) for use by Node.js servers.


* * *

### webSocketAdapterFactoryForNode.build(host) :id=websocketadapterfactoryfornodebuild
**Kind**: instance method of [<code>WebSocketAdapterFactoryForNode</code>](#WebSocketAdapterFactoryForNode)  
**Overrides**: [<code>build</code>](#WebSocketAdapterFactorybuild)  
**Returns**: <code>null</code>  
**Access**: public  

| Param | Type |
| --- | --- |
| host | <code>String</code> | 

>Returns a new [WebSocketAdapter](/content/sdk/connection-adapter?id=websocketadapter) instance.


* * *

