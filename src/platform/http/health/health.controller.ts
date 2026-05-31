// platform/http/health/health.controller.ts

import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";

import { RuntimeConfigService } from "@platform/config";

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
