import { getTeam, updateTeam, getTeams } from '../db/team'
import { getUser, updateUser } from '../db/user'
import { createBot } from '../db/bot'

const debug = require('debug')('core:converse:storage')

export default {
  teams: {
    get: async (id) => {
      // Converse expects slack details to be on the Team object.
      let team = await getTeam(id)
      if (team) {
        const { slack, ...other } = team
        debug('Translating slack back to team', { other, slack })
        team = Object.assign(other, slack)
      }
      return team
    },
    save: async ({ team: data, isNew }) => {
      const { bot, url, domain, ...other } = data
      if (!other.slack) {
        other.slack = {}
      }

      if (bot) {
        other.slack.bot = bot
      }

      if (url) {
        other.slack.url = url
      }

      if (domain) {
        other.slack.domain = domain
      }

      if (other.slack && other.slack.bot && other.slack.bot.accessToken) {
        // Stick with the old way of storing tokens
        other.slack.bot.token = other.slack.bot.accessToken
        delete other.slack.bot.accessToken
      }

      const team = await updateTeam(other)
      if (isNew) {
        await createBot({ teamId: team.id, purpose: team.name })
      }
      return team
    },
  },
  users: {
    get: (id) => getUser(id),
    save: ({ user }) => updateUser(user),
  },
}
