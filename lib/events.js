'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _getClient = require('./redis/getClient');

var _getClient2 = _interopRequireDefault(_getClient);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var events = {
  CREATE_TEAM: 'CREATE_TEAM'
};

var handlers = {};

var client = void 0;
var subscribed = false;
var sns = new _awsSdk2.default.SNS();

/**
 * Publish an event, instantiating the redis client if necessary
 *
 * @param {String} event an event to publish
 * @param {String} message message to publish
 * @param {Object} notification instructions on how to publish to sns
 */
function publish(event, message, notification) {
  var _this = this;

  return new _promise2.default(function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!client) {
                client = (0, _getClient2.default)();
              }
              client.publish(event, message);

              if (!notification) {
                _context.next = 4;
                break;
              }

              return _context.abrupt('return', sns.publish(notification));

            case 4:
              return _context.abrupt('return', resolve());

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));
    return function (_x, _x2) {
      return ref.apply(this, arguments);
    };
  }());
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
    createTeam: function createTeam(teamId) {
      var notification = {
        Subject: 'New Team',
        Message: (0, _stringify2.default)({ teamId: teamId }),
        TopicArn: _config2.default.sns.topic.newUser
      };
      return publish(events.CREATE_TEAM, teamId, notification);
    }
  },
  handle: {
    createTeam: function createTeam(handler) {
      function _handler(channel, message) {
        handler(message);
      }
      registerHandler(events.CREATE_TEAM, _handler);
    }
  }
};