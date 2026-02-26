// modules/students/domain/ports/index.ts

export { type IStudentRepository } from './student.repository.port';
export { type IStudentFinder } from './student.finder.port';
export { STUDENT_REPOSITORY_PORT, STUDENT_FINDER_PORT } from './student.tokens';
