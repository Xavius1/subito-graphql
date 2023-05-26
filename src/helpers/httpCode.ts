// /** @public */
// export type Code = { [ key: string]: symbol };

/**
 * List of http code
 *
 * @remarks
 * Use UNAUTHORIZED when the action need an authentification and the viewer is a guest
 * Use FORBIDDEN when the user is auth but he has no rights
 *
 * @public
 */
const httpCode = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  NEED_ACTION: 290,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  GONE: 410,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
} as const;

/** @public */
export type HttpCode = typeof httpCode[keyof typeof httpCode];

export default httpCode;
