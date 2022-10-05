import type { TPayloadInput, TPayload } from './mutationPayload.js';

/**
 * Send a success payload
 * @param input - The payload input
 * @returns
 *
 * @deprecated Use the new {@link payload} instead
 * @public
 */
const successPayload = function successPayloadResponse({
  message,
  data,
  success = true,
  code = 200,
  keyData = 'node',
}: TPayloadInput): TPayload {
  return {
    code,
    success,
    message,
    [keyData]: data,
  };
};

export default successPayload;
