// platform/http/health/health-constants.ts

import type { SwaggerTag } from '../swagger';

export const HEALTH_SWAGGER_TAG = {
  name: 'health',
  description: 'Endpoint para verificar el estado de salud de la API.',
} as const satisfies SwaggerTag;
