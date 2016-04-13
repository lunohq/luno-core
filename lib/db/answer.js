'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Answer = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

exports.createAnswer = createAnswer;
exports.getAnswer = getAnswer;
exports.getAnswers = getAnswers;
exports.deleteAnswer = deleteAnswer;
exports.updateAnswer = updateAnswer;

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var table = (0, _client.resolveTableName)('answer-v1');

var Answer = exports.Answer = function Answer() {
  (0, _classCallCheck3.default)(this, Answer);
};

;

function createAnswer(_ref) {
  var botId = _ref.botId;
  var data = (0, _objectWithoutProperties3.default)(_ref, ['botId']);

  var answer = new Answer();
  (0, _assign2.default)(answer, data);
  answer.id = _nodeUuid2.default.v4();
  answer.botId = botId;

  var now = new Date().toISOString();
  answer.created = now;
  answer.changed = now;

  var params = {
    TableName: table,
    Item: answer
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.put(params, function (err, data) {
      if (err) return reject(err);
      return resolve(answer);
    });
  });
}

function getAnswer(botId, id) {
  var params = {
    TableName: table,
    Key: { id: id, botId: botId }
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.get(params, function (err, data) {
      if (err) return reject(err);

      var answer = void 0;
      if (data.Item) {
        answer = (0, _client.fromDB)(Answer, data.Item);
      }

      return resolve(answer);
    });
  });
}

function getAnswers(botId) {
  var params = {
    TableName: table,
    KeyConditionExpression: 'botId = :botId',
    ExpressionAttributeValues: {
      ':botId': botId
    }
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.query(params, function (err, data) {
      if (err) return reject(err);
      return resolve(data.Items.map(function (item) {
        return (0, _client.fromDB)(Answer, item);
      }));
    });
  });
}

function deleteAnswer(botId, id) {
  var params = {
    TableName: table,
    Key: { id: id, botId: botId },
    ReturnValues: 'ALL_OLD'
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.delete(params, function (err, data) {
      if (err) return reject(err);
      return resolve((0, _client.fromDB)(Answer, data.Attributes));
    });
  });
}

function updateAnswer(_ref2) {
  var botId = _ref2.botId;
  var id = _ref2.id;
  var title = _ref2.title;
  var body = _ref2.body;

  var params = {
    TableName: table,
    Key: { id: id, botId: botId },
    UpdateExpression: '\n      SET\n        #title = :title,\n        #body = :body,\n        #changed = :changed\n    ',
    ExpressionAttributeNames: {
      '#title': 'title',
      '#body': 'body',
      '#changed': 'changed'
    },
    ExpressionAttributeValues: {
      ':title': title,
      ':body': body,
      ':changed': new Date().toISOString()
    },
    ReturnValues: 'ALL_NEW'
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.update(params, function (err, data) {
      if (err) return reject(err);
      return resolve((0, _client.fromDB)(Answer, data.Attributes));
    });
  });
}