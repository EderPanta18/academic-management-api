export type AcademicProgramProps = {
  id: string;
  code: string;
  name: string;
  academicUnit: string | null;
};

export type CreateAcademicProgramProps = {
  id: string;
  code: string;
  name: string;
  academicUnit?: string | null;
};
