// platform/http/filters/all-exceptions.filter.ts

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger
} from "@nestjs/common";
import { RuntimeConfigService } from "@platform/config";
import type { Request, Response } from "express";

import type { ApiErrorResponse } from "../responses";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly config: RuntimeConfigService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();
    const path = req.url;

    const isDev = this.config.isProduction;

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const body = exception.getResponse();

      this.logger.warn(`[${req.method}] ${path} → ${statusCode}`);

      const response: ApiErrorResponse =
        typeof body === "object" && body !== null
          ? {
              success: false,
              statusCode,
              errorKey: "HTTP_ERROR",
              errorCode: `SYS_${statusCode}`,
              message: "HTTP exception",
              ...body,
              timestamp,
              path
            }
          : {
              success: false,
              statusCode,
              errorKey: "HTTP_ERROR",
              errorCode: `SYS_${statusCode}`,
              message: String(body),
              timestamp,
              path
            };

      res.status(statusCode).json(response);

      return;
    }

    const error =
      exception instanceof Error
        ? exception
        : new Error(
            typeof exception === "string" ? exception : "Unknown error"
          );

    this.logger.error(`[${req.method}] ${path} → 500`, error.stack);

    const response: ApiErrorResponse = {
      success: false,
      statusCode: 500,
      errorKey: "INTERNAL_SERVER_ERROR",
      errorCode: "SYS_500",
      message: error.message,
      timestamp,
      path,
      ...(isDev && {
        errorName: error.name,
        stack: error.stack
      })
    };

    res.status(500).json(response);
  }
}
