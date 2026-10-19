export type CourseReadModel = {
  id: string;
  academicProgramId: string;
  academicProgramName: string;
  courseCategoryId: string | null;
  courseCategoryName: string | null;
  code: string;
  name: string;
  description: string | null;
  credits: number;
  hours: number | null;
};
