const errorPlugin = function errorPlugin() {
  return {
    requestDidStart({ request }: any) {
      return {
        async didEncounterErrors({
          errors, source, args, context,
        }: any) {
          const { services: { Logger } } = context;
          if (errors) {
            const input = {
              request,
              args,
              source, // eslint-disable-line no-underscore-dangle
            };
            errors.forEach((error: any) => {
              const code = error?.extensions?.code ?? 'UNKNOWN';
              Logger.newError(code, error.message, { ...input, error }, context);
            });
          }
        },
      };
    },
  };
};

export default errorPlugin;
