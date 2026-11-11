// src/modules/authorization/application/commands/role.commands.ts

export type CreateRoleCommand = {
  code: string;
  name: string;
  description: string | null;
  permissionIds: string[];
};

export type UpdateRoleCommand = {
  roleId: string;
  name?: string;
  description?: string | null;
  permissionIds?: string[];
};
