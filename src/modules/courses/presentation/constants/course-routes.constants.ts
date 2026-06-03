// modules/courses/presentation/constants/course-routes.constants.ts

import type { SwaggerTag } from "@platform/http/swagger";

export const COURSE_ROUTES = {
  BASE: "courses",
  GET_BY_ID: ":id"
} as const;

export const COURSE_SWAGGER_TAG = {
  name: "courses",
  description: "Endpoints relacionados con la gestión de cursos."
} as const satisfies SwaggerTag;
