'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bot = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

exports.createBot = createBot;
exports.getBot = getBot;
exports.getBots = getBots;
exports.allBots = allBots;
exports.updatePointsOfContact = updatePointsOfContact;
exports.updatePurpose = updatePurpose;

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var table = (0, _client.resolveTableName)('bot-v1');

var Bot = exports.Bot = function Bot() {
  (0, _classCallCheck3.default)(this, Bot);
};

function createBot(data) {
  var bot = new Bot();
  var now = new Date().toISOString();

  (0, _assign2.default)(bot, data);
  bot.id = _nodeUuid2.default.v4();
  bot.created = now;
  bot.changed = now;

  var params = {
    TableName: table,
    Item: bot
  };
  return new _promise2.default(function (resolve, reject) {
    _client2.default.put(params, function (err, data) {
      if (err) return reject(err);
      return resolve(bot);
    });
  });
}

function getBot(teamId, id) {
  return new _promise2.default(function (resolve, reject) {
    var params = {
      TableName: table,
      Key: { teamId: teamId, id: id }
    };

    _client2.default.get(params, function (err, data) {
      if (err) return reject(err);
      var bot = (0, _client.fromDB)(Bot, data.Item);
      return resolve(bot);
    });
  });
}

function getBots(teamId) {
  return new _promise2.default(function (resolve, reject) {
    var params = {
      TableName: table,
      KeyConditionExpression: 'teamId = :teamId',
      ExpressionAttributeValues: {
        ':teamId': teamId
      }
    };

    _client2.default.query(params, function (err, data) {
      if (err) return reject(err);
      return resolve(data.Items.map(function (item) {
        return (0, _client.fromDB)(Bot, item);
      }));
    });
  });
}

function allBots() {
  return new _promise2.default(function (resolve, reject) {
    var params = {
      TableName: table
    };

    _client2.default.scan(params, function (err, data) {
      if (err) return reject(err);
      return resolve(data.Items.map(function (item) {
        return (0, _client.fromDB)(Bot, item);
      }));
    });
  });
}

function update(params) {
  return new _promise2.default(function (resolve, reject) {
    _client2.default.update(params, function (err, data) {
      if (err) return reject(err);
      var bot = (0, _client.fromDB)(Bot, data.Attributes);
      return resolve(bot);
    });
  });
}

function updatePointsOfContact(_ref) {
  var id = _ref.id;
  var teamId = _ref.teamId;
  var pointsOfContact = _ref.pointsOfContact;

  var now = new Date().toISOString();
  var params = {
    TableName: table,
    Key: { id: id, teamId: teamId },
    UpdateExpression: '\n      SET\n        #pointsOfContact = :pointsOfContact,\n        #changed = :changed\n    ',
    ExpressionAttributeNames: {
      '#pointsOfContact': 'pointsOfContact',
      '#changed': 'changed'
    },
    ExpressionAttributeValues: {
      ':pointsOfContact': pointsOfContact,
      ':changed': now
    },
    ReturnValues: 'ALL_NEW'
  };
  return update(params);
}

function updatePurpose(_ref2) {
  var id = _ref2.id;
  var teamId = _ref2.teamId;
  var purpose = _ref2.purpose;

  var now = new Date().toISOString();
  var params = {
    TableName: table,
    Key: { id: id, teamId: teamId },
    UpdateExpression: '\n      SET\n        #purpose = :purpose,\n        #changed = :changed\n    ',
    ExpressionAttributeNames: {
      '#purpose': 'purpose',
      '#changed': 'changed'
    },
    ExpressionAttributeValues: {
      ':purpose': purpose,
      ':changed': now
    },
    ReturnValues: 'ALL_NEW'
  };
  return update(params);
}