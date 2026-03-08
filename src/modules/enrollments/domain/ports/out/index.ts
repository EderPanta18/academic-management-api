// modules/enrollments/domain/ports/out/index.ts

export type {
  IEnrollmentRepository,
  ChangeEnrollmentStatusProps,
  FindAllEnrollmentsFilters,
} from './enrollment.repository.port';
export { ENROLLMENT_REPOSITORY_PORT } from './tokens';
