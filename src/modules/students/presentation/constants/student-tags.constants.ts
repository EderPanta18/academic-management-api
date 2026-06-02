// modules/students/presentation/constants/student-tags.constants.ts

import type { SwaggerTag } from "@platform/http/swagger";

export const SWAGGER_STUDENT_TAG = {
  name: "students",
  description: "Endpoints relacionados con la gestión de estudiantes"
} as const satisfies SwaggerTag;
