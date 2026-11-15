// src/modules/persons/domain/entities/person/person.entity.ts

import type { CreatePersonProps, PersonProps, UpdatePersonProps } from './person.types';

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

  update(props: UpdatePersonProps): Person {
    return new Person({
      id: this.id,
      documentTypeId: this.documentTypeId,
      documentNumber: this.documentNumber,
      firstName: props.firstName ?? this.firstName,
      lastName: props.lastName ?? this.lastName,
      email: props.email !== undefined ? props.email : this.email,
      phone: props.phone !== undefined ? props.phone : this.phone,
      birthDate: props.birthDate !== undefined ? props.birthDate : this.birthDate,
    });
  }
}
