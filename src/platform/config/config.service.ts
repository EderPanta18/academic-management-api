import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import type { Config } from './config.factory';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService<Config, true>) {}

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

  get port() {
    return this.app.port;
  }

  get nodeEnv() {
    return this.configService.get('nodeEnv', { infer: true });
  }

  get apiPrefix() {
    return this.configService.get('apiPrefix', { infer: true });
  }

  get logLevel() {
    return this.configService.get('logLevel', { infer: true });
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
