'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTopic = exports.getTopicsWithIds = exports.getDefaultTopic = exports.isValidName = exports.createTopic = exports.Topic = exports.DUPLICATE_TOPIC_NAME_EXCEPTION = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var createTopic = exports.createTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref) {
    var teamId = _ref.teamId;
    var data = (0, _objectWithoutProperties3.default)(_ref, ['teamId']);
    var error, topic, now, params;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(!data.isDefault && !isValidName({ teamId: teamId, name: data.name }))) {
              _context.next = 4;
              break;
            }

            error = new Error('Duplicate team name');

            error.code = DUPLICATE_TOPIC_NAME_EXCEPTION;
            throw error;

          case 4:
            topic = new Topic();

            (0, _assign2.default)(topic, data);
            topic.id = _nodeUuid2.default.v4();
            topic.teamId = teamId;

            now = new Date().toISOString();

            topic.created = now;
            topic.changed = now;

            params = {
              TableName: topicTable,
              Item: topic
            };
            _context.next = 14;
            return _client2.default.put(params).promise();

          case 14:
            return _context.abrupt('return', topic);

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function createTopic(_x) {
    return ref.apply(this, arguments);
  };
}();

var isValidName = exports.isValidName = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref2) {
    var teamId = _ref2.teamId;
    var name = _ref2.name;
    var params, resp;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            params = {
              TableName: topicNameTable,
              Item: { teamId: teamId, name: name },
              ConditionExpression: 'attribute_not_exists(#name)',
              ExpressionAttributeNames: {
                '#name': 'name'
              }
            };
            _context2.prev = 1;
            _context2.next = 4;
            return _client2.default.put(params).promise();

          case 4:
            resp = _context2.sent;
            return _context2.abrupt('return', resp.statusCode === 200);

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2['catch'](1);

            if (!(_context2.t0.code === 'ConditionalCheckFailedException')) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt('return', false);

          case 12:
            throw _context2.t0;

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 8]]);
  }));
  return function isValidName(_x2) {
    return ref.apply(this, arguments);
  };
}();

var getDefaultTopic = exports.getDefaultTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(teamId) {
    var params, data, topic;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            params = {
              TableName: topicTable,
              IndexName: 'TeamIdIsDefaultIndex',
              KeyConditionExpression: 'teamId = :teamId AND isDefault = :default',
              ExpressionAttributeValues: {
                ':teamId': teamId,
                ':default': 1
              }
            };
            _context3.next = 3;
            return _client2.default.query(params).promise();

          case 3:
            data = _context3.sent;
            topic = void 0;

            if (data.Items && data.Items.length) {
              topic = (0, _client.fromDB)(Topic, data.Items[0]);
            }
            return _context3.abrupt('return', topic);

          case 7:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function getDefaultTopic(_x3) {
    return ref.apply(this, arguments);
  };
}();

var getTopicsWithIds = exports.getTopicsWithIds = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(_ref3) {
    var teamId = _ref3.teamId;
    var topicIds = _ref3.topicIds;
    var params, data;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            params = {
              RequestItems: (0, _defineProperty3.default)({}, topicTable, {
                Keys: topicIds.map(function (topicId) {
                  teamId, topicId;
                })
              })
            };
            _context4.next = 3;
            return _client2.default.batchGet(params).promise();

          case 3:
            data = _context4.sent;

            console.log(data);
            return _context4.abrupt('return', data);

          case 6:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return function getTopicsWithIds(_x4) {
    return ref.apply(this, arguments);
  };
}();

var getTopic = exports.getTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref4) {
    var teamId = _ref4.teamId;
    var id = _ref4.id;
    var params, data, topic;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            params = {
              TableName: topicTable,
              Key: { teamId: teamId, id: id }
            };
            _context5.next = 3;
            return _client2.default.get(params).promise();

          case 3:
            data = _context5.sent;
            topic = void 0;

            if (data.Item) {
              topic = (0, _client.fromDB)(Topic, data.Item);
            }
            return _context5.abrupt('return', topic);

          case 7:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return function getTopic(_x5) {
    return ref.apply(this, arguments);
  };
}();

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var topicTable = (0, _client.resolveTableName)('topic-v1');
var topicNameTable = (0, _client.resolveTableName)('topic-name-v1');

var DUPLICATE_TOPIC_NAME_EXCEPTION = exports.DUPLICATE_TOPIC_NAME_EXCEPTION = 'DuplicateTopicNameException';

var Topic = exports.Topic = function Topic() {
  (0, _classCallCheck3.default)(this, Topic);
};