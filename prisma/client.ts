// prisma/client.ts

import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const dbUrl = process.env.DATABASE_URL!;

class SeedPrismaClient extends PrismaClient {
  constructor() {
    const url = new URL(dbUrl);
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

  async connect() {
    await this.$connect();
  }
  async disconnect() {
    await this.$disconnect();
  }
}

export const prisma = new SeedPrismaClient();
