'use strict';

const callsite = require('callsite');
const fs = require('fs');
var os = require('os');

function getSrcInfo(stack) {
  const call = stack[1];
  const file = call.getFileName();
  const lineno = call.getLineNumber();
  let src = fs.readFileSync(file, 'utf8');
  const line = src.split('\n')[lineno - 1].trim();
  return {
    fileLineNo: `${file}: ${lineno}`,
    line,
  };
}

const token = Symbol();

/**
 * Creates a function wrapper for a logger function.
 * @param {Object} logger - Logger object. E.g. winston.
 * @param {String} funcName - Function name. E.g. 'warn'.
 * @param {String} prefix - Prefix to add.
 * @return {Function} - A new function which logs with given prefix.
 */
exports.addPrefixToLogFunc = function (logger, funcName, prefix = '') {

  const showStack = Boolean(
    process.env.DZLOGPREFIX_CALLSITE_ALL || (process.env.DZLOGPREFIX_CALLSITE_ERROR && funcName === 'error')
  );

  return function (...args) {
    const prefixArgIndex = funcName === 'log' ? 1 : 0;

    if (showStack && args[args.length - 1] !== token) {
      const {fileLineNo, line} = getSrcInfo(callsite());
      const suffix = `${os.EOL}FILE: ${fileLineNo}${os.EOL}LINE: ${line}${os.EOL}`;
      args[args.length - 1] += suffix;
      args.push(token);
    }

    if (!logger.dzPrefixedLogger && showStack) {
      args.pop();
    }

    args[prefixArgIndex] = prefix + args[prefixArgIndex];

    return logger[funcName].apply(logger, args);
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
  const newLogger = { dzPrefixedLogger: true };
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
