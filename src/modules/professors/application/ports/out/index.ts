// modules/professors/domain/ports/out/index.ts

export {
  type FindAllProfessorsFilters,
  type IProfessorQuery,
  PROFESSOR_QUERY_PORT,
} from './professor-query.port';
export {
  type IProfessorRepository,
  PROFESSOR_REPOSITORY_PORT,
  type ProfessorSaveData,
} from './professor-repository.port';
