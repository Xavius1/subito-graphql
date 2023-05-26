import messageFromCode from '../helpers/message.js';
import httpCode, { HttpCode } from '../helpers/httpCode.js';

// #region types

/** @public */
export type PayloaderInput = {
  message?: string,
  data?: any,
  code?: HttpCode,
  keyData?: string,
}

/** @public */
export type PayloaderResponse = {
  message: string,
  success: boolean,
  code: HttpCode,
  [keyData: string]: any,
}

// #endregion

/**
 * Send a success payload
 * @param input - The payload input
 * @returns
 *
 * @public
 */
const payloader = function payloadResponse({
  message,
  data,
  code,
  keyData = 'node',
}: PayloaderInput): PayloaderResponse {
  let finalCode = code || httpCode.OK;
  if (!code && !data) {
    finalCode = httpCode.INTERNAL_SERVER_ERROR;
  }

  return {
    code: finalCode,
    // If the http code is lower than 300 then it's a success
    success: (finalCode < 300),
    message: (message || messageFromCode[finalCode]),
    [keyData]: data,
  };
};

export default payloader;
