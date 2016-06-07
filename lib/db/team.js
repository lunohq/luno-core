'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTeams = exports.updateTeam = exports.getTeam = exports.Team = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var getTeam = exports.getTeam = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(id) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var params, data, team;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            params = {
              TableName: table,
              Key: { id: id }
            };


            params = (0, _assign2.default)({}, options, params);
            _context.next = 4;
            return _client2.default.get(params).promise();

          case 4:
            data = _context.sent;
            team = void 0;

            if (data.Item) {
              team = (0, _client.fromDB)(Team, data.Item);
            }
            return _context.abrupt('return', team);

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function getTeam(_x, _x2) {
    return ref.apply(this, arguments);
  };
}();

/**
 * Convert our representation of a team to a slack team.
 *
 * @param {Team} team a team stored in the db
 * @return {Object} team as if it came from slack
 */


var updateTeam = exports.updateTeam = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(team) {
    var now, params, data;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:

            // TODO remove when we move away from botkit
            // normalize to camel case
            if (team.bot && team.bot.user_id) {
              team.bot.userId = team.bot.user_id;
              delete team.bot.user_id;
            }

            now = new Date().toISOString();
            params = {
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
                ':slack': team.slack,
                ':created': now,
                ':changed': now
              },
              ReturnValues: 'ALL_NEW'
            };
            _context2.next = 5;
            return _client2.default.update(params).promise();

          case 5:
            data = _context2.sent;
            return _context2.abrupt('return', (0, _client.fromDB)(Team, data.Attributes));

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function updateTeam(_x4) {
    return ref.apply(this, arguments);
  };
}();

var getTeams = exports.getTeams = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    var params, teams, items;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            params = {
              TableName: table
            };
            teams = void 0;
            _context3.next = 4;
            return _client2.default.scanAll(params);

          case 4:
            items = _context3.sent;

            if (items) {
              teams = items.map(function (item) {
                return (0, _client.fromDB)(Team, item);
              });
            }
            return _context3.abrupt('return', items);

          case 7:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function getTeams() {
    return ref.apply(this, arguments);
  };
}();

exports.toSlackTeam = toSlackTeam;

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var table = (0, _client.resolveTableName)('team-v1');

var Team = exports.Team = function Team() {
  (0, _classCallCheck3.default)(this, Team);
};

function toSlackTeam(_ref, _ref2) {
  var teamId = _ref.id;
  var createdBy = _ref.createdBy;
  var name = _ref.name;
  var slack = _ref.slack;
  var botId = _ref2.id;

  var slackTeam = (0, _assign2.default)({}, { createdBy: createdBy, name: name });
  slackTeam.bot = slack.bot;
  slackTeam.url = slack.url;
  slackTeam.token = slack.token;
  slackTeam.luno = {
    teamId: teamId,
    botId: botId
  };
  return slackTeam;
}