// src/modules/authorization/authorization.module.ts

import { Module } from '@nestjs/common';
import { DatabaseModule } from '@platform/database';
import { IdGeneratorModule } from '@platform/id-generator';
import {
  ACCOUNT_ROLE_INSPECTOR_TOKEN,
  AUTHORIZATION_STATE_TOKEN,
  AUTHORIZER_TOKEN,
  PERMISSION_QUERY_TOKEN,
  PERMISSION_REPOSITORY_TOKEN,
  ROLE_GRANT_REPOSITORY_TOKEN,
  ROLE_GRANTER_TOKEN,
  ROLE_QUERY_TOKEN,
  ROLE_REPOSITORY_TOKEN,
} from './application/ports';
import {
  AccountRoleInspectorService,
  AuthorizerService,
  RoleGranterService,
} from './application/services';
import {
  CreateRoleUseCase,
  GetRoleUseCase,
  GrantRoleUseCase,
  ListPermissionsUseCase,
  ListRolesUseCase,
  ListRoleUsersUseCase,
  RevokeRoleUseCase,
  UpdateRoleUseCase,
} from './application/use-cases';
import { RoleAssignmentValidator } from './application/validators';
import { PermissionController, RoleController, RoleGrantController } from './entrypoints/http';
import {
  AuthorizationStateAdapter,
  PermissionQueryAdapter,
  PermissionRepositoryAdapter,
  RoleGrantRepositoryAdapter,
  RoleQueryAdapter,
  RoleRepositoryAdapter,
} from './infrastructure/persistence';

@Module({
  imports: [DatabaseModule, IdGeneratorModule],

  controllers: [RoleController, PermissionController, RoleGrantController],

  providers: [
    // Casos de uso
    CreateRoleUseCase,
    UpdateRoleUseCase,
    GrantRoleUseCase,
    RevokeRoleUseCase,
    GetRoleUseCase,
    ListRolesUseCase,
    ListRoleUsersUseCase,
    ListPermissionsUseCase,

    // Validadores
    RoleAssignmentValidator,

    // Puertos de aplicación
    {
      provide: AUTHORIZER_TOKEN,
      useExisting: AuthorizerService,
    },
    {
      provide: ACCOUNT_ROLE_INSPECTOR_TOKEN,
      useExisting: AccountRoleInspectorService,
    },
    {
      provide: ROLE_GRANTER_TOKEN,
      useExisting: RoleGranterService,
    },

    // Repositorios
    {
      provide: ROLE_REPOSITORY_TOKEN,
      useClass: RoleRepositoryAdapter,
    },
    {
      provide: PERMISSION_REPOSITORY_TOKEN,
      useClass: PermissionRepositoryAdapter,
    },
    {
      provide: ROLE_GRANT_REPOSITORY_TOKEN,
      useClass: RoleGrantRepositoryAdapter,
    },

    // Consultas
    {
      provide: ROLE_QUERY_TOKEN,
      useClass: RoleQueryAdapter,
    },
    {
      provide: PERMISSION_QUERY_TOKEN,
      useClass: PermissionQueryAdapter,
    },

    // Estado de autorización
    {
      provide: AUTHORIZATION_STATE_TOKEN,
      useClass: AuthorizationStateAdapter,
    },
  ],

  exports: [AUTHORIZER_TOKEN, ACCOUNT_ROLE_INSPECTOR_TOKEN, ROLE_GRANTER_TOKEN],
})
export class AuthorizationModule {}
