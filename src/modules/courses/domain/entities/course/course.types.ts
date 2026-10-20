export type CourseProps = {
  id: string;
  academicProgramId: string;
  courseCategoryId: string | null;
  code: string;
  name: string;
  description: string | null;
  credits: number;
  hours: number | null;
};

export type CreateCourseProps = {
  id: string;
  academicProgramId: string;
  courseCategoryId: string | null;
  code: string;
  name: string;
  description: string | null;
  credits: number;
  hours: number | null;
};
