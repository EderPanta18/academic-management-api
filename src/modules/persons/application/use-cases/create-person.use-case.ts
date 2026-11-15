import { AUTHORIZER_TOKEN, type IAuthorizer } from '@authorization';
import {
  AUDIT_WRITER_TOKEN,
  type IAuditWriter,
  ID_GENERATOR_TOKEN,
  type IIdGenerator,
  type ITransactionManager,
  TRANSACTION_MANAGER_TOKEN,
} from '@core/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { Person } from '@persons/domain/entities';
import type { CreatePersonCommand } from '../commands';
import { type IPersonRepository, PERSON_REPOSITORY_TOKEN } from '../ports/out';
import { PersonCreationValidator } from '../validators';

@Injectable()
export class CreatePersonUseCase {
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

  async execute(actorUserId: string, command: CreatePersonCommand): Promise<Person> {
    return this.transactionManager.run(
      async () => {
        await this.authorizer.assertAuthorized(actorUserId, ['persons.create']);

        await this.personCreationValidator.assertCanCreate({
          documentTypeId: command.documentTypeId,
          documentNumber: command.documentNumber,
          email: command.email,
        });

        const person = Person.create({
          id: this.idGenerator.generate(),
          documentTypeId: command.documentTypeId,
          documentNumber: command.documentNumber,
          firstName: command.firstName,
          lastName: command.lastName,
          email: command.email,
          phone: command.phone,
          birthDate: command.birthDate,
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

        return person;
      },
      { isolation: 'SERIALIZABLE', retries: 2 },
    );
  }
}
