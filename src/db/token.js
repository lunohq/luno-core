import uuid from 'node-uuid'

import client, { fromDB, resolveTableName } from './client'

const table = resolveTableName('token-v1')

export class Token {}

export async function getToken(userId, id) {
  const params = {
    TableName: table,
    Key: { id, userId: userId },
  }
  const data = await client.get(params).promise()
  let token
  if (data.Item) {
    token = fromDB(Token, data.Item)
  }
  return token
}

export async function createToken({ userId, ...data }) {
  const token = new Token()
  const now = new Date().toISOString()
  Object.assign(token, data)
  token.id = uuid.v4()
  token.userId = userId
  token.active = true
  token.created = now
  token.changed = now

  const params = {
    TableName: table,
    Item: token,
  }

  await client.put(params).promise()
  return token
}

export async function deleteToken(id, userId) {
  const params = {
    TableName: table,
    Key: { id, userId },
  }
  await client.delete(params).promise()
}
