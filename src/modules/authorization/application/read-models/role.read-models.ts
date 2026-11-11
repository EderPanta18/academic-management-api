// src/modules/authorization/application/read-models/role.read-models.ts

export type RoleReadModel = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isSystem: boolean;
};

export type RoleDetailReadModel = RoleReadModel & {
  permissionIds: string[];
};

export type RoleUserReadModel = {
  userId: string;
  assignedAt: Date;
};