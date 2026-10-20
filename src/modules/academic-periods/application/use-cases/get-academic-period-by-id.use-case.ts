import { AcademicPeriodNotFoundException } from '@academic-periods/application/exceptions';
import { Inject, Injectable } from '@nestjs/common';
import { ACADEMIC_PERIOD_QUERY_TOKEN, type IAcademicPeriodQuery } from '../ports/out';
import type { AcademicPeriodReadModel } from '../read-models';

@Injectable()
export class GetAcademicPeriodByIdUseCase {
  constructor(
    @Inject(ACADEMIC_PERIOD_QUERY_TOKEN)
    private readonly academicPeriodQuery: IAcademicPeriodQuery,
  ) {}

  async execute(id: string): Promise<AcademicPeriodReadModel> {
    const readModel = await this.academicPeriodQuery.find(id);

    if (!readModel) throw new AcademicPeriodNotFoundException(id);

    return readModel;
  }
}
