// src/core/contracts/id-generator.contract.ts

export const ID_GENERATOR_TOKEN = Symbol('ID_GENERATOR');

export interface IdGenerator {
  generate(): string;
}
