'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _team = require('../db/team');

var _user = require('../db/user');

var _bot = require('../db/bot');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  teams: {
    get: function get(id) {
      return (0, _team.getTeam)(id);
    },
    save: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref) {
        var data = _ref.team;
        var isNew = _ref.isNew;
        var team;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _team.updateTeam)(data);

              case 2:
                team = _context.sent;

                if (!isNew) {
                  _context.next = 6;
                  break;
                }

                _context.next = 6;
                return (0, _bot.createBot)({ teamId: team.id, purpose: team.name });

              case 6:
                return _context.abrupt('return', team);

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));
      return function save(_x) {
        return ref.apply(this, arguments);
      };
    }()
  },
  users: {
    get: function get(id) {
      return (0, _user.getUser)(id);
    },
    save: function save(_ref2) {
      var data = _ref2.user;
      return (0, _user.updateUser)(data);
    }
  }
};