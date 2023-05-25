## Contents {docsify-ignore}

* [Logger](#Logger) 

* [LoggerFactory](#LoggerFactory) 

* [LoggerProvider](#LoggerProvider) 

* [Schema](#Schema) 


* * *

## Logger :id=logger
> An interface for writing log messages. An implementation of this
> class is returned by [LoggerProvider.getLogger](#loggerprovidergetlogger).

**Kind**: global abstract class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/logging/Logger  
**File**: /lib/logging/Logger.js  

* *[Logger](#Logger)*
    * _instance_
        * **[.log()](#Loggerlog)**
        * **[.trace()](#Loggertrace)**
        * **[.debug()](#Loggerdebug)**
        * **[.info()](#Loggerinfo)**
        * **[.warn()](#Loggerwarn)**
        * **[.error()](#Loggererror)**


* * *

### logger.log() :id=loggerlog
> Writes a log message.

**Kind**: instance abstract method of [<code>Logger</code>](#Logger)  
**Access**: public  

| Param | Type |
| --- | --- |
| ... | [<code>Loggable</code>](#SchemaLoggable) | 


* * *

### logger.trace() :id=loggertrace
> Writes a log message at &quot;trace&quot; level.

**Kind**: instance abstract method of [<code>Logger</code>](#Logger)  
**Access**: public  

| Param | Type |
| --- | --- |
| ... | [<code>Loggable</code>](#SchemaLoggable) | 


* * *

### logger.debug() :id=loggerdebug
> Writes a log message at &quot;debug&quot; level.

**Kind**: instance abstract method of [<code>Logger</code>](#Logger)  
**Access**: public  

| Param | Type |
| --- | --- |
| ... | [<code>Loggable</code>](#SchemaLoggable) | 


* * *

### logger.info() :id=loggerinfo
> Writes a log message at &quot;info&quot; level.

**Kind**: instance abstract method of [<code>Logger</code>](#Logger)  
**Access**: public  

| Param | Type |
| --- | --- |
| ... | [<code>Loggable</code>](#SchemaLoggable) | 


* * *

### logger.warn() :id=loggerwarn
> Writes a log message at &quot;warn&quot; level.

**Kind**: instance abstract method of [<code>Logger</code>](#Logger)  
**Access**: public  

| Param | Type |
| --- | --- |
| ... | [<code>Loggable</code>](#SchemaLoggable) | 


* * *

### logger.error() :id=loggererror
> Writes a log message at &quot;error&quot; level.

**Kind**: instance abstract method of [<code>Logger</code>](#Logger)  
**Access**: public  

| Param | Type |
| --- | --- |
| ... | [<code>Loggable</code>](#SchemaLoggable) | 


* * *

## LoggerFactory :id=loggerfactory
> Container for static functions which control logging within the SDK.

**Kind**: global class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/logging/LoggerFactory  
**File**: /lib/logging/LoggerFactory.js  

* [LoggerFactory](#LoggerFactory)
    * _static_
        * [.configureForConsole()](#LoggerFactoryconfigureForConsole)
        * [.configureForSilence()](#LoggerFactoryconfigureForSilence)
        * [.configure(provider)](#LoggerFactoryconfigure)
        * [.getLogger(category)](#LoggerFactorygetLogger) ⇒ [<code>Logger</code>](#Logger)


* * *

### LoggerFactory.configureForConsole() :id=loggerfactoryconfigureforconsole
> Configures the SDK to write log messages to the console.

**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  

* * *

### LoggerFactory.configureForSilence() :id=loggerfactoryconfigureforsilence
> Configures the SDK to mute all log messages.

**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  

* * *

### LoggerFactory.configure(provider) :id=loggerfactoryconfigure
> Configures the library to delegate any log messages to a custom
> implementation of the [LoggerProvider](/content/sdk/lib-logging?id=loggerprovider) class.

**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  

| Param | Type |
| --- | --- |
| provider | [<code>LoggerProvider</code>](#LoggerProvider) | 


* * *

### LoggerFactory.getLogger(category) :id=loggerfactorygetlogger
> Returns an instance of [Logger](/content/sdk/lib-logging?id=logger) for a specific category.

**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Returns**: [<code>Logger</code>](#Logger)  
**Access**: public  

| Param | Type |
| --- | --- |
| category | <code>String</code> | 


* * *

## LoggerProvider :id=loggerprovider
> A contract for generating [Logger](/content/sdk/lib-logging?id=logger) instances. For custom logging
> the SDK consumer should implement this class and pass it to the
> [configure](#loggerfactoryconfigure) function.

**Kind**: global abstract class  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/logging/LoggerProvider  
**File**: /lib/logging/LoggerProvider.js  

* * *

### loggerProvider.getLogger(category) :id=loggerprovidergetlogger
> Returns an instance of [Logger](/content/sdk/lib-logging?id=logger).

**Kind**: instance method of [<code>LoggerProvider</code>](#LoggerProvider)  
**Returns**: [<code>Logger</code>](#Logger)  
**Access**: public  

| Param | Type |
| --- | --- |
| category | <code>String</code> | 


* * *

## Schema :id=schema
> A meta namespace containing structural contracts of anonymous objects.

**Kind**: global namespace  

* * *

### Schema.Loggable :id=schemaloggable
> Something which can be logged (e.g. <code>String</code>, <code>Number</code>, or <code>Object</code>). Ultimately,
> the [Logger](/content/sdk/lib-logging?id=logger) implementation will determine the method (e.g. using <code>JSON.stringify</code> or
> <code>toString</code>).

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Access**: public  

* * *

