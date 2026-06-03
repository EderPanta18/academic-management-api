// modules/students/domain/ports/out/index.ts

export {
  type FindAllStudentsFilters,
  type IStudentQuery,
  STUDENT_QUERY_PORT,
} from './student-query.port';
export {
  type IStudentRepository,
  STUDENT_REPOSITORY_PORT,
  type StudentSaveData,
} from './student-repository.port';
