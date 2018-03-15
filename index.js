'use strict';

/**
 * Creates a function wrapper for a logger function.
 * @param {Object} logger - Logger object. E.g. winston.
 * @param {String} funcName - Function name. E.g. 'warn'.
 * @param {String} prefix - Prefix to add.
 * @return {Function} - A new function which logs with given prefix.
 */
exports.addPrefixToLogFunc = function (logger, funcName, prefix) {
  return function () {
    const prefixArgIndex = funcName === 'log' ? 1 : 0;
    arguments[prefixArgIndex] = prefix + arguments[prefixArgIndex];
    return logger[funcName].apply(logger, arguments);
  };
};

/**
 * Creates a new logger object for which given log functions have a specified prefix to log messages.
 *
 * @param {Object} logger - Logger object. E.g. winston.
 * @param {String[]} funcNames - Array of function names, e.g. ['info', 'warn']
 * @param {String} prefix - Prefix to add.
 */
exports.addPrefixToLogFuncs = function (logger, funcNames, prefix) {
  const newLogger = {};
  funcNames.forEach((funcName) => {
    if (typeof logger[funcName] === 'function') {
      newLogger[funcName] = exports.addPrefixToLogFunc(logger, funcName, prefix);
    }
  });
  return newLogger;
};

/**
 * Creates an alternative logger object for which all commonly used log functions
 * add a given prefix to log strings.
 * @param {Object} logger - Logger object. E.g. winston.
 * @param {String} prefix - Prefix to add.
 */
exports.addPrefixToCommonLogFuncs = function (logger, prefix) {
  return exports.addPrefixToLogFuncs(
    logger,
    ['error', 'warn', 'info', 'verbose', 'debug', 'silly', 'log'],
    prefix
  );
};
