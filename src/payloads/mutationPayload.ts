import type { DocumentNode } from 'graphql';
import failPayload from './failPayload.js';
import successPayload from './successPayload.js';

/** @public */
export type TPayloadInput = {
  message: string,
  data: any,
  success?: boolean,
  code?: number,
  keyData?: string,
}

/** @public */
export type TPayload = {
  message: string,
  success: boolean,
  code: number,
  [keyData: string]: any,
}

/**
 * Send a mutation payload
 * @param doc - The mutated doc
 * @returns
 *
 * @deprecated Use the new {@link payload} instead
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
