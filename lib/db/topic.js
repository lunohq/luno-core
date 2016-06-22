'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidName = exports.createTopic = exports.Topic = exports.DUPLICATE_TOPIC_NAME_EXCEPTION = undefined;

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