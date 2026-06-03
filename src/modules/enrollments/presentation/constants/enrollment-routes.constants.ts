// modules/enrollments/presentation/constants/enrollment-routes.constants.ts

import type { SwaggerTag } from "@platform/http/swagger";

export const ENROLLMENT_ROUTES = {
  BASE: "enrollments",
  GET_BY_ID: ":id"
} as const;

export const ENROLLMENT_SWAGGER_TAG = {
  name: "enrollments",
  description:
    "Endpoints relacionados con las inscripciones de alumnos a cursos."
} as const satisfies SwaggerTag;
