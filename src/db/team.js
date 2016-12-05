import client, { fromDB, resolveTableName } from './client'

const table = resolveTableName('team-v1')

export const STATUS_ACTIVE = 0
export const STATUS_INACTIVE = 1

export const TEMPLATE_ONBOARDING = 'onboarding'

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

  // TODO remove when we move away from botkit
  // normalize to camel case
  if (team.bot && team.bot.user_id) {
    team.bot.userId = team.bot.user_id
    delete team.bot.user_id
  }

  const now = new Date().toISOString()
  const params = {
    TableName: table,
    Key: { id: team.id },
    UpdateExpression: `
      SET
        #createdBy = if_not_exists(createdBy, :createdBy)
        , #name = :name
        , #slack = :slack
        , #created = if_not_exists(#created, :created)
        , #changed = :changed
        ${team.files ? ', #files = :files' : ''}
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
      ':slack': team.slack,
      ':created': now,
      ':changed': now,
    },
    ReturnValues: 'ALL_NEW',
  }

  if (team.files) {
    params.ExpressionAttributeNames['#files'] = 'files'
    params.ExpressionAttributeValues[':files'] = team.files
  }

  const data = await client.update(params).promise()
  return fromDB(Team, data.Attributes)
}

export function updateTeamStatus({ id, status }) {
  const now = new Date().toISOString()
  const params = {
    TableName: table,
    Key: { id },
    UpdateExpression:`
      SET
        #status = :status,
        #statusChanged = :statusChanged,
        #changed = :changed
    `,
    ExpressionAttributeNames: {
      '#status': 'status',
      '#statusChanged': 'statusChanged',
      '#changed': 'changed',
    },
    ExpressionAttributeValues: {
      ':status': status,
      ':statusChanged': now,
      ':changed': now,
    },
    ReturnValues: 'ALL_NEW',
  }

  return client.update(params).promise()
}

export function deactivateTeam(id) {
  return updateTeamStatus({ id, status: STATUS_INACTIVE })
}

export function activateTeam(id) {
  return updateTeamStatus({ id, status: STATUS_ACTIVE })
}

export function ranTemplate({ id, template }) {
  const now = new Date().toISOString()
  const params = {
    TableName: table,
    Key: { id },
    UpdateExpression:`
      SET
        #template = :templateRan,
        #changed = :changed
    `,
    ExpressionAttributeNames: {
      '#template': `${template}Template`,
      '#changed': 'changed',
    },
    ExpressionAttributeValues: {
      ':templateRan': now,
      ':changed': now,
    },
    ReturnValues: 'ALL_NEW',
  }
  return client.update(params).promise()
}

export async function getTeams() {
  const params = {
    TableName: table,
  }

  let teams
  const items = await client.scanAll(params)
  if (items) {
    teams = items.map((item) => fromDB(Team, item))
  }
  return items
}
