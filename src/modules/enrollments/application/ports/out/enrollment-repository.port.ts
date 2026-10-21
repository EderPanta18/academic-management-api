import type { Enrollment } from '@enrollments/domain/entities';
import type { EnrollmentStatusLog } from '@enrollments/domain/records';

export const ENROLLMENT_REPOSITORY_TOKEN = Symbol('ENROLLMENT_REPOSITORY');

export interface IEnrollmentRepository {
  create(enrollment: Enrollment): Promise<Enrollment>;

  find(id: string): Promise<Enrollment | null>;

  exists(id: string): Promise<boolean>;

  existsByStudentAndOffering(studentId: string, courseOfferingId: string): Promise<boolean>;

  isAtCapacity(courseOfferingId: string): Promise<boolean>;

  updateWithStatusLog(enrollment: Enrollment, log: EnrollmentStatusLog): Promise<Enrollment>;
}
