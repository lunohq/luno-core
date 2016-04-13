import AWS from 'aws-sdk';
import { Client } from 'elasticsearch';
import connector from 'http-aws-es';

const indices = {
  write: 'luno-bot-write',
  read: 'luno-bot-read',
};

export const config = {
  indices,
  write: {
    index: indices.write,
  },
};

export default new Client({
  apiVersion: '1.5',
  host: process.env.ES_HOST,
  connectionClass: connector,
  amazonES: {
    region: process.env.AWS_REGION,
    credentials: AWS.Config.prototype.keys.credentials(),
  },
});
