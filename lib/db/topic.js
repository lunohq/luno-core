'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTopics = exports.getTopicsWithIds = exports.getDefaultTopic = exports.getTopic = exports.isValidName = exports.deleteTopicName = exports.deleteTopic = exports.updateTopic = exports.createTopic = exports.Topic = exports.DUPLICATE_TOPIC_NAME_EXCEPTION = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var rollbackUpdateTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref) {
    var previousTopic = _ref.previousTopic;
    var res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            debug('Rolling back updateTopic', { previousTopic: previousTopic });
            _context.next = 3;
            return updateTopic((0, _extends3.default)({ rollback: true }, previousTopic));

          case 3:
            res = _context.sent;

            debug('Rolled back updateTopic', res);
            return _context.abrupt('return', res);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function rollbackUpdateTopic(_x) {
    return ref.apply(this, arguments);
  };
}();

var rollbackDeleteTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref2) {
    var topic = _ref2.topic;
    var replies = _ref2.replies;
    var promises, res;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            debug('Rolling back deleteTopic', { topic: topic, replies: replies });
            promises = [createTopic((0, _extends3.default)({}, topic))];

            if (replies.length) {
              (function () {
                var topicItems = [];
                replies.forEach(function (reply) {
                  var topicItem = (0, _topicItem.generateTopicItem)({
                    teamId: reply.teamId,
                    topicId: topic.id,
                    itemId: reply.id,
                    createdBy: reply.createdBy
                  });
                  topicItems.push(topicItem);
                });
                promises.push(_client2.default.batchWriteAll({ table: _reply.table, items: replies }));
                promises.push(_client2.default.batchWriteAll({ table: _topicItem.table, items: topicItems }));
                promises.push((0, _reply2.updateTopicName)({ teamId: topic.teamId, topicId: topic.id, name: topic.name, replies: replies }));
              })();
            }
            _context2.next = 5;
            return _promise2.default.all(promises);

          case 5:
            res = _context2.sent;

            debug('Rolled back deleteTopic', res);

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function rollbackDeleteTopic(_x2) {
    return ref.apply(this, arguments);
  };
}();

var validateName = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref3) {
    var teamId = _ref3.teamId;
    var name = _ref3.name;
    var id = _ref3.id;
    var validName;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return isValidName({ teamId: teamId, name: name, id: id });

          case 2:
            validName = _context3.sent;

            if (validName) {
              _context3.next = 5;
              break;
            }

            throw new _LunoError2.default('Duplicate team name', DUPLICATE_TOPIC_NAME_EXCEPTION);

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function validateName(_x3) {
    return ref.apply(this, arguments);
  };
}();

var createTopic = exports.createTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(_ref4) {
    var _ref4$id = _ref4.id;
    var id = _ref4$id === undefined ? _nodeUuid2.default.v4() : _ref4$id;
    var name = _ref4.name;
    var teamId = _ref4.teamId;
    var _ref4$rollback = _ref4.rollback;
    var rollback = _ref4$rollback === undefined ? false : _ref4$rollback;
    var data = (0, _objectWithoutProperties3.default)(_ref4, ['id', 'name', 'teamId', 'rollback']);
    var displayName, topic, now, params;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            displayName = name;

            name = name ? name.toLowerCase() : undefined;

            if (data.isDefault) {
              _context4.next = 5;
              break;
            }

            _context4.next = 5;
            return validateName({ teamId: teamId, name: name, id: id });

          case 5:
            topic = new Topic();

            (0, _assign2.default)(topic, data);
            topic.id = id;
            topic.teamId = teamId;
            topic.name = name;
            topic.displayName = displayName;

            if (!rollback) {
              now = new Date().toISOString();

              topic.created = now;
              topic.changed = now;
            }

            params = {
              TableName: topicTable,
              Item: topic
            };
            _context4.next = 15;
            return _client2.default.put(params).promise();

          case 15:
            return _context4.abrupt('return', topic);

          case 16:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return function createTopic(_x4) {
    return ref.apply(this, arguments);
  };
}();

