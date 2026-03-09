// app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/infrastructure/persistence';
import { AppPipelineModule } from './app';
import { ModulesModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    PrismaModule,
    AppPipelineModule,
    ModulesModule,
  ],
})
export class AppModule {}
