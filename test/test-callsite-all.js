'use strict';

process.env.DZLOGPREFIX_CALLSITE_ALL = 1;
process.env.DZLOGPREFIX_CALLSITE_DEPTH = 20;

const winston = require('winston');
const dzLogPrefix = require('../index.js');

const prefixedLogger1 = dzLogPrefix.addPrefixToCommonLogFuncs(winston, 'My Prefix1: ');

const doublePrefixedLogger1 = dzLogPrefix.addPrefixToCommonLogFuncs(prefixedLogger1, 'My Prefix2: ');

prefixedLogger1.info('someMsg1');

doublePrefixedLogger1.info('someMsg2', 'someMsg3');

setTimeout(() => {
  doublePrefixedLogger1.info('After timeout');
}, 100);

new Promise((resolve, reject) => {
  setTimeout(() => {
    doublePrefixedLogger1.info('After timeout in Promise');
    resolve();
  }, 200);
})
  .catch((err) => {
    doublePrefixedLogger1.error(err);
  });

new Promise((resolve, reject) => {
  throw new Error('My Error 1');
})
.then((res) => {
  console.log(`IN THEN: ${res}`);
})
  .catch((err) => {
    console.log('IN CATCH');
    doublePrefixedLogger1.error(err);
  });


new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('My Error 2'));
  }, 300);
})
  .catch((err) => {
    doublePrefixedLogger1.error(err);
  });

process
  .on('uncaughtException', (err) => {
    doublePrefixedLogger1.error('uncaughtException handler.');
  });

throw new Error('Unhandled throw');
