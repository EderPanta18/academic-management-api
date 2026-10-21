// app/app.config.ts

import { ACADEMIC_PERIOD_SWAGGER_TAG } from '@academic-periods/entrypoints/http';
import { COURSE_OFFERING_SWAGGER_TAG } from '@course-offerings/entrypoints/http';
import { COURSE_SWAGGER_TAG } from '@courses/entrypoints/http';
import { ENROLLMENT_SWAGGER_TAG } from '@enrollments/entrypoints/http';
import { HEALTH_SWAGGER_TAG } from '@platform/http';
import { PROFESSOR_SWAGGER_TAG } from '@professors/entrypoints/http';
import { STUDENT_IMPORT_SWAGGER_TAG, STUDENT_SWAGGER_TAG } from '@students/entrypoints/http';

export const SWAGGER_TAGS = [
  HEALTH_SWAGGER_TAG,
  STUDENT_SWAGGER_TAG,
  STUDENT_IMPORT_SWAGGER_TAG,
  PROFESSOR_SWAGGER_TAG,
  COURSE_SWAGGER_TAG,
  ACADEMIC_PERIOD_SWAGGER_TAG,
  COURSE_OFFERING_SWAGGER_TAG,
  ENROLLMENT_SWAGGER_TAG,
] as const;
