import uuid from 'node-uuid'

import client, { fromDB, resolveTableName } from './client'

const table = resolveTableName('bot-v1')

export class Bot {}

export function createBot(data) {
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
  return new Promise((resolve, reject) => {
    client.put(params, (err, data) => {
      if (err) return reject(err)
      return resolve(bot)
    })
  })
}

export function getBot(teamId, id) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      Key: { teamId, id },
    }

    client.get(params, (err, data) => {
      if (err) return reject(err)
      const bot = fromDB(Bot, data.Item)
      return resolve(bot)
    })
  })
}

export function getBots(teamId) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      KeyConditionExpression: 'teamId = :teamId',
      ExpressionAttributeValues: {
        ':teamId': teamId,
      },
    }

    client.query(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data.Items.map((item) => fromDB(Bot, item)))
    })
  })
}

export function allBots() {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
    }

    client.scan(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data.Items.map((item) => fromDB(Bot, item)))
    })
  })
}

export function updateBot({ id, teamId, purpose, pointsOfContact }) {
  const now = new Date().toISOString()
  const params = {
    TableName: table,
    Key: { id, teamId },
    UpdateExpression:`
      SET
        #pointsOfContact = :pointsOfContact,
        #purpose = :purpose,
        #changed = :changed
    `,
    ExpressionAttributeNames: {
      '#pointsOfContact': 'pointsOfContact',
      '#purpose': 'purpose',
      '#changed': 'changed',
    },
    ExpressionAttributeValues: {
      ':pointsOfContact': pointsOfContact,
      ':purpose': purpose,
      ':changed': now,
    },
    ReturnValues: 'ALL_NEW',
  }

  return new Promise((resolve, reject) => {
    client.update(params, (err, data) => {
      if (err) return reject(err)
      const bot = fromDB(Bot, data.Attributes)
      return resolve(bot)
    })
  })
}
