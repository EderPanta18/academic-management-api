// src/platform/http/health/health.constants.ts

import type { SwaggerTag } from '../swagger';

export const HEALTH_ROUTES = {
  ROOT: 'health',
  READY: 'ready',
} as const;

export const HEALTH_SWAGGER_TAG = {
  name: 'Salud de la API',
  description: 'Comprobaciones de vida y preparación de la API.',
} as const satisfies SwaggerTag;
