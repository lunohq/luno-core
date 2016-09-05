import { merge } from 'lodash'

const config = {}

// Generate config from process.env
const {
  env: {
    STAGE,
    AWS_REGION,
    ES_HOST,
    ES_EXPLAIN_TIMEOUT,
    ES_REPLY_MINIMUM_SHOULD_MATCH,
    REDIS_HOST,
    REDIS_TIMEOUTS_REACTIONS,
    SNS_TOPIC_NEW_USER,
    SNS_TOPIC_NEW_TEAM,
  },
} = process

merge(config, {
  stage: STAGE,
  aws: {
    region: AWS_REGION,
  },
  es: {
    region: AWS_REGION,
    host: ES_HOST,
    explain: {
      timeout: ES_EXPLAIN_TIMEOUT || 5000,
    },
    reply: {
      minimum_should_match: ES_REPLY_MINIMUM_SHOULD_MATCH || '75%',
    },
  },
  redis: {
    host: REDIS_HOST,
    timeouts: {
      reactions: REDIS_TIMEOUTS_REACTIONS || 60,
    },
  },
  sns: {
    topic: {
      newUser: SNS_TOPIC_NEW_USER,
      newTeam: SNS_TOPIC_NEW_TEAM,
    },
  },
})

export default config
