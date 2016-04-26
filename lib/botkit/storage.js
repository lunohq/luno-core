'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _redlock = require('redlock');

var _redlock2 = _interopRequireDefault(_redlock);

var _team = require('../db/team');

var _user = require('../db/user');

var _bot = require('../db/bot');

var _getClient = require('../redis/getClient');

var _getClient2 = _interopRequireDefault(_getClient);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = void 0;
var redlock = void 0;

function retrieveClient() {
  if (!client) {
    client = (0, _getClient2.default)();
    redlock = new _redlock2.default([client], { retryCount: 0 });
  }
  return { client: client, redlock: redlock };
}

function reactionKey() {
  var parts = ['react'];
  parts.push.apply(parts, arguments);
  return parts.join(':');
}

exports.default = {
  teams: {
    get: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(id, cb) {
        var team;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                team = void 0;
                _context.prev = 1;
                _context.next = 4;
                return (0, _team.getTeam)(id);

              case 4:
                team = _context.sent;
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context['catch'](1);
                return _context.abrupt('return', cb(_context.t0));

              case 10:
                return _context.abrupt('return', cb(null, team));

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined, [[1, 7]]);
      }));
      return function get(_x, _x2) {
        return ref.apply(this, arguments);
      };
    }(),

    save: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref, cb) {
        var data = _ref.team;
        var isnew = _ref.isnew;
        var team;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                team = void 0;
                _context2.prev = 1;
                _context2.next = 4;
                return (0, _team.updateTeam)(data);

              case 4:
                team = _context2.sent;
                _context2.next = 10;
                break;

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2['catch'](1);
                return _context2.abrupt('return', cb(_context2.t0));

              case 10:
                if (!isnew) {
                  _context2.next = 19;
                  break;
                }

                _context2.prev = 11;
                _context2.next = 14;
                return (0, _bot.createBot)({ teamId: team.id });

              case 14:
                _context2.next = 19;
                break;

              case 16:
                _context2.prev = 16;
                _context2.t1 = _context2['catch'](11);
                return _context2.abrupt('return', cb(_context2.t1));

              case 19:
                return _context2.abrupt('return', cb(null, team));

              case 20:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined, [[1, 7], [11, 16]]);
      }));
      return function save(_x3, _x4) {
        return ref.apply(this, arguments);
      };
    }(),

    all: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(cb) {
        var teams;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                teams = void 0;
                _context3.prev = 1;
                _context3.next = 4;
                return (0, _team.getTeams)();

              case 4:
                teams = _context3.sent;
                _context3.next = 10;
                break;

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3['catch'](1);
                return _context3.abrupt('return', cb(_context3.t0));

              case 10:
                return _context3.abrupt('return', cb(null, teams));

              case 11:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, undefined, [[1, 7]]);
      }));
      return function all(_x5) {
        return ref.apply(this, arguments);
      };
    }()

  },
  users: {
    get: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(id, cb) {
        var user;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                user = void 0;
                _context4.prev = 1;
                _context4.next = 4;
                return (0, _user.getUser)(id);

              case 4:
                user = _context4.sent;
                _context4.next = 10;
                break;

              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4['catch'](1);
                return _context4.abrupt('return', cb(_context4.t0));

              case 10:
                return _context4.abrupt('return', cb(null, user));

              case 11:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, undefined, [[1, 7]]);
      }));
      return function get(_x6, _x7) {
        return ref.apply(this, arguments);
      };
    }(),

    save: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref2, cb) {
        var data = _ref2.user;
        var isnew = _ref2.isnew;
        var user;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                // transform values from slack to camelcase
                if (data.access_token) {
                  data.accessToken = data.access_token;
                  delete data.access_token;
                }

                if (data.team_id) {
                  data.teamId = data.team_id;
                  delete data.team_id;
                }

                user = void 0;
                _context5.prev = 3;
                _context5.next = 6;
                return (0, _user.updateUser)(data);

              case 6:
                user = _context5.sent;
                _context5.next = 12;
                break;

              case 9:
                _context5.prev = 9;
                _context5.t0 = _context5['catch'](3);
                return _context5.abrupt('return', cb(_context5.t0));

              case 12:
                return _context5.abrupt('return', cb(null, user));

              case 13:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, undefined, [[3, 9]]);
      }));
      return function save(_x8, _x9) {
        return ref.apply(this, arguments);
      };
    }(),

    // We should never want to return all the users in the system
    all: function all(cb) {
      return cb(new Error('Not implemented'));
    }
  },
  channels: {
    get: function get(_, cb) {
      return cb(new Error('Not implemented'));
    },
    save: function save(_, cb) {
      return cb(new Error('Not implemented'));
    },
    all: function all(cb) {
      return cb(new Error('Not implemented'));
    }
  },
  reactions: {
    listenTo: function listenTo(_ref3) {
      var ts = _ref3.ts;
      var channel = _ref3.channel;

      var _retrieveClient = retrieveClient();

      var client = _retrieveClient.client;

      var key = reactionKey(channel, ts);
      return client.setexAsync(key, _config2.default.redis.timeouts.reactions, true);
    },
    shouldRespond: function shouldRespond(_ref4) {
      var ts = _ref4.ts;
      var channel = _ref4.channel;
      return new _promise2.default(function () {
        var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(resolve, reject) {
          var _retrieveClient2, client, key, result;

          return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _retrieveClient2 = retrieveClient();
                  client = _retrieveClient2.client;
                  key = reactionKey(channel, ts);
                  result = void 0;
                  _context6.prev = 4;
                  _context6.next = 7;
                  return client.getAsync(key);

                case 7:
                  result = _context6.sent;
                  _context6.next = 13;
                  break;

                case 10:
                  _context6.prev = 10;
                  _context6.t0 = _context6['catch'](4);
                  return _context6.abrupt('return', reject(_context6.t0));

                case 13:
                  return _context6.abrupt('return', resolve(!!result));

                case 14:
                case 'end':
                  return _context6.stop();
              }
            }
          }, _callee6, undefined, [[4, 10]]);
        }));
        return function (_x10, _x11) {
          return ref.apply(this, arguments);
        };
      }());
    },
    clear: function clear(_ref5) {
      var ts = _ref5.ts;
      var channel = _ref5.channel;

      var _retrieveClient3 = retrieveClient();

      var client = _retrieveClient3.client;

      var key = reactionKey(channel, ts);
      return client.delAsync(key);
    }
  },
  mutex: {
    lock: function lock(_ref6, interval) {
      var botId = _ref6.botId;
      var channel = _ref6.channel;
      var ts = _ref6.ts;

      var key = 'bmutex:' + botId + ':' + channel + ':' + ts;

      var _retrieveClient4 = retrieveClient();

      var redlock = _retrieveClient4.redlock;

      return redlock.lock(key, interval);
    }
  }
};