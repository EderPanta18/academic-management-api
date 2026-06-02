// modules/students/domain/ports/out/index.ts

export {
  STUDENT_REPOSITORY_PORT,
  type IStudentRepository,
  type StudentSaveData
} from "./student-repository.port";
export {
  STUDENT_QUERY_PORT,
  type IStudentQuery,
  type FindAllStudentsFilters
} from "./student-query.port";
