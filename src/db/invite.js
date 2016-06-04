import uuid from 'node-uuid'

import client, { fromDB, resolveTableName } from './client'

const table = resolveTableName('invite-v1')

export class Invite {}

export async function createInvite({ teamId, ...data }) {
  const invite = new Invite()
  Object.assign(invite, data)
  invite.id = uuid.v4()
  invite.teamId = teamId

  const now = new Date().toISOString()
  invite.created = now
  invite.changed = now

  const params = {
    TableName: table,
    Item: invite,
  }

  await client.put(params).promise()
  return invite
}

export async function getInvite({ id, teamId, userId }) {
  if (!(id || userId)) throw new Error('Must provide either "id" or "userId"')
  if (!teamId) throw new Error('"teamId" is required')

  const params = {
    TableName: table,
  }

  if (id) {
    params.Key = { id, teamId }
  } else {
    params.Key = { userId, teamId }
    params.IndexName = 'InviteTeamIdUserId'
  }

  const data = await client.get(params).promise()
  let invite
  if (data.Item) {
    invite = fromDB(Invite, data.Item)
  }
  return invite
}

export async function deleteInvite({ teamId, id }) {
  const params = {
    TableName: table,
    Key: { teamId, id },
    ReturnValues: 'ALL_OLD',
  }

  const data = await client.delete(params).promise()
  return fromDB(Invite, data.Attributes)
}

export async function getInvites({ teamId }) {
  const params = {
    TableName: table,
    KeyConditionExpression: 'teamId = :teamId',
    ExpressionAttributeValues: {
      ':teamId': teamId,
    },
    IndexName: 'InviteTeamIdCreated',
    ScanIndexForward: false,
  }

  const items = await client.queryAll(params)
  return items.map((item) => fromDB(Invite, item))
}
