// prisma/client.ts

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const dbUrl = process.env.DATABASE_URL!;

class SeedPrismaClient extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: dbUrl
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
