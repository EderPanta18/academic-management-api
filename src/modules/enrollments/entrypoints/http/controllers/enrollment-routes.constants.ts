import type { SwaggerTag } from '@platform/http/swagger';

export const ENROLLMENT_ROUTES = {
  BASE: 'enrollments',
  GET_BY_ID: ':id',
  HISTORY: ':id/history',
  CONFIRM: ':id/confirm',
  CANCEL: ':id/cancel',
  WITHDRAW: ':id/withdraw',
  REJECT: ':id/reject',
  FINISH: ':id/finish',
} as const;

export const ENROLLMENT_SWAGGER_TAG = {
  name: 'enrollments',
  description: 'Endpoints relacionados con las inscripciones de estudiantes en ofertas de curso.',
} as const satisfies SwaggerTag;
