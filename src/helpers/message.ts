/** @public */
export type Message = { [ key: number]: string };

/**
 * List of http message
 *
 * @public
 */
const message: Message = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  290: 'Need Action',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  410: 'Gone',
  500: 'Internal Server Error',
  501: 'Not Implemented',
};

export default message;
