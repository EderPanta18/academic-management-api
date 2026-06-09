// app.config.ts

import { COURSE_OFFERING_SWAGGER_TAG } from '@course-offerings/presentation/constants';
import { COURSE_SWAGGER_TAG } from '@courses/presentation/constants';
import { ENROLLMENT_SWAGGER_TAG } from '@enrollments/presentation/constants';
import { HEALTH_SWAGGER_TAG } from '@platform/http';
import { PROFESSOR_SWAGGER_TAG } from '@professors/presentation/constants';
import { STUDENT_SWAGGER_TAG } from '@students/presentation/constants';

export const APP_CONFIG = {
  name: 'Academic Management API',
  description: 'API REST para gestion academica universitaria',
  version: '1.0',
  apiPrefix: '/api/v1',
  docsPath: 'docs',
} as const;

export const SWAGGER_TAGS = [
  HEALTH_SWAGGER_TAG,
  STUDENT_SWAGGER_TAG,
  PROFESSOR_SWAGGER_TAG,
  COURSE_SWAGGER_TAG,
  COURSE_OFFERING_SWAGGER_TAG,
  ENROLLMENT_SWAGGER_TAG,
] as const;
