import { FILE_PARSER_TOKEN, type IFileParser } from '@core/contracts';
import { AppException, SystemException, ValidationException } from '@core/exceptions';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ProcessStudentImportCommand } from '@students/application/commands';
import { STUDENT_IMPORT_CHECKPOINT_INTERVAL } from '@students/application/constants';
import { StudentImportNotFoundException } from '@students/application/exceptions';
import {
  type IStudentImportRepository,
  STUDENT_IMPORT_REPOSITORY_TOKEN,
} from '@students/application/ports/out';
import { StudentImportRowService } from '@students/application/services';
import type { StudentImportError } from '@students/domain/entities';
import { CreateStudentUseCase } from '../student';

@Injectable()
export class ProcessStudentImportUseCase {
  private readonly logger = new Logger(ProcessStudentImportUseCase.name);

  constructor(
    @Inject(FILE_PARSER_TOKEN)
    private readonly fileParser: IFileParser,

    @Inject(STUDENT_IMPORT_REPOSITORY_TOKEN)
    private readonly studentImportRepository: IStudentImportRepository,

    private readonly createStudentUseCase: CreateStudentUseCase,
    private readonly rowService: StudentImportRowService,
  ) {}

  async execute(command: ProcessStudentImportCommand): Promise<void> {
    const studentImport = await this.studentImportRepository.find(command.importId);

    if (!studentImport) throw new StudentImportNotFoundException(command.importId);

    // Cambiar estado a PROCESSING
    const processingImport = studentImport.markAsProcessing();
    await this.studentImportRepository.update(processingImport);

    let currentImportState = processingImport;

    try {
      // Obtener el archivo y parsearlo
      const fileContent = await this.studentImportRepository.findFileContent(command.importId);

      if (!fileContent) throw new SystemException('No se encontró el archivo binario.');

      const rawRows = this.fileParser.parse(fileContent, studentImport.fileExtension);

      // REANUDACIÓN: Si es un reintento, empezamos desde donde quedó
      const startIndex = studentImport.processedRows;

      let accepted = studentImport.acceptedRows;
      let rejected = studentImport.rejectedRows;
      let duplicated = studentImport.duplicatedRows;
      let observed = studentImport.observedRows;

      // Recuperamos los errores de un intento anterior (si los hay)
      const errorsList: StudentImportError[] = studentImport.errors
        ? [...studentImport.errors]
        : [];

      // Procesar cada fila
      for (let i = startIndex; i < rawRows.length; i++) {
        const rowNumber = i + 2; // Fila 1 es cabecera
        const raw = rawRows[i];

        try {
          const studentCommand = await this.rowService.toCommand(raw);
          await this.createStudentUseCase.execute(studentCommand);
          accepted++;
        } catch (error) {
          const { type, reasons } = this.classifyError(error);

          if (type === 'DUPLICATED') duplicated++;
          else if (type === 'OBSERVED') observed++;
          else rejected++;

          errorsList.push({ row: rowNumber, reasons });
        }

        // CHECKPOINT: Guardar progreso cada 50 filas o al llegar al final
        if ((i + 1) % STUDENT_IMPORT_CHECKPOINT_INTERVAL === 0 || i === rawRows.length - 1) {
          currentImportState = currentImportState.withProgress({
            processedRows: i + 1,
            acceptedRows: accepted,
            rejectedRows: rejected,
            duplicatedRows: duplicated,
            observedRows: observed,
            errors: errorsList,
          });

          await this.studentImportRepository.update(currentImportState);
        }
      }

      // Finalizar oficialmente
      const completedImport = currentImportState.markAsCompleted({
        totalRows: rawRows.length,
        processedRows: rawRows.length,
        acceptedRows: accepted,
        rejectedRows: rejected,
        duplicatedRows: duplicated,
        observedRows: observed,
        errors: errorsList,
      });

      await this.studentImportRepository.update(completedImport);
    } catch (error) {
      // Error catastrófico: guardamos el motivo real del fallo
      this.logger.error(`Error crítico procesando importación ${command.importId}`, error);

      const failureReason = error instanceof Error ? error.message : 'Error crítico desconocido.';
      const failedImport = currentImportState.markAsFailed(failureReason);

      await this.studentImportRepository.update(failedImport);

      // Relanzamos para que PgBoss reintente
      throw error;
    }
  }

  private classifyError(error: unknown): {
    type: 'DUPLICATED' | 'OBSERVED' | 'REJECTED';
    reasons: string[];
  } {
    // Validaciones de entrada (siempre rechazadas, con motivos por campo)
    if (error instanceof ValidationException)
      return {
        type: 'REJECTED',
        reasons: error.fieldErrors?.flatMap((f) => f.messages) || [error.message],
      };

    // Cualquier excepción de la app: clasificamos por convención de errorCode
    if (error instanceof AppException) {
      if (error.errorCode.includes('_UNIQUENESS_'))
        return { type: 'DUPLICATED', reasons: [error.message] };

      if (error.errorCode.includes('_RELATION_'))
        return { type: 'OBSERVED', reasons: [error.message] };

      // _VALIDATION_, _STATE_, _QUERY_, etc. → rechazadas
      return { type: 'REJECTED', reasons: [error.message] };
    }

    // 3. Fallback
    if (error instanceof Error) return { type: 'REJECTED', reasons: [error.message] };

    return { type: 'REJECTED', reasons: ['Error desconocido al procesar la fila.'] };
  }
}
