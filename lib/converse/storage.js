'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _team2 = require('../db/team');

var _user = require('../db/user');

var _bot = require('../db/bot');

var _topic = require('../db/topic');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('core:converse:storage');

exports.default = {
  teams: {
    get: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(id) {
        var team, _team, slack, other;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _team2.getTeam)(id);

              case 2:
                team = _context.sent;

                if (team) {
                  _team = team;
                  slack = _team.slack;
                  other = (0, _objectWithoutProperties3.default)(_team, ['slack']);

                  debug('Translating slack back to team', { other: other, slack: slack });
                  team = (0, _assign2.default)(other, slack);
                  // Converse expects accessToken
                  if (team.bot && team.bot.token && !team.bot.accessToken) {
                    team.bot.accessToken = team.bot.token;
                  }
                }
                return _context.abrupt('return', team);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));
      return function get(_x) {
        return ref.apply(this, arguments);
      };
    }(),
    save: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref) {
        var data = _ref.team;
        var isNew = _ref.isNew;
        var bot, url, domain, other, team;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                bot = data.bot;
                url = data.url;
                domain = data.domain;
                other = (0, _objectWithoutProperties3.default)(data, ['bot', 'url', 'domain']);

                if (!other.slack) {
                  other.slack = {};
                }

                if (bot) {
                  other.slack.bot = bot;
                }

                if (url) {
                  other.slack.url = url;
                }

                if (domain) {
                  other.slack.domain = domain;
                }

                if (other.slack && other.slack.bot && other.slack.bot.accessToken) {
                  // Stick with the old way of storing tokens
                  other.slack.bot.token = other.slack.bot.accessToken;
                  delete other.slack.bot.accessToken;
                }

                _context2.next = 11;
                return (0, _team2.updateTeam)(other);

              case 11:
                team = _context2.sent;

                if (!isNew) {
                  _context2.next = 23;
                  break;
                }

                _context2.t0 = _promise2.default;
                _context2.next = 16;
                return (0, _bot.createBot)({ teamId: team.id, purpose: team.name });

              case 16:
                _context2.t1 = _context2.sent;
                _context2.next = 19;
                return (0, _topic.createTopic)({ teamId: team.id, isDefault: true });

              case 19:
                _context2.t2 = _context2.sent;
                _context2.t3 = [_context2.t1, _context2.t2];
                _context2.next = 23;
                return _context2.t0.all.call(_context2.t0, _context2.t3);

              case 23:
                return _context2.abrupt('return', team);

              case 24:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));
      return function save(_x2) {
        return ref.apply(this, arguments);
      };
    }()
  },
  users: {
    get: function get(id) {
      return (0, _user.getUser)(id);
    },
    save: function save(_ref2) {
      var user = _ref2.user;
      return (0, _user.updateUser)(user);
    }
  }
};