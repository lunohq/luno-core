import uuid from 'node-uuid';

import client, { fromDB, resolveTableName } from './client';

const table = resolveTableName('user');

export class User extends Object {};

export function createUser(user) {
  return new Promise((resolve, reject) => {
    user.id = uuid.v4();
    const params = {
      TableName: table,
      Item: user,
    };

    client.put(params, (err, data) => {
      if (err) return reject(err);
      return resolve(user);
    });
  });
}

export function getUser(teamId, id) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      Key: { id, teamId },
    };

    client.get(params, (err, data) => {
      if (err) return reject(err);
      const user = fromDB(User, data.Item);
      return resolve(user);
    });
  });
}

export function getUsers(teamId) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      KeyConditionExpression: 'HashKey = :hkey',
      ExpressionAttributeValues: {
        ':hkey': teamId,
      },
    };

    client.query(params, (err, data) => {
      if (err) return reject(err);
      return data.Items.map((item) => fromDB(User, item));
    });
  });
}
