// modules/enrollments/application/ports/out/enrollment-repository.port.ts

import { PaginationVO } from '@core/pagination';
import { EnrollmentStatus } from '@enrollments/domain/constants';
import { Enrollment, type EnrollmentStatusLogProps } from '@enrollments/domain/entities';

export const ENROLLMENT_REPOSITORY_PORT = Symbol('ENROLLMENT_REPOSITORY_PORT');

export interface ChangeEnrollmentStatusProps {
  enrollmentId: number;
  previousStatus: EnrollmentStatus;
  newStatus: EnrollmentStatus;
  reason: string | null;
  changedBy: number | null;
}

export interface FindAllEnrollmentsFilters {
  studentId?: number;
  courseOfferingId?: number;
  statuses?: EnrollmentStatus[];
}

export interface IEnrollmentRepository {
  save(enrollment: Enrollment): Promise<Enrollment>;

  findById(id: number): Promise<Enrollment | null>;

  findAll(
    pagination: PaginationVO,
    filters?: FindAllEnrollmentsFilters,
  ): Promise<[Enrollment[], number]>;

  changeStatus(props: ChangeEnrollmentStatusProps): Promise<Enrollment>;

  findStatusLogByEnrollmentId(enrollmentId: number): Promise<EnrollmentStatusLogProps[]>;

  existsByStudentAndOffering(studentId: number, courseOfferingId: number): Promise<boolean>;

  isAtCapacity(courseOfferingId: number): Promise<boolean>;

  delete(id: number): Promise<void>;
}
