// modules/professors/presentation/constants/professor-tags.constants.ts

import type { SwaggerTag } from "@platform/http/swagger";

export const SWAGGER_PROFESSOR_TAG = {
  name: "professors",
  description: "Endpoints relacionados con la gestión de profesores"
} as const satisfies SwaggerTag;
