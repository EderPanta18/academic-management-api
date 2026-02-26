// modules/students/presentation/constants/student-routes.constants.ts

export const STUDENT_ROUTES = {
  BASE: 'students',

  /** POST  /students      — crear estudiante */
  CREATE: '',

  /** GET   /students      — listar estudiantes */
  LIST: '',

  /** GET   /students/:id  — obtener estudiante por id */
  GET_BY_ID: ':id',
} as const;
