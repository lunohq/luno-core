import { getTeam, updateTeam, getTeams } from '../db/team'
import { getUser, updateUser } from '../db/user'
import { createBot } from '../db/bot'

export default {
  teams: {
    get: (id) => getTeam(id),
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
