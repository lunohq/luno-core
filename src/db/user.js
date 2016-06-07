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
        #created = if_not_exists(#created, :created)
        , #teamId = :teamId
        , #changed = :changed
        , #role = :role
        ${user.accessToken ? ', #accessToken = :accessToken' : ''}
        ${user.user ? ', #user = :user' : ''}
        ${user.email ? ', #email = :email' : ''}
        ${user.scopes ? ', #scopes = :scopes' : ''}
    `,
    ExpressionAttributeNames: {
      '#role': 'role',
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

  let role = user.role
  if (role === undefined) {
    role = CONSUMER
  }
  params.ExpressionAttributeValues[':role'] = role
  if (!isValidRole(role)) throw new Error('Invalid role')

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

  let users
  const items = await client.scanAll(params)
  if (items) {
    users = items.map((item) => fromDB(User, item))
  }
  return users
}

export async function scan(options = {}) {
  const params = {
    TableName: table,
    ...options,
  }

  let users
  let items = await client.scanAll(params)
  if (items) {
    users = items.map((item) => fromDB(User, item))
  }
  return users
}
