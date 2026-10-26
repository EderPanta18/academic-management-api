// src/platform/config/config.module.ts

import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { buildConfig } from './config.factory';
import { ConfigService } from './config.service';
import { validateEnvironment } from './env';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      skipProcessEnv: true,
      expandVariables: false,
      load: [() => buildConfig(validateEnvironment(process.env))],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
