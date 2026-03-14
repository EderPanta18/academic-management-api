// app/filters/all-exceptions.filter.ts

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
    const isDev = nodeEnv !== 'production';

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
              errorKey: 'HTTP_ERROR',
              errorCode: `SYS_${statusCode}`,
              message: String(body),
              timestamp: new Date().toISOString(),
              path: req.url,
            },
      );
      return;
    }

    const error =
      exception instanceof Error
        ? exception
        : new Error(
            typeof exception === 'string' ? exception : 'Unknown error',
          );

    this.logger.error(`[${req.method}] ${req.url} → 500`, error.stack);

    res.status(500).json({
      success: false,
      statusCode: 500,
      errorKey: 'INTERNAL_SERVER_ERROR',
      errorCode: 'SYS_500',
      message: error.message,
      timestamp: new Date().toISOString(),
      path: req.url,
      ...(isDev && {
        errorName: error.name,
        stack: error.stack,
      }),
    });
  }
}
