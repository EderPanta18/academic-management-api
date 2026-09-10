// src/platform/config/app-config.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from './configuration';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<AppConfig, true>) {}

  // Getters por sección
  get app() {
    return this.configService.get('app', { infer: true });
  }

  get database() {
    return this.configService.get('database', { infer: true });
  }

  get queue() {
    return this.configService.get('queue', { infer: true });
  }

  get jwt() {
    return this.configService.get('jwt', { infer: true });
  }

  get auth() {
    return this.configService.get('auth', { infer: true });
  }

  get cors() {
    return this.configService.get('cors', { infer: true });
  }

  get openapi() {
    return this.configService.get('openapi', { infer: true });
  }

  get admin() {
    return this.configService.get('admin', { infer: true });
  }

  get upload() {
    return this.configService.get('upload', { infer: true });
  }

  get log() {
    return this.configService.get('log', { infer: true });
  }

  // Getters directos para propiedades anidadas
  get port() {
    return this.app.port;
  }

  get nodeEnv() {
    return this.app.nodeEnv;
  }

  get isDevelopment() {
    return this.nodeEnv === 'development';
  }

  get isTest() {
    return this.nodeEnv === 'test';
  }

  get isProduction() {
    return this.nodeEnv === 'production';
  }
}
