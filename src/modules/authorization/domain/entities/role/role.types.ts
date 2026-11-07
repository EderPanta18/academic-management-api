// src/modules/authorization/domain/entities/role/role.types.ts

export type RoleProps = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isSystem: boolean;
};

export type CreateRoleProps = {
  id: string;
  code: string;
  name: string;
  description: string | null;
};

export type UpdateRoleProps = {
  name?: string;
  description?: string | null;
};
