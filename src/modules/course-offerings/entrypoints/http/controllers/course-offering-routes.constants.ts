import type { SwaggerTag } from '@platform/http/swagger';

export const COURSE_OFFERING_ROUTES = {
  BASE: 'course-offerings',
  GET_BY_ID: ':id',
  ASSIGN_PROFESSOR: ':id/professor',
  OPEN: ':id/open',
  CLOSE: ':id/close',
  FINISH: ':id/finish',
  CANCEL: ':id/cancel',
} as const;

export const COURSE_OFFERING_SWAGGER_TAG = {
  name: 'course-offerings',
  description: 'Endpoints relacionados con la gestión de ofertas de curso.',
} as const satisfies SwaggerTag;
