// modules/professors/domain/ports/out/index.ts

export {
  PROFESSOR_REPOSITORY_PORT,
  type IProfessorRepository
  type ProfessorSaveData,
  type ProfessorPersonData,
} from "./professor-repository.port";
export {
  PROFESSOR_QUERY_PORT,
  type IProfessorQuery,
  type FindAllProfessorsFilters,
} from "./professor-query.port";
