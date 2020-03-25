## Classes

* [Logger](#Logger) 

* [LoggerFactory](#LoggerFactory) 

* [LoggerProvider](#LoggerProvider) 

## Logger :id=logger
**Kind**: global class  
**Access**: public  
>An interface for writing log messages.


* [Logger](#Logger)
    * [.log()](#Logger+log)
    * [.trace()](#Logger+trace)
    * [.debug()](#Logger+debug)
    * [.info()](#Logger+info)
    * [.warn()](#Logger+warn)
    * [.error()](#Logger+error)


* * *

### logger.log() :id=loggerlog
**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Access**: public  
>Writes a log message.


* * *

### logger.trace() :id=loggertrace
**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Access**: public  
>Writes a log message, at "trace" level.


* * *

### logger.debug() :id=loggerdebug
**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Access**: public  
>Writes a log message, at "debug" level.


* * *

### logger.info() :id=loggerinfo
**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Access**: public  
>Writes a log message, at "info" level.


* * *

### logger.warn() :id=loggerwarn
**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Access**: public  
>Writes a log message, at "warn" level.


* * *

### logger.error() :id=loggererror
**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Access**: public  
>Writes a log message, at "error" level.


* * *

## LoggerFactory :id=loggerfactory
**Kind**: global class  
**Access**: public  
>Static utilities for interacting with the log system.


* [LoggerFactory](#LoggerFactory)
    * [.configureForConsole()](#LoggerFactory.configureForConsole)
    * [.configureForSilence()](#LoggerFactory.configureForSilence)
    * [.configure(provider)](#LoggerFactory.configure)
    * [.getLogger(category)](#LoggerFactory.getLogger) ⇒ [<code>Logger</code>](#Logger)


* * *

### LoggerFactory.configureForConsole() :id=loggerfactoryconfigureforconsole
**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  
>Configures the library to write log messages to the console.


* * *

### LoggerFactory.configureForSilence() :id=loggerfactoryconfigureforsilence
**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  
>Configures the library to mute all log messages.


* * *

### LoggerFactory.configure(provider) :id=loggerfactoryconfigure
**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  

| Param | Type |
| --- | --- |
| provider | [<code>LoggerProvider</code>](#LoggerProvider) | 

>Configures the library to delegate any log messages to a custom
implementation of the [LoggerProvider](#LoggerProvider) interface.


* * *

### LoggerFactory.getLogger(category) :id=loggerfactorygetlogger
**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  

| Param | Type |
| --- | --- |
| category | <code>String</code> | 

>Returns an instance of [Logger](#Logger) for a specific category.


* * *

## LoggerProvider :id=loggerprovider
**Kind**: global class  
**Access**: public  
>An interface for generating [Logger](#Logger) instances.


* * *

### loggerProvider.getLogger(category) :id=loggerprovidergetlogger
**Kind**: instance method of [<code>LoggerProvider</code>](#LoggerProvider)  
**Access**: public  

| Param | Type |
| --- | --- |
| category | <code>String</code> | 

>Returns an instance of [Logger](#Logger).


* * *

