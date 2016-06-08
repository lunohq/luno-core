import uuid from 'node-uuid'

import client, { fromDB, resolveTableName } from './client'

const table = resolveTableName('user-v1')

export const ADMIN = 0
export const TRAINER = 1
export const CONSUMER = 2

const ROLES = [ADMIN, TRAINER, CONSUMER]

function isValidRole(role) {
  return ROLES.includes(role)
}

export class User {
  anonymous = false

  get admin() {
    // this.role === undefined is for backwards compatibility for existing
    // admin users.
    return !this.anonymous && (this.role === undefined || this.role === ADMIN)
  }

  get trainer() {
    return !this.anonymous && this.role === TRAINER
  }

  get consumer() {
    return !this.anonymous && this.role === CONSUMER
  }

  canTrain() {
    return this.admin || this.trainer
  }

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
        ${user.email ? ', #email = :email' : ''}
        ${user.role !== undefined ? ', #role = :role' : ''}
        ${user.profile ? ', #profile = :profile' : ''}
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

  if (user.role !== undefined) {
    if (!isValidRole(user.role)) throw new Error('Invalid role')

    params.ExpressionAttributeNames['#role'] = 'role'
    params.ExpressionAttributeValues[':role'] = user.role
  }

  if (user.profile) {
    const profile = {}
    // dynamodb will throw an error if we attempt to save empty strings
    for (const key of Object.keys(user.profile)) {
      const value = user.profile[key]
      if (value !== '') {
        profile[key] = value
      }
    }
    params.ExpressionAttributeNames['#profile'] = 'profile'
    params.ExpressionAttributeValues[':profile'] = profile
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