var updateTopic = exports.updateTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref5) {
    var id = _ref5.id;
    var teamId = _ref5.teamId;
    var name = _ref5.name;
    var updatedBy = _ref5.updatedBy;
    var pointsOfContact = _ref5.pointsOfContact;
    var _ref5$changed = _ref5.changed;
    var changed = _ref5$changed === undefined ? new Date().toISOString() : _ref5$changed;
    var _ref5$rollback = _ref5.rollback;
    var rollback = _ref5$rollback === undefined ? false : _ref5$rollback;
    var displayName, results, previousTopic, params, data;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            // we can't return old and new values from dynamodb, so we have to fetch the
            // current topic so we can delete the name if necessary
            displayName = name;

            name = name.toLowerCase();
            _context5.next = 4;
            return _promise2.default.all([getTopic({ teamId: teamId, id: id }), validateName({ teamId: teamId, name: name, id: id })]);

          case 4:
            results = _context5.sent;
            previousTopic = results[0];
            params = {
              TableName: topicTable,
              Key: { id: id, teamId: teamId },
              UpdateExpression: '\n      SET\n        #pointsOfContact = :pointsOfContact\n        , #changed = :changed\n        , #name = :name\n        , #displayName = :displayName\n        ' + (updatedBy ? ', #updatedBy = :updatedBy' : '') + '\n    ',
              ExpressionAttributeNames: {
                '#pointsOfContact': 'pointsOfContact',
                '#changed': 'changed',
                '#name': 'name',
                '#displayName': 'displayName'
              },
              ExpressionAttributeValues: {
                ':pointsOfContact': pointsOfContact,
                ':changed': changed,
                ':name': name,
                ':displayName': displayName
              },
              ReturnValues: 'ALL_NEW'
            };


            if (updatedBy) {
              params.ExpressionAttributeNames['#updatedBy'] = 'updatedBy';
              params.ExpressionAttributeValues[':updatedBy'] = updatedBy;
            }

            _context5.next = 10;
            return _client2.default.update(params).promise();

          case 10:
            data = _context5.sent;

            if (!(name !== previousTopic.name)) {
              _context5.next = 23;
              break;
            }

            _context5.prev = 12;
            _context5.next = 15;
            return _promise2.default.all([deleteTopicName({ teamId: teamId, name: previousTopic.name.toLowerCase() }), (0, _reply2.updateTopicName)({ teamId: teamId, name: displayName, topicId: id })]);

          case 15:
            _context5.next = 23;
            break;

          case 17:
            _context5.prev = 17;
            _context5.t0 = _context5['catch'](12);

            if (rollback) {
              _context5.next = 22;
              break;
            }

            _context5.next = 22;
            return rollbackUpdateTopic({ previousTopic: previousTopic });

          case 22:
            throw _context5.t0;

          case 23:
            return _context5.abrupt('return', fromDB(Topic, data.Attributes));

          case 24:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[12, 17]]);
  }));
  return function updateTopic(_x5) {
    return ref.apply(this, arguments);
  };
}();

var deleteTopic = exports.deleteTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(_ref6) {
    var teamId = _ref6.teamId;
    var id = _ref6.id;
    var _ref6$rollback = _ref6.rollback;
    var rollback = _ref6$rollback === undefined ? false : _ref6$rollback;
    var params, data, topic, promises, replies;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
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
            _context6.prev = 2;
            _context6.next = 5;
            return _client2.default.delete(params).promise();

          case 5:
            data = _context6.sent;
            _context6.next = 12;
            break;

          case 8:
            _context6.prev = 8;
            _context6.t0 = _context6['catch'](2);

            if (!(_context6.t0.code !== 'ConditionalCheckFailedException')) {
              _context6.next = 12;
              break;
            }

            throw _context6.t0;

          case 12:
            topic = void 0;

            if (data) {
              topic = fromDB(Topic, data.Attributes);
            }

            promises = [];

            if (topic) {
              promises.push(deleteTopicName({ teamId: teamId, name: topic.name }));
              promises.push((0, _reply2.deleteTopic)({ teamId: teamId, topicId: id }));
            }

            _context6.next = 18;
            return (0, _reply.getRepliesForTopic)({ teamId: teamId, topicId: id });

          case 18:
            replies = _context6.sent;

            if (replies.length) {
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

            if (!promises.length) {
              _context6.next = 32;
              break;
            }

            _context6.prev = 21;
            _context6.next = 24;
            return _promise2.default.all(promises);

          case 24:
            _context6.next = 32;
            break;

          case 26:
            _context6.prev = 26;
            _context6.t1 = _context6['catch'](21);

            if (rollback) {
              _context6.next = 31;
              break;
            }

            _context6.next = 31;
            return rollbackDeleteTopic({ topic: topic, replies: replies });

          case 31:
            throw _context6.t1;

          case 32:
            return _context6.abrupt('return', topic);

          case 33:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[2, 8], [21, 26]]);
  }));
  return function deleteTopic(_x6) {
    return ref.apply(this, arguments);
  };
}();

var deleteTopicName = exports.deleteTopicName = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(_ref7) {
    var teamId = _ref7.teamId;
    var name = _ref7.name;
    var params, data;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            params = {
              TableName: topicNameTable,
              Key: { teamId: teamId, name: name },
              ConditionExpression: 'attribute_exists(#name)',
              ExpressionAttributeNames: {
                '#name': 'name'
              }
            };
            data = void 0;
            _context7.prev = 2;
            _context7.next = 5;
            return _client2.default.delete(params).promise();

          case 5:
            data = _context7.sent;
            _context7.next = 12;
            break;

          case 8:
            _context7.prev = 8;
            _context7.t0 = _context7['catch'](2);

            if (!(_context7.t0.code !== 'ConditionalCheckFailedException')) {
              _context7.next = 12;
              break;
            }

            throw _context7.t0;

          case 12:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this, [[2, 8]]);
  }));
  return function deleteTopicName(_x7) {
    return ref.apply(this, arguments);
  };
}();

