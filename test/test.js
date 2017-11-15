'use strict';

const winston = require('winston');
const dzLogPrefix = require('../index.js');


const prefixedLogger = dzLogPrefix.addPrefixToCommonLogFuncs(winston, 'My Prefix: ');

winston.info('Winston info log.');

prefixedLogger.info('prefixedLogger info log.');

const doublePrefixedLogger = dzLogPrefix.addPrefixToCommonLogFuncs(prefixedLogger, 'My PostPrefix: ');

doublePrefixedLogger.info('doublePrefixedLogger info log.');
