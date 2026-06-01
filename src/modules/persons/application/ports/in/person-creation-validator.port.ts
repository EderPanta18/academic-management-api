// modules/persons/application/ports/in/person-creation-validator.port.ts

import type {
  PersonCreationInput,
  PersonCreationResult
} from "@persons/application/contracts";

export const PERSON_CREATION_VALIDATOR_PORT = Symbol(
  "PERSON_CREATION_VALIDATOR_PORT"
);

export interface IPersonCreationValidator {
  validate(input: PersonCreationInput): Promise<PersonCreationResult>;
}
