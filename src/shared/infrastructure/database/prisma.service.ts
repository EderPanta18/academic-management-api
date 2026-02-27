// shared/infrastructure/database/prisma.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService) {
    const databaseUrl = configService.getOrThrow<string>('DATABASE_URL');
    const url = new URL(databaseUrl);

    const adapter = new PrismaMariaDb({
      host: url.hostname,
      port: parseInt(url.port, 10),
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      connectionLimit: 5,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
