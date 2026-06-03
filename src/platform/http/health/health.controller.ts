// platform/http/health/health.controller.ts

import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { RuntimeConfigService } from "@platform/config";
import { HEALTH_SWAGGER_TAG } from "./health-constants";

@ApiTags(HEALTH_SWAGGER_TAG.name)
@Controller("health")
export class HealthController {
  constructor(private readonly config: RuntimeConfigService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getHealth() {
    return {
      status: "ok",
      environment: this.config.nodeEnv,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }
}
