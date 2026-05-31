// platform/config/runtime-config.service.ts

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { NodeEnvironment } from "./env.validation";

@Injectable()
export class RuntimeConfigService {
  constructor(private readonly configService: ConfigService) {}

  get port(): number {
    return this.configService.getOrThrow<number>("PORT");
  }

  get nodeEnv(): NodeEnvironment {
    return this.configService.getOrThrow<NodeEnvironment>("NODE_ENV");
  }

  get databaseUrl(): string {
    return this.configService.getOrThrow<string>("DATABASE_URL");
  }

  get corsOrigins(): string[] {
    return this.configService
      .getOrThrow<string>("CORS_ORIGIN")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);
  }

  get databaseLogQueries(): boolean {
    return (
      this.configService.getOrThrow<string>("DATABASE_LOG_QUERIES") === "true"
    );
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === "development";
  }

  get isTest(): boolean {
    return this.nodeEnv === "test";
  }

  get isProduction(): boolean {
    return this.nodeEnv === "production";
  }
}
