'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUsers = exports.updateUser = exports.getUser = exports.AnonymousUser = exports.User = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var getUser = exports.getUser = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(id) {
    var params, data, user;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            params = {
              TableName: table,
              Key: { id: id }
            };
            _context.next = 3;
            return _client2.default.get(params).promise();

          case 3:
            data = _context.sent;
            user = void 0;

            if (data.Item) {
              user = (0, _client.fromDB)(User, data.Item);
            }
            return _context.abrupt('return', user);

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function getUser(_x) {
    return ref.apply(this, arguments);
  };
}();

var updateUser = exports.updateUser = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(user) {
    var now, params, data;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            now = new Date().toISOString();
            params = {
              TableName: table,
              Key: { id: user.id },
              UpdateExpression: '\n      SET\n        #accessToken = :accessToken,\n        #scopes = :scopes,\n        #teamId = :teamId,\n        #user = :user,\n        #created = if_not_exists(#created, :created),\n        #changed = :changed\n    ',
              ExpressionAttributeNames: {
                '#accessToken': 'accessToken',
                '#scopes': 'scopes',
                '#teamId': 'teamId',
                '#user': 'user',
                '#created': 'created',
                '#changed': 'changed'
              },
              ExpressionAttributeValues: {
                ':accessToken': user.accessToken,
                ':scopes': user.scopes,
                ':teamId': user.teamId,
                ':user': user.user,
                ':created': now,
                ':changed': now
              },
              ReturnValues: 'ALL_NEW'
            };
            _context2.next = 4;
            return _client2.default.update(params).promise();

          case 4:
            data = _context2.sent;
            return _context2.abrupt('return', (0, _client.fromDB)(User, data.Attributes));

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function updateUser(_x2) {
    return ref.apply(this, arguments);
  };
}();

var getUsers = exports.getUsers = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(teamId) {
    var params, data;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            params = {
              TableName: table,
              FilterExpression: 'teamId = :teamId',
              ExpressionAttributeValues: {
                ':teamId': teamId
              }
            };
            _context3.next = 3;
            return _client2.default.scan(params).promise();

          case 3:
            data = _context3.sent;
            return _context3.abrupt('return', data.Items.map(function (item) {
              return (0, _client.fromDB)(User, item);
            }));

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function getUsers(_x3) {
    return ref.apply(this, arguments);
  };
}();

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var table = (0, _client.resolveTableName)('user-v1');

var User = exports.User = function User() {
  (0, _classCallCheck3.default)(this, User);
  this.anonymous = false;
};

var AnonymousUser = exports.AnonymousUser = function (_User) {
  (0, _inherits3.default)(AnonymousUser, _User);

  function AnonymousUser() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, AnonymousUser);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(AnonymousUser)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.anonymous = true, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return AnonymousUser;
}(User);