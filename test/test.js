'use strict';

const winston = require('winston');
const dzLogPrefix = require('../index.js');

const prefixedLogger1 = dzLogPrefix.addPrefixToCommonLogFuncs(winston, 'My Prefix1: ');

const prefixedLogger2 = dzLogPrefix.addPrefixToCommonLogFuncs(winston, 'My Prefix2: ');

// info: Winston info log.
winston.info('Winston info log.');

// info: My Prefix1: prefixedLogger1 info log.
prefixedLogger1.info('prefixedLogger1 info log.');

// info: My Prefix2: prefixedLogger2 info log.
prefixedLogger2.info('prefixedLogger2 info log.');

const doublePrefixedLogger1 = dzLogPrefix.addPrefixToCommonLogFuncs(prefixedLogger1, 'My PostPrefix1: ');

// info: My Prefix1: My PostPrefix1: doublePrefixedLogger1 info log.
doublePrefixedLogger1.info('doublePrefixedLogger1 info log.');
