## Contents {docsify-ignore}

* [Environment](#Environment) 

* [EnvironmentForBrowsers](#EnvironmentForBrowsers) 

* [EnvironmentForNode](#EnvironmentForNode) 


* * *

## Environment :id=environment
> A container of operational strategies for used internally by the
> SDK (e.g. XML parsing, WebSocket connections, and HTTP requests).</p>
> <p>The primary purpose of this container is to provide different
> strategies when in running different environments (e.g. web browser
> or Node.js).

**Kind**: global class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/environment/Environment  
**File**: /lib/environment/Environment.js  

* * *

### new Environment(webSocketAdapterFactory, xmlParserFactory) :id=new_environment_new
**Kind**: constructor of [<code>Environment</code>](#Environment)  

| Param | Type |
| --- | --- |
| webSocketAdapterFactory | [<code>WebSocketAdapterFactory</code>](/content/sdk/lib-connection-adapter?id=websocketadapterfactory) | 
| xmlParserFactory | [<code>XmlParserFactory</code>](/content/sdk/lib-utilities-xml?id=xmlparserfactory) | 


* * *

## EnvironmentForBrowsers :id=environmentforbrowsers
> A container for strategies used in a web browser environment. These
> strategies include WebSocket connections and XML parsing using the
> browser's built-in capabilities.

**Kind**: global class  
**Extends**: [<code>Environment</code>](#Environment)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/environment/EnvironmentForBrowsers  
**File**: /lib/environment/EnvironmentForBrowsers.js  

* * *

## EnvironmentForNode :id=environmentfornode
> A container for strategies used when running in a Node.js environment.
> These strategies use third-party libraries for WebSocket connections
> and XML parsing (which are not included natively in Node.js).

**Kind**: global class  
**Extends**: [<code>Environment</code>](#Environment)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/environment/EnvironmentForNode  
**File**: /lib/environment/EnvironmentForNode.js  

* * *

