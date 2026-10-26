// src/platform/http/filters/http-exceptions.filter.ts

import {
  AppException,
  type DomainErrorReason,
  DomainException,
  type ErrorKind,
  ValidationException,
} from '@core/exceptions';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { HttpErrorPayload, HttpErrorResponse } from '../http-response.types';

const STATUS_BY_KIND: Record<Exclude<ErrorKind, 'DOMAIN'>, number> = {
  VALIDATION: 400,
  CONFLICT: 409,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  SYSTEM: 500,
};

const STATUS_BY_DOMAIN_REASON: Record<DomainErrorReason, number> = {
  VALIDATION: 400,
  CONFLICT: 409,
  NOT_FOUND: 404,
};

const KEY_BY_KIND: Record<Exclude<ErrorKind, 'DOMAIN'>, string> = {
  VALIDATION: 'VALIDATION_ERROR',
  CONFLICT: 'CONFLICT',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  SYSTEM: 'INTERNAL_SERVER_ERROR',
};

const HTTP_ERRORS: Record<number, { key: string; message: string }> = {
  400: { key: 'BAD_REQUEST', message: 'Solicitud no válida.' },
  401: { key: 'UNAUTHORIZED', message: 'Autenticación requerida.' },
  403: { key: 'FORBIDDEN', message: 'Acceso denegado.' },
  404: { key: 'NOT_FOUND', message: 'Recurso no encontrado.' },
  405: { key: 'METHOD_NOT_ALLOWED', message: 'Método no permitido.' },
  409: { key: 'CONFLICT', message: 'La solicitud presenta un conflicto.' },
  413: { key: 'PAYLOAD_TOO_LARGE', message: 'El contenido supera el límite permitido.' },
  415: { key: 'UNSUPPORTED_MEDIA_TYPE', message: 'Tipo de contenido no admitido.' },
  429: { key: 'TOO_MANY_REQUESTS', message: 'Demasiadas solicitudes.' },
  503: { key: 'SERVICE_UNAVAILABLE', message: 'Servicio temporalmente no disponible.' },
};

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    if (response.headersSent) return;

    const statusCode = this.getStatusCode(exception);

    if (statusCode >= 500) {
      const exceptionName = exception instanceof Error ? exception.name : 'UnknownError';

      const message = `HTTP ${request.method} → ${statusCode} (${exceptionName})`;

      if (statusCode === HttpStatus.SERVICE_UNAVAILABLE) {
        this.logger.warn(message);
      } else {
        this.logger.error(message);
      }
    }

    const result: HttpErrorResponse = {
      success: false,
      statusCode,
      timestamp: new Date().toISOString(),
      path: (request.originalUrl ?? request.url).split('?')[0],
      error: this.getErrorPayload(exception, statusCode),
    };

    response.status(statusCode).json(result);
  }

  private getStatusCode(exception: unknown): number {
    if (exception instanceof DomainException) return STATUS_BY_DOMAIN_REASON[exception.reason];

    if (exception instanceof AppException) return STATUS_BY_KIND[exception.kind];

    if (exception instanceof HttpException) return exception.getStatus();

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getErrorPayload(exception: unknown, statusCode: number): HttpErrorPayload {
    if (statusCode >= 500 && statusCode !== 503)
      return {
        key: 'INTERNAL_SERVER_ERROR',
        code: 'SYS_001',
        message: 'Ocurrió un error inesperado.',
      };

    if (exception instanceof DomainException)
      return {
        key: KEY_BY_KIND[exception.reason],
        code: exception.errorCode,
        message: exception.message,
        domain: exception.domain,
      };

    if (exception instanceof AppException) {
      const payload: HttpErrorPayload = {
        key: KEY_BY_KIND[exception.kind],
        code: exception.errorCode,
        message: exception.message,
      };

      if (exception instanceof ValidationException && exception.fieldErrors.length > 0)
        payload.fieldErrors = exception.fieldErrors;

      return payload;
    }

    const known = HTTP_ERRORS[statusCode];

    return {
      key: known?.key ?? 'HTTP_ERROR',
      code: `HTTP_${statusCode}`,
      message: known?.message ?? 'No se pudo completar la solicitud.',
    };
  }
}
