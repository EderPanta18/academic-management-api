// src/modules/authorization/application/use-cases/get-role.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { RoleNotFoundException } from '../exceptions';
import { AUTHORIZER_TOKEN, type IAuthorizer, type IRoleQuery, ROLE_QUERY_TOKEN } from '../ports';
import type { RoleDetailReadModel } from '../read-models';

@Injectable()
export class GetRoleUseCase {
  constructor(
    @Inject(AUTHORIZER_TOKEN)
    private readonly authorizer: IAuthorizer,

    @Inject(ROLE_QUERY_TOKEN)
    private readonly roleQuery: IRoleQuery,
  ) {}

  async execute(actorUserId: string, roleId: string): Promise<RoleDetailReadModel> {
    await this.authorizer.assertAuthorized(actorUserId, ['roles.read']);

    const role = await this.roleQuery.find(roleId);

    if (!role) throw new RoleNotFoundException(roleId);

    return role;
  }
}
