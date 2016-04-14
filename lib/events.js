'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getClient = require('./redis/getClient');

var _getClient2 = _interopRequireDefault(_getClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var events = {
  CREATE_BOT: 'CREATE_BOT'
};

var handlers = {};

var client = void 0;
var subscribed = false;

/**
 * Publish an event, instantiating the redis client if necessary
 *
 * @param {String} event an event to publish
 * @param {String} message message to publish
 */
function publish(event, message) {
  if (!client) {
    client = (0, _getClient2.default)();
  }
  client.publish(event, message);
}

/**
 * Ensure the redis client is subscribed to any messages that are published.
 */
function ensureSubscribed() {
  if (!client) {
    client = (0, _getClient2.default)();
  }

  if (!subscribed) {
    subscribed = true;
    client.on('message', function (channel, message) {
      var funcs = handlers[channel] || [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(funcs), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var func = _step.value;

          func(channel, message);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    });
  }
}

/**
 * Register a handler for an event.
 *
 * Each time the event is published, the handler will be invoked.
 *
 * @param {String} event the event to register for
 * @param {Function} handler the handler to register
 */
function registerHandler(event, handler) {
  ensureSubscribed();

  if (handlers[event] === undefined) {
    handlers[event] = [];
  }

  if (!client) {
    client = (0, _getClient2.default)();
  }
  client.subscribe(event);

  var funcs = handlers[event];
  if (funcs.indexOf(handler) === -1) {
    funcs.push(handler);
  }
}

exports.default = {
  publish: {
    createBot: function createBot(teamId) {
      publish(events.CREATE_BOT, teamId);
    }
  },
  handle: {
    createBot: function createBot(handler) {
      function _handler(channel, message) {
        handler(message);
      }
      registerHandler(events.CREATE_BOT, _handler);
    }
  }
};