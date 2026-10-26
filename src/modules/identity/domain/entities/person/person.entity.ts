// src/modules/identity/domain/entities/person/person.entity.ts

import type { CreatePersonProps, PersonProps } from './person.types';

export class Person {
  readonly id: string;
  readonly documentTypeId: string;
  readonly documentNumber: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string | null;
  readonly phone: string | null;
  readonly birthDate: Date | null;

  private constructor(props: PersonProps) {
    this.id = props.id;
    this.documentTypeId = props.documentTypeId;
    this.documentNumber = props.documentNumber;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.phone = props.phone;
    this.birthDate = props.birthDate;

    Object.freeze(this);
  }

  static reconstitute(props: PersonProps): Person {
    return new Person(props);
  }

  static create(props: CreatePersonProps): Person {
    return new Person(props);
  }
}
