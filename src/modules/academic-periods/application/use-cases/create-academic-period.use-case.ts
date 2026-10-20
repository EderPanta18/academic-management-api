import { AcademicPeriod } from '@academic-periods/domain/entities';
import { ID_GENERATOR_TOKEN, type IIdGenerator } from '@core/contracts';
import { Inject, Injectable } from '@nestjs/common';
import type { CreateAcademicPeriodCommand } from '../commands';
import { AcademicPeriodCodeAlreadyExistsException } from '../exceptions';
import { ACADEMIC_PERIOD_REPOSITORY_TOKEN, type IAcademicPeriodRepository } from '../ports/out';

@Injectable()
export class CreateAcademicPeriodUseCase {
  constructor(
    @Inject(ID_GENERATOR_TOKEN)
    private readonly idGenerator: IIdGenerator,

    @Inject(ACADEMIC_PERIOD_REPOSITORY_TOKEN)
    private readonly academicPeriodRepository: IAcademicPeriodRepository,
  ) {}

  async execute(command: CreateAcademicPeriodCommand): Promise<AcademicPeriod> {
    const codeAlreadyExists = await this.academicPeriodRepository.existsByCode(command.code);

    if (codeAlreadyExists) throw new AcademicPeriodCodeAlreadyExistsException(command.code);

    const academicPeriodId = this.idGenerator.generate();

    const academicPeriod = AcademicPeriod.create({
      id: academicPeriodId,
      code: command.code,
      name: command.name,
      startDate: command.startDate,
      endDate: command.endDate,
      enrollmentStartDate: command.enrollmentStartDate,
      enrollmentEndDate: command.enrollmentEndDate,
      status: command.status,
    });

    return await this.academicPeriodRepository.create(academicPeriod);
  }
}
