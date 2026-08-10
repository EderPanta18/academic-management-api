// src/platform/http/filters/app-exception.filter.ts

import {
  AppException,
  DomainException,
  type FieldError,
  ValidationException,
} from '@core/exceptions';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ApiErrorResponse, ApiFieldError, ErrorPayload } from '../responses';

@Catch(AppException)
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: AppException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const errorPayload: ErrorPayload = {
      key: exception.errorKey,
      code: exception.errorCode,
      message: exception.message,
    };

    if (exception instanceof ValidationException)
      errorPayload.fieldErrors = this.toApiFieldErrors(exception.fieldErrors);

    if (exception instanceof DomainException) errorPayload.domain = exception.domain;

    const response: ApiErrorResponse = {
      success: false,
      statusCode: exception.statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl ?? req.url,
      error: errorPayload,
    };

    res.status(exception.statusCode).json(response);
  }

  private toApiFieldErrors(fieldErrors: FieldError[]): ApiFieldError[] {
    return fieldErrors.map(({ field, messages }) => ({
      field,
      messages,
    }));
  }
}
