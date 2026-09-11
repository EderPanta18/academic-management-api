export interface AcademicProgramProps {
  id: string;
  code: string;
  name: string;
  academicUnit: string | null;
}

export interface CreateAcademicProgramProps {
  id: string;
  code: string;
  name: string;
  academicUnit?: string | null;
}
