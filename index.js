'use strict';

const callsite = require('callsite');
const { EOL } = require('os');
const { sep } = require('path');

const callsiteStackDepth = process.env.DZLOGPREFIX_CALLSITE_DEPTH || 1;

// function frameInfo(frame) {
//   return {
//     getThis: frame.getThis(),
//
//     getTypeName: frame.getTypeName(),
//     getFunction: frame.getFunction(),
//     getFunctionName: frame.getFunctionName(),
//     getMethodName: frame.getMethodName(),
//     getFileName: frame.getFileName(),
//     getLineNumber: frame.getLineNumber(),
//     getColumnNumber: frame.getColumnNumber(),
//     getEvalOrigin: frame.getEvalOrigin(),
//     isToplevel: frame.isToplevel(),
//     isEval: frame.isEval(),
//     isNative: frame.isNative(),
//     isConstructor: frame.isConstructor(),
//   };
// }

function getSrcInfo(stack) {

  const fileLineNoArr = [];

  const end = Math.min(callsiteStackDepth, stack.length - 1);

  for (let i = 1; i <= end; ++i)
  {
    const call = stack[i];

    // console.log(frameInfo(call));

    const file = call.getFileName();
    const lineno = call.getLineNumber();
    const fileLineNoStr = `${EOL}FILE: ${file}:${lineno}`;
    fileLineNoArr.push(fileLineNoStr);
  }

  return fileLineNoArr.join('') + EOL;
}

const arrFuncs = ['error', 'warn', 'info', 'verbose', 'debug', 'silly', 'log'];
const flagsShowCallsite = new Map();

if (process.env.DZLOGPREFIX_CALLSITE_ALL) {
  arrFuncs.forEach((funcName) => {
    flagsShowCallsite.set(funcName, true);
  });
}

if (process.env.DZLOGPREFIX_CALLSITE) {
  const funcNames = process.env.DZLOGPREFIX_CALLSITE.split(/,\s*/);
  funcNames.forEach((funcName) => {
    flagsShowCallsite.set(funcName, true);
  });
}

const noNodeModulesInStack = Boolean(process.env.DZLOGPREFIX_STACK_NO_NODE_MODULES);
const nodeModulesStr = `${sep}node_modules${sep}`;

const token = Symbol('forShowCallSite');

/**
 * Creates a function wrapper for a logger function.
 * @param {Object} logger - Logger object. E.g. winston.
 * @param {String} funcName - Function name. E.g. 'warn'.
 * @param {String} prefix - Prefix to add.
 * @return {Function} - A new function which logs with given prefix.
 */
exports.addPrefixToLogFunc = function addPrefixToLogFunc(logger, funcName, prefix = '') {
  const showCallsite = Boolean(flagsShowCallsite.get(funcName));

  return function logWithPrefix(...args) {
    const prefixArgIndex = funcName === 'log' ? 1 : 0;

    if (showCallsite && args[args.length - 1] !== token) {
      const fileLineNo = getSrcInfo(callsite());
      args.push(fileLineNo);
      args.push(token);
    }

    if (!logger.dzPrefixedLogger && showCallsite) {
      args.pop();
    }

    args = args.map((arg) => {
      if (arg instanceof Error) {
        let stack = arg.stack;
        let stackArr = stack.split(EOL);
        stackArr.shift();
        if (noNodeModulesInStack) {
          stackArr = stackArr.filter((line) => {
            return line.indexOf(nodeModulesStr) === -1;
          });
        }
        stack = stackArr.join(EOL);
        arg = `${arg}${EOL}${stack}`;
      }
      return arg;
    });

    args[prefixArgIndex] = prefix + args[prefixArgIndex];

    return logger[funcName](...args);
  };
};

/**
 * Creates a new logger object for which given log functions have a specified prefix to log messages.
 *
 * @param {Object} logger - Logger object. E.g. winston.
 * @param {String[]} funcNames - Array of function names, e.g. ['info', 'warn']
 * @param {String} prefix - Prefix to add.
 */
exports.addPrefixToLogFuncs = function addPrefixToLogFuncs(logger, funcNames, prefix) {
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
exports.addPrefixToCommonLogFuncs = function addPrefixToCommonLogFuncs(logger, prefix) {
  return exports.addPrefixToLogFuncs(
    logger,
    arrFuncs,
    prefix
  );
};
