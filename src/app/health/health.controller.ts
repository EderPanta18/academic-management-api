// app/health/health.controller.ts

import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
@Controller()
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  getHealth() {
    return {
      message: 'Academic Management API v1.0 - funcionando correctamente',
    };
  }
}
