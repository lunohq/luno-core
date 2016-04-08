import uuid from 'node-uuid';

import client, { fromDB, resolveTableName } from './client';

const table = resolveTableName('answer');

export class Answer {};

function getCompositeId(teamId, botId) {
  return `${teamId}=${botId}`;
}

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

export function getAnswer(teamId, botId, id) {
  const compositeId = getCompositeId(teamId, botId);
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      Key: { id, compositeId },
    };

    client.get(params, (err, data) => {
      if (err) return reject(err);
      const answer = fromDB(Answer, data.Item);
      return resolve(answer);
    });
  });
}

export function getAnswers(teamId, botId) {
  const compositeId = getCompositeId(teamId, botId);
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      KeyConditionExpression: 'HashKey = :hkey',
      ExpressionAttributeValues: {
        ':hkey': compositeId,
      },
    };

    client.query(params, (err, data) => {
      if (err) return reject(err);
      return data.Items.map((item) => fromDB(Answer, item));
    });
  });
}
