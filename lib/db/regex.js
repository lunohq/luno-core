'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Regex = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

exports.createRegex = createRegex;
exports.getRegexes = getRegexes;
exports.getRegex = getRegex;
exports.deleteRegex = deleteRegex;
exports.updateRegex = updateRegex;

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var table = (0, _client.resolveTableName)('regex-v1');

var Regex = exports.Regex = function Regex() {
  (0, _classCallCheck3.default)(this, Regex);
};

;

function createRegex(_ref) {
  var botId = _ref.botId;
  var data = (0, _objectWithoutProperties3.default)(_ref, ['botId']);

  var regexResponse = new Regex();
  (0, _assign2.default)(regexResponse, data);
  regexResponse.id = _nodeUuid2.default.v4();
  regexResponse.botId = botId;

  var now = new Date().toISOString();
  regexResponse.created = now;
  regexResponse.changed = now;

  var params = {
    TableName: table,
    Item: regexResponse
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.put(params, function (err, data) {
      if (err) return reject(err);

      return resolve(regexResponse);
    });
  });
}

function getRegexes(botId) {
  var params = {
    TableName: table,
    KeyConditionExpression: 'botId = :botId',
    ExpressionAttributeValues: {
      ':botId': botId
    },
    IndexName: 'RegexBotIdPosition'
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.queryAll(params, function (err, items) {
      if (err) return reject(err);
      return resolve(items.map(function (item) {
        return (0, _client.fromDB)(Regex, item);
      }));
    });
  });
}

function getRegex(id) {
  var params = {
    TableName: table,
    Key: { id: id }
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.get(params, function (err, data) {
      if (err) return reject(err);

      var regexResponse = void 0;
      if (data.Item) {
        regexResponse = (0, _client.fromDB)(Regex, data.Item);
      }

      return resolve(regexResponse);
    });
  });
}

function deleteRegex(botId, id) {
  var params = {
    TableName: table,
    Key: { id: id, botId: botId },
    ReturnValues: 'ALL_OLD'
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.delete(params, function (err, data) {
      if (err) return reject(err);
      return resolve((0, _client.fromDB)(Regex, data.Attributes));
    });
  });
}

function updateRegex(_ref2) {
  var botId = _ref2.botId;
  var id = _ref2.id;
  var regex = _ref2.regex;
  var body = _ref2.body;
  var position = _ref2.position;

  var now = new Date().toISOString();
  var params = {
    TableName: table,
    Key: { id: regexResponse },
    UpdateExpression: '\n      SET\n        #regex = :regex,\n        #body = :body,\n        #changed = :changed,\n        #position = :position\n    ',
    ExpressionAttributeNames: {
      '#regex': 'regex',
      '#body': 'body',
      '#changed': 'changed',
      '#position': 'position'
    },
    ExpressionAttributeValues: {
      ':regex': regex,
      ':body': body,
      ':changed': new Date().toISOString(),
      ':position': position
    },
    ReturnValues: 'ALL_NEW'
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.update(params, function (err, data) {
      if (err) return reject(err);
      var regex = (0, _client.fromDB)(Regex, data.Attributes);
      return resolve(regex);
    });
  });
}