import { ForbiddenError } from 'apollo-server';
import { Token } from 'subito-lib';
import e from '../security/env';

const REGEX_INTROSPECTION_QUERY = /\b(__schema|__type)\b/;

const apolloIntrospectionAuthPlugin = function apolloIntrospectionAuthPluginWhenNotInLocalEnv() {
  return {
    requestDidStart({ request }: any) {
      if (typeof request.query === 'string' && REGEX_INTROSPECTION_QUERY.test(request.query)) {
        const { headers } = request.http;
        const viewer = Token.read(headers.get(e.HEADER_APP_TOKEN));
        if (!headers.has(e.HEADER_APP_TOKEN) || !viewer || !viewer.roles.includes('ADMIN_DEV')) {
          throw new ForbiddenError('You are not authorized to perform this request.');
        }
      }
    },
  };
};

export default apolloIntrospectionAuthPlugin;
