// platform/http/responses/api-response.types.ts

export interface ApiResponseBase {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
}

export interface ApiSuccessResponse<T> extends ApiResponseBase {
  success: true;
  data: T;
}

export interface ApiErrorResponse extends ApiResponseBase {
  success: false;
  errorKey: string;
  errorCode: string;
  message: string;
  domain?: string;
  fieldErrors?: Record<string, string[]>;
  errorName?: string;
  stack?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
