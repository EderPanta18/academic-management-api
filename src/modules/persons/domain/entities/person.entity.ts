// modules/persons/domain/entities/person.entity.ts

import type { PersonProps, CreatePersonProps } from './person.types';

type InternalProps = {
  id?: number;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  birthDate?: Date | null;
};

export class Person {
  readonly id?: number;
  readonly dni: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string | null;
  readonly birthDate: Date | null;

  private constructor(props: InternalProps) {
    this.id = props.id;
    this.dni = props.dni;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.phone = props.phone ?? null;
    this.birthDate = props.birthDate ?? null;
    Object.freeze(this);
  }

  static create(props: CreatePersonProps): Person {
    return new Person(props);
  }

  static reconstitute(props: PersonProps): Person {
    return new Person(props);
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}
