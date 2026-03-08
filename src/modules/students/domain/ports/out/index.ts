// modules/students/domain/ports/out/index.ts

export type {
  IStudentRepository,
  PersonCreationData,
} from './student.repository.port';
export type {
  IStudentQuery,
  FindAllStudentsFilters,
} from './student.query.port';
export { STUDENT_REPOSITORY_PORT, STUDENT_QUERY_PORT } from './tokens';
