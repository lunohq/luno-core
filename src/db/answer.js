import uuid from 'node-uuid';

import client, { fromDB, resolveTableName } from './client';

const table = resolveTableName('answer');

export class Answer {};

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

export function getAnswer(teamIdBotId, id) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      Key: { id, teamIdBotId },
    };

    client.get(params, (err, data) => {
      if (err) return reject(err);
      const answer = fromDB(Answer, data.Item);
      return resolve(answer);
    });
  });
}

export function getAnswers(teamId, botId) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      KeyConditionExpression: 'teamIdBotId = :teamIdBotId',
      ExpressionAttributeValues: {
        ':teamIdBotId': `${teamId}:${botId}`,
      },
    };

    client.query(params, (err, data) => {
      if (err) return reject(err);
      return resolve(data.Items.map((item) => fromDB(Answer, item)));
    });
  });
}
