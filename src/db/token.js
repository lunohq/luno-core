import uuid from 'node-uuid';

import client, { fromDB, resolveTableName } from './client';

const table = resolveTableName('token-v1');

export class Token {};

export function getToken(userId, id) {
  const params = {
    TableName: table,
    Key: { id, userId: userId },
  };

  return new Promise((resolve, reject) => {
    client.get(params, (err, data) => {
      if (err) return reject(err);

      let token;
      if (data.Item) {
        token = fromDB(Token, data.Item);
      }

      return resolve(token);
    });
  });
}

export function createToken({ userId, ...data }) {
  const token = new Token();
  const now = new Date().toISOString();
  Object.assign(token, data);
  token.id = uuid.v4();
  token.userId = userId;
  token.active = true;
  token.created = now;
  token.changed = now;

  const params = {
    TableName: table,
    Item: token,
  };

  return new Promise((resolve, reject) => {
    client.put(params, (err, data) => {
      if (err) return reject(err);
      return resolve(token);
    });
  });
}

export function deleteToken(id, userId) {
  const params = {
    TableName: table,
    Key: { id, userId },
  };

  return new Promise((resolve, reject) => {
    client.delete(params, (err, data) => {
      if (err) return reject(err);
      return resolve();
    });
  });
};
