// modules/course-offerings/presentation/pipes/status.pipe.ts

import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { CourseOfferingStatus } from '@course-offerings/domain/constants';

@Injectable()
export class StatusPipe implements PipeTransform {
  transform(value: any): CourseOfferingStatus[] | undefined {
    if (!value) return undefined;

    const rawValues = Array.isArray(value) ? value : [value];

    const statuses = rawValues.map((status) => {
      const upperStatus = String(status).toUpperCase().trim();

      const validStatus =
        CourseOfferingStatus[upperStatus as keyof typeof CourseOfferingStatus];

      if (!validStatus) {
        throw new BadRequestException(
          `Estado inválido: '${status}'. ` +
            `Debe ser uno de: ${Object.values(CourseOfferingStatus).join(', ')}`,
        );
      }
      return validStatus;
    });

    return statuses;
  }
}
