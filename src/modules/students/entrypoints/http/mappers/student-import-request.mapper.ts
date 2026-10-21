import * as path from 'node:path';
import type { StartStudentImportCommand } from '@students/application/commands';
import type { ListStudentImportsQuery } from '@students/application/queries';
import type { ListStudentImportsQueryDto } from '../dtos';

export class StudentImportRequestMapper {
  static toListQuery(dto: ListStudentImportsQueryDto): ListStudentImportsQuery {
    return {
      status: dto.status,
      createdByUserId: dto.createdByUserId,
    };
  }

  static toStartCommand(file: Express.Multer.File, userId: string): StartStudentImportCommand {
    const fileExtension = path.extname(file.originalname).toLowerCase();

    return {
      fileName: file.originalname,
      fileExtension,
      fileSize: file.size,
      fileMimeType: file.mimetype,
      fileContent: file.buffer,
      createdByUserId: userId,
    };
  }
}
