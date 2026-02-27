// modules/course-offerings/application/queries/list-course-offerings.query.ts

import { CourseOfferingStatus } from '@course-offerings/domain/constants';

/**
 * Objeto de entrada para el listado de ofertas de curso.
 *
 * status puede recibir:
 *   - undefined     → sin filtro, devuelve todas
 *   - un valor      → filtra por ese estado exacto
 *   - un array      → filtra por cualquiera de esos estados (OR)
 */
export class ListCourseOfferingsQuery {
  readonly status?: CourseOfferingStatus | CourseOfferingStatus[];

  constructor(props: {
    status?: CourseOfferingStatus | CourseOfferingStatus[];
  }) {
    this.status = props.status;
  }

  /**
   * Normaliza status siempre a array para que el repositorio
   * no tenga que distinguir entre un valor suelto y un array.
   */
  get normalizedStatuses(): CourseOfferingStatus[] | undefined {
    if (this.status === undefined) return undefined;
    return Array.isArray(this.status) ? this.status : [this.status];
  }
}
