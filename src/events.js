import getClient from './redis/getClient'

const events = {
  CREATE_TEAM: 'CREATE_TEAM',
}

const handlers = {}

let client
let subscribed = false

/**
 * Publish an event, instantiating the redis client if necessary
 *
 * @param {String} event an event to publish
 * @param {String} message message to publish
 */
function publish(event, message) {
  if (!client) {
    client = getClient()
  }
  client.publish(event, message)
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
      publish(events.CREATE_TEAM, teamId)
    },
  },
  handle: {
    createTeam(handler) {
      function _handler(channel, message) {
        handler(message)
      }
      registerHandler(events.CREATE_TEAM, _handler)
    },
  },
}
