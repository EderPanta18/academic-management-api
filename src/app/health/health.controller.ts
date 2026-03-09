// app/health/health.controller.ts

import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAGS } from '@shared/presentation/constants';

@ApiTags(SWAGGER_TAGS.HEALTH)
@Controller()
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'API funcionando correctamente' })
  getHealth() {
    return {
      message: 'Academic Management API v1.0 - funcionando correctamente',
    };
  }
}
