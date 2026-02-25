// shared/infrastructure/database/prisma.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { databaseConfig } from '@config/index';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Parseamos la URL para extraer los campos que PrismaMariaDb espera
    const url = new URL(databaseConfig().url);
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
