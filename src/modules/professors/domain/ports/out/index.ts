// modules/professors/domain/ports/out/index.ts

export type {
  IProfessorRepository,
  PersonCreationData,
} from './professor.repository.port';
export type {
  IProfessorQuery,
  FindAllProfessorsFilters,
} from './professor.query.port';
export { PROFESSOR_REPOSITORY_PORT, PROFESSOR_QUERY_PORT } from './tokens';
