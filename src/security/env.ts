import { Env } from 'subito-lib';

const env: any = Env.getAll([
  ['APP_ENV'],
  Env.newSecret('GID_DATA_CRYPTO_KEY'),
  ['HEADER_APP_TOKEN_NAME', { defaultValue: 'x-app-token' }],
  ['ROLE_ADMIN', { defaultValue: 'ADMIN' }],
]);

export default env;
