// platform/config/env.validation.ts

import { plainToInstance, Type } from 'class-transformer';
import {
  IsBooleanString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export const NODE_ENV_VALUES = ['development', 'test', 'production'] as const;

export type NodeEnvironment = (typeof NODE_ENV_VALUES)[number];

export const ENV_DEFAULTS = {
  PORT: 3000,
  NODE_ENV: 'development',
  CORS_ORIGIN: 'http://localhost:5173',
  DATABASE_LOG_QUERIES: 'false',
} as const;

export class EnvironmentVariables {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT = ENV_DEFAULTS.PORT;

  @IsIn(NODE_ENV_VALUES)
  NODE_ENV: NodeEnvironment = ENV_DEFAULTS.NODE_ENV;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  CORS_ORIGIN = ENV_DEFAULTS.CORS_ORIGIN;

  @IsBooleanString()
  DATABASE_LOG_QUERIES = ENV_DEFAULTS.DATABASE_LOG_QUERIES;
}

export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    exposeDefaultValues: true,
    enableImplicitConversion: false,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    whitelist: true,
  });

  if (errors.length > 0) throw new Error(errors.toString());

  return validatedConfig;
}
