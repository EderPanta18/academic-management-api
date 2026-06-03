// modules/courses/application/ports/out/course-repository.port.ts

import { PaginationVO } from '@core/pagination';
import { Course } from '@courses/domain/entities';

export const COURSE_REPOSITORY_PORT = Symbol('COURSE_REPOSITORY_PORT');

export interface FindAllCoursesFilters {
  careerId?: number;
  categoryId?: number;
}

export interface ICourseRepository {
  save(course: Course): Promise<Course>;

  findById(id: number): Promise<Course | null>;

  findAll(pagination: PaginationVO, filters?: FindAllCoursesFilters): Promise<[Course[], number]>;

  existsByCareerAndName(careerId: number, name: string): Promise<boolean>;

  delete(id: number): Promise<void>;
}
