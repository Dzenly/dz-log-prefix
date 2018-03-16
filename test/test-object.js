'use strict';

process.env.DZLOGPREFIX_CALLSITE_ALL = 1;

const winston = require('winston');

const dzLogPrefix = require('../index.js');

const prefixedLogger1 = dzLogPrefix.addPrefixToCommonLogFuncs(winston, 'My Prefix1: ');

prefixedLogger1.info('%j', {asdf: 5});

