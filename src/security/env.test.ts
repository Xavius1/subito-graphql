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
  // HEADER_APP_TOKEN
  test('HEADER_APP_TOKEN default value should be', () => {
    expect(e._defaultValues.HEADER_APP_TOKEN) // eslint-disable-line no-underscore-dangle
      .toBe('x-app-token');
  });
  // HEADER_ENDPOINT
  test('HEADER_ENDPOINT default value should be', () => {
    expect(e._defaultValues.HEADER_ENDPOINT) // eslint-disable-line no-underscore-dangle
      .toBe('x-endpoint');
  });
  // ROLE_ADMIN
  test('ROLE_ADMIN default value should be', () => {
    expect(e._defaultValues.ROLE_ADMIN) // eslint-disable-line no-underscore-dangle
      .toBe('ADMIN');
  });
});
