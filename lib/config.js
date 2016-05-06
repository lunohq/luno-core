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
var REDIS_HOST = _process$env.REDIS_HOST;
var REDIS_TIMEOUTS_REACTIONS = _process$env.REDIS_TIMEOUTS_REACTIONS;
var SNS_TOPIC_NEW_USER = _process$env.SNS_TOPIC_NEW_USER;
var SNS_TOPIC_NEW_TEAM = _process$env.SNS_TOPIC_NEW_TEAM;


(0, _lodash.merge)(config, {
  stage: STAGE,
  aws: {
    region: AWS_REGION
  },
  es: {
    host: ES_HOST
  },
  redis: {
    host: REDIS_HOST,
    timeouts: {
      reactions: REDIS_TIMEOUTS_REACTIONS || 60
    }
  },
  sns: {
    topic: {
      newUser: SNS_TOPIC_NEW_USER,
      newTeam: SNS_TOPIC_NEW_TEAM
    }
  }
});

exports.default = config;