// modules/courses/domain/ports/course.repository.port.ts

import { PaginationVO } from '@shared/domain/value-objects';
import { Course } from '../entities';

export interface FindAllCoursesFilters {
  careerId?: number;
  categoryId?: number;
}

export interface ICourseRepository {
  save(course: Course): Promise<Course>;

  findById(id: number): Promise<Course | null>;

  findAll(
    pagination: PaginationVO,
    filters?: FindAllCoursesFilters,
  ): Promise<[Course[], number]>;

  existsByCareerAndName(careerId: number, name: string): Promise<boolean>;

  delete(id: number): Promise<void>;
}
