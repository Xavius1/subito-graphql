import type { TPayloadInput, TPayload } from './mutationPayload.js';

/**
 * Send a failed payload
 *
 * @param input - The payload input
 * @returns
 *
 * @public
 */
const failPayload = function failPayloadResponse({
  message,
  data,
  success = false,
  code = 403,
  keyData = 'node',
}: TPayloadInput): TPayload {
  return {
    code,
    success,
    message,
    [keyData]: data,
  };
};

export default failPayload;
