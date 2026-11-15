// src/modules/authorization/entrypoints/http/controllers/role.controller.ts

import {
  CreateRoleUseCase,
  GetRoleUseCase,
  ListRolesUseCase,
  ListRoleUsersUseCase,
  UpdateRoleUseCase,
} from '@authorization/application/use-cases';
import { type PaginatedResult, PaginationVO } from '@core/pagination';
import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { SwaggerTag } from '@platform/http';
import { CurrentUserId } from '@shared/decorators';
import { PaginationQueryDto } from '@shared/dtos';
import {
  ApiCreateRole,
  ApiGetRole,
  ApiListRoles,
  ApiListRoleUsers,
  ApiUpdateRole,
} from '../decorators';
import {
  CreateRoleRequestDto,
  ListRolesQueryDto,
  RoleDetailReadModelResponseDto,
  RoleReadModelResponseDto,
  RoleResponseDto,
  RoleUserReadModelResponseDto,
  UpdateRoleRequestDto,
} from '../dtos';
import { RoleRequestMapper, RoleResponseMapper } from '../mappers';

const ROLE_ROUTES = {
  ROOT: 'roles',
  BY_ID: ':id',
  USERS: ':id/users',
} as const;

export const ROLE_SWAGGER_TAG = {
  name: 'roles',
  description: 'Endpoints relacionados con la gestión de roles y sus permisos asociados.',
} as const satisfies SwaggerTag;

@ApiTags(ROLE_SWAGGER_TAG.name)
@Controller(ROLE_ROUTES.ROOT)
export class RoleController {
  constructor(
    private readonly listRolesUseCase: ListRolesUseCase,
    private readonly getRoleUseCase: GetRoleUseCase,
    private readonly listRoleUsersUseCase: ListRoleUsersUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
  ) {}

  @Get()
  @ApiListRoles()
  async list(
    @CurrentUserId() actorUserId: string,
    @Query() queryDto: ListRolesQueryDto,
  ): Promise<PaginatedResult<RoleReadModelResponseDto>> {
    const pagination = PaginationVO.create({
      page: queryDto.page,
      limit: queryDto.limit,
    });

    const query = RoleRequestMapper.toListQuery(queryDto);

    const [items, totalItems] = await this.listRolesUseCase.execute(actorUserId, pagination, query);

    return RoleResponseMapper.toPaginatedResponse(items, pagination, totalItems);
  }

  @Get(ROLE_ROUTES.BY_ID)
  @ApiGetRole()
  async getById(
    @CurrentUserId() actorUserId: string,
    @Param('id', ParseUUIDPipe) roleId: string,
  ): Promise<RoleDetailReadModelResponseDto> {
    const role = await this.getRoleUseCase.execute(actorUserId, roleId);

    return RoleResponseMapper.toDetailReadModelResponse(role);
  }

  @Get(ROLE_ROUTES.USERS)
  @ApiListRoleUsers()
  async listUsers(
    @CurrentUserId() actorUserId: string,
    @Param('id', ParseUUIDPipe) roleId: string,
    @Query() queryDto: PaginationQueryDto,
  ): Promise<PaginatedResult<RoleUserReadModelResponseDto>> {
    const pagination = PaginationVO.create({
      page: queryDto.page,
      limit: queryDto.limit,
    });

    const [items, totalItems] = await this.listRoleUsersUseCase.execute(
      actorUserId,
      roleId,
      pagination,
    );

    return RoleResponseMapper.toPaginatedUsersResponse(items, pagination, totalItems);
  }

  @Post()
  @ApiCreateRole()
  async create(
    @CurrentUserId() actorUserId: string,
    @Body() dto: CreateRoleRequestDto,
  ): Promise<RoleResponseDto> {
    const command = RoleRequestMapper.toCreateCommand(dto);

    const role = await this.createRoleUseCase.execute(actorUserId, command);

    return RoleResponseMapper.toResponse(role);
  }

  @Patch(ROLE_ROUTES.BY_ID)
  @ApiUpdateRole()
  async update(
    @CurrentUserId() actorUserId: string,
    @Param('id', ParseUUIDPipe) roleId: string,
    @Body() dto: UpdateRoleRequestDto,
  ): Promise<RoleResponseDto> {
    const command = RoleRequestMapper.toUpdateCommand(dto);

    const role = await this.updateRoleUseCase.execute(actorUserId, roleId, command);

    return RoleResponseMapper.toResponse(role);
  }
}
