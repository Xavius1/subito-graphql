import type { DocumentNode } from 'graphql';
import failPayload from './failPayload.js';
import successPayload from './successPayload.js';

/** @public */
export type TPayloadInput = {
  message: string,
  data: any,
  success?: boolean,
  code?: 200 | 403,
  keyData?: string,
}

/** @public */
export type TPayload = {
  message: string,
  success: boolean,
  code: 200 | 403,
  [keyData: string]: any,
}

/**
 * Send a mutation payload
 * @param doc - The mutated doc
 * @returns
 *
 * @public
 */
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
