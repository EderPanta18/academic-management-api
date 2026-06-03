// platform/http/interceptors/success-response.interceptor.ts

import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type { ApiSuccessResponse } from '../responses';

@Injectable()
export class SuccessResponseInterceptor<T> implements NestInterceptor<T, ApiSuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiSuccessResponse<T>> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map(
        (data): ApiSuccessResponse<T> => ({
          success: true,
          statusCode: res.statusCode,
          data,
          timestamp: new Date().toISOString(),
          path: req.url,
        }),
      ),
    );
  }
}
