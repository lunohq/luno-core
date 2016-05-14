import uuid from 'node-uuid'

import client, { fromDB, resolveTableName } from './client'

const table = resolveTableName('bot-v1')

export class Bot {}

export async function createBot(data) {
  const bot = new Bot()
  const now = new Date().toISOString()

  Object.assign(bot, data)
  bot.id = uuid.v4()
  bot.created = now
  bot.changed = now

  const params = {
    TableName: table,
    Item: bot,
  }
  await client.put(params).promise()
  return bot
}

export async function getBot(teamId, id) {
  const params = {
    TableName: table,
    Key: { teamId, id },
  }

  const data = await client.get(params).promise()
  return fromDB(Bot, data.Item)
}

export async function getBots(teamId) {
  const params = {
    TableName: table,
    KeyConditionExpression: 'teamId = :teamId',
    ExpressionAttributeValues: {
      ':teamId': teamId,
    },
  }

  const items = await client.query(params).promise()
  return data.Items.map((item) => fromDB(Bot, item))
}

export async function allBots() {
  const params = {
    TableName: table,
  }

  const items = await client.scan(params).promise()
  return data.Items.map((item) => fromDB(Bot, item))
}

async function update(params) {
  const data = await client.update(params).promise()
  return fromDB(Bot, data.Attributes)
}

export async function updatePointsOfContact({ id, teamId, pointsOfContact }) {
  const now = new Date().toISOString()
  const params = {
    TableName: table,
    Key: { id, teamId },
    UpdateExpression:`
      SET
        #pointsOfContact = :pointsOfContact,
        #changed = :changed
    `,
    ExpressionAttributeNames: {
      '#pointsOfContact': 'pointsOfContact',
      '#changed': 'changed',
    },
    ExpressionAttributeValues: {
      ':pointsOfContact': pointsOfContact,
      ':changed': now,
    },
    ReturnValues: 'ALL_NEW',
  }
  return await update(params)
}

export async function updatePurpose({ id, teamId, purpose }) {
  const now = new Date().toISOString()
  const params = {
    TableName: table,
    Key: { id, teamId },
    UpdateExpression:`
      SET
        #purpose = :purpose,
        #changed = :changed
    `,
    ExpressionAttributeNames: {
      '#purpose': 'purpose',
      '#changed': 'changed',
    },
    ExpressionAttributeValues: {
      ':purpose': purpose,
      ':changed': now,
    },
    ReturnValues: 'ALL_NEW',
  }
  return await update(params)
}
