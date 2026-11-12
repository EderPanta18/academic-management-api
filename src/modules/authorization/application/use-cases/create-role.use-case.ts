// src/modules/authorization/application/use-cases/create-role.use-case.ts

import { Role } from '@authorization/domain/entities';
import { RolePolicy } from '@authorization/domain/policies';
import {
  AUDIT_WRITER_TOKEN,
  type IAuditWriter,
  ID_GENERATOR_TOKEN,
  type IIdGenerator,
  type ITransactionManager,
  TRANSACTION_MANAGER_TOKEN,
} from '@core/contracts';
import { Inject, Injectable } from '@nestjs/common';
import type { CreateRoleCommand } from '../commands';
import {
  RoleCodeAlreadyExistsException,
  RolePermissionNotAssignableException,
  RolePermissionNotFoundException,
} from '../exceptions';
import {
  AUTHORIZER_TOKEN,
  type IAuthorizer,
  type IPermissionRepository,
  type IRoleRepository,
  PERMISSION_REPOSITORY_TOKEN,
  ROLE_REPOSITORY_TOKEN,
} from '../ports';

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(ID_GENERATOR_TOKEN)
    private readonly idGenerator: IIdGenerator,

    @Inject(TRANSACTION_MANAGER_TOKEN)
    private readonly transactionManager: ITransactionManager,

    @Inject(AUDIT_WRITER_TOKEN)
    private readonly auditWriter: IAuditWriter,

    @Inject(AUTHORIZER_TOKEN)
    private readonly authorizer: IAuthorizer,

    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly roleRepository: IRoleRepository,

    @Inject(PERMISSION_REPOSITORY_TOKEN)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(actorUserId: string, command: CreateRoleCommand): Promise<Role> {
    return this.transactionManager.run(async () => {
      await this.authorizer.assertAuthorized(actorUserId, ['roles.create']);

      if (await this.roleRepository.existsByCode(command.code))
        throw new RoleCodeAlreadyExistsException(command.code);

      const permissionIds = [...new Set(command.permissionIds)];

      const permissions = await this.permissionRepository.findManyByIds(permissionIds);

      const foundIds = new Set(permissions.map((permission) => permission.id));
      const missingIds = permissionIds.filter((id) => !foundIds.has(id));

      if (missingIds.length > 0) throw new RolePermissionNotFoundException(missingIds);

      const role = Role.create({
        id: this.idGenerator.generate(),
        code: command.code,
        name: command.name,
        description: command.description,
      });

      if (!RolePolicy.canConfigurePermissions(role, permissionIds, permissions)) {
        const reservedIds = permissions
          .filter((permission) => permission.isReserved)
          .map((permission) => permission.id);

        throw new RolePermissionNotAssignableException(reservedIds);
      }

      const createdRole = await this.roleRepository.create(role, permissionIds);

      await this.auditWriter.append({
        actorUserId,
        action: 'authorization.role.create',
        resourceType: 'Role',
        resourceId: createdRole.id,
        module: 'authorization',
        outcome: 'CONFIRMED',
      });

      return createdRole;
    });
  }
}
