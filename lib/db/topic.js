'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTopics = exports.getTopicsWithIds = exports.getDefaultTopic = exports.getTopic = exports.isValidName = exports.deleteTopicName = exports.deleteTopic = exports.updateTopic = exports.createTopic = exports.Topic = exports.DUPLICATE_TOPIC_NAME_EXCEPTION = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var updateTopic = exports.updateTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref2) {
    var id = _ref2.id;
    var teamId = _ref2.teamId;
    var name = _ref2.name;
    var updatedBy = _ref2.updatedBy;
    var pointsOfContact = _ref2.pointsOfContact;
    var now, params, data;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            now = new Date().toISOString();
            params = {
              TableName: topicTable,
              Key: { id: id, teamId: teamId },
              UpdateExpression: '\n      SET\n        #pointsOfContact = :pointsOfContact,\n        #changed = :changed,\n        #name = :name,\n        #updatedBy = :updatedBy\n    ',
              ExpressionAttributeNames: {
                '#pointsOfContact': 'pointsOfContact',
                '#changed': 'changed',
                '#name': 'name',
                '#updatedBy': 'updatedBy'
              },
              ExpressionAttributeValues: {
                ':pointsOfContact': pointsOfContact,
                ':changed': now,
                ':name': name,
                ':updatedBy': updatedBy
              }
            };
            _context2.next = 4;
            return _client2.default.update(params).promise();

          case 4:
            data = _context2.sent;
            return _context2.abrupt('return', (0, _client.fromDB)(Topic, data.Attributes));

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function updateTopic(_x2) {
    return ref.apply(this, arguments);
  };
}();

var deleteTopic = exports.deleteTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref3) {
    var teamId = _ref3.teamId;
    var id = _ref3.id;
    var params, data, topic, promises, replies;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            params = {
              TableName: topicTable,
              Key: { id: id, teamId: teamId },
              ReturnValues: 'ALL_OLD',
              ConditionExpression: 'attribute_exists(#id)',
              ExpressionAttributeNames: {
                '#id': 'id'
              }
            };
            data = void 0;
            _context3.prev = 2;
            _context3.next = 5;
            return _client2.default.delete(params).promise();

          case 5:
            data = _context3.sent;
            _context3.next = 12;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3['catch'](2);

            if (!(_context3.t0.code !== 'ConditionalCheckFailedException')) {
              _context3.next = 12;
              break;
            }

            throw _context3.t0;

          case 12:
            topic = void 0;

            if (data) {
              topic = (0, _client.fromDB)(Topic, data.Attributes);
            }

            promises = [];

            if (topic) {
              promises.push(deleteTopic({ teamId: teamId, name: topic.name }));
            }

            _context3.next = 18;
            return (0, _reply.getRepliesForTopic)({ teamId: teamId, topicId: id });

          case 18:
            replies = _context3.sent;

            if (replies) {
              (function () {
                var replyKeys = [];
                var topicItemKeys = [];
                replies.forEach(function (reply) {
                  replyKeys.push({ teamId: teamId, id: reply.id });
                  topicItemKeys.push({ teamIdTopicId: (0, _client.compositeId)(teamId, id), itemId: reply.id });
                });
                promises.push(_client2.default.batchDeleteAll({ table: _reply.table, keys: replyKeys }));
                promises.push(_client2.default.batchDeleteAll({ table: _topicItem.table, keys: topicItemKeys }));
              })();
            }

            // TODO need to delete from ES, not sure how we're going to store the topic yet though.

            if (!promises.length) {
              _context3.next = 23;
              break;
            }

            _context3.next = 23;
            return _promise2.default.all(promises);

          case 23:
            return _context3.abrupt('return', topic);

          case 24:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[2, 8]]);
  }));
  return function deleteTopic(_x3) {
    return ref.apply(this, arguments);
  };
}();

var deleteTopicName = exports.deleteTopicName = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(_ref4) {
    var teamId = _ref4.teamId;
    var name = _ref4.name;
    var params, data;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            params = {
              TableName: topicNameTable,
              Item: { teamId: teamId, name: name },
              ConditionExpression: 'attribute_exists(#name)',
              ExpressionAttributeNames: {
                '#name': 'name'
              }
            };
            data = void 0;
            _context4.prev = 2;
            _context4.next = 5;
            return _client2.default.delete(params).promise();

          case 5:
            data = _context4.sent;
            _context4.next = 12;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4['catch'](2);

            if (!(_context4.t0.code !== 'ConditionalCheckFailedException')) {
              _context4.next = 12;
              break;
            }

            throw _context4.t0;

          case 12:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[2, 8]]);
  }));
  return function deleteTopicName(_x4) {
    return ref.apply(this, arguments);
  };
}();

