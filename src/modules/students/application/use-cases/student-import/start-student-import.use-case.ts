import { createHash } from 'node:crypto';
import {
  FILE_PARSER_TOKEN,
  ID_GENERATOR_TOKEN,
  IFileParser,
  IIdGenerator,
  IJobQueue,
  JOB_QUEUE_TOKEN,
} from '@core/contracts';
import { Inject, Injectable } from '@nestjs/common';
import type { StartStudentImportCommand } from '@students/application/commands';
import { STUDENT_IMPORT_JOBS } from '@students/application/constants';
import {
  StudentImportFileAlreadyExistsException,
  StudentImportUserNotFoundException,
} from '@students/application/exceptions';
import {
  type IStudentImportRepository,
  type IUserExistenceChecker,
  STUDENT_IMPORT_REPOSITORY_TOKEN,
  USER_EXISTENCE_CHECKER_TOKEN,
} from '@students/application/ports/out';
import { StudentImport } from '@students/domain/entities';

@Injectable()
export class StartStudentImportUseCase {
  constructor(
    @Inject(ID_GENERATOR_TOKEN)
    private readonly idGenerator: IIdGenerator,

    @Inject(FILE_PARSER_TOKEN)
    private readonly fileParser: IFileParser,

    @Inject(JOB_QUEUE_TOKEN)
    private readonly jobQueue: IJobQueue,

    // TODO: Cuando se cree el módulo 'users', esto se cambiará por el puerto oficial de ese módulo.
    @Inject(USER_EXISTENCE_CHECKER_TOKEN)
    private readonly userExistenceChecker: IUserExistenceChecker,

    @Inject(STUDENT_IMPORT_REPOSITORY_TOKEN)
    private readonly studentImportRepository: IStudentImportRepository,
  ) {}

  async execute(command: StartStudentImportCommand): Promise<{ importId: string }> {
    const userExists = await this.userExistenceChecker.exists(command.createdByUserId);

    if (!userExists) throw new StudentImportUserNotFoundException(command.createdByUserId);

    // Parsear el archivo (para contar filas)
    const rawRows = this.fileParser.parse(command.fileContent, command.fileExtension);

    // Calcular hash del archivo
    const fileHash = createHash('sha256').update(command.fileContent).digest('hex');

    // Verificar duplicado (mismo usuario, mismo hash)
    const fileAlreadyExists = await this.studentImportRepository.existsByHashAndUser(
      fileHash,
      command.createdByUserId,
    );

    if (fileAlreadyExists)
      throw new StudentImportFileAlreadyExistsException(command.fileName, command.createdByUserId);

    const importId = this.idGenerator.generate();

    const studentImport = StudentImport.create({
      id: importId,
      fileName: command.fileName,
      fileExtension: command.fileExtension,
      fileHash: fileHash,
      fileSize: command.fileSize,
      fileMimeType: command.fileMimeType,
      totalRows: rawRows.length,
      createdByUserId: command.createdByUserId,
    });

    // Guardar en BD y encolar el Job
    await this.studentImportRepository.create(studentImport, command.fileContent);
    await this.jobQueue.enqueue(STUDENT_IMPORT_JOBS.PROCESS, { importId }, { attempts: 3 });

    return { importId };
  }
}
