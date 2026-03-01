// modules/courses/domain/entities/course.types.ts

export interface CourseProps {
  id: number;
  careerId: number;
  categoryId: number | null;
  name: string;
  description: string | null;
  credits: number;
}

export interface CreateCourseProps {
  careerId: number;
  name: string;
  credits: number;
  categoryId?: number;
  description?: string;
}
