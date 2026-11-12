// src/modules/authorization/domain/entities/role/role.entity.ts

import { INSTITUTIONAL_ROLES } from '@authorization/domain/constants';
import { ProtectedRoleException, ReservedRoleCodeException } from './role.exceptions';
import type { CreateRoleProps, RoleProps, UpdateRoleProps } from './role.types';

const DEFAULTS = {
  isSystem: false,
};

export class Role {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description: string | null;
  readonly isSystem: boolean;

  private constructor(props: RoleProps) {
    this.id = props.id;
    this.code = props.code;
    this.name = props.name;
    this.description = props.description;
    this.isSystem = props.isSystem;

    Object.freeze(this);
  }

  static reconstitute(props: RoleProps): Role {
    return new Role(props);
  }

  static create(props: CreateRoleProps): Role {
    const isReserved = Object.values(INSTITUTIONAL_ROLES).some((code) => code === props.code);

    if (isReserved) throw new ReservedRoleCodeException(props.code);

    return new Role({
      ...props,
      isSystem: DEFAULTS.isSystem,
    });
  }

  update(props: UpdateRoleProps): Role {
    if (this.isSystem) throw new ProtectedRoleException();

    return new Role({
      ...this,
      name: props.name ?? this.name,
      description: props.description === undefined ? this.description : props.description,
    });
  }

  isCustom(): boolean {
    return !this.isSystem;
  }
}
