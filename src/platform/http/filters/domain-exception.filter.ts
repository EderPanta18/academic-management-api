// platform/http/filters/domain-exception.filter.ts

import { DomainException } from '@core/exceptions';
import { type ArgumentsHost, Catch, type ExceptionFilter } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ApiErrorResponse } from '../responses';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const response: ApiErrorResponse = {
      success: false,
      statusCode: exception.statusCode,
      domain: exception.domain,
      errorKey: exception.errorKey,
      errorCode: exception.errorCode,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: req.url,
    };

    res.status(exception.statusCode).json(response);
  }
}
