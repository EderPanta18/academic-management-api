// src/modules/persons/application/services/person-creator.service.ts

import { AUTHORIZER_TOKEN, type IAuthorizer } from '@authorization';
import {
  AUDIT_WRITER_TOKEN,
  type IAuditWriter,
  ID_GENERATOR_TOKEN,
  type IIdGenerator,
  type ITransactionManager,
  TRANSACTION_MANAGER_TOKEN,
} from '@core/contracts';
import { SystemException } from '@core/exceptions';
import { Inject, Injectable } from '@nestjs/common';
import { Person } from '@persons/domain/entities';
import {
  type IPersonCreator,
  type IPersonRepository,
  PERSON_REPOSITORY_TOKEN,
  type PersonCreationData,
} from '../ports';
import { PersonCreationValidator } from '../validators';

@Injectable()
export class PersonCreatorService implements IPersonCreator {
  constructor(
    @Inject(TRANSACTION_MANAGER_TOKEN)
    private readonly transactionManager: ITransactionManager,

    @Inject(AUDIT_WRITER_TOKEN)
    private readonly auditWriter: IAuditWriter,

    @Inject(AUTHORIZER_TOKEN)
    private readonly authorizer: IAuthorizer,

    @Inject(ID_GENERATOR_TOKEN)
    private readonly idGenerator: IIdGenerator,

    @Inject(PERSON_REPOSITORY_TOKEN)
    private readonly personRepository: IPersonRepository,

    private readonly personCreationValidator: PersonCreationValidator,
  ) {}

  async create(actorUserId: string, data: PersonCreationData): Promise<string> {
    if (!this.transactionManager.isActive())
      throw new SystemException('La creación de una persona requiere una transacción activa.');

    await this.authorizer.assertAuthorized(actorUserId, ['persons.create']);

    await this.personCreationValidator.assertCanCreate({
      documentTypeId: data.documentTypeId,
      documentNumber: data.documentNumber,
      email: data.email,
    });

    const person = Person.create({
      id: this.idGenerator.generate(),
      documentTypeId: data.documentTypeId,
      documentNumber: data.documentNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      birthDate: data.birthDate,
    });

    await this.personRepository.create(person);

    await this.auditWriter.append({
      actorUserId,
      action: 'persons.person.create',
      module: 'persons',
      resourceType: 'Person',
      resourceId: person.id,
      outcome: 'CONFIRMED',
    });

    return person.id;
  }
}
