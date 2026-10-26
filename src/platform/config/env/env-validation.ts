// src/platform/config/env/env-validation.ts

import { Buffer } from 'node:buffer';
import { URL } from 'node:url';
import { plainToInstance, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  Min,
  type ValidationError,
  validateSync,
} from 'class-validator';
import type { EnvironmentVariables, LogLevel, NodeEnvironment } from './env.types';

const NODE_ENV_VALUES = ['development', 'test', 'production'] as const;
const LOG_LEVEL_VALUES = ['debug', 'info', 'warn', 'error'] as const;

const ROUTE_PATTERN = /^\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/;
const SCHEMA_PATTERN = /^[a-z_][a-z0-9_]*$/;
const COOKIE_NAME_PATTERN = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
const JWT_DURATION_PATTERN = /^([1-9][0-9]*)(s|m|h|d)$/;
const INTEGER_PATTERN = /^(0|[1-9][0-9]*)$/;

function parseBoolean(value: unknown): unknown {
  if (value === true || value === 'true') return true;

  if (value === false || value === 'false') return false;

  return value;
}

function parseInteger(value: unknown): unknown {
  if (typeof value !== 'string') return value;

  if (!INTEGER_PATTERN.test(value)) return value;

  const parsed = Number(value);

  return Number.isSafeInteger(parsed) ? parsed : value;
}

class EnvironmentVariablesClass implements EnvironmentVariables {
  @IsIn(NODE_ENV_VALUES)
  NODE_ENV!: NodeEnvironment;

  @Transform(({ value }) => parseInteger(value))
  @IsInt()
  @Min(1)
  @Max(65535)
  APP_PORT!: number;

  @IsString()
  @IsNotEmpty()
  APP_NAME!: string;

  @IsString()
  @IsNotEmpty()
  APP_DESCRIPTION!: string;

  @IsString()
  @IsNotEmpty()
  APP_VERSION!: string;

  @IsString()
  @Matches(ROUTE_PATTERN)
  API_PREFIX!: string;

  @IsIn(LOG_LEVEL_VALUES)
  LOG_LEVEL!: LogLevel;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  DIRECT_DATABASE_URL!: string;

  @Transform(({ value }) => parseBoolean(value))
  @IsBoolean()
  DATABASE_LOG_QUERIES!: boolean;

  @IsString()
  @Matches(SCHEMA_PATTERN)
  QUEUE_SCHEMA!: string;

  @Transform(({ value }) => parseInteger(value))
  @IsInt()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  QUEUE_RETRY_LIMIT!: number;

  @Transform(({ value }) => parseInteger(value))
  @IsInt()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  QUEUE_RETRY_DELAY_MS!: number;

  @Transform(({ value }) => parseBoolean(value))
  @IsBoolean()
  QUEUE_RETRY_BACKOFF!: boolean;

  @Transform(({ value }) => parseInteger(value))
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  QUEUE_EXPIRE_IN_MINUTES!: number;

  @Transform(({ value }) => parseInteger(value))
  @IsInt()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  QUEUE_ARCHIVE_COMPLETED_AFTER_DAYS!: number;

  @Transform(({ value }) => parseInteger(value))
  @IsInt()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  QUEUE_ARCHIVE_FAILED_AFTER_DAYS!: number;

  @Transform(({ value }) => parseInteger(value))
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  QUEUE_JOB_CONCURRENCY!: number;

  @Transform(({ value }) => parseInteger(value))
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  QUEUE_EVENT_CONCURRENCY!: number;

  @IsString()
  @Matches(COOKIE_NAME_PATTERN)
  JWT_ACCESS_NAME!: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_EXPIRES_IN!: string;

  @IsString()
  @Matches(COOKIE_NAME_PATTERN)
  JWT_REFRESH_NAME!: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_EXPIRES_IN!: string;

  @Transform(({ value }) => parseBoolean(value))
  @IsBoolean()
  AUTH_SINGLE_SESSION!: boolean;

  @Transform(({ value }) => parseBoolean(value))
  @IsBoolean()
  AUTH_REFRESH_TOKEN_ROTATION!: boolean;

  @IsString()
  @IsNotEmpty()
  CORS_ORIGINS!: string;

  @Transform(({ value }) => parseBoolean(value))
  @IsBoolean()
  CORS_CREDENTIALS!: boolean;

  @Transform(({ value }) => parseBoolean(value))
  @IsBoolean()
  OPENAPI_ENABLED!: boolean;

  @IsString()
  @Matches(ROUTE_PATTERN)
  OPENAPI_PATH!: string;

  @IsEmail()
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
}

function formatValidationErrors(errors: ValidationError[]): string {
  return errors
    .flatMap((error) =>
      Object.values(error.constraints ?? {}).map((message) => `- ${error.property}: ${message}`),
    )
    .join('\n');
}

function isPostgresUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return (
      (url.protocol === 'postgresql:' || url.protocol === 'postgres:') && url.hostname.length > 0
    );
  } catch {
    return false;
  }
}

function isValidJwtDuration(value: string): boolean {
  const match = JWT_DURATION_PATTERN.exec(value);

  if (!match) return false;

  const amount = Number(match[1]);

  if (!Number.isSafeInteger(amount)) return false;

  const unit = match[2];

  const multiplier =
    unit === 's' ? 1_000 : unit === 'm' ? 60_000 : unit === 'h' ? 3_600_000 : 86_400_000;

  const durationMs = amount * multiplier;

  return Number.isSafeInteger(durationMs) && durationMs > 0;
}

