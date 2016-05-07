import AWS from 'aws-sdk'
import getClient from './redis/getClient'
import config from './config'

const events = {
  CREATE_TEAM: 'CREATE_TEAM',
  CREATE_USER: 'CREATE_USER',
}

const handlers = {}

let client
let subscribed = false
const sns = new AWS.SNS()

/**
 * Publish an event, instantiating the redis client if necessary
 *
 * @param {String} event an event to publish
 * @param {String} message message to publish
 * @param {Object} notification instructions on how to publish to sns
 */
function publish(event, message, notification) {
  return new Promise(async (resolve, reject) => {
    if (!client) {
      client = getClient()
    }

    let result
    try {
      result = await client.publishAsync(event, message)
    } catch (err) {
      return reject(err)
    }
    console.log('sns notification', notification)
    if (notification) {
      console.log('publishing to sns')
      return resolve(sns.publish(notification).promise())
    }
    return resolve()
  })
}

/**
 * Ensure the redis client is subscribed to any messages that are published.
 */
function ensureSubscribed() {
  if (!client) {
    client = getClient()
  }

  if (!subscribed) {
    subscribed = true
    client.on('message', (channel, message) => {
      const funcs = handlers[channel] || []
      for (const func of funcs) {
        func(channel, message)
      }
    })
  }
}

/**
 * Register a handler for an event.
 *
 * Each time the event is published, the handler will be invoked.
 *
 * @param {String} event the event to register for
 * @param {Function} handler the handler to register
 */
function registerHandler(event, handler) {
  ensureSubscribed()

  if (handlers[event] === undefined) {
    handlers[event] = []
  }

  if (!client) {
    client = getClient()
  }
  client.subscribe(event)

  const funcs = handlers[event]
  if (funcs.indexOf(handler) === -1) {
    funcs.push(handler)
  }
}

export default {
  publish: {
    createTeam(teamId) {
      const notification = {
        Subject: 'New Team',
        Message: JSON.stringify({ teamId }),
        TopicArn: config.sns.topic.newTeam,
      }
      return publish(events.CREATE_TEAM, teamId, notification)
    },
    createUser(teamId, userId) {
      const payload = JSON.stringify({ teamId, userId })
      const notification = {
        Subject: 'New User',
        Message: payload,
        TopicArn: config.sns.topic.newUser,
      }
      return publish(events.CREATE_USER, payload, notification)
    },
  },
  handle: {
    createTeam(handler) {
      function _handler(channel, message) {
        handler(message)
      }
      registerHandler(events.CREATE_TEAM, _handler)
    },
    createUser(handler) {
      function _handler(channel, message) {
        handler(message)
      }
      registerHandler(events.CREATE_USER, _handler)
    },
  },
}
