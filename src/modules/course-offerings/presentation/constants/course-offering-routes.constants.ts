// modules/course-offerings/presentation/constants/course-offering-routes.constants.ts

export const COURSE_OFFERING_ROUTES = {
  BASE: 'course-offerings',

  /** POST /course-offerings — crear oferta */
  CREATE: '',

  /** GET /course-offerings — listar ofertas */
  LIST: '',

  /** GET /course-offerings/:id — detalle de oferta */
  GET_BY_ID: ':id',

  /** PATCH /course-offerings/:id/professor — asignar profesor */
  ASSIGN_PROFESSOR: ':id/professor',

  /** PATCH /course-offerings/:id/activate — activar oferta */
  ACTIVATE: ':id/activate',
} as const;
