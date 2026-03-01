// modules/enrollments/presentation/constants/enrollment-routes.constants.ts

export const ENROLLMENT_ROUTES = {
  BASE: 'enrollments',

  /** POST  /enrollments      — crear matrícula */
  CREATE: '',

  /** GET   /enrollments      — listar matrículas */
  LIST: '',

  /** GET   /enrollments/:id  — obtener matrícula por id */
  GET_BY_ID: ':id',
} as const;
