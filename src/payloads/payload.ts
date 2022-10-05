import messageFromCode from '../helpers/message.js';

/** @public */
export type PayloadInput = {
  message?: string,
  data?: any,
  code?: number,
  keyData?: string,
}

/** @public */
export type PayloadResponse = {
  message: string,
  success: boolean,
  code: number,
  [keyData: string]: any,
}

/**
 * Send a success payload
 * @param input - The payload input
 * @returns
 *
 * @public
 */
const payload = function payloadResponse({
  message,
  data,
  code = 200,
  keyData = 'node',
}: PayloadInput): PayloadResponse {
  return {
    code,
    success: (code < 300),
    message: (message || messageFromCode[code]),
    [keyData]: data,
  };
};

export default payload;
