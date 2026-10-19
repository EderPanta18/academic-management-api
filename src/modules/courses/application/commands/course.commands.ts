export type CreateCourseCommand = {
  academicProgramId: string;
  courseCategoryId: string | null;
  code: string;
  name: string;
  description: string | null;
  credits: number;
  hours: number | null;
};
