// src/platform/config/env.validation.ts

import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  ValidationError,
  validateSync,
} from 'class-validator';
import { EnvironmentVariables, LogLevel, NodeEnvironment } from './env.types';

export const NODE_ENV_VALUES = ['development', 'test', 'production'] as const;

export const LOG_LEVEL_VALUES = ['debug', 'info', 'warn', 'error', 'fatal'] as const;

class EnvironmentVariablesClass {
  @IsIn(NODE_ENV_VALUES)
  NODE_ENV!: NodeEnvironment;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  APP_PORT!: number;

  @IsString()
  @IsNotEmpty()
  APP_NAME!: string;

  @IsString()
  @IsNotEmpty()
  APP_VERSION!: string;

  @IsIn(LOG_LEVEL_VALUES)
  LOG_LEVEL!: LogLevel;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  DATABASE_LOG_QUERIES!: boolean;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_NAME!: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_EXPIRES_IN!: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_NAME!: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_EXPIRES_IN!: string;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  AUTH_SINGLE_SESSION!: boolean;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  AUTH_REFRESH_TOKEN_ROTATION!: boolean;

  @IsString()
  @IsNotEmpty()
  CORS_ORIGIN!: string;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  CORS_CREDENTIALS!: boolean;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  OPENAPI_ENABLED!: boolean;

  @IsString()
  @IsNotEmpty()
  OPENAPI_PATH!: string;

  @IsString()
  @IsNotEmpty()
  ADMIN_EMAIL!: string;

  @IsString()
  @IsNotEmpty()
  ADMIN_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  ADMIN_FIRST_NAME!: string;

  @IsString()
  @IsNotEmpty()
  ADMIN_LAST_NAME!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  UPLOAD_MAX_FILE_SIZE!: number;

  @IsString()
  @IsNotEmpty()
  UPLOAD_ALLOWED_MIME_TYPES!: string;

  @IsString()
  @IsNotEmpty()
  REDIS_URL!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  QUEUE_EVENT_BUS_ATTEMPTS!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  QUEUE_EVENT_BUS_REMOVE_ON_COMPLETE!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  QUEUE_EVENT_BUS_REMOVE_ON_FAIL!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  QUEUE_EVENT_BUS_CONCURRENCY!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  QUEUE_JOB_ATTEMPTS!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  QUEUE_JOB_BACKOFF_DELAY_MS!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  QUEUE_JOB_REMOVE_ON_COMPLETE!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  QUEUE_JOB_REMOVE_ON_FAIL!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  QUEUE_JOB_CONCURRENCY!: number;
}

function formatValidationErrors(errors: ValidationError[]): string {
  return errors
    .flatMap((error) =>
      Object.values(error.constraints ?? {}).map((message) => `- ${error.property}: ${message}`),
    )
    .join('\n');
}

export function validateEnvironment(rawConfig: Record<string, unknown>): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariablesClass, rawConfig, {
    exposeDefaultValues: false,
    enableImplicitConversion: false,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
    whitelist: true,
  });

  if (errors.length > 0)
    throw new Error(`❌ Variables de entorno no válidas:\n${formatValidationErrors(errors)}`);

  return {
    NODE_ENV: validated.NODE_ENV,
    APP_PORT: validated.APP_PORT,
    APP_NAME: validated.APP_NAME,
    APP_VERSION: validated.APP_VERSION,
    LOG_LEVEL: validated.LOG_LEVEL,
    DATABASE_URL: validated.DATABASE_URL,
    DATABASE_LOG_QUERIES: validated.DATABASE_LOG_QUERIES,
    JWT_ACCESS_NAME: validated.JWT_ACCESS_NAME,
    JWT_ACCESS_SECRET: validated.JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRES_IN: validated.JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_NAME: validated.JWT_REFRESH_NAME,
    JWT_REFRESH_SECRET: validated.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN: validated.JWT_REFRESH_EXPIRES_IN,
    AUTH_SINGLE_SESSION: validated.AUTH_SINGLE_SESSION,
    AUTH_REFRESH_TOKEN_ROTATION: validated.AUTH_REFRESH_TOKEN_ROTATION,
    CORS_ORIGIN: validated.CORS_ORIGIN,
    CORS_CREDENTIALS: validated.CORS_CREDENTIALS,
    OPENAPI_ENABLED: validated.OPENAPI_ENABLED,
    OPENAPI_PATH: validated.OPENAPI_PATH,
    ADMIN_EMAIL: validated.ADMIN_EMAIL,
    ADMIN_PASSWORD: validated.ADMIN_PASSWORD,
    ADMIN_FIRST_NAME: validated.ADMIN_FIRST_NAME,
    ADMIN_LAST_NAME: validated.ADMIN_LAST_NAME,
    UPLOAD_MAX_FILE_SIZE: validated.UPLOAD_MAX_FILE_SIZE,
    UPLOAD_ALLOWED_MIME_TYPES: validated.UPLOAD_ALLOWED_MIME_TYPES,
    REDIS_URL: validated.REDIS_URL,
    QUEUE_EVENT_BUS_ATTEMPTS: validated.QUEUE_EVENT_BUS_ATTEMPTS,
    QUEUE_EVENT_BUS_REMOVE_ON_COMPLETE: validated.QUEUE_EVENT_BUS_REMOVE_ON_COMPLETE,
    QUEUE_EVENT_BUS_REMOVE_ON_FAIL: validated.QUEUE_EVENT_BUS_REMOVE_ON_FAIL,
    QUEUE_EVENT_BUS_CONCURRENCY: validated.QUEUE_EVENT_BUS_CONCURRENCY,
    QUEUE_JOB_ATTEMPTS: validated.QUEUE_JOB_ATTEMPTS,
    QUEUE_JOB_BACKOFF_DELAY_MS: validated.QUEUE_JOB_BACKOFF_DELAY_MS,
    QUEUE_JOB_REMOVE_ON_COMPLETE: validated.QUEUE_JOB_REMOVE_ON_COMPLETE,
    QUEUE_JOB_REMOVE_ON_FAIL: validated.QUEUE_JOB_REMOVE_ON_FAIL,
    QUEUE_JOB_CONCURRENCY: validated.QUEUE_JOB_CONCURRENCY,
  };
}
