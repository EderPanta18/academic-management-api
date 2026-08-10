/* // prisma/client.ts

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) throw new Error('DATABASE_URL no está definida.');

class SeedPrismaClient extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: databaseUrl,
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
 */
