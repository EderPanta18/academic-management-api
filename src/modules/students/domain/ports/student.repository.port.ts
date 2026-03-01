// modules/students/domain/ports/student.repository.port.ts

import { PaginationVO } from '@shared/domain/value-objects';
import { Student } from '../entities';

export interface FindAllStudentsFilters {
  careerId?: number;
}

/**
 * Contrato que la capa de aplicación usa para persistir y recuperar
 * estudiantes.
 */
export interface IStudentRepository {
  /**
   * Persiste un estudiante.
   * - id === undefined → INSERT (crea person + student en transacción)
   * - id !== undefined → UPDATE (actualiza ambas tablas en transacción)
   */
  save(student: Student): Promise<Student>;

  /**
   * Busca un estudiante activo (no eliminado) por su id.
   * Retorna null si no existe o fue dado de baja (soft-delete).
   */
  findById(id: number): Promise<Student | null>;

  /**
   * Lista estudiantes no eliminados con paginación.
   * El total refleja el conteo sin paginación aplicada.
   */
  findAll(
    pagination: PaginationVO,
    filters?: FindAllStudentsFilters,
  ): Promise<[Student[], number]>;

  /**
   * Verifica si ya existe un estudiante con ese DNI.
   */
  existsByDni(dni: string): Promise<boolean>;

  /**
   * Verifica si ya existe un estudiante con ese email.
   */
  existsByEmail(email: string): Promise<boolean>;

  /**
   * Verifica si ya existe un estudiante con ese código académico.
   */
  existsByCode(studentCode: string): Promise<boolean>;

  /**
   * Soft-delete del estudiante.
   */
  delete(id: number): Promise<void>;
}
