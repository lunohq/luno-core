'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteFiles = exports.getFiles = exports.getFile = exports.deleteFile = exports.createFile = exports.File = undefined;

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

var createFile = exports.createFile = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref) {
    var id = _ref.id;
    var teamId = _ref.teamId;
    var data = (0, _objectWithoutProperties3.default)(_ref, ['id', 'teamId']);
    var file, now, params;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            file = new File();

            (0, _assign2.default)(file, data);
            file.id = id;
            file.teamId = teamId;

            now = new Date().toISOString();

            file.created = now;
            file.changed = now;

            params = {
              TableName: table,
              Item: file
            };
            _context.next = 10;
            return _client2.default.put(params).promise();

          case 10:
            return _context.abrupt('return', file);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function createFile(_x) {
    return ref.apply(this, arguments);
  };
}();

var deleteFile = exports.deleteFile = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref2) {
    var id = _ref2.id;
    var teamId = _ref2.teamId;
    var params, data;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            params = {
              TableName: table,
              Key: { id: id, teamId: teamId },
              ReturnValues: 'ALL_OLD'
            };
            _context2.next = 3;
            return _client2.default.delete(params).promise();

          case 3:
            data = _context2.sent;
            return _context2.abrupt('return', (0, _client.fromDB)(File, data.Attributes));

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function deleteFile(_x2) {
    return ref.apply(this, arguments);
  };
}();

var getFile = exports.getFile = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref3) {
    var id = _ref3.id;
    var teamId = _ref3.teamId;
    var params, data, file;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            params = {
              TableName: table,
              Key: { id: id, teamId: teamId }
            };
            _context3.next = 3;
            return _client2.default.get(params).promise();

          case 3:
            data = _context3.sent;
            file = void 0;

            if (data.Item) {
              file = (0, _client.fromDB)(File, data.Item);
            }
            return _context3.abrupt('return', file);

          case 7:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function getFile(_x3) {
    return ref.apply(this, arguments);
  };
}();

var getFiles = exports.getFiles = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(_ref4) {
    var teamId = _ref4.teamId;
    var ids = _ref4.ids;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt('return', _client2.default.batchGetAll({ table: table, items: ids, getKey: function getKey(id) {
                return { teamId: teamId, id: id };
              } }));

          case 1:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return function getFiles(_x4) {
    return ref.apply(this, arguments);
  };
}();

var deleteFiles = exports.deleteFiles = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref5) {
    var teamId = _ref5.teamId;
    var ids = _ref5.ids;
    var keys;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            keys = ids.map(function (id) {
              return { teamId: teamId, id: id };
            });
            return _context5.abrupt('return', _client2.default.batchDeleteAll({ table: table, keys: keys }));

          case 2:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return function deleteFiles(_x5) {
    return ref.apply(this, arguments);
  };
}();

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var table = (0, _client.resolveTableName)('file-v1');

var File = exports.File = function File() {
  (0, _classCallCheck3.default)(this, File);
};