
/**
 * Module definition and dependencies
 */
angular.module('App.Errors.Logger.Service', [])

/**
 * Factory definition
 */
.factory('Logger', function($window, Env) {

  /**
   * Helper to format error
   */
  function formatError(arg) {
    if (arg instanceof Error) {
      if (arg.stack) {
        arg = (arg.message && arg.stack.indexOf(arg.message) === -1) ?
              'Error: ' + arg.message + '\n' + arg.stack : arg.stack;
      }
      else if (arg.sourceURL) {
        arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
      }
    }
    return arg;
  }

  /**
   * Get logger function
   */
  function logger(method) {

    //Do not log anything in production
    if (Env.isProduction) {
      return angular.noop;
    }

    //Get console and log function
    var console = $window.console || {};
    var logFn = console[method] || console.log || angular.noop;
    var hasApply = false;

    //Note: reading logFn.apply throws an error in IE11 in IE8 document mode.
    //The reason behind this is that console.log has type "object" in IE8...
    try {
      hasApply = !!logFn.apply;
    } catch (e) {}

    //Function present
    if (hasApply) {
      return function() {
        var args = [];
        angular.forEach(arguments, function(arg) {
          args.push(formatError(arg));
        });
        return logFn.apply(console, args);
      };
    }

    //We are IE which either doesn't have window.console => this is noop and we do nothing,
    //or we are IE where console.log doesn't have apply so we log at least first 2 args
    return function(arg1, arg2) {
      logFn(arg1, arg2 === null ? '' : arg2);
    };
  }

  //Interface
  var Logger = {
    log: logger('log'),
    info: logger('info'),
    warn: logger('warn'),
    error: logger('error'),
    debug: logger('debug'),
    assert: logger('assert'),
    clear: logger('clear'),
    trace: logger('trace'),
    dir: logger('dir')
  };

  //Return logger
  return Logger;
});
