import type { DocumentNode } from 'graphql';
import failPayload from './failPayload.js';
import successPayload from './successPayload.js';

const mutationPayload = function mutationPayload(doc?: DocumentNode) {
  if (doc) {
    return successPayload({
      message: 'MUTATION_SUCCEDED',
      data: doc,
    });
  }

  return failPayload({
    message: 'SOMETHING_WENT_WRONG',
    data: null,
  });
};

export default mutationPayload;
