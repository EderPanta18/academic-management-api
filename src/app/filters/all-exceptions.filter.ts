// app/filters/all-exceptions.filter.ts

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const body = exception.getResponse();

      this.logger.warn(`[${req.method}] ${req.url} → ${statusCode}`);

      res.status(statusCode).json(
        typeof body === 'object'
          ? { ...body, timestamp: new Date().toISOString(), path: req.url }
          : {
              success: false,
              statusCode,
              errorKey: `HTTP_ERROR`,
              errorCode: `SYS_${statusCode}`,
              message: String(body),
              timestamp: new Date().toISOString(),
              path: req.url,
            },
      );
      return;
    }

    // Error completamente inesperado
    this.logger.error(
      `[${req.method}] ${req.url} → 500`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    res.status(500).json({
      success: false,
      statusCode: 500,
      errorKey: 'INTERNAL_SERVER_ERROR',
      errorCode: 'SYS_500',
      message: 'Ha ocurrido un error inesperado. Intente nuevamente.',
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}
