## Classes

### [WebSocketAdapterFactory](#WebSocketAdapterFactory) :id=WebSocketAdapterFactoryDesc
An interface for creating WebSocket [WebSocketAdapter](WebSocketAdapter) instances.

### [WebSocketAdapterFactoryForBrowsers](#WebSocketAdapterFactoryForBrowsers) :id=WebSocketAdapterFactoryForBrowsersDesc
An implementation of [WebSocketAdapterFactory](#WebSocketAdapterFactory) for use with web browsers.

### [WebSocketAdapterFactoryForNode](#WebSocketAdapterFactoryForNode) :id=WebSocketAdapterFactoryForNodeDesc
An implementation of [WebSocketAdapterFactory](#WebSocketAdapterFactory) for use by Node.js servers.

## WebSocketAdapterFactory :id=websocketadapterfactory
An interface for creating WebSocket [WebSocketAdapter](WebSocketAdapter) instances.

**Kind**: global class  
**Access**: public  
### webSocketAdapterFactory.build(host) ⇒ <code>null</code> :id=websocketadapterfactorybuild
Returns a new [WebSocketAdapter](WebSocketAdapter) instance.

**Kind**: instance method of [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)  
**Access**: public  

| Param | Type |
| --- | --- |
| host | <code>String</code> | 

## WebSocketAdapterFactoryForBrowsers ⇐ [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory) :id=websocketadapterfactoryforbrowsers
An implementation of [WebSocketAdapterFactory](#WebSocketAdapterFactory) for use with web browsers.

**Kind**: global class  
**Extends**: [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)  
**Access**: public  
### webSocketAdapterFactoryForBrowsers.build(host) ⇒ <code>null</code> :id=websocketadapterfactoryforbrowsersbuild
Returns a new [WebSocketAdapter](WebSocketAdapter) instance.

**Kind**: instance method of [<code>WebSocketAdapterFactoryForBrowsers</code>](#WebSocketAdapterFactoryForBrowsers)  
**Overrides**: [<code>build</code>](#WebSocketAdapterFactorybuild)  
**Access**: public  

| Param | Type |
| --- | --- |
| host | <code>String</code> | 

## WebSocketAdapterFactoryForNode ⇐ [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory) :id=websocketadapterfactoryfornode
An implementation of [WebSocketAdapterFactory](#WebSocketAdapterFactory) for use by Node.js servers.

**Kind**: global class  
**Extends**: [<code>WebSocketAdapterFactory</code>](#WebSocketAdapterFactory)  
**Access**: public  
### webSocketAdapterFactoryForNode.build(host) ⇒ <code>null</code> :id=websocketadapterfactoryfornodebuild
Returns a new [WebSocketAdapter](WebSocketAdapter) instance.

**Kind**: instance method of [<code>WebSocketAdapterFactoryForNode</code>](#WebSocketAdapterFactoryForNode)  
**Overrides**: [<code>build</code>](#WebSocketAdapterFactorybuild)  
**Access**: public  

| Param | Type |
| --- | --- |
| host | <code>String</code> | 

