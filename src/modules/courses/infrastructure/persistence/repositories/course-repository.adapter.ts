// modules/courses/infrastructure/persistence/repositories/course.repository.adapter.ts

import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PaginationVO } from "@core/pagination";
import { PrismaService } from "@platform/database";
import { Course } from "@courses/domain/entities";
import type {
  ICourseRepository,
  ICourseFinder,
  FindAllCoursesFilters
} from "@courses/application/ports";
import { CoursePersistenceMapper } from "../mappers";

@Injectable()
export class CourseRepository implements ICourseRepository, ICourseFinder {
  constructor(private readonly prisma: PrismaService) {}

  // ── ICourseRepository ─────────────────────────────────────────────────────

  async save(course: Course): Promise<Course> {
    return course.id !== undefined ? this.update(course) : this.create(course);
  }

  async findById(id: number): Promise<Course | null> {
    const raw = await this.prisma.course.findFirst({
      where: { id, deletedAt: null }
    });

    return raw ? CoursePersistenceMapper.toDomain(raw) : null;
  }

  async findAll(
    pagination: PaginationVO,
    filters?: FindAllCoursesFilters
  ): Promise<[Course[], number]> {
    const where: Prisma.CourseWhereInput = {
      deletedAt: null,
      ...(filters?.careerId && { careerId: filters.careerId }),
      ...(filters?.categoryId && { categoryId: filters.categoryId })
    };

    const [raws, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip: pagination.offset,
        take: pagination.pageSize,
        orderBy: { name: "asc" }
      }),

      this.prisma.course.count({ where })
    ]);

    return [raws.map(CoursePersistenceMapper.toDomain), total];
  }

  async existsByCareerAndName(
    careerId: number,
    name: string
  ): Promise<boolean> {
    const count = await this.prisma.course.count({
      where: { careerId, name, deletedAt: null }
    });

    return count > 0;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  // ── ICourseFinder ─────────────────────────────────────────────────────────

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.course.count({
      where: { id, deletedAt: null }
    });

    return count > 0;
  }

  // ── Privados ──────────────────────────────────────────────────────────────

  private async create(course: Course): Promise<Course> {
    const data = CoursePersistenceMapper.toPersistence(course);

    const raw = await this.prisma.course.create({ data });

    return CoursePersistenceMapper.toDomain(raw);
  }

  private async update(course: Course): Promise<Course> {
    const data = CoursePersistenceMapper.toPersistence(course);

    const raw = await this.prisma.course.update({
      where: { id: course.id },
      data
    });

    return CoursePersistenceMapper.toDomain(raw);
  }
}
