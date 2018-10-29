'use strict';

process.env.DZLOGPREFIX_CALLSITE_ALL = 1;
// process.env.DZLOGPREFIX_CALLSITE_DEPTH = 2;

const winston = require('winston');
const dzLogPrefix = require('../index.js');

const prefixedLogger1 = dzLogPrefix.addPrefixToCommonLogFuncs(winston, undefined);

prefixedLogger1.info('someMsg1');
