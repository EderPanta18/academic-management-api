// src/platform/config/env.types.ts

export type NodeEnvironment = 'development' | 'test' | 'production';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type EnvironmentVariables = {
  // General
  NODE_ENV: NodeEnvironment;

  APP_PORT: number;
  APP_NAME: string;
  APP_VERSION: string;

  // Log
  LOG_LEVEL: LogLevel;

  // Database
  DATABASE_URL: string;
  DATABASE_LOG_QUERIES: boolean;

  // JWT
  JWT_ACCESS_NAME: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;

  JWT_REFRESH_NAME: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;

  // Auth
  AUTH_SINGLE_SESSION: boolean;
  AUTH_REFRESH_TOKEN_ROTATION: boolean;

  // CORS
  CORS_ORIGIN: string;
  CORS_CREDENTIALS: boolean;

  // OpenAPI
  OPENAPI_ENABLED: boolean;
  OPENAPI_PATH: string;

  // Admin seed
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  ADMIN_FIRST_NAME: string;
  ADMIN_LAST_NAME: string;

  // Upload
  UPLOAD_MAX_FILE_SIZE: number;
  UPLOAD_ALLOWED_MIME_TYPES: string;

  // Redis
  REDIS_URL: string;

  // Queue
  QUEUE_EVENT_BUS_ATTEMPTS: number;
  QUEUE_EVENT_BUS_REMOVE_ON_COMPLETE: number;
  QUEUE_EVENT_BUS_REMOVE_ON_FAIL: number;
  QUEUE_EVENT_BUS_CONCURRENCY: number;

  QUEUE_JOB_ATTEMPTS: number;
  QUEUE_JOB_BACKOFF_DELAY_MS: number;
  QUEUE_JOB_REMOVE_ON_COMPLETE: number;
  QUEUE_JOB_REMOVE_ON_FAIL: number;
  QUEUE_JOB_CONCURRENCY: number;
};
