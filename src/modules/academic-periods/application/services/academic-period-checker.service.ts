import { Inject, Injectable } from '@nestjs/common';
import {
  ACADEMIC_PERIOD_REPOSITORY_TOKEN,
  type IAcademicPeriodChecker,
  type IAcademicPeriodRepository,
} from '../ports';

@Injectable()
export class AcademicPeriodChecker implements IAcademicPeriodChecker {
  constructor(
    @Inject(ACADEMIC_PERIOD_REPOSITORY_TOKEN)
    private readonly academicPeriodRepository: IAcademicPeriodRepository,
  ) {}

  async exists(id: string): Promise<boolean> {
    return await this.academicPeriodRepository.exists(id);
  }

  async isOpen(id: string): Promise<boolean> {
    const period = await this.academicPeriodRepository.find(id);

    return period?.isOpen() ?? false;
  }

  async allowsEnrollment(id: string, referenceDate: Date = new Date()): Promise<boolean> {
    const period = await this.academicPeriodRepository.find(id);

    return period?.allowsEnrollment(referenceDate) ?? false;
  }
}
