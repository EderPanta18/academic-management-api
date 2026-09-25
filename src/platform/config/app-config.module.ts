// src/platform/config/app-config.module.ts

import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './app-config.service';
import { buildAppConfig } from './configuration';
import { type EnvironmentVariables, validateEnvironment } from './env';

let validatedEnv: EnvironmentVariables;

function getValidatedEnv(): EnvironmentVariables {
  if (!validatedEnv)
    throw new Error(
      'Environment variables were requested before validation. ' +
        'Ensure AppConfigModule is imported and ConfigModule.forRoot ran first.',
    );

  return validatedEnv;
}

function validateAndStore(raw: Record<string, unknown>): EnvironmentVariables {
  validatedEnv = validateEnvironment(raw);

  return validatedEnv;
}

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      skipProcessEnv: true,
      validate: validateAndStore,
      load: [() => buildAppConfig(getValidatedEnv())],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
