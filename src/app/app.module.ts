// app.module.ts

import { Module } from "@nestjs/common";

import { PlatformModule } from "@platform";
import { ModulesModule } from "@modules";

@Module({
  imports: [PlatformModule, ModulesModule]
})
export class AppModule {}
