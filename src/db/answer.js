import uuid from 'node-uuid';

import client, { fromDB, resolveTableName } from './client';

const table = resolveTableName('answer');

export class Answer extends Object {};

export function createAnswer(answer) {
  return new Promise((resolve, reject) => {
    answer.id = uuid.v4();
    const params = {
      TableName: table,
      Item: user,
    };

    client.put(params, (err, data) => {
      if (err) return reject(err);
      return resovle(answer);
    });
  });
}

export function getAnswer(id) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      Key: { id },
    };

    client.get(params, (err, data) => {
      if (err) return reject(err);
      const answer = fromDB(Answer, data.Item);
      return resolve(answer);
    });
  });
}
