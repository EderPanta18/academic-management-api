export const STUDENT_IMPORT_JOBS = {
  PROCESS: 'student-import.process',
} as const;

export const STUDENT_IMPORT_COLUMNS = {
  // Campos de Persona
  DOCUMENT_TYPE_CODE: 'tipoDocumentoCodigo',
  DOCUMENT_NUMBER: 'numeroDocumento',
  FIRST_NAME: 'nombres',
  LAST_NAME: 'apellidos',
  EMAIL: 'correo',
  PHONE: 'telefono',
  BIRTH_DATE: 'fechaNacimiento',

  // Campos de Student
  ACADEMIC_PROGRAM_CODE: 'programaAcademicoCodigo',
  CODE: 'codigo',
  INSTITUTIONAL_EMAIL: 'correoInstitucional',
  ADMISSION_PERIOD: 'periodoAdmision',
} as const;

export const STUDENT_IMPORT_CHECKPOINT_INTERVAL = 50;
