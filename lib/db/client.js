'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.resolveTableName = resolveTableName;
exports.fromDB = fromDB;
exports.compositeId = compositeId;
exports.deconstructId = deconstructId;
exports.lock = lock;

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _redlock = require('redlock');

var _redlock2 = _interopRequireDefault(_redlock);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _getClient = require('../redis/getClient');

var _getClient2 = _interopRequireDefault(_getClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('core:db:client');

var Client = function (_AWS$DynamoDB$Documen) {
  (0, _inherits3.default)(Client, _AWS$DynamoDB$Documen);

  function Client() {
    (0, _classCallCheck3.default)(this, Client);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Client).apply(this, arguments));
  }

  (0, _createClass3.default)(Client, [{
    key: 'queryAll',


    /**
     * Return all items that match the query.
     *
     * @param {Object} params the query params
     * @param {Array} items array of items that will be returned
     */
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(params) {
        var items = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
        var data, LastEvaluatedKey, nextParams;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.query(params).promise();

              case 2:
                data = _context.sent;

                items.push.apply(items, (0, _toConsumableArray3.default)(data.Items));
                LastEvaluatedKey = data.LastEvaluatedKey;

                if (!LastEvaluatedKey) {
                  _context.next = 11;
                  break;
                }

                nextParams = (0, _assign2.default)({}, params, { LastEvaluatedKey: LastEvaluatedKey });
                _context.next = 9;
                return this.queryAll(nextParams, items);

              case 9:
                _context.next = 12;
                break;

              case 11:
                return _context.abrupt('return', items);

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function queryAll(_x, _x2) {
        return ref.apply(this, arguments);
      }

      return queryAll;
    }()

    /**
     * Return all items that match the scan.
     *
     * @param {Object} params the query params
     * @param {Array} items array of items that will be returned
     */

  }, {
    key: 'scanAll',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(params) {
        var items = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
        var data, LastEvaluatedKey, nextParams;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.scan(params).promise();

              case 2:
                data = _context2.sent;

                items.push.apply(items, (0, _toConsumableArray3.default)(data.Items));
                LastEvaluatedKey = data.LastEvaluatedKey;

                if (!LastEvaluatedKey) {
                  _context2.next = 11;
                  break;
                }

                nextParams = (0, _assign2.default)({}, params, { LastEvaluatedKey: LastEvaluatedKey });
                _context2.next = 9;
                return this.scanAll(nextParams, items);

              case 9:
                _context2.next = 12;
                break;

              case 11:
                return _context2.abrupt('return', items);

              case 12:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function scanAll(_x4, _x5) {
        return ref.apply(this, arguments);
      }

      return scanAll;
    }()
  }, {
    key: 'batchGetAll',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref) {
        var table = _ref.table;
        var items = _ref.items;
        var getKey = _ref.getKey;
        var results, batchSize, numBatches, i, params, data;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                results = [];
                batchSize = 25;
                numBatches = Math.floor(items.length / batchSize);

                if (items.length % batchSize) {
                  numBatches += 1;
                }
                i = 1;

              case 5:
                if (!(i <= numBatches)) {
                  _context3.next = 14;
                  break;
                }

                params = {
                  RequestItems: (0, _defineProperty3.default)({}, table, {
                    Keys: items.slice((i - 1) * batchSize, i * batchSize).map(getKey)
                  })
                };
                _context3.next = 9;
                return this.batchGet(params).promise();

              case 9:
                data = _context3.sent;

                if (data.Responses && data.Responses[table]) {
                  results.push.apply(results, (0, _toConsumableArray3.default)(data.Responses[table]));
                }

              case 11:
                i++;
                _context3.next = 5;
                break;

              case 14:
                return _context3.abrupt('return', results);

              case 15:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function batchGetAll(_x7) {
        return ref.apply(this, arguments);
      }

      return batchGetAll;
    }()
  }]);
  return Client;
}(_awsSdk2.default.DynamoDB.DocumentClient);

/**
 * Return a table name for the model based on env variables.
 *
 * @param {String} model model name
 * @return {String} resolved table name
 */


function resolveTableName(model) {
  return _config2.default.stage + '-' + model;
}

/**
 * Return a model type with the values from the db.
 *
 * @param {Type} Model type of model
 * @param {Object} data data to copy to the model
 * @return {Object} returns the inflated model
 */
function fromDB(Model, data) {
  var model = new Model();
  return (0, _assign2.default)(model, data);
}

/**
 * Helper for returning a composite key in our standard format.
 *
 * @param {Array[String]} parts composite id parts
 * @return {String} returns the composite id
 */
function compositeId() {
  for (var _len = arguments.length, parts = Array(_len), _key = 0; _key < _len; _key++) {
    parts[_key] = arguments[_key];
  }

  return parts.join('_');
}

/**
 * Helper for deconstructing a composite key in our standard format.
 *
 * @param {String} id composite id
 * @return {Array[String]} composite id parts
 */
function deconstructId(id) {
  return id.split('_');
}

/**
 * Helper for creating a lock during a transaction.
 *
 * @param {String} key key we're locking
 * @param {Number} ttl optional ttl for the lock
 * @return {Redlock} redlock
 */
function lock(key) {
  var ttl = arguments.length <= 1 || arguments[1] === undefined ? 5000 : arguments[1];

  var client = (0, _getClient2.default)();
  var redlock = new _redlock2.default([client], {
    retryCount: 3,
    retryDelay: 100,
    driftFactor: 0.01
  });
  return redlock.lock(key, ttl);
}

// XXX We shouldn't instantly connect to DynamoDB like this
exports.default = new Client();