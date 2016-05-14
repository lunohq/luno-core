import client, { fromDB, resolveTableName } from './client'

const table = resolveTableName('team-v1')

export class Team {}

export async function getTeam(id, options={}) {
  let params = {
    TableName: table,
    Key: { id },
  }

  params = Object.assign({}, options, params)
  const data = await client.get(params).promise()

  let team
  if (data.Item) {
    team = fromDB(Team, data.Item)
  }
  return team
}

/**
 * Convert our representation of a team to a slack team.
 *
 * @param {Team} team a team stored in the db
 * @return {Object} team as if it came from slack
 */
export function toSlackTeam({ id: teamId, createdBy, name, slack }, { id: botId }) {
  const slackTeam = Object.assign({}, { createdBy, name })
  slackTeam.bot = slack.bot
  slackTeam.url = slack.url
  slackTeam.token = slack.token
  slackTeam.luno = {
    teamId,
    botId,
  }
  return slackTeam
}

export async function updateTeam(team) {

  // normalize to camel case
  team.bot.userId = team.bot.user_id
  delete team.bot.user_id

  const now = new Date().toISOString()
  const params = {
    TableName: table,
    Key: { id: team.id },
    UpdateExpression: `
      SET
        #createdBy = if_not_exists(createdBy, :createdBy),
        #name = :name,
        #slack = :slack,
        #created = if_not_exists(#created, :created),
        #changed = :changed
    `,
    ExpressionAttributeNames: {
      '#createdBy': 'createdBy',
      '#name': 'name',
      '#slack': 'slack',
      '#created': 'created',
      '#changed': 'changed',
    },
    ExpressionAttributeValues: {
      ':createdBy': team.createdBy,
      ':name': team.name,
      ':slack': {
        bot: team.bot,
        url: team.url,
        token: team.token,
      },
      ':created': now,
      ':changed': now,
    },
    ReturnValues: 'ALL_NEW',
  }
  const data = await client.update(params).promise()
  return fromDB(Team, data.Attributes)
}

export async function getTeams() {
  const params = {
    TableName: table,
  }
  const data = client.scan(params).promise()
  return data.Items.map((item) => fromDB(Team, item))
}
