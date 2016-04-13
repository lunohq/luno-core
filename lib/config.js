'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var config = {};

// Generate config from process.env
var _process = process;
var _process$env = _process.env;
var STAGE = _process$env.STAGE;
var AWS_REGION = _process$env.AWS_REGION;
var ES_HOST = _process$env.ES_HOST;

(0, _lodash.merge)(config, { stage: STAGE, aws: { region: AWS_REGION }, es: { host: ES_HOST } });

exports.default = config;