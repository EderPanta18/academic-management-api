// src/modules/users/domain/entities/user/user.entity.ts

import { UserStatus } from './user.enums';
import {
  UserAlreadyInStatusException,
  UserAlreadyLinkedToPersonException,
} from './user.exceptions';
import type { CreateUserProps, UserProps } from './user.types';

const DEFAULTS = {
  mustChangePassword: false,
  status: UserStatus.ACTIVE,
} as const;

export class User {
  readonly id: string;
  readonly personId: string | null;
  readonly email: string;
  readonly passwordHash: string;
  readonly mustChangePassword: boolean;
  readonly status: UserStatus;

  private constructor(props: UserProps) {
    this.id = props.id;
    this.personId = props.personId;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.mustChangePassword = props.mustChangePassword;
    this.status = props.status;

    Object.freeze(this);
  }

  static reconstitute(props: UserProps): User {
    return new User(props);
  }

  static create(props: CreateUserProps): User {
    return new User({
      ...props,
      mustChangePassword: DEFAULTS.mustChangePassword,
      status: DEFAULTS.status,
    });
  }

  linkPerson(personId: string): User {
    if (this.personId !== null) throw new UserAlreadyLinkedToPersonException(this.id);

    return new User({
      ...this,
      personId,
    });
  }

  changeStatus(status: UserStatus): User {
    if (this.status === status) throw new UserAlreadyInStatusException(this.id, status);

    return new User({
      ...this,
      status,
    });
  }

  changePasswordHash(passwordHash: string): User {
    return new User({
      ...this,
      passwordHash,
      mustChangePassword: false,
    });
  }

  resetPasswordHash(passwordHash: string): User {
    return new User({
      ...this,
      passwordHash,
      mustChangePassword: true,
    });
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  isInactive(): boolean {
    return this.status === UserStatus.INACTIVE;
  }

  isBlocked(): boolean {
    return this.status === UserStatus.BLOCKED;
  }
}
