// modules/professors/domain/ports/index.ts

export { type IProfessorRepository } from './professor.repository.port';
export { type IProfessorFinder } from './professor.finder.port';
export {
  PROFESSOR_REPOSITORY_PORT,
  PROFESSOR_FINDER_PORT,
} from './professor.tokens';
