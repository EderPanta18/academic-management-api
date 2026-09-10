// src/platform/config/env.types.ts

export type NodeEnvironment = 'development' | 'test' | 'production';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type EnvironmentVariables = {
  // General
  NODE_ENV: NodeEnvironment;

  APP_PORT: number;
  APP_NAME: string;
  APP_DESCRIPTION: string;
  APP_VERSION: string;

  API_PREFIX: string;

  // Log
  LOG_LEVEL: LogLevel;

  // Database
  DATABASE_URL: string;
  DIRECT_DATABASE_URL: string;
  DATABASE_LOG_QUERIES: boolean;

  // Queue (PgBoss sobre PostgreSQL)
  QUEUE_SCHEMA: string;
  QUEUE_WORKER_CONCURRENCY: number;

  QUEUE_JOB_RETRY_LIMIT: number;
  QUEUE_JOB_RETRY_DELAY_MS: number;
  QUEUE_JOB_RETRY_BACKOFF: boolean;
  QUEUE_JOB_EXPIRE_IN_MINUTES: number;
  QUEUE_JOB_ARCHIVE_COMPLETED_AFTER_DAYS: number;
  QUEUE_JOB_ARCHIVE_FAILED_AFTER_DAYS: number;

  QUEUE_EVENT_RETRY_LIMIT: number;
  QUEUE_EVENT_CONCURRENCY: number;

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
  CORS_ORIGINS: string;
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
};
