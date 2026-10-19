import { Inject, Injectable } from '@nestjs/common';
import {
  type IProfessorChecker,
  type IProfessorRepository,
  PROFESSOR_REPOSITORY_TOKEN,
} from '../ports';

@Injectable()
export class ProfessorChecker implements IProfessorChecker {
  constructor(
    @Inject(PROFESSOR_REPOSITORY_TOKEN)
    private readonly professorRepository: IProfessorRepository,
  ) {}

  async exists(id: string): Promise<boolean> {
    return await this.professorRepository.exists(id);
  }

  async isActive(id: string): Promise<boolean> {
    const professor = await this.professorRepository.find(id);

    return professor?.isActive() ?? false;
  }
}
