// src/platform/http/guards/origin.guard.ts

import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@platform/config';
import type { Request } from 'express';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

@Injectable()
export class OriginGuard implements CanActivate {
  private readonly allowedOrigins: ReadonlySet<string>;

  constructor(config: ConfigService) {
    this.allowedOrigins = new Set(config.cors.origins);
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    if (SAFE_METHODS.has(request.method)) return true;

    const origin = request.headers.origin;

    if (typeof origin === 'string' && this.allowedOrigins.has(origin)) return true;

    throw new ForbiddenException('Origen de solicitud no autorizado.');
  }
}
