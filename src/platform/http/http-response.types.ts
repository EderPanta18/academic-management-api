// src/platform/http/http-response.types.ts

export type HttpResponseBase = {
  statusCode: number;
  timestamp: string;
  path: string;
};

export type HttpFieldError = {
  field: string;
  messages: string[];
};

export type HttpErrorPayload = {
  key: string;
  code: string;
  message: string;
  domain?: string;
  fieldErrors?: HttpFieldError[];
};

export type HttpSuccessResponse<T> = HttpResponseBase & {
  success: true;
  data: T;
  error?: never;
};

export type HttpErrorResponse = HttpResponseBase & {
  success: false;
  error: HttpErrorPayload;
  data?: never;
};

export type HttpResponse<T> = HttpSuccessResponse<T> | HttpErrorResponse;
