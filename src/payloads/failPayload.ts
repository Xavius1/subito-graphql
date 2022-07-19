import type { TPayloadInput, TPayload } from './mutationPayload.js';

/**
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
