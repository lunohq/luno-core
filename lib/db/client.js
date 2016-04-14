'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
     * @param {Function} cb callback
     * @param {Array} items array of items that will be returned
     */
    value: function queryAll(params, cb) {
      var _this2 = this;

      var items = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

      this.query(params, function (err, data) {
        if (err) return cb(err);
        items.push.apply(items, (0, _toConsumableArray3.default)(data.Items));
        var LastEvaluatedKey = data.LastEvaluatedKey;

        if (LastEvaluatedKey) {
          var nextParams = (0, _assign2.default)({}, params, { LastEvaluatedKey: LastEvaluatedKey });
          _this2.queryAll(nextParams, cb, items);
        } else {
          cb(null, items);
        }
      });
    }
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
 * Helper for deconstructing a composite key in our standard foramt.
 *
 * @param {String} id composite id
 * @return {Array[String]} composite id parts
 */
function deconstructId(id) {
  return id.split('_');
}

// XXX We shouldn't instantly connect to DynamoDB like this
exports.default = new Client();