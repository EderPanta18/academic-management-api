export type CourseReadModel = {
  id: string;
  academicProgramId: string;
  courseCategoryId: string | null;
  code: string;
  name: string;
  description: string | null;
  credits: number;
  hours: number | null;

  // Datos de relaciones
  academicProgramName: string;
  courseCategoryName: string | null;
};
