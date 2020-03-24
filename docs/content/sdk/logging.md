## Classes

### [LoggerFactory](#LoggerFactory) :id=LoggerFactoryDesc
Static utilities for interacting with the log system.

### [LoggerProvider](#LoggerProvider) :id=LoggerProviderDesc
An interface for generating [Logger](Logger) instances.

## LoggerFactory :id=loggerfactory
Static utilities for interacting with the log system.

**Kind**: global class  
**Access**: public  

* [LoggerFactory](#LoggerFactory)
    * [.configureForConsole()](#LoggerFactoryconfigureForConsole)
    * [.configureForSilence()](#LoggerFactoryconfigureForSilence)
    * [.configure(provider)](#LoggerFactoryconfigure)
    * [.getLogger(category)](#LoggerFactorygetLogger) ⇒ <code>Logger</code>

### LoggerFactory.configureForConsole() :id=loggerfactoryconfigureforconsole
Configures the library to write log messages to the console.

**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  
### LoggerFactory.configureForSilence() :id=loggerfactoryconfigureforsilence
Configures the library to mute all log messages.

**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  
### LoggerFactory.configure(provider) :id=loggerfactoryconfigure
Configures the library to delegate any log messages to a custom
implementation of the [LoggerProvider](#LoggerProvider) interface.

**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  

| Param | Type |
| --- | --- |
| provider | [<code>LoggerProvider</code>](#LoggerProvider) | 

### LoggerFactory.getLogger(category) ⇒ <code>Logger</code> :id=loggerfactorygetlogger
Returns an instance of [Logger](Logger) for a specific category.

**Kind**: static method of [<code>LoggerFactory</code>](#LoggerFactory)  
**Access**: public  

| Param | Type |
| --- | --- |
| category | <code>String</code> | 

## LoggerProvider :id=loggerprovider
An interface for generating [Logger](Logger) instances.

**Kind**: global class  
**Access**: public  
### loggerProvider.getLogger(category) ⇒ <code>Logger</code> :id=loggerprovidergetlogger
Returns an instance of [Logger](Logger).

**Kind**: instance method of [<code>LoggerProvider</code>](#LoggerProvider)  
**Access**: public  

| Param | Type |
| --- | --- |
| category | <code>String</code> | 

