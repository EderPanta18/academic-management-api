// modules/professors/domain/ports/professor.tokens.ts

/**
 * Tokens de inyección de dependencias del módulo professors.
 *
 * Son Symbols únicos en runtime — evitan colisiones entre módulos
 * y eliminan strings mágicos en los decoradores @Inject().
 */
export const PROFESSOR_REPOSITORY_PORT = Symbol('PROFESSOR_REPOSITORY_PORT');
export const PROFESSOR_FINDER_PORT = Symbol('PROFESSOR_FINDER_PORT');
