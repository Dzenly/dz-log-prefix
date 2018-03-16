Adds prefixes to winston - like JS loggers.

For usage examples, see: https://github.com/Dzenly/dz-log-prefix/blob/master/test/test.js.

#Environment variables

* DZLOGPREFIX_CALLSITE_ALL - Show callsite for all log levels.
E.g. 
DZLOGPREFIX_CALLSITE_ALL=1

* DZLOGPREFIX_CALLSITE - Show callsite for specified levels only
(comma separated list of levels).
E.g. DZLOGPREFIX_CALLSITE=error, warn.

* DZLOGPREFIX_STACK_NO_NODE_MODULES - Do not show strings containing `node_modules`
in call stacks for errors.
E.g. DZLOGPREFIX_STACK_NO_NODE_MODULES=1
