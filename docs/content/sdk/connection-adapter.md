## Classes

* [WebSocketAdapterFactory](#WebSocketAdapterFactory) 

* [WebSocketAdapterFactoryForBrowsers](#WebSocketAdapterFactoryForBrowsers) 

* [WebSocketAdapterFactoryForNode](#WebSocketAdapterFactoryForNode) 

## WebSocketAdapterFactory :id=websocketadapterfactory
**Kind**: global class  
**Access**: public  
>An interface for creating WebSocket [WebSocketAdapter](WebSocketAdapter) instances.

### webSocketAdapterFactory.build(host) :id=websocketadapterfactorybuild
**Kind**: instance method of [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)  
**Access**: public  

| Param | Type |
| --- | --- |
| host | <code>String</code> | 

>Returns a new [WebSocketAdapter](WebSocketAdapter) instance.

## WebSocketAdapterFactoryForBrowsers :id=websocketadapterfactoryforbrowsers
**Kind**: global class  
**Extends**: [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)  
**Access**: public  
>An implementation of [WebSocketAdapterFactory](#WebSocketAdapterFactory) for use with web browsers.

### webSocketAdapterFactoryForBrowsers.build(host) :id=websocketadapterfactoryforbrowsersbuild
**Kind**: instance method of [<code>WebSocketAdapterFactoryForBrowsers</code>](#WebSocketAdapterFactoryForBrowsers)  
**Overrides**: [<code>build</code>](#WebSocketAdapterFactory+build)  
**Access**: public  

| Param | Type |
| --- | --- |
| host | <code>String</code> | 

>Returns a new [WebSocketAdapter](WebSocketAdapter) instance.

## WebSocketAdapterFactoryForNode :id=websocketadapterfactoryfornode
**Kind**: global class  
**Extends**: [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)  
**Access**: public  
>An implementation of [WebSocketAdapterFactory](#WebSocketAdapterFactory) for use by Node.js servers.

### webSocketAdapterFactoryForNode.build(host) :id=websocketadapterfactoryfornodebuild
**Kind**: instance method of [<code>WebSocketAdapterFactoryForNode</code>](#WebSocketAdapterFactoryForNode)  
**Overrides**: [<code>build</code>](#WebSocketAdapterFactory+build)  
**Access**: public  

| Param | Type |
| --- | --- |
| host | <code>String</code> | 

>Returns a new [WebSocketAdapter](WebSocketAdapter) instance.

