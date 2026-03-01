// modules/course-offerings/domain/ports/course-offering.repository.port.ts

import { PaginationVO } from '@shared/domain/value-objects';
import { CourseOfferingStatus } from '../constants';
import { CourseOffering } from '../entities';

export interface FindAllCourseOfferingsFilters {
  courseId?: number;
  academicPeriodId?: number;
  statuses?: CourseOfferingStatus[];
}

/**
 * Contrato que la capa de application usa para persistir y recuperar
 */
export interface ICourseOfferingRepository {
  /**
   * Persiste una CourseOffering.
   * - id undefined → INSERT
   * - id definido  → UPDATE
   */
  save(offering: CourseOffering): Promise<CourseOffering>;

  /**
   * Busca una oferta activa (no eliminada) por su id.
   * Retorna null si no existe o fue soft-deleted.
   */
  findById(id: number): Promise<CourseOffering | null>;

  /**
   * Lista ofertas con paginación.
   */
  findAll(
    pagination: PaginationVO,
    filters?: FindAllCourseOfferingsFilters,
  ): Promise<[CourseOffering[], number]>;
  /**
   * Asigna (o reasigna) un profesor a una oferta existente.
   * Actualiza únicamente el campo professor_id.
   */
  assignProfessor(
    offeringId: number,
    professorId: number,
  ): Promise<CourseOffering>;

  /**
   * Transición atómica INACTIVE → ACTIVE.
   * Solo actualiza el campo status — no recarga toda la entidad.
   */
  activate(id: number): Promise<CourseOffering>;

  /**
   * Verifica si ya existe una oferta para la combinación
   * courseId + academicPeriodId + section.
   */
  existsByCourseAndPeriodAndSection(
    courseId: number,
    academicPeriodId: number,
    section: string,
  ): Promise<boolean>;

  /**
   * Soft-delete de la oferta.
   */
  delete(id: number): Promise<void>;
}
