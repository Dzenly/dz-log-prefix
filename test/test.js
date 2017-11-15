'use strict';

const winston = require('winston');
const dzLogPrefix = require('../index.js');

const prefixedLogger = dzLogPrefix.addPrefixToCommonLogFuncs(winston, 'My Prefix: ');

// info: Winston info log.
winston.info('Winston info log.');

// info: My Prefix: prefixedLogger info log.
prefixedLogger.info('prefixedLogger info log.');

const doublePrefixedLogger = dzLogPrefix.addPrefixToCommonLogFuncs(prefixedLogger, 'My PostPrefix: ');

// info: My Prefix: My PostPrefix: doublePrefixedLogger info log.
doublePrefixedLogger.info('doublePrefixedLogger info log.');
