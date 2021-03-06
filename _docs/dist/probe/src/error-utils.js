'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.breakOnConsoleWarnings = breakOnConsoleWarnings;
exports.throwOnConsoleWarnings = throwOnConsoleWarnings;
exports.interceptRejectedPromises = interceptRejectedPromises;

var _env = require('./env');

/**
 * Ensure that your debugger stops when code issues warnings so that
 * you can see what is going on in othercomponents when they decide
 * to issue warnings.
 *
 * @param {Array} consoleBlacklist - array of strings to match against
 */
function breakOnConsoleWarnings() {
  var consoleBlacklist = arguments.length <= 0 || arguments[0] === undefined ? [/.*/] : arguments[0];

  function breakOnConsole(log, msg, param1) {
    for (var _len = arguments.length, params = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      params[_key - 3] = arguments[_key];
    }

    if (typeof msg === 'string' && msg.indexOf('Unhandled promise rejection') === 0) {
      log.apply(undefined, [msg, param1].concat(params));
      throw new Error(param1);
    } else if (consoleBlacklist.some(function (pattern) {
      return pattern.test(msg);
    })) {
      log.apply(undefined, [msg, param1].concat(params));
    } else {
      log.apply(undefined, [msg, param1].concat(params));
    }
  }
  _env.logger.warn = breakOnConsole.bind(null, _env.logger.native.warn);
  _env.logger.error = breakOnConsole.bind(null, _env.logger.native.error);

  window.onerror = function (message, url, line, column, error) {
    if (error) {
      _env.logger.native.error(error + ' ' + url + ':' + line + ':' + (column || 0));
    } else {
      _env.logger.native.error(message + ' ' + url + ':' + line + ':' + (column || 0));
    }
    debugger;
  };
}

/**
 * Throw exceptions when code issues warnings so that
 * you can access them in your normal exception handling setup, perhaps
 * displaying them in the UI or logging them in a different way.
 *
 * @param {Array} consoleBlacklist - array of strings to match against
 */
/**
 * Utilities for dev-mode error handling
 */
/* eslint-disable no-console, no-debugger */
/* global window */
function throwOnConsoleWarnings() {
  var consoleBlacklist = arguments.length <= 0 || arguments[0] === undefined ? [/.*/] : arguments[0];

  _env.logger.warn = function throwOnWarning(msg) {
    var _console$native;

    if (consoleBlacklist.some(function (patt) {
      return patt.test(msg);
    })) {
      throw new Error('Unacceptable warning: ' + msg);
    }
    (_console$native = _env.logger.native).warn.apply(_console$native, arguments);
  };
}

