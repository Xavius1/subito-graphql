import { Logger } from 'subito-lib';

const loggerPlugin = function loggerPlugin() {
  return {
    async requestDidStart({ context }: any) {
      // Contextualization of Logger only once per request
      Logger.setContext(context);
    },
  };
};

export default loggerPlugin;
