// modules/persons/domain/entities/person/person.entity.ts

import type { CreatePersonProps, PersonProps } from './person.types';

interface PersonInternalProps {
  id?: number;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  birthDate?: Date | null;
}

export class Person {
  readonly id?: number;
  readonly dni: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string | null;
  readonly birthDate: Date | null;

  private constructor(props: PersonInternalProps) {
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
}
