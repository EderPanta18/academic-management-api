// src/platform/http/health/health.controller.ts

import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '@platform/database';
import { HEALTH_ROUTES, HEALTH_SWAGGER_TAG } from './health.constants';

const DATABASE_CHECK_TIMEOUT_MS = 2_000;

@ApiTags(HEALTH_SWAGGER_TAG.name)
@Controller(HEALTH_ROUTES.ROOT)
export class HealthController {
  constructor(private readonly database: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Comprobar la vida del proceso API' })
  getHealth() {
    return {
      status: 'ok',
      uptimeSeconds: process.uptime(),
    };
  }

  @Get(HEALTH_ROUTES.READY)
  @ApiOperation({ summary: 'Comprobar disponibilidad de PostgreSQL' })
  async getReadiness(): Promise<{
    status: string;
    database: string;
  }> {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    try {
      await Promise.race([
        this.database.$queryRaw`SELECT 1`,

        new Promise<never>((_, reject) => {
          timeout = setTimeout(
            () => reject(new Error('Database readiness timeout')),
            DATABASE_CHECK_TIMEOUT_MS,
          );
        }),
      ]);

      return {
        status: 'ready',
        database: 'available',
      };
    } catch {
      throw new ServiceUnavailableException(
        'El servicio no está preparado para recibir solicitudes.',
      );
    } finally {
      if (timeout !== undefined) clearTimeout(timeout);
    }
  }
}
