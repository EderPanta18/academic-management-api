import { AUTHORIZER_TOKEN, type IAuthorizer } from '@authorization';
import { Inject, Injectable } from '@nestjs/common';
import { PersonNotFoundException } from '../exceptions';
import { type IPersonQuery, PERSON_QUERY_TOKEN } from '../ports/out';
import type { PersonReadModel } from '../read-models';

@Injectable()
export class GetPersonUseCase {
  constructor(
    @Inject(AUTHORIZER_TOKEN)
    private readonly authorizer: IAuthorizer,

    @Inject(PERSON_QUERY_TOKEN)
    private readonly personQuery: IPersonQuery,
  ) {}

  async execute(actorUserId: string, personId: string): Promise<PersonReadModel> {
    await this.authorizer.assertAuthorized(actorUserId, ['persons.read']);

    const person = await this.personQuery.find(personId);

    if (!person) throw new PersonNotFoundException(personId);

    return person;
  }
}
