// platform/database/prisma/prisma.service.ts

import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { RuntimeConfigService } from "@platform/config";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: RuntimeConfigService) {
    const adapter = new PrismaPg({
      connectionString: config.databaseUrl
    });

    super({
      adapter,
      log: config.databaseLogQueries
        ? ["query", "info", "warn", "error"]
        : ["warn", "error"]
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
