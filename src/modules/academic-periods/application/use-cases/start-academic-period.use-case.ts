import type { AcademicPeriod } from '@academic-periods/domain/entities';
import { Inject, Injectable } from '@nestjs/common';
import { AcademicPeriodNotFoundException } from '../exceptions';
import { ACADEMIC_PERIOD_REPOSITORY_TOKEN, type IAcademicPeriodRepository } from '../ports/out';

@Injectable()
export class StartAcademicPeriodUseCase {
  constructor(
    @Inject(ACADEMIC_PERIOD_REPOSITORY_TOKEN)
    private readonly academicPeriodRepository: IAcademicPeriodRepository,
  ) {}

  async execute(id: string): Promise<AcademicPeriod> {
    const academicPeriod = await this.academicPeriodRepository.find(id);

    if (!academicPeriod) throw new AcademicPeriodNotFoundException(id);

    const academicPeriodStarted = academicPeriod.start();

    return await this.academicPeriodRepository.update(academicPeriodStarted);
  }
}
