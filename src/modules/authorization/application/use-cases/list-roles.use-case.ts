// src/modules/authorization/application/use-cases/list-roles.use-case.ts

import type { PaginationVO } from '@core/pagination';
import { Inject, Injectable } from '@nestjs/common';
import { AUTHORIZER_TOKEN, type IAuthorizer, type IRoleQuery, ROLE_QUERY_TOKEN } from '../ports';
import type { ListRolesQuery } from '../queries';
import type { RoleReadModel } from '../read-models';

@Injectable()
export class ListRolesUseCase {
  constructor(
    @Inject(AUTHORIZER_TOKEN)
    private readonly authorizer: IAuthorizer,

    @Inject(ROLE_QUERY_TOKEN)
    private readonly roleQuery: IRoleQuery,
  ) {}

  async execute(
    actorUserId: string,
    pagination: PaginationVO,
    filters?: ListRolesQuery,
  ): Promise<[RoleReadModel[], number]> {
    await this.authorizer.assertAuthorized(actorUserId, ['roles.read']);

    return this.roleQuery.findAll(pagination, {
      isSystem: filters?.isSystem,
      search: filters?.search,
    });
  }
}
