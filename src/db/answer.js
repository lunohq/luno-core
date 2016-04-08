import uuid from 'node-uuid';

import client, { compositeId, fromDB, resolveTableName } from './client';

const table = resolveTableName('answer');

export class Answer {};

export function createAnswer({ teamId, botId, ...data }) {
  const answer = new Answer();
  Object.assign(answer, data);
  answer.id = uuid.v4();
  answer.teamIdBotId = compositeId(teamId, botId);

  const params = {
    TableName: table,
    Item: answer,
  };

  return new Promise((resolve, reject) => {
    client.put(params, (err, data) => {
      if (err) return reject(err);
      return resolve(answer);
    });
  });
}

export function getAnswer(teamIdBotId, id) {
  const params = {
    TableName: table,
    Key: { id, teamIdBotId },
  };

  return new Promise((resolve, reject) => {
    client.get(params, (err, data) => {
      if (err) return reject(err);
      const answer = fromDB(Answer, data.Item);
      return resolve(answer);
    });
  });
}

export function getAnswers(teamId, botId) {
  const params = {
    TableName: table,
    KeyConditionExpression: 'teamIdBotId = :teamIdBotId',
    ExpressionAttributeValues: {
      ':teamIdBotId': compositeId(teamId, botId),
    },
  };

  return new Promise((resolve, reject) => {
    client.query(params, (err, data) => {
      if (err) return reject(err);
      return resolve(data.Items.map((item) => fromDB(Answer, item)));
    });
  });
}

export function deleteAnswer(teamIdBotId, id) {
  const params = {
    TableName: table,
    Key: { id, teamIdBotId },
  };

  return new Promise((resolve, reject) => {
    client.delete(params, (err, data) => {
      if (err) return reject(err);
      return resolve();
    });
  });
}

export function updateAnswer({ teamIdBotId, id, title, body }) {
  const params = {
    TableName: table,
    Key: { id, teamIdBotId },
    UpdateExpression: 'SET #t = :t, #b = :b',
    ExpressionAttributeNames: {
      '#t': 'title',
      '#b': 'body',
    },
    ExpressionAttributeValues: {
      ':t': title,
      ':b': body,
    },
    ReturnValues: 'ALL_NEW',
  };

  return new Promise((resolve, reject) => {
    client.update(params, (err, data) => {
      if (err) return reject(err);
      return resolve(fromDB(Answer, data.Attributes));
    });
  });
}
