## Contents {docsify-ignore}

* [Logger](#Logger) 

* [LoggerFactory](#LoggerFactory) 

* [LoggerProvider](#LoggerProvider) 

* [Schema](#Schema) 

## Logger :id=logger
**Kind**: global abstract class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/logging/Logger  
**File**: ./lib/logging/Logger.js  
>An interface for writing log messages. An implementation of this
class is returned by [LoggerProvider.getLogger](LoggerProvider.getLogger).


* *[Logger](#Logger)*
    * **[.log()](#Loggerlog)**
    * **[.trace()](#Loggertrace)**
    * **[.debug()](#Loggerdebug)**
    * **[.info()](#Loggerinfo)**
    * **[.warn()](#Loggerwarn)**
    * **[.error()](#Loggererror)**


* * *

### logger.log() :id=loggerlog
**Kind**: instance abstract method of [<code>Logger</code>](#Logger)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/logging/Logger  
**File**: ./lib/logging/Logger.js  

| Param | Type |
| --- | --- |
| ... | [<code>Loggable</code>](#SchemaLoggable) | 

>Writes a log message.


* * *

### logger.trace() :id=loggertrace
**Kind**: instance abstract method of [<code>Logger</code>](#Logger)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/logging/Logger  
**File**: ./lib/logging/Logger.js  

| Param | Type |
| --- | --- |
| ... | [<code>Loggable</code>](#SchemaLoggable) | 

>Writes a log message at "trace" level.


* * *

### logger.debug() :id=loggerdebug
**Kind**: instance abstract method of [<code>Logger</code>](#Logger)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/logging/Logger  
**File**: ./lib/logging/Logger.js  

| Param | Type |
| --- | --- |
| ... | [<code>Loggable</code>](#SchemaLoggable) | 

>Writes a log message at "debug" level.


* * *

### logger.info() :id=loggerinfo
**Kind**: instance abstract method of [<code>Logger</code>](#Logger)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/logging/Logger  
**File**: ./lib/logging/Logger.js  

| Param | Type |
| --- | --- |
| ... | [<code>Loggable</code>](#SchemaLoggable) | 

>Writes a log message at "info" level.


* * *

### logger.warn() :id=loggerwarn
**Kind**: instance abstract method of [<code>Logger</code>](#Logger)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/logging/Logger  
**File**: ./lib/logging/Logger.js  

| Param | Type |
| --- | --- |
| ... | [<code>Loggable</code>](#SchemaLoggable) | 

>Writes a log message at "warn" level.


* * *

### logger.error() :id=loggererror
**Kind**: instance abstract method of [<code>Logger</code>](#Logger)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/logging/Logger  
**File**: ./lib/logging/Logger.js  

| Param | Type |
| --- | --- |
| ... | [<code>Loggable</code>](#SchemaLoggable) | 

>Writes a log message at "error" level.


* * *

## LoggerFactory :id=loggerfactory
**Kind**: global class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/logging/LoggerFactory  
**File**: ./lib/logging/LoggerFactory.js  
>Container for static functions which control logging within the SDK.


* [LoggerFactory](#LoggerFactory)
    * [.configureForConsole()](#LoggerFactoryconfigureForConsole)
    * [.configureForSilence()](#LoggerFactoryconfigureForSilence)
    * [.configure(provider)](#LoggerFactoryconfigure)
    * [.getLogger(category)](#LoggerFactorygetLogger) ⇒ [<code>Logger</code>](#Logger)


* * *

### LoggerFactory.configureForConsole() :id=loggerfactoryconfigureforconsole
**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/logging/LoggerFactory  
**File**: ./lib/logging/LoggerFactory.js  
>Configures the SDK to write log messages to the console.


* * *

### LoggerFactory.configureForSilence() :id=loggerfactoryconfigureforsilence
**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/logging/LoggerFactory  
**File**: ./lib/logging/LoggerFactory.js  
>Configures the SDK to mute all log messages.


* * *

### LoggerFactory.configure(provider) :id=loggerfactoryconfigure
**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/logging/LoggerFactory  
**File**: ./lib/logging/LoggerFactory.js  

| Param | Type |
| --- | --- |
| provider | [<code>LoggerProvider</code>](#LoggerProvider) | 

>Configures the library to delegate any log messages to a custom
implementation of the [LoggerProvider](/content/sdk/logging?id=loggerprovider) class.


* * *

### LoggerFactory.getLogger(category) :id=loggerfactorygetlogger
**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Returns**: [<code>Logger</code>](#Logger)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/logging/LoggerFactory  
**File**: ./lib/logging/LoggerFactory.js  

| Param | Type |
| --- | --- |
| category | <code>String</code> | 

>Returns an instance of [Logger](/content/sdk/logging?id=logger) for a specific category.


* * *

## LoggerProvider :id=loggerprovider
**Kind**: global abstract class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/logging/LoggerProvider  
**File**: ./lib/logging/LoggerProvider.js  
>A contract for generating [Logger](/content/sdk/logging?id=logger) instances. For custom logging
the SDK consumer should implement this class and pass it to the
[configure](#LoggerFactoryconfigure) function.


* * *

### loggerProvider.getLogger(category) :id=loggerprovidergetlogger
**Kind**: instance method of [<code>LoggerProvider</code>](#LoggerProvider)  
**Returns**: [<code>Logger</code>](#Logger)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/logging/LoggerProvider  
**File**: ./lib/logging/LoggerProvider.js  

| Param | Type |
| --- | --- |
| category | <code>String</code> | 

>Returns an instance of [Logger](/content/sdk/logging?id=logger).


* * *

## Schema :id=schema
**Kind**: global namespace  
**Import**: @barchart/marketdata-api-js/lib/logging/meta  
**File**: ./lib/logging/meta.js  
>A meta namespace containing structural contracts of anonymous objects.


* * *

### Schema.Loggable :id=schemaloggable
**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/logging/meta  
**File**: ./lib/logging/meta.js  
>Something which can be logged (e.g. ```String```, ```Number```, or ```Object```). Ultimately,
the [Logger](/content/sdk/logging?id=logger) implementation will determine the method (e.g. using ```JSON.stringify``` or
```toString```).


* * *

