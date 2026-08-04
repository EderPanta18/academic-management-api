// src/platform/config/app-config.module.ts

import { SystemException } from '@core/exceptions';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './app-config.service';
import { buildAppConfig } from './configuration';
import { EnvironmentVariables } from './env.types';
import { validateEnvironment } from './env.validation';

let validatedEnv: EnvironmentVariables;

export function getValidatedEnv(): EnvironmentVariables {
  if (!validatedEnv) throw new SystemException('El entorno aún no se ha validado.');

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
