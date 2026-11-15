// src/modules/authorization/entrypoints/http/controllers/role-grant.controller.ts

import { GrantRoleUseCase, RevokeRoleUseCase } from '@authorization/application/use-cases';
import { Body, Controller, Delete, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { SwaggerTag } from '@platform/http';
import { CurrentUserId } from '@shared/decorators';
import { ApiGrantRole, ApiRevokeRole } from '../decorators';
import { GrantRoleRequestDto } from '../dtos';

const ROLE_GRANT_ROUTES = {
  ROOT: 'users/:userId/roles',
  BY_ROLE_ID: ':roleId',
} as const;

export const ROLE_GRANT_SWAGGER_TAG = {
  name: 'role-grants',
  description: 'Endpoints relacionados con la asignación y revocación de roles a usuarios.',
} as const satisfies SwaggerTag;

@ApiTags(ROLE_GRANT_SWAGGER_TAG.name)
@Controller(ROLE_GRANT_ROUTES.ROOT)
export class RoleGrantController {
  constructor(
    private readonly grantRoleUseCase: GrantRoleUseCase,
    private readonly revokeRoleUseCase: RevokeRoleUseCase,
  ) {}

  @Post()
  @ApiGrantRole()
  async grant(
    @CurrentUserId() actorUserId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: GrantRoleRequestDto,
  ): Promise<void> {
    await this.grantRoleUseCase.execute(actorUserId, userId, dto.roleId);
  }

  @Delete(ROLE_GRANT_ROUTES.BY_ROLE_ID)
  @ApiRevokeRole()
  async revoke(
    @CurrentUserId() actorUserId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('roleId', ParseUUIDPipe) roleId: string,
  ): Promise<void> {
    await this.revokeRoleUseCase.execute(actorUserId, userId, roleId);
  }
}
