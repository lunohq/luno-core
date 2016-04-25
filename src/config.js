import { merge } from 'lodash'

const config = {}

// Generate config from process.env
const { env: { STAGE, AWS_REGION, ES_HOST, REDIS_HOST, REDIS_TIMEOUTS_REACTIONS } } = process
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
})

export default config
