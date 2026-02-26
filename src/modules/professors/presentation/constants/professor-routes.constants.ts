// modules/professors/presentation/constants/professor-routes.constants.ts

export const PROFESSOR_ROUTES = {
  BASE: 'professors',

  /** POST /professors — crear profesor */
  CREATE: '',

  /** GET  /professors — listar profesores */
  LIST: '',

  /** GET    /professors/:id   — obtener profesor por id */
  GET_BY_ID: ':id',
} as const;
