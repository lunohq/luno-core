import Redlock from 'redlock'
import { getTeam, updateTeam, getTeams } from '../db/team'
import { getUser, updateUser } from '../db/user'
import { createBot } from '../db/bot'
import { getOpenThread, closeThread, createThread, createEvent } from '../db/thread'
import getClient from '../redis/getClient'
import config from '../config'

let client
let redlock

function retrieveClient() {
  if (!client) {
    client = getClient()
    redlock = new Redlock([client], { retryCount: 0 })
  }
  return { client, redlock }
}

function reactionKey(...args) {
  const parts = ['react']
  parts.push(...args)
  return parts.join(':')
}

export default {
  teams: {
    get: async (id, cb) => {
      let team
      try {
        team = await getTeam(id)
      } catch (err) {
        return cb(err)
      }

      return cb(null, team)
    },

    save: async ({ team: data, isnew }, cb) => {
      let team
      try {
        team = await updateTeam(data)
      } catch (err) {
        return cb(err)
      }

      if (isnew) {
        try {
          await createBot({ teamId: team.id, purpose: team.name })
        } catch (err) {
          return cb(err)
        }
      }

      return cb(null, team)
    },

    all: async (cb) => {
      let teams
      try {
        teams = await getTeams()
      } catch (err) {
        return cb(err)
      }

      return cb(null, teams)
    },

  },
  users: {
    get: async (id, cb) => {
      let user
      try {
        user = await getUser(id)
      } catch (err) {
        return cb(err)
      }

      return cb(null, user)
    },

    save: async ({ user: data, isnew }, cb) => {
      // transform values from slack to camelcase
      if (data.access_token) {
        data.accessToken = data.access_token
        delete data.access_token
      }

      if (data.team_id) {
        data.teamId = data.team_id
        delete data.team_id
      }

      let user
      try {
        user = await updateUser(data)
      } catch (err) {
        return cb(err)
      }

      return cb(null, user)
    },

    // We should never want to return all the users in the system
    all: (cb) => cb(new Error('Not implemented')),
  },
  channels: {
    get: (_, cb) => cb(new Error('Not implemented')),
    save: (_, cb) => cb(new Error('Not implemented')),
    all: (cb) => cb(new Error('Not implemented')),
  },
  reactions: {
    listenTo: ({ ts, channel }, payload) => {
      const { client } = retrieveClient()
      const key = reactionKey(channel, ts)
      return client.setexAsync(key, config.redis.timeouts.reactions, payload)
    },
    shouldRespond: ({ ts, channel }) => new Promise(async (resolve, reject) => {
      const { client } = retrieveClient()
      const key = reactionKey(channel, ts)
      let result
      try {
        result = await client.getAsync(key)
      } catch (err) {
        return reject(err)
      }
      return resolve(result)
    }),
    clear: ({ ts, channel }) => {
      const { client } = retrieveClient()
      const key = reactionKey(channel, ts)
      return client.delAsync(key)
    },
  },
  mutex: {
    lockMessage: ({ botId, channel, ts }, interval) => {
      const key = `bmutex:${botId}:${channel}:${ts}`
      const { redlock } = retrieveClient()
      return redlock.lock(key, interval)
    },
    lockThread: ({ botId, channel, user }, interval) => {
      const key = `bmutex:${botId}:${channel}:${user}`
      const { redlock } = retrieveClient()
      return redlock.lock(key, interval)
    },
  },
  threads: {
    getOrOpen: ({ botId, channel, user }) => new Promise(async (resolve, reject) => {
      let response
      try {
        response = await getOpenThread({ botId, channelId: channel, userId: user })
      } catch (err) {
        return reject(err)
      }

      if (!response.thread) {
        try {
          const thread = await createThread({ botId, channelId: channel, userId: user })
          response = { thread, events: [] }
        } catch (err) {
          return reject(err)
        }
      }
      return resolve(response)
    }),
    open: ({ botId, channel, user }) => new Promise(async (resolve, reject) => {
      let response = {}
      try {
        const thread = await createThread({ botId, channelId: channel, userId: user })
        response = { thread, events: [] }
      } catch (err) {
        return reject(err)
      }
      return resolve(response)
    }),
    close: ({ thread: params }) => new Promise(async (resolve, reject) => {
      let thread
      try {
        thread = await closeThread(params)
      } catch (err) {
        return reject(err)
      }
      return resolve(thread)
    }),
    receive: ({ message, thread }) => new Promise(async (resolve, reject) => {
      message = Object.assign({}, message)
      delete message.luno

      const { ts: messageId } = message
      const { id: threadId, botId, channelId } = thread
      let response
      try {
        response = await createEvent({ threadId, botId, channelId, messageId, message })
      } catch (err) {
        return reject(err)
      }
      return resolve(response)
    }),
    send: ({ message, thread }) => new Promise(async (resolve, reject) => {
      const { id: threadId, botId, channelId } = thread

      let messageId
      if (message.ts) {
        messageId = message.ts
      }

      let response
      try {
        response = await createEvent({ threadId, botId, channelId, message, messageId })
      } catch (err) {
        return reject(err)
      }
      return resolve(response)
    }),
    log: ({ thread, event }) => new Promise(async (resolve, reject) => {
      const { id: threadId, botId, channelId } = thread

      let response
      try {
        response = await createEvent({ threadId, botId, channelId, ...event })
      } catch (err) {
        return reject(err)
      }
      return resolve(response)
    }),
  },
}
