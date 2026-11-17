// src/modules/users/domain/entities/user/user.types.ts

import type { UserStatus } from './user.enums';

export type UserProps = {
  id: string;
  personId: string | null;
  email: string;
  passwordHash: string;
  mustChangePassword: boolean;
  status: UserStatus;
};

export type CreateUserProps = {
  id: string;
  personId: string | null;
  email: string;
  passwordHash: string;
};
