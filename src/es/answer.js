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
      resolve(res);
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
      resolve(res);
    });
  });
}
