import { merge } from 'lodash';

const config = {};

// Generate config from process.env
const { env: { STAGE, AWS_REGION, ES_HOST } } = process;
merge(config, { stage: STAGE, aws: { region: AWS_REGION }, es: { host: ES_HOST } });

export default config;
