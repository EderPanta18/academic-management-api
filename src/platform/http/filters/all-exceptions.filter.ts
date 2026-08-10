// platform/http/filters/all-exceptions.filter.ts

import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { AppConfigService } from '@platform/config';
import type { Request, Response } from 'express';
import type { ApiErrorResponse } from '../responses';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly config: AppConfigService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const errorKey = 'INTERNAL_SERVER_ERROR';
    const errorCode = 'SYS_001';

    const message = this.config.isProduction
      ? 'Ocurrió un error inesperado.'
      : exception instanceof Error
        ? exception.message
        : 'Error desconocido';

    this.logger.error(
      `Error inesperado: ${exception instanceof Error ? exception.stack : exception}`,
    );

    const response: ApiErrorResponse = {
      success: false,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl ?? req.url,
      error: {
        key: errorKey,
        code: errorCode,
        message,
        ...(this.config.isDevelopment && exception instanceof Error
          ? { details: exception.stack }
          : {}),
      },
    };

    res.status(statusCode).json(response);
  }
}
