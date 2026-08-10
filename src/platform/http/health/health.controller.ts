// platform/http/health/health.controller.ts

import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppConfigService } from '@platform/config';
import { HEALTH_ROUTES, HEALTH_SWAGGER_TAG } from './health-constants';

@ApiTags(HEALTH_SWAGGER_TAG.name)
@Controller(HEALTH_ROUTES.ROOT)
export class HealthController {
  constructor(private readonly config: AppConfigService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getHealth() {
    return {
      status: 'ok',
      environment: this.config.nodeEnv,
      uptime: process.uptime(),
    };
  }
}
