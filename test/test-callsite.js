'use strict';

process.env.DZLOGPREFIX_CALLSITE = 'error, warn';

const winston = require('winston');
const dzLogPrefix = require('../index.js');

const prefixedLogger1 = dzLogPrefix.addPrefixToCommonLogFuncs(winston, 'My Prefix1: ');

const doublePrefixedLogger1 = dzLogPrefix.addPrefixToCommonLogFuncs(prefixedLogger1, 'My Prefix2: ');

doublePrefixedLogger1.error('someMsg2', 'someMsg3');
doublePrefixedLogger1.warn('someMsg2', 'someMsg3');
doublePrefixedLogger1.info('someMsg2', 'someMsg3');

