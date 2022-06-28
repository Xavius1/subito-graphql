import type { DocumentNode } from 'graphql';
import failPayload from './failPayload';
import successPayload from './successPayload';

export type TPayloadInput = {
  message: string,
  data: any,
  success?: boolean,
  code?: 200 | 403,
  keyData?: string,
}

export type TPayload = {
  message: string,
  success: boolean,
  code: 200 | 403,
  [keyData: string]: any,
}

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
