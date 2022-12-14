import { Env } from 'subito-lib';

/** @public */
const env: any = Env.getAll([
  Env.newSecret('GID_DATA_CRYPTO_KEY'),
  Env.newVar('HEADER_APP_TOKEN', { defaultValue: 'x-app-token' }),
  Env.newVar('HEADER_ENDPOINT', { defaultValue: 'x-endpoint' }),
  Env.newVar('ROLE_ADMIN', { defaultValue: 'ADMIN' }),
]);

export default env;
