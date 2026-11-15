// src/modules/authorization/application/use-cases/list-role-users.use-case.ts

import type { PaginationVO } from '@core/pagination';
import { Inject, Injectable } from '@nestjs/common';
import { RoleNotFoundException } from '../exceptions';
import { AUTHORIZER_TOKEN, type IAuthorizer, type IRoleQuery, ROLE_QUERY_TOKEN } from '../ports';
import type { RoleUserReadModel } from '../read-models';

@Injectable()
export class ListRoleUsersUseCase {
  constructor(
    @Inject(AUTHORIZER_TOKEN)
    private readonly authorizer: IAuthorizer,

    @Inject(ROLE_QUERY_TOKEN)
    private readonly roleQuery: IRoleQuery,
  ) {}

  async execute(
    actorUserId: string,
    roleId: string,
    pagination: PaginationVO,
  ): Promise<[RoleUserReadModel[], number]> {
    await this.authorizer.assertAuthorized(actorUserId, ['role-grants.read']);

    const role = await this.roleQuery.find(roleId);

    if (!role) throw new RoleNotFoundException(roleId);

    return this.roleQuery.findRoleUsers(roleId, pagination);
  }
}
