'use strict';

const winston = require('winston');
const dzLogPrefix = require('../index.js');

const prefixedLogger1 = dzLogPrefix.addPrefixToCommonLogFuncs(winston, 'My Prefix1: ');

const prefixedLogger2 = dzLogPrefix.addPrefixToCommonLogFuncs(winston, 'My Prefix2: ');

// info: Winston info log.
winston.info('Winston info log.');

// info: My Prefix1: prefixedLogger1 info log.
prefixedLogger1.info('prefixedLogger1 info log.');

// Doesn't work !!!
prefixedLogger1.level = 'error';

// info: My Prefix1: prefixedLogger1 String still in the log, cause prefixedLogger1 is a newly created object, it is not winston object.
prefixedLogger1.info('prefixedLogger1 String still in the log, cause prefixedLogger1 is a newly created object, it is not winston object.');

// Works !!!
winston.level = 'error';
//
prefixedLogger1.info('This string should not be in the log.');

winston.level = 'silly';

// info: My Prefix2: prefixedLogger2 info log.
prefixedLogger2.info('prefixedLogger2 info log.');

const doublePrefixedLogger1 = dzLogPrefix.addPrefixToCommonLogFuncs(prefixedLogger1, 'My PostPrefix1: ');

// info: My Prefix1: My PostPrefix1: doublePrefixedLogger1 info log.
doublePrefixedLogger1.info('doublePrefixedLogger1 info log.');
