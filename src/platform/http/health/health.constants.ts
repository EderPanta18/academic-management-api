// platform/http/health/health-constants.ts

import type { SwaggerTag } from '../swagger';

export const HEALTH_ROUTES = {
  ROOT: '/health',
} as const;

export const HEALTH_SWAGGER_TAG = {
  name: 'Salud de la API',
  description: 'Endpoint para verificar el estado de salud de la API.',
} as const satisfies SwaggerTag;
