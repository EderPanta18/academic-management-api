// src/modules/authorization/domain/models/permission.model.ts

export type Permission = Readonly<{
  id: string;
  code: string;
  name: string;
  description: string | null;
  module: string;
  isReserved: boolean;
}>;
