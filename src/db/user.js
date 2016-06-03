import uuid from 'node-uuid'

import client, { fromDB, resolveTableName } from './client'

const table = resolveTableName('user-v1')

export class User {
  anonymous = false
}

export class AnonymousUser extends User {
  anonymous = true
}

export async function getUser(id) {
  const params = {
    TableName: table,
    Key: { id },
  }

  const data = await client.get(params).promise()
  let user
  if (data.Item) {
    user = fromDB(User, data.Item)
  }
  return user
}

export async function updateUser(user) {
  const now = new Date().toISOString()
  const params = {
    TableName: table,
    Key: { id: user.id },
    UpdateExpression:`
      SET
        #accessToken = :accessToken
        , #scopes = :scopes
        , #teamId = :teamId
        ${user.user ? ', #user = :user' : ''}
        , #created = if_not_exists(#created, :created)
        , #changed = :changed
        ${user.email ? ', #email = :email': ''}
    `,
    ExpressionAttributeNames: {
      '#accessToken': 'accessToken',
      '#scopes': 'scopes',
      '#teamId': 'teamId',
      '#created': 'created',
      '#changed': 'changed',
    },
    ExpressionAttributeValues: {
      ':accessToken': user.accessToken,
      ':scopes': user.scopes,
      ':teamId': user.teamId,
      ':created': now,
      ':changed': now,
    },
    ReturnValues: 'ALL_NEW',
  }

  if (user.user) {
    params.ExpressionAttributeNames['#user'] = 'user'
    params.ExpressionAttributeValues[':user'] = user.user
  }

  if (user.email) {
    params.ExpressionAttributeNames['#email'] = 'email'
    params.ExpressionAttributeValues[':email'] = user.email
  }

  const data = await client.update(params).promise()
  return fromDB(User, data.Attributes)
}

export async function getUsers(teamId) {
  const params = {
    TableName: table,
    FilterExpression: 'teamId = :teamId',
    ExpressionAttributeValues: {
      ':teamId': teamId,
    },
  }
  const data = await client.scan(params).promise()
  return data.Items.map((item) => fromDB(User, item))
}
