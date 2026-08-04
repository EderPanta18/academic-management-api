// platform/database/prisma/prisma.service.ts

import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { AppConfigService } from '@platform/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(config: AppConfigService) {
    const databaseConfig = config.database;

    const adapter = new PrismaPg({
      connectionString: databaseConfig.url,
    });

    super({
      adapter,
      log: databaseConfig.logQueries ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
