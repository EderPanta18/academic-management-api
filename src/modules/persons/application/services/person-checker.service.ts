import { Inject, Injectable } from '@nestjs/common';
import { type IPersonChecker, type IPersonRepository, PERSON_REPOSITORY_TOKEN } from '../ports';

@Injectable()
export class PersonCheckerService implements IPersonChecker {
  constructor(
    @Inject(PERSON_REPOSITORY_TOKEN)
    private readonly personRepository: IPersonRepository,
  ) {}

  async exists(id: string): Promise<boolean> {
    return this.personRepository.exists(id);
  }
}
