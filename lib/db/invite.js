'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInvites = exports.deleteInvite = exports.getInvite = exports.createInvite = exports.Invite = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var createInvite = exports.createInvite = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref) {
    var teamId = _ref.teamId;
    var data = (0, _objectWithoutProperties3.default)(_ref, ['teamId']);
    var invite, now, params;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            invite = new Invite();

            (0, _assign2.default)(invite, data);
            invite.id = _nodeUuid2.default.v4();
            invite.teamId = teamId;

            now = new Date().toISOString();

            invite.created = now;
            invite.changed = now;

            params = {
              TableName: table,
              Item: invite
            };
            _context.next = 10;
            return _client2.default.put(params).promise();

          case 10:
            return _context.abrupt('return', invite);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function createInvite(_x) {
    return ref.apply(this, arguments);
  };
}();

var getInvite = exports.getInvite = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref2) {
    var id = _ref2.id;
    var teamId = _ref2.teamId;
    var userId = _ref2.userId;
    var params, data, invite;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (id || userId) {
              _context2.next = 2;
              break;
            }

            throw new Error('Must provide either "id" or "userId"');

          case 2:
            if (teamId) {
              _context2.next = 4;
              break;
            }

            throw new Error('"teamId" is required');

          case 4:
            params = {
              TableName: table
            };


            if (id) {
              params.Key = { id: id, teamId: teamId };
            } else {
              params.Key = { userId: userId, teamId: teamId };
              params.IndexName = 'InviteTeamIdUserId';
            }

            _context2.next = 8;
            return _client2.default.get(params).promise();

          case 8:
            data = _context2.sent;
            invite = void 0;

            if (data.Item) {
              invite = (0, _client.fromDB)(Invite, data.Item);
            }
            return _context2.abrupt('return', invite);

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function getInvite(_x2) {
    return ref.apply(this, arguments);
  };
}();

var deleteInvite = exports.deleteInvite = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref3) {
    var teamId = _ref3.teamId;
    var id = _ref3.id;
    var params, data;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            params = {
              TableName: table,
              Key: { teamId: teamId, id: id },
              ReturnValues: 'ALL_OLD'
            };
            _context3.next = 3;
            return _client2.default.delete(params).promise();

          case 3:
            data = _context3.sent;
            return _context3.abrupt('return', (0, _client.fromDB)(Invite, data.Attributes));

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function deleteInvite(_x3) {
    return ref.apply(this, arguments);
  };
}();

var getInvites = exports.getInvites = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(_ref4) {
    var teamId = _ref4.teamId;
    var params, items;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            params = {
              TableName: table,
              KeyConditionExpression: 'teamId = :teamId',
              ExpressionAttributeValues: {
                ':teamId': teamId
              },
              IndexName: 'InviteTeamIdCreated',
              ScanIndexForward: false
            };
            _context4.next = 3;
            return _client2.default.queryAll(params);

          case 3:
            items = _context4.sent;
            return _context4.abrupt('return', items.map(function (item) {
              return (0, _client.fromDB)(Invite, item);
            }));

          case 5:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return function getInvites(_x4) {
    return ref.apply(this, arguments);
  };
}();

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var table = (0, _client.resolveTableName)('invite-v1');

var Invite = exports.Invite = function Invite() {
  (0, _classCallCheck3.default)(this, Invite);
};