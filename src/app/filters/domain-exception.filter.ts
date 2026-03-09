// app/filters/domain-exception.filter.ts

import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException } from '@core/domain/exceptions';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    res.status(exception.statusCode).json({
      success: false,
      statusCode: exception.statusCode,
      domain: exception.domain,
      errorKey: exception.errorKey,
      errorCode: exception.errorCode,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}
