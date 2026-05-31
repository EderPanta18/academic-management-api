// platform.module.ts

import { Module } from "@nestjs/common";

import { RuntimeConfigModule } from "./config";
import { PrismaModule } from "./database";
import { HttpModule } from "./http";

@Module({
  imports: [RuntimeConfigModule, PrismaModule, HttpModule],
  exports: [RuntimeConfigModule, PrismaModule]
})
export class PlatformModule {}
