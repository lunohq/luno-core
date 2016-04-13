import client, { config } from './client';

const type = 'answer';

export function indexAnswer({ id, ...body }) {
  return new Promise((resolve, reject) => {
    client.index({
      ...config.write,
      type,
      id,
      body,
    }, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}

export function deleteAnswer(id) {
  return new Promise((resolve, reject) => {
    client.delete({
      ...config.write,
      type,
      id,
    }, (err, res) => {
      if (err && err.status !== 404) return reject(err);
      return resolve(res);
    });
  });
}

export function search(botId, query) {
  const body = {
    query: {
      filtered: {
        query: {
          bool: {
            should: [
              { match: { title: query } },
              { match: { body: query } },
            ],
          },
        },
        filter: {
          term: { botId: botId },
        },
      },
    },
  };

  return new Promise((resolve, reject) => {
    client.search({
      ...config.read,
      type,
      body,
    }, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}
