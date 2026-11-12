// src/modules/authorization/application/queries/permission.queries.ts

export type ListPermissionsQuery = {
  module?: string;
  isReserved?: boolean;
  search?: string;
};
