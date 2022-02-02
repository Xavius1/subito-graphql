import type { GraphQLRequestContext } from 'apollo-server-types';

const ABACPlugin = function ABACPlugin() {
  return {
    async requestDidStart({ request, context: requestContext }: GraphQLRequestContext) {
      // Contextualization of ABAC only once per request
      const { ABAC: requestABAC } = requestContext;
      requestABAC.init(requestContext);
      return {
        async executionDidStart() {
          return {
            willResolveField(params: any) {
              const {
                source, args, info, context: { ABAC, services: { Logger } },
              } = params;
              const input = {
                request,
                args,
                sourceId: source?.id || source?._id, // eslint-disable-line no-underscore-dangle
              };
              try {
                ABAC.verify(`${info.parentType.name}.${info.fieldName}`, params);
                Logger.newAccess('ACCEPT', `${info.parentType.name}.${info.fieldName}`, input, requestContext);
              } catch (err: any) {
                const code = err?.extensions?.code ?? 'ERROR';
                Logger.newAccess(code, `${info.parentType.name}.${info.fieldName}`, input, requestContext);
                throw new Error(err);
              }
            },
          };
        },
      };
    },
  };
};

export default ABACPlugin;
