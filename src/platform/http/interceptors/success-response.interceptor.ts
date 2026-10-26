// src/platform/http/interceptors/success-response.interceptor.ts

import { SystemException } from '@core/exceptions';
import {
  type CallHandler,
  type ExecutionContext,
  HttpStatus,
  Injectable,
  type NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { map, type Observable } from 'rxjs';
import type { HttpSuccessResponse } from '../http-response.types';

@Injectable()
export class SuccessResponseInterceptor<T>
  implements NestInterceptor<T, HttpSuccessResponse<T> | T | undefined>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<HttpSuccessResponse<T> | T | undefined> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    return next.handle().pipe(
      map((data): HttpSuccessResponse<T> | T | undefined => {
        if (
          response.statusCode === HttpStatus.NO_CONTENT ||
          response.statusCode === HttpStatus.NOT_MODIFIED
        )
          return undefined;

        if (response.headersSent || data instanceof StreamableFile) return data;

        const contentType = response.getHeader('Content-Type');

        if (typeof contentType === 'string' && !contentType.toLowerCase().includes('json'))
          return data;

        if (data === undefined)
          throw new SystemException('La operación HTTP no devolvió los datos esperados.');

        return {
          success: true,
          statusCode: response.statusCode,
          timestamp: new Date().toISOString(),
          path: (request.originalUrl ?? request.url).split('?')[0],
          data,
        };
      }),
    );
  }
}
