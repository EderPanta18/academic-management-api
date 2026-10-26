// src/platform/http/interceptors/http-logging.interceptor.ts

import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  Logger,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { type Observable, tap } from 'rxjs';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const route = request.route?.path;
    const path = typeof route === 'string' ? `${request.baseUrl}${route}` : '[ruta]';

    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Date.now() - startedAt;

          this.logger.log(`${request.method} ${path} → ${response.statusCode} [${durationMs}ms]`);
        },
      }),
    );
  }
}
