/**
 * A meta namespace containing structural contracts of anonymous objects.
 *
 * @namespace Schema
 */

/**
 * Something which can be logged (e.g. ```String```, ```Number```, or ```Object```). Ultimately,
 * the {@link Logger} implementation will determine the method (e.g. using ```JSON.stringify``` or
 * ```toString```).
 *
 * @typedef {(string|number|object)} Loggable
 * @public
 * @memberOf Schema
 */