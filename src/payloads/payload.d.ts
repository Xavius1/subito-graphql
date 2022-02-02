export type TPayloadInput = {
  message: string,
  data: any,
  success?: boolean,
  code?: 200 | 403,
  keyData?: string,
}

export type TPayload = {
  message: string,
  success: boolean,
  code: 200 | 403,
  [keyData: string]: any,
}
