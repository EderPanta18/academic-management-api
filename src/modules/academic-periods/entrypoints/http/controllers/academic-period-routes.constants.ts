import type { SwaggerTag } from '@platform/http/swagger';

export const ACADEMIC_PERIOD_ROUTES = {
  BASE: 'academic-periods',
  GET_BY_ID: ':id',
  OPEN: ':id/open',
  START: ':id/start',
  CLOSE: ':id/close',
  CANCEL: ':id/cancel',
} as const;

export const ACADEMIC_PERIOD_SWAGGER_TAG = {
  name: 'academic-periods',
  description: 'Endpoints relacionados con la gestión de periodos académicos.',
} as const satisfies SwaggerTag;
