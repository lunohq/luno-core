import uuid from 'node-uuid'

import client, { fromDB, resolveTableName } from './client'

export const table = resolveTableName('user-v1')

export const ADMIN = 0
export const TRAINER = 1
export const CONSUMER = 2

const ROLES = [ADMIN, TRAINER, CONSUMER]

function isValidRole(role) {
  return ROLES.includes(role)
}

export class User {
  anonymous = false

  get isAdmin() {
    // this.role === undefined is for backwards compatibility for existing
    // admin users.
    return !this.anonymous && (this.role === undefined || this.role === ADMIN)
  }

  get isTrainer() {
    return !this.anonymous && this.role === TRAINER
  }

  get isConsumer() {
    return !this.anonymous && this.role === CONSUMER
  }

  get isStaff() {
    return this.isAdmin || this.isTrainer
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
        #created = if_not_exists(#created, :created)
        , #teamId = :teamId
        , #changed = :changed
        ${user.role !== undefined ? ', #role = :role' : ''}
        ${user.accessToken ? ', #accessToken = :accessToken' : ''}
        ${user.user ? ', #user = :user' : ''}
        ${user.email ? ', #email = :email' : ''}
        ${user.scopes ? ', #scopes = :scopes' : ''}
        ${user.invite ? ', #invite = :invite' : ''}
        ${user.profile ? ', #profile = :profile' : ''}
    `,
    ExpressionAttributeNames: {
      '#teamId': 'teamId',
      '#created': 'created',
      '#changed': 'changed',
    },
    ExpressionAttributeValues: {
      ':teamId': user.teamId,
      ':created': now,
      ':changed': now,
    },
    ReturnValues: 'ALL_NEW',
  }

  if (user.role !== undefined) {
    if (!isValidRole(user.role)) throw new Error('Invalid role')
    params.ExpressionAttributeNames['#role'] = 'role'
    params.ExpressionAttributeValues[':role'] = user.role
  }

  if (user.user) {
    params.ExpressionAttributeNames['#user'] = 'user'
    params.ExpressionAttributeValues[':user'] = user.user
  }

  if (user.email) {
    params.ExpressionAttributeNames['#email'] = 'email'
    params.ExpressionAttributeValues[':email'] = user.email
  }

  if (user.scopes) {
    params.ExpressionAttributeNames['#scopes'] = 'scopes'
    params.ExpressionAttributeValues[':scopes'] = user.scopes
  }

  if (user.accessToken) {
    params.ExpressionAttributeNames['#accessToken'] = 'accessToken'
    params.ExpressionAttributeValues[':accessToken'] = user.accessToken
  }

  if (user.invite) {
    params.ExpressionAttributeNames['#invite'] = 'invite'
    params.ExpressionAttributeValues[':invite'] = user.invite
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

async function executeScan(params) {
  let users
  const items = await client.scanAll(params)
  if (items) {
    users = items.map((item) => fromDB(User, item))
  }
  return users
}

export async function getUsers(teamId) {
  const params = {
    TableName: table,
    FilterExpression: 'teamId = :teamId',
    ExpressionAttributeValues: {
      ':teamId': teamId,
    },
  }
  return executeScan(params)
}

export async function getUsersWithIds(ids) {
  return client.batchGetAll({ table, items: ids, getKey: id => ({ id }) })
}

export async function getStaff(teamId) {
  const params = {
    TableName: table,
    FilterExpression: 'teamId = :teamId AND #role IN (:admin, :trainer)',
    ExpressionAttributeNames: {
      '#role': 'role',
    },
    ExpressionAttributeValues: {
      ':teamId': teamId,
      ':admin': ADMIN,
      ':trainer': TRAINER,
    },
  }
  return executeScan(params)
}

export async function getAdmins(teamId) {
  const params = {
    TableName: table,
    FilterExpression: 'teamId = :teamId AND #role = :admin',
    ExpressionAttributeNames: {
      '#role': 'role',
    },
    ExpressionAttributeValues: {
      ':admin': ADMIN,
      ':teamId': teamId,
    },
  }
  return executeScan(params)
}

export async function scan(options = {}) {
  const params = {
    TableName: table,
    ...options,
  }
  return executeScan(params)
}
