import { merge } from 'lodash'

const config = {}

// Generate config from process.env
const {
  env: {
    STAGE,
    AWS_REGION,
    ES_HOST,
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
    host: ES_HOST,
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
