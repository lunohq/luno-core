'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThreadEvent = exports.Thread = exports.GREETING_FLOW = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

exports.createThread = createThread;
exports.createEvent = createEvent;
exports.getThreadEvents = getThreadEvents;
exports.getOpenThread = getOpenThread;
exports.closeThread = closeThread;

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var threadTable = (0, _client.resolveTableName)('thread-v1');
var threadEventTable = (0, _client.resolveTableName)('thread-event-v1');

var THREAD_STATUS_OPEN = 0;
var THREAD_STATUS_CLOSED = 1;

var GREETING_FLOW = exports.GREETING_FLOW = 0;

var Thread = exports.Thread = function Thread() {
  (0, _classCallCheck3.default)(this, Thread);
};

var ThreadEvent = exports.ThreadEvent = function ThreadEvent() {
  (0, _classCallCheck3.default)(this, ThreadEvent);
};

function createThread(_ref) {
  var botId = _ref.botId;
  var channelId = _ref.channelId;
  var userId = _ref.userId;
  var data = (0, _objectWithoutProperties3.default)(_ref, ['botId', 'channelId', 'userId']);

  var thread = new Thread();
  (0, _assign2.default)(thread, data);
  thread.id = _nodeUuid2.default.v4();
  thread.botIdChannelIdUserId = (0, _client.compositeId)(botId, channelId, userId);
  thread.botId = botId;
  thread.channelId = channelId;
  thread.userId = userId;

  var now = new Date().toISOString();
  thread.created = now;
  thread.changed = now;

  thread.status = THREAD_STATUS_OPEN;

  var params = {
    TableName: threadTable,
    Item: thread
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.put(params, function (err, data) {
      if (err) return reject(err);
      return resolve(thread);
    });
  });
}

function createEvent(_ref2) {
  var threadId = _ref2.threadId;
  var botId = _ref2.botId;
  var channelId = _ref2.channelId;
  var messageId = _ref2.messageId;
  var data = (0, _objectWithoutProperties3.default)(_ref2, ['threadId', 'botId', 'channelId', 'messageId']);

  var event = new ThreadEvent();
  (0, _assign2.default)(event, data);
  event.threadId = threadId;
  event.botId = botId;
  event.channelId = channelId;
  if (messageId) {
    event.botIdChannelIdMessageId = (0, _client.compositeId)(botId, channelId, messageId);
    event.messageId = messageId;
  }

  var now = new Date().toISOString();
  event.created = now;
  event.changed = now;

  var params = {
    TableName: threadEventTable,
    Item: event
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.put(params, function (err, data) {
      if (err) return reject(err);
      return resolve(event);
    });
  });
}

function getThreadEvents(threadId) {
  var params = {
    TableName: threadEventTable,
    KeyConditionExpression: 'threadId = :threadId',
    ExpressionAttributeValues: {
      ':threadId': threadId
    }
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.queryAll(params, function (err, items) {
      if (err) return reject(err);
      return resolve(items.map(function (item) {
        return (0, _client.fromDB)(ThreadEvent, item);
      }));
    });
  });
}

function getOpenThread(_ref3) {
  var _this = this;

  var botId = _ref3.botId;
  var channelId = _ref3.channelId;
  var userId = _ref3.userId;

  var params = {
    TableName: threadTable,
    KeyConditionExpression: 'botIdChannelIdUserId = :botIdChannelIdUserId AND #status = :status',
    ExpressionAttributeValues: {
      ':botIdChannelIdUserId': (0, _client.compositeId)(botId, channelId, userId),
      ':status': THREAD_STATUS_OPEN
    },
    ExpressionAttributeNames: {
      '#status': 'status'
    },
    IndexName: 'ThreadBotIdChannelIdUserIdStatus'
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.queryAll(params, function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(err, items) {
        var response;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!err) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', reject(err));

              case 2:
                response = {};


                if (items.length) {
                  response.thread = (0, _client.fromDB)(Thread, items[0]);
                }

                if (!response.thread) {
                  _context.next = 14;
                  break;
                }

                _context.prev = 5;
                _context.next = 8;
                return getThreadEvents(response.thread.id);

              case 8:
                response.events = _context.sent;
                _context.next = 14;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context['catch'](5);
                return _context.abrupt('return', reject(_context.t0));

              case 14:
                return _context.abrupt('return', resolve(response));

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this, [[5, 11]]);
      }));
      return function (_x, _x2) {
        return ref.apply(this, arguments);
      };
    }());
  });
}

function closeThread(_ref4) {
  var botId = _ref4.botId;
  var channelId = _ref4.channelId;
  var userId = _ref4.userId;
  var id = _ref4.id;

  var params = {
    TableName: threadTable,
    Key: {
      id: id,
      botIdChannelIdUserId: (0, _client.compositeId)(botId, channelId, userId)
    },
    UpdateExpression: '\n      SET\n        #status = :status,\n        #changed = :changed\n    ',
    ExpressionAttributeNames: {
      '#status': 'status',
      '#changed': 'changed'
    },
    ExpressionAttributeValues: {
      ':status': THREAD_STATUS_CLOSED,
      ':changed': new Date().toISOString()
    },
    ReturnValues: 'ALL_NEW'
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.update(params, function (err, data) {
      if (err) return reject(err);
      var thread = (0, _client.fromDB)(Thread, data.Attributes);
      return resolve(thread);
    });
  });
}