import { getTeam, updateTeam, getTeams } from '../db/team'
import { getUser, updateUser } from '../db/user'
import { createBot } from '../db/bot'
import getClient from '../redis/getClient'
import config from '../config'

let client

function retrieveClient() {
  if (!client) {
    client = getClient()
  }
  return client
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
          await createBot({ teamId: team.id })
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
    listenTo: ({ ts, channel }) => {
      const redis = retrieveClient()
      const key = reactionKey(channel, ts)
      return redis.setexAsync(key, config.redis.timeouts.reactions, true)
    },
    shouldRespond: ({ ts, channel }) => new Promise(async (resolve, reject) => {
      const redis = retrieveClient()
      const key = reactionKey(channel, ts)
      let result
      try {
        result = await redis.getAsync(key)
      } catch (err) {
        return reject(err)
      }
      return resolve(!!result)
    }),
    clear: ({ ts, channel }) => {
      const redis = retrieveClient()
      const key = reactionKey(channel, ts)
      return redis.delAsync(key)
    },
  },
}