var isValidName = exports.isValidName = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref5) {
    var teamId = _ref5.teamId;
    var name = _ref5.name;
    var params, resp;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            params = {
              TableName: topicNameTable,
              Item: { teamId: teamId, name: name },
              ConditionExpression: 'attribute_not_exists(#name)',
              ExpressionAttributeNames: {
                '#name': 'name'
              }
            };
            _context5.prev = 1;
            _context5.next = 4;
            return _client2.default.put(params).promise();

          case 4:
            resp = _context5.sent;
            return _context5.abrupt('return', resp.statusCode === 200);

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5['catch'](1);

            if (!(_context5.t0.code === 'ConditionalCheckFailedException')) {
              _context5.next = 12;
              break;
            }

            return _context5.abrupt('return', false);

          case 12:
            throw _context5.t0;

          case 13:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[1, 8]]);
  }));
  return function isValidName(_x5) {
    return ref.apply(this, arguments);
  };
}();

var getTopic = exports.getTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(_ref6) {
    var teamId = _ref6.teamId;
    var id = _ref6.id;
    var params, data, topic;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            params = {
              TableName: topicTable,
              Key: { id: id, teamId: teamId }
            };
            _context6.next = 3;
            return _client2.default.get(params).promise();

          case 3:
            data = _context6.sent;
            topic = void 0;

            if (data.Item) {
              topic = (0, _client.fromDB)(Topic, data.Item);
            }
            return _context6.abrupt('return', topic);

          case 7:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));
  return function getTopic(_x6) {
    return ref.apply(this, arguments);
  };
}();

var getDefaultTopic = exports.getDefaultTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(teamId) {
    var params, data, topic;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
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
            _context7.next = 3;
            return _client2.default.query(params).promise();

          case 3:
            data = _context7.sent;
            topic = void 0;

            if (data.Items && data.Items.length) {
              topic = (0, _client.fromDB)(Topic, data.Items[0]);
            }
            return _context7.abrupt('return', topic);

          case 7:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));
  return function getDefaultTopic(_x7) {
    return ref.apply(this, arguments);
  };
}();

var getTopicsWithIds = exports.getTopicsWithIds = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(_ref7) {
    var teamId = _ref7.teamId;
    var topicIds = _ref7.topicIds;
    var params, data, topics;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            params = {
              RequestItems: (0, _defineProperty3.default)({}, topicTable, {
                Keys: topicIds.map(function (topicId) {
                  return { teamId: teamId, id: topicId };
                })
              })
            };
            _context8.next = 3;
            return _client2.default.batchGet(params).promise();

          case 3:
            data = _context8.sent;
            topics = [];

            if (data.Responses && data.Responses[topicTable]) {
              topics = data.Responses[topicTable].map(function (topic) {
                return (0, _client.fromDB)(Topic, topic);
              });
            }
            return _context8.abrupt('return', topics);

          case 7:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));
  return function getTopicsWithIds(_x8) {
    return ref.apply(this, arguments);
  };
}();

var getTopic = exports.getTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(_ref8) {
    var teamId = _ref8.teamId;
    var id = _ref8.id;
    var params, data, topic;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            params = {
              TableName: topicTable,
              Key: { teamId: teamId, id: id }
            };
            _context9.next = 3;
            return _client2.default.get(params).promise();

          case 3:
            data = _context9.sent;
            topic = void 0;

            if (data.Item) {
              topic = (0, _client.fromDB)(Topic, data.Item);
            }
            return _context9.abrupt('return', topic);

          case 7:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));
  return function getTopic(_x9) {
    return ref.apply(this, arguments);
  };
}();

var getTopics = exports.getTopics = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(teamId) {
    var params, items;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            params = {
              TableName: topicTable,
              IndexName: 'TeamIdNameIndex',
              KeyConditionExpression: 'teamId = :teamId AND attribute_not_exists(isDefault)',
              ExpressionAttributeValues: {
                ':teamId': teamId
              }
            };
            _context10.next = 3;
            return _client2.default.queryAll(params);

          case 3:
            items = _context10.sent;
            return _context10.abrupt('return', items.map(function (item) {
              return (0, _client.fromDB)(Topic, item);
            }));

          case 5:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));
  return function getTopics(_x10) {
    return ref.apply(this, arguments);
  };
}();

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _reply = require('./reply');

var _topicItem = require('./topicItem');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var topicTable = (0, _client.resolveTableName)('topic-v1');
var topicNameTable = (0, _client.resolveTableName)('topic-name-v1');

var DUPLICATE_TOPIC_NAME_EXCEPTION = exports.DUPLICATE_TOPIC_NAME_EXCEPTION = 'DuplicateTopicNameException';

var Topic = exports.Topic = function Topic() {
  (0, _classCallCheck3.default)(this, Topic);
};