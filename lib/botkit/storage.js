'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _thread = require('../db/thread');

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
                return (0, _bot.createBot)({ teamId: team.id, purpose: team.name });

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
    listenTo: function listenTo(_ref3, payload) {
      var ts = _ref3.ts;
      var channel = _ref3.channel;

      var _retrieveClient = retrieveClient();

      var client = _retrieveClient.client;

      var key = reactionKey(channel, ts);
      return client.setexAsync(key, _config2.default.redis.timeouts.reactions, payload);
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
                  return _context6.abrupt('return', resolve(result));

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
    lockMessage: function lockMessage(_ref6, interval) {
      var botId = _ref6.botId;
      var channel = _ref6.channel;
      var ts = _ref6.ts;

      var key = 'bmutex:' + botId + ':' + channel + ':' + ts;

      var _retrieveClient4 = retrieveClient();

      var redlock = _retrieveClient4.redlock;

      return redlock.lock(key, interval);
    },
    lockThread: function lockThread(_ref7, interval) {
      var botId = _ref7.botId;
      var channel = _ref7.channel;
      var user = _ref7.user;

      var key = 'bmutex:' + botId + ':' + channel + ':' + user;

      var _retrieveClient5 = retrieveClient();

      var redlock = _retrieveClient5.redlock;

      return redlock.lock(key, interval);
    }
  },
  threads: {
    getOrOpen: function getOrOpen(_ref8) {
      var botId = _ref8.botId;
      var channel = _ref8.channel;
      var user = _ref8.user;
      return new _promise2.default(function () {
        var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(resolve, reject) {
          var response, thread;
          return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  response = void 0;
                  _context7.prev = 1;
                  _context7.next = 4;
                  return (0, _thread.getOpenThread)({ botId: botId, channelId: channel, userId: user });

                case 4:
                  response = _context7.sent;
                  _context7.next = 10;
                  break;

                case 7:
                  _context7.prev = 7;
                  _context7.t0 = _context7['catch'](1);
                  return _context7.abrupt('return', reject(_context7.t0));

                case 10:
                  if (response.thread) {
                    _context7.next = 21;
                    break;
                  }

                  _context7.prev = 11;
                  _context7.next = 14;
                  return (0, _thread.createThread)({ botId: botId, channelId: channel, userId: user });

                case 14:
                  thread = _context7.sent;

                  response = { thread: thread, events: [] };
                  _context7.next = 21;
                  break;

                case 18:
                  _context7.prev = 18;
                  _context7.t1 = _context7['catch'](11);
                  return _context7.abrupt('return', reject(_context7.t1));

                case 21:
                  return _context7.abrupt('return', resolve(response));

                case 22:
                case 'end':
                  return _context7.stop();
              }
            }
          }, _callee7, undefined, [[1, 7], [11, 18]]);
        }));
        return function (_x12, _x13) {
          return ref.apply(this, arguments);
        };
      }());
    },
    open: function open(_ref9) {
      var botId = _ref9.botId;
      var channel = _ref9.channel;
      var user = _ref9.user;
      return new _promise2.default(function () {
        var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(resolve, reject) {
          var response, thread;
          return _regenerator2.default.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  response = {};
                  _context8.prev = 1;
                  _context8.next = 4;
                  return (0, _thread.createThread)({ botId: botId, channelId: channel, userId: user });

                case 4:
                  thread = _context8.sent;

                  response = { thread: thread, events: [] };
                  _context8.next = 11;
                  break;

                case 8:
                  _context8.prev = 8;
                  _context8.t0 = _context8['catch'](1);
                  return _context8.abrupt('return', reject(_context8.t0));

                case 11:
                  return _context8.abrupt('return', resolve(response));

                case 12:
                case 'end':
                  return _context8.stop();
              }
            }
          }, _callee8, undefined, [[1, 8]]);
        }));
        return function (_x14, _x15) {
          return ref.apply(this, arguments);
        };
      }());
    },
    close: function close(_ref10) {
      var params = _ref10.thread;
      return new _promise2.default(function () {
        var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(resolve, reject) {
          var thread;
          return _regenerator2.default.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  thread = void 0;
                  _context9.prev = 1;
                  _context9.next = 4;
                  return (0, _thread.closeThread)(params);

                case 4:
                  thread = _context9.sent;
                  _context9.next = 10;
                  break;

                case 7:
                  _context9.prev = 7;
                  _context9.t0 = _context9['catch'](1);
                  return _context9.abrupt('return', reject(_context9.t0));

                case 10:
                  return _context9.abrupt('return', resolve(thread));

                case 11:
                case 'end':
                  return _context9.stop();
              }
            }
          }, _callee9, undefined, [[1, 7]]);
        }));
        return function (_x16, _x17) {
          return ref.apply(this, arguments);
        };
      }());
    },
    receive: function receive(_ref11) {
      var message = _ref11.message;
      var thread = _ref11.thread;
      return new _promise2.default(function () {
        var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(resolve, reject) {
          var _message, messageId, threadId, botId, channelId, response;

          return _regenerator2.default.wrap(function _callee10$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  message = (0, _assign2.default)({}, message);
                  delete message.luno;

                  _message = message;
                  messageId = _message.ts;
                  threadId = thread.id;
                  botId = thread.botId;
                  channelId = thread.channelId;
                  response = void 0;
                  _context10.prev = 8;
                  _context10.next = 11;
                  return (0, _thread.createEvent)({ threadId: threadId, botId: botId, channelId: channelId, messageId: messageId, message: message });

                case 11:
                  response = _context10.sent;
                  _context10.next = 17;
                  break;

                case 14:
                  _context10.prev = 14;
                  _context10.t0 = _context10['catch'](8);
                  return _context10.abrupt('return', reject(_context10.t0));

                case 17:
                  return _context10.abrupt('return', resolve(response));

                case 18:
                case 'end':
                  return _context10.stop();
              }
            }
          }, _callee10, undefined, [[8, 14]]);
        }));
        return function (_x18, _x19) {
          return ref.apply(this, arguments);
        };
      }());
    },
    send: function send(_ref12) {
      var message = _ref12.message;
      var thread = _ref12.thread;
      return new _promise2.default(function () {
        var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(resolve, reject) {
          var threadId, botId, channelId, messageId, response;
          return _regenerator2.default.wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  threadId = thread.id;
                  botId = thread.botId;
                  channelId = thread.channelId;
                  messageId = void 0;

                  if (message.ts) {
                    messageId = message.ts;
                  }

                  response = void 0;
                  _context11.prev = 6;
                  _context11.next = 9;
                  return (0, _thread.createEvent)({ threadId: threadId, botId: botId, channelId: channelId, message: message, messageId: messageId });

                case 9:
                  response = _context11.sent;
                  _context11.next = 15;
                  break;

                case 12:
                  _context11.prev = 12;
                  _context11.t0 = _context11['catch'](6);
                  return _context11.abrupt('return', reject(_context11.t0));

                case 15:
                  return _context11.abrupt('return', resolve(response));

                case 16:
                case 'end':
                  return _context11.stop();
              }
            }
          }, _callee11, undefined, [[6, 12]]);
        }));
        return function (_x20, _x21) {
          return ref.apply(this, arguments);
        };
      }());
    },
    log: function log(_ref13) {
      var thread = _ref13.thread;
      var event = _ref13.event;
      return new _promise2.default(function () {
        var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(resolve, reject) {
          var threadId, botId, channelId, response;
          return _regenerator2.default.wrap(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  threadId = thread.id;
                  botId = thread.botId;
                  channelId = thread.channelId;
                  response = void 0;
                  _context12.prev = 4;
                  _context12.next = 7;
                  return (0, _thread.createEvent)((0, _extends3.default)({ threadId: threadId, botId: botId, channelId: channelId }, event));

                case 7:
                  response = _context12.sent;
                  _context12.next = 13;
                  break;

                case 10:
                  _context12.prev = 10;
                  _context12.t0 = _context12['catch'](4);
                  return _context12.abrupt('return', reject(_context12.t0));

                case 13:
                  return _context12.abrupt('return', resolve(response));

                case 14:
                case 'end':
                  return _context12.stop();
              }
            }
          }, _callee12, undefined, [[4, 10]]);
        }));
        return function (_x22, _x23) {
          return ref.apply(this, arguments);
        };
      }());
    }
  }
};