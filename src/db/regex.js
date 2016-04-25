import uuid from 'node-uuid'

import client, { fromDB, resolveTableName } from './client'

const table = resolveTableName('regex-v1')

export class Regex {}

export function createRegex({ botId, ...data }) {
  const regexResponse = new Regex()
  Object.assign(regexResponse, data)
  regexResponse.id = uuid.v4()
  regexResponse.botId = botId

  const now = new Date().toISOString()
  regexResponse.created = now
  regexResponse.changed = now

  const params = {
    TableName: table,
    Item: regexResponse,
  }

  return new Promise((resolve, reject) => {
    client.put(params, (err, data) => {
      if (err) return reject(err)

      return resolve(regexResponse)
    })
  })
}

export function getRegexes(botId) {
  const params = {
    TableName: table,
    KeyConditionExpression: 'botId = :botId',
    ExpressionAttributeValues: {
      ':botId': botId,
    },
    IndexName: 'RegexBotIdPosition',
  }

  return new Promise((resolve, reject) => {
    client.queryAll(params, (err, items) => {
      if (err) return reject(err)
      return resolve(items.map((item) => fromDB(Regex, item)))
    })
  })
}

export function getRegex(id) {
  const params = {
    TableName: table,
    Key: { id },
  }

  return new Promise((resolve, reject) => {
    client.get(params, (err, data) => {
      if (err) return reject(err)

      let regexResponse
      if (data.Item) {
        regexResponse = fromDB(Regex, data.Item)
      }

      return resolve(regexResponse)
    })
  })
}

export function deleteRegex(botId, id) {
  const params = {
    TableName: table,
    Key: { id, botId },
    ReturnValues: 'ALL_OLD',
  }

  return new Promise((resolve, reject) => {
    client.delete(params, (err, data) => {
      if (err) return reject(err)
      return resolve(fromDB(Regex, data.Attributes))
    })
  })
}

export function updateRegex({ botId, id, regex, body, position }) {
  const now = new Date().toISOString()
  const params = {
    TableName: table,
    Key: { id: regexResponse },
    UpdateExpression: `
      SET
        #regex = :regex,
        #body = :body,
        #changed = :changed,
        #position = :position
    `,
    ExpressionAttributeNames: {
      '#regex': 'regex',
      '#body': 'body',
      '#changed': 'changed',
      '#position': 'position',
    },
    ExpressionAttributeValues: {
      ':regex': regex,
      ':body': body,
      ':changed': new Date().toISOString(),
      ':position': position,
    },
    ReturnValues: 'ALL_NEW',
  }

  return new Promise((resolve, reject) => {
    client.update(params, (err, data) => {
      if (err) return reject(err)
      const regex = fromDB(Regex, data.Attributes)
      return resolve(regex)
    })
  })
}
