export type StudentImportRowError = {
  row: number;
  field: string;
  reason: string;
};

export type StudentImportRowInput = {
  rowNumber: number;
  documentTypeId: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  birthDate?: string | null;
  academicProgramId: string;
  code: string;
  institutionalEmail?: string | null;
  admissionPeriod?: string | null;
};