function isValidOrigin(origin: string, production: boolean): boolean {
  try {
    const url = new URL(origin);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

    if (production && url.protocol !== 'https:') return false;

    return url.origin === origin && url.username === '' && url.password === '';
  } catch {
    return false;
  }
}

function validateConfiguration(env: EnvironmentVariables): void {
  const errors: string[] = [];
  const production = env.NODE_ENV === 'production';

  // Database

  if (!isPostgresUrl(env.DATABASE_URL))
    errors.push('DATABASE_URL debe ser una URL PostgreSQL válida.');

  if (!isPostgresUrl(env.DIRECT_DATABASE_URL))
    errors.push('DIRECT_DATABASE_URL debe ser una URL PostgreSQL válida.');

  // Queue

  if (Buffer.byteLength(env.QUEUE_SCHEMA, 'utf8') > 63)
    errors.push('QUEUE_SCHEMA supera el límite de un identificador PostgreSQL.');

  const queueDurations = [
    {
      name: 'QUEUE_EXPIRE_IN_MINUTES',
      value: env.QUEUE_EXPIRE_IN_MINUTES,
      multiplier: 60,
    },
    {
      name: 'QUEUE_ARCHIVE_COMPLETED_AFTER_DAYS',
      value: env.QUEUE_ARCHIVE_COMPLETED_AFTER_DAYS,
      multiplier: 86_400,
    },
    {
      name: 'QUEUE_ARCHIVE_FAILED_AFTER_DAYS',
      value: env.QUEUE_ARCHIVE_FAILED_AFTER_DAYS,
      multiplier: 86_400,
    },
  ];

  for (const { name, value, multiplier } of queueDurations)
    if (!Number.isSafeInteger(value * multiplier))
      errors.push(`${name} excede el rango numérico seguro.`);

  // JWT

  if (env.JWT_ACCESS_NAME === env.JWT_REFRESH_NAME)
    errors.push('Los nombres de las cookies JWT deben ser diferentes.');

  if (env.JWT_ACCESS_SECRET === env.JWT_REFRESH_SECRET)
    errors.push('Los secretos JWT de acceso y renovación deben ser diferentes.');

  if (!isValidJwtDuration(env.JWT_ACCESS_EXPIRES_IN))
    errors.push('JWT_ACCESS_EXPIRES_IN debe ser una duración válida (s, m, h, d).');

  if (!isValidJwtDuration(env.JWT_REFRESH_EXPIRES_IN))
    errors.push('JWT_REFRESH_EXPIRES_IN debe ser una duración válida (s, m, h, d).');

  // CORS

  const origins = env.CORS_ORIGINS.split(',').map((origin) => origin.trim());

  if (
    origins.some((origin) => !isValidOrigin(origin, production)) ||
    origins.length !== new Set(origins).size
  )
    errors.push('CORS_ORIGINS debe contener orígenes válidos, explícitos y sin duplicados.');

  if (env.CORS_CREDENTIALS && origins.every((origin) => origin === ''))
    errors.push('CORS_CREDENTIALS requiere al menos un origen autorizado.');

  // Security

  if (production) {
    const secrets = [
      { name: 'JWT_ACCESS_SECRET', value: env.JWT_ACCESS_SECRET },
      { name: 'JWT_REFRESH_SECRET', value: env.JWT_REFRESH_SECRET },
    ];

    for (const { name, value } of secrets)
      if (value.startsWith('change-me-') || Buffer.byteLength(value, 'utf8') < 32)
        errors.push(`${name} debe contener un secreto seguro en producción.`);

    if (env.ADMIN_PASSWORD === 'change-me-admin-password')
      errors.push('ADMIN_PASSWORD debe configurarse antes de producción.');
  }

  // Required non-blank values

  const nonBlankValues = [
    { name: 'APP_NAME', value: env.APP_NAME },
    { name: 'APP_DESCRIPTION', value: env.APP_DESCRIPTION },
    { name: 'APP_VERSION', value: env.APP_VERSION },
    { name: 'JWT_ACCESS_SECRET', value: env.JWT_ACCESS_SECRET },
    { name: 'JWT_REFRESH_SECRET', value: env.JWT_REFRESH_SECRET },
    { name: 'ADMIN_PASSWORD', value: env.ADMIN_PASSWORD },
    { name: 'ADMIN_FIRST_NAME', value: env.ADMIN_FIRST_NAME },
    { name: 'ADMIN_LAST_NAME', value: env.ADMIN_LAST_NAME },
  ];

  for (const { name, value } of nonBlankValues)
    if (value.trim().length === 0) errors.push(`${name} no puede contener únicamente espacios.`);

  if (errors.length > 0)
    throw new Error(
      `Configuración de entorno incompatible:\n${errors.map((error) => `- ${error}`).join('\n')}`,
    );
}

export function validateEnvironment(rawConfig: Record<string, unknown>): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariablesClass, rawConfig, {
    enableImplicitConversion: false,
    exposeDefaultValues: false,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
    whitelist: true,
  });

  if (errors.length > 0)
    throw new Error(`Variables de entorno inválidas:\n${formatValidationErrors(errors)}`);

  validateConfiguration(validated);

  return validated;
}
