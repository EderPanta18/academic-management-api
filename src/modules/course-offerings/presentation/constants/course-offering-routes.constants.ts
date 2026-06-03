// modules/course-offerings/presentation/constants/course-offering-routes.constants.ts

import type { SwaggerTag } from '@platform/http/swagger';

export const COURSE_OFFERING_ROUTES = {
  BASE: 'course-offerings',
  GET_BY_ID: ':id',
  ASSIGN_PROFESSOR: ':id/professor',
  ACTIVATE: ':id/activate',
} as const;

export const COURSE_OFFERING_SWAGGER_TAG = {
  name: 'course-offerings',
  description: 'Endpoints relacionados con la gestión de ofertas de cursos.',
} as const satisfies SwaggerTag;
