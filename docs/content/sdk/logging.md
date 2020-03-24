## Classes

* [LoggerFactory](#LoggerFactory) 
* [LoggerProvider](#LoggerProvider) 
## LoggerFactory :id=loggerfactory
**Kind**: global class  
**Access**: public  
>Static utilities for interacting with the log system.


* [LoggerFactory](#LoggerFactory)
    * [.configureForConsole()](#LoggerFactory.configureForConsole)
    * [.configureForSilence()](#LoggerFactory.configureForSilence)
    * [.configure(provider)](#LoggerFactory.configure)
    * [.getLogger(category)](#LoggerFactory.getLogger) ⇒ <code>Logger</code>

### LoggerFactory.configureForConsole() :id=loggerfactoryconfigureforconsole
**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  
>Configures the library to write log messages to the console.

### LoggerFactory.configureForSilence() :id=loggerfactoryconfigureforsilence
**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  
>Configures the library to mute all log messages.

### LoggerFactory.configure(provider) :id=loggerfactoryconfigure
**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  

| Param | Type |
| --- | --- |
| provider | [<code>LoggerProvider</code>](#LoggerProvider) | 

>Configures the library to delegate any log messages to a custom
implementation of the [LoggerProvider](#LoggerProvider) interface.

### LoggerFactory.getLogger(category) :id=loggerfactorygetlogger
**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  

| Param | Type |
| --- | --- |
| category | <code>String</code> | 

>Returns an instance of [Logger](Logger) for a specific category.

## LoggerProvider :id=loggerprovider
**Kind**: global class  
**Access**: public  
>An interface for generating [Logger](Logger) instances.

### loggerProvider.getLogger(category) :id=loggerprovidergetlogger
**Kind**: instance method of [<code>LoggerProvider</code>](#LoggerProvider)  
**Access**: public  

| Param | Type |
| --- | --- |
| category | <code>String</code> | 

>Returns an instance of [Logger](Logger).

