import { ACADEMIC_PROGRAM_FINDER_TOKEN, type IAcademicProgramFinder } from '@academic-programs';
import { DOCUMENT_TYPE_FINDER_TOKEN, type IDocumentTypeFinder } from '@identity';
import { Inject, Injectable } from '@nestjs/common';
import type { CreateStudentCommand } from '../commands';
import { STUDENT_IMPORT_COLUMNS } from '../constants';
import {
  StudentImportAcademicProgramCodeNotFoundException,
  StudentImportDocumentTypeCodeNotFoundException,
} from '../exceptions';

@Injectable()
export class StudentImportRowService {
  constructor(
    @Inject(DOCUMENT_TYPE_FINDER_TOKEN)
    private readonly documentTypeFinder: IDocumentTypeFinder,

    @Inject(ACADEMIC_PROGRAM_FINDER_TOKEN)
    private readonly academicProgramFinder: IAcademicProgramFinder,
  ) {}

  async toCommand(raw: Record<string, unknown>): Promise<CreateStudentCommand> {
    const getStr = (key: keyof typeof STUDENT_IMPORT_COLUMNS): string => {
      const val = raw[STUDENT_IMPORT_COLUMNS[key]];

      return val !== undefined && val !== null ? String(val).trim() : '';
    };

    const getNullableStr = (key: keyof typeof STUDENT_IMPORT_COLUMNS): string | null => {
      const val = getStr(key);

      return val === '' ? null : val;
    };

    const documentTypeCode = getStr('DOCUMENT_TYPE_CODE');
    const academicProgramCode = getStr('ACADEMIC_PROGRAM_CODE');
    const birthDateStr = getNullableStr('BIRTH_DATE');

    const documentTypeId = await this.documentTypeFinder.findIdByCode(documentTypeCode);

    if (!documentTypeId) throw new StudentImportDocumentTypeCodeNotFoundException(documentTypeCode);

    const academicProgramId = await this.academicProgramFinder.findIdByCode(academicProgramCode);

    if (!academicProgramId)
      throw new StudentImportAcademicProgramCodeNotFoundException(academicProgramCode);

    return {
      documentTypeId,
      documentNumber: getStr('DOCUMENT_NUMBER'),
      firstName: getStr('FIRST_NAME'),
      lastName: getStr('LAST_NAME'),
      email: getNullableStr('EMAIL'),
      phone: getNullableStr('PHONE'),
      birthDate: birthDateStr ? new Date(birthDateStr) : null,
      academicProgramId,
      code: getStr('CODE'),
      institutionalEmail: getNullableStr('INSTITUTIONAL_EMAIL'),
      admissionPeriod: getNullableStr('ADMISSION_PERIOD'),
      status: null,
    };
  }
}
