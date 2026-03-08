// modules/students/presentation/controllers/students.controller.ts

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PaginationVO } from '@shared/domain/value-objects';
import { BULK_IMPORT } from '@shared/application/constants';
import { PaginatedResultDto } from '@shared/application/dtos';
import { SWAGGER_TAGS } from '@shared/presentation/constants';
import { ApiPaginatedResponse } from '@shared/presentation/decorators';
import {
  CreateStudentUseCase,
  ListStudentsUseCase,
  GetStudentByIdUseCase,
  BulkImportStudentsUseCase,
} from '@students/application/use-cases';
import {
  CreateStudentCommand,
  BulkImportStudentsCommand,
} from '@students/application/commands';
import { ListStudentsQuery } from '@students/application/queries';
import { STUDENT_ROUTES } from '../constants';
import {
  ApiCreateStudent,
  ApiListStudents,
  ApiGetStudentById,
  ApiBulkImportStudents,
} from '../decorators';
import { FileParseInterceptor, type ParsedImportData } from '../interceptors';
import {
  CreateStudentDto,
  ListStudentsQueryDto,
  StudentResponseDto,
  BulkImportResultResponseDto,
} from '../dtos';
import { StudentHttpMapper, StudentImportHttpMapper } from '../mappers';

@ApiTags(SWAGGER_TAGS.STUDENTS)
@Controller(STUDENT_ROUTES.BASE)
export class StudentsController {
  constructor(
    private readonly createUseCase: CreateStudentUseCase,
    private readonly getByIdUseCase: GetStudentByIdUseCase,
    private readonly listUseCase: ListStudentsUseCase,
    private readonly bulkImportUseCase: BulkImportStudentsUseCase,
  ) {}

  @Post(STUDENT_ROUTES.CREATE)
  @ApiCreateStudent()
  async create(@Body() dto: CreateStudentDto): Promise<StudentResponseDto> {
    const command = new CreateStudentCommand(dto);
    const student = await this.createUseCase.execute(command);
    return StudentHttpMapper.toResponseFromCreate(student, command);
  }

  @Get(STUDENT_ROUTES.LIST)
  @ApiListStudents()
  @ApiPaginatedResponse()
  async list(
    @Query() queryDto: ListStudentsQueryDto,
  ): Promise<PaginatedResultDto<StudentResponseDto>> {
    const pagination = new PaginationVO(queryDto.page, queryDto.pageSize);
    const query = queryDto.careerId
      ? new ListStudentsQuery({ careerId: queryDto.careerId })
      : undefined;

    const result = await this.listUseCase.execute(pagination, query);
    return StudentHttpMapper.toPaginatedResponse(result, pagination);
  }

  @Get(STUDENT_ROUTES.GET_BY_ID)
  @ApiGetStudentById()
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StudentResponseDto> {
    const student = await this.getByIdUseCase.execute(id);
    return StudentHttpMapper.toResponse(student);
  }

  @Post(STUDENT_ROUTES.BULK_IMPORT)
  @ApiBulkImportStudents()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: BULK_IMPORT.MAX_FILE_SIZE_MB * 1024 * 1024 },
    }),
    FileParseInterceptor,
  )
  async bulkImport(
    @Req() req: Request & { importData: ParsedImportData },
  ): Promise<BulkImportResultResponseDto> {
    const { validRows, preErrors, totalInFile } = req.importData;
    const result = await this.bulkImportUseCase.execute(
      new BulkImportStudentsCommand({ validRows, preErrors, totalInFile }),
    );
    return StudentImportHttpMapper.toResponse(result);
  }
}
