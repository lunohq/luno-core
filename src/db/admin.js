import uuid from 'node-uuid'

import client, { fromDB, resolveTableName } from './client'

const table = resolveTableName('admin-token-v1')

export class AdminToken {}

export async function getToken(id) {
  const params = {
    TableName: table,
    Key: { id },
  }
  const data = await client.get(params).promise()
  let token
  if (data.Item) {
    token = fromDB(AdminToken, data.Item)
  }
  return token
}

export async function createToken({ adminSlackUserId, targetUserId, targetTeamId, ...data }) {
  const token = new AdminToken()
  const now = new Date().toISOString()
  Object.assign(token, data)
  token.id = uuid.v4()
  token.adminSlackUserId = adminSlackUserId
  token.targetUserId = targetUserId
  token.targetTeamId = targetTeamId
  token.created = now
  token.changed = now

  const params = {
    TableName: table,
    Item: token,
  }

  await client.put(params).promise()
  return token
}

export async function trackToken({ id, targetTokenId }) {
  const now = new Date().toISOString()
  const params = {
    TableName: table,
    Key: { id },
    UpdateExpression: `
      SET
        #targetTokenId = :targetTokenId,
        #changed = :changed
    `,
    ExpressionAttributeNames: {
      '#targetTokenId': 'targetTokenId',
      '#changed': 'changed',
    },
    ExpressionAttributeValues: {
      ':targetTokenId': targetTokenId,
      ':changed': now,
    },
    ReturnValues: 'ALL_NEW',
  }
  const data = await client.update(params).promise()
  return fromDB(AdminToken, data.Attributes)
}

export async function endToken({ id }) {
  const now = new Date().toISOString()
  const params = {
    TableName: table,
    Key: { id },
    UpdateExpression: `
      SET
        #ended = :ended,
        #changed = :changed
    `,
    ExpressionAttributeNames: {
      '#ended': 'ended',
      '#changed': 'changed',
    },
    ExpressionAttributeValues: {
      ':ended': now,
      ':changed': now,
    },
    ReturnValues: 'ALL_NEW',
  }
  const data = await client.update(params).promise()
  return fromDB(AdminToken, data.Attributes)
}
