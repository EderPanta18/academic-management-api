// src/modules/authorization/application/use-cases/list-permissions.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import {
  AUTHORIZER_TOKEN,
  type IAuthorizer,
  type IPermissionQuery,
  PERMISSION_QUERY_TOKEN,
} from '../ports';
import type { ListPermissionsQuery } from '../queries';
import type { PermissionReadModel } from '../read-models';

@Injectable()
export class ListPermissionsUseCase {
  constructor(
    @Inject(AUTHORIZER_TOKEN)
    private readonly authorizer: IAuthorizer,

    @Inject(PERMISSION_QUERY_TOKEN)
    private readonly permissionQuery: IPermissionQuery,
  ) {}

  async execute(
    actorUserId: string,
    query: ListPermissionsQuery = {},
  ): Promise<PermissionReadModel[]> {
    await this.authorizer.assertAuthorized(actorUserId, ['permissions.read']);

    return this.permissionQuery.findAll({
      module: query?.module,
      isReserved: query?.isReserved,
      search: query?.search,
    });
  }
}
