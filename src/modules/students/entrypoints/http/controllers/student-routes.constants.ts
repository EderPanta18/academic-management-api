import type { SwaggerTag } from '@platform/http/swagger';

export const STUDENT_ROUTES = {
  BASE: 'students',
  GET_BY_ID: ':id',
} as const;

export const STUDENT_IMPORT_ROUTES = {
  BASE: `${STUDENT_ROUTES.BASE}/imports`,
  GET_BY_ID: ':id',
} as const;

export const STUDENT_SWAGGER_TAG = {
  name: 'students',
  description: 'Endpoints relacionados con la gestión de estudiantes.',
} as const satisfies SwaggerTag;

export const STUDENT_IMPORT_SWAGGER_TAG = {
  name: 'student-imports',
  description: 'Endpoints relacionados con la importación masiva de estudiantes.',
} as const satisfies SwaggerTag;
