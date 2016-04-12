import uuid from 'node-uuid';

import client, { fromDB, resolveTableName } from './client';

const table = resolveTableName('user-v1');

export class User {};

export function getUser(id) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      Key: { id },
    };

    client.get(params, (err, data) => {
      if (err) return reject(err);

      let user;
      if (data.Item) {
        user = fromDB(User, data.Item);
      }

      return resolve(user);
    });
  });
}

export function updateUser(user) {
  const now = new Date().toISOString();
  const params = {
    TableName: table,
    Key: { id: user.id },
    UpdateExpression:`
      SET
        #accessToken = :accessToken,
        #scopes = :scopes,
        #teamId = :teamId,
        #user = :user,
        #created = if_not_exists(#created, :created),
        #changed = :changed
    `,
    ExpressionAttributeNames: {
      '#accessToken': 'accessToken',
      '#scopes': 'scopes',
      '#teamId': 'teamId',
      '#user': 'user',
      '#created': 'created',
      '#changed': 'changed',
    },
    ExpressionAttributeValues: {
      ':accessToken': user.accessToken,
      ':scopes': user.scopes,
      ':teamId': user.teamId,
      ':user': user.user,
      ':created': now,
      ':changed': now,
    },
    ReturnValues: 'ALL_NEW',
  };

  return new Promise((resolve, reject) => {
    client.update(params, (err, data) => {
      if (err) return reject(err);
      user = fromDB(User, data.Attributes);
      return resolve(user);
    });
  });
}
