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
          common: {
            title: {
              query,
              cutoff_frequency: 0.001,
            },
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
      explain: true,
    }, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}
