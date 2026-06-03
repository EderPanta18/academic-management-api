// modules/students/presentation/constants/student-routes.constants.ts

import type { SwaggerTag } from '@platform/http/swagger';

export const STUDENT_ROUTES = {
  BASE: 'students',
  GET_BY_ID: ':id',
  BULK_IMPORT: 'import',
} as const;

export const STUDENT_SWAGGER_TAG = {
  name: 'students',
  description: 'Endpoints relacionados con la gestión de estudiantes.',
} as const satisfies SwaggerTag;
