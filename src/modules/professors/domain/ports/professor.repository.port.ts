// modules/professors/domain/ports/professor.repository.port.ts

import { PaginationVO } from '@shared/domain/value-objects';
import { Professor } from '../entities';

export interface FindAllProfessorsFilters {
  departmentId?: number;
}

/**
 * Contrato que la capa de aplicación usa para persistir y recuperar
 * profesores.
 */
export interface IProfessorRepository {
  /**
   * Persiste un profesor.
   * - id === undefined → INSERT (crea person + professor en transacción)
   * - id !== undefined → UPDATE (actualiza ambas tablas en transacción)
   * Retorna la entidad reconstituida con los datos finales de la DB.
   */
  save(professor: Professor): Promise<Professor>;

  /**
   * Busca un profesor activo (no eliminado) por su id.
   * Retorna null si no existe o fue dado de baja (soft-delete).
   */
  findById(id: number): Promise<Professor | null>;

  /**
   * Lista profesores activos con paginación.
   * El total refleja el conteo sin paginación aplicada.
   */
  findAll(
    pagination: PaginationVO,
    filters?: FindAllProfessorsFilters,
  ): Promise<[Professor[], number]>;

  /**
   * Verifica si ya existe un profesor con ese DNI.
   */
  existsByDni(dni: string): Promise<boolean>;

  /**
   * Verifica si ya existe un profesor con ese email.
   */
  existsByEmail(email: string): Promise<boolean>;

  existsByCode(code: string): Promise<boolean>;

  /**
   * Soft-delete del profesor.
   */
  delete(id: number): Promise<void>;
}
