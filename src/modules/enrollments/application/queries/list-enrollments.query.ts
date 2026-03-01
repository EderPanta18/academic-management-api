// modules/enrollments/application/queries/list-enrollments.query.ts

import { EnrollmentStatus } from '@enrollments/domain/constants';

/**
 * Filtros opcionales para el listado de inscripciones.
 * Todos son independientes y se aplican como AND si vienen juntos.
 */
export class ListEnrollmentsQuery {
  readonly studentId?: number;
  readonly courseOfferingId?: number;
  readonly statuses?: EnrollmentStatus[];

  constructor(props: {
    studentId?: number;
    courseOfferingId?: number;
    statuses?: EnrollmentStatus | EnrollmentStatus[];
  }) {
    this.studentId = props.studentId;
    this.courseOfferingId = props.courseOfferingId;
    // Normaliza siempre a array para que el repositorio no distinga casos
    this.statuses =
      props.statuses === undefined
        ? undefined
        : Array.isArray(props.statuses)
          ? props.statuses
          : [props.statuses];
  }
}
