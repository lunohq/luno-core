import uuid from 'node-uuid'

import client, { fromDB, resolveTableName } from './client'

const table = resolveTableName('regex-v1')

export class Regex {}

export async function createRegex({ botId, ...data }) {
  const instance = new Regex()
  Object.assign(instance, data)
  instance.id = uuid.v4()
  instance.botId = botId

  const now = new Date().toISOString()
  instance.created = now
  instance.changed = now

  const params = {
    TableName: table,
    Item: instance,
  }

  await client.put(params).promise()
  return instance
}

export async function getRegexes(botId) {
  const params = {
    TableName: table,
    KeyConditionExpression: 'botId = :botId',
    ExpressionAttributeValues: {
      ':botId': botId,
    },
    IndexName: 'RegexBotIdPosition',
  }
  const items = await client.queryAll(params)
  return items.map((item) => fromDB(Regex, item))
}

export async function getRegex(id) {
  const params = {
    TableName: table,
    Key: { id },
  }
  const data = await client.get(params).promise()
  let instance
  if (data.Item) {
    instance = fromDB(Regex, data.Item)
  }
  return instance
}

export async function deleteRegex(botId, id) {
  const params = {
    TableName: table,
    Key: { id, botId },
    ReturnValues: 'ALL_OLD',
  }

  const data = await client.delete(params).promise()
  return fromDB(Regex, data.Attributes)
}

export async function updateRegex({ botId, id, regex, body, position }) {
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

  const data = await client.update(params).promise()
  return fromDB(Regex, data.Attributes)
}
