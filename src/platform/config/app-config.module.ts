// src/platform/config/app-config.module.ts

import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './app-config.service';
import { buildAppConfig } from './configuration';
import { validateEnvironment } from './env';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      skipProcessEnv: true,
      expandVariables: false,
      load: [() => buildAppConfig(validateEnvironment(process.env))],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
