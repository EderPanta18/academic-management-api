// src/platform/config/index.ts

export { AppConfigModule } from './app-config.module';
export { AppConfigService } from './app-config.service';
export { type AppConfig, buildAppConfig } from './configuration';
export type { EnvironmentVariables, NodeEnvironment } from './env.types';
export { LOG_LEVEL_VALUES, NODE_ENV_VALUES } from './env.validation';
