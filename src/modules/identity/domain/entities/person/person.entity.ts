import { PERSON } from '@identity/domain/constants';
import type { CreatePersonProps, PersonProps } from './person.types';
import {
  InvalidPersonDocumentNumberFormatException,
  InvalidPersonDocumentNumberLengthException,
  InvalidPersonEmailFormatException,
  InvalidPersonEmailLengthException,
  InvalidPersonFirstNameLengthException,
  InvalidPersonLastNameLengthException,
  InvalidPersonPhoneLengthException,
} from './person-validation.errors';

export class Person {
  readonly id: string;
  readonly documentTypeId: string;
  readonly documentNumber: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string | null;
  readonly birthDate: Date | null;

  private constructor(props: PersonProps) {
    Person.ensureValidDocumentNumber(props.documentNumber);
    Person.ensureValidFirstName(props.firstName);
    Person.ensureValidLastName(props.lastName);
    Person.ensureValidEmail(props.email);
    Person.ensureValidPhone(props.phone);

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
    return new Person({
      ...props,
      phone: props.phone ?? null,
      birthDate: props.birthDate ?? null,
    });
  }

  private static ensureValidDocumentNumber(documentNumber: string): void {
    const { pattern, length } = PERSON.documentNumber;

    if (documentNumber.length < length.min || documentNumber.length > length.max)
      throw new InvalidPersonDocumentNumberLengthException(documentNumber, length.min, length.max);

    if (!pattern.test(documentNumber))
      throw new InvalidPersonDocumentNumberFormatException(documentNumber);
  }

  private static ensureValidFirstName(firstName: string): void {
    const { length } = PERSON.firstName;

    if (firstName.length < length.min || firstName.length > length.max)
      throw new InvalidPersonFirstNameLengthException(firstName, length.min, length.max);
  }

  private static ensureValidLastName(lastName: string): void {
    const { length } = PERSON.lastName;

    if (lastName.length < length.min || lastName.length > length.max)
      throw new InvalidPersonLastNameLengthException(lastName, length.min, length.max);
  }

  private static ensureValidEmail(email: string): void {
    const { pattern, length } = PERSON.email;

    if (email.length < length.min || email.length > length.max)
      throw new InvalidPersonEmailLengthException(email, length.min, length.max);

    if (!pattern.test(email)) throw new InvalidPersonEmailFormatException(email);
  }

  private static ensureValidPhone(phone: string | null): void {
    if (phone === null) return;

    const { length } = PERSON.phone;

    if (phone.length > length.max) throw new InvalidPersonPhoneLengthException(phone, length.max);
  }
}
