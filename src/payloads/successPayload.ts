import type { TPayloadInput, TPayload } from './payload';

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
