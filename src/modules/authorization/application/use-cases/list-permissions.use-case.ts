// src/modules/authorization/application/use-cases/list-permissions.use-case.ts

import type { PaginationVO } from '@core/pagination';
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
    pagination: PaginationVO,
    query: ListPermissionsQuery = {},
  ): Promise<[PermissionReadModel[], number]> {
    await this.authorizer.assertAuthorized(actorUserId, ['permissions.read']);

    return this.permissionQuery.findAll(pagination, {
      module: query?.module,
      isReserved: query?.isReserved,
      search: query?.search,
    });
  }
}
