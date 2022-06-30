import e from './env';

describe('env.js', () => {
  // APP_ENV
  test('APP_ENV should be defined', () => {
    expect(e.APP_ENV) // eslint-disable-line no-underscore-dangle
      .toBeDefined();
  });
  // GID_DATA_CRYPTO_KEY
  test('GID_DATA_CRYPTO_KEY type should be', () => {
    expect(e._types.GID_DATA_CRYPTO_KEY) // eslint-disable-line no-underscore-dangle
      .toBe('secret');
  });
  // HEADER_APP_TOKEN_NAME
  test('HEADER_APP_TOKEN_NAME default value should be', () => {
    expect(e._defaultValues.HEADER_APP_TOKEN_NAME) // eslint-disable-line no-underscore-dangle
      .toBe('x-app-token');
  });
  // ROLE_ADMIN
  test('ROLE_ADMIN default value should be', () => {
    expect(e._defaultValues.ROLE_ADMIN) // eslint-disable-line no-underscore-dangle
      .toBe('ADMIN');
  });
});