// Chrome has yet to implement onRejectedPromise, so trigger onerror instead
function interceptRejectedPromises() {
  var _arguments = arguments;

  _env.logger.error = function (msg, error) {
    for (var _len2 = arguments.length, params = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      params[_key2 - 2] = arguments[_key2];
    }

    var _console$native3;

    if (typeof msg === 'string' && msg.indexOf('Unhandled promise rejection') === 0) {
      var _console$native2;

      error.unhandledPromise = true;
      // Use different message to avoid triggering again
      (_console$native2 = _env.logger.native).error.apply(_console$native2, ['Rejected promise', error].concat(params));
      throw error;
    }
    (_console$native3 = _env.logger.native).error.apply(_console$native3, _arguments);
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm9iZS9zcmMvZXJyb3ItdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFjZ0Isc0IsR0FBQSxzQjtRQWdDQSxzQixHQUFBLHNCO1FBVUEseUIsR0FBQSx5Qjs7QUFuRGhCOztBQUVBOzs7Ozs7O0FBT08sU0FBUyxzQkFBVCxHQUEyRDtBQUFBLE1BQTNCLGdCQUEyQix5REFBUixDQUFDLElBQUQsQ0FBUTs7QUFDaEUsV0FBUyxjQUFULENBQXdCLEdBQXhCLEVBQTZCLEdBQTdCLEVBQWtDLE1BQWxDLEVBQXFEO0FBQUEsc0NBQVIsTUFBUTtBQUFSLFlBQVE7QUFBQTs7QUFDbkQsUUFBSSxPQUFPLEdBQVAsS0FBZSxRQUFmLElBQ0YsSUFBSSxPQUFKLENBQVksNkJBQVosTUFBK0MsQ0FEakQsRUFDb0Q7QUFDbEQsNEJBQUksR0FBSixFQUFTLE1BQVQsU0FBb0IsTUFBcEI7QUFDQSxZQUFNLElBQUksS0FBSixDQUFVLE1BQVYsQ0FBTjtBQUNELEtBSkQsTUFJTyxJQUFJLGlCQUFpQixJQUFqQixDQUFzQjtBQUFBLGFBQVcsUUFBUSxJQUFSLENBQWEsR0FBYixDQUFYO0FBQUEsS0FBdEIsQ0FBSixFQUF5RDtBQUM5RCw0QkFBSSxHQUFKLEVBQVMsTUFBVCxTQUFvQixNQUFwQjtBQUNELEtBRk0sTUFFQTtBQUNMLDRCQUFJLEdBQUosRUFBUyxNQUFULFNBQW9CLE1BQXBCO0FBQ0Q7QUFDRjtBQUNELGNBQVEsSUFBUixHQUFlLGVBQWUsSUFBZixDQUFvQixJQUFwQixFQUEwQixZQUFRLE1BQVIsQ0FBZSxJQUF6QyxDQUFmO0FBQ0EsY0FBUSxLQUFSLEdBQWdCLGVBQWUsSUFBZixDQUFvQixJQUFwQixFQUEwQixZQUFRLE1BQVIsQ0FBZSxLQUF6QyxDQUFoQjs7QUFFQSxTQUFPLE9BQVAsR0FBaUIsVUFBQyxPQUFELEVBQVUsR0FBVixFQUFlLElBQWYsRUFBcUIsTUFBckIsRUFBNkIsS0FBN0IsRUFBdUM7QUFDdEQsUUFBSSxLQUFKLEVBQVc7QUFDVCxrQkFBUSxNQUFSLENBQWUsS0FBZixDQUF3QixLQUF4QixTQUFpQyxHQUFqQyxTQUF3QyxJQUF4QyxVQUFnRCxVQUFVLENBQTFEO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsa0JBQVEsTUFBUixDQUFlLEtBQWYsQ0FBd0IsT0FBeEIsU0FBbUMsR0FBbkMsU0FBMEMsSUFBMUMsVUFBa0QsVUFBVSxDQUE1RDtBQUNEO0FBQ0Q7QUFDRCxHQVBEO0FBUUQ7O0FBRUQ7Ozs7Ozs7QUF2Q0E7OztBQUdBO0FBQ0E7QUEwQ08sU0FBUyxzQkFBVCxHQUEyRDtBQUFBLE1BQTNCLGdCQUEyQix5REFBUixDQUFDLElBQUQsQ0FBUTs7QUFDaEUsY0FBUSxJQUFSLEdBQWUsU0FBUyxjQUFULENBQXdCLEdBQXhCLEVBQTZCO0FBQUE7O0FBQzFDLFFBQUksaUJBQWlCLElBQWpCLENBQXNCO0FBQUEsYUFBUSxLQUFLLElBQUwsQ0FBVSxHQUFWLENBQVI7QUFBQSxLQUF0QixDQUFKLEVBQW1EO0FBQ2pELFlBQU0sSUFBSSxLQUFKLDRCQUFtQyxHQUFuQyxDQUFOO0FBQ0Q7QUFDRCxtQ0FBUSxNQUFSLEVBQWUsSUFBZix3QkFBdUIsU0FBdkI7QUFDRCxHQUxEO0FBTUQ7O0FBRUQ7QUFDTyxTQUFTLHlCQUFULEdBQXFDO0FBQUE7O0FBQzFDLGNBQVEsS0FBUixHQUFnQixVQUFDLEdBQUQsRUFBTSxLQUFOLEVBQTJCO0FBQUEsdUNBQVgsTUFBVztBQUFYLFlBQVc7QUFBQTs7QUFBQTs7QUFDekMsUUFBSSxPQUFPLEdBQVAsS0FBZSxRQUFmLElBQ0YsSUFBSSxPQUFKLENBQVksNkJBQVosTUFBK0MsQ0FEakQsRUFDb0Q7QUFBQTs7QUFDbEQsWUFBTSxnQkFBTixHQUF5QixJQUF6QjtBQUNBO0FBQ0Esc0NBQVEsTUFBUixFQUFlLEtBQWYsMEJBQXFCLGtCQUFyQixFQUF5QyxLQUF6QyxTQUFtRCxNQUFuRDtBQUNBLFlBQU0sS0FBTjtBQUNEO0FBQ0Qsb0NBQVEsTUFBUixFQUFlLEtBQWY7QUFDRCxHQVREO0FBVUQiLCJmaWxlIjoiZXJyb3ItdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFV0aWxpdGllcyBmb3IgZGV2LW1vZGUgZXJyb3IgaGFuZGxpbmdcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSwgbm8tZGVidWdnZXIgKi9cbi8qIGdsb2JhbCB3aW5kb3cgKi9cbmltcG9ydCB7bG9nZ2VyIGFzIGNvbnNvbGV9IGZyb20gJy4vZW52JztcblxuLyoqXG4gKiBFbnN1cmUgdGhhdCB5b3VyIGRlYnVnZ2VyIHN0b3BzIHdoZW4gY29kZSBpc3N1ZXMgd2FybmluZ3Mgc28gdGhhdFxuICogeW91IGNhbiBzZWUgd2hhdCBpcyBnb2luZyBvbiBpbiBvdGhlcmNvbXBvbmVudHMgd2hlbiB0aGV5IGRlY2lkZVxuICogdG8gaXNzdWUgd2FybmluZ3MuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gY29uc29sZUJsYWNrbGlzdCAtIGFycmF5IG9mIHN0cmluZ3MgdG8gbWF0Y2ggYWdhaW5zdFxuICovXG5leHBvcnQgZnVuY3Rpb24gYnJlYWtPbkNvbnNvbGVXYXJuaW5ncyhjb25zb2xlQmxhY2tsaXN0ID0gWy8uKi9dKSB7XG4gIGZ1bmN0aW9uIGJyZWFrT25Db25zb2xlKGxvZywgbXNnLCBwYXJhbTEsIC4uLnBhcmFtcykge1xuICAgIGlmICh0eXBlb2YgbXNnID09PSAnc3RyaW5nJyAmJlxuICAgICAgbXNnLmluZGV4T2YoJ1VuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbicpID09PSAwKSB7XG4gICAgICBsb2cobXNnLCBwYXJhbTEsIC4uLnBhcmFtcyk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IocGFyYW0xKTtcbiAgICB9IGVsc2UgaWYgKGNvbnNvbGVCbGFja2xpc3Quc29tZShwYXR0ZXJuID0+IHBhdHRlcm4udGVzdChtc2cpKSkge1xuICAgICAgbG9nKG1zZywgcGFyYW0xLCAuLi5wYXJhbXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cobXNnLCBwYXJhbTEsIC4uLnBhcmFtcyk7XG4gICAgfVxuICB9XG4gIGNvbnNvbGUud2FybiA9IGJyZWFrT25Db25zb2xlLmJpbmQobnVsbCwgY29uc29sZS5uYXRpdmUud2Fybik7XG4gIGNvbnNvbGUuZXJyb3IgPSBicmVha09uQ29uc29sZS5iaW5kKG51bGwsIGNvbnNvbGUubmF0aXZlLmVycm9yKTtcblxuICB3aW5kb3cub25lcnJvciA9IChtZXNzYWdlLCB1cmwsIGxpbmUsIGNvbHVtbiwgZXJyb3IpID0+IHtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubmF0aXZlLmVycm9yKGAke2Vycm9yfSAke3VybH06JHtsaW5lfToke2NvbHVtbiB8fCAwfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLm5hdGl2ZS5lcnJvcihgJHttZXNzYWdlfSAke3VybH06JHtsaW5lfToke2NvbHVtbiB8fCAwfWApO1xuICAgIH1cbiAgICBkZWJ1Z2dlcjtcbiAgfTtcbn1cblxuLyoqXG4gKiBUaHJvdyBleGNlcHRpb25zIHdoZW4gY29kZSBpc3N1ZXMgd2FybmluZ3Mgc28gdGhhdFxuICogeW91IGNhbiBhY2Nlc3MgdGhlbSBpbiB5b3VyIG5vcm1hbCBleGNlcHRpb24gaGFuZGxpbmcgc2V0dXAsIHBlcmhhcHNcbiAqIGRpc3BsYXlpbmcgdGhlbSBpbiB0aGUgVUkgb3IgbG9nZ2luZyB0aGVtIGluIGEgZGlmZmVyZW50IHdheS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBjb25zb2xlQmxhY2tsaXN0IC0gYXJyYXkgb2Ygc3RyaW5ncyB0byBtYXRjaCBhZ2FpbnN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvd09uQ29uc29sZVdhcm5pbmdzKGNvbnNvbGVCbGFja2xpc3QgPSBbLy4qL10pIHtcbiAgY29uc29sZS53YXJuID0gZnVuY3Rpb24gdGhyb3dPbldhcm5pbmcobXNnKSB7XG4gICAgaWYgKGNvbnNvbGVCbGFja2xpc3Quc29tZShwYXR0ID0+IHBhdHQudGVzdChtc2cpKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFjY2VwdGFibGUgd2FybmluZzogJHttc2d9YCk7XG4gICAgfVxuICAgIGNvbnNvbGUubmF0aXZlLndhcm4oLi4uYXJndW1lbnRzKTtcbiAgfTtcbn1cblxuLy8gQ2hyb21lIGhhcyB5ZXQgdG8gaW1wbGVtZW50IG9uUmVqZWN0ZWRQcm9taXNlLCBzbyB0cmlnZ2VyIG9uZXJyb3IgaW5zdGVhZFxuZXhwb3J0IGZ1bmN0aW9uIGludGVyY2VwdFJlamVjdGVkUHJvbWlzZXMoKSB7XG4gIGNvbnNvbGUuZXJyb3IgPSAobXNnLCBlcnJvciwgLi4ucGFyYW1zKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBtc2cgPT09ICdzdHJpbmcnICYmXG4gICAgICBtc2cuaW5kZXhPZignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJykgPT09IDApIHtcbiAgICAgIGVycm9yLnVuaGFuZGxlZFByb21pc2UgPSB0cnVlO1xuICAgICAgLy8gVXNlIGRpZmZlcmVudCBtZXNzYWdlIHRvIGF2b2lkIHRyaWdnZXJpbmcgYWdhaW5cbiAgICAgIGNvbnNvbGUubmF0aXZlLmVycm9yKCdSZWplY3RlZCBwcm9taXNlJywgZXJyb3IsIC4uLnBhcmFtcyk7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gICAgY29uc29sZS5uYXRpdmUuZXJyb3IoLi4uYXJndW1lbnRzKTtcbiAgfTtcbn1cbiJdfQ==