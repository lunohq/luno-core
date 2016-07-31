import bluebird from 'bluebird'
import redis from 'redis'

import config from '../config'

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

export default function() {
  return redis.createClient({
    host: config.redis.host,
  })
}
