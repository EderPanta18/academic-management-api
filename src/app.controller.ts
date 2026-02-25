// app.controller.ts

import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'API funcionando correctamente' })
  getHealth() {
    return {
      success: true,
      statusCode: 200,
      message: 'Academic Management API v1.0 - funcionando correctamente',
      timestamp: new Date().toISOString(),
    };
  }
}
