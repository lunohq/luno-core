'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.resolveTableName = resolveTableName;
exports.fromDB = fromDB;
exports.compositeId = compositeId;
exports.deconstructId = deconstructId;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Return a table name for the model based on env variables.
 *
 * @param {String} model model name
 * @return {String} resolved table name
 */
function resolveTableName(model) {
  var _process = process;
  var STAGE = _process.env.STAGE;

  return STAGE + '-' + model;
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

exports.default = function () {
  var AWS = require('aws-sdk');
  var DocumentClient = AWS.DynamoDB.DocumentClient;
  return new DocumentClient();
}();