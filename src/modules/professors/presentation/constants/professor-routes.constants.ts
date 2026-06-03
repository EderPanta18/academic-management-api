// modules/professors/presentation/constants/professor-routes.constants.ts

import type { SwaggerTag } from "@platform/http/swagger";

export const PROFESSOR_ROUTES = {
  BASE: "professors",
  GET_BY_ID: ":id"
} as const;

export const PROFESSOR_SWAGGER_TAG = {
  name: "professors",
  description: "Endpoints relacionados con la gestión de profesores."
} as const satisfies SwaggerTag;
