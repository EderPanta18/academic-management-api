// modules/course-offerings/application/ports/out/course-offering-repository.port.ts

import { PaginationVO } from '@core/pagination';
import { CourseOfferingStatus } from '@course-offerings/domain/constants';
import { CourseOffering } from '@course-offerings/domain/entities';

export const COURSE_OFFERING_REPOSITORY_PORT = Symbol('COURSE_OFFERING_REPOSITORY_PORT');

export interface FindAllCourseOfferingsFilters {
  courseId?: number;
  academicPeriodId?: number;
  statuses?: CourseOfferingStatus[];
}

export interface ICourseOfferingRepository {
  save(offering: CourseOffering): Promise<CourseOffering>;

  findById(id: number): Promise<CourseOffering | null>;

  findAll(
    pagination: PaginationVO,
    filters?: FindAllCourseOfferingsFilters,
  ): Promise<[CourseOffering[], number]>;

  assignProfessor(offeringId: number, professorId: number): Promise<CourseOffering>;

  activate(id: number): Promise<CourseOffering>;

  existsByCourseAndPeriodAndSection(
    courseId: number,
    academicPeriodId: number,
    section: string,
  ): Promise<boolean>;

  delete(id: number): Promise<void>;
}
