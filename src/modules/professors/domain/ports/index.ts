// modules/professors/domain/ports/index.ts

export { type IProfessorRepository } from './professor.repository.port';
export { type IProfessorFinder } from './professor.finder.port';
export {
  PROFESSOR_FINDER_PORT,
  PROFESSOR_REPOSITORY_PORT,
} from './professor.tokens';