var isValidName = exports.isValidName = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(_ref8) {
    var teamId = _ref8.teamId;
    var name = _ref8.name;
    var id = _ref8.id;
    var params;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            params = {
              TableName: topicNameTable,
              Item: { teamId: teamId, name: name },
              ConditionExpression: 'attribute_not_exists(#name) OR begins_with(#topicId, :topicId)',
              ExpressionAttributeNames: {
                '#name': 'name',
                '#topicId': 'topicId'
              },
              ExpressionAttributeValues: {
                ':topicId': id
              }
            };
            _context8.prev = 1;
            _context8.next = 4;
            return _client2.default.put(params).promise();

          case 4:
            _context8.next = 11;
            break;

          case 6:
            _context8.prev = 6;
            _context8.t0 = _context8['catch'](1);

            if (!(_context8.t0.code === 'ConditionalCheckFailedException')) {
              _context8.next = 10;
              break;
            }

            return _context8.abrupt('return', false);

          case 10:
            throw _context8.t0;

          case 11:
            return _context8.abrupt('return', true);

          case 12:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this, [[1, 6]]);
  }));
  return function isValidName(_x8) {
    return ref.apply(this, arguments);
  };
}();

var getTopic = exports.getTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(_ref9) {
    var teamId = _ref9.teamId;
    var id = _ref9.id;
    var params, data, topic;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            params = {
              TableName: topicTable,
              Key: { id: id, teamId: teamId }
            };
            _context9.next = 3;
            return _client2.default.get(params).promise();

          case 3:
            data = _context9.sent;
            topic = void 0;

            if (data.Item) {
              topic = fromDB(Topic, data.Item);
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

var getDefaultTopic = exports.getDefaultTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(teamId) {
    var params, data, topic;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
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
            _context10.next = 3;
            return _client2.default.query(params).promise();

          case 3:
            data = _context10.sent;
            topic = void 0;

            if (data.Items && data.Items.length) {
              topic = fromDB(Topic, data.Items[0]);
            }
            return _context10.abrupt('return', topic);

          case 7:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));
  return function getDefaultTopic(_x10) {
    return ref.apply(this, arguments);
  };
}();

var getTopicsWithIds = exports.getTopicsWithIds = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(_ref10) {
    var teamId = _ref10.teamId;
    var topicIds = _ref10.topicIds;
    var params, data, topics;
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            params = {
              RequestItems: (0, _defineProperty3.default)({}, topicTable, {
                Keys: topicIds.map(function (topicId) {
                  return { teamId: teamId, id: topicId };
                })
              })
            };
            _context11.next = 3;
            return _client2.default.batchGet(params).promise();

          case 3:
            data = _context11.sent;
            topics = [];

            if (data.Responses && data.Responses[topicTable]) {
              topics = data.Responses[topicTable].map(function (topic) {
                return fromDB(Topic, topic);
              });
            }
            return _context11.abrupt('return', topics);

          case 7:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));
  return function getTopicsWithIds(_x11) {
    return ref.apply(this, arguments);
  };
}();

var getTopic = exports.getTopic = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(_ref11) {
    var teamId = _ref11.teamId;
    var id = _ref11.id;
    var params, data, topic;
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            params = {
              TableName: topicTable,
              Key: { teamId: teamId, id: id }
            };
            _context12.next = 3;
            return _client2.default.get(params).promise();

          case 3:
            data = _context12.sent;
            topic = void 0;

            if (data.Item) {
              topic = fromDB(Topic, data.Item);
            }
            return _context12.abrupt('return', topic);

          case 7:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));
  return function getTopic(_x12) {
    return ref.apply(this, arguments);
  };
}();

var getTopics = exports.getTopics = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(teamId) {
    var params, items;
    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            params = {
              TableName: topicTable,
              IndexName: 'TeamIdNameIndexV2',
              KeyConditionExpression: 'teamId = :teamId',
              ExpressionAttributeValues: {
                ':teamId': teamId
              }
            };
            _context13.next = 3;
            return _client2.default.queryAll(params);

          case 3:
            items = _context13.sent;
            return _context13.abrupt('return', items.map(function (item) {
              return fromDB(Topic, item);
            }));

          case 5:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, this);
  }));
  return function getTopics(_x13) {
    return ref.apply(this, arguments);
  };
}();

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _LunoError = require('../LunoError');

var _LunoError2 = _interopRequireDefault(_LunoError);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _reply = require('./reply');

var _reply2 = require('../es/reply');

var _topicItem = require('./topicItem');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('core:db:topic');

var topicTable = (0, _client.resolveTableName)('topic-v1');
var topicNameTable = (0, _client.resolveTableName)('topic-name-v1');

var DUPLICATE_TOPIC_NAME_EXCEPTION = exports.DUPLICATE_TOPIC_NAME_EXCEPTION = 'DuplicateTopicNameException';

var Topic = exports.Topic = function Topic() {
  (0, _classCallCheck3.default)(this, Topic);
};

function fromDB(model, item) {
  var res = (0, _client.fromDB)(model, item);
  res.name = res.displayName;
  return res;
}