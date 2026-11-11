// src/modules/authorization/application/read-models/permission.read-models.ts

export type PermissionReadModel = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  module: string;
  isReserved: boolean;
};
