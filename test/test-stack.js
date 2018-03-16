'use strict';

process.env.DZLOGPREFIX_STACK_NO_NODE_MODULES = 1;

const winston = require('winston');
const dzLogPrefix = require('../index.js');

const prefixedLogger1 = dzLogPrefix.addPrefixToCommonLogFuncs(winston, 'My Prefix1: ');

const doublePrefixedLogger1 = dzLogPrefix.addPrefixToCommonLogFuncs(prefixedLogger1, 'My Prefix2: ');

doublePrefixedLogger1.log('info', new ReferenceError('My Error 1'))

new Promise((resolve, reject) => {
  setTimeout(()=> {
    reject(new ReferenceError('My Error 2'));
  }, 300);
})
  .catch((err) => {
    doublePrefixedLogger1.error(err);
  });

