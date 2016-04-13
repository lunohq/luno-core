'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Team = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

exports.getTeam = getTeam;
exports.updateTeam = updateTeam;
exports.getTeams = getTeams;

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var table = (0, _client.resolveTableName)('team-v1');

var Team = exports.Team = function Team() {
  (0, _classCallCheck3.default)(this, Team);
};

;

function getTeam(id) {
  var params = {
    TableName: table,
    Key: { id: id }
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.get(params, function (err, data) {
      if (err) return reject(err);

      var team = void 0;
      if (data.Item) {
        team = (0, _client.fromDB)(Team, data.Item);
      }

      return resolve(team);
    });
  });
}

function updateTeam(team) {

  // normalize to camel case
  team.bot.userId = team.bot.user_id;
  delete team.bot.user_id;

  var now = new Date().toISOString();
  var params = {
    TableName: table,
    Key: { id: team.id },
    UpdateExpression: '\n      SET\n        #createdBy = if_not_exists(createdBy, :createdBy),\n        #name = :name,\n        #slack = :slack,\n        #created = if_not_exists(#created, :created),\n        #changed = :changed\n    ',
    ExpressionAttributeNames: {
      '#createdBy': 'createdBy',
      '#name': 'name',
      '#slack': 'slack',
      '#created': 'created',
      '#changed': 'changed'
    },
    ExpressionAttributeValues: {
      ':createdBy': team.createdBy,
      ':name': team.name,
      ':slack': {
        bot: team.bot,
        url: team.url,
        token: team.token
      },
      ':created': now,
      ':changed': now
    },
    ReturnValues: 'ALL_NEW'
  };

  return new _promise2.default(function (resolve, reject) {
    _client2.default.update(params, function (err, data) {
      if (err) return reject(err);
      var team = (0, _client.fromDB)(Team, data.Attributes);
      return resolve(team);
    });
  });
}

function getTeams() {
  var params = {
    TableName: table
  };
  return new _promise2.default(function (resolve, reject) {
    _client2.default.query(params, function (err, data) {
      if (err) return reject(err);
      return resolve(data.Items.map(function (item) {
        return (0, _client.fromDB)(Team, item);
      }));
    });
  });
}