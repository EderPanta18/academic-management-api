// prisma/client.ts

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) throw new Error('DATABASE_URL is not defined');

class SeedPrismaClient extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: dbUrl,
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
