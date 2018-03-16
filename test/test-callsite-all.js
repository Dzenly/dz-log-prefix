'use strict';

process.env.DZLOGPREFIX_CALLSITE_ALL = 1;

const winston = require('winston');
const dzLogPrefix = require('../index.js');

const prefixedLogger1 = dzLogPrefix.addPrefixToCommonLogFuncs(winston, 'My Prefix1: ');

const doublePrefixedLogger1 = dzLogPrefix.addPrefixToCommonLogFuncs(prefixedLogger1, 'My Prefix2: ');

prefixedLogger1.info('someMsg1');

doublePrefixedLogger1.info('someMsg2', 'someMsg3');

new Promise((resolve, reject) => {
  setTimeout(()=> {
    doublePrefixedLogger1.info('After timeout');
    resolve();
  }, 200);
})
  .catch((err) => {
    doublePrefixedLogger1.error(err);
  });


new Promise((resolve, reject) => {
  setTimeout(()=> {
    reject(new Error('My Error'));
  }, 300);
})
  .catch((err) => {
    doublePrefixedLogger1.error(err);
  });

