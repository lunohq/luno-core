import { getTeam, updateTeam, getTeams } from '../db/team'
import { getUser, updateUser } from '../db/user'
import { createBot } from '../db/bot'

export default {
  teams: {
    get: async (id) => {
      // Converse expects slack details to be on the Team object.
      const { slack, ...team } = await getTeam(id)
      Object.assign(team, slack)
      return team
    },
    save: async ({ team: data, isNew }) => {
      const { bot, url, ...other } = data
      if (!other.slack) {
        other.slack = {}
      }

      if (bot) {
        other.slack.bot = bot
      }

      if (url) {
        other.slack.url = url
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
    save: ({ user: data }) => updateUser(data),
  },
}
