// platform/http/responses/api-response.types.ts

export type ApiResponseBase = {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
};

export type ApiFieldError = {
  field: string;
  messages: string[];
};

export type ErrorPayload = {
  key: string;
  code: string;
  message: string;
  domain?: string;
  fieldErrors?: ApiFieldError[];
};

export type ApiSuccessResponse<T> = ApiResponseBase & {
  success: true;
  data: T;
};

export type ApiErrorResponse = ApiResponseBase & {
  success: false;
  error: ErrorPayload;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
