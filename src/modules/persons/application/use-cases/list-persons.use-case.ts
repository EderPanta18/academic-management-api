// src/modules/persons/application/use-cases/list-persons.use-case.ts

import { AUTHORIZER_TOKEN, type IAuthorizer } from '@authorization';
import { type PaginationVO } from '@core/pagination';
import { Inject, Injectable } from '@nestjs/common';
import { type IPersonQuery, PERSON_QUERY_TOKEN } from '../ports/out';
import type { ListPersonsQuery } from '../queries';
import type { PersonReadModel } from '../read-models';

@Injectable()
export class ListPersonsUseCase {
  constructor(
    @Inject(AUTHORIZER_TOKEN)
    private readonly authorizer: IAuthorizer,

    @Inject(PERSON_QUERY_TOKEN)
    private readonly personQuery: IPersonQuery,
  ) {}

  async execute(
    actorUserId: string,
    pagination: PaginationVO,
    filters: ListPersonsQuery = {},
  ): Promise<[PersonReadModel[], number]> {
    await this.authorizer.assertAuthorized(actorUserId, ['persons.read']);

    return this.personQuery.findAll(pagination, filters);
  }
}
