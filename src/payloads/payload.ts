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
  code,
  keyData = 'node',
}: PayloadInput): PayloadResponse {
  let finalCode = code || 200;
  if (!code && !data) {
    finalCode = 500;
  }

  return {
    code: finalCode,
    success: (finalCode < 300),
    message: (message || messageFromCode[finalCode]),
    [keyData]: data,
  };
};

export default payload;
