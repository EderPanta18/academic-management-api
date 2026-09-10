// src/platform/config/configuration.ts

import type { EnvironmentVariables, LogLevel, NodeEnvironment } from './env';

export type AppConfig = {
  app: {
    port: number;
    nodeEnv: NodeEnvironment;
    name: string;
    description: string;
    version: string;
    apiPrefix: string;
  };
  log: {
    level: LogLevel;
  };
  database: {
    url: string;
    directUrl: string;
    logQueries: boolean;
  };
  queue: {
    schema: string;
    workerConcurrency: number;
    job: {
      retryLimit: number;
      retryDelayMs: number;
      retryBackoff: boolean;
      expireInMinutes: number;
      archiveCompletedAfterDays: number;
      archiveFailedAfterDays: number;
    };
    event: {
      retryLimit: number;
      concurrency: number;
    };
  };
  jwt: {
    access: {
      name: string;
      secret: string;
      expiresIn: string;
    };
    refresh: {
      name: string;
      secret: string;
      expiresIn: string;
    };
  };
  auth: {
    singleSession: boolean;
    refreshTokenRotation: boolean;
  };
  cors: {
    origins: string[];
    credentials: boolean;
  };
  openapi: {
    enabled: boolean;
    path: string;
  };
  admin: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
  upload: {
    maxFileSize: number;
    allowedMimeTypes: string[];
  };
};

export function buildAppConfig(env: EnvironmentVariables): AppConfig {
  return {
    app: {
      port: env.APP_PORT,
      nodeEnv: env.NODE_ENV,
      name: env.APP_NAME,
      description: env.APP_DESCRIPTION,
      version: env.APP_VERSION,
      apiPrefix: env.API_PREFIX,
    },
    log: {
      level: env.LOG_LEVEL,
    },
    database: {
      url: env.DATABASE_URL,
      directUrl: env.DIRECT_DATABASE_URL,
      logQueries: env.DATABASE_LOG_QUERIES,
    },
    queue: {
      schema: env.QUEUE_SCHEMA,
      workerConcurrency: env.QUEUE_WORKER_CONCURRENCY,
      job: {
        retryLimit: env.QUEUE_JOB_RETRY_LIMIT,
        retryDelayMs: env.QUEUE_JOB_RETRY_DELAY_MS,
        retryBackoff: env.QUEUE_JOB_RETRY_BACKOFF,
        expireInMinutes: env.QUEUE_JOB_EXPIRE_IN_MINUTES,
        archiveCompletedAfterDays: env.QUEUE_JOB_ARCHIVE_COMPLETED_AFTER_DAYS,
        archiveFailedAfterDays: env.QUEUE_JOB_ARCHIVE_FAILED_AFTER_DAYS,
      },
      event: {
        retryLimit: env.QUEUE_EVENT_RETRY_LIMIT,
        concurrency: env.QUEUE_EVENT_CONCURRENCY,
      },
    },
    jwt: {
      access: {
        name: env.JWT_ACCESS_NAME,
        secret: env.JWT_ACCESS_SECRET,
        expiresIn: env.JWT_ACCESS_EXPIRES_IN,
      },
      refresh: {
        name: env.JWT_REFRESH_NAME,
        secret: env.JWT_REFRESH_SECRET,
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      },
    },
    auth: {
      singleSession: env.AUTH_SINGLE_SESSION,
      refreshTokenRotation: env.AUTH_REFRESH_TOKEN_ROTATION,
    },
    cors: {
      origins: env.CORS_ORIGINS.split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      credentials: env.CORS_CREDENTIALS,
    },
    openapi: {
      enabled: env.OPENAPI_ENABLED,
      path: env.OPENAPI_PATH,
    },
    admin: {
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
      firstName: env.ADMIN_FIRST_NAME,
      lastName: env.ADMIN_LAST_NAME,
    },
    upload: {
      maxFileSize: env.UPLOAD_MAX_FILE_SIZE,
      allowedMimeTypes: env.UPLOAD_ALLOWED_MIME_TYPES.split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    },
  };
}
